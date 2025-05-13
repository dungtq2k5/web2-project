import {
  getFilterOrdersList,
  getOrdersList,
  updateOrder
} from "../../models/orders.js";
import { getProduct } from "../../models/product/products.js";
import { getVariation } from "../../models/product/variations.js";
import { getState, getStatesList } from "../../models/order-delivery-states.js";
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
} from "../../utils.js";
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
} from "../../settings.js";
import { hasPermission } from "../../models/auth.js";


const crudOrderMsg = $("#crud-order-msg");
const backdrop = $("#backdrop");
const resultCount = $("#result-count");
const tbody = $("#tbody");

const canUpdate = hasPermission("UPDATE_ORDER");
const canReadUser = hasPermission("READ_USER");
const canReadOrder = hasPermission("READ_ORDER");

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
    clearBtn.text("Clearing...");

    await renderOrdersData();

    clearBtn.text("Clear search");
    clearBtn.prop("disabled", false);
  });

  form.submit(async e => {
    e.preventDefault();
    searchBtn.prop("disabled", true);
    searchBtn.text("Searching...");

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

    searchBtn.text("Search");
    searchBtn.prop("disabled", false);
  });
}

async function renderOrdersData(ordersList=null) {
  tbody.html("<tr><td colspan='10' class=\"p-3 text-center\">Loading data...</td></tr>");

  try {
    const orders = ordersList || await getOrdersList();

    let dataHTML = "";

    for(const [idx, order] of orders.entries()) {
      let itemsHTML = `<ul class="list-unstyled mb-0">`;
      const delState = await getState(order.delivery_state_id);

      for(const [, item] of order.items.entries()) {
        const variation = await getVariation(item.product_variation_id);
        const product = await getProduct(variation.product_id);
        const img = product.image_name ? `${PRODUCT_IMG_PATH}/${product.image_name}` : DEFAULT_IMG_PATH;

        itemsHTML += `
          <li class="d-flex align-items-center justify-content-between p-2 border-bottom">
            <div class="d-flex align-items-center">
              <img src="${img}" alt="Product Image" class="img-thumbnail me-2" style="width: 50px; height: 50px; object-fit: cover;" loading="lazy">
              <div>
                <p class="mb-0 fw-bold small">${product.name}</p>
                <small class="text-muted">${item.total_cents}&#162; x ${item.quantity}</small>
              </div>
            </div>
            ${
              canReadOrder
                ? `<button
                    data-variation-id="${variation.id}"
                    class="js-view-detail-item-btn btn btn-sm btn-outline-info"
                    title="View item details"
                  >
                    <i class="uil uil-eye"></i>
                  </button>
                `
                : ""
            }

          </li>
        `;
      }
      itemsHTML += `</ul>`;

      const orderDate = convertUtcToLocalDatetime(order.order_date);
      const estimateReceivedDate = order.estimate_received_date ? convertUtcToLocalDatetime(order.estimate_received_date) : "<span class='text-muted'>N/A</span>";
      const receivedDate = order.received_date ? convertUtcToLocalDatetime(order.received_date) : "<span class='text-muted'>N/A</span>";

      dataHTML += `
        <tr
          class="align-middle"
          data-order-id="${order.id}"
        >
          <td data-cell="n.o" class="text-center p-2">${idx+1}</td>
          <td data-cell="order id" class="p-2">${order.id}</td>
          <td data-cell="user id" class="p-2">
            <div class="d-flex align-items-center gap-1">
              ${order.user_id}
              ${
                canReadUser
                ? `<button
                    data-user-id="${order.user_id}"
                    class="js-view-detail-user-btn btn btn-sm btn-outline-info"
                    title="View user details"
                  >
                    <i class="uil uil-eye"></i>
                  </button>`
                : ""
              }
            </div>
          </td>
          <td data-cell="items" class="p-2" style="min-width: 250px;">${itemsHTML}</td>
          <td data-cell="total" class="text-end p-2">${order.total_cents}&#162;</td>
          <td data-cell="delivery info" class="p-2 small" style="min-width: 200px;">
            <div><strong>To:</strong> <address class="d-inline">${formatAddress(order.delivery_address)}</address></div>
            <div><strong>Phone:</strong> ${order.delivery_address.phone_number}</div>
            <div><strong>State:</strong> <span class="badge bg-info">${delState.name}</span></div>
          </td>
          <td data-cell="ordered date" class="p-2 small">${orderDate}</td>
          <td data-cell="estimate received date" class="p-2 small">${estimateReceivedDate}</td>
          <td data-cell="received date" class="p-2 small">${receivedDate}</td>
          <td data-cell="actions" class="text-center p-2">
            ${canUpdate && ORDER_COMPLETED_STATES.includes(delState.id)
              ? "<span class='text-muted'>No actions</span>"
              : `
                <button
                  class="js-update-btn btn btn-sm btn-warning"
                  data-del-state-id="${order.delivery_state_id}"
                  title="Update delivery state"
                ><i class="uil uil-truck"></i> Update state</button>
              `
            }
          </td>
        </tr>
      `;
    }

    tbody.html(dataHTML || "<tr><td colspan='10' class=\"p-3 text-center\">No data found!</td></tr>");

    if(canReadUser) {
      tbody.find(".js-view-detail-user-btn").click(e => {
        const userId = $(e.currentTarget).data("user-id");
        console.log(`view detail user id ${userId}`);
        renderUserDetailPopup(userId, backdrop);
      });
    }

    if(canReadOrder) {
      tbody.find(".js-view-detail-item-btn").click(e => {
        const currTarget = $(e.currentTarget);
        const tr = currTarget.closest("tr");

        const orderId = tr.data("order-id");
        const variationId = currTarget.data("variation-id");

        console.log(`view detail product variation id ${variationId}`);
        renderProductVariationDetailPopup(variationId, backdrop, orderId);
      })
    }

    if(canUpdate) {
      tbody.find(".js-update-btn").click(e => {
        const currTarget = $(e.currentTarget);
        const tr = currTarget.closest("tr");

        const orderId = tr.data("order-id");
        const delStateId = currTarget.data("del-state-id");

        console.log(`update order id ${orderId} has delivery state id ${delStateId}`);
        renderUpdateDelStateForm(orderId, delStateId);
      });
    }

    resultCount.text(orders.length);

  } catch(error) {
    console.error(`Error: ${error.message}`);
    tbody.html(`<tr><td colspan='10' class="p-3 text-center table-danger">Error loading data: ${error.message}</td></tr>`);
  }
}

