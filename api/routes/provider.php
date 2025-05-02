<?php

switch(true) {
  case $uri === SOURCE_URI . "/providers":
    $gateway = new ProviderGateway($db_conn);
    $controller = new ProviderController($gateway, $auths);
    $controller->processRequest($method, $id, $limit, $offset);
    break;

  default:
    $error_handler->sendErrorResponse(404, "Request not found");
}
