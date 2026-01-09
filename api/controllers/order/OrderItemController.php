<?php

class OrderItemController extends ErrorHandler
{

  private Utils $utils;

  public function __construct(private OrderItemGateway $gateway, private Auths $auths)
  {
    $this->utils = new Utils();
  }

  public function processRequest(string $method, ?string $id, ?int $limit, ?int $offset): void
  { //product_instance_sku as id
    if ($id) {
      $this->processResourceRequest($method, $id);
      return;
    }

    $this->processCollectionRequest($method, $limit, $offset);
  }

  private function processResourceRequest(string $method, ?string $id): void
  {
    $order_item = $this->gateway->get($id);
    if (!$order_item) {
      $this->sendErrorResponse(404, "Order item with an id $id not found");
      return;
    }

    switch ($method) {
      case "GET":
        echo json_encode([
          "success" => true,
          "data" => $order_item
        ]);
        break;

      default:
        $this->sendErrorResponse(405, "only allow GET, PUT, DELETE method");
        header("Allow: GET");
    }
  }

  private function processCollectionRequest(string $method, ?int $limit, ?int $offset): void
  {
    switch ($method) {
      case "GET":
        $data = $this->gateway->getAll($limit, $offset);
        echo json_encode([
          "success" => true,
          "length" => count($data),
          "data" => $data
        ]);
        break;

      case "POST":
        $this->auths->verifyAction("CREATE_ORDER_ITEM");
        $data = (array) json_decode(file_get_contents("php://input"));
        $errors = $this->getValidationErrors($data);
        if (!empty($errors)) {
          $this->sendErrorResponse(422, $errors);
          break;
        }
        $this->gateway->create($data["order_id"], $data);
        echo json_encode([
          "success" => true,
          "message" => "Order item created",
          "data" => $data
        ]);
        break;

      default:
        $this->sendErrorResponse(405, "only allow GET, POST method");
        header("Allow: GET, POST");
    }
  }
  private function getValidationErrors(array $data, bool $new = true): array
  {
    $errors = [];

    if ($new) {
      if (empty($data["product_instance_sku"]) || !$this->utils->isValidProductSKU($data["product_instance_sku"])) $errors[] = "valid product_instance_sku is required";
      if (empty($data["order_id"]) || !is_numeric($data["order_id"])) $errors[] = "order_id is required and must be an integer";
      if (empty($data["price_cents"]) || !is_numeric($data["price_cents"])) $errors[] = "price_cents is required and must be an integer";
    } else {
      if (
        array_key_exists("product_instance_sku", $data) &&
        (empty($data["product_instance_sku"]) || !$this->utils->isValidProductSKU($data["product_instance_sku"]))
      ) $errors[] = "product_instance_sku is empty or not valid";
      if (
        array_key_exists("order_id", $data) &&
        (empty($data["order_id"]) || !is_numeric($data["order_id"]))
      ) $errors[] = "order_id is empty or not an integer";
      if (
        array_key_exists("price_cents", $data) &&
        (empty($data["price_cents"]) || !is_numeric($data["price_cents"]))
      ) $errors[] = "price_cents is empty or not an integer";
    }

    return $errors;
  }
}
