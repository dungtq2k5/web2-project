<?php

class UserController {
  private ErrorHandler $error_handler;
  private Utils $utils;

  public function __construct(private UserGateway $gateway, private Auths $auths) {
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
    $user = $this->gateway->get($id);
    if(!$user) {
      $this->error_handler->sendErrorResponse(404, "User with an id '$id' not found");
      return;
    }

    switch($method) {
      case "GET":
        $auth = $this->auths->verifyAction("READ_USER");

        if($auth["buyer_only"] && $auth["user_id"] != $id) { // Buyer can only view their own resources
          $this->error_handler->sendErrorResponse(403, "Forbidden: You do not own this resource");
          break;
        }

        unset($user["password"]);
        echo json_encode([
          "success" => true,
          "data" => $user
        ]);
        break;

      case "PUT":
        $auth = $this->auths->verifyAction("UPDATE_USER");

        if($auth["buyer_only"] && $auth["user_id"] != $id) { // Buyer can only change their own resources
          $this->error_handler->sendErrorResponse(403, "Forbidden: You do not own this resources");
          break;
        }

        $data = (array) json_decode(file_get_contents("php://input"));

        if($auth["buyer_only"]) unset($data["roles_id"]); // Buyer cannot update their own roles

        $errors = $this->getValidationErrors($data, false);
        if(!empty($errors)) {
          $this->error_handler->sendErrorResponse(422, $errors);
          break;
        }

        $data = $this->gateway->update($user, $data);
        unset($data["password"]);

        echo json_encode([
          "success" => true,
          "message" => "User id $id updated",
          "data" => $data
        ]);
        break;

      case "DELETE":
        $auth = $this->auths->verifyAction("DELETE_USER");

        if($auth["buyer_only"] && $auth["user_id"] != $id) { // Buyer can only change their own resources
          $this->error_handler->sendErrorResponse(403, "Forbidden: You do not own this resources");
          break;
        }

        $this->gateway->delete($id);

        echo json_encode([
          "success" => true,
          "message" => "User id $id was deleted"
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
        $auth = $this->auths->verifyAction("READ_USER");

        $data = $auth["buyer_only"]
          ? [$this->gateway->get($auth["user_id"])]
          : $this->gateway->getAll($limit, $offset);

        echo json_encode([
          "success" => true,
          "length" => count($data),
          "data" => $data
        ]);
        break;

      case "POST":
        $this->auths->verifyAction("CREATE_USER");

        $data = (array) json_decode(file_get_contents("php://input"));

        $errors = $this->getValidationErrors($data);
        if(!empty($errors)) {
          $this->error_handler->sendErrorResponse(422, $errors);
          break;
        }

        $data = $this->gateway->create($data);
        unset($data["password"]);

        http_response_code(201);
        echo json_encode([
          "success" => true,
          "message" => "User created",
          "data" => $data
        ]);
        break;

      default:
        $this->error_handler->sendErrorResponse(405, "only allow GET, POST method");
        header("Allow: GET, POST");
    }
  }

  public function getValidationErrors(array $data, bool $new=true): array {
    $errors = [];

    if($new) { // Validate all fields for new user
      if(empty($data["full_name"])) $errors[] = "full_name is required";
      if(empty($data["email"]) || !$this->utils->isValidEmailRobust($data["email"])) $errors[] = "valid email is required";
      if(empty($data["phone_number"]) || !$this->utils->isValidVNPhoneNumber($data["phone_number"])) $errors[] = "valid phone_number is required";
      if(empty($data["password"]) || !$this->utils->isValidPassword($data["password"])) $errors[] = "valid password is required (hint: password must contain at least one letter and one number with min length = 8)";

    } else { // Validate fields that exist
      if(array_key_exists("full_name", $data) && empty($data["full_name"])) $errors[] = "full_name is empty";
      if(
        array_key_exists("email", $data) &&
        (empty($data["email"]) || !$this->utils->isValidEmail($data["email"]))
      ) $errors[] = "email is empty or not a valid email";
      if(
        array_key_exists("phone_number", $data) &&
        (empty($data["phone_number"]) || !$this->utils->isValidVNPhoneNumber($data["phone_number"]))
      ) $errors[] = "phone_number is empty or not a valid phone number";
      if(
        array_key_exists("password", $data) &&
        (empty($data["password"]) || !$this->utils->isValidPassword($data["password"]))
      ) $errors[] = "password is empty or not a valid password (hint: password must contain at least one letter and one number with min length = 8)";
    }

    if(array_key_exists("roles_id", $data) && (
      !is_array($data["roles_id"]) ||
      !$this->utils->isListOfNumber($data["roles_id"])
    )) $errors[] = "roles_id is empty or not a list of number(s)";

    return $errors;
  }
}
