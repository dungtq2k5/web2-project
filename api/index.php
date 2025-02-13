<?php

declare(strict_types=1);

require_once "./config/settings.php";

$classMap = require_once "./classmap.php";
spl_autoload_register(function ($class) use ($classMap): void {
  if(isset($classMap[$class])) {
    require_once $classMap[$class];
  }
});

set_exception_handler("ErrorHandler::handleException");

header("Content-type: application/json; charset=UTF-8");

$method = $_SERVER["REQUEST_METHOD"];
$uri = parse_url($_SERVER["REQUEST_URI"])["path"]; //web2-project/api/...

$usr_email = $_SERVER["PHP_AUTH_USER"] ?? null;
$usr_pwd = $_SERVER["PHP_AUTH_PW"] ?? null;
$limit = abs((int) $_GET["limit"]) ?? null;
$offset = abs((int) $_GET["offset"]) ?? null;
$id = $_GET["id"] ?? null;  

$db = new Database("localhost", "smartwatch_db", "root", "");
$auths = new Auths($db, $usr_email, $usr_pwd);

if(str_contains($uri, SOURCE_URI . "/products")) {
  $gateway = new ProductGateway($db);
  $controller = new ProductController($gateway, $auths);
  $controller->processRequest($method, $id, $limit, $offset);

} elseif(str_contains($uri, SOURCE_URI . "/product_os")) {
  $gateway = new ProductOSGateway($db);
  $controller = new ProductOSController($gateway, $auths);
  $controller->processRequest($method, $id, $limit, $offset);

} elseif(str_contains($uri, SOURCE_URI . "/product_brands")) {
  $gateway = new ProductBrandGateway($db);
  $controller = new ProductBrandController($gateway, $auths);
  $controller->processRequest($method, $id, $limit, $offset);

} elseif(str_contains($uri, SOURCE_URI . "/product_categories")) {
  $gateway = new ProductCategoryGateway($db);
  $controller = new ProductCategoryController($gateway, $auths);
  $controller->processRequest($method, $id, $limit, $offset);

} elseif(str_contains($uri, SOURCE_URI . "/product_instances")) {
  $sku = $_GET["sku"] ?? null;
  $gateway = new ProductInstanceGateway($db);
  $controller = new ProductInstanceController($gateway, $auths);
  $controller->processRequest($method, $sku, $limit, $offset);

} elseif(str_contains($uri, SOURCE_URI . "/product_variations")) {
  $utils = new Utils();
  $gateway = new ProductVariationGateway($db);
  $controller = new ProductVariationController($gateway, $auths, $utils);
  $controller->processRequest($method, $id, $limit, $offset);

} else {
  http_response_code(404);
  echo json_encode([
    "success" => false,
    "message" => "Request not found!"
  ]);
}
