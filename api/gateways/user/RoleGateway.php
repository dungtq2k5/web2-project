<?php

class RoleGateway {
  private PDO $conn;
  private RolePermissionGateway $role_permission;
  private Utils $utils;

  public function __construct(PDO $db_conn) {
    $this->conn = $db_conn;
    $this->role_permission = new RolePermissionGateway($db_conn);
    $this->utils = new Utils;
  }

  public function getAll(?int $limit=null, ?int $offset=null): array {
    $sql = "SELECT id, name, user_assigned FROM roles WHERE is_deleted = false";

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
    while($role = $stmt->fetch(PDO::FETCH_ASSOC)) {
      $role["permissions"] = $this->role_permission->getByRoleId($role["id"]);
      $data[] = $role;
    }

    return $data;
  }

  public function get(int $id): array | false {
    $sql = "SELECT id, name, user_assigned FROM roles WHERE id = :id AND is_deleted = false";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":id", $id, PDO::PARAM_INT);
    $stmt->execute();

    if($role = $stmt->fetch(PDO::FETCH_ASSOC)) {
      $role["permissions"] = $this->role_permission->getByRoleId($id);
      return $role;
    }

    return false;
  }

  public function create(array $data): array | false {
    $this->conn->beginTransaction();

    try {
      if(!$this->isNameUnique($data["name"])) { // Make sure unique constraints
        throw new Exception("Role name '{$data['name']}' already exists, please choose another one", 409);
      }

      $sql = "INSERT INTO roles (name) VALUES (:name)";

      $stmt = $this->conn->prepare($sql);
      $stmt->bindValue(":name", $data["name"], PDO::PARAM_STR);
      $stmt->execute();

      $id = $this->conn->lastInsertId();

      if($data["permissions_id"]) {
        $this->role_permission->createMultiple($id, $data["permissions_id"]);
      }

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
      $id = $current["id"];

      if(in_array($id, CORE_ROLES_ID)) { // Cannot modify core role
        throw new Exception("Forbidden: User cannot make any changes to core role", 403);
      }

      $new_name = $new["name"];
      if($new_name && $new_name !== $current["name"] && !$this->isNameUnique($new_name)) { // Make sure unique constraints
        throw new Exception("Role name '{$new['name']}' already exists, please choose another one", 409);
      }

      $sql = "UPDATE roles SET name = :name WHERE id = :id AND is_deleted = false";

      $stmt = $this->conn->prepare($sql);
      $stmt->bindValue(":name", $new_name ?? $current["name"], PDO::PARAM_STR);
      $stmt->bindValue(":id", $id, PDO::PARAM_INT);
      $stmt->execute();

      if(
        isset($new["permissions_id"]) &&
        !$this->utils->compareArrays($new["permissions_id"], array_column($current["permissions"], "id"))
      ) {
        $this->role_permission->updateMultiple($id, $new["permissions_id"]);
      }

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

  public function delete(int $id): bool {
    $this->conn->beginTransaction();

    try {
      if(in_array($id, CORE_ROLES_ID)) { // Cannot modify core role
        throw new Exception("Forbidden: User cannot make any changes to core role", 403);
      }

      $sql = $this->hasConstrain($id)
        ? "UPDATE roles SET is_deleted = true WHERE id = :id AND is_deleted = false"
        : "DELETE FROM roles WHERE id = :id";

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
     (SELECT 1 FROM user_roles WHERE role_id = :role_id LIMIT 1)
      UNION
      (SELECT 1 FROM role_permissions WHERE role_id = :role_id LIMIT 1)
    )";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":role_id", $id, PDO::PARAM_INT);
    $stmt->execute();

    return (bool) $stmt->fetchColumn();
  }

  private function isNameUnique(string $name): bool {
    $sql = "SELECT EXISTS (
      SELECT 1 FROM roles WHERE name = :name AND is_deleted = false
      LIMIT 1
    )";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":name", $name, PDO::PARAM_STR);
    $stmt->execute();

    return !(bool) $stmt->fetchColumn();
  }
}
