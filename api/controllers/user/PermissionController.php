<?php

class PermissionController {
  private ErrorHandler $error_handler;

  public function __construct(private PermissionGateway $gateway, private Auths $auths) {
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
    $permission = $this->gateway->get($id);
    if(!$permission) {
      $this->error_handler->sendErrorResponse(404, "Permission with an id '$id' not found");
      return;
    }

    switch($method) {
      case "GET":
        $this->auths->verifyAction("READ_PERMISSION");

        echo json_encode([
          "success" => true,
          "data" => $permission
        ]);
        break;

      default:
        $this->error_handler->sendErrorResponse(405, "only allow GET method");
        header("Allow: GET");
    }

  }

  private function processCollectionRequest(string $method, ?int $limit=null, ?int $offset=null): void {
    switch($method) {
      case "GET":
        $this->auths->verifyAction("READ_PERMISSION");

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