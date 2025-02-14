<?php

class OrderItemsController {
    private OrderItemsGateway $gateway;

    public function __construct(OrderItemsGateway $gateway) {
        $this->gateway = $gateway;
    }

    public function processRequest(string $method, ?string $id): void {
        header('Content-Type: application/json');

        switch ($method) {
            case "GET":
                if ($id !== null) {
                    $this->getItem($id);
                } else {
                    $this->getAllItems();
                }
                break;

            case "POST":
                $data = json_decode(file_get_contents("php://input"), true);
                if (!$data) {
                    $this->sendErrorResponse(400, "Invalid JSON input");
                    return;
                }
                $this->createItem($data);
                break;

            case "PUT":
                if (!$id) {
                    $this->sendErrorResponse(400, "ID required for updating item");
                    return;
                }
                $data = json_decode(file_get_contents("php://input"), true);
                if (!$data) {
                    $this->sendErrorResponse(400, "Invalid JSON input");
                    return;
                }
                $this->updateItem($id, $data);
                break;

            case "DELETE":
                if (!$id) {
                    $this->sendErrorResponse(400, "ID required for deleting item");
                    return;
                }
                $this->deleteItem($id);
                break;

            default:
                $this->sendErrorResponse(405, "Method not allowed");
                header("Allow: GET, POST, PUT, DELETE");
        }
    }

    private function getAllItems(): void {
        $items = $this->gateway->getAll();
        echo json_encode(["success" => true, "data" => $items]);
    }

    private function getItem(string $id): void {
        $item = $this->gateway->get($id);
        if (!$item) {
            $this->sendErrorResponse(404, "Order item not found");
            return;
        }
        echo json_encode(["success" => true, "data" => $item]);
    }

    private function createItem(array $data): void {
        $id = $this->gateway->create($data);
        http_response_code(201);
        echo json_encode(["success" => true, "message" => "Item created", "id" => $id]);
    }

    private function updateItem(string $id, array $data): void {
        if ($this->gateway->update($id, $data)) {
            echo json_encode(["success" => true, "message" => "Item updated"]);
        } else {
            $this->sendErrorResponse(500, "Failed to update item");
        }
    }

    private function deleteItem(string $id): void {
        if ($this->gateway->delete($id)) {
            echo json_encode(["success" => true, "message" => "Item deleted"]);
        } else {
            $this->sendErrorResponse(500, "Failed to delete item");
        }
    }

    private function sendErrorResponse(int $code, string $message): void {
        http_response_code($code);
        echo json_encode(["success" => false, "message" => $message]);
    }
}
