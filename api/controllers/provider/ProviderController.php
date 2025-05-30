<?php

class ProviderController {
  private ErrorHandler $error_handler;
  private Utils $utils;

  public function __construct(private ProviderGateway $gateway, private Auths $auths) {
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
    $provider = $this->gateway->get($id);
    if(!$provider) {
      $this->error_handler->sendErrorResponse(404, "Provider with an id '$id' not found");
      return;
    }

    switch($method) {
      case "GET":
        $this->auths->verifyAction("READ_PROVIDER");

        echo json_encode([
          "success" => true,
          "data" => $provider
        ]);
        break;

      case "PUT":
        $this->auths->verifyAction("UPDATE_PROVIDER");

        $data = (array) json_decode(file_get_contents("php://input"));

        $errors = $this->getValidationErrors($data, false);
        if(!empty($errors)) {
          $this->error_handler->sendErrorResponse(422, $errors);
          break;
        }

        $data = $this->gateway->update($provider, $data);

        echo json_encode([
          "success" => true,
          "message" => "Provider id $id updated",
          "data" => $data
        ]);
        break;

      case "DELETE":
        $this->auths->verifyAction("DELETE_PROVIDER");
        $this->gateway->delete($id);

        echo json_encode([
          "success" => true,
          "message" => "Provider id $id was deleted"
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
        $this->auths->verifyAction("READ_PROVIDER");

        $data = $this->gateway->getAll($limit, $offset);

        echo json_encode([
          "success" => true,
          "length" => count($data),
          "data" => $data
        ]);
        break;

      case "POST":
        $this->auths->verifyAction("CREATE_PROVIDER");

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
          "message" => "Provider created",
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

    if($new) { //check all fields for new provider
      if(empty($data["full_name"])) $errors[] = "full_name is required";
      if(empty($data["email"]) || !$this->utils->isValidEmailRobust($data["email"])) $errors[] = "valid email is required";
      if(empty($data["phone_number"]) || !$this->utils->isValidVNPhoneNumber($data["phone_number"])) $errors[] = "valid phone_number is required";

    } else { //check fields that exist
      if(array_key_exists("full_name", $data) && empty($data["full_name"])) $errors[] = "full_name is empty";
      if(
        array_key_exists("email", $data) &&
        (empty($data["email"]) || !$this->utils->isValidEmail($data["email"]))
      ) $errors[] = "email is empty or not a valid email";
      if(
        array_key_exists("phone_number", $data) &&
        (empty($data["phone_number"]) || !$this->utils->isValidVNPhoneNumber($data["phone_number"]))
      ) $errors[] = "phone_number is empty or not a valid phone number";
    }

    return $errors;
  }
}