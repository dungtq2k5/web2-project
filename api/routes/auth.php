<?php

$controller = new AuthController($db, $auths);

switch(true) {
  case $uri === SOURCE_URI . "/auths/signin":
    $controller->processRequest($method, "signin");
    break;

  case $uri === SOURCE_URI . "/auths/signup":
    $controller->processRequest($method, "signup");
    break;

  case $uri === SOURCE_URI . "/auths/signout":
    $controller->processRequest($method, "signout");
    break;

  default:
    $error_handler->sendErrorResponse(404, "Request not found");
}
