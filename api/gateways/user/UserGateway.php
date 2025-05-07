<?php

class UserGateway {
  private PDO $conn;
  private UserRoleGateway $user_role;
  private UserAddressGateway $user_address;
  private CartGateway $cart;
  private Utils $utils;
  private RolePermissionGateway $role_permission;

  public function __construct(PDO $db_conn) {
    $this->conn = $db_conn;
    $this->user_role = new UserRoleGateway($db_conn);
    $this->user_address = new UserAddressGateway($db_conn);
    $this->cart = new CartGateway($db_conn);
    $this->utils = new Utils;
    $this->role_permission = new RolePermissionGateway($db_conn);
  }

  public function getAll(?int $limit=null, ?int $offset=null): array {
    $sql = "SELECT * FROM users WHERE is_deleted = false";

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
    while($user = $stmt->fetch(PDO::FETCH_ASSOC)) {
      unset($user["password"]);
      unset($user["is_deleted"]);
      $user["addresses"] = $this->user_address->getByUserId($user["id"]);
      $user["roles"] = $this->user_role->getByUserId($user["id"]);
      $user["cart"] = $this->cart->getByUserId($user["id"]);
      $data[] = $user;
    }

    return $data;
  }

  public function get(int $id, bool $permission_include=false): array | false {
    $sql = "SELECT * FROM users WHERE id = :id AND is_deleted = false";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":id", $id, PDO::PARAM_INT);
    $stmt->execute();

    if($user = $stmt->fetch(PDO::FETCH_ASSOC)) {
      unset($user["is_deleted"]);
      $user["addresses"] = $this->user_address->getByUserId($id);
      $user["roles"] = $this->user_role->getByUserId($id);
      $user["cart"] = $this->cart->getByUserId($id);

      if($permission_include) {
        foreach($user["roles"] as &$role) {
          $role["permissions"] = array_column(
            $this->role_permission->getByRoleIdMinimal($role["id"]),
            "action_code"
          );
        }
      }

      return $user;
    }

    return false;
  }

  public function create(array $data, bool $permission_include=false): array | false {
    $this->conn->beginTransaction();

    try {
      if(!$this->isEmailUnique($data["email"])) { // Make sure unique constraints
        throw new Exception("Email '{$data['email']}' already exists, please choose another one", 409);
      }

      $sql = "INSERT INTO users (full_name, email, phone_number, password)
        VALUES (:full_name, :email, :phone_number, :password)";

      $stmt = $this->conn->prepare($sql);
      $stmt->bindValue(":full_name", $data["full_name"], PDO::PARAM_STR);
      $stmt->bindValue(":email", $data["email"], PDO::PARAM_STR);
      $stmt->bindValue(":phone_number", $data["phone_number"], PDO::PARAM_STR);
      $stmt->bindValue(":password", password_hash($data["password"], PASSWORD_DEFAULT), PDO::PARAM_STR);
      $stmt->execute();

      $id = $this->conn->lastInsertId();

      if($data["roles_id"]) {
        $this->user_role->createMultiple($id, $data["roles_id"]);
      } else {
        $this->user_role->createMultiple($id, [BUYER_ROLE_ID]); // Default when a user is created is a buyer
      }

      $this->conn->commit();
      return $this->get($id, $permission_include);

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

      if($id == ADMIN_ID) { // Cannot modify admin account
        throw new Exception("Forbidden: User cannot make any changes to base admin account", 403);
      }

      $new_email = $new["email"];

      if( // Make sure unique constraints
        $new_email &&
        $new_email !== $current["email"] &&
        !$this->isEmailUnique($new_email)
      ) throw new Exception("Email '{$new['email']}' already exists, please choose another one", 409);

      $sql = "UPDATE users SET
        full_name = :full_name,
        email = :email,
        phone_number = :phone_number,
        password = :password
        WHERE id = :id AND is_deleted = false
      ";

      $stmt = $this->conn->prepare($sql);
      $stmt->bindValue(":full_name", $new["full_name"] ?? $current["full_name"], PDO::PARAM_STR);
      $stmt->bindValue(":email", $new_email ?? $current["email"], PDO::PARAM_STR);
      $stmt->bindValue(":phone_number", $new["phone_number"] ?? $current["phone_number"], PDO::PARAM_STR);
      $stmt->bindValue(":password", $new["password"] ? password_hash($new["password"], PASSWORD_DEFAULT) : $current["password"], PDO::PARAM_STR);
      $stmt->bindValue(":id", $id, PDO::PARAM_INT);
      $stmt->execute();

      if(
        isset($new["roles_id"]) &&
        !$this->utils->compareArrays($new["roles_id"], array_column($current["roles"], "id"))
      ) {
        $this->user_role->updateMultiple($id, $new["roles_id"]);
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
      if($id == ADMIN_ID) { // Cannot modify admin account
        throw new Exception("Forbidden: User cannot make any changes to base admin account", 403);
      }

      $sql = $this->hasConstrain($id)
        ? "UPDATE users SET is_deleted = true WHERE id = :id AND is_deleted = false"
        : "DELETE FROM users WHERE id = :id";

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

  public function getByEmailPassword(string $email, string $pwd, bool $permission_include=false): array | false {
    $sql = "SELECT id, password FROM users WHERE email = :email AND is_deleted = false";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":email", $email, PDO::PARAM_STR);
    $stmt->execute();

    $usr = $stmt->fetch(PDO::FETCH_ASSOC);
    if(!$usr || !password_verify($pwd, $usr["password"])) {
      return false;
    }

    return $this->get($usr["id"], $permission_include);
  }

  private function hasConstrain(int $id): bool {
    $sql = "SELECT EXISTS (
      (SELECT 1 FROM user_addresses WHERE user_id = :user_id LIMIT 1)
      UNION
      (SELECT 1 FROM user_roles WHERE user_id = :user_id LIMIT 1)
      UNION
      (SELECT 1 FROM carts WHERE user_id = :user_id LIMIT 1)
      UNION
      (SELECT 1 FROM orders WHERE user_id = :user_id LIMIT 1)
      UNION
      (SELECT 1 FROM goods_receipt_notes WHERE staff_id = :user_id LIMIT 1)
    )";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":user_id", $id, PDO::PARAM_INT);
    $stmt->execute();

    return (bool) $stmt->fetchColumn();
  }

  private function isEmailUnique(string $email): bool {
    $sql = "SELECT EXISTS (
      SELECT 1 FROM users WHERE email = :email AND is_deleted = false
      LIMIT 1
    )";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":email", $email, PDO::PARAM_STR);
    $stmt->execute();

    return !(bool) $stmt->fetchColumn();
  }

}
