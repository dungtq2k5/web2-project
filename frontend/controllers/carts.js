import { CARTS_API_URL } from "../settings.js";


export async function updateCart(cart, auth) { //{user_id, product_variation_id, quantity}
  try {
    const credentials = btoa(`${auth.email}:${auth.password}`); //Encode credentials
    const res = await fetch(`${CARTS_API_URL}?user_id=${cart.user_id}&product_variation_id=${cart.product_variation_id}`, {
      method: "PUT",
      headers: {
        Authorization: `Basic ${credentials}`,
      },
      body: JSON.stringify(cart),
    });

    return await res.json();

  } catch(error) {
    console.error("Fetch error: " + error);
    throw error;
  }
}

export async function deleteCart(userId, productVariationId, auth) {
  try {
    const credentials = btoa(`${auth.email}:${auth.password}`); //Encode credentials
    const res = await fetch(`${CARTS_API_URL}?user_id=${userId}&product_variation_id=${productVariationId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    });

    return await res.json();

  } catch(error) {
    console.error("Fetch error: " + error);
    throw error;
  }
}