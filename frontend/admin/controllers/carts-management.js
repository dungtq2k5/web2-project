import {
  getUser,
  getUsersList,
  updateUserCart,
  deleteUserCart,
  getFilterUsersList,
} from "../../models/users.js";
import { getVariation } from "../../models/product/variations.js";
import { getProduct } from "../../models/product/products.js";
import {
  renderUserDetailPopup,
  renderProductVariationDetailPopup,
  closeForm,
  closePopup,
} from "./components.js";
import { disableBgScroll } from "../../utils.js";
import {
  DISPLAY_MSG_TIMEOUT,
  DEFAULT_IMG_PATH,
  VARIATION_IMG_PATH,
} from "../../settings.js";
import { hasPermission } from "../../models/auth.js";

const crudCartMsg = $("#crud-cart-msg");
const backdrop = $("#backdrop");
const resultCount = $("#result-count");
const tbody = $("#tbody");

const canRead = hasPermission("READ_CART");
const canUpdate = hasPermission("UPDATE_CART");
const canDelete = hasPermission("DELETE_CART");
const canReadUser = hasPermission("READ_USER");

export default function renderUsersCartsManagePage() {
  const searchForm = $("#search-cart-form");
  const searchInput = searchForm.find("#search-cart-form-input");
  const searchBtn = searchForm.find("#search-cart-form-search-btn");
  const clearBtn = searchForm.find("#search-cart-form-clear-btn");

  searchForm.submit(async (e) => {
    e.preventDefault();
    searchBtn.prop("disabled", true);
    searchBtn.text("Searching...");

    const filteredUsersList = await getFilterUsersList(searchInput.val(), true);
    await renderCartsData(filteredUsersList);

    searchBtn.text("Search");
    searchBtn.prop("disabled", false);
  });

  clearBtn.click(async () => {
    clearBtn.prop("disabled", true);
    clearBtn.text("Clearing...");

    await renderCartsData();

    clearBtn.prop("disabled", false);
    clearBtn.text("Clear search");
  });

  renderCartsData();
}

async function renderCartsData(usersList = null) {
  tbody.html(
    "<tr><td colspan='5' class='text-center p-3'>Loading data...</td></tr>"
  );

  try {
    const users = usersList || (await getUsersList());

    let dataHTML = "";

    for (const [idx, user] of users.entries()) {
      let cartItemsHTML = "";
      if (user.cart && user.cart.length > 0) {
        for (const [, item] of user.cart.entries()) {
          const variation = await getVariation(item.product_variation_id);
          if (!variation) continue;

          const product = await getProduct(variation.product_id);
          if (!product) continue;

          const variationImg = variation.image_name
            ? `${VARIATION_IMG_PATH}/${variation.image_name}`
            : DEFAULT_IMG_PATH;

          cartItemsHTML += `
            <li class="d-flex align-items-center justify-content-between p-2 border-bottom">
              <div class="d-flex align-items-center">
                <img src="${variationImg}" class="img-thumbnail me-2" alt="product image" style="width: 60px; height: 60px; object-fit: cover;" loading="lazy">
                <div>
                  <p class="mb-0 fw-bold">${product.name}</p>
                  <small class="text-muted">${variation.price_cents} &#162; x ${
            item.quantity
          }</small>
                </div>
              </div>
              <div
                class="d-flex gap-2 btn-group-sm"
                data-variation-id="${variation.id}"
                data-user-id="${user.id}"
              >
                ${
                  canRead
                    ? `<button class="js-view-detail-item-btn btn btn-outline-info" title="View item details">
                        <i class="uil uil-eye"></i>
                      </button>`
                    : ""
                }
                ${
                  canDelete
                    ? `<button class="js-remove-item-btn btn btn-outline-danger" title="Remove this item">
                        <i class="uil uil-trash-alt"></i>
                      </button>`
                    : ""
                }
              </div>
            </li>
          `;
        }
      }

      dataHTML += `
        <tr class="align-middle">
          <td data-cell="n.o" class="text-center p-2">${idx + 1}</td>
          <td
            data-cell="user(buyer) id"
            class="p-2"
          >
            ${user.id}
            ${
              canReadUser
                ? `<button
                    class="js-view-detail-user-btn btn btn-sm btn-outline-info ms-1"
                    title="View user details"
                    data-user-id="${user.id}"
                  >
                    <i class="uil uil-eye"></i>
                  </button>`
                : ""
            }
          </td>
          <td data-cell="user email" class="p-2">${user.email}</td>
          <td data-cell="user cart" class="p-2">
            ${
              cartItemsHTML
                ? `<ul class="list-unstyled mb-0">${cartItemsHTML}</ul>`
                : "<p class='text-muted text-center p-2'>Empty cart</p>"
            }
          </td>
          <td data-cell="actions" class="text-center p-2">
            ${
              cartItemsHTML && canUpdate
                ? `<button
                  class="js-mod-cart-btn btn btn-info btn-sm"
                  data-user-id="${user.id}"
                >
                  <i class='uil uil-pen'></i>
                </button>`
                : "No actions"
            }
          </td>
        </tr>
      `;
    }

    tbody.html(
      dataHTML ||
        "<tr><td colspan='5' class='text-center p-3'>No data</td></tr>"
    );

    if (canRead) {
      tbody.find(".js-view-detail-item-btn").click((e) => {
        const parent = $(e.currentTarget).parent();
        const variationId = parent.data("variation-id");
        renderProductVariationDetailPopup(variationId, backdrop);
      });
    }

    if (canDelete) {
      tbody.find(".js-remove-item-btn").click((e) => {
        const parent = $(e.currentTarget).parent();
        const variationId = parent.data("variation-id");
        const userId = parent.data("user-id");
        renderRemoveItemPopup(variationId, userId);
      });
    }

    if (canUpdate) {
      tbody.find(".js-mod-cart-btn").click((e) => {
        const userId = $(e.currentTarget).data("user-id");
        console.log(`modify user id ${userId} cart`);
        renderModCartForm(userId);
      });
    }

    if (canReadUser) {
      tbody.find(".js-view-detail-user-btn").click((e) => {
        const userId = $(e.currentTarget).data("user-id");
        console.log(`view detail user id ${userId}`);
        renderUserDetailPopup(userId, backdrop);
      });
    }

    resultCount.text(users.length);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    tbody.html(
      `<tr><td colspan='5' class='text-center p-3 table-danger">Error loading data: ${error.message}</td></tr>`
    );
  }
}

