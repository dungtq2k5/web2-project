import {
  deleteCart,
  getAvailableCartsList,
  getCartsList,
  updateCart
  } from "../../models/carts.js";
import { getProduct } from "../../models/product/products.js";
import { getVariation } from "../../models/product/variations.js";
import { DEFAULT_IMG_PATH, VARIATION_IMG_PATH } from "../../settings.js";
import { centsToDollars } from "../../utils.js";
import { getSigninUser } from "../../models/auth.js";


const user = getSigninUser();

const itemsContainer = $("#items-container");

async function renderCart() {
  itemsContainer.html("<p>Loading cart items...</p>");

  const carts = await getCartsList();

  let dataHTML = "";
  let totalCents = 0;

  for(const [idx, cart] of carts.entries()) {
    const variation = await getVariation(cart.product_variation_id);
    if(!variation) {
      console.warn(`Couldn't find variation with ID: ${cart.product_variation_id}`);
      continue;
    }

    let isAvailable = variation.stock_quantity > 0 && !variation.stop_selling;

    const variationImg = variation.image_name
      ? `${VARIATION_IMG_PATH}/${variation.image_name}`
      : DEFAULT_IMG_PATH;

    const product = await getProduct(variation.product_id);
    if(!product) {
      console.warn(`Couldn't find product with ID: ${variation.product_id}`);
      continue;
    }

    isAvailable = product.stop_selling ? false : isAvailable;

    if(isAvailable) {
      totalCents += variation.price_cents * cart.quantity;
    }

    let quantityHTML = "";
    for(let i=0; i<variation.stock_quantity; i++) {
      quantityHTML += `
        <option value="${i+1}" ${i+1 == cart.quantity ? "selected" : ""}>${i+1}</option>
      `;
    }

    dataHTML += `
      <li data-variation-id="${variation.id}">
        <button class="js-remove-item-btn" title="Remove this item">
          <i class="uil uil-multiply"></i>
        </button>

        <div style="${isAvailable ? "" : "opacity: .5; pointer-events: none;"}">
          <img src="${variationImg}" alt="Smartwatch product">

          <div>
            <h3>${product.name} - ${variation.watch_size_mm}MM</h3>
            <p>${product.model}</p>
            <p>&#36;${centsToDollars(parseInt(variation.price_cents))} USD</p>

            <div>
              <p>Quantity</p>
              <select id="select-quantity-${idx}" class="js-item-quantity">${quantityHTML}</select>
            </div>

            <p>Available to received in 1-3 business days</p>
          </div>
        </div>
      </li>
    `;
  }

  itemsContainer.html(dataHTML || "<p>No items in cart</p>");

  itemsContainer.find(".js-remove-item-btn").click(async e => {
    const removeBtn = $(e.currentTarget);
    removeBtn.prop("disabled", true);
    removeBtn.html('<i class="uil uil-spinner uil-spin"></i>');

    const variationId = $(e.currentTarget).closest("li").data("variation-id");
    console.log(`Removing item with variation ID: ${variationId}`);
    const res = await deleteCart(user.id, variationId);

    if(res.success) {
      renderCart();
      renderCheckoutForm();
      return;
    }

    alert(res.message + ", please refresh the page and try again");
    removeBtn.prop("disabled", false);
    removeBtn.html('<i class="uil uil-multiply"></i>');
  });

  itemsContainer.find(".js-item-quantity").change(async e => {
    const select = $(e.currentTarget);
    select.prop("disabled", true);

    const newQuantity = parseInt(select.val());
    const variationId = select.closest("li").data("variation-id");

    console.log(`Updating item with variation ID: ${variationId} to quantity: ${newQuantity}`);
    const res = await updateCart({
      user_id: user.id,
      product_variation_id: variationId,
      quantity: newQuantity
    });

    if(res.success) {
      renderCart();
      renderCheckoutForm();
      return;
    }

    alert(res.message + ", please refresh the page and try again");
    select.prop("disabled", false);
  });
}

async function renderCheckoutForm() {
  const checkoutForm = $("#checkout-form");
  checkoutForm.html("<p>Loading checkout form...</p>");

  try {
    const carts = await getAvailableCartsList();

    if(carts.length === 0) {
      checkoutForm.remove();
      return;
    }

    let totalCents = 0;

    for(const cart of carts) {
      const variation = await getVariation(cart.product_variation_id);
      totalCents += variation.price_cents * cart.quantity;
    }

    const total = centsToDollars(totalCents);

    checkoutForm.html(`
      <div>
        <p>Subtotal: &#36;${total} USD</p>

        <p>Estimated total: &#36;${total} USD</p>

        <p>Shipping and tax calculated in checkout</p>

        <a href="./index.php?page=checkout">Checkout</a>
      </div>
    `);

  } catch(error) {
    console.error(error);
    checkoutForm.html("<p>Couldn't load checkout form</p>");
  }
}

async function init() {
  await renderCart();
  renderCheckoutForm();
}

init();
