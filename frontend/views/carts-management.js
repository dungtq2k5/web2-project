import {
  getAuth,
  setAuth,
  getUser,
  getUsersList,
  updateUserCart,
  deleteUserCart,
  getFilterUsersList
} from "../controllers/users.js";
import { getVariation } from "../controllers/product/variations.js";
import { getProduct } from "../controllers/product/products.js";
import {
  renderUserDetailPopup,
  renderProductVariationDetailPopup,
  closeForm,
  closePopup
} from "./components.js";
import { disableBgScroll } from "../utils.js";

//TODO temp
setAuth({
  email: "dungtranquang2005@gmail.com",
  password: "password123456789"
});

const crudCartMsg = $("#crud-cart-msg");
const backdrop = $("#backdrop");
const resultCount = $("#result-count");
const tbody = $("#tbody");

export default function renderUsersCartsManagePage() {
  const searchForm  = $("#search-cart-form");
  const searchInput = searchBtn.find("#search-cart-form-input");
  const searchBtn = searchForm.find("#search-cart-form-search-bt");
  const clearBtn = searchForm.find("#search-cart-form-clear-btn");

  searchBtn.click(async e => {
    e.preventDefault();
    searchBtn.prop("disabled", true);
    searchBtn.text("searching...");

    const valSearch = searchInput.val();
    const filteredUsersList = await getFilterUsersList(valSearch, true);
    await renderCartsData(filteredUsersList);

    searchBtn.text("search");
    searchBtn.prop("disabled", false);
  });

  clearBtn.click(async () => {
    clearBtn.prop("disabled", true);
    clearBtn.text("clearing...");

    searchInput.val("");
    await renderCartsData();

    clearBtn.prop("disabled", false);
    clearBtn.text("clear");
  });

  renderCartsData();
}

async function renderCartsData(usersList=null) {
  tbody.html("<tr><td colspan='5'>Loading data...</td></tr>");

  try {
    const users = usersList || await getUsersList();

    let dataHTML;
    for(const [idx, user] of users.entries()) {
      let cartItemsHTML = ``;
      for(const [, item] of user.cart.entries()) {
        const productVariation = await getVariation(item.product_variation_id);
        const product = await getProduct(productVariation.product_id);
        cartItemsHTML += `
          <li class="content__item">
            <div class="item__detail">
              <img class="item__img" src="" alt="smartwatch">
              <p>${product.name}</p>
              <p>-</p>
              <p>${productVariation.price_cents} &#162;</p>
              <i class="uil uil-multiply"></i>
              <p class="item__quantity">${item.quantity}</p>
            </div>

            <div
              data-variation-id="${productVariation.id}"
              data-user-id="${user.id}"
            >
              <button class="item__btn js-view-detail-item-btn">view detail item</button>
              <button title="remove this item" class="js-remove-item-btn">remove item</button>
            </div>
          </li>
        `;
      }

      dataHTML += `
        <tr class="content__tr--g">
          <td data-cell="n.o" class="content__td--g">${idx+1}</td>
          <td
            data-cell="user(buyer) id"
            class="content__td--g js-view-detail-user-btn"
            data-user-id="${user.id}"
            title="click to view user id ${user.id}"
          >
            ${user.id}
            <button> view detail user</button>
          </td>
          <td data-cell="user email" class="content__td--g">${user.email}</td>
          <td data-cell="user cart" class="content__td--g">
            <ul class="content__items">${cartItemsHTML || "empty cart"}</ul>
          </td>
          <td data-cell="actions" class="content__td--g">
            <button
              class="js-mod-cart-btn"
              data-user-id="${user.id}"
              title="mod user's cart"
              ${!user.cart.length && "disabled"}
            >modify cart</button>
          </td>
        </tr>
      `;
    }

    tbody.html(dataHTML || "<tr><td colspan='5'>No data found!</td></tr>");

    tbody.find(".js-view-detail-item-btn").click(e => {
      const parent = $(e.currentTarget).parent();
      const variationId = parent.data("variation-id");
      renderProductVariationDetailPopup(variationId, backdrop);
    });

    tbody.find(".js-remove-item-btn").click(e => {
      const parent = $(e.currentTarget).parent();
      const variationId = parent.data("variation-id");
      const userId = parent.data("user-id");
      renderRemoveItemPopup(variationId, userId);
    });

    tbody.find(".js-mod-cart-btn").click(e => {
      const userId = $(e.currentTarget).data("user-id");
      console.log(`modify user id ${userId} cart`);
      renderModCartForm(userId);
    });

    tbody.find(".js-view-detail-user-btn").click(e => {
      const userId = $(e.currentTarget).data("user-id");
      console.log(`view detail user id ${userId}`);
      renderUserDetailPopup(userId, backdrop);
    });

    resultCount.text(users.length);


  } catch(error) {
    console.error(`Error: ${error.message}`);
    tbody.html(`<tr><td colspan='5'>Error loading data: ${error.message}</td></tr>`);
  }
}

