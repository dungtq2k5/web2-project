<?php

class OrdersController extends ErrorHandler {
    public function __construct(private OrdersGateway $gateway, private Auths $auths) {}

    public function processRequest(string $method, ?string $id, ?int $limit = null, ?int $offset = null): void {
        ob_clean(); // 🔥 Xóa bộ nhớ đệm trước khi xuất dữ liệu
        header('Content-Type: application/json'); // Đặt header JSON chính xác
    
        error_log("Processing request: Method=$method, ID=" . ($id ?? "NULL") . ", Limit=$limit, Offset=$offset");
    
        switch ($method) {
            case "GET":
                if ($id !== null) { 
                    $this->processResourceRequest($method, $id);
                } else {
                    $this->processCollectionRequest($method, $limit, $offset);
                }
                break;            
    
            case "POST":
                $data = json_decode(file_get_contents("php://input"), true);
                if (!$data) {
                    $this->sendErrorResponse(400, "Invalid JSON input");
                    return;
                }
                $createdOrder = $this->gateway->create($data);
                http_response_code(201);
                echo json_encode(["success" => true, "message" => "Order created", "data" => $createdOrder]);
                break;
    
            case "PUT":
                if (!$id) {
                    $this->sendErrorResponse(400, "ID required for updating order");
                    return;
                }
                $data = json_decode(file_get_contents("php://input"), true);
                if (!$data) {
                    $this->sendErrorResponse(400, "Invalid JSON input");
                    return;
                }
                $updatedOrder = $this->gateway->update($id, $data);
                echo json_encode(["success" => true, "message" => "Order updated", "data" => $updatedOrder]);
                break;
    
            case "DELETE":
                if (!$id) {
                    $this->sendErrorResponse(400, "ID required for deleting order");
                    return;
                }
                $deleted = $this->gateway->delete($id);
                echo json_encode(["success" => $deleted, "message" => $deleted ? "Order deleted" : "Failed to delete order"]);
                break;
    
            default:
                $this->sendErrorResponse(405, "Method not allowed");
                header("Allow: GET, POST, PUT, DELETE");
        }
    
        exit; // 🔥 Đảm bảo không có dữ liệu nào bị in ra sau đó
    }
    
    
    

    private function processResourceRequest(string $method, string $id): void {
        $order = $this->gateway->get($id);
        if (!$order) {
            $this->sendErrorResponse(404, "Order with id $id not found");
            return;
        }

        switch ($method) {
            case "GET":
                echo json_encode(["success" => true, "data" => $order]);
                break;

            case "PUT":
                $this->auths->verifyAction("UPDATE_ORDER");
                $data = (array) json_decode(file_get_contents("php://input"));
                $errors = $this->getValidationErrors($data, false);
                if (!empty($errors)) {
                    $this->sendErrorResponse(422, $errors);
                    break;
                }
                $updatedOrder = $this->gateway->update($id, $data);
                echo json_encode(["success" => true, "message" => "Order updated", "data" => $updatedOrder]);
                break;

            case "DELETE":
                $this->auths->verifyAction("DELETE_ORDER");
                $deleted = $this->gateway->delete($id);
                echo json_encode(["success" => $deleted, "message" => $deleted ? "Order deleted" : "Failed to delete order"]);
                break;

            default:
                $this->sendErrorResponse(405, "Only GET, PUT, DELETE methods are allowed");
                header("Allow: GET, PUT, DELETE");
        }
    }

    private function processCollectionRequest(string $method, ?int $limit = null, ?int $offset = null): void {
        switch ($method) {
            case "GET":
                $orders = $this->gateway->getAll($limit, $offset);
                echo json_encode(["success" => true, "length" => count($orders), "data" => $orders]);
                break;

            case "POST":
                $this->auths->verifyAction("CREATE_ORDER");
                $data = (array) json_decode(file_get_contents("php://input"));
                $errors = $this->getValidationErrors($data);
                if (!empty($errors)) {
                    $this->sendErrorResponse(422, $errors);
                    break;
                }
                $createdOrder = $this->gateway->create($data);
                http_response_code(201);
                echo json_encode(["success" => true, "message" => "Order created", "data" => $createdOrder]);
                break;

            default:
                $this->sendErrorResponse(405, "Only GET, POST methods are allowed");
                header("Allow: GET, POST");
        }
    }

    private function getValidationErrors(array $data, bool $newOrder = true): array {
        $errors = [];

        if ($newOrder) {
            if (empty($data["user_id"])) $errors[] = "user_id is required";
            if (empty($data["delivery_address_id"])) $errors[] = "delivery_address_id is required";
            if (empty($data["delivery_state_id"])) $errors[] = "delivery_state_id is required";
            if (empty($data["order_date"])) $errors[] = "order_date is required";
            if (empty($data["estimate_received_date"])) $errors[] = "estimate_received_date is required";
        }

        return $errors;
    }
}