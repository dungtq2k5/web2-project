<?php

class RolePermissionGateway {
  private PDO $conn;
  private RoleGateway $role;
  private PermissionGateway $permission;

  public function __construct(Database $db) {
    $this->conn = $db->getConnection();
    $this->role = new RoleGateway($db);
    $this->permission = new PermissionGateway($db);
  }

  public function getAll(?int $limit, ?int $offset): array | false {
    if($limit && $offset) {
      $sql = "SELECT * FROM role_permissions LIMIT :limit OFFSET :offset";
    } elseif($limit) {
      $sql = "SELECT * FROM role_permissions LIMIT :limit";
    } elseif($offset) {
      $sql = "SELECT * FROM role_permissions OFFSET :offset";
    } else {
      $sql = "SELECT * FROM role_permissions";
    }

    $stmt = $this->conn->prepare($sql);
    if($limit) $stmt->bindValue(":limit", $limit, PDO::PARAM_INT);
    if($offset) $stmt->bindValue(":offset", $offset, PDO::PARAM_INT);

    if($stmt->execute()) {
      $data = [];
      while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $row["role"] = $this->role->get($row["role_id"]);
        unset($row["role_id"]);
        $row["permission"] = $this->permission->get($row["permission_id"]);
        unset($row["permission_id"]);
        $data[] = $row;
      }
      
      return $data;
    }
    
    return false;
  }

  public function create(array $data): array | false {
    $sql = "INSERT INTO role_permissions (role_id, permission_id)
      VALUES (:role_id, :permission_id)";
    
    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":role_id", $data["role_id"], PDO::PARAM_INT);
    $stmt->bindValue(":permission_id", $data["permission_id"], PDO::PARAM_INT);
    $stmt->execute();

    return $this->get($data["role_id"], $data["permission_id"]);
  }

  public function get(int $role_id, ?int $permission_id): array | false {
    $sql = $role_id && $permission_id 
      ? "SELECT * FROM role_permissions WHERE role_id = :role_id AND permission_id = :permission_id"
      : "SELECT * FROM role_permissions WHERE role_id = :role_id";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":role_id", $role_id, PDO::PARAM_INT);
    if($permission_id) $stmt->bindValue(":permission_id", $permission_id, PDO::PARAM_INT);

    if($stmt->execute()) {
      $data = [];
      while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $row["role"] = $this->role->get($role_id);
        unset($row["role_id"]);
        $row["permission"] = $this->permission->get($row["permission_id"]);
        unset($row["permission_id"]);
        $data[] = $row;
      }

      return $data;
    }

    return false;
  }

  public function delete(int $role_id, int $permission_id): bool {
    $sql = "DELETE FROM role_permissions WHERE role_id = :role_id AND permission_id = :permission_id";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":role_id", $role_id, PDO::PARAM_INT);
    $stmt->bindValue(":permission_id", $permission_id, PDO::PARAM_INT);
    return $stmt->execute();
  }
}