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

  // TODO Effect to know which section is selected

  orderSections.find("#orders-all").click(() => {
    console.log("All orders");
    renderOrdersData();
  });

  orderSections.find("#orders-to-ship").click(async () => {
    console.log("Orders to ship");
    ordersContainer.html("<p>Loading orders...</p>");

    const ordersFiltered = (await getOrdersList()).filter(
      order => order.delivery_state_id < ORDER_SHIPPED_ID
    );
    renderOrdersData(ordersFiltered);
  });

  orderSections.find("#orders-to-receive").click(async () => {
    console.log("Orders to receive");
    ordersContainer.html("<p>Loading orders...</p>");

    const ordersFiltered = (await getOrdersList()).filter(
      order => order.delivery_state_id >= ORDER_SHIPPED_ID && order.delivery_state_id <= ORDER_DELIVERED_ID
    );
    renderOrdersData(ordersFiltered);
  });

  orderSections.find("#orders-completed").click(async () => {
    console.log("Orders completed");
    ordersContainer.html("<p>Loading orders...</p>");

    const ordersFiltered = (await getOrdersList()).filter(
      order => order.delivery_state_id == ORDER_RECEIVED_ID
    );
    renderOrdersData(ordersFiltered);
  });

  orderSections.find("#orders-cancelled").click(async () => {
    console.log("Orders cancelled");
    ordersContainer.html("<p>Loading orders...</p>");

    const ordersFiltered = (await getOrdersList()).filter(
      order => order.delivery_state_id == ORDER_CANCELLED_ID
    );
    renderOrdersData(ordersFiltered);
  });

  orderSections.find("#orders-returned").click(async () => {
    console.log("Orders returned");
    ordersContainer.html("<p>Loading orders...</p>");

    const ordersFiltered = (await getOrdersList()).filter(
      order => order.delivery_state_id == ORDER_RETURNED_ID
    );
    renderOrdersData(ordersFiltered);
  });
}

async function renderOrdersData(list) {
  ordersContainer.html("<p>Loading orders...</p>");

  try {
    const orders = list || await sortOrdersListByDate();

    let ordersHTML = "";

    for(const order of orders) {
      let itemsHTML = "";
      for(const item of order.items) {
        const variation = await getVariation(item.product_variation_id);
        const variationImg = variation && variation.image_name
          ? `${VARIATION_IMG_PATH}/${variation.image_name}`
          : DEFAULT_IMG_PATH;

        const product = variation ? await getProduct(variation.product_id) : null;

        itemsHTML += `
          <li style="${(!product || !variation) ? "opacity: 0.5;" : ""}">
            <img src="${variationImg}" alt="Smartwatch product" />
            <div>
              <p>${product ? product.name : "N/A"}</p>
              <p>Variation: ${variation ? variation.watch_size_mm : "N/A"}</p>
              <p>Quantity: ${item.quantity}</p>
            </div>
            <div>&#36;${centsToDollars(item.total_cents)} USD</div>
          </li>
        `;
      }

      const deliveryState = await getState(order.delivery_state_id);
      const canReturnConfirmOrder = deliveryState.id == ORDER_DELIVERED_ID;
      const canCancelOrder = deliveryState.id < ORDER_SHIPPED_ID;

      ordersHTML += `
        <li data-order-id="${order.id}">
          <div>${deliveryState.name}</div>
          <ul>${itemsHTML}</ul>
          <div>
            <p>Order total: &#36;${centsToDollars(order.total_cents)} USD</p>
            <button class="js-view-detail-order">View detail order</button>
          </div>
          ${
            canReturnConfirmOrder
              ? `<div>
                  <button class="js-confirm-order-btn">Confirm received</button>
                  <button class="js-return-order-btn">Return/Refund order</button>
                </div>`
              : canCancelOrder
                ? `<div>
                    <button class="js-cancel-order-btn">Cancel order</button>
                  </div>`
                : ""
          }
        </li>
      `;
    }

    ordersContainer.html(ordersHTML || `<p>No orders found, <a href="./index?page=home">Go shopping now</a></p>`);

    ordersContainer.find(".js-view-detail-order").click(e => {
      const orderId = $(e.target).closest("li").data("order-id");
      console.log("View detail order:", orderId);

      renderOrderDetailPopup(orderId);
    });

    ordersContainer.find(".js-return-order-btn").click(e => {
      const orderId = $(e.target).closest("li").data("order-id");
      console.log("Return order:", orderId);

      renderConfirmReturnOrderPopup(orderId);
    });

    ordersContainer.find(".js-confirm-order-btn").click(e => {
      const orderId = $(e.target).closest("li").data("order-id");
      console.log("Confirm received order:", orderId);

      renderConfirmReceivedOrderPopup(orderId);
    });

    ordersContainer.find(".js-cancel-order-btn").click(e => {
      const orderId = $(e.target).closest("li").data("order-id");
      console.log("Cancel order:", orderId);

      renderConfirmCancelOrderPopup(orderId);
    });

  } catch (error) {
    console.error("Error rendering orders data:", error);
    ordersContainer.html("<p>Error loading orders. Please try again later.</p>");
  }
}

