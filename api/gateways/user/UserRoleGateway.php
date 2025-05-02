<?php

class UserRoleGateway {
  private PDO $conn;

  public function __construct(PDO $db_conn) {
    $this->conn = $db_conn;
  }

  public function getAll(?int $limit=null, ?int $offset=null): array {
    $sql = "SELECT * FROM user_roles";

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

  public function get(int $usr_id, ?int $role_id=null): array | false {
    $sql = "SELECT * FROM user_roles WHERE user_id = :user_id";
    if($role_id) {
      $sql .= " AND role_id = :role_id";
    }

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":user_id", $usr_id, PDO::PARAM_INT);
    if($role_id) $stmt->bindValue(":role_id", $role_id, PDO::PARAM_INT);
    $stmt->execute();

    if($data = $stmt->fetchAll(PDO::FETCH_ASSOC)) {
      return count($data) === 1 ? $data[0] : $data;
    }

    return false;
  }

  public function create(array $data, bool $return=true): array | false | null {
    $this->conn->beginTransaction();

    try {
      $sql = "INSERT INTO user_roles (user_id, role_id)
        VALUES (:user_id, :role_id)";

      $stmt = $this->conn->prepare($sql);
      $stmt->bindValue(":user_id", $data["user_id"], PDO::PARAM_INT);
      $stmt->bindValue(":role_id", $data["role_id"], PDO::PARAM_INT);
      $stmt->execute();

      $this->conn->commit();

      return $return ? $this->get($data["user_id"], $data["role_id"]) : null;

    } catch(PDOException $e) {
      $this->conn->rollBack();
      throw $e; // Re-throw for centralized ErrorHandler
    } catch(Exception $e) {
      $this->conn->rollBack();
      throw $e; // Re-throw for centralized ErrorHandler
    }
  }

  public function delete(int $usr_id, int $role_id): bool {
    $this->conn->beginTransaction();

    try {
      $sql = "DELETE FROM user_roles WHERE user_id = :user_id AND role_id = :role_id";

      $stmt = $this->conn->prepare($sql);
      $stmt->bindValue(":user_id", $usr_id, PDO::PARAM_INT);
      $stmt->bindValue(":role_id", $role_id, PDO::PARAM_INT);
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

  // This function doesn't have its own transaction make sure to cover when use it
  public function deleteByUserId(int $usr_id): int {
    try {
      $sql = "DELETE FROM user_roles WHERE user_id = :user_id";

      $stmt = $this->conn->prepare($sql);
      $stmt->bindValue(":user_id", $usr_id, PDO::PARAM_INT);
      $stmt->execute();

      return $stmt->rowCount();

    } catch(PDOException $e) {
      throw $e; // Re-throw for centralized ErrorHandler
    } catch(Exception $e) {
      throw $e; // Re-throw for centralized ErrorHandler
    }
  }

  public function getByUserId(int $usr_id): array {
    $sql = "SELECT roles.id, roles.name FROM user_roles
      INNER JOIN roles ON user_roles.role_id = roles.id
      WHERE user_id = :user_id";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":user_id", $usr_id, PDO::PARAM_INT);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  // This function doesn't have its own transaction make sure to cover when use it
  public function createMultiple(int $usr_id, array $roles_id): int { // roles_id is a list ids of role [1,2,3...]
    try {
      $sql_values = [];

      foreach($roles_id as $role_id) {
        $sql_values[] = "($usr_id, $role_id)";
      }
      $sql_values = implode(",", $sql_values); // Result is a string: (1,1),(1,2),...

      return $this->conn->exec("INSERT INTO user_roles (user_id, role_id) VALUES $sql_values");

    } catch(PDOException $e) {
      throw $e; // Re-throw for centralized ErrorHandler
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
