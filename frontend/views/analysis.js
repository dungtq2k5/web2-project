import { getFilterOrdersList, getOrder } from "../controllers/orders.js";
import {
  DEFAULT_IMG_PATH,
  ORDER_RECEIVED_ID,
  VARIATION_IMG_PATH
} from "../settings.js";
import { getUser } from "../controllers/users.js";
import {
  convertLocalToUtcDatetime,
  convertUtcToLocalDatetime,
  disableBgScroll,
  formatAddress
} from "../utils.js";
import { closePopup, renderUserDetailPopup } from "./components.js";
import { getVariation } from "../controllers/product/variations.js";
import { getProduct } from "../controllers/product/products.js";


const backdrop = $("#backdrop");
const resultCount = $("#result-count");
const tbody = $("#tbody");

function renderSearchAnalysisForm() {
  const form = $("#search-analysis-form");
  const searchBtn = form.find("#search-analysis-form-search-btn");
  const clearBtn = form.find("#search-analysis-form-clear-btn");

  clearBtn.click(async () => {
    clearBtn.prop("disabled", true);
    clearBtn.text("clearing...");

    await renderUsersReceivedOrdersData();

    clearBtn.text("clear search");
    clearBtn.prop("disabled", false);
  });

  form.submit(async e => {
    e.preventDefault();
    searchBtn.prop("disabled", true);
    searchBtn.text("searching...");

    const formData = new FormData(form[0]);
    const filteredUsersReceivedOrders = await getUsersReceivedOrdersList(
      formData.get("order_from") || null,
      formData.get("order_to") || null,
      true,
      formData.get("sort_by") || null,
      formData.get("top_customers") ? parseInt(formData.get("top_customers")) : null
    );
    await renderUsersReceivedOrdersData(filteredUsersReceivedOrders);

    searchBtn.text("search");
    searchBtn.prop("disabled", false);
  });
}

async function renderUsersReceivedOrdersData(list) {
  tbody.html("<tr><td colspan='5'>Loading data...</td></tr>");

  try {
    const usersOrders = list || await getUsersReceivedOrdersList();

    tbody.html(() => {
      let dataHTML;

      usersOrders.forEach((userOrders, idx) => {

        const receivedOrdersHTML = userOrders.received_orders.map(order => {
          const delAddress = formatAddress(order.delivery_address);

          return `
            <li class="content__order">
              <div>
                <h4>Order id:</h4>
                <p>${order.id}</p>
              </div>
              <div>
                <h4>Total:</h4>
                <p>${order.total_cents}&#162;</p>
              </div>
              <div>
                <h4>Delivery to:</h4>
                <p class="text-limit--g" title="${delAddress}">${delAddress}</p>
              </div>
              <div>
                <h4>Order at:</h4>
                <p>${convertUtcToLocalDatetime(order.order_date)}</p>
              </div>
              <div>
                <h4>Estimate received date:</h4>
                <p>${convertUtcToLocalDatetime(order.estimate_received_date)}</p>
              </div>
              <div>
                <h4>Received date:</h4>
                <p>${convertUtcToLocalDatetime(order.received_date)}</p>
              </div>
              <div>
                <h4>Total items:</h4>
                <p>${order.items.length}</p>
                <button
                  class="js-analysis-view-items"
                  data-order-id="${order.id}"
                >view items</button>
              </div>
            </li>`;
        }).join("");

        dataHTML += `
          <tr>
            <td data-cell="top" class="content__td--g">${idx+1}</td>
            <td data-cell="user id" class="content__td--g">
              ${userOrders.user_id}
              <button
                class="js-analysis-view-user"
                data-user-id="${userOrders.user_id}"
              >view user</button>
            </td>
            <td data-cell="user email" class="content__td--g">${userOrders.user_email}</td>
            <td data-cell="orders received" class="content__td--g">
              <ul class="content__orders">${receivedOrdersHTML}</ul>
            </td>
            <td data-cell="total spent" class="content__td--g">${userOrders.total_cents}&#162;</td>
          </tr>
        `;
      });

      return dataHTML || "<tr><td colspan='5'>No data found!</td></tr>";
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
    tbody.html(`<tr><td colspan='5'>Error loading data: ${error.message}</td></tr>`);
  }
}

async function renderOrderItemsDetailPopup(orderId) {
  disableBgScroll();
  backdrop.html("<p>Loading order items data...</p>");
  backdrop.show();

  try {
    const items = (await getOrder(orderId)).items;

    let itemsHTML = "";
    for(const item of items) {
      const variation = await getVariation(item.product_variation_id);
      const product = await getProduct(variation.product_id);
      const variationImg = variation.image_name ? `${VARIATION_IMG_PATH}/${variation.image_name}` : DEFAULT_IMG_PATH;

      const itemDetailsHTML = item.product_instances.map(instance => (
        `<li>
          <p>sku: ${instance.sku}</p>
          <i class="uil uil-times"></i>
          <p>serial: ${instance.supplier_serial_number}</p>
          <i class="uil uil-times"></i>
          <p>imei: ${instance.supplier_imei_number || "none"}</p>
        </li>`
      )).join("");

      itemsHTML += `
        <li class="item">
          <details>
            <summary class="item__general" title="click to view details">
              <img
                width="100"
                height="75"
                src="${variationImg}"
                alt="smartwatch"
                loading="lazy"
              >
              <i class="uil uil-times"></i>
              <p>${product.name}</p>
              <i class="uil uil-times"></i>
              <p>${variation.watch_size_mm}mm</p>
              <i class="uil uil-times"></i>
              <p>${variation.price_cents}&#162;</p>
              <i class="uil uil-times"></i>
              <p>${item.quantity}</p>
            </summary>

            <ul class="item_details">${itemDetailsHTML}</ul>
          </details>
        </li>
      `;
    }

    backdrop.html(`
      <div class="form--g">
        <button class="form__close--g js-order-items-detail-close-btn">
          <i class="uil uil-times"></i>
        </button>
        <h2 class="form__title--g">Items in order id ${orderId}</h2>

        <ul class="items">${itemsHTML}</ul>

        <button class=" js-order-items-detail-close-btn">close</button>
      </div>
    `);

    backdrop.find(".js-order-items-detail-close-btn").click(() => closePopup(backdrop));

  } catch(error) {
    console.error(`Error: ${error.message}`);
    backdrop.html(`<p>Error loading order items data: ${error.message}</p>`);
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
  const ordersList = await getFilterOrdersList(null, null, ORDER_RECEIVED_ID);

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

/*
{
  "id": 1,
  "user_id": 20,
  "total_cents": 5443,
  "delivery_state_id": 8,
  "order_date": "2024-10-26 23:06:35",
  "estimate_received_date": "2024-10-31 23:06:35",
  "received_date": "2025-04-23 12:23:26",
  "items": [
    {
      "product_variation_id": 10,
      "quantity": 1,
      "total_cents": "44",
      "product_instances": [
        {
          "sku": "or-vdo-ba-83-bae443-dtp-8670224854614",
          "goods_receipt_note_id": 3
        }
      ]
    }
  ],
  "delivery_address": {
    "id": 31,
    "name": "alexander harris",
    "street": "5830 lussier court",
    "apartment_number": "1505",
    "ward": "brooklyn",
    "district": "south side",
    "city_province": "san diego",
    "phone_number": "6191455417"
  }
},
 */