<?php

class UserRoleGateway {
  private PDO $conn;
  private RoleGateway $role;

  public function __construct(PDO $db_conn) {
    $this->conn = $db_conn;
    $this->role = new RoleGateway($db_conn);
  }

  // This function doesn't have its own transaction make sure to cover when use it
  public function deleteByUserId(int $usr_id): int {
    try {
      // 1. Update user_assigned in roles table.
      $sql = "UPDATE roles SET user_assigned = CASE WHEN user_assigned > 0
        THEN user_assigned - 1 ELSE 0 END
        WHERE id IN (SELECT role_id FROM user_roles WHERE user_id = :user_id)
        AND is_deleted = false
      ";

      $stmt = $this->conn->prepare($sql);
      $stmt->bindValue(":user_id", $usr_id, PDO::PARAM_INT);
      $stmt->execute();

      // 2. Delete all user's roles.
      $sql = "DELETE FROM user_roles WHERE user_id = :user_id";

      $stmt = $this->conn->prepare($sql);
      $stmt->bindValue(":user_id", $usr_id, PDO::PARAM_INT);
      $stmt->execute();

      return $stmt->rowCount();

    } catch(Exception $e) {
      throw $e; // Re-throw for centralized ErrorHandler
    }
  }

  public function getByUserId(int $usr_id): array {
    $sql = "SELECT roles.id, roles.name FROM user_roles
      INNER JOIN roles ON user_roles.role_id = roles.id
      WHERE user_id = :user_id AND roles.is_deleted = false";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":user_id", $usr_id, PDO::PARAM_INT);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  // This function doesn't have its own transaction make sure to cover when use it
  public function createMultiple(int $usr_id, array $roles_id): int { // roles_id is a list ids of role [1,2,3...]
    if(count($roles_id) === 0) return 0;

    try {
      // 1. Update user_assigned in roles table.
      $placeholders = implode(",", array_fill(0, count($roles_id), "?"));

      $sql = "UPDATE roles SET user_assigned = user_assigned + 1
        WHERE id IN ($placeholders) AND is_deleted = false
      ";

      $stmt = $this->conn->prepare($sql);
      $stmt->execute($roles_id);

      // 2. Create user's roles.
      $sql_values = [];

      foreach($roles_id as $role_id) {
        $sql_values[] = "($usr_id, $role_id)";
      }
      $sql_values = implode(",", $sql_values); // Result is a string: (1,1),(1,2),...

      return $this->conn->exec("INSERT INTO user_roles (user_id, role_id) VALUES $sql_values");

    } catch(Exception $e) {
      throw $e; // Re-throw for centralized ErrorHandler
    }
  }

  // This function doesn't have its own transaction make sure to cover when use it
  public function updateMultiple(int $usr_id, array $new_roles_id): bool { // Delete all current roles -> create new roles
    $this->deleteByUserId($usr_id);
    return $this->createMultiple($usr_id, $new_roles_id);
  }
}
