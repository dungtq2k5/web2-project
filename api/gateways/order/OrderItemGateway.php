<?php

class OrderItemGateway {

  private PDO $conn;
  private ProductInstanceGateway $instance;

  public function __construct(PDO $db_conn) {
    $this->conn = $db_conn;
    $this->instance = new ProductInstanceGateway($db_conn);
  }

  public function getAll(?int $limit=null, ?int $offset=null): array {
    $sql = "SELECT * FROM order_items";

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

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  public function get(string $id): array | false {
    $sql = "SELECT
      o_i.product_instance_sku,
      o_i.order_id,
      o_i.price_cents,
      o.user_id
     FROM order_items AS o_i
     INNER JOIN orders AS o ON o_i.order_id = o.id
     WHERE o_i.product_instance_sku = :id";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":id", $id, PDO::PARAM_STR);
    $stmt->execute();

    return $stmt->fetch(PDO::FETCH_ASSOC);
  }

  // Create data in order_items table
  // Handle both stock_quantity and is_sold
  // This function doesn't have its own transaction make sure to cover when use it
  public function create(int $order_id, array $items): void { // items is a list of {product_variation_id, quantity}
    try {
      // 1.Create a temporary table to hold skus, variation_id, price_cents
      $this->conn->exec("CREATE TEMPORARY TABLE temp_order_items (
        product_instance_sku VARCHAR(255) PRIMARY KEY,
        product_variation_id INT NOT NULL,
        price_cents INT NOT NULL)
      ");

      $insert_temp_stmt = $this->conn->prepare("INSERT INTO temp_order_items
        (product_instance_sku, product_variation_id, price_cents)
        VALUES (:sku, :variation_id, :price_cents)
      ");

      $fetch_instances_stmt = $this->conn->prepare("SELECT p_i.sku, p_v.price_cents
        FROM product_instances AS p_i
        INNER JOIN product_variations AS p_v ON p_i.product_variation_id = p_v.id
        WHERE p_i.product_variation_id = :variation_id
          AND p_i.is_sold = false
          AND p_i.is_deleted = false
          AND p_v.stop_selling = false
          AND p_v.is_deleted = false
        LIMIT :quantity
        FOR UPDATE
      ");

      foreach($items as $item) {
        $variation_id = $item["product_variation_id"];
        $quantity = $item["quantity"];

        $fetch_instances_stmt->bindValue(":variation_id", $variation_id, PDO::PARAM_INT);
        $fetch_instances_stmt->bindValue(":quantity", $quantity, PDO::PARAM_INT);
        $fetch_instances_stmt->execute();

        $count = 0;
        while($row = $fetch_instances_stmt->fetch(PDO::FETCH_ASSOC)) {
          $insert_temp_stmt->bindValue(":sku", $row["sku"]);
          $insert_temp_stmt->bindValue(":variation_id", $variation_id, PDO::PARAM_INT);
          $insert_temp_stmt->bindValue(":price_cents", $row["price_cents"], PDO::PARAM_INT);
          $insert_temp_stmt->execute();
          $count++;
        }

        if($count < $quantity) { // Check exceeded stock
          throw new Exception("Not enough stock for product variation ID: $variation_id. Requested: $quantity, Available: $count");
        }
      }

      // 2. Insert from temporary table to order_items
      $insert_order_items_stmt = $this->conn->prepare("INSERT INTO order_items
        (product_instance_sku, order_id, price_cents)
        SELECT t_o_i.product_instance_sku, :order_id, t_o_i.price_cents
        FROM temp_order_items AS t_o_i
      ");
      $insert_order_items_stmt->bindValue(":order_id", $order_id, PDO::PARAM_INT);
      $insert_order_items_stmt->execute();
      // 3. Update product_instances is_sold = true
      $this->conn->exec("UPDATE product_instances SET is_sold = true
        WHERE sku IN (SELECT product_instance_sku FROM temp_order_items)
      ");

      // 4. Update product_variations stock_quantity
      $update_variations_stmt = $this->conn->prepare("UPDATE product_variations
        SET stock_quantity = GREATEST(stock_quantity - :quantity_ordered, 0)
        WHERE id = :variation_id AND is_deleted = false
      ");

      // Aggregate quantities per variation from the temp table
      $aggregate_quantity_stmt = $this->conn->query("SELECT product_variation_id, COUNT(*) AS total_ordered
        FROM temp_order_items
        GROUP BY product_variation_id
      ");

      while($row = $aggregate_quantity_stmt->fetch(PDO::FETCH_ASSOC)) {
        $update_variations_stmt->bindValue(":quantity_ordered", $row["total_ordered"], PDO::PARAM_INT);
        $update_variations_stmt->bindValue(":variation_id", $row["product_variation_id"], PDO::PARAM_INT);
        $update_variations_stmt->execute();
      }

      // 5. Drop the temporary table
      $this->conn->exec("DROP TEMPORARY TABLE IF EXISTS temp_order_items");

      return;

    } catch(PDOException $e) {
      throw $e; // Re-throw for centralized ErrorHandler
    } catch(Exception $e) {
      throw $e; // Re-throw for centralized ErrorHandler
    }
  }

  public function getByOrderId(int $id): array {
    $sql = "SELECT
      instance.product_variation_id,
      COUNT(*) AS quantity,
      CAST(SUM(order_items.price_cents) AS UNSIGNED) AS total_cents
      FROM order_items
      INNER JOIN product_instances AS instance ON order_items.product_instance_sku = instance.sku
      WHERE order_items.order_id = :order_id
      GROUP BY instance.product_variation_id
    ";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":order_id", $id, PDO::PARAM_INT);
    $stmt->execute();

    $data = [];
    while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
      $row["product_instances"] = $this->getByOrderIdAndProductVariationId($id, $row["product_variation_id"]);
      $data[] = $row;
    }

    return $data;
  }

  private function getByOrderIdAndProductVariationId(int $order_id, int $product_variation_id): array {
    $sql = "SELECT
      item.product_instance_sku AS sku,
      instance.supplier_serial_number,
      instance.supplier_imei_number,
      instance.goods_receipt_note_id
      FROM order_items AS item
      INNER JOIN product_instances AS instance ON item.product_instance_sku = instance.sku
      WHERE item.order_id = :order_id AND instance.product_variation_id = :product_variation_id
    ";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":order_id", $order_id, PDO::PARAM_INT);
    $stmt->bindValue(":product_variation_id", $product_variation_id, PDO::PARAM_INT);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  // Handle soft delete order_items -> update product_instances is_sold to false + update product_variations stock_quantity
  // Use this function with caution because can effect data consistency
  // This function doesn't have its own transaction make sure to cover when use it
  public function deleteByOrderId(int $order_id): void {
    try {
      $sql = "UPDATE product_instances p_i
        INNER JOIN order_items o_i ON p_i.sku = o_i.product_instance_sku
        LEFT JOIN product_variations p_v ON p_i.product_variation_id = p_v.id
        SET
          p_i.is_sold = CASE WHEN p_i.is_deleted = false THEN false ELSE p_i.is_sold END,
          p_v.stock_quantity = CASE WHEN p_v.is_deleted = false THEN p_v.stock_quantity + 1 ELSE p_v.stock_quantity END
        WHERE o_i.order_id = :order_id";

      $stmt = $this->conn->prepare($sql);
      $stmt->bindValue(":order_id", $order_id, PDO::PARAM_INT);
      $stmt->execute();

      return;

    } catch(PDOException $e) {
      throw $e; // Re-throw for centralized ErrorHandler
    } catch(Exception $e) {
      throw $e; // Re-throw for centralized ErrorHandler
    }
  }

}
