import { getOrder, getOrdersList } from "../controllers/orders.js";
import { getProduct } from "../controllers/product/products.js";
import { getVariation } from "../controllers/product/variations.js";
import { getState, getStatesList } from "../controllers/order-delivery-states.js";
import {
  getVNAddressesList,
  getVNDistrictsList,
  getVNWardsList
} from "../controllers/vn-addresses.js";
import {
  closeForm,
  renderProductVariationDetailPopup,
  renderUserDetailPopup
} from "./components.js";
import { disableBgScroll } from "../utils.js";


const crudOrderMsg = $("#crud-order-msg");
const backdrop = $("#backdrop");

const resultCount = $("#result-count");

async function renderOrdersData(ordersList=null) {
  const tbody = $("#tbody");
  tbody.html("<tr><td colspan='10'>Loading data...</td></tr>");

  try {
    const orders = ordersList || await getOrdersList(5);

    (async () => {
      let dataHTML;
      for(const [idx, order] of orders.entries()) {
        const delState = await getState(order.delivery_state_id);
        let itemsHTML = ``;
        for(const [idx, item] of order.items.entries()) {
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
          <tr class="content__tr">
            <td data-cell="n.o" class="content__td--g" title="order number ${idx+1}">${idx+1}</td>
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
            <td data-cell="delivery to" class="content__td--g">${order.delivery_address}</td>
            <td data-cell="delivery state" class="content__td--g">${delState.name}</td>
            <td data-cell="ordered date" class="content__td--g">${order.order_date}</td>
            <td data-cell="estimate received date" class="content__td--g">${order.estimate_received_date}</td>
            <td data-cell="received date" class="content__td--g">${order.received_date}</td>
            <td data-cell="actions" class="content__td--g">
              <button
                class="js-update-btn"
                data-order-id="${order.id}"
              >update</button>
            </td>
          </tr>
        `;

        tbody.html(dataHTML || "<tr><td colspan='10'>No data found!</td></tr>");
      }

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
        console.log(`update order id ${orderId}`);
        renderUpdateOrderForm(orderId);
      });
    })(); //IIFE

  } catch(error) {
    console.error(`Error: ${error.message}`);
    tbody.html(`<tr><td colspan='10'>Error loading data: ${error.message}</td></tr>`);
  }
}

async function renderUpdateOrderForm(orderId) {
  disableBgScroll();
  backdrop.html("<p>Loading update order form...");
  backdrop.show();

  try {
    const order = await getOrder(orderId);
    const delStates = await getStatesList();
    let currCityCode = undefined;
    let currDistrictCode = undefined;


    const citiesHTML = (cityCode=undefined) => {
      return getVNAddressesList().map(city => {
        if(!cityCode && order.delivery_address.includes(city.name.toLowerCase())) {
          currCityCode = cityCode = city.code;
        }

        return `
          <option
            value="${city.code}"
            ${city.code === cityCode || "selected"}
          >${city.name}</option>
        `;
      }).join("");
    }

    const districtsHTML = (cityCode=currCityCode, districtCode=undefined) => {
      return getVNDistrictsList(cityCode).map(district => {
        if(!districtCode && order.delivery_address.includes(district.name.toLowerCase())) {
          currDistrictCode = districtCode = district.code;
        }

        return `
          <option
            value="${district.code}"
            ${district.code === districtCode || "selected"}
          >${district.name}</option>
        `;
      }).join("");
    }

    const wardsHTML = (cityCode=currCityCode, districtCode=currDistrictCode) => {
      return getVNWardsList(cityCode, districtCode).map(ward => `
        <option
          value="${ward.code}"
          ${order.delivery_address.includes(ward.name.toLowerCase()) || "selected"}
        >${ward.name}</option>
      `).join("");
    }

    backdrop.html(() => {
      const delStatesHTML = delStates.map(state => `
        <option
          value=${state.id}
          ${state.id === order.delivery_state_id || "selected"}
        >${state.name}</option>
      `).join("");

      return `
        <form class="form--g" id="update-order-form">
          <button type="button" class="form__close--g js-update-order-form-close-btn"><i class="uil uil-times"></i></button>
          <h2 class="form__title--g">Update order id ${order.id} of user id ${order.user_id}</h2>

          <div>
            <div class="form__field--g">
              <label for="city">City/Province</label>
              <select id="city" class="form__select--g">${citiesHTML()}</select>
            </div>

            <div class="form__field--g">
              <label for="district">District</label>
              <select id="district" class="form__select--g">${districtsHTML(currCityCode)}</select>
            </div>

            <div class="form__field--g">
              <label for="ward">Ward</label>
              <select id="ward" class="form__select--g">${wardsHTML(currCityCode, currDistrictCode)}</select>
            </div>

            <div class="form__field--g">
              <label for="apartment">Apartment/Building</label>
              <input
              type="text"
              id="apartment"
              placeholder=""
              value=""
              class="form__input--g"
              >
            </div>
            <span id="apartment-msg"></span>

            <div class="form__field--g">
              <label for="street">Street</label>
              <input
              type="text"
              id="street"
              placeholder=""
              value=""
              class="form__input--g"
              >
            </div>
            <span id="delivery-to-msg"></span>
          </div>

          <div>
            <div class="form__field--g">
              <label for="est-received-date">Estimate received date</label>
              <input
                type="datetime-local"
                id="est-received-date"
                value="${order.estimate_received_date}"
                class="form__input--g"
              >
            </div>
            <span id="est-received-date-msg"></span>
          </div>

          <div>
            <div class="form__field--g">
              <label for="received-date">Received date</label>
              <input
                type="datetime-local"
                id="received-date"
                value="${order.estimate_received_date}"
                class="form__input--g"
              >
            </div>
            <span id="received-date-msg"></span>
          </div>

          <div>
            <div class="form__field--g">
              <label for="delivery-state">Delivery state</label>
              <select id="delivery-state" class="form__select--g">${delStatesHTML}</select>
            </div>
          </div>

          <div>
            <button id="update-order-form-submit-btn">update</button>
            <button type="button" class="js-update-order-form-close-btn">cancel</button>
          </div>

          <span id="submit-msg"></span>
        </form>
      `;
    });

    const form = $("#update-order-form");

    form.find(".js-update-order-form-close-btn").click(() => closeForm(backdrop));

    const citySelect = form.find("#city");
    const districtSelect = form.find("#district");
    const wardSelect = form.find("#ward");
    citySelect.change(() => {
      currCityCode = citySelect.value;
      currDistrictCode = 1; //default

      districtSelect.html(districtsHTML(currCityCode, currDistrictCode));
      wardSelect.html(wardsHTML(currCityCode, currDistrictCode));
    });


    //TODO update form
    const submitBtn = form.find("#update-order-form-submit-btn");
    submitBtn.click(e => {
      e.preventDefault();
      submitBtn.prop("disabled", true);
      submitBtn.text("updating...");

      const validateForm = async () => {
        let allValid = true;



      }

    });

  } catch(error) {
    console.error(`Error: ${error.message}`);
    backdrop.html(`<p>Error loading data: ${error.message}</p>`);
  }
}

renderOrdersData();
