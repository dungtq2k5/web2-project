import {
  deleteCart,
  getAvailableCartsList,
  getCartsList,
  updateCart,
} from "../../models/carts.js";
import { getProduct } from "../../models/product/products.js";
import { getVariation } from "../../models/product/variations.js";
import { DEFAULT_IMG_PATH, VARIATION_IMG_PATH } from "../../settings.js";
import { centsToDollars } from "../../utils.js";
import { getSigninUser } from "../../models/auth.js";
import { updateCartQuantityDisplay } from "./navbar.js";

const user = getSigninUser();

const itemsContainer = $("#items-container");

async function renderCart() {
  itemsContainer.html(
    `<div class="list-group-item text-center p-5"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div><p>Loading cart items...</p></div>`
  );

  const carts = await getCartsList();

  if (carts.length === 0) {
    itemsContainer.html(
      `<div class="list-group-item text-center p-5"><p class="mb-0">Your cart is empty.</p><a href="./index.php?page=home" class="btn btn-sm btn-link">Start shopping!</a></div>`
    );
    renderCheckoutForm(); // Ensure checkout form also updates
    return;
  }

  let dataHTML = "";

  for (const [idx, cart] of carts.entries()) {
    const variation = await getVariation(cart.product_variation_id);
    if (!variation) {
      console.warn(
        `Couldn't find variation with ID: ${cart.product_variation_id}`
      );
      continue;
    }

    const variationImg = variation.image_name
      ? `${VARIATION_IMG_PATH}/${variation.image_name}`
      : DEFAULT_IMG_PATH;

    const product = await getProduct(variation.product_id);
    if (!product) {
      console.warn(`Couldn't find product with ID: ${variation.product_id}`);
      continue;
    }

    const isAvailable =
      variation.stock_quantity > 0 &&
      variation.stop_selling == 0 &&
      product.stop_selling == 0;

    let quantityOptionsHTML = "";
    const maxStock = Math.min(variation.stock_quantity, 10); // Limit dropdown to 10 or stock, whichever is smaller
    for (let i = 1; i <= maxStock; i++) {
      quantityOptionsHTML += `
        <option value="${i}" ${
        i == cart.quantity ? "selected" : ""
      }>${i}</option>
      `;
    }
    if (cart.quantity > maxStock && variation.stock_quantity > maxStock) {
      // If current quantity is > 10 but stock allows
      quantityOptionsHTML += `<option value="${cart.quantity}" selected>${cart.quantity}</option>`;
    } else if (cart.quantity > variation.stock_quantity) {
      // If current quantity is more than available stock
      quantityOptionsHTML += `<option value="${variation.stock_quantity}" selected>${variation.stock_quantity} (Max)</option>`;
    }

    dataHTML += `
      <div class="list-group-item ${
        isAvailable ? "" : "bg-light opacity-75"
      }" data-variation-id="${variation.id}">
        <div class="row align-items-center g-2">
          <div class="col-auto">
            <button class="btn btn-sm btn-outline-danger js-remove-item-btn border-0" title="Remove this item">
              <i class='uil uil-trash'></i>
            </button>
          </div>
          <div class="col-2 col-md-1 text-center">
            <img src="${variationImg}" style="max-width: 50px; max-height: 50px; object-fit: contain;" class="img-fluid rounded" alt="${
      product.name
    }">
          </div>
          <div class="col">
            <h6 class="mb-1 small fw-medium">${product.name} - ${
      variation.watch_size_mm
    }MM</h6>
            <p class="mb-1 text-muted" style="font-size: 0.8rem;">${
              product.model
            }</p>
            <p class="mb-0 fw-bold text-primary small">&#36;${centsToDollars(
              parseInt(variation.price_cents)
            )} USD</p>
          </div>
          <div class="col-4 col-md-2">
            <label for="select-quantity-${idx}" class="form-label visually-hidden">Quantity</label>
            <select id="select-quantity-${idx}" class="form-select form-select-sm js-item-quantity" ${
      isAvailable ? "" : "disabled"
    }>${quantityOptionsHTML}</select>
          </div>
        </div>
        ${
          isAvailable
            ? `<small class="d-block mt-1 text-success" style="font-size: 0.75rem;"><i class="uil uil-check-circle"></i> Available to receive in 1-3 business days</small>`
            : `<small class="d-block mt-1 text-danger" style="font-size: 0.75rem;"><i class="uil uil-exclamation-triangle"></i> Currently unavailable</small>`
        }
      </div>
    `;
  }

  itemsContainer.html(dataHTML || "<p>No items in cart</p>");

  itemsContainer.find(".js-remove-item-btn").click(async (e) => {
    const removeBtn = $(e.currentTarget);
    removeBtn.prop("disabled", true);
    removeBtn.html('<i class="uil uil-spinner uil-spin"></i>');

    const variationId = $(e.currentTarget)
      .closest(".list-group-item")
      .data("variation-id");
    console.log(`Removing item with variation ID: ${variationId}`);
    const res = await deleteCart(user.id, variationId);

    if (res.success) {
      await renderCart(); // await to ensure cart is rendered before checkout form
      await renderCheckoutForm();
      await updateCartQuantityDisplay(); // Update cart quantity in navbar
      return;
    }

    alert(res.message + ", please refresh the page and try again");
    removeBtn.prop("disabled", false);
    removeBtn.html('<i class="uil uil-trash-alt fs-5"></i>');
  });

  itemsContainer.find(".js-item-quantity").change(async (e) => {
    const select = $(e.currentTarget);
    select.prop("disabled", true);

    const newQuantity = parseInt(select.val());
    const variationId = select.closest(".list-group-item").data("variation-id");

    console.log(
      `Updating item with variation ID: ${variationId} to quantity: ${newQuantity}`
    );
    const res = await updateCart({
      user_id: user.id,
      product_variation_id: variationId,
      quantity: newQuantity,
    });

    if (res.success) {
      await renderCart(); // await to ensure cart is rendered before checkout form
      await renderCheckoutForm();
      await updateCartQuantityDisplay(); // Update cart quantity in navbar
      return;
    }

    alert(res.message + ", please refresh the page and try again");
    select.prop("disabled", false);
  });
}

