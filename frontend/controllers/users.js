import { USERS_API_URL, AUTH_STORAGE } from "../settings.js";
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
  setUsersList(res.data);
  isFetch = true;
}

function setUsersList(list) {
  usersList = list;
}

export async function getUsersList(limit=null, offset=null) {
  if(!isFetch) { // first call not fetch -> fetch
    await fetchUsers();
    console.log("fetch users API");
  }

  const start = offset || 0;
  const end = limit ? limit + start : usersList.length;
  return usersList.slice(start, end);
}

export async function getUser(id) {
  const usersList = await getUsersList();
  const user = usersList.find(user => user.id === id);

  return user || undefined;
}

export async function getFilterUsersList(valSearch, widerSearch=false, limit=null, offset=null) {
  /**
   * filter users base on almost all fields
   * widerSearch mean filter more than basic info of user
   */

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
  const end = limit ? start + limit : usersList.length;
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

export async function createUser(user, auth) {
  const res = await sendData(USERS_API_URL, user, auth);

  if(res.success) {
    if(!isFetch) { //first call function && not fetch
      await fetchUsers();
    } else { //already fetch -> update list
      const usersList = await getUsersList();
      usersList.push(res.data);
      setUsersList(usersList);
    }
  }

  return res;
}

export async function deleteUser(id, auth) {
  const res = await deleteData(USERS_API_URL, id, auth);

  if(res.success) {
    if(!isFetch) {
      await fetchUsers();
    } else {
      const usersList = await getUsersList();
      const newUsersList = usersList.filter(user => user.id !== id);
      setUsersList(newUsersList);
    }
  }

  return res;
}

export async function updateUser(id, user, auth) {
  const res = await updateData(USERS_API_URL, id, user, auth);

  if(res.success) {
    if(!isFetch) {
      await fetchUsers();
    } else {
      const usersList = await getUsersList();
      const newUsersList = usersList.map(user => user.id === id ? {...user, ...res.data} : user);
      setUsersList(newUsersList);
    }
  }

  return res;
}

export async function updateUserCart(cart, auth) {
  const res = await updateCart(cart, auth);

  if(res.success) {
    if(!isFetch) {
      await fetchUsers();
    } else {
      const usersList = await getUsersList();
      const product_variation_id = cart.product_variation_id;
      const newQuant = cart.quantity;
      const userId = cart.user_id;

      try {
        const updatedUser = await getUser(userId);
        const cartItem = updatedUser.cart.find(item => item.product_variation_id === product_variation_id);
        cartItem.quantity = newQuant;
        const newUsersList = usersList.map(user => user.id === userId ? updatedUser : user);
        setUsersList(newUsersList);

      } catch(error) {
        console.error("Finding error: " + error);
        throw error;
      }
    }
  }

  return res;
}

export async function deleteUserCart(userId, productVariationId, auth) {
  const res = await deleteCart(userId, productVariationId, auth);

  if(res.success) {
    if(!isFetch) {
      await fetchUsers();
    } else {
      const usersList = await getUsersList();

      try {
        const user = await getUser(userId);
        const updatedCart = user.cart.filter(item => item.product_variation_id !== productVariationId);
        const newUsersList = usersList.map(user => user.id === userId ? {...user, cart: updatedCart} : user);
        setUsersList(newUsersList);

      } catch(error) {
        console.error("Finding error: " + error);
        throw error;
      }
    }
  }

  return res;
}

export function getAuth() {
  if(!sessionStorage.getItem(AUTH_STORAGE)) return false;
  return JSON.parse(sessionStorage.getItem(AUTH_STORAGE));
}

export function setAuth(auth) {
  sessionStorage.setItem(AUTH_STORAGE, JSON.stringify(auth));
}
