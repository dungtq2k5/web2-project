<?php
//API v1.2

declare(strict_types=1);
require_once "./config/settings.php";

require_once "./vendor/autoload.php";
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$classMap = require_once "./classmap.php";
spl_autoload_register(function ($class) use ($classMap): void {
  if(isset($classMap[$class])){
    require_once $classMap[$class];
  }
});

$error_handler = new ErrorHandler;
set_exception_handler([$error_handler, "handleException"]);

header("Access-Control-Allow-Origin: " . $_ENV["DOMAIN_FRONTEND"]);                          // Allow your origin
header("Access-Control-Allow-Credentials: true");                                            // Allow cookies
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");                     // Allowed request methods
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-HTTP-Method-Override"); // Allowed headers
header("Content-Type: application/json; charset=UTF-8");

$method = $_SERVER["REQUEST_METHOD"];

if($method === "OPTIONS") { // Handle preflight requests
  http_response_code(200);
  exit;
}

$uri = trim(parse_url($_SERVER["REQUEST_URI"])["path"], "/"); //web2-project/api/...
$uri_parts = explode("/", $uri);

$usr_email = $_SERVER["PHP_AUTH_USER"] ?? null;
$usr_pwd = $_SERVER["PHP_AUTH_PW"] ?? null;

$limit = isset($_GET["limit"]) ? abs((int) $_GET["limit"]) : null;
$offset = isset($_GET["offset"]) ? abs((int) $_GET["offset"]) : null;
$id = is_numeric(end($uri_parts)) ? (int) end($uri_parts) : null;

$db = new Database($_ENV["DB_HOST"], $_ENV["DB_NAME"], $_ENV["DB_USERNAME"], $_ENV["DB_PWD"]);
$auths = new Auths(
  $db,
  $_COOKIE[$_ENV["JWT_NAME"]] ?? null,
  $_ENV["JWT_NAME"],
  $_ENV["JWT_SECRET_KEY"],
  (int) $_ENV["JWT_EXP"],
  $_ENV["JWT_HASH_ALGOR"],
  $_ENV["COOKIE_PATH"],
  $_ENV["COOKIE_DOMAIN"],
  $_ENV["COOKIE_SECURE"],
  $_ENV["COOKIE_HTTPONLY"],
  $_ENV["COOKIE_SAMESITE"]
);

$uri = preg_replace('/\/[0-9]+$/', '', $uri); //AI gen: remove {id} if exist
define("SOURCE_URI", $_ENV["SOURCE_URI"]);

switch(true) {
  case str_contains($uri, SOURCE_URI . "/products"):
    include_once "./routes/product.php";
    break;

  case str_contains($uri, SOURCE_URI . "/users"):
    include_once "./routes/user.php";
    break;

  case str_contains($uri, SOURCE_URI . "/carts"):
    include_once "./routes/cart.php";
    break;

  case str_contains($uri, SOURCE_URI . "/orders"):
    include_once "./routes/order.php";
    break;

  case str_contains($uri, SOURCE_URI . "/providers"):
    include_once "./routes/provider.php";
    break;

  case str_contains($uri, SOURCE_URI . "/goods_receipt_notes"):
    include_once "./routes/goodsReceiptNote.php";
    break;

  case str_contains($uri, SOURCE_URI . "/auths"):
    include_once "./routes/auth.php";
    break;

  default:
    $error_handler->sendErrorResponse(404, "Request not found!");
}
