<?php

switch(true) {
  case str_contains($uri, SOURCE_URI . "/products/os"):
    $gateway = new ProductOSGateway($db);
    $controller = new ProductOSController($gateway, $auths);
    $controller->processRequest($method, $id, $limit, $offset);
    break;
  
  case str_contains($uri, SOURCE_URI . "/products/brands"):
    $gateway = new ProductBrandGateway($db);
    $controller = new ProductBrandController($gateway, $auths);
    $controller->processRequest($method, $id, $limit, $offset);
    break;

  case str_contains($uri, SOURCE_URI . "/products/categories"):
    $gateway = new ProductCategoryGateway($db);
    $controller = new ProductCategoryController($gateway, $auths);
    $controller->processRequest($method, $id, $limit, $offset);
    break;

  case str_contains($uri, SOURCE_URI . "/products/instances"):
    $sku = end($uri_parts);
    $gateway = new ProductInstanceGateway($db);
    $controller = new ProductInstanceController($gateway, $auths);
    $controller->processRequest($method, $sku, $limit, $offset);
    break;

  case str_contains($uri, SOURCE_URI . "/products/variations"):
    $gateway = new ProductVariationGateway($db);
    $controller = new ProductVariationController($gateway, $auths);
    $controller->processRequest($method, $id, $limit, $offset);
    break;

  case str_contains($uri, SOURCE_URI . "/products"):
    $gateway = new ProductGateway($db);
    $controller = new ProductController($gateway, $auths);
    $controller->processRequest($method, $id, $limit, $offset);
    break;

  default:
    http_response_code(404);
    echo json_encode([
      "success" => false,
      "message" => "Request not found!"
    ]);
}
