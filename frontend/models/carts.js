import { updateData, deleteData, sendData, fetchData } from "../utils.js";
import { CARTS_API_URL } from "../settings.js";
import { getVariation } from "./product/variations.js";
import { getProduct } from "./product/products.js";

let isFetch = false;
// List of {user_id, product_variation_id, quantity}
// Sure that if user is buyer only, the API will return the carts of this user not all users
let cartsList = [];

async function fetchCarts(limit = null, offset = null) {
  const res = await fetchData(CARTS_API_URL, limit, offset);
  cartsList = res.data;
  isFetch = true;
}

export async function getCartsList(limit = null, offset = null) {
  // Return a copy
  if (!isFetch) {
    // First call not fetch -> fetch
    await fetchCarts();
    console.log("fetch carts API");
  }

  const start = offset || 0;
  const end = limit ? limit + start : cartsList.length;
  return JSON.parse(JSON.stringify(cartsList.slice(start, end)));
}

export async function createCart(cart) {
  const res = await sendData(CARTS_API_URL, cart);

  if (res.success) {
    if (!isFetch) {
      await fetchCarts();
    } else {
      cartsList.push(res.data);
    }
  }

  return res;
}

export async function updateCart(cart) {
  const existCart = await getCart(cart.user_id, cart.product_variation_id);
  if (existCart && existCart.quantity == cart.quantity) {
    return {
      success: true,
      message: "No changes made to the cart.",
    };
  }

  const res = await updateData(
    `${CARTS_API_URL}?user_id=${cart.user_id}&product_variation_id=${cart.product_variation_id}`,
    null,
    cart
  );

  if (res.success) {
    if (!isFetch) {
      await fetchCarts();
    } else {
      const idx = cartsList.findIndex(
        (c) =>
          c.user_id == cart.user_id &&
          c.product_variation_id == cart.product_variation_id
      );
      if (idx !== -1) {
        cartsList[idx] = { ...cartsList[idx], ...cart };
      } else {
        console.warn(
          `Couldn't find cart with user_id: ${cart.user_id} and product_variation_id: ${cart.product_variation_id}`
        );
      }
    }
  }

  return res;
}

export async function deleteCart(userId, productVariationId = null) {
  // If productVariationId is null, delete all carts of this user
  const url = productVariationId
    ? `${CARTS_API_URL}?user_id=${userId}&product_variation_id=${productVariationId}`
    : `${CARTS_API_URL}?user_id=${userId}`;

  const res = await deleteData(url, null);

  if (res.success) {
    if (!isFetch) {
      await fetchCarts();
    } else if (!productVariationId) {
      cartsList = cartsList.filter((c) => c.user_id != userId);
    } else {
      const idx = cartsList.findIndex(
        (c) =>
          c.user_id == userId && c.product_variation_id == productVariationId
      );
      if (idx !== -1) {
        cartsList.splice(idx, 1);
      } else {
        console.warn(
          `Couldn't find cart with user_id: ${userId} and product_variation_id: ${productVariationId}`
        );
      }
    }
  }

  return res;
}

export async function getCart(userId, productVariationId) {
  if (!userId || !productVariationId) return null;

  const cartsList = await getCartsList();
  return cartsList.find(
    (c) => c.user_id == userId && c.product_variation_id == productVariationId
  );
}

export async function getAvailableCartsList() {
  const cartsList = await getCartsList();

  const availableCarts = [];

  for (const cart of cartsList) {
    const variation = await getVariation(cart.product_variation_id);
    if (variation?.stop_selling != 0 || Number(variation.stock_quantity) <= 0) {
      continue;
    }

    const product = await getProduct(variation.product_id);
    if (product?.stop_selling != 0) {
      continue;
    }

    availableCarts.push(cart);
  }

  return availableCarts;
}
