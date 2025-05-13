import { getFilterOrdersList, getOrder } from "../../models/orders.js";
import {
  DEFAULT_IMG_PATH,
  ORDER_RECEIVED_ID,
  VARIATION_IMG_PATH
} from "../../settings.js";
import { getUser } from "../../models/users.js";
import {
  convertLocalToUtcDatetime,
  convertUtcToLocalDatetime,
  disableBgScroll,
  formatAddress
} from "../../utils.js";
import { closePopup, renderUserDetailPopup } from "./components.js";
import { getVariation } from "../../models/product/variations.js";
import { getProduct } from "../../models/product/products.js";


const backdrop = $("#backdrop");
const resultCount = $("#result-count");
const tbody = $("#tbody");

function renderSearchAnalysisForm() {
  const form = $("#search-analysis-form");
  const searchBtn = form.find("#search-analysis-form-search-btn");
  const clearBtn = form.find("#search-analysis-form-clear-btn");

  clearBtn.click(async () => {
    clearBtn.prop("disabled", true);
    clearBtn.text("Clearing...");

    await renderUsersReceivedOrdersData();

    clearBtn.text("Clear search");
    clearBtn.prop("disabled", false);
  });

  form.submit(async e => {
    e.preventDefault();
    searchBtn.prop("disabled", true);
    searchBtn.text("Searching...");

    const formData = new FormData(form[0]);
    const filteredUsersReceivedOrders = await getUsersReceivedOrdersList(
      formData.get("order_from") || null,
      formData.get("order_to") || null,
      true,
      formData.get("sort_by") || null,
      formData.get("top_customers") ? parseInt(formData.get("top_customers")) : null
    );
    await renderUsersReceivedOrdersData(filteredUsersReceivedOrders);

    searchBtn.text("Search");
    searchBtn.prop("disabled", false);
  });
}

async function renderUsersReceivedOrdersData(list) {
  tbody.html("<tr><td colspan='5' class=\"p-3 text-center\">Loading data...</td></tr>");

  try {
    const usersOrders = list || await getUsersReceivedOrdersList();

    tbody.html(() => {
      let dataHTML = "";

      usersOrders.forEach((userOrders, idx) => {
        const receivedOrdersHTML = userOrders.received_orders.map(order => {
          const delAddress = formatAddress(order.delivery_address);

          return `
            <li class="mb-3 p-3 border rounded bg-light shadow-sm">
              <div class="d-flex justify-content-between"><span><strong>Order ID:</strong></span><span>${order.id}</span></div>
              <div class="d-flex justify-content-between"><span><strong>Total:</strong></span><span>${order.total_cents}&#162;</span></div>
              <div class="d-flex justify-content-between">
                <span><strong>Delivery to:</strong></span>
                <span class="text-truncate" title="${delAddress}" style="max-width: 180px;">${delAddress}</span>
              </div>
              <div class="d-flex justify-content-between"><span><strong>Order at:</strong></span><span>${convertUtcToLocalDatetime(order.order_date)}</span></div>
              <div class="d-flex justify-content-between"><span><strong>Est. received:</strong></span><span>${convertUtcToLocalDatetime(order.estimate_received_date)}</span></div>
              <div class="d-flex justify-content-between"><span><strong>Received:</strong></span><span>${convertUtcToLocalDatetime(order.received_date)}</span></div>
              <div class="d-flex justify-content-between align-items-center mt-2">
                <div><span><strong>Total items:</strong> ${order.items.length}</span></div>
                <button
                  class="js-analysis-view-items btn btn-sm btn-outline-info"
                  data-order-id="${order.id}"
                  title="View items in this order"
                >
                  <i class="uil uil-eye"></i> View items
                </button>
              </div>
            </li>`;
        }).join("");

        dataHTML += `
          <tr class="align-middle">
            <td data-cell="top" class="text-center p-2">${idx+1}</td>
            <td data-cell="user id" class="p-2">
              ${userOrders.user_id}
              <button
                class="js-analysis-view-user btn btn-sm btn-outline-primary ms-2"
                data-user-id="${userOrders.user_id}"
                title="View user details"
              >
                <i class="uil uil-eye"></i>
              </button>
            </td>
            <td data-cell="user email" class="p-2">${userOrders.user_email}</td>
            <td data-cell="orders received" class="p-2">
              <ul class="list-unstyled mb-0">${receivedOrdersHTML}</ul>
            </td>
            <td data-cell="total spent" class="text-end p-2">${userOrders.total_cents}&#162;</td>
          </tr>
        `;
      });

      return dataHTML || "<tr><td colspan='5' class=\"p-3 text-center\">No data found!</td></tr>";
    });

    tbody.find(".js-analysis-view-user").click(e => {
      const userId = $(e.currentTarget).data("user-id");

      console.log(`view user id ${userId}`);
      renderUserDetailPopup(userId, backdrop);
    });

    tbody.find(".js-analysis-view-items").click(e => {
      const orderId = $(e.currentTarget).data("order-id");

      console.log(`view items in order id ${orderId}`);
      renderOrderItemsDetailPopup(orderId);
    });

    resultCount.text(usersOrders.length);

  } catch(error) {
    console.error(`Error: ${error.message}`);
    tbody.html(`<tr><td colspan='5' class="p-3 text-center table-danger">Error loading data: ${error.message}</td></tr>`);
  }
}

