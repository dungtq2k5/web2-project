<?php

class UserAddressGateway
{
  private PDO $conn;
  private Utils $utils;

  public function __construct(PDO $db_conn)
  {
    $this->conn = $db_conn;
    $this->utils = new Utils;
  }

  public function getAll(?int $limit = null, ?int $offset = null): array
  {
    $sql = "SELECT
      id,
      name,
      user_id,
      street,
      apartment_number,
      ward,
      district,
      city_province,
      phone_number,
      is_default
      FROM user_addresses WHERE is_deleted = false";

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

  public function get(int $id): array | false
  {
    $sql = "SELECT
      id,
      name,
      user_id,
      street,
      apartment_number,
      ward,
      district,
      city_province,
      phone_number,
      is_default
      FROM user_addresses WHERE id = :id AND is_deleted = false";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":id", $id, PDO::PARAM_INT);
    $stmt->execute();

    return $stmt->fetch(PDO::FETCH_ASSOC);
  }

  public function create(array $data): array | false
  {
    $this->conn->beginTransaction();

    try {
      $is_default = $this->utils->toBool($data["is_default"]);
      if ($is_default === true) $this->updateDefaultAddressToFalse($data["user_id"]); // Ensure user has only one default address

      $sql = "INSERT INTO user_addresses (
        name,
        user_id,
        street,
        apartment_number,
        ward,
        district,
        city_province,
        phone_number,
        is_default
      ) VALUES (
        :name,
        :user_id,
        :street,
        :apartment_number,
        :ward,
        :district,
        :city_province,
        :phone_number,
        :is_default
      )";

      $stmt = $this->conn->prepare($sql);
      $stmt->bindValue(":name", $data["name"], PDO::PARAM_STR);
      $stmt->bindValue(":user_id", $data["user_id"], PDO::PARAM_INT);
      $stmt->bindValue(":street", $data["street"], PDO::PARAM_STR);
      $stmt->bindValue(":apartment_number", $data["apartment_number"], PDO::PARAM_STR);
      $stmt->bindValue(":ward", $data["ward"], PDO::PARAM_STR);
      $stmt->bindValue(":district", $data["district"], PDO::PARAM_STR);
      $stmt->bindValue(":city_province", $data["city_province"], PDO::PARAM_STR);
      $stmt->bindValue(":phone_number", $data["phone_number"], PDO::PARAM_STR);
      $stmt->bindValue(":is_default", $is_default, PDO::PARAM_BOOL);
      $stmt->execute();

      $id = $this->conn->lastInsertId();

      $this->conn->commit();
      return $this->get($id);
    } catch (Exception $e) {
      $this->conn->rollBack();
      throw $e; // Re-throw for centralized ErrorHandler
    }
  }

  public function update(array $current, array $new): array | false
  {
    $this->conn->beginTransaction();

    try {
      $is_default = isset($new["is_default"]) ? $this->utils->toBool($new["is_default"]) : $current["is_default"];
      if ($is_default === true) $this->updateDefaultAddressToFalse($current["user_id"]); // Ensure user has only one default address

      $sql = "UPDATE user_addresses SET
        name = :name,
        street = :street,
        apartment_number = :apartment_number,
        ward = :ward,
        district = :district,
        city_province = :city_province,
        phone_number = :phone_number,
        is_default = :is_default,
        WHERE id = :id AND is_deleted = false
      ";

      $stmt = $this->conn->prepare($sql);
      $stmt->bindValue(":name", $new["name"] ?? $current["name"], PDO::PARAM_STR);
      $stmt->bindValue(":street", $new["street"] ?? $current["street"], PDO::PARAM_STR);
      $stmt->bindValue(":apartment_number", $new["apartment_number"] ?? $current["apartment_number"], PDO::PARAM_STR);
      $stmt->bindValue(":ward", $new["ward"] ?? $current["ward"], PDO::PARAM_STR);
      $stmt->bindValue(":district", $new["district"] ?? $current["district"], PDO::PARAM_STR);
      $stmt->bindValue(":city_province", $new["city_province"] ?? $current["city_province"], PDO::PARAM_STR);
      $stmt->bindValue(":phone_number", $new["phone_number"] ?? $current["phone_number"], PDO::PARAM_STR);
      $stmt->bindValue(":is_default", $is_default, PDO::PARAM_BOOL);
      $stmt->bindValue(":id", $current["id"], PDO::PARAM_INT);
      $stmt->execute();

      $this->conn->commit();
      return $this->get($current["id"]);
    } catch (Exception $e) {
      $this->conn->rollBack();
      throw $e; // Re-throw for centralized ErrorHandler
    }
  }

  public function delete(int $id): bool
  {
    $this->conn->beginTransaction();

    try {
      $sql = $this->hasConstrain($id)
        ? "UPDATE user_addresses SET is_deleted = true WHERE id = :id AND is_deleted = false"
        : "DELETE FROM user_addresses WHERE id = :id";

      $stmt = $this->conn->prepare($sql);
      $stmt->bindValue(":id", $id, PDO::PARAM_INT);
      $stmt->execute();

      return $this->conn->commit();
    } catch (Exception $e) {
      $this->conn->rollBack();
      throw $e; // Re-throw for centralized ErrorHandler
    }
  }

  public function getByUserId(int $usr_id, ?int $limit = null, ?int $offset = null): array
  {
    $sql = "SELECT
      id,
      name,
      street,
      apartment_number,
      ward,
      district,
      city_province,
      phone_number,
      is_default
      FROM user_addresses WHERE user_id = :user_id AND is_deleted = false";

    if ($limit !== null && $offset !== null) {
      $sql .= " LIMIT :limit OFFSET :offset";
    } elseif ($limit !== null) {
      $sql .= " LIMIT :limit";
    } elseif ($offset !== null) {
      $sql .= " LIMIT 18446744073709551615 OFFSET :offset";
    }

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":user_id", $usr_id, PDO::PARAM_INT);
    if ($limit !== null) $stmt->bindValue(":limit", $limit, PDO::PARAM_INT);
    if ($offset !== null) $stmt->bindValue(":offset", $offset, PDO::PARAM_INT);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  public function isUserAddress(int $usr_id, int $address_id): bool
  {
    $sql = "SELECT EXISTS (
      SELECT 1 FROM user_addresses WHERE id = :address_id AND user_id = :user_id
      LIMIT 1
    )";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":address_id", $address_id, PDO::PARAM_INT);
    $stmt->bindValue(":user_id", $usr_id, PDO::PARAM_INT);
    $stmt->execute();

    return (bool) $stmt->fetchColumn();
  }

  private function hasConstrain(int $id): bool
  {
    $sql = "SELECT EXISTS (
      SELECT 1 FROM orders WHERE delivery_address_id = :id
      LIMIT 1
    )";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":id", $id, PDO::PARAM_INT);
    $stmt->execute();

    return (bool) $stmt->fetchColumn();
  }

  // Function doesn't have its own transaction so make sure cover it when use
  private function updateDefaultAddressToFalse(int $usr_id): void
  {
    try {
      $sql = "UPDATE user_addresses
        SET is_default = false
        WHERE user_id = :user_id AND is_default = true AND is_deleted = false";

      $stmt = $this->conn->prepare($sql);
      $stmt->bindValue(":user_id", $usr_id, PDO::PARAM_INT);
      $stmt->execute();

      return;
    } catch (Exception $e) {
      throw $e; // Re-throw for centralized ErrorHandler
    }
  }
}
