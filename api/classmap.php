<?php

define("PRODUCT_GATEWAY_SOURCE_PATH", __DIR__ . "/gateways/product");
define("PRODUCT_CONTROLLER_SOURCE_PATH", __DIR__ . "/controllers/product");
define("USER_GATEWAY_SOURCE_PATH", __DIR__ . "/gateways/user");
define("USER_CONTROLLER_SOURCE_PATH", __DIR__ . "/controllers/user");

return [
  "Database" => __DIR__ . "/config/Database.php",

  "ProductGateway" => PRODUCT_GATEWAY_SOURCE_PATH . "/ProductGateway.php",
  "ProductVariationGateway" => PRODUCT_GATEWAY_SOURCE_PATH . "/ProductVariationGateway.php",
  "ProductBrandGateway" => PRODUCT_GATEWAY_SOURCE_PATH . "/ProductBrandGateway.php",
  "ProductCategoryGateway" => PRODUCT_GATEWAY_SOURCE_PATH . "/ProductCategoryGateway.php",
  "ProductOSGateway" => PRODUCT_GATEWAY_SOURCE_PATH . "/ProductOSGateway.php",
  "ProductInstanceGateway" => PRODUCT_GATEWAY_SOURCE_PATH . "/ProductInstanceGateway.php",

  "UserGateway" => USER_GATEWAY_SOURCE_PATH . "/UserGateway.php",
  "UserRoleGateway" => USER_GATEWAY_SOURCE_PATH . "/UserRoleGateway.php",
  "RoleGateway" => USER_GATEWAY_SOURCE_PATH . "/RoleGateway.php",
  "RolePermissionGateway" => USER_GATEWAY_SOURCE_PATH . "/RolePermissionGateway.php",
  "PermissionGateway" => USER_GATEWAY_SOURCE_PATH . "/PermissionGateway.php",

  "ProductController" => PRODUCT_CONTROLLER_SOURCE_PATH . "/ProductController.php",
  "ProductVariationController" => PRODUCT_CONTROLLER_SOURCE_PATH . "/ProductVariationController.php",
  "ProductBrandController" => PRODUCT_CONTROLLER_SOURCE_PATH . "/ProductBrandController.php",
  "ProductCategoryController" => PRODUCT_CONTROLLER_SOURCE_PATH . "/ProductCategoryController.php",
  "ProductOSController" => PRODUCT_CONTROLLER_SOURCE_PATH . "/ProductOSController.php",
  "ProductInstanceController" => PRODUCT_CONTROLLER_SOURCE_PATH . "/ProductInstanceController.php",

  "UserController" => USER_CONTROLLER_SOURCE_PATH . "/UserController.php",
  "UserRoleController" => USER_CONTROLLER_SOURCE_PATH . "/UserRoleController.php",
  "RoleController" => USER_CONTROLLER_SOURCE_PATH . "/RoleController.php",
  "RolePermissionController" => USER_CONTROLLER_SOURCE_PATH . "/RolePermissionController.php",
  "PermissionController" => USER_CONTROLLER_SOURCE_PATH . "/PermissionController.php",

  
  "ErrorHandler" => __DIR__ . "/ErrorHandler.php",
  "Auths" => __DIR__ . "/Auths.php",
  "Utils" => __DIR__ . "/Utils.php"
  // ... other classes
];

