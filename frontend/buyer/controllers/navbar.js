import { getSigninUser, signout } from "../../models/auth.js";
import { getCartsList } from "../../models/carts.js";

const header = $("#header");
const loginAs = header.find("#email");
const signinBtn = header.find("#signin");
const signupBtn = header.find("#signup");
const signoutBtn = header.find("#signout");
const cartBtn = header.find("#cart");
const ordersLinkLi = header.find("#orders-link-li");
const cartQuantitySpan = cartBtn.find("#cart-quantity");

export async function updateCartQuantityDisplay() {
  const user = getSigninUser();
  if (user) {
    try {
      const carts = await getCartsList();
      cartQuantitySpan.text(carts.length);
    } catch (error) {
      console.error("Error fetching cart list for quantity update:", error);
      cartQuantitySpan.text("!"); // Indicate error
    }
  } else {
    cartQuantitySpan.text("0");
  }
}

async function renderHeader() {
  const user = getSigninUser();
  loginAs.html(user ? user.email : "Guest");

  if(!user) {
    signoutBtn.hide(); // Use hide() instead of remove() to keep the element in DOM for potential re-show
    cartBtn.hide();
    ordersLinkLi.hide();
    signinBtn.show();
    signupBtn.show();
  } else {
    signinBtn.hide();
    signupBtn.hide();
    signoutBtn.show();
    cartBtn.show();
    ordersLinkLi.show();

    signoutBtn.off('click').on('click', async () => { // Use .off().on() to prevent multiple bindings
      signoutBtn.prop("disabled", true);
      signoutBtn.html(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Signing out...`);

      const res = await signout();

      if(res.success) {
        window.location.href = "./index.php?page=signin";
        return;
      }

      signoutBtn.prop("disabled", false);
      signoutBtn.html(`<i class="uil uil-signout"></i> Sign Out`);
      alert(res.message);
      console.error(res.message);
    });

    await updateCartQuantityDisplay();
  }
}

renderHeader();