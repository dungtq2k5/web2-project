<?php

class OrderDeliveryStateController extends ErrorHandler {
    public function __construct(private OrderDeliveryStateGateway $gateway, private Auths $auths) {}

    public function processRequest(string $method, ?string $id): void {
        switch ($method) {
            case "GET":
                $data = $id ? $this->gateway->get($id) : $this->gateway->getAll();
                echo json_encode(["success" => true, "data" => $data]);
                break;

            case "POST":
                $this->auths->verifyAction("CREATE_DELIVERY_STATE");
                $data = json_decode(file_get_contents("php://input"), true);
                echo json_encode(["success" => true, "data" => $this->gateway->create($data)]);
                break;

            case "PUT":
                if (!$id) {
                    http_response_code(400);
                    echo json_encode(["message" => "ID required"]);
                    return;
                }
                $this->auths->verifyAction("UPDATE_DELIVERY_STATE");
                $data = json_decode(file_get_contents("php://input"), true);
                echo json_encode(["success" => true, "data" => $this->gateway->update($id, $data)]);
                break;

            case "DELETE":
                if (!$id) {
                    http_response_code(400);
                    echo json_encode(["message" => "ID required"]);
                    return;
                }
                $this->auths->verifyAction("DELETE_DELIVERY_STATE");
                $deleted = $this->gateway->delete($id);
                echo json_encode(["success" => $deleted, "message" => $deleted ? "Deleted successfully" : "Failed to delete"]);
                break;

            default:
                http_response_code(405);
                echo json_encode(["message" => "Method not allowed"]);
        }
    }
}
?>
