<?php

switch(true) {
  case $uri === SOURCE_URI . "/orders":
    $gateway = new OrderGateway($db);
    $controller = new OrderController($gateway, $auths);
    $controller->processRequest($method, $id, $limit, $offset);
    break;

  case $uri === SOURCE_URI . "/orders/delivery_states":
    $gateway = new OrderDeliveryStateGateway($db);
    $controller = new OrderDeliveryStateController($gateway, $auths);
    $controller->processRequest($method, $id, $limit, $offset);
    break;

  case strpos($uri, SOURCE_URI . "/orders/items") === 0:
    $utils = new Utils();
    $id = $utils->isValidProductSKU(end($uri_parts)) ? end($uri_parts) : null; //PK is product_instance_sku
    $gateway = new OrderItemGateway($db);
    $controller = new OrderItemController($gateway, $auths);
    $controller->processRequest($method, $id, $limit, $offset);
    break;

  default:
    $errorHandler = new ErrorHandler();
    $errorHandler->sendErrorResponse(404, "Request not found!");
}