async function renderModCartForm(userId) {
  disableBgScroll();
  backdrop.html(
    "<div class='d-flex justify-content-center align-items-center' style='height: 100vh;'><div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading modify cart form...</span></div></div>"
  );
  backdrop.show();

  try {
    const user = await getUser(userId);
    let itemsHTML = `<ul class="list-group list-group-flush" id="mod-cart-form__items">`;

    for (const [, item] of user.cart.entries()) {
      const variation = await getVariation(item.product_variation_id);
      const product = await getProduct(variation.product_id);
      const variationImg = variation.image_name
        ? `${VARIATION_IMG_PATH}/${variation.image_name}`
        : DEFAULT_IMG_PATH;

      itemsHTML += `
        <li
          class="list-group-item js-mod-cart-form-item p-3"
          data-variation-id="${variation.id}"
          data-current-quantity="${item.quantity}"
        >
          <div class="d-flex align-items-center">
            <img src="${variationImg}" alt="product image" loading="lazy" class="img-thumbnail me-3" style="width: 80px; height: 80px; object-fit: cover;">
            <div class="flex-grow-1">
              <p class="mb-1 fw-bold">${product.name}</p>
              <div class="d-flex align-items-center">
                <label for="${variation.id}-quantity" class="form-label me-2 mb-0">Quantity:</label>
                <input
                  type="number"
                  id="${variation.id}-quantity"
                  class="form-control form-control-sm js-mod-cart-form-item-quant"
                  min="1"
                  max="${variation.stock_quantity}"
                  value="${item.quantity}"
                  placeholder="${item.quantity}"
                  style="width: 80px;"
                >
              </div>
              <small class="js-mod-cart-form-item-quant-msg text-danger"></small>
            </div>
          </div>
        </li>
      `;
    }
    itemsHTML += `</ul>`;

    backdrop.html(`
      <div class="card shadow-lg m-3 m-md-5 mx-auto" style="max-width: 700px;">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h2 class="h5 mb-0">Modify Cart (User ID: ${user.id})</h2>
          <button type="button" class="btn-close js-mod-cart-form-close-btn" aria-label="Close"></button>
        </div>
        <form id="mod-cart-form">
          <div class="card-body p-0">
            ${itemsHTML}
          </div>
          <div class="card-footer">
            <div id="mod-cart-form-msg" class="mb-2 text-danger"></div>
            <div class="d-flex justify-content-end gap-2 btn-group-sm">
              <button type="submit" id="mod-cart-form-submit-btn" class="btn btn-dark">
                Modify
              </button>
              <button type="button" class="btn btn-outline-dark js-mod-cart-form-close-btn">
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    `);

    const form = backdrop.find("#mod-cart-form");

    backdrop
      .find(".js-mod-cart-form-close-btn")
      .click(() => closeForm(backdrop));

    form.submit(async (e) => {
      e.preventDefault();

      const submitBnt = form.find("#mod-cart-form-submit-btn");
      submitBnt.prop("disabled", true);
      submitBnt.text("Modifying...");

      const items = form.find("#mod-cart-form__items").children().toArray();

      const validateForm = async () => {
        let allValid = true;

        for (const [, e] of items.entries()) {
          const item = $(e);
          const msg = item.find(".js-mod-cart-form-item-quant-msg");
          const newQuant = item.find(".js-mod-cart-form-item-quant").val(); // Return a string of number

          if (!newQuant) {
            msg.text("* is required");
            allValid = false;
          } else if (newQuant < 1) {
            msg.text("quantity can't be smaller than 1");
            allValid = false;
          } else {
            const variationId = item.data("variation-id");
            const variation = await getVariation(variationId);
            if (newQuant > variation.stock_quantity) {
              msg.text(
                `quantity can't be greater than stock quantity which is ${variation.stock_quantity}`
              );
              allValid = false;
            } else {
              msg.text("");
            }
          }
        }

        return allValid;
      };

      if (await validateForm()) {
        const allUpdated = async () => {
          for (const [, e] of items.entries()) {
            const item = $(e);
            const variationId = item.data("variation-id");
            const newQuant = parseInt(
              item.find(".js-mod-cart-form-item-quant").val()
            );
            const res = await updateUserCart(userId, variationId, newQuant);

            if (!res.success) {
              return false;
            }
          }
          return true;
        };

        if (await allUpdated()) {
          form
            .find("#mod-cart-form-msg")
            .removeClass("text-danger")
            .addClass("text-success")
            .text("Cart updated successfully!");
          setTimeout(() => {
            closeForm(backdrop);
            renderCartsData();
          }, DISPLAY_MSG_TIMEOUT);
        } else {
          form
            .find("#mod-cart-form-msg")
            .removeClass("text-success")
            .addClass("text-danger")
            .text("Failed to update cart. Please try again.");
        }
      }

      submitBnt.prop("disabled", false);
      submitBnt.text("Modify");
    });
  } catch (error) {
    console.error(`Error rendering modify cart form: ${error.message}`);
    backdrop.html(
      `<div class="alert alert-danger m-3 p-4 text-center">Could not load cart details. ${error.message}</div>`
    );
  }
}

