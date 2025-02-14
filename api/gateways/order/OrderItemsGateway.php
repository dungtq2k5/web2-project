<?php

class OrderItemsGateway {
    private Database $db;

    public function __construct(Database $db) {
        $this->db = $db;
    }

    public function getAll(): array {
        $sql = "SELECT * FROM order_items";
        return $this->db->getConnection()->query($sql)->fetchAll(PDO::FETCH_ASSOC);
    }

    public function get(string $id): array|false {
        $sql = "SELECT * FROM order_items WHERE id = ?";
        $stmt = $this->db->getConnection()->prepare($sql);
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function create(array $data): string {
        $sql = "INSERT INTO order_items (order_id, product_instance_sku, price_cents) VALUES (?, ?, ?)";
        $stmt = $this->db->getConnection()->prepare($sql);
        $stmt->execute([$data['order_id'], $data['product_instance_sku'], $data['price_cents']]);
        return $this->db->getConnection()->lastInsertId();
    }

    public function update(string $id, array $data): bool {
        $sql = "UPDATE order_items SET order_id = ?, product_instance_sku = ?, price_cents = ? WHERE id = ?";
        $stmt = $this->db->getConnection()->prepare($sql);
        return $stmt->execute([$data['order_id'], $data['product_instance_sku'], $data['price_cents'], $id]);
    }

    public function delete(string $id): bool {
        $sql = "DELETE FROM order_items WHERE id = ?";
        $stmt = $this->db->getConnection()->prepare($sql);
        return $stmt->execute([$id]);
    }
}
