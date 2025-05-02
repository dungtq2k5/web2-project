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

      // case "PUT":
      //   $this->auths->verifyAction("UPDATE_PERMISSION");

      //   $data = (array) json_decode(file_get_contents("php://input"));

      //   $errors = $this->getValidationErrors($data, false);
      //   if(!empty($errors)) {
      //     $this->error_handler->sendErrorResponse(422, $errors);
      //     break;
      //   }

      //   $data = $this->gateway->update($permission, $data);

      //   echo json_encode([
      //     "success" => true,
      //     "message" => "Permission id $id updated",
      //     "data" => $data
      //   ]);
      //   break;

      // case "DELETE":
      //   $this->auths->verifyAction("DELETE_PERMISSION");
      //   $this->gateway->delete($id);

      //   echo json_encode([
      //     "success" => true,
      //     "message" => "Permission id $id was deleted"
      //   ]);
      //   break;

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

      // case "POST":
      //   $this->auths->verifyAction("CREATE_PERMISSION");
      //   $data = (array) json_decode(file_get_contents("php://input"));
      //   $errors = $this->getValidationErrors($data);
      //   if(!empty($errors)) {
      //     $this->error_handler->sendErrorResponse(422, $errors);
      //     break;
      //   }

      //   $data = $this->gateway->create($data);

      //   http_response_code(201);
      //   echo json_encode([
      //     "success" => true,
      //     "message" => "Permission created",
      //     "data" => $data
      //   ]);
      //   break;

      default:
        $this->error_handler->sendErrorResponse(405, "only allow GET method");
        header("Allow: GET");
    }
  }

  // private function getValidationErrors(array $data, bool $new=true): array {
  //   $errors = [];

  //   if($new) { //check all fields for new
  //     if(empty($data["action_name"])) $errors[] = "action_name is required";
  //     if(empty($data["action_code"])) $errors[] = "action_code is required";
  //   } else { //check fields that exist
  //     if(array_key_exists("action_name", $data) && empty($data["action_name"])) $errors[] = "action_name is empty";
  //     if(array_key_exists("action_code", $data) && empty($data["action_code"])) $errors[] = "action_code is empty";
  //   }

  //   return $errors;
  // }
}