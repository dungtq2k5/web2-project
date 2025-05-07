import { updateData, deleteData } from "../../utils.js";
import { CARTS_API_URL } from "../../settings.js";


export async function updateCart(cart) { //{user_id, product_variation_id, quantity}
  const res = updateData(`${CARTS_API_URL}?user_id=${cart.user_id}&product_variation_id=${cart.product_variation_id}`, null, cart);

  return res;
}

export async function deleteCart(userId, productVariationId) {
  const res = deleteData(`${CARTS_API_URL}?user_id=${userId}&product_variation_id=${productVariationId}`, null);

  return res;
}