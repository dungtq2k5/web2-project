<?php

class GoodsReceiptNoteGateway {
  private PDO $conn;

  public function __construct(PDO $db_conn) {
    $this->conn = $db_conn;
  }

  public function getAll(?int $limit=null, ?int $offset=null): array {
    $sql = "SELECT
      id,
      name,
      provider_id,
      staff_id,
      total_price_cents,
      quantity,
      created_at
      FROM goods_receipt_notes WHERE is_deleted = false";

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

  public function get(int $id): array | false {
    $sql = "SELECT
      id,
      name,
      provider_id,
      staff_id,
      total_price_cents,
      quantity,
      created_at
      FROM goods_receipt_notes WHERE id = :id AND is_deleted = false";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":id", $id, PDO::PARAM_INT);
    $stmt->execute();

    return $stmt->fetch(PDO::FETCH_ASSOC);
  }

  public function create(array $data): array | false {
    $this->conn->beginTransaction();

    try {
      $sql = "INSERT INTO goods_receipt_notes (
        name,
        provider_id,
        staff_id,
        total_price_cents,
        quantity
      ) VALUES (
        :name,
        :provider_id,
        :staff_id,
        :total_price_cents,
        :quantity
      )";

      $stmt = $this->conn->prepare($sql);
      $stmt->bindValue(":name", $data["name"], PDO::PARAM_STR);
      $stmt->bindValue(":provider_id", $data["provider_id"], PDO::PARAM_INT);
      $stmt->bindValue(":staff_id", $data["staff_id"], PDO::PARAM_INT);
      $stmt->bindValue(":total_price_cents", $data["total_price_cents"], PDO::PARAM_INT);
      $stmt->bindValue(":quantity", $data["quantity"], PDO::PARAM_INT);
      $stmt->execute();

      $id = $this->conn->lastInsertId();

      $this->conn->commit();
      return $this->get($id);

    } catch(Exception $e) {
      $this->conn->rollBack();
      throw $e; // Re-throw for centralized ErrorHandler
    }
  }

  public function update(array $current, array $new): array | false {
    $this->conn->beginTransaction();

    try {
      $sql = "UPDATE goods_receipt_notes SET
        name = :name,
        provider_id = :provider_id,
        staff_id = :staff_id,
        total_price_cents = :total_price_cents,
        quantity = :quantity
        WHERE id = :id AND is_deleted = false
      ";

      $stmt = $this->conn->prepare($sql);
      $stmt->bindValue(":name", $new["name"] ?? $current["name"], PDO::PARAM_STR);
      $stmt->bindValue(":provider_id", $new["provider_id"] ?? $current["provider_id"], PDO::PARAM_INT);
      $stmt->bindValue(":staff_id", $new["staff_id"] ?? $current["staff_id"], PDO::PARAM_INT);
      $stmt->bindValue(":total_price_cents", $new["total_price_cents"] ?? $current["total_price_cents"], PDO::PARAM_INT);
      $stmt->bindValue(":quantity", $new["quantity"] ?? $current["quantity"], PDO::PARAM_INT);
      $stmt->bindValue(":id", $current["id"], PDO::PARAM_INT);
      $stmt->execute();

      $this->conn->commit();
      return $this->get($current["id"]);

    } catch(Exception $e) {
      $this->conn->rollBack();
      throw $e; // Re-throw for centralized ErrorHandler
    }
  }

  public function delete(int $id): bool {
    $this->conn->beginTransaction();

    try {
      $sql = $this->hasConstrain($id)
        ? "UPDATE goods_receipt_notes SET is_deleted = true WHERE id = :id AND is_deleted = false"
        : "DELETE FROM goods_receipt_notes WHERE id = :id";

      $stmt = $this->conn->prepare($sql);
      $stmt->bindValue(":id", $id, PDO::PARAM_INT);
      $stmt->execute();

      return $this->conn->commit();

    } catch(Exception $e) {
      $this->conn->rollBack();
      throw $e; // Re-throw for centralized ErrorHandler
    }
  }

  private function hasConstrain(int $id): bool {
    $sql = "SELECT EXISTS (
      SELECT 1 FROM product_instances WHERE goods_receipt_note_id = :goods_receipt_note_id
      LIMIT 1
    )";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":goods_receipt_note_id", $id, PDO::PARAM_INT);
    $stmt->execute();

    return (bool) $stmt->fetchColumn();
  }

}
