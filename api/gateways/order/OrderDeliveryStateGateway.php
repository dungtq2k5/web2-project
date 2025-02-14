<?php

class OrderDeliveryStateGateway {
    private PDO $conn;

    public function __construct(Database $db) {
        $this->conn = $db->getConnection();
    }

    public function getAll(): array {
        $sql = "SELECT * FROM order_delivery_states";
        $stmt = $this->conn->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function get(string $id): array|false {
        $sql = "SELECT * FROM order_delivery_states WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function create(array $data): array {
        $sql = "INSERT INTO order_delivery_states (name) VALUES (?)";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([$data["name"]]);

        return $this->get($this->conn->lastInsertId());
    }

    public function update(string $id, array $data): array {
        $sql = "UPDATE order_delivery_states SET name = ? WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([$data["name"], $id]);

        return $this->get($id);
    }

    public function delete(string $id): bool {
        $sql = "DELETE FROM order_delivery_states WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([$id]);

        return $stmt->rowCount() > 0;
    }
}
?>
