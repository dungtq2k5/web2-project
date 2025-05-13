import {
  deleteVariation,
  getFilterVariationsList,
  getVariation,
  getVariationsList,
  updateVariation
} from "../../models/product/variations.js";
import {
  DEFAULT_IMG_PATH,
  DISPLAY_MSG_TIMEOUT,
  VARIATION_IMG_PATH
} from "../../settings.js";
import {
  disableBgScroll,
  readFileAsDataURL,
  filterTextInputsInFormData,
  isValidImg,
  isDateInPast,
  convertToMySQLDatetime,
  toBoolean,
  isValidSerialNum,
  isValidIMEI,
  convertUtcToLocalDatetime
} from "../../utils.js";
import { getOSList } from "../../models/product/os.js";
import { closeForm, closePopup } from "./components.js";
import { createInstance } from "../../models/product/instances.js";
import { hasPermission } from "../../models/auth.js";


const crudVariationMsg = $("#crud-variation-msg");
const backdrop = $("#backdrop");
const resultCount = $("#result-count");
const tbody = $("#tbody");

const canUpdate = hasPermission("UPDATE_PRODUCT_VARIATION");
const canDelete = hasPermission("DELETE_PRODUCT_VARIATION");
const canCreateInstance = hasPermission("CREATE_PRODUCT_INSTANCE");

function renderSearchVariationForm() {
  const form = $("#search-variation-form");
  const searchBtn = form.find("#search-variation-form-search-btn");
  const clearBtn = form.find("#search-variation-form-clear-btn");

  clearBtn.click(async () => {
    clearBtn.prop("disabled", true);
    clearBtn.text("Clearing...");

    await renderVariationsData();

    clearBtn.text("Clear search");
    clearBtn.prop("disabled", false);
  });

  form.submit(async e => {
    e.preventDefault();
    searchBtn.prop("disabled", true);
    searchBtn.text("Searching...");

    const formData = new FormData(form[0]);
    const filteredVariationsList = await getFilterVariationsList(
      formData.get("product_id") || null,
      formData.get("price_from") || null,
      formData.get("price_to") || null,
      formData.get("release_from") || null,
      formData.get("release_to") || null,
      formData.get("stop_selling") ? toBoolean(formData.get("stop_selling")) : null
    );
    await renderVariationsData(filteredVariationsList);

    searchBtn.text("Search");
    searchBtn.prop("disabled", false);
  });
}

