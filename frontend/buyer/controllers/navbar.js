import { getSigninUser, signout } from "../../models/auth.js";
import { getCartsList } from "../../models/carts.js";


async function renderHeader() {
  const user = getSigninUser();
  const header = $("#header");
  const loginAs = header.find("#email");
  const signinBtn = header.find("#signin");
  const signupBtn = header.find("#signup");
  const signoutBtn = header.find("#signout");
  const cartBtn = header.find("#cart");

  loginAs.html(user ? user.email : "Guest");

  if(!user) {
    signoutBtn.remove();
    cartBtn.remove();
  } else {
    signinBtn.remove();
    signupBtn.remove();

    signoutBtn.click(async () => {
      signoutBtn.prop("disabled", true);
      signoutBtn.html("Signing out...");

      const res = await signout();

      if(res.success) {
        window.location.href = "./index.php?page=signin";
        return;
      }

      signoutBtn.prop("disabled", false);
      signoutBtn.html("Sign out");
      alert(res.message);
      console.error(res.message);
    });

    const cartQuantity = (await getCartsList()).length;
    cartBtn.find("#cart-quantity").html(cartQuantity);
  }
}

renderHeader();