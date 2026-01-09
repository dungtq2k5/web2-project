<?php

switch (true) {
  case $uri === SOURCE_URI . "/users":
    $gateway = new UserGateway($db_conn);
    $controller = new UserController($gateway, $auths);
    $controller->processRequest($method, $id, $limit, $offset);
    break;

  case $uri === SOURCE_URI . "/users/roles":
    $gateway = new RoleGateway($db_conn);
    $controller = new RoleController($gateway, $auths);
    $controller->processRequest($method, $id, $limit, $offset);
    break;

  case $uri === SOURCE_URI . "/users/permissions":
    $gateway = new PermissionGateway($db_conn);
    $controller = new PermissionController($gateway, $auths);
    $controller->processRequest($method, $id, $limit, $offset);
    break;

  case $uri === SOURCE_URI .  "/users/addresses":
    $gateway = new UserAddressGateway($db_conn);
    $controller = new UserAddressController($gateway, $auths);
    $controller->processRequest($method, $id, $limit, $offset);
    break;

  default:
    $error_handler->sendErrorResponse(404, "Request not found");
}
