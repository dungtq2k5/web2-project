import { getSigninUser, signout } from "../models/auth.js";


const user = getSigninUser();
$("#signin-as").text(user ? user.full_name : "N/A");

const signoutBtn = $("#signout-btn");

signoutBtn.click(async () => {
  signoutBtn.prop("disabled", true);
  signoutBtn.html(`<i class="uil uil-signout"></i>  Signing out...`);

  const res = await signout();

  if(res.success) {
    console.log("signout success");
    window.location.href = "index.php?page=signin"; // Redirect to signin page
    return;
  }

  signoutBtn.prop("disabled", false);
  signoutBtn.html(`<i class="uil uil-signout"></i> Sign out`);
  alert(res.message);
});