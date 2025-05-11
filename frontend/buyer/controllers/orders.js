import {
  getOrdersList,
  getOrder,
  sortOrdersListByDate,
  updateOrder
} from "../../models/orders.js";
import { getVariation } from "../../models/product/variations.js";
import { getProduct } from "../../models/product/products.js";
import {
  DEFAULT_IMG_PATH,
  VARIATION_IMG_PATH,
  ORDER_DELIVERED_ID,
  ORDER_SHIPPED_ID,
  ORDER_RECEIVED_ID,
  ORDER_CANCELLED_ID,
  ORDER_RETURNED_ID,
} from "../../settings.js";
import { centsToDollars, disableBgScroll } from "../../utils.js";
import { getState, getStatesList } from "../../models/order-delivery-states.js";
import { formatAddress } from "../../utils.js";
import { closePopup } from "./components.js";


const backdrop = $("#backdrop");
const ordersContainer = $("#orders-container");


async function renderOrderSections() {
  const orderSections = $("#order-sections");
  const buttons = orderSections.find(".nav-link");

  buttons.click(function() {
    buttons.removeClass("active");
    $(this).addClass("active");
    const filterType = $(this).data("filter");

    ordersContainer.html(`<div class="text-center p-5"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div><p>Loading orders...</p></div>`);

    switch(filterType) {
      case "all":
        renderOrdersData();
        break;
      case "to-ship":
        getOrdersList().then(orders => {
          const ordersFiltered = orders.filter(order => order.delivery_state_id < ORDER_SHIPPED_ID);
          renderOrdersData(ordersFiltered);
        });
        break;
      case "to-receive":
        getOrdersList().then(orders => {
          const ordersFiltered = orders.filter(order => order.delivery_state_id >= ORDER_SHIPPED_ID && order.delivery_state_id <= ORDER_DELIVERED_ID);
          renderOrdersData(ordersFiltered);
        });
        break;
      case "completed":
        getOrdersList().then(orders => {
          const ordersFiltered = orders.filter(order => order.delivery_state_id == ORDER_RECEIVED_ID);
          renderOrdersData(ordersFiltered);
        });
        break;
      case "cancelled":
        getOrdersList().then(orders => {
          const ordersFiltered = orders.filter(order => order.delivery_state_id == ORDER_CANCELLED_ID);
          renderOrdersData(ordersFiltered);
        });
        break;
      case "returned":
        getOrdersList().then(orders => {
          const ordersFiltered = orders.filter(order => order.delivery_state_id == ORDER_RETURNED_ID);
          renderOrdersData(ordersFiltered);
        });
        break;
    }
  });
}

