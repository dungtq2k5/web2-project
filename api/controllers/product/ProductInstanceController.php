<?php

class ProductInstanceController
{
  private ErrorHandler $error_handler;
  private Utils $utils;

  public function __construct(private ProductInstanceGateway $gateway, private Auths $auths)
  {
    $this->error_handler = new ErrorHandler;
    $this->utils = new Utils;
  }

  public function processRequest(string $method, ?string $sku = null, ?int $limit = null, ?int $offset = null): void
  {
    if ($sku) {
      $this->processResourceRequest($method, $sku);
      return;
    }

    $this->processCollectionRequest($method, $limit, $offset);
  }

  private function processResourceRequest(string $method, string $sku): void
  {
    $instance = $this->gateway->get($sku);
    if (!$instance) {
      $this->error_handler->sendErrorResponse(404, "Product instance with sku '$sku' not found");
      return;
    }

    switch ($method) {
      case "GET":
        $this->auths->verifyAction("READ_PRODUCT_INSTANCE");

        echo json_encode([
          "success" => true,
          "data" => $instance
        ]);
        break;

      case "PUT":
        $this->auths->verifyAction("UPDATE_PRODUCT_INSTANCE");

        $data = (array) json_decode(file_get_contents("php://input"));

        $errors = $this->getValidationErrors($data, false);
        if (!empty($errors)) {
          $this->error_handler->sendErrorResponse(422, $errors);
          break;
        }

        $data = $this->gateway->update($instance, $data);

        echo json_encode([
          "success" => true,
          "message" => "Product instance sku $sku updated",
          "data" => $data
        ]);
        break;

      case "DELETE":
        $this->auths->verifyAction("DELETE_PRODUCT_INSTANCE");

        $this->gateway->delete($instance);

        echo json_encode([
          "success" => true,
          "message" => "Product instance sku $sku was deleted"
        ]);
        break;

      default:
        $this->error_handler->sendErrorResponse(405, "only allow GET, PUT, DELETE method");
        header("Allow: GET, PUT, DELETE");
    }
  }

  private function processCollectionRequest(string $method, ?int $limit = null, ?int $offset = null): void
  {
    switch ($method) {
      case "GET":
        $this->auths->verifyAction("READ_PRODUCT_INSTANCE");

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
        if (!empty($errors)) {
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

  private function getValidationErrors(array $data, bool $new = true): array
  {
    $errors = [];

    if ($new) { // New instance
      if (
        empty($data["product_variation_id"]) ||
        !is_numeric($data["product_variation_id"])
      ) $errors[] = "product_variation_id is required with integer value";
      if (
        empty($data["supplier_serial_number"]) ||
        !$this->utils->isValidSerialNum($data["supplier_serial_number"])
      ) $errors[] = "supplier_serial_number is required with valid format";
    } else { // Update instance
      if (
        array_key_exists("supplier_serial_number", $data) &&
        (empty($data["supplier_serial_number"]) || !$this->utils->isValidSerialNum($data["supplier_serial_number"]))
      ) $errors[] = "supplier_serial_number is empty or not valid format";
    }

    if (
      array_key_exists("supplier_imei_number", $data) &&
      !$this->utils->isInterpretableNull($data["supplier_imei_number"]) && // Allow nullable
      (empty($data["supplier_imei_number"]) || !$this->utils->isValidIMEI($data["supplier_imei_number"]))
    ) $errors[] = "supplier_imei_number is empty or not valid format or not null";

    if (
      array_key_exists("goods_receipt_note_id", $data) &&
      !$this->utils->isInterpretableNull($data["goods_receipt_note_id"]) && // Allow nullable
      !is_numeric($data["goods_receipt_note_id"])
    ) $errors[] = "goods_receipt_note_id must be an integer or null";

    if (
      array_key_exists("is_sold", $data) &&
      !$this->utils->isInterpretableBool($data["is_sold"]) // Allow nullable
    ) $errors[] = "is_sold must be a boolean value";

    return $errors;
  }
}
