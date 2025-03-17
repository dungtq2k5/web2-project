<?php

class Auths extends ErrorHandler
{
  private PDO $conn;
  private JWTHandler $jwt_handler;

  public function __construct(Database $db)
  {
    $this->conn = $db->getConnection();
    $this->jwt_handler = new JWTHandler();
  }

  public function verifyAction(string $action_code): void
  { //TODO temp for dev
    // if(!$this->usr_email || !$this->usr_pwd) {
    //   header('WWW-Authenticate: Basic realm="My Realm"'); //Required for basic auth.
    //   $this->sendErrorResponse(401, "Unauthorized");
    //   die;
    // }

    // $sql = "SELECT usr.password FROM users AS usr
    //   INNER JOIN user_roles AS usr_rol ON usr.id = usr_rol.user_id
    //   INNER JOIN role_permissions AS rol_per ON usr_rol.role_id = rol_per.role_id
    //   INNER JOIN permissions AS per ON rol_per.permission_id = per.id
    //   WHERE usr.email = :email
    //   AND per.action_code = LOWER(:action_code)";

    // $stmt = $this->conn->prepare($sql);
    // $stmt->bindValue(":email", $this->usr_email, PDO::PARAM_STR);
    // $stmt->bindValue(":action_code", $action_code, PDO::PARAM_STR);
    // $stmt->execute();

    // $data = $stmt->fetch(PDO::FETCH_ASSOC);
    // if(!$data || !password_verify($this->usr_pwd, $data["password"])) {
    //   header('WWW-Authenticate: Basic realm="My Realm"'); //Required for basic auth.
    //   $this->sendErrorResponse(401, "Unauthorized");
    //   die;
    // }
  }

}
