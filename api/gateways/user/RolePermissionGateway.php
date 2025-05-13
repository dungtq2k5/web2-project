<?php

class RolePermissionGateway {
  private PDO $conn;

  public function __construct(PDO $db_conn) {
    $this->conn = $db_conn;
  }

  // This function doesn't have its own transaction make sure to cover when use it
  public function deleteByRoleId(int $role_id): int {
    try {
      $sql = "DELETE FROM role_permissions WHERE role_id = :role_id";

      $stmt = $this->conn->prepare($sql);
      $stmt->bindValue(":role_id", $role_id, PDO::PARAM_INT);
      $stmt->execute();

      return $stmt->rowCount();

    } catch(Exception $e) {
      throw $e; // Re-throw for centralized ErrorHandler
    }
  }

  public function getByRoleId(int $role_id): array {
    $sql = "SELECT p.id, p.action_name, p.action_code
      FROM role_permissions AS r_p
      INNER JOIN permissions AS p ON r_p.permission_id = p.id
      WHERE role_id = :role_id
    ";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":role_id", $role_id, PDO::PARAM_INT);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  public function getByRoleIdMinimal(int $role_id): array { // Like getByRoleId but only action_code
    $sql = "SELECT p.action_code
      FROM role_permissions AS r_p
      INNER JOIN permissions AS p ON r_p.permission_id = p.id
      WHERE role_id = :role_id
    ";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":role_id", $role_id, PDO::PARAM_INT);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  // This function doesn't have its own transaction make sure to cover when use it
  public function createMultiple(int $role_id, array $permissions_id): int {
    if(empty($permissions_id)) return 0;

    try {
      $sql_values = [];

      foreach($permissions_id as $permission_id) {
        $sql_values[] = "($role_id, $permission_id)";
      }
      $sql_values = implode(",", $sql_values); // Result is a string: (1,1),(1,2),...

      return $this->conn->exec("INSERT INTO role_permissions (role_id, permission_id) VALUES $sql_values");

    } catch(Exception $e) {
      throw $e; // Re-throw for centralized ErrorHandler
    }
  }

  // This function doesn't have its own transaction make sure to cover when use it
  public function updateMultiple(int $role_id, array $new_permissions_id): bool { // Delete all current permissions -> create new permissions
    $this->deleteByRoleId($role_id);
    return $this->createMultiple($role_id, $new_permissions_id);
  }
}