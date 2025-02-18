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
        error_log("🛠 Querying order with ID: $id"); // Debug log
        $sql = "SELECT * FROM orders WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([$id]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
        if (!$result) {
            error_log("❌ No order found for ID: $id");
        } else {
            error_log("✅ Found order: " . json_encode($result));
        }
    
        return $result;
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

    public function update(array $current, array $new): array | false {
        $sql = "UPDATE orders SET
            user_id = :user_id,
            delivery_address_id = :delivery_address_id,
            delivery_state_id = :delivery_state_id,
            is_received = :is_received,
            order_date = :order_date,
            estimate_received_date = :estimate_received_date,
            received_date = :received_date
            WHERE id = :id";
    
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(":user_id", $new["user_id"] ?? $current["user_id"], PDO::PARAM_INT);
        $stmt->bindValue(":delivery_address_id", $new["delivery_address_id"] ?? $current["delivery_address_id"], PDO::PARAM_INT);
        $stmt->bindValue(":delivery_state_id", $new["delivery_state_id"] ?? $current["delivery_state_id"], PDO::PARAM_INT);
        $stmt->bindValue(":is_received", $new["is_received"] ?? $current["is_received"], PDO::PARAM_INT);
        $stmt->bindValue(":order_date", $new["order_date"] ?? $current["order_date"], PDO::PARAM_STR);
        $stmt->bindValue(":estimate_received_date", $new["estimate_received_date"] ?? $current["estimate_received_date"], PDO::PARAM_STR);
        $stmt->bindValue(":received_date", $new["received_date"] ?? $current["received_date"], PDO::PARAM_NULL);
    
        $stmt->bindValue(":id", $current["id"], PDO::PARAM_INT);
        $stmt->execute();
    
        return $this->get($current["id"]);
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
