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
    checkoutBtn.html(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Placing order...`);

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
        checkoutBtn.html(`<i class="uil uil-check-circle"></i> Order Placed! Redirecting...`);
        window.location.href = "./index.php?page=orders";
        return;
      }

      checkoutForm.find("#checkout-msg").text(createOrderRes.message).addClass("text-danger");
    }

    checkoutBtn.prop("disabled", false);
    checkoutBtn.html(`<i class="uil uil-check-circle"></i> Place Order`);
  });
}

function renderCreateAddressForm() {
  disableBgScroll();
  backdrop.html(`
    <div class="modal d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content shadow">
          <div class="modal-header">
            <h5 class="modal-title"><i class="uil uil-map-marker-plus"></i> Add New Address</h5>
            <button type="button" class="btn-close js-create-address-close-btn" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="text-center p-3"><div class="spinner-border spinner-border-sm text-primary" role="status"></div><p class="mt-2">Loading form...</p></div>
          </div>
        </div>
      </div>
    </div>
  `);
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

    const vnAddresses = getVNAddressesList();
    if (!vnAddresses || vnAddresses.length === 0) {
      throw new Error("Vietnam address data could not be loaded.");
    }

    let cityExists = vnAddresses.some(city => city.code == currCityCode);
    if (!cityExists && vnAddresses.length > 0) {
      currCityCode = vnAddresses[0].code;
    }

    const currCity = getCityProvince(currCityCode);
    if (!currCity) {
      throw new Error(`City with code ${currCityCode} not found.`);
    }

    let currDistrictCode = currCity.districts.length > 0 ? currCity.districts[0].code : null;
    let currWardCode = currDistrictCode && currCity.districts[0].wards.length > 0 ? currCity.districts[0].wards[0].code : null;

    const modalBody = backdrop.find(".modal-body");
    modalBody.html(`
      <form id="create-address-form-modal" class="needs-validation" novalidate>
        <div class="mb-3">
          <label for="full-name-modal" class="form-label"><i class="uil uil-user"></i> Full name</label>
          <input
            type="text"
            id="full-name-modal"
            class="form-control form-control-sm"
            placeholder="${user && user.full_name ? user.full_name : 'e.g., John Doe'}"
            value="${user && user.full_name ? user.full_name : ''}"
            name="name"
            required
          />
          <div id="full-name-modal-msg" class="invalid-feedback">Full name is required.</div>
        </div>

        <div class="mb-3">
          <label for="phone-number-modal" class="form-label"><i class="uil uil-phone"></i> Phone number</label>
          <input
            type="tel"
            id="phone-number-modal"
            class="form-control form-control-sm"
            placeholder="${user && user.phone_number ? user.phone_number : 'e.g., 09xxxxxxxx'}"
            value="${user && user.phone_number ? user.phone_number : ''}"
            name="phone_number"
            required
          />
          <div id="phone-number-modal-msg" class="invalid-feedback">Valid VN phone number is required.</div>
        </div>

        <div class="row">
          <div class="col-md-4 mb-3">
            <label for="city-province-modal" class="form-label"><i class="uil uil-map"></i> City/Province</label>
            <select id="city-province-modal" name="city_province_code" class="form-select form-select-sm" required>
              ${genCityOptionsHTML(vnAddresses, currCityCode)}
            </select>
            <div class="invalid-feedback">Please select a city/province.</div>
          </div>

          <div class="col-md-4 mb-3">
            <label for="district-modal" class="form-label"><i class="uil uil-map-marker"></i> District</label>
            <select id="district-modal" name="district_code" class="form-select form-select-sm" required>
              ${currCity.districts.length > 0 ? genDistrictOptionsHTML(currCity.districts, currDistrictCode) : '<option value="">Select City First</option>'}
            </select>
            <div class="invalid-feedback">Please select a district.</div>
          </div>

          <div class="col-md-4 mb-3">
            <label for="ward-modal" class="form-label"><i class="uil uil-location-point"></i> Ward</label>
            <select id="ward-modal" name="ward_code" class="form-select form-select-sm" required>
              ${currDistrictCode && getDistrict(currCityCode, currDistrictCode).wards.length > 0 ? genWardOptionsHTML(getDistrict(currCityCode, currDistrictCode).wards, currWardCode) : '<option value="">Select District First</option>'}
            </select>
            <div class="invalid-feedback">Please select a ward.</div>
          </div>
        </div>

        <div class="mb-3">
          <label for="street-modal" class="form-label"><i class="uil uil-sign-alt"></i> Street</label>
          <input type="text" id="street-modal" name="street" class="form-control form-control-sm" placeholder="e.g., 123 Main St" required />
          <div id="street-modal-msg" class="invalid-feedback">Street is required.</div>
        </div>

        <div class="mb-3">
          <label for="apartment-number-modal" class="form-label"><i class="uil uil-building"></i> Apartment, suite, etc.</label>
          <input type="text" id="apartment-number-modal" name="apartment_number" class="form-control form-control-sm" placeholder="e.g., Apt 4B" required />
          <div id="apartment-number-modal-msg" class="invalid-feedback">Apartment number is required.</div>
        </div>

        <div class="form-check mb-3">
          <input type="checkbox" class="form-check-input" id="is-default-modal" name="is_default" checked />
          <label class="form-check-label" for="is-default-modal">Set as default address</label>
        </div>

        <div id="create-address-modal-msg" class="form-text text-danger mb-2"></div>

        <div class="modal-footer">
          <button type="button" class="btn btn-sm btn-secondary js-create-address-close-btn"><i class="uil uil-times"></i> Cancel</button>
          <button type="submit" id="create-address-submit-btn-modal" class="btn btn-sm btn-primary"><i class="uil uil-plus-circle"></i> Add Address</button>
        </div>
      </form>
    `);

    const form = backdrop.find("#create-address-form-modal");

    const citySelect = form.find("#city-province-modal");
    const districtSelect = form.find("#district-modal");
    const wardSelect = form.find("#ward-modal");

    form.find(".js-create-address-close-btn").click(() => closeForm(backdrop));

    citySelect.change(() => {
      currCityCode = citySelect.val();
      const districts = getDistrictsOfCity(currCityCode);
      currDistrictCode = districts.length > 0 ? districts[0].code : null;

      districtSelect.html(districts.length > 0 ? genDistrictOptionsHTML(districts, currDistrictCode) : '<option value="">Select City First</option>');
      districtSelect.trigger("change");
    });

    districtSelect.change(() => {
      currDistrictCode = districtSelect.val();
      if (!currDistrictCode) {
        wardSelect.html('<option value="">Select District First</option>');
        currWardCode = null;
        return;
      }
      const wards = getWardsOfDistrict(currCityCode, currDistrictCode);
      currWardCode = wards.length > 0 ? wards[0].code : null;
      wardSelect.html(wards.length > 0 ? genWardOptionsHTML(wards, currWardCode) : '<option value="">No Wards Available</option>');
    });

    wardSelect.change(() => {
      currWardCode = wardSelect.val();
    });

    form.submit(async e => {
      e.preventDefault();
      form.addClass('was-validated');

      const submitBtn = form.find("#create-address-submit-btn-modal");
      submitBtn.prop("disabled", true);
      submitBtn.html(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Adding...`);

      const formData = filterTextInputsInFormData(new FormData(form[0]));
      formData.set("city_province_code", citySelect.val());
      formData.set("district_code", districtSelect.val());
      formData.set("ward_code", wardSelect.val());

      const fullNameMsg = form.find("#full-name-modal-msg");
      const phoneNumberMsg = form.find("#phone-number-modal-msg");
      const streetMsg = form.find("#street-modal-msg");
      const apartmentNumberMsg = form.find("#apartment-number-modal-msg");
      const generalMsg = form.find("#create-address-modal-msg");
      generalMsg.text("");

      let allValid = true;
      if(!formData.get("name")) {
        allValid = false;
      }
      if(!formData.get("phone_number") || !isValidVNPhoneNumber(formData.get("phone_number"))) {
        phoneNumberMsg.text(formData.get("phone_number") ? "Invalid VN phone number." : "Phone number is required.");
        allValid = false;
      }
      if(!formData.get("street")) allValid = false;
      if(!formData.get("apartment_number")) allValid = false;
      if(!formData.get("city_province_code") || !formData.get("district_code") || !formData.get("ward_code")){
        generalMsg.text("Please select a valid city, district, and ward.");
        allValid = false;
      }

      if(form[0].checkValidity() && allValid) {
        const city = getCityProvince(formData.get("city_province_code"));
        const district = getDistrict(formData.get("city_province_code"), formData.get("district_code"));
        const ward = getWard(formData.get("city_province_code"), formData.get("district_code"), formData.get("ward_code"));

        if (!city || !district || !ward) {
          generalMsg.text("Invalid address selection. Please re-select.");
          submitBtn.prop("disabled", false);
          submitBtn.html(`<i class="uil uil-plus-circle"></i> Add Address`);
          return;
        }

        const res = await createAddress({
          name: formData.get("name"),
          phone_number: formData.get("phone_number"),
          city_province: city.name,
          district: district.name,
          ward: ward.name,
          street: formData.get("street"),
          apartment_number: formData.get("apartment_number"),
          is_default: formData.get("is_default") === "on"
        });

        if(res.success) {
          await renderAddressOptions();
          closeForm(backdrop);
          return;
        }

        generalMsg.text(res.message);
      } else {
        if (!allValid && form[0].checkValidity()) {
        } else {
          generalMsg.text("Please correct the errors in the form.");
        }
      }

      submitBtn.prop("disabled", false);
      submitBtn.html(`<i class="uil uil-plus-circle"></i> Add Address`);
    });

  } catch (error) {
    console.error("Error rendering create address form:", error);
    const modalBody = backdrop.find(".modal-body");
    if (modalBody.length) {
      modalBody.html(`<div class="alert alert-danger m-0">Error loading address form: ${error.message}</div>`);
    } else {
      backdrop.html(`<div class="modal d-block"><div class="modal-dialog"><div class="modal-content"><div class="modal-body alert alert-danger">Error: ${error.message}</div></div></div></div>`);
    }
  }
}