async function renderOrdersData(list) {
  ordersContainer.html(`<div class="text-center p-5"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div><p>Loading orders...</p></div>`);

  try {
    const orders = list || await sortOrdersListByDate();

    let ordersHTML = "";

    if (orders.length === 0) {
      ordersContainer.html(`<div class="alert alert-info text-center mt-3">No orders found. <a href="./index.php?page=home" class="alert-link">Go shopping now!</a></div>`);
      return;
    }

    for(const order of orders) {
      let itemsHTML = "";
      for(const item of order.items) {
        const variation = await getVariation(item.product_variation_id);
        const variationImg = variation && variation.image_name
          ? `${VARIATION_IMG_PATH}/${variation.image_name}`
          : DEFAULT_IMG_PATH;

        const product = variation ? await getProduct(variation.product_id) : null;

        itemsHTML += `
          <li class="d-flex align-items-center border-bottom py-2 ${(!product || !variation) ? "opacity-50" : ""}">
            <img src="${variationImg}" style="width: 60px; height: 60px; object-fit: contain;" class="me-3 rounded" alt="${product ? product.name : "Product image"}">
            <div class="flex-grow-1">
              <p class="mb-0 fw-medium small">${product ? product.name : "N/A"} - ${variation ? variation.watch_size_mm : "N/A"}MM</p>
              <small class="text-muted">Qty: ${item.quantity}</small>
            </div>
            <div class="ms-auto fw-bold small">&#36;${centsToDollars(item.total_cents)} USD</div>
          </li>
        `;
      }

      const deliveryState = await getState(order.delivery_state_id);
      const canReturnConfirmOrder = deliveryState.id == ORDER_DELIVERED_ID;
      const canCancelOrder = deliveryState.id < ORDER_SHIPPED_ID;

      let stateBadgeClass = "bg-secondary";
      if (deliveryState.id === ORDER_DELIVERED_ID || deliveryState.id === ORDER_RECEIVED_ID) stateBadgeClass = "bg-success";
      else if (deliveryState.id === ORDER_CANCELLED_ID || deliveryState.id === ORDER_RETURNED_ID) stateBadgeClass = "bg-danger";
      else if (deliveryState.id >= ORDER_SHIPPED_ID) stateBadgeClass = "bg-info";


      ordersHTML += `
        <div class="list-group-item mb-3 shadow-sm p-3" data-order-id="${order.id}">
          <div class="d-flex w-100 justify-content-between align-items-center mb-2">
            <h6 class="mb-0 text-muted small">Order ID: #${order.id} <span class="ms-2 badge ${stateBadgeClass} text-white">${deliveryState.name}</span></h6>
            <small class="text-muted">${new Date(order.order_date).toLocaleDateString()}</small>
          </div>
          <ul class="list-unstyled mt-2 mb-2">${itemsHTML}</ul>
          <div class="d-flex justify-content-between align-items-center mt-2 pt-2 border-top">
            <p class="mb-0 small">Order total: <strong class="text-primary fs-6">&#36;${centsToDollars(order.total_cents)} USD</strong></p>
            <div class="btn-group-sm">
              <button class="btn btn-dark js-view-detail-order me-1">View Details</button>
          ${
            canReturnConfirmOrder
              ? `<button class="btn btn-dark js-confirm-order-btn me-1"><i class="uil uil-check"></i> Confirm Received</button>
                 <button class="btn btn-danger js-return-order-btn"><i class="uil uil-corner-up-left-alt"></i> Return/Refund</button>`
              : canCancelOrder
                ? `<button class="btn btn-danger js-cancel-order-btn">Cancel Order</button>`
                : ""
          }
            </div>
          </div>
        </div>
      `;
    }

    ordersContainer.html(ordersHTML);

    ordersContainer.find(".js-view-detail-order").click(e => {
      const orderId = $(e.currentTarget).closest(".list-group-item").data("order-id");
      console.log("View detail order:", orderId);
      renderOrderDetailPopup(orderId);
    });

    ordersContainer.find(".js-return-order-btn").click(e => {
      const orderId = $(e.currentTarget).closest(".list-group-item").data("order-id");
      console.log("Return order:", orderId);
      renderConfirmReturnOrderPopup(orderId);
    });

    ordersContainer.find(".js-confirm-order-btn").click(e => {
      const orderId = $(e.currentTarget).closest(".list-group-item").data("order-id");
      console.log("Confirm received order:", orderId);
      renderConfirmReceivedOrderPopup(orderId);
    });

    ordersContainer.find(".js-cancel-order-btn").click(e => {
      const orderId = $(e.currentTarget).closest(".list-group-item").data("order-id");
      console.log("Cancel order:", orderId);
      renderConfirmCancelOrderPopup(orderId);
    });

  } catch (error) {
    console.error("Error rendering orders data:", error);
    ordersContainer.html(`<div class="alert alert-danger text-center mt-3">Error loading orders. Please try again later.</div>`);
  }
}

async function renderOrderDetailPopup(orderId) {
  disableBgScroll();
  backdrop.html(`<div class="d-flex justify-content-center align-items-center" style="height:100%;">
                    <div class="spinner-border text-light" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                  </div>`);
  backdrop.show();

  try {
    const order = await getOrder(orderId);

    let itemsHTML = "";
    for(const item of order.items) {
      const variation = await getVariation(item.product_variation_id);
      const variationImg = variation && variation.image_name
        ? `${VARIATION_IMG_PATH}/${variation.image_name}`
        : DEFAULT_IMG_PATH;
      const product = variation ? await getProduct(variation.product_id) : null;
      itemsHTML += `
        <li class="list-group-item d-flex align-items-center ${(!product || !variation) ? "opacity-50" : ""}">
          <img src="${variationImg}" style="width: 50px; height: 50px; object-fit: contain;" class="me-3 rounded" alt="${product ? product.name : "Product image"}">
          <div class="flex-grow-1">
            <p class="mb-0 small fw-medium">${product ? product.name : "N/A"} - ${variation ? variation.watch_size_mm : "N/A"}MM</p>
            <small class="text-muted">Qty: ${item.quantity}</small>
          </div>
          <div class="ms-auto small fw-bold">&#36;${centsToDollars(item.total_cents)} USD</div>
        </li>
      `;
    }

    const deliveryStates = await getStatesList();
    const orderStateHTML = deliveryStates.map(state => (
      `<li class="list-group-item small ${state.id == order.delivery_state_id ? "active text-white" : ""}">${state.name} ${state.id == order.delivery_state_id ? `<i class="uil uil-check ms-1"></i>` : ""}</li>`
    )).join("");

    backdrop.html(`
      <div class="modal d-block" tabindex="-1">
        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content shadow">
            <div class="modal-header">
              <h5 class="modal-title"><i class="uil uil-file-alt"></i> Order Details</h5>
              <button type="button" class="btn-close js-order-detail-close-btn" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="row mb-3">
                <div class="col-md-6">
                  <p class="mb-1 small"><strong>Order ID:</strong> #${order.id}</p>
                  <p class="mb-1 small"><strong>Total:</strong> <span class="fw-bold text-primary fs-6">&#36;${centsToDollars(order.total_cents)} USD</span></p>
                  <p class="mb-1 small"><strong>Order Date:</strong> ${new Date(order.order_date).toLocaleString()}</p>
                  ${order.received_date ? `<p class="mb-1 small"><strong>Received Date:</strong> ${new Date(order.received_date).toLocaleString()}</p>` : ''}
                  <p class="mb-1 small"><strong>Est. Delivery:</strong> ${new Date(order.estimate_received_date).toLocaleDateString()}</p>
                  <p class="mb-1 small"><strong>Shipping Address:</strong> ${formatAddress(order.delivery_address)}</p>
                </div>
                <div class="col-md-6">
                  <p class="mb-1 small"><strong>Delivery Progress:</strong></p>
                  <ul class="list-group list-group-flush small">${orderStateHTML}</ul>
                </div>
              </div>
              <h6>Items:</h6>
              <ul class="list-group list-group-flush">${itemsHTML}</ul>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline-dark btn-sm js-order-detail-close-btn"><i class="uil uil-times"></i> Close</button>
            </div>
          </div>
        </div>
      </div>
    `);

    backdrop.find(".js-order-detail-close-btn").click(() => {closePopup(backdrop)});

  } catch (error) {
    console.error("Error rendering order detail popup:", error);
    backdrop.html(`<div class="modal d-block"><div class="modal-dialog modal-dialog-centered"><div class="modal-content"><div class="modal-body text-center"><p class="text-danger">Error loading order details. Please try again later.</p><button class="btn btn-outline-dark btn-sm js-order-detail-close-btn">Close</button></div></div></div></div>`);
    backdrop.find(".js-order-detail-close-btn").click(() => {closePopup(backdrop)});
  }
}

