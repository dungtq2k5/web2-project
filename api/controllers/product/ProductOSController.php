<?php

class ProductOSController {
  private ErrorHandler $error_handler;

  public function __construct(private ProductOSGateway $gateway, private Auths $auths) {
    $this->error_handler = new ErrorHandler;
  }

  public function processRequest(string $method, ?int $id=null, ?int $limit=null, ?int $offset=null): void {
    if($id) {
      $this->processResourceRequest($method, $id);
      return;
    }

    $this->processCollectionRequest($method, $limit, $offset);
  }

  private function processResourceRequest(string $method, int $id): void {
    $os = $this->gateway->get($id);
    if(!$os) {
      $this->error_handler->sendErrorResponse(404, "OS with an id '$id' not found");
      return;
    }

    switch($method) {
      case "GET":
        $this->auths->verifyAction("READ_PRODUCT_OS");

        echo json_encode([
          "success" => true,
          "data" => $os
        ]);
        break;

      case "PUT":
        $this->auths->verifyAction("UPDATE_PRODUCT_OS");

        $data = (array) json_decode(file_get_contents("php://input"));

        $errors = $this->getValidationErrors($data, false);
        if(!empty($errors)) {
          $this->error_handler->sendErrorResponse(422, $errors);
          break;
        }

        $data = $this->gateway->update($os, $data);

        echo json_encode([
          "success" => true,
          "message" => "OS id $id updated",
          "data" => $data
        ]);
        break;

      case "DELETE":
        $this->auths->verifyAction("DELETE_PRODUCT_OS");

        $this->gateway->delete($id);

        echo json_encode([
          "success" => true,
          "message" => "OS id $id was deleted"
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
        $this->auths->verifyAction("READ_PRODUCT_OS");

        $data = $this->gateway->getAll($limit, $offset);

        echo json_encode([
          "success" => true,
          "length" => count($data),
          "data" => $data
        ]);
        break;

      case "POST":
        $this->auths->verifyAction("CREATE_PRODUCT_OS");

        $data = (array) json_decode(file_get_contents("php://input"));

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
    } else { //check fields that exist
      if(array_key_exists("name", $data) && empty($data["name"])) $errors[] = "name is required";
    }

    return $errors;
  }
}