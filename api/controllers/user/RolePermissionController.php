<?php

class RolePermissionController {
  private ErrorHandler $error_handler;
  public function __construct(private RolePermissionGateway $gateway, private Auths $auths) {
    $this->error_handler = new ErrorHandler;
  }

  public function processRequest(string $method, ?int $role_id=null, ?int $permission_id=null, ?int $limit=null, ?int $offset=null): void {
    if($role_id) {
      $this->processResourceRequest($method, $role_id, $permission_id);
      return;
    }

    $this->processCollectionRequest($method, $limit, $offset);
  }

  private function processResourceRequest(string $method, int $role_id, ?int $permission_id=null): void {
    $role_permissions = $this->gateway->get($role_id, $permission_id);
    if(!$role_permissions) {
      $error_msg = $permission_id
        ? "Role id '$role_id' with permission id '$permission_id' not found"
        : "Role with an id '$role_id}'";
      $this->error_handler->sendErrorResponse(404, $error_msg);
      return;
    }

    switch($method) {
      case "GET":
        $this->auths->verifyAction("READ_ROLE_PERMISSION");

        echo json_encode([
          "success" => true,
          "length" => count($role_permissions),
          "data" => $role_permissions
        ]);
        break;

      case "DELETE":
        $this->auths->verifyAction("DELETE_ROLE_PERMISSION");

        if(!$permission_id) {
          $this->error_handler->sendErrorResponse(422, "permission_id is required");
          break;
        }

        $this->gateway->delete($role_id, $permission_id);

        echo json_encode([
          "success" => true,
          "message" => "Role id $role_id and permission id $permission_id was deleted"
        ]);
        break;

      default:
        $this->error_handler->sendErrorResponse(405, "only allow GET, DELETE method");
        header("Allow: GET, DELETE");
    }

  }

  private function processCollectionRequest(string $method, ?int $limit=null, ?int $offset=null): void {
    switch($method) {
      case "GET":
        $this->auths->verifyAction("READ_ROLE_PERMISSION");

        $data = $this->gateway->getAll($limit, $offset);

        echo json_encode([
          "success" => true,
          "length" => count($data),
          "data" => $data
        ]);
        break;

      case "POST":
        $this->auths->verifyAction("CREATE_ROLE_PERMISSION");

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
          "message" => "Role's permission created",
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

    if($new) { //check all fields for new role
      if(empty($data["role_id"]) || !is_numeric($data["role_id"])) $errors[] = "role_id is required with integer value";
      if(empty($data["permission_id"]) || !is_numeric($data["permission_id"])) $errors[] = "permission_id is required with integer value";

    } else { //check fields that exist
      if(
        array_key_exists("role_id", $data) &&
        (empty($data["role_id"]) || !is_numeric($data["role_id"]))
      ) $errors[] = "role_id must be an integer";
      if(
        array_key_exists("permission_id", $data) &&
        (empty($data["permission_id"]) || !is_numeric($data["permission_id"]))
      ) $errors[] = "permission_id must be an integer";
    }

    return $errors;
  }
}
