import { getSigninUser } from "../../models/auth.js"
import { createAddress, getAddressesList } from "../../models/addresses.js";
import {
  disableBgScroll,
  filterTextInputsInFormData,
  isValidVNPhoneNumber,
  formatAddress,
  centsToDollars
} from "../../utils.js";
import {
  getVNAddressesList,
  getCityProvince,
  getDistrictsOfCity,
  getWardsOfDistrict,
  getDistrict,
  getWard
} from "../../models/vn-addresses.js";
import { closeForm } from "./components.js";
import { getAvailableCartsList, deleteCart } from "../../models/carts.js";
import { getVariation } from "../../models/product/variations.js";
import { getProduct } from "../../models/product/products.js";
import { DEFAULT_IMG_PATH, VARIATION_IMG_PATH } from "../../settings.js";
import { createOrder } from "../../models/orders.js";


const user = getSigninUser();

const backdrop = $("#backdrop");
const checkoutForm = $("#checkout-form");
const selectAddress = checkoutForm.find("#checkout-address");
const checkoutMethod = checkoutForm.find("#checkout-method");
const checkoutCardForm = checkoutForm.find("#checkout-card-form");
const checkoutBtn = checkoutForm.find("#checkout-submit-btn");


async function renderAddressOptions() {
  selectAddress.html("<option>Loading addresses...</option>");

  const addressOptionsHTML = (await getAddressesList()).map(address => (
    `<option value="${address.id}" ${address.is_default ? "selected" : ""}>
      ${formatAddress(address)}
    </option>`
  )).join("");

  selectAddress.html(addressOptionsHTML || "<option>No address please add one</option>");
}

async function renderCheckoutForm() {
  renderAddressOptions();

  checkoutMethod.change(() => {
    if(checkoutMethod.val() != 1) {
      checkoutCardForm.show();
      return;
    }

    checkoutCardForm.hide();
  });

  checkoutForm.submit(async e => {
    console.log("Checkout form submitted");
    e.preventDefault();

    checkoutBtn.prop("disabled", true);
    checkoutBtn.text("Placing order...");

    const formData = filterTextInputsInFormData(new FormData(checkoutForm[0]));
    const addressMsg = checkoutForm.find("#address-msg");

    const validateForm = () => {
      let allValid = true;

      if(!formData.get("delivery_address_id")) {
        addressMsg.text("* required");
        allValid = false;
      } else {
        addressMsg.text("");
      }

      if(checkoutMethod.val() != 1) {
        const cardNumberMsg = checkoutCardForm.find("#card-number-msg");
        const cardExpiryMsg = checkoutCardForm.find("#card-expiry-date-msg");
        const cardCvcMsg = checkoutCardForm.find("#card-cvc-msg");
        const cardNameMsg = checkoutCardForm.find("#card-holder-name-msg");

        if(!formData.get("card_number")) {
          cardNumberMsg.text("* required");
          allValid = false;
        } else {
          cardNumberMsg.text("");
        }

        if(!formData.get("card_expiry_date")) {
          cardExpiryMsg.text("* required");
          allValid = false;
        } else {
          cardExpiryMsg.text("");
        }

        if(!formData.get("card_cvc")) {
          cardCvcMsg.text("* required");
          allValid = false;
        } else {
          cardCvcMsg.text("");
        }

        if(!formData.get("card_holder_name")) {
          cardNameMsg.text("* required");
          allValid = false;
        } else {
          cardNameMsg.text("");
        }
      }

      return allValid;
    }

    if(validateForm()) {
      if(checkoutMethod.val() == 1) {
        formData.delete("card_number");
        formData.delete("card_expiry_date");
        formData.delete("card_cvc");
        formData.delete("card_holder_name");
      }
      const items = (await getAvailableCartsList()).map(item => {
        const { user_id, ...rest } = item;
        return rest;
      });

      const createOrderRes = await createOrder({
        user_id: user.id,
        ...Object.fromEntries(formData),
        items
      });

      if(createOrderRes.success) {
        const deleteCartsRes = await deleteCart(user.id);
        if(!deleteCartsRes.success) {
          console.error("Error deleting carts:", deleteCartsRes.message);
        }
        window.location.href = "./index.php?page=orders";
        return;
      }

      checkoutForm.find("#checkout-msg").text(createOrderRes.message);
    }

    checkoutBtn.prop("disabled", false);
    checkoutBtn.text("Place order");
  });
}

