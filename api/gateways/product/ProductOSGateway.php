<?php

class ProductOSGateway {
  private PDO $conn;

  public function __construct(PDO $db_conn) {
    $this->conn = $db_conn;
  }

  public function getAll(?int $limit=null, ?int $offset=null): array {
    $sql = "SELECT id, name FROM product_os WHERE is_deleted = false";

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
    $sql = "SELECT id, name FROM product_os WHERE id = :id AND is_deleted = false";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":id", $id, PDO::PARAM_INT);
    $stmt->execute();

    return $stmt->fetch(PDO::FETCH_ASSOC);
  }

  public function create(array $data): array | false {
    $this->conn->beginTransaction();

    try {
      if(!$this->isNameUnique($data["name"])) { // Make sure unique constraints
        throw new Exception("OS name '{$data['name']}' already exists, please choose another one", 409);
      }

      $sql = "INSERT INTO product_os (name) VALUES (:name)";

      $stmt = $this->conn->prepare($sql);
      $stmt->bindValue(":name", $data["name"], PDO::PARAM_STR);
      $stmt->execute();

      $id = $this->conn->lastInsertId();

      $this->conn->commit();
      return $this->get($id);

    } catch(PDOException $e) {
      $this->conn->rollBack();
      throw $e; // Re-throw for centralized ErrorHandler
    } catch(Exception $e) {
      $this->conn->rollBack();
      throw $e; // Re-throw for centralized ErrorHandler
    }
  }

  public function update(array $current, array $new): array | false {
    $this->conn->beginTransaction();

    try {
      $new_name = $new["name"];

      if( // Make sure unique constraints
        $new_name &&
        $new_name != $current["name"] &&
        !$this->isNameUnique($new_name)
      ) throw new Exception("OS name '{$new['name']}' already exists, please choose another one", 409);

      $sql = "UPDATE product_os
        SET name = :name
        WHERE id = :id AND is_deleted = false
      ";

      $stmt = $this->conn->prepare($sql);
      $stmt->bindValue(":name", $new_name ?? $current["name"], PDO::PARAM_STR);
      $stmt->bindValue(":id", $current["id"], PDO::PARAM_INT);
      $stmt->execute();

      $this->conn->commit();
      return $this->get($current["id"]);

    } catch(PDOException $e) {
      $this->conn->rollBack();
      throw $e; // Re-throw for centralized ErrorHandler
    } catch(Exception $e) {
      $this->conn->rollBack();
      throw $e; // Re-throw for centralized ErrorHandler
    }
  }

  public function delete(int $id): bool {
    $this->conn->beginTransaction();

    try {
      $sql = $this->hasConstrain($id)
        ? "UPDATE product_os SET is_deleted = true WHERE id = :id AND is_deleted = false"
        : "DELETE FROM product_os WHERE id = :id";

      $stmt = $this->conn->prepare($sql);
      $stmt->bindValue(":id", $id, PDO::PARAM_INT);
      $stmt->execute();

      return $this->conn->commit();

    } catch(PDOException $e) {
      $this->conn->rollBack();
      throw $e; // Re-throw for centralized ErrorHandler
    } catch(Exception $e) {
      $this->conn->rollBack();
      throw $e; // Re-throw for centralized ErrorHandler
    }
  }

  private function hasConstrain(int $id): bool {
    $sql = "SELECT EXISTS (
      SELECT 1 FROM product_variations WHERE os_id = :os_id
      LIMIT 1
    )";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":os_id", $id, PDO::PARAM_INT);
    $stmt->execute();

    return (bool) $stmt->fetchColumn();
  }

  private function isNameUnique(string $name): bool {
    $sql = "SELECT EXISTS (
      SELECT 1 FROM product_os WHERE name = :name AND is_deleted = false
      LIMIT 1
    )";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":name", $name, PDO::PARAM_STR);
    $stmt->execute();

    return !(bool) $stmt->fetchColumn();
  }
}