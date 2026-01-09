<?php

const GATEWAYS_PATH =  __DIR__ . "/gateways";
const CONTROLLERS_PATH =  __DIR__ . "/controllers";

const PRODUCT_GATEWAY_PATH =  GATEWAYS_PATH . "/product";
const PRODUCT_CONTROLLER_PATH =  CONTROLLERS_PATH . "/product";

const USER_GATEWAY_PATH =  GATEWAYS_PATH . "/user";
const USER_CONTROLLER_PATH =  CONTROLLERS_PATH . "/user";

const CART_GATEWAY_PATH =  GATEWAYS_PATH . "/cart";
const CART_CONTROLLER_PATH =  CONTROLLERS_PATH . "/cart";

const ORDER_GATEWAY_PATH =  GATEWAYS_PATH . "/order";
const ORDER_CONTROLLER_PATH =  CONTROLLERS_PATH . "/order";

const PROVIDER_GATEWAY_PATH =  GATEWAYS_PATH . "/provider";
const PROVIDER_CONTROLLER_PATH =  CONTROLLERS_PATH . "/provider";

const GOODS_GATEWAY_PATH =  GATEWAYS_PATH . "/goods";
const GOODS_CONTROLLER_PATH =  CONTROLLERS_PATH . "/goods";

const AUTHS_CONTROLLER_PATH =  CONTROLLERS_PATH . "/auth";

return [
  "Database" => __DIR__ . "/config/Database.php",

  //gateways
  "ProductGateway" => PRODUCT_GATEWAY_PATH . "/ProductGateway.php",
  "ProductVariationGateway" => PRODUCT_GATEWAY_PATH . "/ProductVariationGateway.php",
  "ProductBrandGateway" => PRODUCT_GATEWAY_PATH . "/ProductBrandGateway.php",
  "ProductCategoryGateway" => PRODUCT_GATEWAY_PATH . "/ProductCategoryGateway.php",
  "ProductOSGateway" => PRODUCT_GATEWAY_PATH . "/ProductOSGateway.php",
  "ProductInstanceGateway" => PRODUCT_GATEWAY_PATH . "/ProductInstanceGateway.php",

  "UserGateway" => USER_GATEWAY_PATH . "/UserGateway.php",
  "UserRoleGateway" => USER_GATEWAY_PATH . "/UserRoleGateway.php",
  "RoleGateway" => USER_GATEWAY_PATH . "/RoleGateway.php",
  "RolePermissionGateway" => USER_GATEWAY_PATH . "/RolePermissionGateway.php",
  "PermissionGateway" => USER_GATEWAY_PATH . "/PermissionGateway.php",
  "UserAddressGateway" => USER_GATEWAY_PATH  . "/UserAddressGateway.php",

  "CartGateway" => CART_GATEWAY_PATH . "/CartGateway.php",
  "OrderGateway" => ORDER_GATEWAY_PATH . "/OrderGateway.php",
  "OrderItemGateway" => ORDER_GATEWAY_PATH . "/OrderItemGateway.php",
  "OrderDeliveryStateGateway" => ORDER_GATEWAY_PATH . "/OrderDeliveryStateGateway.php",

  "ProviderGateway" => PROVIDER_GATEWAY_PATH . "/ProviderGateway.php",
  "GoodsReceiptNoteGateway" => GOODS_GATEWAY_PATH . "/GoodsReceiptNoteGateway.php",

  //controllers
  "ProductController" => PRODUCT_CONTROLLER_PATH . "/ProductController.php",
  "ProductVariationController" => PRODUCT_CONTROLLER_PATH . "/ProductVariationController.php",
  "ProductBrandController" => PRODUCT_CONTROLLER_PATH . "/ProductBrandController.php",
  "ProductCategoryController" => PRODUCT_CONTROLLER_PATH . "/ProductCategoryController.php",
  "ProductOSController" => PRODUCT_CONTROLLER_PATH . "/ProductOSController.php",
  "ProductInstanceController" => PRODUCT_CONTROLLER_PATH . "/ProductInstanceController.php",

  "UserController" => USER_CONTROLLER_PATH . "/UserController.php",
  "RoleController" => USER_CONTROLLER_PATH . "/RoleController.php",
  "PermissionController" => USER_CONTROLLER_PATH . "/PermissionController.php",
  "UserAddressController" => USER_CONTROLLER_PATH . "/UserAddressController.php",

  "CartController" => CART_CONTROLLER_PATH . "/CartController.php",
  "OrderController" => ORDER_CONTROLLER_PATH . "/OrderController.php",
  "OrderDeliveryStateController" => ORDER_CONTROLLER_PATH . "/OrderDeliveryStateController.php",

  "ProviderController" => PROVIDER_CONTROLLER_PATH . "/ProviderController.php",
  "GoodsReceiptNoteController" => GOODS_CONTROLLER_PATH . "/GoodsReceiptNoteController.php",

  "AuthController" => AUTHS_CONTROLLER_PATH . "/AuthController.php",

  //orders
  "ErrorHandler" => __DIR__ . "/ErrorHandler.php",
  "Auths" => __DIR__ . "/Auths.php",
  "Utils" => __DIR__ . "/Utils.php"
];