async function renderVariationsData(variationsList=null) {
  tbody.html("<tr><td colspan='12' class='text-center'>Loading data...</td></tr>");

  try {
    const variations = variationsList || await getVariationsList();

    tbody.html(() => {
      let dataHTML = "";

      variations.forEach((variation, idx) => {
        idx++;
        const img = variation.image_name ? `${VARIATION_IMG_PATH}/${variation.image_name}` : DEFAULT_IMG_PATH;

        dataHTML += `
          <tr
            class="content__tr--g align-middle"
            data-number="${idx}"
            data-variation-id="${variation.id}"
          >
            <td data-cell="n.o" class="text-center">${idx}</td>
            <td data-cell="id" class="text-center">${variation.id}</td>
            <td data-cell="image" class="text-center">
              <img src="${img}" class="content__img img-thumbnail" alt="smartwatch" loading="lazy" style="max-width: 75px;">
            </td>
            <td data-cell="product id" class="text-center">${variation.product_id}</td>
            <td data-cell="watch specs" class="content__td--g">
              <ul class="content__specs content__specs--watch list-unstyled mb-0 small">
                <li><strong>Watch size:</strong> ${variation.watch_size_mm} mm</li>
                <li><strong>Display size:</strong> ${variation.display_size_mm} mm</li>
                <li><strong>Display type:</strong> ${variation.display_type}</li>
                <li><strong>Resolution:</strong> ${variation.resolution_h_px} px <i class="uil uil-times"></i> ${variation.resolution_w_px} px</li>
                <li><strong>Memory:</strong> ${variation.ram_bytes} bytes <i class="uil uil-times"></i> ${variation.rom_bytes} bytes</li>
                <li><strong>OS:</strong> ${variation.os.name}</li>
                <li><strong>Connectivity:</strong> ${variation.connectivity}</li>
                <li><strong>Battery:</strong> ${variation.battery_life_mah} mah</li>
                <li><strong>Water resistance:</strong> ${variation.water_resistance_value} ${variation.water_resistance_unit}</li>
                <li><strong>Sensor:</strong> ${variation.sensor}</li>
                <li><strong>Case material:</strong> ${variation.case_material}</li>
                <li><strong>Total weight (+band):</strong> ${variation.weight_milligrams} mg</li>
                <li><strong>Color:</strong> <input type="color" class="form-control form-control-color form-control-sm d-inline-block" style="width: 30px; height: 20px;" value="${variation.watch_color}" disabled></li>
              </ul>
            </td>
            <td data-cell="band specs" class="content__td--g">
              <ul class="content__specs content__specs--band list-unstyled mb-0 small">
                <li><strong>Material:</strong> ${variation.band_material}</li>
                <li><strong>Size:</strong> ${variation.band_size_mm} mm</li>
                <li><strong>Color:</strong> <input type="color" class="form-control form-control-color form-control-sm d-inline-block" style="width: 30px; height: 20px;" value="${variation.band_color}" disabled></li>
              </ul>
            </td>
            <td data-cell="release at" class="content__td--g">${convertUtcToLocalDatetime(variation.release_date)}</td>
            <td data-cell="base price" class="text-end">${variation.base_price_cents}</td>
            <td data-cell="sell price" class="text-end">${variation.price_cents}</td>
            <td data-cell="stock">
              <div class="d-flex justify-content-center align-items-center gap-2">
                ${variation.stock_quantity}
                ${
                  canCreateInstance
                    ? `<button
                        class="js-add-instance-btn btn btn-warning btn-sm"
                      >
                          <i class='uil uil-plus'></i>Add instance
                        </button>`
                    : ""
                }
              </div>
            </td>
            <td data-cell="stop selling" class="text-center">
              ${variation.stop_selling ? "<span class='badge bg-danger'>Yes</span>" : "<span class='badge bg-success'>No</span>"}
            </td>
            <td data-cell="actions">
              <div class="d-flex justify-content-center gap-2 btn-group-sm">
                ${
                  canUpdate
                    ? `<button
                        class="js-update-variation-btn btn btn-info"
                      >
                        <i class='uil uil-pen'></i>
                      </button>`
                    : ""
              }
                ${
                  canDelete
                    ? `<button
                        class="js-delete-variation-btn btn btn-danger"
                      >
                        <i class='uil uil-trash'></i>
                      </button>`
                    : ""
                }
                ${!canUpdate && !canDelete ? "<span class='text-muted'>No actions</span>" : ""}
              </div>
            </td>
          </tr>
        `;
      });

      return dataHTML || "<tr><td colspan='12' class='text-center text-muted'>No data found!</td></tr>";
    });

    if(canCreateInstance) {
      tbody.find(".js-add-instance-btn").click(e => {
        const tr = $(e.currentTarget).closest("tr");
        const variationNum = tr.data("number");
        const variationId = tr.data("variation-id");

        console.log(`Add instance for variation id ${variationId}`);
        renderAddInstanceForm(variationNum, variationId);
      });
    }

    if(canUpdate) {
      tbody.find(".js-update-variation-btn").click(e => {
        const tr = $(e.currentTarget).closest("tr");
        const variationNum = tr.data("number");
        const variationId = tr.data("variation-id");

        console.log(`Update variation id ${variationId}`);
        renderUpdateVariationForm(variationNum, variationId);
      });
    }

    if(canDelete) {
      tbody.find(".js-delete-variation-btn").click(e => {
        const tr = $(e.currentTarget).closest("tr");
        const variationNum = tr.data("number");
        const variationId = tr.data("variation-id");

        console.log(`Delete variation id ${variationId}`);
        renderDelVariationPopup(variationNum, variationId);
      });
    }

    resultCount.text(variations.length);

  } catch(error) {
    console.error(`Error: ${error.message}`);
    tbody.html(`<tr><td colspan='12' class="p-3 text-center table-danger">Error loading data: ${error.message}</td></tr>`);
  }
}

