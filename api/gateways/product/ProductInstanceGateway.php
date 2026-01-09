<?php

class ProductInstanceGateway
{
  private PDO $conn;
  private Utils $utils;
  private ProductGateway $product;
  private ProductVariationGateway $variation;
  private ProductCategoryGateway $category;
  private ProductBrandGateway $brand;

  public function __construct(PDO $db_conn)
  {
    $this->conn = $db_conn;
    $this->utils = new Utils;
    $this->product = new ProductGateway($db_conn);
    $this->variation = new ProductVariationGateway($db_conn);
    $this->category = new ProductCategoryGateway($db_conn);
    $this->brand = new ProductBrandGateway($db_conn);
  }

  public function getAll(?int $limit = null, ?int $offset = null): array
  {
    $sql = "SELECT
      sku,
      supplier_serial_number,
      supplier_imei_number,
      product_variation_id,
      goods_receipt_note_id,
      is_sold
      FROM product_instances WHERE is_deleted = false";

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

  public function get(string $sku): array | false
  {
    $sql = "SELECT
      sku,
      supplier_serial_number,
      supplier_imei_number,
      product_variation_id,
      goods_receipt_note_id,
      is_sold
      FROM product_instances WHERE sku = :sku AND is_deleted = false";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":sku", $sku, PDO::PARAM_STR);
    $stmt->execute();

    return $stmt->fetch(PDO::FETCH_ASSOC);
  }

  public function create(array $data): array | false
  {
    $this->conn->beginTransaction();

    try {
      $variation_id = $data["product_variation_id"];
      $variation = $this->variation->get($variation_id);
      if (!$variation) {
        $error_msg = "Product variation id '$variation_id' does not exist.";
        throw new Exception($error_msg, 400);
      }

      $serial_number = $data["supplier_serial_number"];
      if (!$this->isUniqueSerialNumber($serial_number)) { // Make sure serial number is unique
        $error_msg = "Supplier serial number '$serial_number' already exists.";
        throw new Exception($error_msg, 409);
      }

      $imei_number = array_key_exists("supplier_imei_number", $data) // Not use isset because of nullable value
        ? $this->utils->toNull($data["supplier_imei_number"])
        : null;
      if ($imei_number && !$this->isUniqueIMEINumber($imei_number)) { // Make sure imei number is unique if provided
        $error_msg = "Supplier IMEI number '$imei_number' already exists.";
        throw new Exception($error_msg, 409);
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
        supplier_serial_number,
        supplier_imei_number,
        goods_receipt_note_id,
        is_sold
      ) VALUES (
        :sku,
        :product_variation_id,
        :supplier_serial_number,
        :supplier_imei_number,
        :goods_receipt_note_id,
        :is_sold
      )";

      $goods_receipt_note_id = array_key_exists("goods_receipt_note_id", $data)
        ? $this->utils->toNull($data["goods_receipt_note_id"])
        : null;

      $is_sold = $this->utils->toBool($data["is_sold"]);

      $stmt = $this->conn->prepare($sql);
      $stmt->bindValue(":sku", $sku, PDO::PARAM_STR);
      $stmt->bindValue(":product_variation_id", $variation_id, PDO::PARAM_INT);
      $stmt->bindValue(":supplier_serial_number", $serial_number, PDO::PARAM_STR);
      $stmt->bindValue(":supplier_imei_number", $imei_number, PDO::PARAM_STR); // IMEI only has for cellular models
      $stmt->bindValue(":goods_receipt_note_id", $goods_receipt_note_id, PDO::PARAM_INT);
      $stmt->bindValue(":is_sold", $is_sold, PDO::PARAM_BOOL);
      $stmt->execute();

      if ($is_sold === false) $this->variation->updateStock($variation_id, 1); // Only update stock when create with is_sold = false

      $this->conn->commit();
      return $this->get($sku);
    } catch (Exception $e) {
      $this->conn->rollBack();
      throw $e; // Re-throw for centralized ErrorHandler
    }
  }

  public function update(array $current, array $new): array | false
  {
    $this->conn->beginTransaction();

    try {
      $new_serial_number = $new["supplier_serial_number"] ?? null;

      if ( // Make sure serial number is unique
        $new_serial_number &&
        $new_serial_number !== $current["supplier_serial_number"] &&
        !$this->isUniqueSerialNumber($new_serial_number)
      ) {
        $error_msg = "Supplier serial number '$new_serial_number' already exists.";
        throw new Exception($error_msg, 409);
      }


      $imei_number = array_key_exists("supplier_imei_number", $new) // Do not use `isset` because the value can be nullable
        ? $this->utils->toNull($new["supplier_imei_number"])
        : $current["supplier_imei_number"];

      if ( // Make sure imei number is unique
        $imei_number &&
        $imei_number !== $current["supplier_imei_number"] &&
        !$this->isUniqueIMEINumber($imei_number)
      ) {
        $error_msg = "Supplier IMEI number '$imei_number' already exists.";
        throw new Exception($error_msg, 409);
      }

      if ( // Cannot update is_sold from true to false when item is in order
        isset($new["is_sold"]) &&
        $this->utils->toBool($new["is_sold"]) === false &&
        $this->hasConstrain($current["sku"])
      ) {
        $error_msg = "Cannot change 'is_sold' from true to false when product instance '{$current["sku"]}' is already in order items.";
        throw new Exception($error_msg, 409);
      }

      $sql = "UPDATE product_instances SET
        supplier_serial_number = :supplier_serial_number,
        supplier_imei_number = :supplier_imei_number,
        goods_receipt_note_id = :goods_receipt_note_id,
        is_sold = :is_sold
        WHERE sku = :sku AND is_deleted = false
      ";

      $goods_receipt_note_id = array_key_exists("goods_receipt_note_id", $new) // Not use isset because of nullable value
        ? $this->utils->toNull($new["goods_receipt_note_id"])
        : $current["goods_receipt_note_id"];

      $stmt = $this->conn->prepare($sql);
      $stmt->bindValue(":supplier_serial_number", $new_serial_number ?? $current["supplier_serial_number"], PDO::PARAM_STR);
      $stmt->bindValue(":supplier_imei_number", $imei_number, PDO::PARAM_STR);
      $stmt->bindValue(":goods_receipt_note_id", $goods_receipt_note_id, PDO::PARAM_INT);
      $stmt->bindValue(":is_sold", isset($new["is_sold"]) ? $this->utils->toBool($new["is_sold"]) : $current["is_sold"], PDO::PARAM_BOOL);
      $stmt->bindValue(":sku", $current["sku"], PDO::PARAM_STR);
      $stmt->execute();

      if (isset($new["is_sold"])) {
        $is_sold = $this->utils->toBool($new["is_sold"]);
        // is_sold from false to true -> stock--
        // is_sold from true to false -> stock++
        if ($is_sold !== $current["is_sold"]) {
          $this->variation->updateStock($current["product_variation_id"], $current["is_sold"] - $is_sold);
        }
      }

      $this->conn->commit();
      return $this->get($current["sku"]);
    } catch (Exception $e) {
      $this->conn->rollBack();
      throw $e; // Re-throw for centralized ErrorHandler
    }
  }

  public function delete(array $instances): bool
  {
    $this->conn->beginTransaction();

    try {
      $sql = $this->hasConstrain($instances["sku"])
        ? "UPDATE product_instances SET is_deleted = true WHERE sku = :sku AND is_deleted = false"
        : "DELETE FROM product_instances WHERE sku = :sku";

      $stmt = $this->conn->prepare($sql);
      $stmt->bindValue(":sku", $instances["sku"], PDO::PARAM_STR);
      $stmt->execute();

      if ($instances["is_sold"] == false) {  // Only update stock when is_sold = false
        $this->variation->updateStock($instances["product_variation_id"], -1);
      }

      return $this->conn->commit();
    } catch (Exception $e) {
      $this->conn->rollBack();
      throw $e; // Re-throw for centralized ErrorHandler
    }
  }

  private function hasConstrain(string $sku): bool
  {
    $sql = "SELECT EXISTS (
      SELECT 1 FROM order_items WHERE product_instance_sku = :sku
      LIMIT 1
    )";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":sku", $sku, PDO::PARAM_STR);
    $stmt->execute();

    return (bool) $stmt->fetchColumn();
  }

  private function isUniqueSerialNumber(string $serial_number): bool
  {
    $sql = "SELECT EXISTS (
      SELECT 1 FROM product_instances WHERE supplier_serial_number = :serial_number AND is_deleted = false
      LIMIT 1
    )";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":serial_number", $serial_number, PDO::PARAM_STR);
    $stmt->execute();

    return !(bool) $stmt->fetchColumn();
  }

  private function isUniqueIMEINumber(string $imei_number): bool
  {
    $sql = "SELECT EXISTS (
      SELECT 1 FROM product_instances WHERE supplier_imei_number = :imei_number AND is_deleted = false
      LIMIT 1
      )";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":imei_number", $imei_number, PDO::PARAM_STR);
    $stmt->execute();

    return !(bool) $stmt->fetchColumn();
  }
}
