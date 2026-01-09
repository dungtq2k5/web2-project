<?php

switch (true) {
  case $uri === SOURCE_URI . "/products":
    $gateway = new ProductGateway($db_conn);
    $controller = new ProductController($gateway, $auths);
    $method_override = $_SERVER["HTTP_X_HTTP_METHOD_OVERRIDE"] ?? $_POST["_method"] ?? null;
    $controller->processRequest($method_override ?? $method, $id, $limit, $offset);
    break;

  case $uri === SOURCE_URI . "/products/os":
    $gateway = new ProductOSGateway($db_conn);
    $controller = new ProductOSController($gateway, $auths);
    $controller->processRequest($method, $id, $limit, $offset);
    break;

  case $uri === SOURCE_URI . "/products/brands":
    $gateway = new ProductBrandGateway($db_conn);
    $controller = new ProductBrandController($gateway, $auths);
    $controller->processRequest($method, $id, $limit, $offset);
    break;

  case $uri === SOURCE_URI . "/products/categories":
    $gateway = new ProductCategoryGateway($db_conn);
    $controller = new ProductCategoryController($gateway, $auths);
    $controller->processRequest($method, $id, $limit, $offset);
    break;

  case strpos($uri, SOURCE_URI . "/products/instances") === 0:
    $utils = new Utils;
    $sku = (isset($uri_parts) && $utils->isValidProductSKU(end($uri_parts))) ? end($uri_parts) : null;
    $gateway = new ProductInstanceGateway($db_conn);
    $controller = new ProductInstanceController($gateway, $auths);
    $controller->processRequest($method, $sku, $limit, $offset);
    break;

  case $uri === SOURCE_URI . "/products/variations":
    $gateway = new ProductVariationGateway($db_conn);
    $controller = new ProductVariationController($gateway, $auths);
    $method_override = $_SERVER["HTTP_X_HTTP_METHOD_OVERRIDE"] ?? $_POST["_method"] ?? null;
    $controller->processRequest($method_override ?? $method, $id, $limit, $offset);
    break;

  default:
    $error_handler->sendErrorResponse(404, "Request not found");
}
