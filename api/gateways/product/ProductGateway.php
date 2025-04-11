<?php

class ProductGateway {
  private PDO $conn;
  private ProductBrandGateway $brand;
  private ProductCategoryGateway $category;
  private Utils $utils;
  private string $upload_dir = "../uploads/products"; // Relative to index.php

  public function __construct(Database $db) {
    $this->conn = $db->getConnection();
    $this->brand = new ProductBrandGateway($db);
    $this->category = new ProductCategoryGateway($db);
    $this->utils = new Utils;
  }

  public function getAll(?int $limit, ?int $offset): array | false {
    if($limit && $offset) {
      $sql = "SELECT * FROM products LIMIT :limit OFFSET :offset";
    } elseif($limit) {
      $sql = "SELECT * FROM products LIMIT :limit";
    } elseif($offset) {
      $sql = "SELECT * FROM products LIMIT 18446744073709551615 OFFSET :offset";
    } else {
      $sql = "SELECT * FROM products";
    }
    $stmt = $this->conn->prepare($sql);
    if($limit) $stmt->bindValue(":limit", $limit, PDO::PARAM_INT);
    if($offset) $stmt->bindValue(":offset", $offset, PDO::PARAM_INT);

    if($stmt->execute()) {
      $data = [];
      while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $row["brand"] = $this->brand->get((int) $row["brand_id"]);
        unset($row["brand_id"]);
        $row["category"] = $this->category->get((int) $row["category_id"]);
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
    $stmt->bindValue(":stop_selling", $this->utils->to_bool($data["stop_selling"]), PDO::PARAM_BOOL);

    if($stmt->execute()) {
      $id = $this->conn->lastInsertId();

      if(isset($data["image"]) && $data["image"] !== "null") { // Only save image if succeed + image exist
        $img_name = $this->utils->saveFile($data["image"], $this->upload_dir);
        $this->updateImg($id, $img_name);
      }

      return $this->get($id);
    }

    return false;
  }

  public function get(int $id): array | false {
    $sql = "SELECT * FROM products WHERE id = :id";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":id", $id, PDO::PARAM_INT);

    if($stmt->execute() && $product = $stmt->fetch(PDO::FETCH_ASSOC)) {
      $product["brand"] = $this->brand->get((int) $product["brand_id"]);
      unset($product["brand_id"]);
      $product["category"] = $this->category->get((int) $product["category_id"]);
      unset($product["category_id"]);

      return $product;
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
    $stmt->bindValue(":brand_id", $new["brand_id"] ?? $current["brand"]["id"], PDO::PARAM_INT);
    $stmt->bindValue(":model", $new["model"] ?? $current["model"], PDO::PARAM_STR);
    $stmt->bindValue(":category_id", $new["category_id"] ?? $current["category"]["id"], PDO::PARAM_INT);
    $stmt->bindValue(":description", $new["description"] ?? $current["description"], PDO::PARAM_STR);
    $stmt->bindValue(":stop_selling", isset($new["stop_selling"]) ? $this->utils->to_bool($new["stop_selling"]) : $current["stop_selling"], PDO::PARAM_BOOL);
    $stmt->bindValue(":id", $current["id"], PDO::PARAM_INT);

    if($stmt->execute() && isset($new["image"])) { // Only update image when succeed + image exist
      if($new["image"] === "null") {
        $this->updateImg($current["id"], null);
      } else {
        $img_name = $this->utils->saveFile($new["image"], $this->upload_dir);
        $this->updateImg($current["id"], $img_name);
      }
      if($current["image_name"]) $this->utils->removeFile($current["image_name"], $this->upload_dir);
    }

    return $this->get($current["id"]);
  }

  public function delete(int $id): bool {
    if($this->hasConstrain($id)) return false;

    $sql = "DELETE FROM products WHERE id = :id";
    $img_name = $this->get($id)["image_name"];

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":id", $id, PDO::PARAM_INT);

    if($stmt->execute()) {
      if($img_name) return $this->utils->removeFile($img_name, $this->upload_dir);
      return true;
    }

    return false;
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

  private function updateImg(int $id, string | null $img_name): bool {
    $sql = "UPDATE products SET image_name = :image_name WHERE id = :id";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":image_name", $img_name, PDO::PARAM_STR);
    $stmt->bindValue(":id", $id, PDO::PARAM_INT);

    return $stmt->execute();
  }
}
