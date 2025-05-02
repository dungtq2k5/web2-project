import {
  getFilterOrdersList,
  getOrdersList,
  updateOrder
} from "../controllers/orders.js";
import { getProduct } from "../controllers/product/products.js";
import { getVariation } from "../controllers/product/variations.js";
import { getState, getStatesList } from "../controllers/order-delivery-states.js";
import {
  closeForm,
  renderProductVariationDetailPopup,
  renderUserDetailPopup
} from "./components.js";
import {
  disableBgScroll,
  formatAddress,
  convertUtcToLocalDatetime,
  filterTextInputsInFormData
} from "../utils.js";
import {
  PRODUCT_IMG_PATH,
  DEFAULT_IMG_PATH,
  DISPLAY_MSG_TIMEOUT,
  ORDER_COMPLETED_STATES,
  ORDER_RECEIVED_ID,
  ORDER_RETURNED_ID,
  ORDER_DELIVERED_ID,
  ORDER_CANCELLED_ID,
  ORDER_SHIPPED_ID
} from "../settings.js";


const crudOrderMsg = $("#crud-order-msg");
const backdrop = $("#backdrop");
const resultCount = $("#result-count");
const tbody = $("#tbody");

export default function renderOrdersManagePage() {
  renderSearchOrderForm();
  renderOrdersData();
}

async function renderSearchOrderForm() {
  const form = $("#search-order-form");

  const clearBtn = form.find("#search-clear-btn");
  const searchBtn = form.find("#search-search-btn");

  const delStates = await getStatesList();
  const delStatesHTML = delStates.map(state => `
    <option value="${state.id}">${state.name}</option>
  `).join("");
  form.find("#search-del-state").append(delStatesHTML);

  clearBtn.click(async () => {
    clearBtn.prop("disabled", true);
    clearBtn.text("clearing...");

    await renderOrdersData();

    clearBtn.text("clear search");
    clearBtn.prop("disabled", false);
  });

  form.submit(async e => {
    e.preventDefault();
    searchBtn.prop("disabled", true);
    searchBtn.text("searching...");

    const formData = filterTextInputsInFormData(new FormData(form[0]));

    const filteredOrdersList = await getFilterOrdersList(
      formData.get("order_from") || null,
      formData.get("order_to") || null,
      formData.get("city_province") || null,
      formData.get("district") || null,
      formData.get("ward") || null,
      formData.get("street") || null,
      formData.get("del_state") != -1 ? formData.get("del_state") : null,
      formData.get("sort") ? true : false
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
      let itemsHTML = ``;
      const delState = await getState(order.delivery_state_id);

      for(const [, item] of order.items.entries()) {
        const variation = await getVariation(item.product_variation_id);
        const product = await getProduct(variation.product_id);
        const img = product.image_name ? `${PRODUCT_IMG_PATH}/${product.image_name}` : DEFAULT_IMG_PATH;

        itemsHTML += `
          <li class="content__item">
            <div>
              <img src="${img}" alt="smartwatch">
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

      const orderDate = convertUtcToLocalDatetime(order.order_date);
      const estimateReceivedDate = order.estimate_received_date ? convertUtcToLocalDatetime(order.estimate_received_date) : "none";
      const receivedDate = order.received_date ? convertUtcToLocalDatetime(order.received_date) : "none";

      dataHTML += `
        <tr
          class="content__tr--g"
          data-order-id="${order.id}"
        >
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
          <td data-cell="ordered date" class="content__td--g">${orderDate}</td>
          <td data-cell="estimate received date" class="content__td--g">${estimateReceivedDate}</td>
          <td data-cell="received date" class="content__td--g">${receivedDate}</td>
          <td data-cell="actions" class="content__td--g">
            ${ORDER_COMPLETED_STATES.includes(delState.id)
              ? "no actions"
              : `
                <button
                  class="js-update-btn"
                  data-del-state-id="${order.delivery_state_id}"
                >update delivery state</button>
              `
            }
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
      const currTarget = $(e.currentTarget);
      const tr = currTarget.closest("tr");

      const orderId = tr.data("order-id");
      const variationId = currTarget.data("variation-id");

      console.log(`view detail product variation id ${variationId}`);
      renderProductVariationDetailPopup(variationId, backdrop, orderId);
    })

    tbody.find(".js-update-btn").click(e => {
      const currTarget = $(e.currentTarget);
      const tr = currTarget.closest("tr");

      const orderId = tr.data("order-id");
      const delStateId = currTarget.data("del-state-id");

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
          ${state.id == delStateId && "selected"}
        >${state.name}</option>`
      )).join("");

      return `
        <form class="form--g" id="update-del-state-form">
          <button type="button" class="form__close--g js-update-del-state-form-close-btn"><i class="uil uil-times"></i></button>
          <h2 class="form__title--g">Update delivery state of order id ${orderId}</h2>

          <div class="form__field--g">
            <label for="delivery-state">Delivery state</label>
            <select id="delivery-state" class="form__select--g">${statesHTML}</select>
          </div>

          <div>
            <button type="submit" id="update-del-state-form-submit-btn">update</button>
            <button type="button" class="js-update-del-state-form-close-btn">cancel</button>
          </div>

          <span id="update-del-state-form-submit-msg"></span>
        </form>
      `;
    });

    const form = backdrop.find("#update-del-state-form");

    form.find(".js-update-del-state-form-close-btn").click(() => closeForm(backdrop));

    form.submit(async e => {
      e.preventDefault();

      const submitBtn = form.find("#update-del-state-form-submit-btn");
      submitBtn.prop("disabled", true);
      submitBtn.text("updating...");

      const stateId = parseInt(form.find("#delivery-state").val());
      const stateMsg = form.find("#update-del-state-form-submit-msg");

      const validateForm = () => {
        if(ORDER_COMPLETED_STATES.includes(delStateId)) {
          stateMsg.text("Error: cannot update completed order");
          return false;
        } else if(stateId == delStateId)  {
          stateMsg.text("Error: no changes made, no need to update");
          return false;
        } else if(stateId < delStateId) {
          stateMsg.text("Error: cannot update to previous delivery state");
          return false;
        } else if([ORDER_RECEIVED_ID, ORDER_RETURNED_ID].includes(stateId) && delStateId != ORDER_DELIVERED_ID) {
          stateMsg.text("Error: cannot update to received or returned state without being at delivered state");
          return false;
        } else if(stateId == ORDER_CANCELLED_ID && delStateId >= ORDER_SHIPPED_ID) {
          stateMsg.text("Error: cannot cancel order that has been shipped");
          return false;
        }

        stateMsg.text("");
        return true;
      }

      if(validateForm()) {
        const res = await updateOrder(orderId, {delivery_state_id: stateId});

        if(res.success) {
          crudOrderMsg.text(`* order id ${orderId} was updated`);
          setTimeout(() => {
            crudOrderMsg.text("");
          }, DISPLAY_MSG_TIMEOUT);
          renderOrdersData(); //re-render
          closeForm(backdrop);
          return;
        }

        stateMsg.text(`Error: ${res.message}`);
      }

      submitBtn.text("update");
      submitBtn.prop("disabled", false);
    });

  } catch(error) {
    console.error(`Error: ${error.message}`);
    backdrop.html(`<p>Error loading update user form: ${error.message}</p>`);
  }
}

renderOrdersManagePage();