async function renderOrderDetailPopup(orderId) {
  disableBgScroll();
  backdrop.html("<p>Loading order details...</p>");
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
        <li style="${(!product || !variation) ? "opacity: 0.5;" : ""}">
          <img src="${variationImg}" alt="Smartwatch product" />
          <div>
            <p>${product ? product.name : ""}</p>
            <p>Variation: ${variation ? variation.watch_size_mm : ""}</p>
            <p>Quantity: ${item.quantity}</p>
          </div>
          <div>&#36;${centsToDollars(item.total_cents)} USD</div>
        </li>
      `;
    }

    const deliveryStates = await getStatesList();

    const orderStateHTML = deliveryStates.map(state => (
      `<li>${state.name} ${state.id == order.delivery_state_id ? "(here)" : ""}</li>`
    )).join("");

    backdrop.html(`
      <div>
        <h2>Order details</h2>
        <button class="js-order-detail-close-btn">
          <i class="uil uil-multiply"></i>
        </button>
        <div>
          <p>Order ID: ${order.id}</p>
          <p>Total: &#36;${centsToDollars(order.total_cents)} USD</p>
          <p>Order at: ${order.order_date}</p>
          ${order.received_date ? `<p>Received at: ${order.received_date}</p>` : ''}
          <p>Estimate received at: ${order.estimate_received_date}</p>
          <p>Delivery to: ${formatAddress(order.delivery_address)}</p>
          <div>
            <p>Delivery state:</p>
            <ul>${orderStateHTML}</ul>
          </div>
        </div>

        <div>
          <h3>Items</h3>
          <ul>${itemsHTML}</ul>
        </div>

        <button class="js-order-detail-close-btn">Close</button>
      </div>
    `);

    backdrop.find(".js-order-detail-close-btn").click(() => {closePopup(backdrop)});

  } catch (error) {
    console.error("Error rendering order detail popup:", error);
    backdrop.html("<p>Error loading order details. Please try again later.</p>");
  }
}

async function renderConfirmReceivedOrderPopup(orderId) {
  disableBgScroll();

  backdrop.html(`
    <div>
      <button class="js-confirm-received-order-close-btn">
        <i class="uil uil-multiply"></i>
      </button>
      <h2>Confirm received order</h2>
      <p>Are you sure you want to confirm that you received the order?</p>
      <div>
        <button class="js-confirm-received-order-close-btn">No, take me back</button>
        <button id="confirm-received-order-submit-btn">Yes, confirm received</button>
      </div>
      <span id="confirm-received-order-msg"></span>
    </div>
  `);

  backdrop.find(".js-confirm-received-order-close-btn").click(() => {closePopup(backdrop)});

  const submitBtn = backdrop.find("#confirm-received-order-submit-btn");
  submitBtn.click(async () => {
    submitBtn.prop("disabled", true);
    submitBtn.text("Confirming...");

    const res = await updateOrder(orderId, {delivery_state_id: ORDER_RECEIVED_ID});

    if(res.success) {
      renderOrdersData(); // Re-render
      closePopup(backdrop);
      return;
    }

    backdrop.find("#confirm-received-order-msg").text(`Error: ${res.error}`);
    submitBtn.prop("disabled", false);
    submitBtn.text("Yes, confirm received");
  });

  backdrop.show();
}

async function renderConfirmCancelOrderPopup(orderId) {
  disableBgScroll();

  backdrop.html(`
    <div>
      <button class="js-confirm-cancel-order-close-btn">
        <i class="uil uil-multiply"></i>
      </button>
      <h2>Cancel order</h2>
      <p>Are you sure you want to cancel the order?</p>
      <div>
        <button class="js-confirm-cancel-order-close-btn">No, take me back</button>
        <button id="confirm-cancel-order-submit-btn">Yes, confirm cancel</button>
      </div>
      <span id="confirm-cancel-order-msg"></span>
    </div>
  `);

  backdrop.find(".js-confirm-cancel-order-close-btn").click(() => {closePopup(backdrop)});

  const submitBtn = backdrop.find("#confirm-cancel-order-submit-btn");
  submitBtn.click(async () => {
    submitBtn.prop("disabled", true);
    submitBtn.text("Cancelling...");

    const res = await updateOrder(orderId, {delivery_state_id: ORDER_CANCELLED_ID});

    if(res.success) {
      renderOrdersData(); // Re-render
      closePopup(backdrop);
      return;
    }

    backdrop.find("#confirm-cancel-order-msg").text(`Error: ${res.error}`);
    submitBtn.prop("disabled", false);
    submitBtn.text("Yes, confirm cancel");
  });

  backdrop.show();
}

async function renderConfirmReturnOrderPopup(orderId) {
  disableBgScroll();

  backdrop.html(`
    <div>
      <button class="js-confirm-return-order-close-btn">
        <i class="uil uil-multiply"></i>
      </button>
      <h2>Return order</h2>
      <p>Are you sure you want to return the order?</p>
      <div>
        <button class="js-confirm-return-order-close-btn">No, take me back</button>
        <button id="confirm-return-order-submit-btn">Yes, confirm return</button>
      </div>
      <span id="confirm-return-order-msg"></span>
    </div>
  `);

  backdrop.find(".js-confirm-return-order-close-btn").click(() => {closePopup(backdrop)});

  const submitBtn = backdrop.find("#confirm-return-order-submit-btn");
  submitBtn.click(async () => {
    submitBtn.prop("disabled", true);
    submitBtn.text("Returning...");

    const res = await updateOrder(orderId, {delivery_state_id: ORDER_RETURNED_ID});

    if(res.success) {
      renderOrdersData(); // Re-render
      closePopup(backdrop);
      return;
    }

    backdrop.find("#confirm-return-order-msg").text(`Error: ${res.error}`);
    submitBtn.prop("disabled", false);
    submitBtn.text("Yes, confirm return");
  });

  backdrop.show();
}

renderOrderSections();
renderOrdersData();