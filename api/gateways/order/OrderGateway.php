<?php

class OrderGateway {

  private PDO $conn;
  private OrderItemGateway $orderItem;
  private UserAddressGateway $address;
  private Utils $utils;

  public function __construct(PDO $db_conn) {
    $this->conn = $db_conn;
    $this->orderItem = new OrderItemGateway($db_conn);
    $this->address = new UserAddressGateway($db_conn);
    $this->utils = new Utils;
  }

  public function getAll(?int $limit=null, ?int $offset=null): array {
    $sql = "SELECT * FROM orders";

    if($limit !== null && $offset !== null) {
      $sql .= " LIMIT :limit OFFSET :offset";
    } elseif($limit !== null) {
      $sql .= " LIMIT :limit";
    } elseif($offset !== null) {
      $sql .= " LIMIT 18446744073709551615 OFFSET :offset";
    }

    $stmt = $this->conn->prepare($sql);
    if($limit !== null) $stmt->bindValue(":limit", $limit, PDO::PARAM_INT);
    if($offset !== null) $stmt->bindValue(":offset", $offset, PDO::PARAM_INT);
    $stmt->execute();

    $data = [];
    while($order = $stmt->fetch(PDO::FETCH_ASSOC)) {
      $order["items"] = $this->orderItem->getByOrderId($order["id"]);
      $order["delivery_address"] = $this->address->get($order["delivery_address_id"]);
      unset($order["delivery_address_id"]);
      unset($order["delivery_address"]["user_id"]);
      unset($order["delivery_address"]["is_default"]);
      $data[] = $order;
    }

    return $data;
  }

  public function get(int $id): array | false {
    $sql = "SELECT * FROM orders WHERE id = :id";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":id", $id, PDO::PARAM_INT);
    $stmt->execute();

    if($order = $stmt->fetch(PDO::FETCH_ASSOC)) {
      $order["items"] = $this->orderItem->getByOrderId($order["id"]);
      $order["delivery_address"] = $this->address->get($order["delivery_address_id"]);
      unset($order["delivery_address_id"]);
      unset($order["delivery_address"]["user_id"]);
      unset($order["delivery_address"]["is_default"]);

      return $order;
    }

