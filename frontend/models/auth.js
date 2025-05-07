import {
  AUTH_STORAGE,
  SIGNIN_API_URL,
  SIGNOUT_API_URL
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

export const login = signin;
export const logout = signout;
