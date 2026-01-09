<?php

class UserAddressController
{
  private ErrorHandler $error_handler;
  private Utils $utils;

  public function __construct(private UserAddressGateway $gateway, private Auths $auths)
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

  private function processResourceRequest(string $method, int $id): void
  {
    $address = $this->gateway->get($id);
    if (!$address) {
      $this->error_handler->sendErrorResponse(404, "Address with an id '$id' not found");
      return;
    }

    switch ($method) {
      case "GET":
        $auth = $this->auths->verifyAction("READ_USER_ADDRESS");

        if ($auth["buyer_only"] && $auth["user_id"] != $address["user_id"]) { // Buyer can only view their own resources
          $this->error_handler->sendErrorResponse(403, "Forbidden: You do not own this resource");
          break;
        }

        echo json_encode([
          "success" => true,
          "data" => $address
        ]);
        break;

      case "PUT":
        $auth = $this->auths->verifyAction("UPDATE_USER_ADDRESS");

        if ($auth["buyer_only"] && $auth["user_id"] != $address["user_id"]) { // Buyer can only change their own resources
          $this->error_handler->sendErrorResponse(403, "Forbidden: You do not own this resource");
          break;
        }

        $data = (array) json_decode(file_get_contents("php://input"));

        $errors = $this->getValidationErrors($data, false);
        if (!empty($errors)) {
          $this->error_handler->sendErrorResponse(422, $errors);
          break;
        }

        $data = $this->gateway->update($address, $data);

        echo json_encode([
          "success" => true,
          "message" => "Address id $id updated",
          "data" => $data
        ]);
        break;

      case "DELETE":
        $auth = $this->auths->verifyAction("DELETE_USER_ADDRESS");

        if ($auth["buyer_only"] && $auth["user_id"] != $address["user_id"]) { // Buyer can only change their own resources
          $this->error_handler->sendErrorResponse(403, "Forbidden: You do not own this resource");
          break;
        }

        $this->gateway->delete($id);

        echo json_encode([
          "success" => true,
          "message" => "Address id $id was deleted"
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
        $auth = $this->auths->verifyAction("READ_USER_ADDRESS");

        $data = $auth["buyer_only"] // Buyer can only read their own data
          ? $this->gateway->getByUserId($auth["user_id"], $limit, $offset)
          : $this->gateway->getAll($limit, $offset);

        echo json_encode([
          "success" => true,
          "length" => count($data),
          "data" => $data
        ]);
        break;

      case "POST":
        $auth = $this->auths->verifyAction("CREATE_USER_ADDRESS");

        $data = (array) json_decode(file_get_contents("php://input"));

        if ($auth["buyer_only"]) $data["user_id"] = $auth["user_id"]; // Buyer can only create for their own

        $errors = $this->getValidationErrors($data);
        if (!empty($errors)) {
          $this->error_handler->sendErrorResponse(422, $errors);
          break;
        }

        $data = $this->gateway->create($data);

        http_response_code(201);
        echo json_encode([
          "success" => true,
          "message" => "Address is created",
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

    if ($new) { //check all fields for new user
      if (empty($data["name"])) $errors[] = "name is required";
      if (empty($data["user_id"]) || !is_numeric($data["user_id"])) $errors[] = "user_id is required with integer value";
      if (empty($data["street"])) $errors[] = "street is required";
      if (empty($data["apartment_number"])) $errors[] = "apartment_number is required";
      if (empty($data["ward"])) $errors[] = "ward is required";
      if (empty($data["district"])) $errors[] = "district is required";
      if (empty($data["city_province"])) $errors[] = "city_province is required";
      if (empty($data["phone_number"])) $errors[] = "phone_number is required";
    } else { //check fields which exist
      if (array_key_exists("street", $data) && empty($data["street"])) $errors[] = "street is empty";
      if (array_key_exists("apartment_number", $data) && empty($data["apartment_number"])) $errors[] = "apartment_number is empty";
      if (array_key_exists("ward", $data) && empty($data["ward"])) $errors[] = "ward is empty";
      if (array_key_exists("district", $data) && empty($data["district"])) $errors[] = "district is empty";
      if (array_key_exists("city_province", $data) && empty($data["city_province"])) $errors[] = "city_province is empty";
      if (array_key_exists("phone_number", $data) && empty($data["phone_number"])) $errors[] = "phone_number is empty";
      if (array_key_exists("name", $data) && empty($data["name"])) $errors[] = "name is empty";
    }

    if (array_key_exists("is_default", $data) && !$this->utils->isInterpretableBool($data["is_default"])) $errors[] = "is_default is empty or not a boolean value";

    return $errors;
  }
}
