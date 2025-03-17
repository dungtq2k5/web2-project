<?php

class UserController extends ErrorHandler
{
  private Utils $utils;

  public function __construct(private UserGateway $gateway, private Auths $auths)
  {
    $this->utils = new Utils();
  }

  public function processRequest(string $method, ?int $id, ?int $limit, ?int $offset): void
  {
    if ($id) {
      $this->processResourceRequest($method, $id);
      return;
    }

    $this->processCollectionRequest($method, $limit, $offset);
  }

  private function processResourceRequest(string $method, int $id): void
  {
    $user = $this->gateway->get($id);
    if (!$user) {
      $this->sendErrorResponse(404, "User with an id $id not found");
      return;
    }

    switch ($method) {
      case "GET":
        unset($user["password"]);
        echo json_encode([
          "success" => true,
          "data" => $user
        ]);
        break;

      case "PUT":
        $this->auths->verifyAction("UPDATE_USER");
        $data = (array) json_decode(file_get_contents("php://input"));
        $errors = $this->getValidationErrors($data, false);
        if (!empty($errors)) {
          $this->sendErrorResponse(422, $errors);
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
        $this->auths->verifyAction("DELETE_USER");
        $res = $this->gateway->delete($id);

        if (!$res) {
          $this->sendErrorResponse(409, "User id $id can't be deleted because of constrain");
          break;
        }

        echo json_encode([
          "success" => true,
          "message" => "User id $id was deleted"
        ]);
        break;

      default:
        $this->sendErrorResponse(405, "only allow GET, PUT, DELETE method");
        header("Allow: GET, PUT, DELETE");
    }

  }

  private function processCollectionRequest(string $method, ?int $limit, ?int $offset): void
  {
    switch ($method) {
      case "GET":
        $data = $this->gateway->getAll($limit, $offset);
        $dataFiltered = [];
        foreach ($data as $user) {
          unset($user["password"]);
          $dataFiltered[] = $user;
        }
        ;

        echo json_encode([
          "success" => true,
          "length" => count($data),
          "data" => $dataFiltered
        ]);
        break;

      case "POST":
        $data = (array) json_decode(file_get_contents("php://input"));

        if (isset($data["action"]) && $data["action"] == "login" && isset($data["loginArea"])) {
          $this->handleLogin($data["email"], $data["password"], $data["loginArea"]);
          break;
        }

        $this->auths->verifyAction("CREATE_USER");
        $errors = $this->getValidationErrors($data);
        if (!empty($errors)) {
          $this->sendErrorResponse(422, $errors);
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
        $this->sendErrorResponse(405, "only allow GET, POST method");
        header("Allow: GET, POST");
    }
  }

  private function handleLogin(string $email, string $password, string $login_area): void
  {
    $user = $this->gateway->login($email, $password, $login_area);

    if (!$user) {
      $this->sendErrorResponse(401, "Email or password is not correct.");
    } else {
      unset($user["password"]);

      echo json_encode([
        "success" => true,
        "message" => "Login success.",
        "user" => $user
      ]);
    }
  }

  private function getValidationErrors(array $data, bool $new = true): array
  {
    $errors = [];

    if ($new) { //check all fields for new user
      if (empty($data["full_name"]))
        $errors[] = "full_name is required";
      if (empty($data["email"]) || !$this->utils->isValidEmailRobust($data["email"]))
        $errors[] = "valid email is required";
      if (empty($data["phone_number"]) || !$this->utils->isValidVNPhoneNumber($data["phone_number"]))
        $errors[] = "valid phone_number is required";
      if (empty($data["password"]) || !$this->utils->isValidPassword($data["password"]))
        $errors[] = "valid password is required (hint: password must contain at least one letter and one number with min length = 8)";

    } else { //check fields that exist
      if (array_key_exists("full_name", $data) && empty($data["full_name"]))
        $errors[] = "full_name is empty";
      if (
        array_key_exists("email", $data) &&
        (empty($data["email"]) || !$this->utils->isValidEmail($data["email"]))
      )
        $errors[] = "email is empty or not a valid email";
      if (
        array_key_exists("phone_number", $data) &&
        (empty($data["phone_number"]) || !$this->utils->isValidVNPhoneNumber($data["phone_number"]))
      )
        $errors[] = "phone_number is empty or not a valid phone number";
      if (
        array_key_exists("password", $data) &&
        (empty($data["password"]) || !$this->utils->isValidPassword($data["password"]))
      )
        $errors[] = "password is empty or not a valid password (hint: password must contain at least one letter and one number with min length = 8)";
    }

    if (
      array_key_exists("roles_id", $data) && (
        !is_array($data["roles_id"]) ||
        !$this->utils->isListOfNumber($data["roles_id"])
      )
    )
      $errors[] = "roles_id is empty or not a list of number(s)";

    return $errors;
  }
}