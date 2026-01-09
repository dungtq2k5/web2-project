<?php

class RolePermissionGateway
{
  private PDO $conn;

  public function __construct(PDO $db_conn)
  {
    $this->conn = $db_conn;
  }

  public function getAll(?int $limit = null, ?int $offset = null): array
  {
    $sql = "SELECT * FROM role_permissions";

    if ($limit !== null && $offset !== null) {
      $sql .= " LIMIT :limit OFFSET :offset";
    } elseif ($limit !== null) {
      $sql .= " LIMIT :limit";
    } elseif ($offset !== null) {
      $sql .= " LIMIT 18446744073709551615 OFFSET :offset";
    }

    $stmt = $this->conn->prepare($sql);
    if ($limit !== null) $stmt->bindValue(":limit", $limit, PDO::PARAM_INT);
    if ($offset !== null) $stmt->bindValue(":offset", $offset, PDO::PARAM_INT);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  public function get(int $role_id, ?int $permission_id = null): array | false
  {
    $sql = "SELECT * FROM role_permissions WHERE role_id = :role_id";
    if ($permission_id) {
      $sql .= " AND permission_id = :permission_id";
    }

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":role_id", $role_id, PDO::PARAM_INT);
    if ($permission_id) $stmt->bindValue(":permission_id", $permission_id, PDO::PARAM_INT);
    $stmt->execute();

    if ($data = $stmt->fetchAll(PDO::FETCH_ASSOC)) {
      return count($data) === 1 ? $data[0] : $data;
    }

    return false;
  }

  // This function doesn't have its own transaction make sure to cover when use it
  public function deleteByRoleId(int $role_id): int
  {
    try {
      $sql = "DELETE FROM role_permissions WHERE role_id = :role_id";

      $stmt = $this->conn->prepare($sql);
      $stmt->bindValue(":role_id", $role_id, PDO::PARAM_INT);
      $stmt->execute();

      return $stmt->rowCount();
    } catch (Exception $e) {
      throw $e; // Re-throw for centralized ErrorHandler
    }
  }

  public function getByRoleId(int $role_id): array
  {
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

  public function getByRoleIdMinimal(int $role_id): array
  { // Like getByRoleId but only action_code
    $sql = "SELECT p.action_code
      FROM role_permissions AS r_p
      INNER JOIN permissions AS p ON r_p.permission_id = p.id
      WHERE role_id = :role_id
    ";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":role_id", $role_id, PDO::PARAM_INT);
    $stmt->execute();

    if ($data = $stmt->fetchAll(PDO::FETCH_ASSOC)) {
      return count($data) === 1 ? $data[0] : $data;
    }

    return [];
  }

  public function create(array $data): array | false
  {
    $this->conn->beginTransaction();

    try {
      $sql = "INSERT INTO role_permissions (role_id, permission_id)
        VALUES (:role_id, :permission_id)";

      $stmt = $this->conn->prepare($sql);
      $stmt->bindValue(":role_id", $data["role_id"], PDO::PARAM_INT);
      $stmt->bindValue(":permission_id", $data["permission_id"], PDO::PARAM_INT);
      $stmt->execute();

      $this->conn->commit();
      return $this->get($data["role_id"], $data["permission_id"]);
    } catch (PDOException $e) {
      $this->conn->rollBack();
      throw $e; // Re-throw for centralized ErrorHandler
    } catch (Exception $e) {
      $this->conn->rollBack();
      throw $e; // Re-throw for centralized ErrorHandler
    }
  }

  // This function doesn't have its own transaction make sure to cover when use it
  public function createMultiple(int $role_id, array $permissions_id): int
  {
    if (empty($permissions_id)) return 0;

    try {
      $sql_values = [];

      foreach ($permissions_id as $permission_id) {
        $sql_values[] = "($role_id, $permission_id)";
      }
      $sql_values = implode(",", $sql_values); // Result is a string: (1,1),(1,2),...

      return $this->conn->exec("INSERT INTO role_permissions (role_id, permission_id) VALUES $sql_values");
    } catch (Exception $e) {
      throw $e; // Re-throw for centralized ErrorHandler
    }
  }

  // This function doesn't have its own transaction make sure to cover when use it
  public function updateMultiple(int $role_id, array $new_permissions_id): bool
  { // Delete all current permissions -> create new permissions
    $this->deleteByRoleId($role_id);
    return $this->createMultiple($role_id, $new_permissions_id);
  }

  public function delete(int $role_id, int $permission_id): bool
  {
    $this->conn->beginTransaction();

    try {
      $sql = "DELETE FROM role_permissions WHERE role_id = :role_id AND permission_id = :permission_id";

      $stmt = $this->conn->prepare($sql);
      $stmt->bindValue(":role_id", $role_id, PDO::PARAM_INT);
      $stmt->bindValue(":permission_id", $permission_id, PDO::PARAM_INT);
      $stmt->execute();

      return $this->conn->commit();
    } catch (PDOException $e) {
      $this->conn->rollBack();
      throw $e; // Re-throw for centralized ErrorHandler
    } catch (Exception $e) {
      $this->conn->rollBack();
      throw $e; // Re-throw for centralized ErrorHandler
    }
  }
}
