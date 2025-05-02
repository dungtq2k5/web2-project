<?php

class OrderDeliveryStateGateway {
  private PDO $conn;

  public function __construct(PDO $db_conn) {
    $this->conn = $db_conn;
  }

  public function getAll(?int $limit=null, ?int $offset=null): array {
    $sql = "SELECT id, name FROM order_delivery_states WHERE is_deleted = false";

    if($limit !== null && $offset !== null) {
      $sql .= " LIMIT :limit OFFSET :offset";
    } elseif($limit !== null) {
      $sql .= " LIMIT :limit";
    } elseif($offset !== null) {
      $sql .= " LIMIT 18446744073709551615 OFFSET :offset";
    }

    $sql .= " ORDER BY id";

    $stmt = $this->conn->prepare($sql);
    if($limit !== null) $stmt->bindValue(":limit", $limit, PDO::PARAM_INT);
    if($offset !== null) $stmt->bindValue(":offset", $offset, PDO::PARAM_INT);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  public function get(int $id): array {
    $sql = "SELECT id, name FROM order_delivery_states WHERE id = :id AND is_deleted = false";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":id", $id, PDO::PARAM_INT);
    $stmt->execute();

    return $stmt->fetch(PDO::FETCH_ASSOC);
  }

  // public function create(array $data): array {
  //   $this->conn->beginTransaction();

  //   try {
  //     if($this->isUnique($data["name"])) { // Make sure unique constraints
  //       throw new Exception("Order delivery state name '{$data['name']}' already exists, please choose another one.", 409);
  //     }

  //     $sql = "INSERT INTO order_delivery_states (name) VALUE (:name)";

  //     $stmt = $this->conn->prepare($sql);
  //     $stmt->bindValue(":name", $data["name"], PDO::PARAM_STR);
  //     $stmt->execute();

  //     $id = $this->conn->lastInsertId();

  //     $this->conn->commit();
  //     return $this->get($id);

  //   } catch(PDOException $e) {
  //     $this->conn->rollBack();
  //     throw $e; // Re-throw for centralized ErrorHandler
  //   } catch(Exception $e) {
  //     $this->conn->rollBack();
  //     throw $e; // Re-throw for centralized ErrorHandler
  //   }
  // }

  // public function update(array $current, array $new): array {
  //   $this->conn->beginTransaction();

  //   try {
  //     if($new["name"]) { // Make sure unique constraints
  //       $exist_state = $this->isUnique($new["name"]);
  //       if($exist_state && $exist_state["id"] != $current["id"]) {
  //         throw new Exception("Order delivery state name '{$new['name']}' already exists, please choose another one.", 409);
  //       }
  //     }

  //     $sql = "UPDATE order_delivery_states
  //       SET name = :name
  //       WHERE id = :id AND is_deleted = false
  //     ";

  //     $stmt = $this->conn->prepare($sql);
  //     $stmt->bindValue(":name", $new["name"] ?? $current["name"], PDO::PARAM_STR);
  //     $stmt->bindValue(":id", $current["id"], PDO::PARAM_INT);
  //     $stmt->execute();

  //     $this->conn->commit();
  //     return $this->get($current["id"]);

  //   } catch(PDOException $e) {
  //     $this->conn->rollBack();
  //     throw $e; // Re-throw for centralized ErrorHandler
  //   } catch(Exception $e) {
  //     $this->conn->rollBack();
  //     throw $e; // Re-throw for centralized ErrorHandler
  //   }
  // }

  // public function delete(int $id): bool {
  //   $this->conn->beginTransaction();

  //   try {
  //     $sql = $this->hasConstrain($id)
  //       ? "UPDATE order_delivery_states SET is_deleted = true WHERE id = :id AND is_deleted = false"
  //       : "DELETE FROM order_delivery_states WHERE id = :id";

  //     $stmt = $this->conn->prepare($sql);
  //     $stmt->bindValue(":id", $id, PDO::PARAM_INT);
  //     $stmt->execute();

  //     return $this->conn->commit();

  //   } catch (PDOException $e) {
  //     $this->conn->rollBack();
  //     throw $e; // Re-throw for centralized ErrorHandler
  //   } catch (Exception $e) {
  //     $this->conn->rollBack();
  //     throw $e; // Re-throw for centralized ErrorHandler
  //   }
  // }

  // private function hasConstrain(int $id): bool {
  //   $sql = "SELECT EXISTS (
  //     SELECT 1 FROM orders WHERE delivery_state_id = :delivery_state_id
  //   )";

  //   $stmt = $this->conn->prepare($sql);
  //   $stmt->bindValue(":delivery_state_id", $id, PDO::PARAM_INT);
  //   $stmt->execute();

  //   return (bool) $stmt->fetchColumn();
  // }

  // private function isUnique(string $name): array | false {
  //   $sql = "SELECT * FROM order_delivery_states WHERE name = :name AND is_deleted = false";

  //   $stmt = $this->conn->prepare($sql);
  //   $stmt->bindValue(":name", $name, PDO::PARAM_STR);
  //   $stmt->execute();

  //   return $stmt->fetch(PDO::FETCH_ASSOC);
  // }
}

