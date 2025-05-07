import { getSigninUser, signout } from "../models/auth.js";


$("#signin-as").text(getSigninUser().full_name);

const signoutBtn = $("#signout-btn");

signoutBtn.click(async () => {
  signoutBtn.prop("disabled", true);
  signoutBtn.html(`<i class="uil uil-signout"></i>  Signing out...`);

  const res = await signout();

  if(res.success) {
    // TODO go to signin page
    console.log("signout success");
  }

  signoutBtn.prop("disabled", false);
  signoutBtn.html(`<i class="uil uil-signout"></i> Sign out`);
  alert(res.message);
});