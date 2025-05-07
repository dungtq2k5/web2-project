<?php

class ProductGateway {
  private PDO $conn;
  private ProductBrandGateway $brand;
  private ProductCategoryGateway $category;
  private Utils $utils;
  private string $upload_dir = "../uploads/products"; // Relative to index.php

  public function __construct(PDO $db_conn) {
    $this->conn = $db_conn;
    $this->brand = new ProductBrandGateway($db_conn);
    $this->category = new ProductCategoryGateway($db_conn);
    $this->utils = new Utils;
  }

  public function getAll(?int $limit=null, ?int $offset=null): array {
    $sql = "SELECT * FROM products WHERE is_deleted = false";

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
    while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
      unset($row["is_deleted"]);
      $row["brand"] = $this->brand->get((int) $row["brand_id"]);
      unset($row["brand_id"]);
      $row["category"] = $this->category->get((int) $row["category_id"]);
      unset($row["category_id"]);

      $data[] = $row;
    }

    return $data;
  }

  public function get(int $id): array | false {
    $sql = "SELECT * FROM products WHERE id = :id AND is_deleted = false";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":id", $id, PDO::PARAM_INT);
    $stmt->execute();

    if($product = $stmt->fetch(PDO::FETCH_ASSOC)) {
      unset($product["is_deleted"]);
      $product["brand"] = $this->brand->get($product["brand_id"]);
      unset($product["brand_id"]);
      $product["category"] = $this->category->get($product["category_id"]);
      unset($product["category_id"]);

      return $product;
    }

    return false;
  }

  public function create(array $data): array | false {
    $this->conn->beginTransaction();

    try {
      if(!$this->isUnique($data["name"], $data["model"])) { // Make sure unique constraints
        throw new Exception("Product name '{$data['name']}' with model '{$data['model']}' already exists, please choose another one", 409);
      }

      $sql = "INSERT INTO products (name, brand_id, model, category_id, description, stop_selling)
        VALUES (:name, :brand_id, :model, :category_id, :description, :stop_selling)";

      $stmt = $this->conn->prepare($sql);
      $stmt->bindValue(":name", $data["name"], PDO::PARAM_STR);
      $stmt->bindValue(":brand_id", $data["brand_id"], PDO::PARAM_INT);
      $stmt->bindValue(":model", $data["model"], PDO::PARAM_STR);
      $stmt->bindValue(":category_id", $data["category_id"], PDO::PARAM_INT);
      $stmt->bindValue(":description", $data["description"], PDO::PARAM_STR);
      $stmt->bindValue(":stop_selling", $this->utils->toBool($data["stop_selling"]), PDO::PARAM_BOOL);
      $stmt->execute();

      $id = $this->conn->lastInsertId();

      if(isset($data["image"]) && $this->utils->toNull($data["image"]) !== null) { // Only save image if succeed + image exist
        $img_name = $this->utils->saveFile($data["image"], $this->upload_dir);
        $this->updateImg($id, $img_name);
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

  public function update(array $current, array $new): array | false {
    $this->conn->beginTransaction();

    try {
      $name = $new["name"] ?? $current["name"];
      $model = $new["model"] ?? $current["model"];

      if(
        ($name !== $current["name"] || $model !== $current["model"]) &&
        !$this->isUnique($name, $model) // Make sure unique constraints
      ) throw new Exception("Product name '{$new['name']}' with model '{$new['model']}' already exists, please choose another one", 409);

      $sql = "UPDATE products SET
        name = :name,
        brand_id = :brand_id,
        model = :model,
        category_id = :category_id,
        description = :description,
        stop_selling = :stop_selling
        WHERE id = :id AND is_deleted = false
      ";

      $id = $current["id"];

      $stmt = $this->conn->prepare($sql);
      $stmt->bindValue(":name", $name, PDO::PARAM_STR);
      $stmt->bindValue(":brand_id", $new["brand_id"] ?? $current["brand"]["id"], PDO::PARAM_INT);
      $stmt->bindValue(":model", $model, PDO::PARAM_STR);
      $stmt->bindValue(":category_id", $new["category_id"] ?? $current["category"]["id"], PDO::PARAM_INT);
      $stmt->bindValue(":description", $new["description"] ?? $current["description"], PDO::PARAM_STR);
      $stmt->bindValue(":stop_selling", isset($new["stop_selling"]) ? $this->utils->toBool($new["stop_selling"]) : $current["stop_selling"], PDO::PARAM_BOOL);
      $stmt->bindValue(":id", $id, PDO::PARAM_INT);
      $stmt->execute();

      if(isset($new["image"])) { // Only update image if provided
        if($this->utils->toNull($new["image"]) === null) {
          $this->updateImg($id, null);
        } else {
          $img_name = $this->utils->saveFile($new["image"], $this->upload_dir);
          $this->updateImg($id, $img_name);
        }
        if($current["image_name"]) $this->utils->removeFile($current["image_name"], $this->upload_dir);
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
      $sql = $this->hasConstrain($id)
        ? "UPDATE products SET is_deleted = true WHERE id = :id AND is_deleted = false"
        : "DELETE FROM products WHERE id = :id";

      $img_name = $this->get($id)["image_name"];

      $stmt = $this->conn->prepare($sql);
      $stmt->bindValue(":id", $id, PDO::PARAM_INT);
      $stmt->execute();

      if($img_name) $this->utils->removeFile($img_name, $this->upload_dir);

      return $this->conn->commit();

    } catch(PDOException $e) {
      $this->conn->rollBack();
      throw $e; // Re-throw for centralized ErrorHandler
    } catch (Exception $e) {
      $this->conn->rollBack();
      throw $e; // Re-throw for centralized ErrorHandler
    }
  }

  private function hasConstrain(int $id): bool {
    $sql = "SELECT EXISTS (
      SELECT 1 FROM product_variations WHERE product_id = :product_id
      LIMIT 1
    )";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":product_id", $id, PDO::PARAM_INT);
    $stmt->execute();

    return (bool) $stmt->fetchColumn();
  }

  // This function doesn't have transaction, make sure to cover it when use.
  private function updateImg(int $id, string | null $img_name): bool {
    try {
      $sql = "UPDATE products SET image_name = :image_name WHERE id = :id AND is_deleted = false";

      $stmt = $this->conn->prepare($sql);
      $stmt->bindValue(":image_name", $img_name, PDO::PARAM_STR);
      $stmt->bindValue(":id", $id, PDO::PARAM_INT);
      
      return $stmt->execute();

    } catch(PDOException $e) {
      throw $e; // Re-throw for centralized ErrorHandler
    } catch(Exception $e) {
      throw $e; // Re-throw for centralized ErrorHandler
    }
  }

  private function isUnique(string $name, string $model): bool {
    $sql = "SELECT EXISTS (
      SELECT 1 FROM products WHERE name = :name AND model = :model AND is_deleted = false
      LIMIT 1
    )";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":name", $name, PDO::PARAM_STR);
    $stmt->bindValue(":model", $model, PDO::PARAM_STR);
    $stmt->execute();

    return !(bool) $stmt->fetchColumn();
  }
}
