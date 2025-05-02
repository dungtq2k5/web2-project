<?php


// Adjust these order delivery states id base on the order_delivery_states db
const ORDER_PLACED_ID = 1;
const ORDER_SHIPPED_ID = 4;
const ORDER_DELIVERED_ID = 6;
const ORDER_RECEIVED_ID = 7;
const ORDER_RETURNED_ID = 8;
const ORDER_CANCELLED_ID = 9;

const ORDER_COMPLETED_STATES = [
  ORDER_RECEIVED_ID,
  ORDER_RETURNED_ID,
  ORDER_CANCELLED_ID
];

// Adjust these roles id base on the roles db
const ADMIN_ROLE_ID = 1;
const BUYER_ROLE_ID = 2;

const CORE_ROLES_ID = [
  ADMIN_ROLE_ID,
  BUYER_ROLE_ID
];

const ADMIN_ID = 1;

// Adjust these actions base on the permissions db
const BUYER_ACTIONS_CODE = [ // A buyer can do these things but with their own so let another handle it
  "read_user",
  "update_user",
  "delete_user",

  "create_user_address",
  "read_user_address",
  "update_user_address",
  "delete_user_address",

  "create_cart",
  "read_cart",
  "update_cart",
  "delete_cart",

  "create_order",
  "read_order",
  "update_order",
  "delete_order",

  "read_order_delivery_state",

  "read_product",
  "read_product_os",
  "read_product_brand",
  "read_product_category",
  "read_product_variation",
];
