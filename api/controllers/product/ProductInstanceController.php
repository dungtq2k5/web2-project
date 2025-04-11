<?php

class ProductInstanceController {
  private ErrorHandler $error_handler;
  private Utils $utils;

  public function __construct(private ProductInstanceGateway $gateway, private Auths $auths) {
    $this->error_handler = new ErrorHandler;
    $this->utils = new Utils;
  }

  public function processRequest(string $method, ?string $sku, ?int $limit, ?int $offset): void {
    if($sku) {
      $this->processResourceRequest($method, $sku);
      return;
    }

    $this->processCollectionRequest($method, $limit, $offset);
  }

  private function processResourceRequest(string $method, string $sku): void {
    $product = $this->gateway->get($sku);
    if(!$product) {
      $this->error_handler->sendErrorResponse(404, "Product instance with sku $sku not found");
      return;
    }

    switch($method) {
      case "GET":
        echo json_encode([
          "success" => true,
          "data" => $product
        ]);
        break;

      case "PUT":
        $this->auths->verifyAction("UPDATE_PRODUCT_INSTANCE");
        $data = (array) json_decode(file_get_contents("php://input"));
        $errors = $this->getValidationErrors($data, false);
        if(!empty($errors)) {
          $this->error_handler->sendErrorResponse(422, $errors);
          break;
        }

        $data = $this->gateway->update($product, $data);

        echo json_encode([
          "success" => true,
          "message" => "Product instance sku $sku updated",
          "data" => $data
        ]);
        break;

      case "DELETE":
        $this->auths->verifyAction("DELETE_PRODUCT_INSTANCE");
        $res = $this->gateway->delete($sku);

        echo json_encode([
          "success" => $res,
          "message" => $res ? "Product instance sku $sku was deleted or is_sold = true if there is a constrain" : "Can't delete product instance sku $sku because of constrain"
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
        $this->auths->verifyAction("CREATE_PRODUCT_INSTANCE");
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
          "message" => "Product instance created",
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

    if($new) { //check all fields for new
      if(empty($data["product_variation_id"]) || !is_numeric($data["product_variation_id"])) $errors[] = "product_variation_id is required with integer value";
    }

    if(array_key_exists("goods_receipt_note_id", $data) && !is_numeric($data["goods_receipt_note_id"])) $errors[] = "goods_receipt_note_id must be an integer";
    if(array_key_exists("is_sold", $data) && !$this->utils->is_interpretable_bool($data["is_sold"])) $errors[] = "is_sold must be a boolean value";

    return $errors;
  }

}