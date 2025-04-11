<?php

class UserGateway {
  private PDO $conn;
  private UserRoleGateway $userRole;
  private UserAddressGateway $userAddress;
  private CartGateway $cart;

  public function __construct(Database $db) {
    $this->conn = $db->getConnection();
    $this->userRole = new UserRoleGateway($db);
    $this->userAddress = new UserAddressGateway($db);
    $this->cart = new CartGateway($db);
  }

  public function getAll(?int $limit, ?int $offset): array | false {
    if($limit && $offset) {
      $sql = "SELECT * FROM users LIMIT :limit OFFSET :offset";
    } elseif($limit) {
      $sql = "SELECT * FROM users LIMIT :limit";
    } elseif($offset) {
      $sql = "SELECT * FROM users LIMIT 18446744073709551615 OFFSET :offset";
    } else {
      $sql = "SELECT * FROM users";
    }

    $stmt = $this->conn->prepare($sql);
    if($limit) $stmt->bindValue(":limit", $limit, PDO::PARAM_INT);
    if($offset) $stmt->bindValue(":offset", $offset, PDO::PARAM_INT);

    if($stmt->execute()) {
      $data = [];
      while($user = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $user["addresses"] = $this->userAddress->getByUserId((int) $user["id"]);
        $user["roles"] = $this->userRole->getByUserId((int) $user["id"]);
        $user["cart"] = $this->cart->getByUserId((int) $user["id"]);
        $data[] = $user;
      }
      return $data;
    }

    return false;
  }

  public function create(array $data): array | false {
    $sql = "INSERT INTO users (full_name, email, phone_number, password)
      VALUES (:full_name, :email, :phone_number, :password)";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":full_name", $data["full_name"], PDO::PARAM_STR);
    $stmt->bindValue(":email", $data["email"], PDO::PARAM_STR);
    $stmt->bindValue(":phone_number", $data["phone_number"], PDO::PARAM_STR);
    $stmt->bindValue(":password", password_hash($data["password"], PASSWORD_DEFAULT), PDO::PARAM_STR);
    $stmt->execute();

    $id = $this->conn->lastInsertId();
    if($data["roles_id"]) $this->createRoles($id, $data["roles_id"]);

    return $this->get($id);
  }

  private function createRoles(int $user_id, array $roles_id): void {
    foreach($roles_id as $role_id) {
      $this->userRole->create([
        "user_id" => $user_id,
        "role_id" => $role_id
      ]);
    }
  }

  public function get(int $id): array | false {
    $sql = "SELECT * FROM users WHERE id = :id";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":id", $id, PDO::PARAM_INT);

    if($stmt->execute() && $user = $stmt->fetch(PDO::FETCH_ASSOC)) {
      $user["addresses"] = $this->userAddress->getByUserId((int) $user["id"]);
      $user["roles"] = $this->userRole->getByUserId((int) $user["id"]);
      $user["cart"] = $this->cart->getByUserId((int) $user["id"]);
      return $user;
    }

    return false;
  }

  public function update(array $current, array $new): array | false {
    $sql = "UPDATE users SET
      full_name = :full_name,
      email = :email,
      phone_number = :phone_number,
      password = :password
      WHERE id = :id
    ";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":full_name", $new["full_name"] ?? $current["full_name"], PDO::PARAM_STR);
    $stmt->bindValue(":email", $new["email"] ?? $current["email"], PDO::PARAM_STR);
    $stmt->bindValue(":phone_number", $new["phone_number"] ?? $current["phone_number"], PDO::PARAM_STR);
    $stmt->bindValue(":password", $new["password"] ? password_hash($new["password"], PASSWORD_DEFAULT) : $current["password"], PDO::PARAM_STR);
    $stmt->bindValue(":id", $current["id"], PDO::PARAM_INT);
    $stmt->execute();

    if(isset($new["roles_id"])) $this->updateRoles($current["id"], $new["roles_id"]);

    return $this->get($current["id"]);
  }

  private function updateRoles(int $user_id, array $roles_id): void { //delete all current roles -> create new ones
    $this->userRole->deleteByUserId($user_id);
    $this->createRoles($user_id, $roles_id);
  }

  public function delete(int $id): bool {
    if($this->hasConstrain($id)) return false;

    $sql = "DELETE FROM users WHERE id = :id";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":id", $id, PDO::PARAM_INT);
    return $stmt->execute();
  }

  private function hasConstrain(int $id): bool {
    $sql = "SELECT EXISTS (
      SELECT 1 FROM user_addresses WHERE user_id = :user_id
      UNION
      SELECT 1 FROM user_roles WHERE user_id = :user_id
      UNION
      SELECT 1 FROM carts WHERE user_id = :user_id
      UNION
      SELECT 1 FROM orders WHERE user_id = :user_id
      UNION
      SELECT 1 FROM goods_receipt_notes WHERE staff_id = :user_id
    )";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":user_id", $id, PDO::PARAM_INT);
    $stmt->execute();

    return (bool) $stmt->fetchColumn();
  }

  public function getByEmailPassword(string $email, string $pwd): array | false {
    $sql = "SELECT id, password FROM users WHERE email = :email";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":email", $email, PDO::PARAM_STR);
    $stmt->execute();

    $usr = $stmt->fetch(PDO::FETCH_ASSOC);
    if(!$usr || !password_verify($pwd, $usr["password"])) {
      return false;
    }

    return $this->get($usr["id"]);
  }
}
