<?php

define("PRODUCT_GATEWAY_SOURCE_PATH", __DIR__ . "/gateways/product");
define("PRODUCT_CONTROLLER_SOURCE_PATH", __DIR__ . "/controllers/product");

return [
  "Database" => __DIR__ . "/config/Database.php",

  "ProductGateway" => PRODUCT_GATEWAY_SOURCE_PATH . "/ProductGateway.php",
  "ProductVariationGateway" => PRODUCT_GATEWAY_SOURCE_PATH . "/ProductVariationGateway.php",
  "ProductBrandGateway" => PRODUCT_GATEWAY_SOURCE_PATH . "/ProductBrandGateway.php",
  "ProductCategoryGateway" => PRODUCT_GATEWAY_SOURCE_PATH . "/ProductCategoryGateway.php",
  "ProductOSGateway" => PRODUCT_GATEWAY_SOURCE_PATH . "/ProductOSGateway.php",
  "ProductInstanceGateway" => PRODUCT_GATEWAY_SOURCE_PATH . "/ProductInstanceGateway.php",

  "ProductController" => PRODUCT_CONTROLLER_SOURCE_PATH . "/ProductController.php",
  "ProductVariationController" => PRODUCT_CONTROLLER_SOURCE_PATH . "/ProductVariationController.php",
  "ProductBrandController" => PRODUCT_CONTROLLER_SOURCE_PATH . "/ProductBrandController.php",
  "ProductCategoryController" => PRODUCT_CONTROLLER_SOURCE_PATH . "/ProductCategoryController.php",
  "ProductOSController" => PRODUCT_CONTROLLER_SOURCE_PATH . "/ProductOSController.php",
  "ProductInstanceController" => PRODUCT_CONTROLLER_SOURCE_PATH . "/ProductInstanceController.php",
  "OrdersGateway" => __DIR__ . "/gateways/order/OrdersGateway.php",
  "OrdersController" => __DIR__ . "/controllers/order/OrdersController.php",
  "OrderDeliveryStateGateway" => __DIR__ . "/gateways/order/OrderDeliveryStateGateway.php",
  "OrderDeliveryStateController" => __DIR__ . "/controllers/order/OrderDeliveryStateController.php",
  "OrderItemsGateway" => __DIR__ . "/gateways/order/OrderItemsGateway.php",
  "OrderItemsController" => __DIR__ . "/controllers/order/OrderItemsController.php",
  
  "ErrorHandler" => __DIR__ . "/ErrorHandler.php",
  "Auths" => __DIR__ . "/Auths.php",
  "Utils" => __DIR__ . "/Utils.php"
  // ... other classes
];