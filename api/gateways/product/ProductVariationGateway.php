<?php

class ProductVariationGateway {
  private PDO $conn;
  private ProductOSGateway $os;
  private Utils $utils;
  private string $upload_dir = "../uploads/variations"; // Relative to index.php

  public function __construct(PDO $db_conn) {
    $this->conn = $db_conn;
    $this->os = new ProductOSGateway($db_conn);
    $this->utils = new Utils;
  }

  public function getAll(?int $limit=null, ?int $offset=null): array {
    $sql = "SELECT * FROM product_variations WHERE is_deleted = false";

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
      $row["os"] = $this->os->get((int) $row["os_id"]);
      unset($row["os_id"]);
      $data[] = $row;
    }

    return $data;
  }

  public function get(int $id): array | false {
    $sql = "SELECT * FROM product_variations WHERE id = :id AND is_deleted = false";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":id", $id, PDO::PARAM_INT);
    $stmt->execute();

    if($data = $stmt->fetch(PDO::FETCH_ASSOC)) {
      unset($data["is_deleted"]);
      $data["os"] = $this->os->get($data["os_id"]);
      unset($data["os_id"]);

      return $data;
    }

    return false;
  }

  public function create(array $data): array | false {
    $this->conn->beginTransaction();

    try {
      $sql = "INSERT INTO product_variations (
        product_id,
        watch_size_mm,
        watch_color,
        price_cents,
        base_price_cents,
        display_size_mm,
        display_type,
        resolution_h_px,
        resolution_w_px,
        ram_bytes,
        rom_bytes,
        os_id,
        connectivity,
        battery_life_mah,
        water_resistance_value,
        water_resistance_unit,
        sensor,
        case_material,
        band_material,
        band_size_mm,
        band_color,
        weight_milligrams,
        release_date,
        stop_selling
      ) VALUES (
        :product_id,
        :watch_size_mm,
        :watch_color,
        :price_cents,
        :base_price_cents,
        :display_size_mm,
        :display_type,
        :resolution_h_px,
        :resolution_w_px,
        :ram_bytes,
        :rom_bytes,
        :os_id,
        :connectivity,
        :battery_life_mah,
        :water_resistance_value,
        :water_resistance_unit,
        :sensor,
        :case_material,
        :band_material,
        :band_size_mm,
        :band_color,
        :weight_milligrams,
        :release_date,
        :stop_selling
      )";

      $stmt = $this->conn->prepare($sql);
      $stmt->bindValue(":product_id", $data["product_id"], PDO::PARAM_INT);
      $stmt->bindValue(":watch_size_mm", $data["watch_size_mm"], PDO::PARAM_INT);
      $stmt->bindValue(":watch_color", $data["watch_color"], PDO::PARAM_STR);
      $stmt->bindValue(":price_cents", $data["price_cents"] ?? 0, PDO::PARAM_INT);
      $stmt->bindValue(":base_price_cents", $data["base_price_cents"] ?? 0, PDO::PARAM_INT);
      $stmt->bindValue(":display_size_mm", $data["display_size_mm"], PDO::PARAM_INT);
      $stmt->bindValue(":display_type", $data["display_type"], PDO::PARAM_STR);
      $stmt->bindValue(":resolution_h_px", $data["resolution_h_px"], PDO::PARAM_INT);
      $stmt->bindValue(":resolution_w_px", $data["resolution_w_px"], PDO::PARAM_INT);
      $stmt->bindValue(":ram_bytes", $data["ram_bytes"], PDO::PARAM_INT);
      $stmt->bindValue(":rom_bytes", $data["rom_bytes"], PDO::PARAM_INT);
      $stmt->bindValue(":os_id", $data["os_id"], PDO::PARAM_INT);
      $stmt->bindValue(":connectivity", $data["connectivity"], PDO::PARAM_STR);
      $stmt->bindValue(":battery_life_mah", $data["battery_life_mah"], PDO::PARAM_INT);
      $stmt->bindValue(":water_resistance_value", $data["water_resistance_value"], PDO::PARAM_INT);
      $stmt->bindValue(":water_resistance_unit", $data["water_resistance_unit"], PDO::PARAM_STR);
      $stmt->bindValue(":sensor", $data["sensor"], PDO::PARAM_STR);
      $stmt->bindValue(":case_material", $data["case_material"], PDO::PARAM_STR);
      $stmt->bindValue(":band_material", $data["band_material"], PDO::PARAM_STR);
      $stmt->bindValue(":band_size_mm", $data["band_size_mm"], PDO::PARAM_INT);
      $stmt->bindValue(":band_color", $data["band_color"], PDO::PARAM_STR);
      $stmt->bindValue(":weight_milligrams", $data["weight_milligrams"], PDO::PARAM_INT);
      $stmt->bindValue(":release_date", $data["release_date"], PDO::PARAM_STR);
      $stmt->bindValue(":stop_selling", $this->utils->toBool($data["stop_selling"]), PDO::PARAM_BOOL);
      $stmt->execute();

      $id = $this->conn->lastInsertId();

      if(array_key_exists("image", $data) && $this->utils->toNull($data["image"]) !== null) {
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
      $sql = "UPDATE product_variations SET
        product_id = :product_id,
        watch_size_mm = :watch_size_mm,
        watch_color = :watch_color,
        price_cents = :price_cents,
        base_price_cents = :base_price_cents,
        display_size_mm = :display_size_mm,
        display_type = :display_type,
        resolution_h_px = :resolution_h_px,
        resolution_w_px = :resolution_w_px,
        ram_bytes = :ram_bytes,
        rom_bytes = :rom_bytes,
        os_id = :os_id,
        connectivity = :connectivity,
        battery_life_mah = :battery_life_mah,
        water_resistance_value = :water_resistance_value,
        water_resistance_unit = :water_resistance_unit,
        sensor = :sensor,
        case_material = :case_material,
        band_material = :band_material,
        band_size_mm = :band_size_mm,
        band_color = :band_color,
        weight_milligrams = :weight_milligrams,
        release_date = :release_date,
        stop_selling = :stop_selling
        WHERE id = :id AND is_deleted = false
      ";

      $stmt = $this->conn->prepare($sql);
      $stmt->bindValue(":product_id", $new["product_id"] ?? $current["product_id"], PDO::PARAM_INT);
      $stmt->bindValue(":watch_size_mm", $new["watch_size_mm"] ?? $current["watch_size_mm"], PDO::PARAM_INT);
      $stmt->bindValue(":watch_color", $new["watch_color"] ?? $current["watch_color"], PDO::PARAM_STR);
      $stmt->bindValue(":price_cents", $new["price_cents"] ?? $current["price_cents"], PDO::PARAM_INT);
      $stmt->bindValue(":base_price_cents", $new["base_price_cents"] ?? $current["base_price_cents"], PDO::PARAM_INT);
      $stmt->bindValue(":display_size_mm", $new["display_size_mm"] ?? $current["display_size_mm"], PDO::PARAM_INT);
      $stmt->bindValue(":display_type", $new["display_type"] ?? $current["display_type"], PDO::PARAM_STR);
      $stmt->bindValue(":resolution_h_px", $new["resolution_h_px"] ?? $current["resolution_h_px"], PDO::PARAM_INT);
      $stmt->bindValue(":resolution_w_px", $new["resolution_w_px"] ?? $current["resolution_w_px"], PDO::PARAM_INT);
      $stmt->bindValue(":ram_bytes", $new["ram_bytes"] ?? $current["ram_bytes"], PDO::PARAM_INT);
      $stmt->bindValue(":rom_bytes", $new["rom_bytes"] ?? $current["rom_bytes"], PDO::PARAM_INT);
      $stmt->bindValue(":os_id", $new["os_id"] ?? $current["os"]["id"], PDO::PARAM_INT);
      $stmt->bindValue(":connectivity", $new["connectivity"] ?? $current["connectivity"], PDO::PARAM_STR);
      $stmt->bindValue(":battery_life_mah", $new["battery_life_mah"] ?? $current["battery_life_mah"], PDO::PARAM_INT);
      $stmt->bindValue(":water_resistance_value", $new["water_resistance_value"] ?? $current["water_resistance_value"], PDO::PARAM_INT);
      $stmt->bindValue(":water_resistance_unit", $new["water_resistance_unit"] ?? $current["water_resistance_unit"], PDO::PARAM_STR);
      $stmt->bindValue(":sensor", $new["sensor"] ?? $current["sensor"], PDO::PARAM_STR);
      $stmt->bindValue(":case_material", $new["case_material"] ?? $current["case_material"], PDO::PARAM_STR);
      $stmt->bindValue(":band_material", $new["band_material"] ?? $current["band_material"], PDO::PARAM_STR);
      $stmt->bindValue(":band_size_mm", $new["band_size_mm"] ?? $current["band_size_mm"], PDO::PARAM_INT);
      $stmt->bindValue(":band_color", $new["band_color"] ?? $current["band_color"], PDO::PARAM_STR);
      $stmt->bindValue(":weight_milligrams", $new["weight_milligrams"] ?? $current["weight_milligrams"], PDO::PARAM_INT);
      $stmt->bindValue(":release_date", $new["release_date"] ?? $current["release_date"], PDO::PARAM_STR);
      $stmt->bindValue(":stop_selling", isset($new["stop_selling"]) ? $this->utils->toBool($new["stop_selling"]) : $current["stop_selling"], PDO::PARAM_BOOL);
      $stmt->bindValue(":id", $current["id"], PDO::PARAM_INT);
      $stmt->execute();

      if(array_key_exists("image", $new)) { // Only update image if provided
        if($this->utils->toNull($new["image"]) === null) {
          $this->updateImg($current["id"], null);
        } else {
          $img_name = $this->utils->saveFile($new["image"], $this->upload_dir);
          $this->updateImg($current["id"], $img_name);
        }
        if($current["image_name"]) $this->utils->removeFile($current["image_name"], $this->upload_dir);
      }

      $this->conn->commit();
      return $this->get($current["id"]);

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
        ? "UPDATE product_variations SET is_deleted = true WHERE id = :id AND is_deleted = false"
        : "DELETE FROM product_variations WHERE id = :id";

      $img_name = $this->get($id)["image_name"];

      $stmt = $this->conn->prepare($sql);
      $stmt->bindValue(":id", $id, PDO::PARAM_INT);
      $stmt->execute();

      if($img_name) $this->utils->removeFile($img_name, $this->upload_dir);

      return $this->conn->commit();

    } catch(PDOException $e) {
      $this->conn->rollBack();
      throw $e; // Re-throw for centralized ErrorHandler
    } catch(Exception $e) {
      $this->conn->rollBack();
      throw $e; // Re-throw for centralized ErrorHandler
    }
  }

  public function updateStock(int $id, int $amount): bool {
    $this->conn->beginTransaction();

    try {
      $sql = "UPDATE product_variations
        SET stock_quantity = stock_quantity + :amount
        WHERE id = :id AND is_deleted = false
      ";

      $stmt = $this->conn->prepare($sql);
      $stmt->bindValue(":amount", $amount, PDO::PARAM_INT);
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

  public function getStock(int $id): int {
    $sql = "SELECT stock_quantity
      FROM product_variations
      WHERE id = :id AND is_deleted = false
    ";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":id", $id, PDO::PARAM_INT);
    $stmt->execute();

    return (int) $stmt->fetch(PDO::FETCH_ASSOC)["stock_quantity"];
  }

  private function hasConstrain(int $id): bool {
    $sql = "SELECT EXISTS (
      SELECT 1 FROM carts WHERE product_variation_id = :product_variation_id
      UNION
      SELECT 1 FROM product_instances WHERE product_variation_id = :product_variation_id
    )";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":product_variation_id", $id, PDO::PARAM_INT);
    $stmt->execute();

    return (bool) $stmt->fetchColumn();
  }

  private function updateImg(int $id, string | null $img_name): bool {
    $this->conn->commit();

    try {
      $sql = "UPDATE product_variations SET image_name = :image_name WHERE id = :id AND is_deleted = false";

      $stmt = $this->conn->prepare($sql);
      $stmt->bindValue(":image_name", $img_name, PDO::PARAM_STR);
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

}