async function renderCheckoutForm() {
  const checkoutFormContainer = $("#checkout-form");
  checkoutFormContainer.html(
    `<div class="text-center p-3"><div class="spinner-border spinner-border-sm text-primary" role="status"><span class="visually-hidden">Loading...</span></div></div>`
  );

  try {
    const carts = await getAvailableCartsList();

    if (carts.length === 0) {
      const allCarts = await getCartsList();
      if (allCarts.length === 0) {
        checkoutFormContainer.html(
          `<p class="text-muted text-center p-3">Your cart is empty.</p>`
        );
      } else {
        checkoutFormContainer.html(
          `<p class="text-muted text-center p-3">No items available for checkout.</p>`
        );
      }
      return;
    }

    let totalCents = 0;
    for (const cart of carts) {
      const variation = await getVariation(cart.product_variation_id);
      if (
        variation?.stop_selling == 0 &&
        (await getProduct(variation.product_id)) &&
        (await getProduct(variation.product_id)).stop_selling == 0
      ) {
        totalCents += variation.price_cents * cart.quantity;
      }
    }

    const total = centsToDollars(totalCents);

    checkoutFormContainer.html(`
      <div class="d-flex justify-content-between mb-2">
        <span>Subtotal (${carts.length} items):</span>
        <span class="fw-bold fs-5 text-primary">&#36;${total} USD</span>
      </div>
      <p class="small text-muted mb-3">Shipping and tax will be calculated at checkout.</p>
      <div class="d-grid">
        <a href="./index.php?page=checkout" class="btn btn-dark ${
          totalCents === 0 ? "disabled" : ""
        }"><i class="uil uil-shield-check"></i> Proceed to Checkout</a>
      </div>
    `);
  } catch (error) {
    console.error(error);
    checkoutFormContainer.html(
      `<p class="text-danger text-center p-3">Could not load checkout summary.</p>`
    );
  }
}

async function init() {
  await renderCart();
  await renderCheckoutForm(); // renderCheckoutForm depends on cart data, so call after renderCart
  // updateCartQuantityDisplay is called within renderCart's success callbacks now.
}

init();
