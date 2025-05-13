<?php

class RoleController {
  private ErrorHandler $error_handler;
  private Utils $utils;

  public function __construct(private RoleGateway $gateway, private Auths $auths) {
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
    $role = $this->gateway->get($id);
    if(!$role) {
      $this->error_handler->sendErrorResponse(404, "Role with an id '$id' not found");
      return;
    }

  switch($method) {
      case "GET":
        $this->auths->verifyAction("READ_ROLE");

        echo json_encode([
          "success" => true,
          "data" => $role
        ]);
        break;

      case "PUT":
        $this->auths->verifyAction("UPDATE_ROLE");

        $data = (array) json_decode(file_get_contents("php://input"));

        $errors = $this->getValidationErrors($data, false);
        if(!empty($errors)) {
          $this->error_handler->sendErrorResponse(422, $errors);
          break;
        }

        $data = $this->gateway->update($role, $data);

        echo json_encode([
          "success" => true,
          "message" => "Role id $id updated",
          "data" => $data
        ]);
        break;

      case "DELETE":
        $this->auths->verifyAction("DELETE_ROLE");

        $this->gateway->delete($id);

        echo json_encode([
          "success" => true,
          "message" => "Role id $id was deleted"
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
        $this->auths->verifyAction("READ_ROLE");

        $data = $this->gateway->getAll($limit, $offset);

        echo json_encode([
          "success" => true,
          "length" => count($data),
          "data" => $data
        ]);
        break;

      case "POST":
        $this->auths->verifyAction("CREATE_ROLE");

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
          "message" => "Role created",
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
      if(empty($data["name"])) $errors[] = "name is required";
    } else { //check fields that exist
      if(array_key_exists("name", $data) && empty($data["name"])) $errors[] = "name is empty";
    }

    if(array_key_exists("permissions_id", $data) && (
      !is_array($data["permissions_id"]) ||
      !$this->utils->isListOfNumber($data["permissions_id"])
    )) $errors[] = "permissions_id is empty or not a list of number(s)";

    return $errors;
  }
}
