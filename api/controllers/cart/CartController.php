<?php

class CartController {
  private ErrorHandler $error_handler;

  public function __construct(private CartGateway $gateway, private Auths $auths) {
    $this->error_handler = new ErrorHandler;
  }

  public function processRequest(string $method, ?int $usr_id=null, ?int $product_variation_id=null, ?int $limit=null, ?int $offset=null): void {
    if($usr_id) {
      $this->processResourceRequest($method, $usr_id, $product_variation_id);
      return;
    }

    $this->processCollectionRequest($method, $limit, $offset);
  }

  private function processResourceRequest(string $method, int $usr_id, ?int $product_variation_id=null): void {
    $carts = $this->gateway->get($usr_id, $product_variation_id);
    if(!$carts) {
      $error_message = $product_variation_id
        ? "Cart with user_id '$usr_id' and product_variation_id '$product_variation_id' not found"
        : "Carts with user_id '$usr_id' not found";
      $this->error_handler->sendErrorResponse(404, $error_message);
      return;
    }

    switch($method) {
      case "GET":
        $auth = $this->auths->verifyAction("READ_CART");

        $carts = $auth["buyer_only"] // Buyer can only view their own resources
          ? $this->gateway->get($auth["user_id"], $product_variation_id)
          : $carts;

        echo json_encode([
          "success" => true,
          "length" => count($carts),
          "data" => $carts
        ]);
        break;

      case "PUT":
        $auth = $this->auths->verifyAction("UPDATE_CART");

        if(!$product_variation_id) {
          $this->error_handler->sendErrorResponse(422, "product_variation_id is required");
          break;
        }

        if($auth["buyer_only"] && $auth["user_id"] != $usr_id) { // Buyer can only change their own resources
          $this->error_handler->sendErrorResponse(403, "Forbidden: You do not own this resource");
          break;
        }

        $data = (array) json_decode(file_get_contents("php://input"));

        $errors = $this->getValidationErrors($data, false);
        if(!empty($errors)) {
          $this->error_handler->sendErrorResponse(422, $errors);
          break;
        }

        $data = $this->gateway->update($carts, $data);

        echo json_encode([
          "success" => true,
          "message" => "Cart updated",
          "data" => $data
        ]);
        break;

      case "DELETE":
        $auth = $this->auths->verifyAction("DELETE_CART");

        if(!$product_variation_id) {
          $this->error_handler->sendErrorResponse(422, "product_variation_id is required");
          break;
        }

        if($auth["buyer_only"] && $auth["user_id"] != $usr_id) { // Buyer can only change their own resources
          $this->error_handler->sendErrorResponse(403, "Forbidden: You do not own this resource");
          break;
        }

        $this->gateway->delete($usr_id, $product_variation_id);

        echo json_encode([
          "success" => true,
          "message" => "Cart was deleted"
        ]);
        break;

      default:
        $this->error_handler->sendErrorResponse(405, "only allow GET, PUT, DELETE method");
        header("Allow: GET, PUT, DELETE");
    }

  }

  private function processCollectionRequest(string $method, ?int $limit=null, ?int $offset=null): void {
    switch($method) {
      case "GET":
        $auth = $this->auths->verifyAction("READ_CART");

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
        $auth = $this->auths->verifyAction("CREATE_CART");

        $data = (array) json_decode(file_get_contents("php://input"));

        if($auth["buyer_only"]) $data["user_id"] = $auth["user_id"]; // Buyer can only create for their own

        $errors = $this->getValidationErrors($data);
        if(!empty($errors)) {
          $this->error_handler->sendErrorResponse(422, $errors);
          break;
        }

        $data = $this->gateway->create($data);

        http_response_code(201);
        echo json_encode([
          "success" => true,
          "message" => "Cart is created",
          "data" => $data
        ]);
        break;

      default:
        $this->error_handler->sendErrorResponse(405, "only allow GET, POST method");
        header("Allow: GET, POST");
    }
  }

  private function getValidationErrors(array $data, bool $new=true): array {
    $errors = [];

    if($new) { // Checking fields for new cart
      if(empty($data["user_id"]) || !is_numeric($data["user_id"])) $errors[] = "user_id is required with integer value";
      if(empty($data["product_variation_id"]) || !is_numeric($data["product_variation_id"])) $errors[] = "product_variation_id is required with integer value";

      if(array_key_exists("quantity", $data)) {
        if(empty($data["quantity"]) && $data["quantity"] != 0) { // Since empty of 0 is true so check if quantity is not 0
          $errors[] = "quantity is empty";
        } elseif(!is_numeric($data["quantity"])) {
          $errors[] = "quantity must be an integer";
        } elseif($data["quantity"] < 1) {
          $errors[] = "quantity must be greater than 0";
        }
      }

    } else { // Since can only update quantity field so check it
      if(!array_key_exists("quantity", $data)) {
        $errors[] = "quantity is required";
      } elseif(empty($data["quantity"]) && $data["quantity"] != 0) { // Since empty of 0 is true so check if quantity is not 0
        $errors[] = "quantity is empty";
      } elseif(!is_numeric($data["quantity"])) {
        $errors[] = "quantity must be an integer";
      } elseif($data["quantity"] < 1) {
        $errors[] = "quantity must be greater than 0";
      }
    }

    return $errors;
  }
}
