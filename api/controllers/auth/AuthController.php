<?php

class AuthController {
  private ErrorHandler $error_handler;
  private Utils $utils;
  private UserGateway $usr_gateway;
  private UserController $usr_controller;

  public function __construct(PDO $db_conn, private Auths $auths) {
    $this->error_handler = new ErrorHandler;
    $this->utils = new Utils;
    $this->usr_gateway = new UserGateway($db_conn);
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
        // 1.Verify input
        $data = (array) json_decode(file_get_contents("php://input"));
        $errors = $this->getValidationErrors($data);
        if(!empty($errors)) {
          $this->error_handler->sendErrorResponse(422, $errors);
          break;
        }

        // 2.Verify user in db
        $usr = $this->usr_gateway->getByEmailPassword($data["email"], $data["password"], true);
        if(!$usr) {
          $this->error_handler->sendErrorResponse(401, "Invalid credentials");
          break;
        }

        // 3.Gen token
        if(!$this->auths->genJWT($usr)) { // Handle re-login
          $error_msg = "Attempting re-signin detected: you was already signin in, if you want to signin with different account then signout the current account first";
          $this->error_handler->sendErrorResponse(200, $error_msg);
        } else {
          unset($usr["password"]);
          unset($usr["cart"]);
          unset($usr["addresses"]);
          echo json_encode([
            "success" => true,
            "message" => "Signin successful",
            "data" => $usr
          ]);
        }
        break;

      case "signup":
        // 1.Verify input
        $data = (array) json_decode(file_get_contents("php://input"));
        $errors = $this->usr_controller->getValidationErrors($data);
        if(!empty($errors)) {
          $this->error_handler->sendErrorResponse(422, $errors);
          break;
        }

        // 2.Create user
        $usr = $this->usr_gateway->create($data, true);
        unset($usr["password"]);
        unset($usr["cart"]);
        unset($usr["addresses"]);

        // 3. Gen token
        if($this->auths->verifyJWT()) {   // Check if a valid token exists
          $this->auths->removeJWT();      // Remove the existing token instead of overwriting because of expiration
        }

        $this->auths->genJWT($usr); // Generate a new token for the new account

        http_response_code(201);
        echo json_encode([
          "success" => true,
          "message" => "Signup successful: new user created",
          "data" => $usr
        ]);
        break;

      case "signout":
        if(!$this->auths->verifyJWT()) {
          $this->error_handler->sendErrorResponse(401, "You haven't been signin yet");
          break;
        }
        if(!$this->auths->removeJWT()) {
          $this->error_handler->sendErrorResponse(500, "Couldn't remove JWT");
          break;
        }

        echo json_encode([
          "success" => true,
          "message" => "Signout successful"
        ]);
        break;

      default:
        $this->error_handler->sendErrorResponse(404, "Action not found");
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
