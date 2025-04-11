<?php

class ProductCategoryController {
  private ErrorHandler $error_handler;

  public function __construct(private ProductCategoryGateway $gateway, private Auths $auths) {
    $this->error_handler = new ErrorHandler;
  }

  public function processRequest(string $method, ?int $id, ?int $limit, ?int $offset): void {
    if($id) {
      $this->processResourceRequest($method, $id);
      return;
    }

    $this->processCollectionRequest($method, $limit, $offset);
  }

  private function processResourceRequest(string $method, int $id): void {
    $category = $this->gateway->get($id);
    if(!$category) {
      $this->error_handler->sendErrorResponse(404, "Category with an id $id not found");
      return;
    }

    switch($method) {
      case "GET":
        echo json_encode([
          "success" => true,
          "data" => $category
        ]);
        break;

      case "PUT":
        $this->auths->verifyAction("UPDATE_PRODUCT_CATEGORY");
        $data = (array) json_decode(file_get_contents("php://input"));
        $errors = $this->getValidationErrors($data, false);
        if(!empty($errors)) {
          $this->error_handler->sendErrorResponse(422, $errors);
          break;
        }

        $data = $this->gateway->update($category, $data);

        echo json_encode([
          "success" => true,
          "message" => "Category id $id updated",
          "data" => $data
        ]);
        break;

      case "DELETE":
        $this->auths->verifyAction("DELETE_PRODUCT_CATEGORY");
        $res = $this->gateway->delete($id);

        echo json_encode([
          "success" => $res,
          "message" => $res ? "Category id $id was deleted" : "Can't delete category id $id because of constrain"
        ]);
        break;

      default:
        $this->error_handler->sendErrorResponse(405, "only allow GET, PUT, DELETE method");
        header("Allow: GET, PUT, DELETE");
    }

  }

  private function processCollectionRequest(string $method, ?int $limit, ?int $offset): void {
    switch($method) {
      case "GET":
        $data = $this->gateway->getAll($limit, $offset);

        echo json_encode([
          "success" => true,
          "length" => count($data),
          "data" => $data
        ]);
        break;

      case "POST":
        $this->auths->verifyAction("CREATE_PRODUCT_CATEGORY");
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
