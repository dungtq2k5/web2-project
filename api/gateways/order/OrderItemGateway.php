<?php

class OrderItemGateway {

  private PDO $conn;

  public function __construct(Database $db) {
    $this->conn = $db->getConnection();
  }

  public function getAll(?int $limit, ?int $offset): array | false {
    if($limit && $offset) {
      $sql = "SELECT * FROM order_items LIMIT :limit OFFSET :offset";
    } elseif($limit) {
      $sql = "SELECT * FROM order_items LIMIT :limit";
    } elseif($offset) {
      $sql = "SELECT * FROM order_items LIMIT 18446744073709551615 OFFSET :offset";
    } else {
      $sql = "SELECT * FROM order_items";
    }

    $stmt = $this->conn->prepare($sql);
    if($limit) $stmt->bindValue(":limit", $limit, PDO::PARAM_INT);
    if($offset) $stmt->bindValue(":offset", $offset, PDO::PARAM_INT);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  public function get(string $id): array | false {
    $sql = "SELECT * FROM order_items WHERE product_instance_sku = :id";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":id", $id, PDO::PARAM_STR);
    $stmt->execute();

    return $stmt->fetch(PDO::FETCH_ASSOC);
  }

  public function create(array $data): array | false {
    $sql = "INSERT INTO order_items (product_instance_sku, order_id, price_cents) VALUES (:product_instance_sku, :order_id, :price_cents)";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":product_instance_sku", $data["product_instance_sku"], PDO::PARAM_STR);
    $stmt->bindValue(":order_id", $data["order_id"], PDO::PARAM_INT);
    $stmt->bindValue(":price_cents", $data["price_cents"], PDO::PARAM_INT);
    $stmt->execute();

    return $this->get($data["product_instance_sku"]);
  }

  public function update(array $current, array $new): array | false {
    $sql = "UPDATE order_items SET
      order_id = :order_id,
      price_cents = :price_cents
      WHERE product_instance_sku = :product_instance_sku";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":order_id", $new["order_id"] ?? $current["order_id"], PDO::PARAM_INT);
    $stmt->bindValue(":price_cents", $new["price_cents"] ?? $current["price_cents"], PDO::PARAM_INT);
    $stmt->bindValue(":product_instance_sku", $current["product_instance_sku"], PDO::PARAM_STR);
    $stmt->execute();

    return $this->get($current["product_instance_sku"]);
  }

  public function delete(string $id): bool {
    $sql = "DELETE FROM order_items WHERE product_instance_sku = :id";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":id", $id, PDO::PARAM_STR);

    return $stmt->execute();
  }

  public function deleteByOrderId(int $orderId): int {
    $sql = "DELETE FROM order_items WHERE order_id = :order_id";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":order_id", $orderId, PDO::PARAM_INT);
    $stmt->execute();

    return $stmt->rowCount();
  }

  public function getByOrderId(int $id): array | false {
    $sql = "SELECT instance.product_variation_id, COUNT(*) AS quantity, SUM(item.price_cents) AS total_cents
      FROM order_items AS item
      INNER JOIN product_instances AS instance ON item.product_instance_sku = instance.sku
      WHERE item.order_id = :order_id
      GROUP BY instance.product_variation_id
    ";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":order_id", $id, PDO::PARAM_INT);

    if($stmt->execute()) {
      $data = [];
      while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $row["product_instances"] = $this->getByOrderIdAndProductVariationId($id, $row["product_variation_id"]);
        $data[] = $row;
      }

      return $data;
    }

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  private function getByOrderIdAndProductVariationId(int $order_id, int $product_variation_id): array | false {
    $sql = "SELECT item.product_instance_sku, instance.goods_receipt_note_id FROM order_items AS item
      INNER JOIN product_instances AS instance ON item.product_instance_sku = instance.sku
      WHERE item.order_id = :order_id AND instance.product_variation_id = :product_variation_id
    ";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":order_id", $order_id, PDO::PARAM_INT);
    $stmt->bindValue(":product_variation_id", $product_variation_id, PDO::PARAM_INT);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

}
