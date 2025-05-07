<?php

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class Auths  {
  private ErrorHandler $error_handler;
  private PDO $conn;
  private Utils $utils;
  private UserRoleGateway $user_role;

  protected array $jwt = [
    "name" => null,
    "token" => null,
    "secret_key" => null,
    "exp" => null,
    "hash_algor" => null
  ];

  private array $cookie = [
    "path" => null,
    "domain" => null,
    "secure" => null,
    "httponly" => null,
    "samesite" => null
  ];

  public function __construct(
    PDO $db_conn,

    ?string $jwt,
    string $jwt_name,
    string $jwt_secret_key,
    int $jwt_exp,
    string $jwt_hash_algor,

    string $cookie_path,
    string $cookie_domain,
    string $cookie_secure,
    string $cookie_httponly,
    string $cookie_samesite
  ) {
    $this->error_handler = new ErrorHandler;
    $this->conn = $db_conn;
    $this->utils = new Utils;
    $this->user_role = new UserRoleGateway($db_conn);

    $this->jwt["token"] = $jwt;
    $this->jwt["name"] = $jwt_name;
    $this->jwt["secret_key"] = $jwt_secret_key;
    $this->jwt["exp"] = $jwt_exp;
    $this->jwt["hash_algor"] = $jwt_hash_algor;

    $this->cookie["path"] = $cookie_path;
    $this->cookie["domain"] = $cookie_domain;
    $this->cookie["secure"] = $cookie_secure;
    $this->cookie["httponly"] = $cookie_httponly;
    $this->cookie["samesite"] = $cookie_samesite;
  }

  public function verifyAction(string $action_code): array { // If valid return {user_id, buyer_only} for further validations
    $decoded = $this->verifyJWT();
    if(!$decoded) {
      $this->error_handler->sendErrorResponse(401, "Unauthorized");
      die;
    }

    $sql = "SELECT EXISTS (
      SELECT 1 FROM users AS usr
      INNER JOIN user_roles AS usr_rol ON usr.id = usr_rol.user_id
      INNER JOIN role_permissions AS rol_per ON usr_rol.role_id = rol_per.role_id
      INNER JOIN permissions AS per ON rol_per.permission_id = per.id
      WHERE usr.id = :id AND per.action_code = :action_code
      LIMIT 1 -- One user can have multiple roles so can be duplicated
    )";

    $usr_id = $decoded->data->user_id;
    $action_code = strtolower($action_code);

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":id", $usr_id, PDO::PARAM_INT);
    $stmt->bindValue(":action_code", $action_code, PDO::PARAM_STR);
    $stmt->execute();

    if(!(bool) $stmt->fetchColumn()) {
      $this->error_handler->sendErrorResponse(401, "Unauthorized");
      die;
    }

    $usr_roles = $this->user_role->getByUserId($usr_id); // Can't store roles in payload because of up to date problem

    return ($this->utils->hasRoleWithId($usr_roles, BUYER_ROLE_ID) && count($usr_roles) === 1)
      ? ["user_id" => $usr_id, "buyer_only" => true]
      : ["user_id" => $usr_id, "buyer_only" => false];
  }

  public function genJWT(array $usr): bool {
    if($this->verifyJWT()) return false; // Handle re-login

    $payload = [
      "iss" => "my_api_issuer",              // Issuer of the jwt
      "aud" => "my_api_audience",            // Audience of the jwt
      "iat" => time(),                       // Issued at time
      "nbf" => time(),                       // Not before time
      "exp" => time() + $this->jwt["exp"],   // Expiration time
      "data" => [                            // Custom data
        "user_id" => $usr["id"]
      ],
    ];

    $this->jwt["token"] = JWT::encode($payload, $this->jwt["secret_key"], $this->jwt["hash_algor"]);

    //store JWT in cookie
    return setcookie($this->jwt["name"], $this->jwt["token"], [
      "expires" => time() + $this->jwt["exp"],
      "path" => $this->cookie["path"],          // Available path for FrontEnd to access jwt, default "/" is available all path
      "domain" => $this->cookie["domain"],      // FrontEnd domain
      "secure" => $this->cookie["secure"],      // Only send over HTTPS
      "httponly" => $this->cookie["httponly"],  // Prevent JS access
      "samesite" => $this->cookie["samesite"],  // Prevent CSRF attacks
    ]);
  }

  public function verifyJWT(): stdClass | false {
    if(!$this->jwt["token"]) return false;

    try {
      return JWT::decode($this->jwt["token"], new Key($this->jwt["secret_key"], $this->jwt["hash_algor"]));
    } catch(Exception $e) {
      return false; // Token is invalid
    }
  }

  public function removeJWT(): bool {
    return setcookie($this->jwt["name"], "", [
      "expires" => time() - $this->jwt["exp"],  // Expire in the past
      "path" => $this->cookie["path"],          // Available path for FrontEnd to access jwt, default "/" is available all path
      "domain" => $this->cookie["domain"],      // FrontEnd domain
      "secure" => $this->cookie["secure"],      // Only send over HTTPS
      "httponly" => $this->cookie["httponly"],  // Prevent JS access
      "samesite" => $this->cookie["samesite"],  // Prevent CSRF attacks
    ]);
  }

}
