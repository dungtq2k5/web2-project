<?php

class OrderDeliveryStateGateway
{
  private PDO $conn;

  public function __construct(PDO $db_conn)
  {
    $this->conn = $db_conn;
  }

  public function getAll(?int $limit = null, ?int $offset = null): array
  {
    $sql = "SELECT id, name FROM order_delivery_states";

    if ($limit !== null && $offset !== null) {
      $sql .= " LIMIT :limit OFFSET :offset";
    } elseif ($limit !== null) {
      $sql .= " LIMIT :limit";
    } elseif ($offset !== null) {
      $sql .= " LIMIT 18446744073709551615 OFFSET :offset";
    }

    $sql .= " ORDER BY id";

    $stmt = $this->conn->prepare($sql);
    if ($limit !== null) $stmt->bindValue(":limit", $limit, PDO::PARAM_INT);
    if ($offset !== null) $stmt->bindValue(":offset", $offset, PDO::PARAM_INT);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  public function get(int $id): array
  {
    $sql = "SELECT id, name FROM order_delivery_states WHERE id = :id";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":id", $id, PDO::PARAM_INT);
    $stmt->execute();

    return $stmt->fetch(PDO::FETCH_ASSOC);
  }
}
