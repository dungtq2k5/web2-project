// URL API
export const SOURCE_API_URL = "http://127.0.0.1/web2-project/api";

const AUTH_API_URL = SOURCE_API_URL + "/auths";
export const SIGNIN_API_URL = AUTH_API_URL + "/signin";
export const SIGNOUT_API_URL = AUTH_API_URL + "/signout";
export const SIGNUP_API_URL = AUTH_API_URL + "/signup";

export const USERS_API_URL = SOURCE_API_URL + "/users";

export const ROLES_API_URL = SOURCE_API_URL + "/users/roles";

export const CARTS_API_URL = SOURCE_API_URL + "/carts";

export const PRODUCTS_API_URL = SOURCE_API_URL  + "/products";
export const PRODUCTS_VARIATIONS_API_URL = PRODUCTS_API_URL + "/variations";
export const PRODUCTS_BRANDS_API_URL = PRODUCTS_API_URL + "/brands";
export const PRODUCTS_OS_API_URL = PRODUCTS_API_URL + "/os";
export const PRODUCTS_CATEGORIES_API_URL = PRODUCTS_API_URL + "/categories";
export const PRODUCTS_INSTANCES_API_URL = PRODUCTS_API_URL + "/instances";

export const ORDERS_API_URL = SOURCE_API_URL + "/orders";
export const ORDERS_DELIVERY_STATES_API_URL  = ORDERS_API_URL + "/delivery_states";

export const RECEIPT_NOTES_API_URL = SOURCE_API_URL + "/goods_receipt_notes";

// Path (relative to index.html)
export const IMG_PATH = "../uploads";
export const PRODUCT_IMG_PATH = `${IMG_PATH}/products`;
export const VARIATION_IMG_PATH = `${IMG_PATH}/variations`;
export const DEFAULT_IMG_PATH = `${IMG_PATH}/default.webp`;

// Restrict
export const restricts = {
  img: {
    allowedTypes: ["image/webp"],
    maxFileSize: 5_242_880, // 5 * 1024 * 1024
    maxWidth: 2400,
    maxHeight: 2400
  }
}

// Others
export const DISPLAY_MSG_TIMEOUT = 5_000; // 5 seconds

// Adjust these values according to your db
export const ORDER_PLACED_ID = 1;
export const ORDER_SHIPPED_ID = 4;
export const ORDER_DELIVERED_ID = 6;
export const ORDER_RECEIVED_ID = 7;
export const ORDER_RETURNED_ID = 8;
export const ORDER_CANCELLED_ID = 9;

export const ORDER_COMPLETED_STATES = [
  ORDER_RECEIVED_ID,
  ORDER_RETURNED_ID,
  ORDER_CANCELLED_ID
];