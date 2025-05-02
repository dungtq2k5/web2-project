import { USERS_API_URL } from "../settings.js";
import { updateCart, deleteCart } from "./carts.js"
import {
  deleteData,
  fetchData,
  sendData,
  updateData,
  removeOddSpace
} from "../utils.js";
import { getVariation } from "./product/variations.js";
import { getProduct } from "./product/products.js";


let isFetch = false; //make sure when render data
let usersList = [];

async function fetchUsers(limit=null, offset=null) {
  const res = await fetchData(USERS_API_URL, limit, offset);
  usersList = res.data;
  isFetch = true;
}

export async function getUsersList(limit=null, offset=null) { // Return a copy
  if(!isFetch) { // first call not fetch -> fetch
    await fetchUsers();
    console.log("fetch users API");
  }

  const start = offset || 0;
  const end = limit ? limit + start : usersList.length;
  return JSON.parse(JSON.stringify(usersList.slice(start, end)));
}

export async function getUser(id) {
  if(!id) return undefined;

  const usersList = await getUsersList();
  return usersList.find(user => user.id == id) || undefined;
}

/**
 * filter users base on almost all fields
 * @param {boolean} widerSearch filter more than basic info of user
 */
export async function getFilterUsersList(valSearch, widerSearch=false, limit=null, offset=null) {
  const usersList = await getUsersList();
  const formattedValSearch = removeOddSpace(valSearch.toLowerCase());

  const filteredUsersList = [];
  for(const user of usersList) {
    let isInclude =
      String(user.id).includes(formattedValSearch) ||
      user.full_name.toLowerCase().includes(formattedValSearch) ||
      user.email.toLowerCase().includes(formattedValSearch) ||
      user.phone_number.toLowerCase().includes(formattedValSearch) ||
      includeRoles(formattedValSearch, user.roles);

    if(widerSearch && !isInclude) {
      isInclude = await includeCart(formattedValSearch, user.cart);
    }

    if(isInclude) filteredUsersList.push(user);
  }

  const start = offset || 0;
  const end = limit ? start + limit : filteredUsersList.length;
  return filteredUsersList.slice(start, end);
}

function includeRoles(valSearch, userRoles) { //support for getFilterUsersList
  return userRoles.some(role => role.name.toLowerCase().includes(valSearch));
}

async function includeCart(valSearch, userCart) { //support for getFilterUsersList
  for(const item of userCart) {
    const variation = await getVariation(item.product_variation_id);
    const product = await getProduct(variation.product_id);

    return (
      String(item.quantity).includes(valSearch) ||
      String(variation.price_cents).includes(valSearch) ||
      product.name.toLowerCase().includes(valSearch) ||
      product.model.toLowerCase().includes(valSearch)
    );
  }

  return false;
}

export async function createUser(user) {
  const res = await sendData(USERS_API_URL, user);

  if(res.success) {
    if(!isFetch) { //first call function && not fetch
      await fetchUsers();
    } else { //already fetch -> update list
      usersList.push(res.data);
    }
  }

  return res;
}

export async function deleteUser(id) {
  const res = await deleteData(USERS_API_URL, id);

  if(res.success) {
    if(!isFetch) {
      await fetchUsers();
    } else {
      const idx = usersList.findIndex(user => user.id == id);
      if(idx !== -1) {
        usersList.splice(idx, 1);
      } else {
        console.warn(`Couldn't find user with an id ${userId} to delete`);
      }
    }
  }

  return res;
}

export async function updateUser(id, user) {
  const res = await updateData(USERS_API_URL, id, user);

  if(res.success) {
    if(!isFetch) {
      await fetchUsers();
    } else {
      const idx = usersList.findIndex(user => user.id == id);
      if(idx !== -1) {
        usersList[idx] = {...usersList[idx], ...res.data};
      } else {
        console.warn(`Couldn't find user with an id ${id} to update`);
      }
    }
  }

  return res;
}

export async function updateUserCart(cart) {
  const res = await updateCart(cart);

  if(res.success) {
    if(!isFetch) {
      await fetchUsers();
    } else {
      const userId = cart.user_id;
      const idx = usersList.findIndex(user => user.id == userId);
      if(idx !== -1) {
        const updatedUser = await getUser(userId);
        const cartItem = updatedUser.cart.find(item => item.product_variation_id == cart.product_variation_id);
        cartItem.quantity = cart.quantity;

        usersList[idx] = updatedUser;
      } else {
        console.warn(`Couldn't find user with an id ${id} to update user cart`);
      }
    }
  }

  return res;
}

export async function deleteUserCart(userId, productVariationId) {
  const res = await deleteCart(userId, productVariationId);

  if(res.success) {
    if(!isFetch) {
      await fetchUsers();
    } else {
      const idx = usersList.findIndex(user => user.id == userId);
      if(idx !== -1) {
        const user = usersList[idx];
        user.cart = user.cart.filter(item => item.product_variation_id != productVariationId);

      } else {
        console.warn(`Couldn't find user with an id ${userId} to delete user cart`);
      }
    }
  }

  return res;
}