async function renderRemoveItemPopup(variationId, userId) {
  disableBgScroll();
  backdrop.html(
    "<div class='d-flex justify-content-center align-items-center' style='height: 100vh;'><div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading...</span></div></div>"
  );
  backdrop.show();

  try {
    const user = await getUser(userId);
    const variation = await getVariation(variationId);
    const product = await getProduct(variation.product_id);

    backdrop.html(`
      <div class="card shadow-lg m-3 m-md-5 mx-auto" style="max-width: 500px;">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h2 class="h5 mb-0">Confirm Removal</h2>
          <button type="button" class="btn-close js-remove-item-popup-close-btn" aria-label="Close"></button>
        </div>
        <div class="card-body">
          <p>Are you sure you want to remove <strong>${product.name} (Variation ID: ${variation.id})</strong> from <strong>${user.email}</strong>'s cart?</p>
          <div id="remove-item-popup-msg" class="mb-2 text-danger"></div>
        </div>
        <div class="card-footer d-flex justify-content-end gap-2 btn-group-sm">
          <button type="button" id="remove-item-confirm-btn" class="btn btn-danger">
            Remove
          </button>
          <button type="button" class="btn btn-outline-dark js-remove-item-popup-close-btn">
            Cancel
          </button>
        </div>
      </div>
    `);

    backdrop
      .find(".js-remove-item-popup-close-btn")
      .click(() => closePopup(backdrop));

    backdrop.find("#remove-item-confirm-btn").click(async () => {
      const confirmBtn = backdrop.find("#remove-item-confirm-btn");
      confirmBtn.prop("disabled", true);
      confirmBtn.text("Removing...");

      const res = await deleteUserCart(userId, variationId);

      if (res.success) {
        crudCartMsg.text("* Item removed successfully!");
        setTimeout(() => {
          crudCartMsg.text("");
          closePopup(backdrop);
        }, DISPLAY_MSG_TIMEOUT);
        renderCartsData();
        closePopup(backdrop);
        return;
      }

      backdrop
        .find("#remove-item-popup-msg")
        .text("Failed to remove item. Please try again.");
      confirmBtn.prop("disabled", false);
      confirmBtn.text("Remove");
    });
  } catch (error) {
    console.error(`Error rendering remove item popup: ${error.message}`);
    backdrop.html(
      `<div class="alert alert-danger m-3 p-4 text-center">Could not load item details for removal. ${error.message}</div>`
    );
  }
}

renderUsersCartsManagePage();
