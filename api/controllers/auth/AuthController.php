<?php

class AuthController {
  private ErrorHandler $error_handler;
  private Utils $utils;
  private UserGateway $usr_gateway;
  private UserController $usr_controller;

  public function __construct(Database $db, private Auths $auths) {
    $this->error_handler = new ErrorHandler;
    $this->utils = new Utils;
    $this->usr_gateway = new UserGateway($db);
    $this->usr_controller = new UserController($this->usr_gateway, $auths);
  }

  public function processRequest(string $method, string $action): void {
    if($method !== "POST") {
      $this->error_handler->sendErrorResponse(405, "Only allow POST method");
      header("Allow: POST");
      return;
    }

    switch($action) {
      case "signin":
        // Verify input
        $data = (array) json_decode(file_get_contents("php://input"));
        $errors = $this->getValidationErrors($data);
        if(!empty($errors)) {
          $this->error_handler->sendErrorResponse(422, $errors);
          break;
        }

        // Verify user in db
        $usr = $this->usr_gateway->getByEmailPassword($data["email"], $data["password"]);
        if(!$usr) {
          $this->error_handler->sendErrorResponse(401, "Invalid credentials");
          break;
        }

        // Gen token
        if(!$this->auths->genJWT($usr["id"])) { // Handle re-login
          $this->error_handler->sendErrorResponse(200, "Attempting re-login detected, user was already logged in, no need to login again");
        } else {
          echo json_encode([
            "success" => true,
            "message" => "Signin/Login successful",
            "data" => $usr
          ]);
        }
        break;

      case "signup":
        // Verify input
        $data = (array) json_decode(file_get_contents("php://input"));
        $errors = $this->usr_controller->getValidationErrors($data);
        if(!empty($errors)) {
          $this->error_handler->sendErrorResponse(422, $errors);
          break;
        }

        $usr = $this->usr_gateway->create($data);
        unset($usr["password"]);

        if(!$this->auths->genJWT($usr["id"])) { // Remove existing token
          $this->auths->removeJWT();
        }

        $this->auths->genJWT($usr["id"]);

        http_response_code(201);
        echo json_encode([
          "success" => true,
          "message" => "Signup successful, new user created",
          "data" => $usr
        ]);
        break;

      default: //signout
        if(!$this->auths->removeJWT()) {
          $this->error_handler->sendErrorResponse(500, "Couldn't remove JWT");
          break;
        }

        echo json_encode([
          "success" => true,
          "message" => "Signout/Logout successful"
        ]);
    }
  }

  private function getValidationErrors(array $data): array {
    $errors = [];

    if(!array_key_exists("email", $data)) {
      $errors[] = "email is required";
    } elseif(!$this->utils->isValidEmailRobust($data["email"])) {
      $errors[] = "invalid email";
    }

    if(!array_key_exists("password", $data)) {
      $errors[] = "password is required";
    } elseif(!$this->utils->isValidPassword($data["password"])) {
      $errors[] = "invalid password";
    }

    return $errors;
  }
}
