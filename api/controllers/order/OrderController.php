<?php

class OrderController {
  private ErrorHandler $error_handler;
  private Utils $utils;

  public function __construct(private OrderGateway $gateway, private Auths $auths) {
    $this->error_handler = new ErrorHandler;
    $this->utils = new Utils;
  }

  public function processRequest(string $method, ?string $id=null, ?int $limit=null, ?int $offset=null): void {
    if($id) {
      $this->processResourceRequest($method, $id);
      return;
    }

    $this->processCollectionRequest($method, $limit, $offset);
  }

  private function processResourceRequest(string $method, string $id): void {
    $order = $this->gateway->get($id);
    if (!$order) {
      $this->error_handler->sendErrorResponse(404, "Order with id '$id' not found");
      return;
    }

    switch ($method) {
      case "GET":
        $auth = $this->auths->verifyAction("READ_ORDER");

        if($auth["buyer_only"] && $auth["user_id"] != $order["user_id"]) { // Buyer can only view their own resources
          $this->error_handler->sendErrorResponse(403, "Forbidden: You do not own this resource");
          break;
        }

        echo json_encode([
          "success" => true,
          "data" => $order
        ]);
        break;

      case "PUT":
        $auth = $this->auths->verifyAction("UPDATE_ORDER");

        if($auth["buyer_only"] && $auth["user_id"] != $order["user_id"]) { // User can only change their own resources
          $this->error_handler->sendErrorResponse(403, "Forbidden: You do not own this resource");
          break;
        }

        $data = (array) json_decode(file_get_contents("php://input"));

        $errors = $this->getValidationErrors($data, false);
        if(!empty($errors)) {
          $this->error_handler->sendErrorResponse(422, $errors);
          break;
        }

        $res = $this->gateway->update($order, $data);

        echo json_encode([
          "success" => true,
          "message" => "Order updated",
          "data" => $res
        ]);
        break;

      default:
        $this->error_handler->sendErrorResponse(405, "Only GET, PUT methods are allowed");
        header("Allow: GET, PUT");
    }
  }

  private function processCollectionRequest(string $method, ?int $limit=null, ?int $offset=null): void {
    switch ($method) {
      case "GET":
        $auth = $this->auths->verifyAction("READ_ORDER");

        $data = $auth["buyer_only"] // Buyer can only read their own data
          ? $this->gateway->getByUserId($auth["user_id"], $limit, $offset)
          : $this->gateway->getAll($limit, $offset);

        echo json_encode([
          "success" => true,
          "length" => count($data),
          "data" => $data
        ]);
        break;

      case "POST":
        $auth = $this->auths->verifyAction("CREATE_ORDER");

        $data = (array) json_decode(file_get_contents("php://input"), true);

        if($auth["buyer_only"]) $data["user_id"] = $auth["user_id"]; // Buyer can only create for their own

        $errors = $this->getValidationErrors($data);
        if(!empty($errors)) {
          $this->error_handler->sendErrorResponse(422, $errors);
          break;
        }

        $res = $this->gateway->create($data);

        http_response_code(201);
        echo json_encode([
          "success" => true,
          "message" => "Order is created",
          "data" => $res
        ]);
        break;

      default:
        $this->error_handler->sendErrorResponse(405, "Only GET, POST methods are allowed");
        header("Allow: GET, POST");
    }
  }

  private function getValidationErrors(array $data, bool $new = true): array {
    $errors = [];

    if($new) { // Create an order
      if(empty($data["user_id"]) || !is_numeric($data["user_id"])) $errors[] = "user_id is required and must be an integer";
      // if(empty($data["total_cents"]) || !is_numeric($data["total_cents"])) $errors[] = "total_cents is required and must be an integer";
      if(empty($data["delivery_address_id"]) || !is_numeric($data["delivery_address_id"])) $errors[] = "delivery_address_id is required and must be an integer";

      if(empty($data["items"])) {
        $errors[] = "items is required";
      } else if(!is_array($data["items"])) {
        $errors[] = "items must be a list";
      } else if(count($data["items"]) === 0) {
        $errors[] = "items is blank";
      } else {
        foreach($data["items"] as $item) {
          if(empty($item["product_variation_id"]) || !is_numeric($item["product_variation_id"])) {
            $errors[] = "product_variation_id is required and must be an integer";
            break;
          }

          if(empty($item["quantity"]) || !is_numeric($item["quantity"]) || $item["quantity"] < 1) {
            $errors[] = "quantity is required and must be an integer and greater than 0";
            break;
          }
        }
      }

    } else { // Update an order
      if(
        array_key_exists("delivery_address_id", $data) &&
        (empty($data["delivery_address_id"]) || !is_numeric($data["delivery_address_id"]))
      ) $errors[] = "delivery_address_id is empty or not an integer";
      if(
        array_key_exists("delivery_state_id", $data) &&
        (empty($data["delivery_state_id"]) || !is_numeric($data["delivery_state_id"]))
      ) $errors[] = "delivery_state_id is empty or not an integer";
    }

    if(
      array_key_exists("estimate_received_date", $data) &&
      (empty($data["estimate_received_date"]) || !$this->utils->isValidDateTimeFormat($data["estimate_received_date"]))
    ) $errors[] = "estimate_received_date is empty or not a valid MySQL datetime format";

    return $errors;
  }

}
