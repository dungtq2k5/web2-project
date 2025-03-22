import { getFilterOrdersList, getOrdersList, updateOrder } from "../controllers/orders.js";
import { getProduct } from "../controllers/product/products.js";
import { getVariation } from "../controllers/product/variations.js";
import { getState, getStatesList } from "../controllers/order-delivery-states.js";
import {
  closeForm,
  renderProductVariationDetailPopup,
  renderUserDetailPopup
} from "./components.js";
import { disableBgScroll, formatAddress } from "../utils.js";
import { getAuth } from "../controllers/users.js";


const crudOrderMsg = $("#crud-order-msg");
const backdrop = $("#backdrop");
const resultCount = $("#result-count");
const tbody = $("#tbody");

export default function renderOrdersManagePage() {
  renderSearchOrderForm();
  renderOrdersData();
}

async function renderSearchOrderForm() {
  const searchForm = $("#search-order-form");
  const orderForm = searchForm.find("#search-order-from");
  const orderTo = searchForm.find("#search-order-to");
  const orderDelState = searchForm.find("#search-del-state");
  const sortOrder = searchForm.find("#search-order-form-sort");
  const clearBtn = searchForm.find("#search-order-form-clear-btn");
  const searchBtn = searchForm.find("#search-order-form-search-btn");

  const delStates = await getStatesList();
  const delStatesHTML = delStates.map(state => `
    <option value="${state.id}">${state.name}</option>
  `).join("");
  orderDelState.append(delStatesHTML);

  clearBtn.click(async () => {
    clearBtn.prop("disabled", true);
    clearBtn.text("clearing...");

    orderForm.val("");
    orderTo.val("");
    orderDelState.val("-1"); //all - default
    sortOrder.prop("checked", false);
    await renderOrdersData();

    clearBtn.prop("disabled", false);
    clearBtn.text("clear search");
  });

  searchBtn.click(async e => {
    e.preventDefault();
    searchBtn.prop("disabled", true);
    searchBtn.text("searching...");

    const filteredOrdersList = await getFilterOrdersList(
      orderForm.val(),
      orderTo.val(),
      orderDelState.val() != -1 ? orderDelState.val() : null,
      sortOrder.is(":checked")
    );
    await renderOrdersData(filteredOrdersList);

    searchBtn.text("search");
    searchBtn.prop("disabled", false);
  });
}

