<?php

class OrdersGateway {
    private PDO $conn;

    public function __construct(Database $db) {
        $this->conn = $db->getConnection(); // Lấy kết nối PDO từ Database
    }

    public function getAll(?int $limit = null, ?int $offset = null): array {
        $sql = "SELECT * FROM orders";
        $params = [];

        if ($limit !== null) {
            $sql .= " LIMIT ?";
            $params[] = $limit;
        }

        if ($offset !== null) {
            $sql .= " OFFSET ?";
            $params[] = $offset;
        }

        $stmt = $this->conn->prepare($sql); // 🔥 Đã sửa: db -> conn
        $stmt->execute($params);

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function get(string $id): array|false {
        $sql = "SELECT * FROM orders WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function create(array $data): array {
        $sql = "INSERT INTO orders (user_id, delivery_address_id, delivery_state_id, is_received, order_date, estimate_received_date, received_date) 
                VALUES (?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([
            $data["user_id"],
            $data["delivery_address_id"],
            $data["delivery_state_id"],
            $data["is_received"] ?? 0,
            $data["order_date"],
            $data["estimate_received_date"],
            $data["received_date"] ?? null
        ]);
        return $this->get($this->conn->lastInsertId());
    }

    public function update(string $id, array $data): array {
        if (empty($id)) {
            throw new Exception("ID required");
        }
    
        error_log("Updating order with ID: " . $id); // Debug
    
        $fields = [];
        $values = [];
    
        foreach ($data as $key => $value) {
            $fields[] = "$key = ?";
            $values[] = $value;
        }
    
        $values[] = $id;
        $sql = "UPDATE orders SET " . implode(", ", $fields) . " WHERE id = ?";
    
        error_log("SQL Query: " . $sql); // Debug
        error_log("Values: " . json_encode($values)); // Debug
    
        $stmt = $this->conn->prepare($sql);
        $stmt->execute($values);
        
        return $this->get($id);
    }
    

    public function delete(string $id): bool {
        // Xóa order_items trước
        $sqlItems = "DELETE FROM order_items WHERE order_id = ?";
        $stmtItems = $this->conn->prepare($sqlItems);
        $stmtItems->execute([$id]);
    
        // Sau đó mới xóa order
        $sql = "DELETE FROM orders WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([$id]);
    
        return $stmt->rowCount() > 0;
    }
    
}
?>
