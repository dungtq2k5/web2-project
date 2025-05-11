<?php

class ProductController {
  private ErrorHandler $error_handler;
  private Utils $utils;

  public function __construct(private ProductGateway $gateway, private Auths $auths) {
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

  private function processResourceRequest(string $method, int $id): void {
    $product = $this->gateway->get($id);
    if(!$product) {
      $this->error_handler->sendErrorResponse(404, "Product with an id '$id' not found");
      return;
    }

    switch($method) {
      case "GET":
        // $this->auths->verifyAction("READ_PRODUCT");

        echo json_encode([
          "success" => true,
          "data" => $product
        ]);
        break;

      case "PUT":
        $this->auths->verifyAction("UPDATE_PRODUCT");

        $content_type = $_SERVER["CONTENT_TYPE"];

        if(strpos($content_type, "application/json") !== false) {         // JSON data
          $data = (array) json_decode(file_get_contents("php://input"));
        } elseif(                                                         // Form data
          strpos($content_type, "multipart/form-data") !== false ||
          strpos($content_type, "application/x-www-form-urlencoded") !== false
        ) {
          $data = $_POST;
          if($_FILES["image"]) $data["image"] = $_FILES["image"];
        } else {
          $this->error_handler->sendErrorResponse(400, "Missing Content-Type header");
          break;
        }

        $errors = $this->getValidationErrors($data, false);
        if(!empty($errors)) {
          $this->error_handler->sendErrorResponse(422, $errors);
          break;
        }

        $data = $this->gateway->update($product, $data);

        echo json_encode([
          "success" => true,
          "message" => "Product id $id updated",
          "data" => $data
        ]);
        break;

      case "DELETE":
        $this->auths->verifyAction("DELETE_PRODUCT");

        $this->gateway->delete($id);

        echo json_encode([
          "success" => true,
          "message" => "Product id $id was deleted"
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
        // $this->auths->verifyAction("READ_PRODUCT");

        $data = $this->gateway->getAll($limit, $offset);

        echo json_encode([
          "success" => true,
          "length" => count($data),
          "data" => $data
        ]);
        break;

      case "POST":
        $this->auths->verifyAction("CREATE_PRODUCT");

        $content_type = $_SERVER["CONTENT_TYPE"];

        if(strpos($content_type, "application/json") !== false) {         // JSON data
          $data = (array) json_decode(file_get_contents("php://input"));
        } elseif(                                                         // Form data
          strpos($content_type, "multipart/form-data") !== false ||
          strpos($content_type, "application/x-www-form-urlencoded") !== false
        ) {
          $data = $_POST;
          if($_FILES["image"]) $data["image"] = $_FILES["image"];
        } else {
          $this->error_handler->sendErrorResponse(400, "Missing Content-Type header");
          break;
        }

        $errors = $this->getValidationErrors($data);
        if(!empty($errors)) {
          $this->error_handler->sendErrorResponse(422, $errors);
          break;
        }

        $data = $this->gateway->create($data);

        http_response_code(201);
        echo json_encode([
          "success" => true,
          "message" => "Product created",
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

    if($new) { //check all fields for new product
      if(empty($data["name"])) $errors[] = "name is required";
      if(empty($data["brand_id"]) || !is_numeric($data["brand_id"])) $errors[] = "brand_id is required with integer value";
      if(empty($data["model"])) $errors[] = "model is required";
      if(empty($data["category_id"]) || !is_numeric($data["category_id"])) $errors[] = "category_id is required with integer value";
      if(empty($data["description"])) $errors[] = "description is required";
    } else { //check fields that exist
      if(array_key_exists("name", $data) && empty($data["name"])) $errors[] = "name is empty";
      if(array_key_exists("brand_id", $data) && (empty($data["brand_id"]) || !is_numeric($data["brand_id"]))) $errors[] = "brand_id is empty or not an integer";
      if(array_key_exists("model", $data) && empty($data["model"])) $errors[] = "model is empty";
      if(array_key_exists("category_id", $data) && (empty($data["category_id"]) || !is_numeric($data["category_id"]))) $errors[] = "category_id is empty or not an integer";
      if(array_key_exists("description", $data) && empty($data["description"])) $errors[] = "description is empty";
    }

    if(array_key_exists("image", $data) && $data["image"] !== "null") {
      if(!is_array($data["image"])) {
        $errors["image"] = "only accept file type or null";
      } elseif($img_errors = $this->utils->isValidImg($data["image"])) {
        $errors["image"] = $img_errors;
      }
    }

    if(array_key_exists("stop_selling", $data) && !$this->utils->isInterpretableBool($data["stop_selling"])) $errors[] = "stop_selling must be a boolean value";

    return $errors;
  }
}