function renderCreateAddressForm() {
  disableBgScroll();
  backdrop.html("<p>Loading create address form...</p>");
  backdrop.show();

  const genCityOptionsHTML = (cityList, cityCode) => {
    return cityList.map(city => (
      `<option value="${city.code}" ${city.code == cityCode ? "selected" : ""}>${city.name}</option>`
    )).join("");
  }

  const genDistrictOptionsHTML = (districtList, districtCode) => {
    return districtList.map(district => (
      `<option value="${district.code}" ${district.code == districtCode ? "selected" : ""}>${district.name}</option>`
    )).join("");
  }

  const genWardOptionsHTML = (wardList, wardCode) => {
    return wardList.map(ward => (
      `<option value="${ward.code}" ${ward.code == wardCode ? "selected" : ""}>${ward.name}</option>`
    )).join("");
  }

  try {
    let currCityCode = 1;

    const currCity = getCityProvince(currCityCode);

    let currDistrictCode = currCity.districts[0].code;
    let currWardCode = currCity.districts[0].wards[0].code;

    backdrop.html(`
      <form id="create-address-form">
        <h2>New address</h2>
        <button type="button" class="js-create-address-close-btn">
          <i class="uil uil-multiply"></i>
        </button>

        <div>
          <label for="full-name">Full name</label>
          <input
            type="text"
            id="full-name"
            placeholder="${user.full_name}"
            value="${user.full_name}"
            name="name"
          />
          <span id="full-name-msg"></span>
        </div>

        <div>
          <label for="phone-number">Phone number</label>
          <input
            type="tel"
            id="phone-number"
            placeholder="${user.phone_number}"
            value="${user.phone_number}"
            name="phone_number"
          />
          <span id="phone-number-msg"></span>
        </div>

        <div>
          <label for="city-province">City/Province</label>
          <select id="city-province" name="city_province">
            ${genCityOptionsHTML(getVNAddressesList(), currCityCode)}
          </select>
        </div>

        <div>
          <label for="district">District</label>
          <select id="district" name="district">
            ${genDistrictOptionsHTML(currCity.districts, currDistrictCode)}
          </select>
        </div>

        <div>
          <label for="ward">Ward</label>
          <select id="ward" name="ward">
            ${genWardOptionsHTML(currCity.districts[0].wards, currWardCode)}
          </select>
        </div>

        <div>
          <label for="street">Street</label>
          <input type="text" id="street" name="street" />
          <span id="street-msg"></span>
        </div>

        <div>
          <label for="apartment-number">Apartment number</label>
          <input type="text" id="apartment-number" name="apartment_number" />
          <span id="apartment-number-msg"></span>
        </div>

        <div>
          <input type="checkbox" id="is-default" name="is_default" checked />
          <label for="is-default">Set as default address</label>
        </div>

        <div>
          <button type="button" class="js-create-address-close-btn">Cancel</button>
          <button type="submit" id="create-address-submit-btn">Add address</button>
        </div>

        <span id="create-address-msg"></span>
      </form>
    `);

    const form = backdrop.find("#create-address-form");

    const citySelect = form.find("#city-province");
    const districtSelect = form.find("#district");
    const wardSelect = form.find("#ward");

    form.find(".js-create-address-close-btn").click(() => closeForm(backdrop));

    citySelect.change(() => {
      console.log("City changed");
      currCityCode = citySelect.val();

      const districts = getDistrictsOfCity(currCityCode);

      currDistrictCode = districts[0].code;
      currWardCode = districts[0].wards[0].code;

      districtSelect.html(
        genDistrictOptionsHTML(getDistrictsOfCity(currCityCode), currDistrictCode)
      );

      wardSelect.html(
        genWardOptionsHTML(getWardsOfDistrict(currCityCode, currDistrictCode), currWardCode)
      );
    });

    districtSelect.change(() => {
      console.log("District changed");
      currDistrictCode = districtSelect.val();

      const district = getDistrict(currCityCode, currDistrictCode);

      currWardCode = district.wards[0].code;

      wardSelect.html(
        genWardOptionsHTML(getWardsOfDistrict(currCityCode, currDistrictCode), currWardCode)
      );
    });

    wardSelect.change(() => {
      currWardCode = wardSelect.val();
    });

    form.submit(async e => {
      e.preventDefault();

      const submitBtn = form.find("#create-address-submit-btn");
      submitBtn.prop("disabled", true);
      submitBtn.text("Adding address...");

      const formData = filterTextInputsInFormData(new FormData(form[0]));

      const fullNameMsg = form.find("#full-name-msg");
      const phoneNumberMsg = form.find("#phone-number-msg");
      const streetMsg = form.find("#street-msg");
      const apartmentNumberMsg = form.find("#apartment-number-msg");

      const validateForm = () => {
        let allValid = true;

        if(!formData.get("name")) {
          fullNameMsg.text("* required");
          allValid = false;
        } else {
          fullNameMsg.text("");
        }

        if(!formData.get("phone_number")) {
          phoneNumberMsg.text("* required");
          allValid = false;
        } else if(!isValidVNPhoneNumber(formData.get("phone_number"))) {
          phoneNumberMsg.text("* invalid phone number");
          allValid = false;
        } else {
          phoneNumberMsg.text("");
        }

        if(!formData.get("street")) {
          streetMsg.text("* required");
          allValid = false;
        } else {
          streetMsg.text("");
        }

        if(!formData.get("apartment_number")) {
          apartmentNumberMsg.text("* required");
          allValid = false;
        } else {
          apartmentNumberMsg.text("");
        }

        return allValid;
      }

      if(validateForm()) {
        const res = await createAddress({
          ...Object.fromEntries(formData),
          city_province: getCityProvince(currCityCode).name,
          district: getDistrict(currCityCode, currDistrictCode).name,
          ward: getWard(currCityCode, currDistrictCode, currWardCode).name,
          is_default: formData.get("is_default") === "on"
        });

        if(res.success) {
          renderAddressOptions();
          closeForm(backdrop);
          return;
        }

        form.find("#create-address-msg").text(res.message);
      }

      submitBtn.prop("disabled", false);
      submitBtn.text("Add address");
    });

  } catch (error) {
    console.error("Error rendering create address form:", error);
    backdrop.html(`Error: ${error.message}`);
  }
}

