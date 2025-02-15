<?php

declare(strict_types=1);

require_once "./config/settings.php";

$classMap = require_once "./classmap.php";
spl_autoload_register(function ($class) use ($classMap): void {
  if(isset($classMap[$class])) {
    // echo $classMap[$class] . "\n";
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
  $gateway = new ProductVariationGateway($db);
  $controller = new ProductVariationController($gateway, $auths);
  $controller->processRequest($method, $id, $limit, $offset);

} elseif(str_contains($uri, SOURCE_URI . "/users")) {
  $gateway = new UserGateway($db);
  $controller = new UserController($gateway, $auths);
  $controller->processRequest($method, $id, $limit, $offset);

} elseif(str_contains($uri, SOURCE_URI . "/user_roles")) {
  $user_id = $_GET["user_id"] ?? null;
  $role_id = $_GET["role_id"] ?? null;
  $gateway = new UserRoleGateway($db);
  $controller = new UserRoleController($gateway, $auths);
  $controller->processRequest($method, $user_id, $role_id, $limit, $offset);

} elseif(str_contains($uri, SOURCE_URI. "/roles")) {
  $gateway = new RoleGateway($db);
  $controller = new RoleController($gateway, $auths);
  $controller->processRequest($method, $id, $limit, $offset);

} elseif(str_contains($uri, SOURCE_URI . "/role_permissions")) {
  $role_id = $_GET["role_id"] ?? null;
  $permission_id = $_GET["permission_id"] ?? null;
  $gateway = new RolePermissionGateway($db);
  $controller = new RolePermissionController($gateway, $auths);
  $controller->processRequest($method, $role_id, $permission_id, $limit, $offset);

} elseif(str_contains($uri, SOURCE_URI . "/permissions")) {
  $gateway = new PermissionGateway($db);
  $controller = new PermissionController($gateway, $auths);
  $controller->processRequest($method, $id, $limit, $offset);

} else {
  http_response_code(404);
  echo json_encode([
    "success" => false,
    "message" => "Request not found!"
  ]);
}