async function renderOrderItemsDetailPopup(orderId) {
  disableBgScroll();
  backdrop.html("<div class='d-flex justify-content-center align-items-center' style='height: 100vh;'><div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading order items data...</span></div></div>");
  backdrop.show();

  try {
    const items = (await getOrder(orderId)).items;

    let itemsHTML = "";
    for(const item of items) {
      const variation = await getVariation(item.product_variation_id);
      const product = await getProduct(variation.product_id);
      const variationImg = variation.image_name ? `${VARIATION_IMG_PATH}/${variation.image_name}` : DEFAULT_IMG_PATH;

      const itemDetailsHTML = item.product_instances.map(instance => (
        `<li class="list-group-item d-flex flex-wrap justify-content-between align-items-center small">
          <span>SKU: ${instance.sku}</span>
          <span class="text-muted mx-1">|</span>
          <span>Serial: ${instance.supplier_serial_number}</span>
          <span class="text-muted mx-1">|</span>
          <span>IMEI: ${instance.supplier_imei_number || "N/A"}</span>
        </li>`
      )).join("");

      itemsHTML += `
        <li class="list-group-item p-0">
          <details class="border rounded mb-2">
            <summary class="p-3" style="cursor: pointer;">
              <div class="d-flex align-items-center flex-wrap">
                <img
                  width="80"
                  height="60"
                  src="${variationImg}"
                  alt="Product Image"
                  loading="lazy"
                  class="img-thumbnail me-3 mb-2 mb-md-0"
                >
                <span class="fw-bold me-3">${product.name}</span>
                <span class="me-3 text-muted">${variation.watch_size_mm}mm</span>
                <span class="me-3 text-success fw-bold">${variation.price_cents}&#162;</span>
                <span class="text-info">Qty: ${item.quantity}</span>
              </div>
            </summary>
            <ul class="list-group list-group-flush mt-1">${itemDetailsHTML}</ul>
          </details>
        </li>
      `;
    }

    backdrop.html(`
      <div class="card shadow-lg m-3 m-md-5 mx-auto" style="max-width: 900px;">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h2 class="h5 mb-0">Items in Order ID: ${orderId}</h2>
          <button type="button" class="btn-close js-order-items-detail-close-btn" aria-label="Close"></button>
        </div>
        <div class="card-body">
          <ul class="list-group list-group-flush">${itemsHTML}</ul>
        </div>
        <div class="card-footer text-end">
          <button class="btn btn-dark btn-sm js-order-items-detail-close-btn">Close</button>
        </div>
      </div>
    `);

    backdrop.find(".js-order-items-detail-close-btn").click(() => closePopup(backdrop));

  } catch(error) {
    console.error(`Error: ${error.message}`);
    backdrop.html(`<div class='alert alert-danger m-3'>Error loading order items data: ${error.message}</div>`);
  }
}

async function getUsersReceivedOrdersList(
  orderFrom = null,
  orderTo = null,
  getTop = false, // get by total_cents
  sortBy = null,  // asc, desc
  limit = null,
  offset = null
) {

  const ordersList = await getFilterOrdersList(
    null, null, null, null, null, null,
    ORDER_RECEIVED_ID
  );

  if(orderFrom) orderFrom = new Date(convertLocalToUtcDatetime(orderFrom));
  if(orderTo) orderTo = new Date(convertLocalToUtcDatetime(orderTo));

  const groupOrdersByUsersId = async () => {
    const usersOrdersMap = new Map();

    for(const order of ordersList) {
      if(orderFrom || orderTo) {
        const orderDate = new Date(order.order_date); // UTC datetime
        if((orderFrom && orderDate < orderFrom) || (orderTo && orderDate > orderTo)) continue;
      }

      const userId = order.user_id;
      delete order.user_id;
      delete order.delivery_state_id;

      if (!usersOrdersMap.has(userId)) {
        const user = await getUser(userId);
        usersOrdersMap.set(userId, {
          user_id: userId,
          user_email: user.email,
          total_cents: 0,
          received_orders: []
        });
      }

      const userOrders = usersOrdersMap.get(userId);
      userOrders.total_cents += order.total_cents;
      userOrders.received_orders.push(order);
    }

    return Array.from(usersOrdersMap.values());
  };

  let usersOrdersList = await groupOrdersByUsersId();

  const applySorting = (list, sortBy) => {
    if(sortBy === "asc") {
      list.sort((a, b) => a.total_cents - b.total_cents);
    } else if (sortBy === "desc") {
      list.sort((a, b) => b.total_cents - a.total_cents);
    }
  };

  const start = offset || 0;
  const end = limit ? limit + start : usersOrdersList.length;

  if(getTop) { // Get top -> sort by desc -> slice -> order by
    usersOrdersList.sort((a, b) => b.total_cents - a.total_cents);
    usersOrdersList = usersOrdersList.slice(start, end);
    applySorting(usersOrdersList, sortBy);
  } else {
    applySorting(usersOrdersList, sortBy);
    usersOrdersList = usersOrdersList.slice(start, end);
  }

  return usersOrdersList;
}

renderUsersReceivedOrdersData();
renderSearchAnalysisForm();
