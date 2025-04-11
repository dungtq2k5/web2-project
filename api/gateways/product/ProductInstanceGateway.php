<?php

class ProductInstanceGateway {
  private PDO $conn;
  private Utils $utils;
  private ProductGateway $product;
  private ProductVariationGateway $variation;
  private ProductCategoryGateway $category;
  private ProductBrandGateway $brand;

  public function __construct(Database $db) {
    $this->conn = $db->getConnection();
    $this->utils = new Utils();
    $this->product = new ProductGateway($db);
    $this->variation = new ProductVariationGateway($db);
    $this->category = new ProductCategoryGateway($db);
    $this->brand = new ProductBrandGateway($db);
  }

  public function create(array $data): array | false | Exception {
    $variation_id = $data["product_variation_id"];
    $variation = $this->variation->get($variation_id);
    if(!$variation) {
      $error_msg = "Product variation id '$variation_id' does not exist.";
      throw new Exception($error_msg, 400);
    }

    $product = $this->product->get($variation["product_id"]);
    $category = $this->category->get($product["category"]["id"]);
    $brand = $this->brand->get($product["brand"]["id"]);
    $sku = $this->utils->genProductSKU(
      $category["name"],
      $brand["name"],
      $product["model"],
      $variation["watch_size_mm"],
      $variation["watch_color"],
      $variation["band_material"]
    );
    $sql = "INSERT INTO product_instances (
      sku,
      product_variation_id,
      goods_receipt_note_id,
      is_sold
    ) VALUES (
      :sku,
      :product_variation_id,
      :goods_receipt_note_id,
      :is_sold
    )";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":sku", $sku, PDO::PARAM_STR);
    $stmt->bindValue(":product_variation_id", $variation_id, PDO::PARAM_INT);
    $stmt->bindValue(":goods_receipt_note_id", $data["goods_receipt_note_id"] ?? null, PDO::PARAM_INT);
    $stmt->bindValue(":is_sold", $this->utils->to_bool($data["is_sold"]), PDO::PARAM_BOOL);
    $stmt->execute();

    return $this->get($sku);
  }

  public function getAll(?int $limit, ?int $offset): array | false {
    if($limit && $offset) {
      $sql = "SELECT * FROM product_instances LIMIT :limit OFFSET :offset";
    } elseif($limit) {
      $sql = "SELECT * FROM product_instances LIMIT :limit";
    } elseif($offset) {
      $sql = "SELECT * FROM product_instances LIMIT 18446744073709551615 OFFSET :offset";
    } else {
      $sql = "SELECT * FROM product_instances";
    }

    $stmt = $this->conn->prepare($sql);
    if($limit) $stmt->bindValue(":limit", $limit, PDO::PARAM_INT);
    if($offset) $stmt->bindValue(":offset", $offset, PDO::PARAM_INT);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  public function get(string $sku): array | false {
    $sql = "SELECT * FROM product_instances WHERE sku = :sku";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":sku", $sku, PDO::PARAM_STR);
    $stmt->execute();

    return $stmt->fetch(PDO::FETCH_ASSOC);
  }

  public function update(array $current, array $new): array | false | Exception {
    if(
      isset($new["is_sold"]) &&
      $this->utils->to_bool($new["is_sold"]) === false &&
      $this->hasConstrain($current["sku"])
    ) {
      $error_msg = "Cannot change 'is_sold' from true to false when product instance '{$current["sku"]}' is already in order items.";
      throw new Exception($error_msg, 409);
    }

    $sql = "UPDATE product_instances SET
      goods_receipt_note_id = :goods_receipt_note_id,
      is_sold = :is_sold
      WHERE sku = :sku
    ";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":goods_receipt_note_id", $new["goods_receipt_note_id"] ?? $current["goods_receipt_note_id"], PDO::PARAM_INT);
    $stmt->bindValue(":is_sold", isset($new["is_sold"]) ? $this->utils->to_bool($new["is_sold"]) : $current["is_sold"], PDO::PARAM_BOOL);
    $stmt->bindValue(":sku", $current["sku"], PDO::PARAM_STR);
    $stmt->execute();

    return $this->get($current["sku"]);
  }

  public function delete(string $sku): bool {
    if($this->hasConstrain($sku)) return false;

    $sql = "DELETE FROM product_instances WHERE sku = :sku";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":sku", $sku, PDO::PARAM_STR);
    return $stmt->execute();
  }

  private function hasConstrain(string $sku): bool {
    $sql = "SELECT EXISTS (SELECT 1 FROM order_items WHERE product_instance_sku = :sku)";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":sku", $sku, PDO::PARAM_STR);
    $stmt->execute();

    return (bool) $stmt->fetchColumn();
  }

}