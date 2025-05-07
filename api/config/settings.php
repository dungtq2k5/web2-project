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
