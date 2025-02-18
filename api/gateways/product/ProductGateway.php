<?php

class ProductGateway {
  private PDO $conn;
  private ProductBrandGateway $brand;
  private ProductCategoryGateway $category;

  public function __construct(Database $db) {
    $this->conn = $db->getConnection();
    $this->brand = new ProductBrandGateway($db);
    $this->category = new ProductCategoryGateway($db);
  }

  public function getAll(?int $limit, ?int $offset): array | false {
    if($limit && $offset) {
      $sql = "SELECT * FROM products LIMIT :limit OFFSET :offset";
    } elseif($limit) {
      $sql = "SELECT * FROM products LIMIT :limit";
    } elseif($offset) {
      $sql = "SELECT * FROM products OFFSET :offset";
    } else {
      $sql = "SELECT * FROM products";
    }
    $stmt = $this->conn->prepare($sql);
    if($limit) $stmt->bindValue(":limit", $limit, PDO::PARAM_INT);
    if($offset) $stmt->bindValue(":offset", $offset, PDO::PARAM_INT);

    if($stmt->execute()) {
      $data = [];
      while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $row["brand"] = $this->brand->get($row["brand_id"]);
        unset($row["brand_id"]);
        $row["category"] = $this->brand->get($row["category_id"]);
        unset($row["category_id"]);
        $data[] = $row;
      }

      return $data;
    }
    return false;
  }

  public function create(array $data): array | false {
    $sql = "INSERT INTO products (name, brand_id, model, category_id, description, stop_selling)
      VALUES (:name, :brand_id, :model, :category_id, :description, :stop_selling)";
    
    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":name", $data["name"], PDO::PARAM_STR);
    $stmt->bindValue(":brand_id", $data["brand_id"], PDO::PARAM_INT);
    $stmt->bindValue(":model", $data["model"], PDO::PARAM_STR);
    $stmt->bindValue(":category_id", $data["category_id"], PDO::PARAM_INT);
    $stmt->bindValue(":description", $data["description"], PDO::PARAM_STR);
    $stmt->bindValue(":stop_selling", $data["stop_selling"] ?? false, PDO::PARAM_BOOL);
    $stmt->execute();

    $id = $this->conn->lastInsertId();
    return $this->get($id);
  }

  public function get(string $id): array | false {
    $sql = "SELECT * FROM products WHERE id = :id";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":id", $id, PDO::PARAM_INT);
    
    if($stmt->execute()) {
      $data = $stmt->fetch(PDO::FETCH_ASSOC);

      $data["brand"] = $this->brand->get($data["brand_id"]);
      unset($data["brand_id"]);
      $data["category"] = $this->category->get($data["category_id"]);
      unset($data["category_id"]);
      
      return $data;
    }

    return false;
  }

  public function update(array $current, array $new): array | false {
    $sql = "UPDATE products SET
      name = :name,
      brand_id = :brand_id,
      model = :model,
      category_id = :category_id,
      description = :description,
      stop_selling = :stop_selling
      WHERE id = :id
    ";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":name", $new["name"] ?? $current["name"], PDO::PARAM_STR);
    $stmt->bindValue(":brand_id", $new["brand_id"] ?? $current["brand_id"], PDO::PARAM_INT);
    $stmt->bindValue(":model", $new["model"] ?? $current["model"], PDO::PARAM_STR);
    $stmt->bindValue(":category_id", $new["category_id"] ?? $current["category_id"], PDO::PARAM_INT);
    $stmt->bindValue(":description", $new["description"] ?? $current["description"], PDO::PARAM_STR);
    $stmt->bindValue(":stop_selling", $new["stop_selling"] ?? $current["stop_selling"], PDO::PARAM_BOOL);
    $stmt->bindValue(":id", $current["id"], PDO::PARAM_INT);
    $stmt->execute();

    return $this->get($current["id"]);
  }

  public function delete(int $id): bool {
    $sql = $this->hasConstrain($id)
      ? "UPDATE products SET stop_selling = true WHERE id = :id"
      : "DELETE FROM products WHERE id = :id";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":id", $id, PDO::PARAM_INT);
    return $stmt->execute();
  }

  private function hasConstrain(int $id): bool {
    $sql = "SELECT EXISTS (
      SELECT 1 FROM product_variations WHERE product_id = :product_id
    )";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":product_id", $id, PDO::PARAM_INT);
    $stmt->execute();

    return (bool) $stmt->fetchColumn();
  }
}