    return false;
  }

  public function create(array $data): array | false {
    $this->conn->beginTransaction();

    try {
      $order_date = new DateTime('now', new DateTimeZone('UTC'));
      $estimate_received_date = $data["estimate_received_date"] ?? null;

      if($estimate_received_date && new DateTime($estimate_received_date) <= $order_date) { // Ensure estimate_received_date > order_date
        throw new Exception("estimate_received_date cannot be earlier than or equal to order_date", 409);
      }

      $usr_id = $data["user_id"];
      $delivery_address_id =  $data["delivery_address_id"];

      if(!$this->address->isUserAddress($usr_id, $delivery_address_id)) { // Check user owns the address
        throw new Exception("User doesn't own this address", 409);
      }

      $total_cents = $this->calculateTotalCents($data["items"]);

      $sql = "INSERT INTO orders (
        user_id,
        total_cents,
        delivery_address_id,
        delivery_state_id,
        estimate_received_date
        ) VALUES (
        :user_id,
        :total_cents,
        :delivery_address_id,
        :delivery_state_id,
        :estimate_received_date
      )";

      $stmt = $this->conn->prepare($sql);
      $stmt->bindValue(":user_id", $usr_id, PDO::PARAM_INT);
      $stmt->bindValue(":total_cents", $total_cents, PDO::PARAM_INT);
      $stmt->bindValue(":delivery_address_id", $delivery_address_id, PDO::PARAM_INT);
      $stmt->bindValue(":delivery_state_id", ORDER_PLACED_ID, PDO::PARAM_INT);
      $stmt->bindValue(":estimate_received_date", $estimate_received_date ?? $order_date->modify("+3 day")->format("Y-m-d H:i:s"), PDO::PARAM_STR); // DEV hard fixed add 3 days
      $stmt->execute();

      $order_id = $this->conn->lastInsertId();

      $this->orderItem->create($order_id, $data["items"]);

      $this->conn->commit();
      return $this->get($order_id);

    } catch (Exception $e) {
      $this->conn->rollBack();
      throw $e; // Re-throw for centralized ErrorHandler
    }
  }

  public function update(array $current, array $new): array | false {
    $this->conn->beginTransaction();

    try {
      if(in_array($current["delivery_state_id"], ORDER_COMPLETED_STATES)) { // Cannot update order that is completed
        throw new Exception("Cannot update order that has already been received, returned or cancelled", 409);
      }

      $new_delivery_state_id = $new["delivery_state_id"] ?? null;
      $current_delivery_state_id = $current["delivery_state_id"];

      if($new_delivery_state_id && $new_delivery_state_id != $current_delivery_state_id) {
        if($new_delivery_state_id < $current_delivery_state_id) { // Delivery state must progress forward or remain the same, cannot revert to a previous state
          throw new Exception("Cannot update order to a previous state", 409);
        }

        if( // Cannot update order to received or returned state without being delivered
          in_array($new_delivery_state_id, [ORDER_RECEIVED_ID, ORDER_RETURNED_ID]) &&
          $current_delivery_state_id != ORDER_DELIVERED_ID
        ) throw new Exception("Cannot update order to received or returned state without being delivered", 409);

        if($new_delivery_state_id == ORDER_CANCELLED_ID && $current_delivery_state_id >= ORDER_SHIPPED_ID) {  // Cannot cancel an order that has already been shipped
          throw new Exception("Cannot cancel order that has already been shipped", 409);
        }
      }

      $new_estimate_received_date = $new["estimate_received_date"] ?? null;
      $current_estimate_received_date = $current["estimate_received_date"];

      if( // Ensure estimate_received_date > order_date
        $new_estimate_received_date &&
        $new_estimate_received_date != $current_estimate_received_date &&
        new DateTime($new_estimate_received_date) <= new DateTime($current["order_date"])
      ) {
        throw new Exception("estimate_received_date cannot be earlier than or equal to order_date", 409);
      }


      $id = $current["id"];

      $delivery_state_id = $new_delivery_state_id ?? $current_delivery_state_id;

      $new_delivery_address_id = $new["delivery_address_id"] ?? null;
      $current_delivery_address_id = $current["delivery_address"]["id"];

      if($new_delivery_address_id && $new_delivery_address_id != $current_delivery_address_id) {
        if($delivery_state_id >= ORDER_SHIPPED_ID) { // Cannot update delivery_address_id when order is shipped
          throw new Exception("Cannot update delivery address when order is shipped", 409);
        }

        if(!$this->address->isUserAddress($id, $new_delivery_address_id)) { // Only change delivery address which user own
          throw new Exception("User doesn't own this delivery address", 409);
        }
      }

      $sql = "UPDATE orders SET
        delivery_address_id = :delivery_address_id,
        delivery_state_id = :delivery_state_id,
        estimate_received_date = :estimate_received_date,
        received_date = :received_date
        WHERE id = :id
      ";

      $stmt = $this->conn->prepare($sql);
      $stmt->bindValue(":delivery_address_id", $new_delivery_address_id ?? $current_delivery_address_id , PDO::PARAM_INT);
      $stmt->bindValue(":delivery_state_id", $delivery_state_id, PDO::PARAM_INT);
      $stmt->bindValue(":estimate_received_date", $new_estimate_received_date ?? $current_estimate_received_date , PDO::PARAM_STR);
      $stmt->bindValue( // Auto update received_date when order is received or returned
        ":received_date",
        in_array($delivery_state_id, [ORDER_RECEIVED_ID, ORDER_RETURNED_ID])
          ? $this->utils->getCurrentMySQLDateTime()
          : null,
        PDO::PARAM_STR
      );
      $stmt->bindValue(":id", $id, PDO::PARAM_INT);
      $stmt->execute();

      if($delivery_state_id == ORDER_CANCELLED_ID || $delivery_state_id == ORDER_RETURNED_ID) {  // Order is cancelled or returned -> update is_sold and stock_quantity
        $this->orderItem->deleteByOrderId($id);
      }

      $this->conn->commit();
      return $this->get($id);

    } catch (Exception $e) {
      $this->conn->rollBack();
      throw $e; // Re-throw for centralized ErrorHandler
    }
  }

  public function getByUserId(int $usr_id, ?int $limit=null, ?int $offset=null): array {
    $sql = "SELECT
      id,
      total_cents,
      delivery_address_id,
      delivery_state_id,
      order_date,
      estimate_received_date,
      received_date
      FROM orders WHERE user_id = :user_id";

    if($limit !== null && $offset !== null) {
      $sql .= " LIMIT :limit OFFSET :offset";
    } elseif($limit !== null) {
      $sql .= " LIMIT :limit";
    } elseif($offset !== null) {
      $sql .= " LIMIT 18446744073709551615 OFFSET :offset";
    }

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":user_id", $usr_id, PDO::PARAM_INT);
    if($limit !== null) $stmt->bindValue(":limit", $limit, PDO::PARAM_INT);
    if($offset !== null) $stmt->bindValue(":offset", $offset, PDO::PARAM_INT);
    $stmt->execute();

    $data = [];
    while($order = $stmt->fetch(PDO::FETCH_ASSOC)) {
      $order["items"] = $this->orderItem->getByOrderId($order["id"]);
      $order["delivery_address"] = $this->address->get($order["delivery_address_id"]);
      unset($order["delivery_address_id"]);
      unset($order["delivery_address"]["user_id"]);
      unset($order["delivery_address"]["is_default"]);
      $data[] = $order;
    }

    return $data;
  }

  // Function calculate total also handle stock exceeded and throw error if variation not found
  private function calculateTotalCents(array $items): int { // Items is a list of {product_variation_id, quantity}
    $placeholders = implode(",", array_fill(0, count($items), "?")); // String of question marks ex: "?,?,?,.."

    $sql = "SELECT
      id,
      price_cents,
      stock_quantity
      FROM product_variations
      WHERE id IN ($placeholders) AND stop_selling = false AND is_deleted = false
      FOR UPDATE
    ";

    $stmt = $this->conn->prepare($sql);
    $variations_id_to_bind = array_column($items, "product_variation_id"); // Return a list of product_variation_id ex: [10, 15, 20,...]
    $stmt->execute($variations_id_to_bind);

    // Fetch the prices into an associative array for easy lookup [variation_id => price_cents]
    $variations = [];
    while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
      $variations[$row["id"]] = [
        "price_cents" => $row["price_cents"],
        "stock_quantity" => $row["stock_quantity"]
      ];
    }

    $total_cents = 0;

    // Calculate the total by multiplying quantity with the fetched price
    foreach($items as $item) {
      $variation_id = $item["product_variation_id"];

      if(!isset($variations[$variation_id])) {
        throw new Exception("Product variation id '$variation_id' not found", 404);
      }

      $quantity = $item["quantity"];

      if($quantity > $variations[$variation_id]["stock_quantity"]) {
        throw new Exception("Product variation id '$variation_id' with the quantity of '$quantity' exceeds stock", 409);
      }

      $total_cents += $variations[$variation_id]["price_cents"] * $quantity;
    }

    return $total_cents;
  }
}
