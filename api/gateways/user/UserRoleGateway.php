<?php

class UserRoleGateway {
  private PDO $conn;
  private UserGateway $user;
  private RoleGateway $role;

  public function __construct(Database $db) {
    $this->conn = $db->getConnection();
    $this->user = new UserGateway($db);
    $this->role = new RoleGateway($db);
  }

  public function getAll(?int $limit, ?int $offset): array | false {
    if($limit && $offset) {
      $sql = "SELECT * FROM user_roles LIMIT :limit OFFSET :offset";
    } elseif($limit) {
      $sql = "SELECT * FROM user_roles LIMIT :limit";
    } elseif($offset) {
      $sql = "SELECT * FROM user_roles OFFSET :offset";
    } else {
      $sql = "SELECT * FROM user_roles";
    }

    $stmt = $this->conn->prepare($sql);
    if($limit) $stmt->bindValue(":limit", $limit, PDO::PARAM_INT);
    if($offset) $stmt->bindValue(":offset", $offset, PDO::PARAM_INT);

    if($stmt->execute()) {
      $data = [];
      while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $row["user"] = $this->user->get($row["user_id"]);
        unset($row["user_id"]);
        $row["role"] = $this->role->get($row["role_id"]);
        unset($row["role_id"]);
        $data[] = $row;
      }
      
      return $data;
    }
    
    return false;
  }

  public function create(array $data): array | false {
    $sql = "INSERT INTO user_roles (user_id, role_id)
      VALUES (:user_id, :role_id)";
    
    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":user_id", $data["user_id"], PDO::PARAM_INT);
    $stmt->bindValue(":role_id", $data["role_id"], PDO::PARAM_INT);
    $stmt->execute();

    return $this->get($data["user_id"], $data["role_id"]);
  }

  public function get(int $user_id, ?int $role_id): array | false {
    $sql = $user_id && $role_id 
      ? "SELECT * FROM user_roles WHERE user_id = :user_id AND role_id = :role_id"
      : "SELECT * FROM user_roles WHERE user_id = :user_id";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":user_id", $user_id, PDO::PARAM_INT);
    if($role_id) $stmt->bindValue(":role_id", $role_id, PDO::PARAM_INT);

    if($stmt->execute()) {
      $data = [];
      while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $row["user"] = $this->user->get($user_id);
        unset($row["user_id"]);
        $row["role"] = $this->role->get($row["role_id"]);
        unset($row["role_id"]);
        $data[] = $row;
      }

      return $data;
    }

    return false;
  }


  public function delete(int $user_id, int $role_id): bool {
    $sql = "DELETE FROM user_roles WHERE user_id = :user_id AND role_id = :role_id";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":user_id", $user_id, PDO::PARAM_INT);
    $stmt->bindValue(":role_id", $role_id, PDO::PARAM_INT);
    return $stmt->execute();
  }
}