async function renderOrderSummary() {
  const orderSummaryContainer = $("#order-summary");
  const summaryContentDiv = orderSummaryContainer.find(".h5").nextAll();
  if (summaryContentDiv.length) {
    summaryContentDiv.remove();
  }
  orderSummaryContainer.append(`<div class="text-center p-3" id="summary-loading-spinner"><div class="spinner-border spinner-border-sm text-primary" role="status"></div><p class="mt-1 small">Loading summary...</p></div>`);
  const itemCountSpan = $("#order-summary-item-count");

  try {
    const carts = await getAvailableCartsList();
    itemCountSpan.text(carts.length);

    if(carts.length === 0) {
      orderSummaryContainer.find("#summary-loading-spinner").remove();
      orderSummaryContainer.append(`<p class="text-muted text-center small mt-3">No items to checkout.</p>`);
      checkoutBtn.prop("disabled", true).addClass("disabled");
      return;
    } else {
      checkoutBtn.prop("disabled", false).removeClass("disabled");
    }

    let itemsHTML = '<ul class="list-group list-group-flush mb-3">';
    let totalCents = 0;

    for(const cart of carts) {
      const variation = await getVariation(cart.product_variation_id);
      const product = await getProduct(variation.product_id);

      const variationImg = variation.image_name
        ? `${VARIATION_IMG_PATH}/${variation.image_name}`
        : DEFAULT_IMG_PATH;

      totalCents += variation.price_cents * cart.quantity;

      itemsHTML += `
        <li class="list-group-item d-flex justify-content-between lh-sm">
          <div class="d-flex align-items-center">
            <img src="${variationImg}" alt="${product.name}" class="me-2 rounded" style="width: 40px; height: 40px; object-fit: contain;">
            <div>
              <h6 class="my-0 small">${product.name} (${variation.watch_size_mm}MM)</h6>
              <small class="text-muted">Qty: ${cart.quantity}</small>
            </div>
          </div>
          <span class="text-muted small">&#36;${centsToDollars(variation.price_cents * cart.quantity)}</span>
        </li>
      `;
    }
    itemsHTML += '</ul>';

    const total = centsToDollars(totalCents);
    const shippingCents = 0;
    const taxCents = 0;
    const finalTotalCents = totalCents + shippingCents + taxCents;
    const finalTotal = centsToDollars(finalTotalCents);

    orderSummaryContainer.find("#summary-loading-spinner").remove();
    orderSummaryContainer.append(`
      ${itemsHTML}
      <ul class="list-group list-group-flush">
        <li class="list-group-item d-flex justify-content-between">
          <span class="small">Subtotal</span>
          <strong class="small">&#36;${total}</strong>
        </li>
        <li class="list-group-item d-flex justify-content-between">
          <span class="text-success small">Shipping</span>
          <strong class="text-success small">&#36;${centsToDollars(shippingCents)}</strong>
        </li>
        <li class="list-group-item d-flex justify-content-between">
          <span class="small">Estimated Tax</span>
          <strong class="small">&#36;${centsToDollars(taxCents)}</strong>
        </li>
        <li class="list-group-item d-flex justify-content-between bg-light">
          <span class="fw-bold">Total (USD)</span>
          <strong class="fw-bold fs-5 text-primary">&#36;${finalTotal}</strong>
        </li>
      </ul>
      <div class="mt-3 text-center">
        <a href="./index.php?page=cart" class="btn btn-sm btn-outline-dark"><i class="uil uil-shopping-cart-alt"></i> Edit Cart</a>
      </div>
    `);

  } catch(error) {
    console.error("Error rendering order summary:", error);
    orderSummaryContainer.find("#summary-loading-spinner").remove();
    orderSummaryContainer.append(`<p class="text-danger text-center small mt-3">Error loading summary: ${error.message}</p>`);
  }
}

function init() {
  $("#email-account").text(user.email);

  checkoutForm.find("#create-address-btn").click(() => renderCreateAddressForm());

  renderCheckoutForm();
  renderOrderSummary();
}

init();