async function renderUpdateVariationForm(number, id) {
 disableBgScroll();
 backdrop.html("<div class='d-flex justify-content-center align-items-center' style='height: 100vh;'><div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading update variation form...</span></div></div>");
 backdrop.show();

  try {
    const variation = await getVariation(id);
    const os = await getOSList();
    const img = variation.image_name && `${VARIATION_IMG_PATH}/${variation.image_name}`;

    const osHTML = os.map(osItem => (
      `<option
        value="${osItem.id}"
        ${osItem.id == variation.os.id && "selected"}
      >${osItem.name}</option>`
    )).join("");

      backdrop.html(`
        <form
          class="form--g update-variation-form card p-4 shadow-lg" id="update-variation-form"
          style="max-width: 900px; margin: 2rem auto; max-height: 80vh; overflow-y: auto;
        ">
        <button type="button" class="btn-close position-absolute top-0 end-0 m-3 js-update-variation-form-close-btn" aria-label="Close"></button>
        <h2 class="form__title--g mb-4">Update variation id ${id} - number ${number} form</h2>

        <div class="row">
          <div class="col-md-4 mb-3">
          <div class="update-variation-form-img text-center">
            <img
            src="${img || DEFAULT_IMG_PATH}"
            alt="smartwatch"
            id="update-variation-form-img-display"
            class="img-thumbnail mb-2"
            style="max-height: 200px;"
            >

            <div class="mb-2">
            <label for="img" class="form-label btn btn-outline-dark btn-sm">Select an image</label>
            <input
              type="file"
              id="img"
              name="image"
              accept="image/webp"
              class="d-none"
            >
            </div>

            <button
            id="update-variation-form-img-remove-btn"
            type="button"
            class="btn btn-sm btn-danger"
            style="display: ${!img && "none"};"
            >remove image</button>

            <span id="img-msg" class="text-danger d-block mt-1"></span>
          </div>
          </div>

          <div class="col-md-8">
          <div class="row">
            <div class="col-sm-6 mb-3">
            <label for="watch-size" class="form-label">Watch size (mm):</label>
            <input
              type="number"
              name="watch_size_mm"
              id="watch-size"
              value="${variation.watch_size_mm}"
              placeholder="0"
              class="form-control"
            >
            <span id="watch-size-msg" class="text-danger d-block mt-1"></span>
            </div>

            <div class="col-sm-6 mb-3">
            <label for="watch-color" class="form-label">Watch color:</label>
            <input
              type="color"
              name="watch_color"
              id="watch-color"
              value="${variation.watch_color}"
              class="form-control form-control-color"
            >
            </div>

            <div class="col-sm-6 mb-3">
            <label for="base-price" class="form-label">Base(stock) price (cents):</label>
            <input
              type="number"
              name="base_price_cents"
              id="base-price"
              value="${variation.base_price_cents}"
              placeholder="0"
              class="form-control"
            >
            <span id="base-price-msg" class="text-danger d-block mt-1"></span>
            </div>

            <div class="col-sm-6 mb-3">
            <label for="sell-price" class="form-label">Sell price (cents):</label>
            <input
              type="number"
              name="price_cents"
              id="sell-price"
              value="${variation.price_cents}"
              placeholder="0"
              class="form-control"
            >
            <span id="sell-price-msg" class="text-danger d-block mt-1"></span>
            </div>

            <div class="col-sm-6 mb-3">
            <label for="display-size" class="form-label">Display size (mm):</label>
            <input
              type="number"
              name="display_size_mm"
              id="display-size"
              value="${variation.display_size_mm}"
              placeholder="0"
              class="form-control"
            >
            <span id="display-size-msg" class="text-danger d-block mt-1"></span>
            </div>

            <div class="col-sm-6 mb-3">
            <label for="display-type" class="form-label">Display type:</label>
            <input
              type="text"
              name="display_type"
              id="display-type"
              value="${variation.display_type}"
              placeholder="amoled"
              class="form-control"
            >
            <span id="display-type-msg" class="text-danger d-block mt-1"></span>
            </div>

            <div class="col-12 mb-3">
            <p class="form-label mb-1">Resolution (px):</p>
            <div class="input-group">
              <input
              type="number"
              name="resolution_h_px"
              id="resolution_h"
              value="${variation.resolution_h_px}"
              placeholder="Height"
              class="form-control"
              >
              <span class="input-group-text"><i class="uil uil-times"></i></span>
              <input
              type="number"
              name="resolution_w_px"
              id="resolution_w"
              value="${variation.resolution_w_px}"
              placeholder="Width"
              class="form-control"
              >
            </div>
            <span id="resolution-msg" class="text-danger d-block mt-1"></span>
            </div>

            <div class="col-12 mb-3">
            <p class="form-label mb-1">Memory (bytes):</p>
            <div class="input-group">
              <input
              type="number"
              name="ram_bytes"
              id="ram"
              value="${variation.ram_bytes}"
              placeholder="RAM"
              class="form-control"
              >
               <span class="input-group-text">RAM</span>
              <span class="input-group-text"><i class="uil uil-times"></i></span>
              <input
              type="number"
              name="rom_bytes"
              id="rom"
              value="${variation.rom_bytes}"
              placeholder="ROM"
              class="form-control"
              >
              <span class="input-group-text">ROM</span>
            </div>
            <span id="memory-msg" class="text-danger d-block mt-1"></span>
            </div>

            <div class="col-sm-6 mb-3">
            <label for="os" class="form-label">OS:</label>
            <select name="os_id" id="os" class="form-select">${osHTML}</select>
            <span id="os-msg" class="text-danger d-block mt-1"></span>
            </div>

            <div class="col-sm-6 mb-3">
            <label for="connectivity" class="form-label">Connectivity:</label>
            <input
              type="text"
              name="connectivity"
              id="connectivity"
              value="${variation.connectivity}"
              placeholder="wifi, bluetooth,..."
              class="form-control"
            >
            <span id="connectivity-msg" class="text-danger d-block mt-1"></span>
            </div>

            <div class="col-sm-6 mb-3">
            <label for="battery" class="form-label">Battery capacity (mah):</label>
            <input
              type="number"
              name="battery_life_mah"
              id="battery"
              value="${variation.battery_life_mah}"
              placeholder="0"
              class="form-control"
            >
            <span id="battery-msg" class="text-danger d-block mt-1"></span>
            </div>

            <div class="col-12 mb-3">
            <p class="form-label mb-1">Water resistance:</p>
            <div class="input-group">
              <input
              type="text"
              name="water_resistance_value"
              id="resistance-value"
              value="${variation.water_resistance_value}"
              placeholder="Value"
              class="form-control"
              >
              <input
              type="text"
              name="water_resistance_unit"
              id="resistance-unit"
              value="${variation.water_resistance_unit}"
              placeholder="Unit (e.g. atm)"
              class="form-control"
              >
            </div>
            <span id="resistance-msg" class="text-danger d-block mt-1"></span>
            </div>

            <div class="col-sm-6 mb-3">
            <label for="sensor" class="form-label">Sensor:</label>
            <input
              type="text"
              name="sensor"
              id="sensor"
              value="${variation.sensor}"
              placeholder="accelerometer, magnetometer,..."
              class="form-control"
            >
            <span id="sensor-msg" class="text-danger d-block mt-1"></span>
            </div>

            <div class="col-sm-6 mb-3">
            <label for="case-material" class="form-label">Case material:</label>
            <input
              type="text"
              name="case_material"
              id="case-material"
              value="${variation.case_material}"
              placeholder="stainless steel"
              class="form-control"
            >
            <span id="case-material-msg" class="text-danger d-block mt-1"></span>
            </div>

            <div class="col-sm-6 mb-3">
            <label for="band-material" class="form-label">Band material:</label>
            <input
              type="text"
              name="band_material"
              id="band-material"
              value="${variation.band_material}"
              placeholder="silicone"
              class="form-control"
            >
            <span id="band-material-msg" class="text-danger d-block mt-1"></span>
            </div>

            <div class="col-sm-6 mb-3">
            <label for="band-size" class="form-label">Band size (mm):</label>
            <input
              type="number"
              name="band_size_mm"
              id="band-size"
              value="${variation.band_size_mm}"
              placeholder="0"
              class="form-control"
            >
            <span id="band-size-msg" class="text-danger d-block mt-1"></span>
            </div>

            <div class="col-sm-6 mb-3">
            <label for="band-color" class="form-label">Band color:</label>
            <input
              type="color"
              name="band_color"
              id="band-color"
              value="${variation.band_color}"
              class="form-control form-control-color"
            >
            <span id="band-color-msg" class="text-danger d-block mt-1"></span>
            </div>

            <div class="col-sm-6 mb-3">
            <label for="weight" class="form-label">Total weight (mg): </label>
            <input
              type="number"
              name="weight_milligrams"
              id="weight"
              value="${variation.weight_milligrams}"
              placeholder="0"
              class="form-control"
            >
            <span id="weight-msg" class="text-danger d-block mt-1"></span>
            </div>

            <div class="col-sm-6 mb-3">
            <label for="release-date" class="form-label">Release at:</label>
            <input
              type="datetime-local"
              name="release_date"
              value="${convertUtcToLocalDatetime(variation.release_date)}"
              id="release-date"
              class="form-control"
            >
            <span id="release-date-msg" class="text-danger d-block mt-1"></span>
            </div>

             <div class="col-12 mb-3">
            <div class="form-check">
              <input
              type="checkbox"
              name="stop_selling"
              id="stop-selling"
              class="form-check-input"
              ${variation.stop_selling && "checked"}
              >
              <label for="stop-selling" class="form-check-label">Stop selling</label>
            </div>
            </div>
          </div>
          </div>
        </div>

        <div class="d-grid gap-2 d-md-flex justify-content-md-end mt-3">
          <button type="submit" id="update-variation-form-submit-btn" class="btn btn-dark btn-sm">
            Update
          </button>
          <button type="button" class="js-update-variation-form-close-btn btn btn-outline-dark btn-sm">
            Cancel
          </button>
        </div>

        <span id="submit-msg" class="text-danger d-block mt-3 text-center"></span>
        </form>
      `);

    const form = backdrop.find("#update-variation-form");

    form.find(".js-update-variation-form-close-btn").click(() => closeForm(backdrop));

    let isRemoveImg = false;
    const inputImg = form.find("#img");
    const imgDisplay = form.find("#update-variation-form-img-display");
    const removeImgBtn = form.find("#update-variation-form-img-remove-btn");

    inputImg.change(async e => {
      removeImgBtn.show();
      isRemoveImg = false;
      imgDisplay.prop("src", await readFileAsDataURL(e.target.files[0]));
    });

    removeImgBtn.click(() => {
      removeImgBtn.hide();
      isRemoveImg = true;
      inputImg.val("");
      imgDisplay.prop("src", DEFAULT_IMG_PATH);
    });

    form.submit(async e => {
      e.preventDefault();

      const submitBtn = form.find("#update-variation-form-submit-btn");
      submitBtn.prop("disabled", true);
      submitBtn.text("Updating variation...");

      const formData = filterTextInputsInFormData(new FormData(form[0]));

      const fileMsg = form.find("#img-msg");
      const watchSizeMsg = form.find("#watch-size-msg");
      const basePriceMsg = form.find("#base-price-msg");
      const sellPriceMsg = form.find("#sell-price-msg");
      const displaySizeMsg = form.find("#display-size-msg");
      const displayTypeMsg = form.find("#display-type-msg");
      const resolutionMsg = form.find("#resolution-msg");
      const memoryMsg = form.find("#memory-msg");
      const connectivityMsg = form.find("#connectivity-msg");
      const batteryMsg = form.find("#battery-msg")
      const waterResistanceMsg = form.find("#resistance-msg");
      const sensorMsg = form.find("#sensor-msg");
      const caseMaterialMsg = form.find("#case-material-msg");
      const bandMaterialMsg = form.find("#band-material-msg");
      const bandSizeMsg = form.find("#band-size-msg");
      const weightMsg = form.find("#weight-msg");
      const releaseDateMsg = form.find("#release-date-msg");

      const validateForm = async () => {
        let allValid = true;

        if(formData.get("image")["name"]) {
          const errors = await isValidImg(formData.get("image"));
          if(errors.length !== 0) {
            fileMsg.text(errors);
            allValid = false;
          } else fileMsg.text("");
        } else {
          fileMsg.text("");
        }

        if(!formData.get("watch_size_mm")) {
          watchSizeMsg.text("* required");
          allValid = false;
        } else if(formData.get("watch_size_mm") < 0) {
          watchSizeMsg.text("* can't be smaller than 0");
          allValid = false;
        } else watchSizeMsg.text("");

        if(!formData.get("price_cents")) {
          sellPriceMsg.text("* required");
          allValid = false;
        } else if(formData.get("price_cents") < 0) {
          sellPriceMsg.text("* can't be smaller than 0");
          allValid = false;
        } else sellPriceMsg.text("");

        if(!formData.get("base_price_cents")) {
          basePriceMsg.text("* required");
          allValid = false;
        } else if(formData.get("base_price_cents") < 0) {
          basePriceMsg.text("* can't be smaller than 0");
          allValid = false;
        } else basePriceMsg.text("");

        if(!formData.get("display_size_mm")) {
          displaySizeMsg.text("* required");
          allValid = false;
        } else if(formData.get("display_size_mm") < 0) {
          displaySizeMsg.text("* can't be smaller than 0");
          allValid = false;
        } else displaySizeMsg.text("");

        if(!formData.get("display_type")) {
          displayTypeMsg.text("* required");
          allValid = false;
        } else displayTypeMsg.text("");

        if(!formData.get("resolution_h_px") || !formData.get("resolution_w_px")) {
          resolutionMsg.text("* required");
          allValid = false;
        } else if(formData.get("resolution_h_px") < 0 || formData.get("resolution_w_px") < 0) {
          resolutionMsg.text("* can't be smaller than 0");
          allValid = false;
        } else resolutionMsg.text("");

        if(!formData.get("ram_bytes") || !formData.get("rom_bytes")) {
          memoryMsg.text("* required");
          allValid = false;
        } else if(formData.get("ram_bytes") < 0 || formData.get("rom_bytes") < 0) {
          memoryMsg.text("* can't be smaller than 0");
          allValid = false;
        } else memoryMsg.text("");

        if(!formData.get("connectivity")) {
          connectivityMsg.text("* required");
          allValid = false;
        } else connectivityMsg.text("");

        if(!formData.get("battery_life_mah")) {
          batteryMsg.text("* required");
          allValid = false;
        } else if(formData.get("battery_life_mah") < 0) {
          batteryMsg.text("* can't be smaller than 0");
          allValid = false;
        } else batteryMsg.text("");

        if(!formData.get("water_resistance_value") || !formData.get("water_resistance_unit")) {
          waterResistanceMsg.text("* required");
          allValid = false;
        } else waterResistanceMsg.text("");

        if(!formData.get("sensor")) {
          sensorMsg.text("* required");
          allValid = false;
        } else sensorMsg.text("");

        if(!formData.get("case_material")) {
          caseMaterialMsg.text("* required");
          allValid = false;
        } else caseMaterialMsg.text("");

        if(!formData.get("band_material")) {
          bandMaterialMsg.text("* required");
          allValid = false;
        } else bandMaterialMsg.text("");

        if(!formData.get("band_size_mm")) {
          bandSizeMsg.text("* required");
          allValid = false;
        } else if(formData.get("band_size_mm") < 0) {
          bandSizeMsg.text("* can't be smaller than 0");
          allValid = false;
        } else bandSizeMsg.text("");

        if(!formData.get("weight_milligrams")) {
          weightMsg.text("* required");
          allValid = false;
        } else if(formData.get("weight_milligrams") < 0) {
          weightMsg.text("* can't be smaller than 0");
          allValid = false;
        } else weightMsg.text("");

        if(!formData.get("release_date")) {
          releaseDateMsg.text("* required");
          allValid = false;
        } else if(!isDateInPast(formData.get("release_date"))) {
          releaseDateMsg.text("* can't be greater than or equal to current date");
          allValid = false;
        } else releaseDateMsg.text("");

        return allValid;
      }

      if(await validateForm()) {
        if(isRemoveImg) {
          formData.set("image", "null");
        } else if(!formData.get("image")["name"]) {
          formData.delete("image");
        }
        formData.set("release_date", convertToMySQLDatetime(formData.get("release_date")));
        if(formData.get("stop_selling")) {
          formData.set("stop_selling", true);
        } else formData.delete("stop_selling");

        const res = await updateVariation(
          id,
          (formData.get("image") && formData.get("image") !== "null") ? formData : Object.fromEntries(formData)
        );

        if(res.success) {
          crudVariationMsg.text(`* variation id ${id} - number ${number} was updated`);
          setTimeout(() => {
            crudVariationMsg.text("");
          }, DISPLAY_MSG_TIMEOUT);
          renderVariationsData();
          closeForm(backdrop);
          return;
        }

        form.find("#submit-msg").text(`Error: ${res.message}`);
      }

      submitBtn.text("Update");
      submitBtn.prop("disabled", false);
    });
  } catch(error) {
    console.error(`Error: ${error.message}`);
    backdrop.html(`<div class="alert alert-danger m-3 p-4 text-center">Error loading update variation form: ${error.message}</div>`);
  }
}