async function renderOrdersData(ordersList=null) {
  tbody.html("<tr><td colspan='10'>Loading data...</td></tr>");

  try {
    const orders = ordersList || await getOrdersList();

    let dataHTML;
    for(const [idx, order] of orders.entries()) {
      const delState = await getState(order.delivery_state_id);
      let itemsHTML = ``;
      for(const [, item] of order.items.entries()) {
        const variation = await getVariation(item.product_variation_id);
        const product = await getProduct(variation.product_id);

        itemsHTML += `
          <li class="content__item">
            <div>
              <img src="./assets/product.png" alt="smartwatch">
              <p>${product.name}</p>
              <i class="uil uil-multiply"></i>
              <p>${item.total_cents}&#162;</p>
              <i class="uil uil-multiply"></i>
              <p>${item.quantity}</p>
            </div>
            <button
              data-variation-id="${variation.id}"
              class="js-view-detail-item-btn"
            >view detail item</button>
          </li>
        `;
      }

      dataHTML += `
        <tr class="content__tr--g">
          <td data-cell="n.o" class="content__td--g">${idx+1}</td>
          <td data-cell="order id" class="content__td--g">${order.id}</td>
          <td data-cell="user id" class="content__td--g">
            ${order.user_id}
            <button
              data-user-id="${order.user_id}"
              class="js-view-detail-user-btn"
            >view detail user</button>
          </td>
          <td data-cell="items" class="content__td--g">
            <ul class="content__items">${itemsHTML}</ul>
          </td>
          <td data-cell="total" class="content__td--g">${order.total_cents}&#162;</td>
          <td data-cell="delivery info" class="content__td--g">
            <div>
              <p>To:</p>
              <address>${formatAddress(order.delivery_address)}</address>
            </div>
            <div>
              <p>Phone:</p>
              <p>${order.delivery_address.phone_number}</p>
            </div>
            <div>
              <p>State:</p>
              <p>${delState.name}</p>
            </div>
          </td>
          <td data-cell="ordered date" class="content__td--g">${order.order_date}</td>
          <td data-cell="estimate received date" class="content__td--g">${order.estimate_received_date}</td>
          <td data-cell="received date" class="content__td--g">${order.received_date}</td>
          <td data-cell="actions" class="content__td--g">
            <button
              class="js-update-btn"
              data-order-id="${order.id}"
              data-del-state-id="${order.delivery_state_id}"
            >update delivery state</button>
          </td>
        </tr>
      `;
    }

    tbody.html(dataHTML || "<tr><td colspan='10'>No data found!</td></tr>");

    tbody.find(".js-view-detail-user-btn").click(e => {
      const userId = $(e.currentTarget).data("user-id");
      console.log(`view detail user id ${userId}`);
      renderUserDetailPopup(userId, backdrop);
    });

    tbody.find(".js-view-detail-item-btn").click(e => {
      const variationId = $(e.currentTarget).data("variation-id");
      console.log(`view detail product variation id ${variationId}`);
      renderProductVariationDetailPopup(variationId, backdrop);
    })

    tbody.find(".js-update-btn").click(e => {
      const orderId = $(e.currentTarget).data("order-id");
      const delStateId = $(e.currentTarget).data("del-state-id");
      console.log(`update order id ${orderId} has delivery state id ${delStateId}`);
      renderUpdateDelStateForm(orderId, delStateId);
    });

    resultCount.text(orders.length);

  } catch(error) {
    console.error(`Error: ${error.message}`);
    tbody.html(`<tr><td colspan='10'>Error loading data: ${error.message}</td></tr>`);
  }
}

async function renderUpdateDelStateForm(orderId, delStateId) {
  disableBgScroll();
  backdrop.html("<p>Loading update delivery state from...</p>");
  backdrop.show();

  try {
    const delStates = await getStatesList();

    backdrop.html(() => {
      const statesHTML = delStates.map(state => (
        `<option
          value="${state.id}"
          ${state.id === delStateId && "selected"}
        >${state.name}</option>`
      )).join("");

      return `
        <form class="form--g">
          <button type="button" class="form__close--g js-update-del-state-form-close-btn"><i class="uil uil-times"></i></button>
          <h2 class="form__title--g">Update delivery state of order id ${orderId}</h2>

          <div class="form__field--g">
            <label for="delivery-state">Delivery state</label>
            <select id="delivery-state" class="form__select--g">${statesHTML}</select>
          </div>

          <div>
            <button id="update-del-state-form-submit-btn">update</button>
            <button type="button" class="js-update-del-state-form-close-btn">cancel</button>
          </div>

          <span id="update-del-state-form-submit-msg"></span>
        </form>
      `;
    });

    backdrop.find(".js-update-del-state-form-close-btn").click(() => closeForm(backdrop));

    const submitBtn = backdrop.find("#update-del-state-form-submit-btn");
    submitBtn.click(async e => {
      e.preventDefault();
      submitBtn.prop("disabled", true);
      submitBtn.text("updating...");

      const stateId = backdrop.find("#delivery-state").val();
      const res = await updateOrder(orderId, {delivery_state_id: stateId}, getAuth());

      if(!res.success) {
        submitBtn.text("update");
        submitBtn.prop("disabled", false);
        backdrop.find("#update-del-state-form-submit-msg").text(`Error: ${res.message}`);
        return;
      }

      crudOrderMsg.text(`* order id ${orderId} was updated`);
      setTimeout(() => {
        crudOrderMsg.text("");
      }, 2000);
      renderOrdersData(); //re-render
      closeForm(backdrop);
    });

  } catch(error) {
    console.error(`Error: ${error.message}`);
    backdrop.html(`<p>Error loading update user form: ${error.message}</p>`);
  }
}

renderOrdersManagePage();