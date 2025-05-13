<?php

class ProviderGateway {
  private PDO $conn;

  public function __construct(PDO $db_conn) {
    $this->conn = $db_conn;
  }

  public function getAll(?int $limit=null, ?int $offset=null): array {
    $sql = "SELECT
      id,
      full_name,
      email,
      phone_number,
      created_at
      FROM providers WHERE is_deleted = false";

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
      full_name,
      email,
      phone_number,
      created_at
      FROM providers WHERE id = :id AND is_deleted = false";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":id", $id, PDO::PARAM_INT);
    $stmt->execute();

    return $stmt->fetch(PDO::FETCH_ASSOC);
  }

  public function create(array $data): array | false {
    $this->conn->beginTransaction();

    try {
      $sql = "INSERT INTO providers (full_name, email, phone_number)
        VALUES (:full_name, :email, :phone_number)";

      $stmt = $this->conn->prepare($sql);
      $stmt->bindValue(":full_name", $data["full_name"], PDO::PARAM_STR);
      $stmt->bindValue(":email", $data["email"], PDO::PARAM_STR);
      $stmt->bindValue(":phone_number", $data["phone_number"], PDO::PARAM_STR);
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
      $sql = "UPDATE providers SET
        full_name = :full_name,
        email = :email,
        phone_number = :phone_number
        WHERE id = :id AND is_deleted = false
      ";

      $stmt = $this->conn->prepare($sql);
      $stmt->bindValue(":full_name", $new["full_name"] ?? $current["full_name"], PDO::PARAM_STR);
      $stmt->bindValue(":email", $new["email"] ?? $current["email"], PDO::PARAM_STR);
      $stmt->bindValue(":phone_number", $new["phone_number"] ?? $current["phone_number"], PDO::PARAM_STR);
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
        ? "UPDATE providers SET is_deleted = true WHERE id = :id AND is_deleted = false"
        : "DELETE FROM providers WHERE id = :id";

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
      SELECT 1 FROM goods_receipt_notes WHERE provider_id = :provider_id
      LIMIT 1
    )";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":provider_id", $id, PDO::PARAM_INT);
    $stmt->execute();

    return (bool) $stmt->fetchColumn();
  }
}
