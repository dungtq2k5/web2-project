<?php

class OrderDeliveryStateController {
  private ErrorHandler $error_handler;
  private Utils $utils;

  public function __construct(private OrderDeliveryStateGateway $gateway, private Auths $auths) {
    $this->error_handler = new ErrorHandler;
    $this->utils = new Utils;
  }

  public function processRequest(string $method, ?int $id=null, ?int $limit=null, ?int $offset=null): void {
    if($id) {
      $this->processResourceRequest($method, $id);
      return;
    }

    $this->processCollectionRequest($method, $limit, $offset);
  }

  private function processResourceRequest(string $method, ?int $id=null): void {
    $delivery_state = $this->gateway->get($id);
    if (!$delivery_state) {
      $this->error_handler->sendErrorResponse(404, "Delivery state with an id '$id' not found");
      return;
    }

    switch ($method) {
      case "GET":
        $this->auths->verifyAction("READ_ORDER_DELIVERY_STATE");

        echo json_encode([
          "success" => true,
          "data" => $delivery_state
        ]);
        break;

      // case "PUT":
      //   $this->auths->verifyAction("UPDATE_ORDER_DELIVERY_STATE");
      //   $data = (array) json_decode(file_get_contents("php://input"));
      //   $errors = $this->getValidationErrors($data, false);
      //   if (!empty($errors)) {
      //     $this->error_handler->sendErrorResponse(422, $errors);
      //     break;
      //   }

      //   $data = $this->gateway->update($delivery_state, $data);

      //   echo json_encode([
      //     "success" => true,
      //     "message" => "Delivery state id $id updated",
      //     "data" => $data
      //   ]);
      //   break;

      // case "DELETE":
      //   $this->auths->verifyAction("DELETE_ORDER_DELIVERY_STATE");
      //   $this->gateway->delete($id);

      //   echo json_encode([
      //     "success" => true,
      //     "message" => "Delivery state id $id was deleted"
      //   ]);
      //   break;

      default:
        $this->error_handler->sendErrorResponse(405, "only allow GET method");
        header("Allow: GET");
    }
  }
  public function processCollectionRequest(string $method, ?int $limit=null, ?int $offset=null): void {
    switch ($method) {
      case "GET":
        $this->auths->verifyAction("READ_ORDER_DELIVERY_STATE");

        $data = $this->gateway->getAll($limit, $offset);

        echo json_encode([
          "success" => true,
          "length" => count($data),
          "data" => $data
        ]);
        break;

      // case "POST":
      //   $this->auths->verifyAction("CREATE_ORDER_DELIVERY_STATE");
      //   $data = (array) json_decode(file_get_contents("php://input"));
      //   $errors = $this->getValidationErrors($data);
      //   if (!empty($errors)) {
      //     $this->error_handler->sendErrorResponse(422, $errors);
      //     break;
      //   }

      //   $data = $this->gateway->create($data);

      //   http_response_code(201);
      //   echo json_encode([
      //     "susses" => true,
      //     "message" => "Delivery state created",
      //     "data" => $data
      //   ]);
      //   break;

      default:
        $this->error_handler->sendErrorResponse(405, "only allow GET method");
        header("Allow: GET");
    }
  }

  // private function getValidationErrors(array $data, bool $new = true): array {
  //   $errors = [];

  //   if ($new) { //check all fields
  //     if (empty($data["name"])) $errors[] = "name is required";
  //   } else { //check fields that exist
  //     if (array_key_exists("name", $data) && empty($data["name"])) $errors[] = "name is required";
  //   }

  //   return $errors;
  // }
}