async function renderConfirmPopup(orderId, title, message, confirmText, actionStateId, successCallback) {
  disableBgScroll();
  // Sanitize title for use in ID: remove HTML, convert to lowercase, replace spaces with hyphens, remove non-alphanumeric except hyphens.
  const popupIdSuffix = title.replace(/<[^>]*>?/gm, '').toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  const popupId = `confirm-${popupIdSuffix}-popup`;

  backdrop.html(`
    <div class="modal d-block" tabindex="-1" id="${popupId}">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content shadow">
          <div class="modal-header">
            <h5 class="modal-title">${title}</h5>
            <button type="button" class="btn-close js-confirm-close-btn" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>${message}</p>
            <div id="${popupId}-msg" class="form-text text-danger"></div>
          </div>
          <div class="modal-footer btn-group-sm">
            <button type="button" class="btn btn-dark js-confirm-close-btn"><i class="uil uil-times"></i> No, take me back</button>
            <button type="button" class="btn btn-outline-dark" id="${popupId}-submit-btn"><i class="uil uil-check"></i> ${confirmText}</button>
          </div>
        </div>
      </div>
    </div>
  `);

  backdrop.find(".js-confirm-close-btn").click(() => {closePopup(backdrop)});

  const submitBtn = backdrop.find(`#${popupId}-submit-btn`);
  submitBtn.click(async () => {
    submitBtn.prop("disabled", true);
    submitBtn.html(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...`);

    const res = await updateOrder(orderId, {delivery_state_id: actionStateId});

    if(res.success) {
      if(successCallback) {
        successCallback();
      } else {
        // Re-trigger the click on the currently active filter button
        // to refresh the list according to the current view.
        const activeFilterButton = $("#order-sections .nav-link.active");
        if (activeFilterButton.length) {
          activeFilterButton.trigger("click");
        } else {
          // Fallback to rendering all if no active filter somehow (should not happen)
          renderOrdersData();
        }
      }
      closePopup(backdrop);
      return;
    }

    backdrop.find(`#${popupId}-msg`).text(`Error: ${res.message || res.error || "An unknown error occurred."}`);
    submitBtn.prop("disabled", false);
    submitBtn.html(`<i class="uil uil-check"></i> ${confirmText}`);
  });

  backdrop.show();
}

function renderConfirmReceivedOrderPopup(orderId) {
  renderConfirmPopup(orderId, "<i class='uil uil-check-square'></i> Confirm Received Order", "Are you sure you want to confirm that you received this order?", "Yes, Confirm Received", ORDER_RECEIVED_ID);
}

function renderConfirmCancelOrderPopup(orderId) {
  renderConfirmPopup(orderId, "<i class='uil uil-ban'></i> Cancel Order", "Are you sure you want to cancel this order? This action cannot be undone.", "Yes, Cancel Order", ORDER_CANCELLED_ID);
}

function renderConfirmReturnOrderPopup(orderId) {
  renderConfirmPopup(orderId, "<i class='uil uil-corner-up-left-alt'></i> Return/Refund Order", "Are you sure you want to request a return/refund for this order?", "Yes, Request Return", ORDER_RETURNED_ID);
}


renderOrderSections();
// Initial load with "All" selected
$("#orders-all").addClass("active");
renderOrdersData();