import { SIGNIN_API_URL, SIGNOUT_API_URL, SIGNUP_API_URL } from "../settings.js";
import { sendData } from "../utils.js";


let isSignin = false;
let user;

export function getSigninUser() {
  return user;
}

export async function signin(email, password) {
  if(isSignin) {
    return {
      success: false,
      message: "You have already been signin, no need to do it again"
    }
  }

  const res = await sendData(SIGNIN_API_URL, {email, password});

  if(res.success) {
    user = res.data;
    isSignin = true;
  }

  return res;
}

export async function signout() {
  if(!isSignin) {
    return {
      success: false,
      message: "You haven't been signin yet"
    }
  }

  const res = await sendData(SIGNOUT_API_URL);

  if(res.success) {
    user = undefined;
    isSignin = false;
  }

  return res;
}

export const login = signin;
export const logout = signout;