async function renderModCartForm(userId) {
  disableBgScroll();
  backdrop.html("<p>Loading modify cart form...</p>");
  backdrop.show();

  try {
    const user = await getUser(userId);
    let itemsHTML = ``;
    for(const [, item] of user.cart.entries()) {
      const variation = await getVariation(item.product_variation_id);
      const product  = await getProduct(variation.product_id);
      itemsHTML += `
        <li
          class="mod-cart-form__item js-mod-cart-form-item"
          data-variation-id="${variation.id}"
        >
          <div class="mod-cart-form__info">
            <img src="./assets/product.png" alt="smartwatch">
            <p>${product.name}</p>
            <i class="uil uil-times"></i>
            <div>
              <label for="${variation.id}-quantity">Quantity:</label>
              <input
                type="number"
                id="${variation.id}-quantity"
                class="mod-cart-info__input js-mod-cart-form-item-quant"
                min="1"
                max="${variation.stock_quantity}"
                placeholder="1"
                value="${item.quantity}"
              >
              <span class="js-mod-cart-form-item-quant-msg"></span>
            </div>
          </div>
        </li>
      `;
    }

    backdrop.html(`
      <form class="mod-cart-form">
        <button type="button" class="form__close--g js-mod-cart-form-close-btn">
          <i class="uil uil-times"></i>
        </button>
        <h2 class="form__title--g">Modify cart of user id ${user.id}</h2>

        <ul class="mod-cart-form__items" id="mod-cart-form__items">${itemsHTML}</ul>

        <span id="mod-cart-form-msg"></span>

        <div>
          <button type="button" class="js-mod-cart-form-close-btn">cancel</button>
          <button id="mod-cart-form-submit-btn">modify</button>
        </div>
      </form>
    `);

    backdrop.find(".js-mod-cart-form-close-btn").click(() => closeForm(backdrop));

    const submitBnt = backdrop.find("#mod-cart-form-submit-btn");
    submitBnt.click(async e => {
      e.preventDefault();
      submitBnt.prop("disabled", true);
      submitBnt.text("modifying...");
      const items = backdrop.find("#mod-cart-form__items").children().toArray();

      const validateForm = async () => {
        let allValid = true;

        for(const [, e] of items.entries()) {
          const item = $(e);
          const variationId = item.data("variation-id");
          const msg = item.find(".js-mod-cart-form-item-quant-msg");
          const newQuant = item.find(".js-mod-cart-form-item-quant").val() || 1;
          const variation = await getVariation(variationId);

          if(newQuant <= 0) {
            msg.text("quantity can't < 1");
            allValid = false;
          }
          if(newQuant > variation.stock_quantity) {
            console.log("greater");
            msg.text("quantity can't > stock quantity");
            allValid = false;
          }
        }

        return allValid;
      }

      if(await validateForm()) {
        const allUpdated = async () => {
          for(const [, e] of items.entries()) {
            const item = $(e);
            const variationId = item.data("variation-id");
            const msg = item.find(".js-mod-cart-form-item-quant-msg");
            const newQuant = item.find(".js-mod-cart-form-item-quant").val();
            const variation = await getVariation(variationId);

            if(newQuant != variation.quantity) { //quant change => update
              const res = await updateUserCart(
                {
                  user_id: user.id,
                  product_variation_id: variationId,
                  quantity: newQuant
                },
                getAuth()
              );
              if(!res.success) {
                msg.text(`Error: ${res.message}`);
                return false;
              }
            }

          }

          return true;
        }

        if(await allUpdated()) {
          crudCartMsg.text(`* cart of user id ${user.id} was modified`);
          setTimeout(() => {
            crudCartMsg.text("");
          }, 2000);
          renderCartsData();
          closeForm(backdrop);
        } else {
          submitBnt.text("modify");
          submitBnt.prop("disabled", false);
        }
      }
    });

  } catch(error) {
    console.error(`Error: ${error.massage}`);
    backdrop.html(`<p>Error loading data: ${error.message}</p>`);
  }
}

function renderRemoveItemPopup(variationId, userId) {
  disableBgScroll();

  backdrop.html(`
    <div class="form--g">
      <button type="button" class="form__close--g js-remove-item-popup-close-btn"><i class="uil uil-times"></i></button>
      <h2 class="form__title--g">Confirm remove item id ${variationId} from user id ${userId}'s cart?</h2>

      <div>
        <button id="remove-item-popup-submit-btn">remove</button>
        <button type="button" class="js-remove-item-popup-close-btn">cancel</button>
      </div>

      <span id="remove-item-popup-msg"></span>
    </div>
  `);

  backdrop.find(".js-remove-item-popup-close-btn").click(() => closePopup(backdrop));

  const submitBtn = backdrop.find("#remove-item-popup-submit-btn");
  submitBtn.click(async () => {
    submitBtn.prop("disabled", true);
    submitBtn.text("removing...");

    const res = await deleteUserCart(userId, variationId, getAuth());
    if(!res.success) {
      submitBtn.text("remove");
      submitBtn.prop("disabled", false);
      backdrop.find("#remove-item-popup-msg").text(`Error: ${res.message}`);
      return;
    }

    crudCartMsg.text(`* item id ${variationId} from user id ${userId}'s cart was deleted`);
    setTimeout(() => {
      crudCartMsg.text("");
    }, 3000);
    renderCartsData();
    closePopup(backdrop);
  });

  backdrop.show();
}

renderUsersCartsManagePage();