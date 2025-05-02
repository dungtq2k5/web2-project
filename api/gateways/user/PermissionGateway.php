<?php

class PermissionGateway {
  private PDO $conn;

  public function __construct(PDO $db_conn) {
    $this->conn = $db_conn;
  }

  public function getAll(?int $limit=null, ?int $offset=null): array {
    $sql = "SELECT id, action_name, action_code FROM permissions WHERE is_deleted = false";

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
    $sql = "SELECT id, action_name, action_code FROM permissions WHERE id = :id AND is_deleted = false";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":id", $id, PDO::PARAM_INT);
    $stmt->execute();

    return $stmt->fetch(PDO::FETCH_ASSOC);
  }

  // // public function create(array $data): array {
  // //   $this->conn->beginTransaction();

  // //   try {
  // //     if(!$this->isUnique($data["action_name"], $data["action_code"])) { // Make sure unique constraints
  // //       throw new Exception("Permission name '{$data['action_name']}' with code '{$data['action_code']}' already exists, please choose another one", 409);
  // //     }

  // //     $sql = "INSERT INTO permissions (action_name, action_code) VALUES (:action_name, :action_code)";

  // //     $stmt = $this->conn->prepare($sql);
  // //     $stmt->bindValue(":action_name", $data["action_name"], PDO::PARAM_STR);
  // //     $stmt->bindValue(":action_code", $data["action_code"], PDO::PARAM_STR);
  // //     $stmt->execute();

  // //     $id = $this->conn->lastInsertId();

  // //     $this->conn->commit();
  // //     return $this->get($id);

  // //   } catch(PDOException $e) {
  // //     $this->conn->rollBack();
  // //     throw $e; // Re-throw for centralized ErrorHandler
  // //   } catch(Exception $e) {
  // //     $this->conn->rollBack();
  // //     throw $e; // Re-throw for centralized ErrorHandler
  // //   }
  // // }

  // public function update(array $current, array $new): array {

  //   $action_name = $new["action_name"] ?? $current["action_name"];
  //   $action_code = $new["action_code"] ?? $current["action_code"];

  //   if(
  //     ($action_name !== $current["action_name"] || $action_code !== $current["action_code"]) &&
  //     !$this->isUnique($action_name, $action_code)
  //   ) throw new Exception("Permission name '{$new['action_name']}' with code '{$new['action_code']}' already exists, please choose another one", 409);

  //   $sql = "UPDATE permissions SET action_name = :action_name AND action_code = :action_code WHERE id = :id";

  //   $stmt = $this->conn->prepare($sql);
  //   $stmt->bindValue(":action_name", $action_name, PDO::PARAM_STR);
  //   $stmt->bindValue(":action_code", $action_code, PDO::PARAM_STR);
  //   $stmt->bindValue(":id", $current["id"], PDO::PARAM_INT);
  //   $stmt->execute();

  //   return $this->get($current["id"]);
  // }

  // public function delete(int $id): bool {
  //   $sql = $this->hasConstrain($id)
  //     ? "UPDATE permissions SET is_deleted = true WHERE id = :id"
  //     : "DELETE FROM permissions WHERE id = :id";

  //   $stmt = $this->conn->prepare($sql);
  //   $stmt->bindValue(":id", $id, PDO::PARAM_INT);

  //   return $stmt->execute();
  // }

  // private function hasConstrain(int $id): bool {
  //   $sql = "SELECT EXISTS (SELECT 1 FROM role_permissions WHERE permission_id = :permission_id)";

  //   $stmt = $this->conn->prepare($sql);
  //   $stmt->bindValue(":permission_id", $id, PDO::PARAM_INT);
  //   $stmt->execute();

  //   return (bool) $stmt->fetchColumn();
  // }

  // private function isUnique(string $name, string $code): bool {
  //   $sql = "SELECT EXISTS (
  //     SELECT 1 FROM permissions WHERE action_name = :action_name AND action_code = :action_code AND is_deleted = false
  //   )";

  //   $stmt = $this->conn->prepare($sql);
  //   $stmt->bindValue(":action_name", $name, PDO::PARAM_STR);
  //   $stmt->bindValue(":action_code", $code, PDO::PARAM_STR);
  //   $stmt->execute();

  //   return !(bool) $stmt->fetchColumn();
  // }
}
