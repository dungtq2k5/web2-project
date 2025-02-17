<?php

switch(true) {
  case str_contains($uri, SOURCE_URI . "/users/user_roles"):
    $user_id = $_GET["user_id"] ?? null;
    $role_id = $_GET["role_id"] ?? null;
    $gateway = new UserRoleGateway($db);
    $controller = new UserRoleController($gateway, $auths);
    $controller->processRequest($method, $user_id, $role_id, $limit, $offset);
    break;

  case str_contains($uri, SOURCE_URI . "/users/roles"):
    $gateway = new RoleGateway($db);
    $controller = new RoleController($gateway, $auths);
    $controller->processRequest($method, $id, $limit, $offset);
    break;

  case str_contains($uri, SOURCE_URI . "/users/role_permissions"):
    $role_id = $_GET["role_id"] ?? null;
    $permission_id = $_GET["permission_id"] ?? null;
    $gateway = new RolePermissionGateway($db);
    $controller = new RolePermissionController($gateway, $auths);
    $controller->processRequest($method, $role_id, $permission_id, $limit, $offset);
    break;

  case str_contains($uri, SOURCE_URI . "/users/permissions"):
    $gateway = new PermissionGateway($db);
    $controller = new PermissionController($gateway, $auths);
    $controller->processRequest($method, $id, $limit, $offset);
    break;

  case str_contains($uri, SOURCE_URI . "/users"):
    $gateway = new UserGateway($db);
    $controller = new UserController($gateway, $auths);
    $controller->processRequest($method, $id, $limit, $offset);
    break;

  default:
    http_response_code(404);
    echo json_encode([
      "success" => false,
      "message" => "Request not found!"
    ]);
}
