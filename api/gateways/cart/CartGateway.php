<?php

class CartGateway {
  private PDO $conn;
  private ProductVariationGateway $variation;

  public function __construct(PDO $db_conn) {
    $this->conn = $db_conn;
    $this->variation = new ProductVariationGateway($db_conn);
  }

  public function getAll(?int $limit=null, ?int $offset=null): array {
    $sql = "SELECT * FROM carts";

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

  public function get(int $user_id, ?int $product_variation_id=null): array | false {
    $sql = "SELECT * FROM carts WHERE user_id = :user_id";

    if($product_variation_id) {
      $sql .= " AND product_variation_id = :product_variation_id";
    }

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":user_id", $user_id, PDO::PARAM_INT);
    if($product_variation_id) $stmt->bindValue(":product_variation_id", $product_variation_id, PDO::PARAM_INT);
    $stmt->execute();

    if($data = $stmt->fetchAll(PDO::FETCH_ASSOC)) {
      return count($data) === 1 ? $data[0] : $data;
    }

    return false;
  }

  public function create(array $data): array | false {
    $this->conn->beginTransaction();

    try {
      $user_id = $data["user_id"];
      $product_variation_id = $data["product_variation_id"];
      $quantity = $data["quantity"] ?? 1;

      $exist_cart = $this->get($user_id, $product_variation_id);
      if($exist_cart) {
        $quantity += $exist_cart["quantity"];
      }

      if($quantity > $this->variation->getStock($product_variation_id)) {
        throw new Exception("Quantity exceeds stock", 409);
      }

      $sql = $exist_cart
        ? "UPDATE carts SET quantity = :quantity WHERE user_id = :user_id AND product_variation_id = :product_variation_id"
        : "INSERT INTO carts (user_id, product_variation_id, quantity) VALUES (:user_id, :product_variation_id, :quantity)";

      $stmt = $this->conn->prepare($sql);
      $stmt->bindValue(":user_id", $user_id, PDO::PARAM_INT);
      $stmt->bindValue(":product_variation_id", $product_variation_id, PDO::PARAM_INT);
      $stmt->bindValue(":quantity", $quantity, PDO::PARAM_INT);
      $stmt->execute();

      $this->conn->commit();
      return $this->get($user_id, $product_variation_id);

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
      $new_quantity = $new["quantity"];

      if($new_quantity == $current["quantity"]) {
        throw new Exception("No changes detected, no update performed", 200);
      }

      $product_variation_id = $current["product_variation_id"];
      if($new_quantity > $this->variation->getStock($product_variation_id)) {
        throw new Exception("Quantity exceeds stock", 409);
      }

      $user_id = $current["user_id"];

      $sql = "UPDATE carts SET
        quantity = :quantity
        WHERE user_id = :user_id AND product_variation_id = :product_variation_id
      ";

      $stmt = $this->conn->prepare($sql);
      $stmt->bindValue(":quantity", $new_quantity, PDO::PARAM_INT);
      $stmt->bindValue(":user_id", $user_id, PDO::PARAM_INT);
      $stmt->bindValue(":product_variation_id", $product_variation_id, PDO::PARAM_INT);
      $stmt->execute();

      $this->conn->commit();
      return $this->get($user_id, $product_variation_id);

    } catch(PDOException $e) {
      $this->conn->rollBack();
      throw $e; // Re-throw for centralized ErrorHandler
    } catch(Exception $e) {
      $this->conn->rollBack();
      throw $e; // Re-throw for centralized ErrorHandler
    }
  }

  public function delete(int $user_id, int $product_variation_id): bool {
    $this->conn->beginTransaction();

    try {
      $sql = "DELETE FROM carts WHERE user_id = :user_id AND product_variation_id = :product_variation_id";

      $stmt = $this->conn->prepare($sql);
      $stmt->bindValue(":user_id", $user_id, PDO::PARAM_INT);
      $stmt->bindValue(":product_variation_id", $product_variation_id, PDO::PARAM_INT);
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

  public function getByUserId(int $user_id, ?int $limit=null, ?int $offset=null): array {
    $sql = "SELECT product_variation_id, quantity FROM carts WHERE user_id = :user_id";

    if($limit !== null && $offset !== null) {
      $sql .= " LIMIT :limit OFFSET :offset";
    } elseif($limit !== null) {
      $sql .= " LIMIT :limit";
    } elseif($offset !== null) {
      $sql .= " LIMIT 18446744073709551615 OFFSET :offset";
    }

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":user_id", $user_id, PDO::PARAM_INT);
    if($limit !== null) $stmt->bindValue(":limit", $limit, PDO::PARAM_INT);
    if($offset !== null) $stmt->bindValue(":offset", $offset, PDO::PARAM_INT);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

}