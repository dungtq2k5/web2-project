<?php

switch (true) {
  case $uri === SOURCE_URI . "/orders":
    $gateway = new OrderGateway($db_conn);
    $controller = new OrderController($gateway, $auths);
    $controller->processRequest($method, $id, $limit, $offset);
    break;

  // No need order_items API.

  case $uri === SOURCE_URI . "/orders/delivery_states":
    $gateway = new OrderDeliveryStateGateway($db_conn);
    $controller = new OrderDeliveryStateController($gateway, $auths);
    $controller->processRequest($method, $id, $limit, $offset);
    break;

  default:
    $error_handler->sendErrorResponse(404, "Request not found");
}