async function renderOrderSummary() {
  const orderSummary = $("#order-summary");
  orderSummary.html("<p>Loading order summary...</p>");

  try {
    const carts = await getAvailableCartsList();

    if(carts.length === 0) {
      orderSummary.html("<p>No items to checkout</p>");
      checkoutBtn.prop("disabled", true);
      return;
    }

    let itemsHTML = "";
    let totalCents = 0;

    for(const cart of carts) {
      const variation = await getVariation(cart.product_variation_id);
      const product = await getProduct(variation.product_id);

      const variationImg = variation.image_name
        ? `${VARIATION_IMG_PATH}/${variation.image_name}`
        : DEFAULT_IMG_PATH;

      totalCents += variation.price_cents * cart.quantity;

      itemsHTML += `
        <li>
          <img src="${variationImg}" alt="Smartwatch product" />
          <div>
            <p>${product.name} - ${variation.watch_size_mm}MM</p>
            <p>${product.model}</p>
            <p>&#36;<span>${centsToDollars(variation.price_cents)}</span> USD</p>
            <p>Quantity: ${cart.quantity}</p>
          </div>
        </li>
      `;
    }

    const total = centsToDollars(totalCents);

    orderSummary.html(`
      <h3>Order summary</h3>

      <div>
        <div>
          <p>Subtotal</p>
          <p>&#36;<span>${total}</span> USD</p>
        </div>
        <div>
          <p>Shipping</p>
          <p>&#36;<span>0</span> USD</p>
        </div>
        <div>
          <p>Estimated tax</p>
          <p>&#36;<span>0</span> USD</p>
        </div>
        <div>
          <p>Total</p>
          <p>&#36;<span>${total}</span> USD</p>
        </div>
      </div>

      <ul>${itemsHTML}</ul>

      <a href="./index.php?page=cart">Edit cart</a>
    `);

  } catch(error) {
    console.error("Error rendering order summary:", error);
    orderSummary.html(`Error: ${error.message}`);
  }
}

function init() {
  $("#email-account").text(user.email);

  checkoutForm.find("#create-address-btn").click(() => renderCreateAddressForm());

  renderCheckoutForm();
  renderOrderSummary();
}

init();