async function renderDelVariationPopup(number, id) {
  disableBgScroll();

  backdrop.html(`
    <div class="form--g card p-4 shadow-lg text-center" style="max-width: 500px; margin: 2rem auto;">
      <button class="btn-close position-absolute top-0 end-0 m-3 js-delete-variation-popup-close-btn" aria-label="Close"></button>
      <h2 class="form__title--g mb-4">Confirm delete variation id ${id} - number ${number}?</h2>

      <div class="d-grid gap-2 d-sm-flex justify-content-sm-center">
        <button id="delete-variation-popup-submit-btn" class="btn btn-danger btn-sm">
          Delete
        </button>
        <button class="js-delete-variation-popup-close-btn btn btn-outline-dark btn-sm">
          Cancel
        </button>
      </div>

      <span id="delete-variation-popup-msg" class="text-danger d-block mt-3"></span>
    </div>
  `);

  backdrop.find(".js-delete-variation-popup-close-btn").click(() => {closePopup(backdrop)});

  const submitBtn = backdrop.find("#delete-variation-popup-submit-btn");
  submitBtn.click(async () => {
    submitBtn.prop("disabled", true);
    submitBtn.text("Deleting...");

    const res = await deleteVariation(id);

    if(res.success) {
      crudVariationMsg.text(`* variation id ${id} - number ${number} was deleted`);
      setTimeout(() => {
        crudVariationMsg.text("");
      }, DISPLAY_MSG_TIMEOUT);
      renderVariationsData();
      closePopup(backdrop);
      return;
    }

    submitBtn.text("Delete");
    submitBtn.prop("disabled", false);
    backdrop.find("#delete-variation-popup-msg").text(`Error: ${res.message}`);
  });

  backdrop.show();
}