async function renderUpdateDelStateForm(orderId, delStateId) {
  disableBgScroll();
  backdrop.html("<div class='d-flex justify-content-center align-items-center' style='height: 100vh;'><div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading update delivery state form...</span></div></div>");
  backdrop.show();

  try {
    const delStates = await getStatesList();

    backdrop.html(() => {
      const statesHTML = delStates.map(state => (
        `<option
          value="${state.id}"
          ${state.id == delStateId ? "selected" : ""}
          ${ORDER_COMPLETED_STATES.includes(parseInt(delStateId)) && state.id != delStateId ? "disabled" : ""}
        >${state.name}</option>` // Disable states if current is completed and not the same
      )).join("");

      return `
        <div class="card shadow-lg m-3 m-md-5 mx-auto" style="max-width: 500px;">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h2 class="h5 mb-0">Update Delivery State (Order ID: ${orderId})</h2>
            <button type="button" class="btn-close js-update-del-state-form-close-btn" aria-label="Close"></button>
          </div>
          <form id="update-del-state-form">
            <div class="card-body">
              <div class="mb-3">
                <label for="delivery-state" class="form-label">New Delivery State:</label>
                <select id="delivery-state" class="form-select">
                  ${statesHTML}
                </select>
              </div>
              <div id="update-del-state-form-submit-msg" class="text-danger"></div>
            </div>
            <div class="card-footer d-flex justify-content-end gap-2 btn-group-sm">
              <button type="submit" id="update-del-state-form-submit-btn" class="btn btn-dark">
                Update
              </button>
              <button type="button" class="btn btn-outline-dark js-update-del-state-form-close-btn">
                Cancel
              </button>
            </div>
          </form>
        </div>
      `;
    });

    const form = backdrop.find("#update-del-state-form");

    // Attach event handlers to all close buttons including the one in the header
    backdrop.find(".js-update-del-state-form-close-btn").click(() => closeForm(backdrop));

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
    backdrop.html(`<div class="alert alert-danger m-3">Error loading update order form: ${error.message}</div>`);
  }
}

renderOrdersManagePage();