import {
  AUTH_STORAGE,
  BUYER_ROLE_ID,
  SIGNIN_API_URL,
  SIGNOUT_API_URL,
  SIGNUP_API_URL
} from "../settings.js";
import {
  getFromStorage,
  removeStorage,
  saveToStorage,
  sendData
} from "../utils.js";


export function getSigninUser() {
  return getFromStorage(AUTH_STORAGE);
}

export async function signin(email, password) {
  if(getSigninUser()) {
    return {
      success: false,
      message: "You have already been signin, no need to do it again"
    }
  }

  const res = await sendData(SIGNIN_API_URL, {email, password});

  if(res.success) saveToStorage(AUTH_STORAGE, res.data);

  return res;
}

export async function signout() {
  if(!getSigninUser()) {
    return {
      success: false,
      message: "You haven't been signin yet"
    }
  }

  const res = await sendData(SIGNOUT_API_URL);

  if(res.success) removeStorage(AUTH_STORAGE);

  return res;
}

export async function signup(user) {
  if(getSigninUser()) {
    return {
      success: false,
      message: "You have already been signin, no need to do it again. If you want to signup with another account, please signout first"
    }
  }

  const res = await sendData(SIGNUP_API_URL, user);

  if(res.success) saveToStorage(AUTH_STORAGE, res.data);

  return res;
}

export function hasPermission(actionCode) {
  if(!actionCode) return false;

  actionCode = actionCode.toLowerCase();

  const user = getSigninUser();

  for(const role of user.roles) {
    if(role.permissions.includes(actionCode)) {
      return true;
    }
  }
  return false;
}

export function isBuyer() {
  const user = getSigninUser();
  return user && user.roles.some(role => role.id == BUYER_ROLE_ID);
}

export const login = signin;
export const logout = signout;