function renderAddInstanceForm(variationNumber, variationId) {
  disableBgScroll();
  backdrop.html("<div class='d-flex justify-content-center align-items-center' style='height: 100vh;'><div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading add instance form...</span></div></div>");
  backdrop.show();

  try {
    backdrop.html(`
      <form class="form--g card p-4 shadow-lg" id="add-instance-form" style="max-width: 600px; margin: 2rem auto;">
        <button type="button" class="btn-close position-absolute top-0 end-0 m-3 js-add-instance-form-close-btn" aria-label="Close"></button>
        <h2 class="form__title--g mb-4">Add instance for product variation id ${variationId} - number ${variationNumber} form</h2>

        <div class="mb-3">
          <label for="serial-number" class="form-label">Supplier serial-number:</label>
          <input
            type="text"
            name="supplier_serial_number"
            id="serial-number"
            class="form-control"
          >
          <span id="serial-number-msg" class="text-danger d-block mt-1"></span>
        </div>

        <div class="mb-3">
          <label for="imei-number" class="form-label">Supplier IMEI-number:</label>
          <input
            type="text"
            name="supplier_imei_number"
            id="imei-number"
            placeholder="none"
            class="form-control"
          >
          <span id="imei-number-msg" class="text-danger d-block mt-1"></span>
        </div>

        <div class="form-check mb-3">
          <input type="checkbox" name="is_sold" id="is_sold" class="form-check-input">
          <label for="is_sold" class="form-check-label">Is sold</label>
        </div>

        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
          <button type="submit" id="add-instance-form-submit-btn" class="btn btn-dark btn-sm">
            Add
          </button>
          <button type="button" class="js-add-instance-form-close-btn btn btn-outline-dark btn-sm">
            Cancel
          </button>
        </div>

        <span id="submit-msg" class="text-danger d-block mt-3 text-center"></span>
      </form>
    `);

    const form = backdrop.find("#add-instance-form");

    form.find(".js-add-instance-form-close-btn").click(() => closeForm(backdrop));

    form.submit(async e => {
      e.preventDefault();

      const submitBtn = form.find("#add-instance-form-submit-btn");
      submitBtn.prop("disabled", true);
      submitBtn.text("Adding instance...");

      const formData = filterTextInputsInFormData(new FormData(form[0]));

      const serialNumMsg = form.find("#serial-number-msg");
      const imeiNumMsg = form.find("#imei-number-msg");

      const validateForm = async () => {
        let allValid = true;

        const serialNum = formData.get("supplier_serial_number");
        if(!serialNum) {
          serialNumMsg.text("* required");
          allValid = false;
        } else if(!isValidSerialNum(serialNum)) {
          serialNumMsg.text("* invalid serial number");
          allValid = false;
        } else {
          serialNumMsg.text("");
        }

        const imeiNum = formData.get("supplier_imei_number");
        if(imeiNum) {
          if(!isValidIMEI(imeiNum)) {
            imeiNumMsg.text("* invalid IMEI number");
            allValid = false;
          } else {
            imeiNumMsg.text("");
          }
        } else {
          imeiNumMsg.text("");
        }

        return allValid;
      }

      if(await validateForm()) {
        formData.append("product_variation_id", variationId);

        if(!formData.get("supplier_imei_number")) formData.delete("supplier_imei_number");

        if(formData.get("is_sold")) {
          formData.set("is_sold", true);
        } else {
          formData.delete("is_sold");
        }

        const res = await createInstance(Object.fromEntries(formData));

        if(res.success) {
          crudVariationMsg.text(`* new instance sku '${res.data.sku}' was added to variation id '${variationId}'`);
          setTimeout(() => {
            crudVariationMsg.text("");
          }, DISPLAY_MSG_TIMEOUT);
          renderVariationsData();
          closeForm(backdrop);
          return;
        }

        form.find("#submit-msg").text(`Error: ${res.message}`);
      }

      submitBtn.text("Add");
      submitBtn.prop("disabled", false);

    });

  } catch(error) {
    console.error(`Error: ${error.message}`);
    backdrop.html(`<div class="alert alert-danger m-3 p-4 text-center">Error loading add instance form: ${error.message}</div>`);
  }

}

renderSearchVariationForm();
renderVariationsData();