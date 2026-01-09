<?php

class OrderDeliveryStateController
{
  private ErrorHandler $error_handler;
  private Utils $utils;

  public function __construct(private OrderDeliveryStateGateway $gateway, private Auths $auths)
  {
    $this->error_handler = new ErrorHandler;
    $this->utils = new Utils;
  }

  public function processRequest(string $method, ?int $id = null, ?int $limit = null, ?int $offset = null): void
  {
    if ($id) {
      $this->processResourceRequest($method, $id);
      return;
    }

    $this->processCollectionRequest($method, $limit, $offset);
  }

  private function processResourceRequest(string $method, ?int $id = null): void
  {
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

      default:
        $this->error_handler->sendErrorResponse(405, "only allow GET method");
        header("Allow: GET");
    }
  }
  public function processCollectionRequest(string $method, ?int $limit = null, ?int $offset = null): void
  {
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

      default:
        $this->error_handler->sendErrorResponse(405, "only allow GET method");
        header("Allow: GET");
    }
  }
}
