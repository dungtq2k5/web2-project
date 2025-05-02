import {
  deleteVariation,
  getFilterVariationsList,
  getVariation,
  getVariationsList,
  updateVariation
} from "../controllers/product/variations.js";
import {
  DEFAULT_IMG_PATH,
  DISPLAY_MSG_TIMEOUT,
  VARIATION_IMG_PATH
} from "../settings.js";
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
} from "../utils.js";
import { getOSList } from "../controllers/product/os.js";
import { closeForm, closePopup } from "./components.js";
import {
  createInstance,
  getInstanceBySerialNum,
  getInstanceByIMEI
} from "../controllers/product/instances.js";


const crudVariationMsg = $("#crud-variation-msg");
const backdrop = $("#backdrop");
const resultCount = $("#result-count");
const tbody = $("#tbody");

function renderSearchVariationForm() {
  const form = $("#search-variation-form");
  const searchBtn = form.find("#search-variation-form-search-btn");
  const clearBtn = form.find("#search-variation-form-clear-btn");

  clearBtn.click(async () => {
    clearBtn.prop("disabled", true);
    clearBtn.text("clearing...");

    await renderVariationsData();

    clearBtn.text("clear search");
    clearBtn.prop("disabled", false);
  });

  form.submit(async e => {
    e.preventDefault();
    searchBtn.prop("disabled", true);
    searchBtn.text("searching...");

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

    searchBtn.text("search");
    searchBtn.prop("disabled", false);
  });
}

async function renderVariationsData(variationsList=null) {
  tbody.html("<tr><td colspan='12'>Loading data...</td></tr>");

  try {
    const variations = variationsList || await getVariationsList();

    tbody.html(() => {
      let dataHTML;

      variations.forEach((variation, idx) => {
        idx++;
        const img = variation.image_name ? `${VARIATION_IMG_PATH}/${variation.image_name}` : DEFAULT_IMG_PATH;

        dataHTML += `
          <tr
            class="content__tr--g"
            data-number="${idx}"
            data-variation-id="${variation.id}"
          >
            <td data-cell="n.o" class="content__td--g">${idx}</td>
            <td data-cell="id" class="content__td--g">${variation.id}</td>
            <td data-cell="image" class="content__td--g">
              <img src="${img}" class="content__img" alt="smartwatch" loading="lazy">
            </td>
            <td data-cell="product id" class="content__td--g">${variation.product_id}</td>
            <td data-cell="watch specs" class="content__td--g">
              <ul class="content__specs content__specs--watch">
                <li><h3>Watch size:</h3><p>${variation.watch_size_mm} mm</p></li>
                <li><h3>Display size:</h3><p>${variation.display_size_mm} mm</p></li>
                <li><h3>Display type:</h3><p>${variation.display_type}</p></li>
                <li><h3>Resolution:</h3><p>${variation.resolution_h_px} px <i class="uil uil-times"></i> ${variation.resolution_w_px} px</p></li>
                <li><h3>Memory:</h3><p>${variation.ram_bytes} bytes <i class="uil uil-times"></i> ${variation.rom_bytes} bytes</p></li>
                <li><h3>OS:</h3><p>${variation.os.name}</p></li>
                <li><h3>Connectivity:</h3><p>${variation.connectivity}</p></li>
                <li><h3>Battery:</h3><p>${variation.battery} mah</p></li>
                <li><h3>Water resistance:</h3><p>${variation.water_resistance_value} ${variation.water_resistance_unit}</p></li>
                <li><h3>Sensor:</h3><p>${variation.sensor}</p></li>
                <li><h3>Case material:</h3><p>${variation.case_material}</p></li>
                <li><h3>Total weight (+band):</h3><p>${variation.weight_milligrams} mg</p></li>
                <li><h3>Color:</h3><input type="color" value="${variation.watch_color}" disabled></li>
              </ul>
            </td>
            <td data-cell="band specs" class="content__td--g">
              <ul class="content__specs content__specs--band">
                <li><h3>Material:</h3><p>${variation.band_material}</p></li>
                <li><h3>Size:</h3><p>${variation.band_size_mm} mm</p></li>
                <li><h3>Color:</h3><input type="color" value="${variation.band_color}" disabled></li>
              </ul>
            </td>
            <td data-cell="release at" class="content__td--g">${convertUtcToLocalDatetime(variation.release_date)}</td>
            <td data-cell="base price" class="content__td--g">${variation.price_cents}</td>
            <td data-cell="sell price" class="content__td--g">${variation.base_price_cents}</td>
            <td data-cell="stock" class="content__td--g">
              ${variation.stock_quantity}
              <button class="js-add-instance-btn">add instance</button>
            </td>
            <td data-cell="stop selling" class="content__td--g">${Boolean(variation.stop_selling)}</td>
            <td data-cell="actions" class="content__td--g">
              <button class="js-update-variation-btn">update</button>
              <button class="js-delete-variation-btn">delete</button>
            </td>
          </tr>
        `;
      });

      return dataHTML || "<tr><td colspan='12'>No data found!</td></tr>";
    });

    tbody.find(".js-add-instance-btn").click(e => {
      const tr = $(e.currentTarget).closest("tr");
      const variationNum = tr.data("number");
      const variationId = tr.data("variation-id");

      console.log(`Add instance for variation id ${variationId}`);
      renderAddInstanceForm(variationNum, variationId);
    });

    tbody.find(".js-update-variation-btn").click(e => {
      const tr = $(e.currentTarget).closest("tr");
      const variationNum = tr.data("number");
      const variationId = tr.data("variation-id");

      console.log(`Update variation id ${variationId}`);
      renderUpdateVariationForm(variationNum, variationId);
    });

    tbody.find(".js-delete-variation-btn").click(e => {
      const tr = $(e.currentTarget).closest("tr");
      const variationNum = tr.data("number");
      const variationId = tr.data("variation-id");

      console.log(`Delete variation id ${variationId}`);
      renderDelVariationPopup(variationNum, variationId);
    });

    resultCount.text(variations.length);

  } catch(error) {
    console.error(`Error: ${error.message}`);
    tbody.html(`<tr><td colspan='12'>Error loading data: ${error.message}</td></tr>`);
  }
}

async function renderUpdateVariationForm(number, id) {
 disableBgScroll();
 backdrop.html("<p>Loading update variation form...");
 backdrop.show();

  try {
    const variation = await getVariation(id);
    const os = await getOSList();
    const img = variation.image_name && `${VARIATION_IMG_PATH}/${variation.image_name}`;

    const osHTML = os.map(os => (
      `<option
        value="${os.id}"
        ${os.id == variation.os.id && "selected"}
      >${os.name}</option>`
    )).join("");

    backdrop.html(`
      <form class="form--g update-variation-form" id="update-variation-form">
        <button type="button" class="form__close--g js-update-variation-form-close-btn">
          <i class="uil uil-times"></i>
        </button>
        <h2 class="form__title--g">Update variation id ${id} - number ${number} form</h2>

        <div class="update-variation-form-img">
          <img
            src="${img || DEFAULT_IMG_PATH}"
            alt="smartwatch"
            id="update-variation-form-img-display"
          >

          <div>
            <label for="img">Select an image:</label>
            <input
              type="file"
              id="img"
              name="image"
              accept="image/webp"
            >
          </div>

          <button
            id="update-variation-form-img-remove-btn"
            type="button"
            style="display: ${!img && "none"};"
          >remove image</button>

          <span id="img-msg"></span>
        </div>

        <div class="update-variation-form__input">
          <label for="watch-size">Watch size:</label>
          <input
            type="number"
            name="watch_size_mm"
            id="watch-size"
            value="${variation.watch_size_mm}"
            placeholder="0"
          >
          <span>mm</span>
          <span id="watch-size-msg"></span>
        </div>

        <div class="update-variation-form__input">
          <label for="watch-color">Watch color:</label>
          <input
            type="color"
            name="watch_color"
            id="watch-color"
            value="${variation.watch_color}"
          >
        </div>

        <div class="update-variation-form__input">
          <label for="base-price">Base(stock) price:</label>
          <input
            type="number"
            name="base_price_cents"
            id="base-price"
            value="${variation.base_price_cents}"
            placeholder="0"
          >
          <span>&#162;</span>
          <span id="base-price-msg"></span>
        </div>

        <div class="update-variation-form__input">
          <label for="sell-price">Sell price:</label>
          <input
            type="number"
            name="price_cents"
            id="sell-price"
            value="${variation.price_cents}"
            placeholder="0"
          >
          <span>&#162;</span>
          <span id="sell-price-msg"></span>
        </div>

        <div class="update-variation-form__input">
          <label for="display-size">Display size:</label>
          <input
            type="number"
            name="display_size_mm"
            id="display-size"
            value="${variation.display_size_mm}"
            placeholder="0"
          >
          <span>mm</span>
          <span id="display-size-msg"></span>
        </div>

        <div class="update-variation-form__input">
          <label for="display-type">Display type:</label>
          <input
            type="text"
            name="display_type"
            id="display-type"
            value="${variation.display_type}"
            placeholder="amoled"
          >
          <span id="display-type-msg"></span>
        </div>

        <div class="update-variation-form__input">
          <p>Resolution:</p>
          <div>
            <label for="resolution_h" hidden></label>
            <input
              type="number"
              name="resolution_h_px"
              id="resolution_h"
              value="${variation.resolution_h_px}"
              placeholder="0"
            >
            <span>px</span>

            <i class="uil uil-times"></i>

            <label for="resolution_w" hidden></label>
            <input
              type="number"
              name="resolution_w_px"
              id="resolution_w"
              value="${variation.resolution_w_px}"
              placeholder="0"
            >

            <span>px</span>
          </div>
          <span id="resolution-msg"></span>
        </div>

        <div class="update-variation-form__input">
          <p>Memory:</p>
          <div>
            <label for="ram" hidden></label>
            <input
              type="number"
              name="ram_bytes"
              id="ram"
              value="${variation.ram_bytes}"
              placeholder="0"
            >
            <span>bytes of RAM</span>

            <i class="uil uil-times"></i>

            <label for="rom" hidden></label>
            <input
              type="number"
              name="rom_bytes"
              id="rom"
              value="${variation.rom_bytes}"
              placeholder="0"
            >
            <span>bytes of ROM</span>
          </div>
          <span id="memory-msg"></span>
        </div>

        <div class="update-variation-form__input">
          <label for="os">OS:</label>
          <select name="os_id" id="os">${osHTML}</select>
          <span id="os-msg"></span>
        </div>

        <div class="update-variation-form__input">
          <label for="connectivity">Connectivity:</label>
          <input
            type="text"
            name="connectivity"
            id="connectivity"
            value="${variation.connectivity}"
            placeholder="wifi, bluetooth,..."
          >
          <span id="connectivity-msg"></span>
        </div>

        <div class="update-variation-form__input">
          <label for="battery">Battery capacity:</label>
          <input
            type="number"
            name="battery_life_mah"
            id="battery"
            value="${variation.battery_life_mah}"
            placeholder="0"
          >
          <span>mah</span>
          <span id="battery-msg"></span>
        </div>

        <div class="update-variation-form__input">
          <p>Water resistance:</p>
          <div>
            <label for="resistance-value">value</label>
            <input
              type="text"
              name="water_resistance_value"
              id="resistance-value"
              value="${variation.water_resistance_value}"
              placeholder="5"
            >
            <label for="resistance-unit">unit</label>
            <input
              type="text"
              name="water_resistance_unit"
              id="resistance-unit"
              value="${variation.water_resistance_unit}"
              placeholder="atm"
            >
          </div>
          <span id="resistance-msg"></span>
        </div>

        <div class="update-variation-form__input">
          <label for="sensor">Sensor:</label>
          <input
            type="text"
            name="sensor"
            id="sensor"
            value="${variation.sensor}"
            placeholder="accelerometer, magnetometer,..."
          >
          <span id="sensor-msg"></span>
        </div>

        <div class="update-variation-form__input">
          <label for="case-material">Case material:</label>
          <input
            type="text"
            name="case_material"
            id="case-material"
            value="${variation.case_material}"
            placeholder="standless steel"
          >
          <span id="case-material-msg"></span>
        </div>

        <div class="update-variation-form__input">
          <label for="band-material">Band material:</label>
          <input
            type="text"
            name="band_material"
            id="band-material"
            value="${variation.band_material}"
            placeholder="silicone"
          >
          <span id="band-material-msg"></span>
        </div>

        <div class="update-variation-form__input">
          <label for="band-size">Band size:</label>
          <input
            type="number"
            name="band_size_mm"
            id="band-size"
            value="${variation.band_size_mm}"
            placeholder="0"
          >
          <span>mm</span>
          <span id="band-size-msg"></span>
        </div>

        <div class="update-variation-form__input">
          <label for="band-color">Band color:</label>
          <input
            type="color"
            name="band_color"
            id="band-color"
            value="${variation.band_color}"
            placeholder="#000000"
          >
          <span id="band-color-msg"></span>
        </div>

        <div class="update-variation-form__input">
          <label for="weight">Total weight: </label>
          <input
            type="number"
            name="weight_milligrams"
            id="weight"
            value="${variation.weight_milligrams}"
            placeholder="0"
          >
          <span>mg</span>
          <span id="weight-msg"></span>
        </div>

        <div class="update-variation-form__input">
          <label for="release-date">Release at:</label>
          <input
            type="datetime-local"
            name="release_date"
            value="${convertUtcToLocalDatetime(variation.release_date)}"
            id="release-date"
          >
          <span id="release-date-msg"></span>
        </div>

        <div class="update-variation-form__input">
          <label for="stop-selling">Stop selling</label>
          <input
            type="checkbox"
            name="stop_selling"
            id="stop-selling"
            ${variation.stop_selling && "checked"}
          >
        </div>

        <div>
          <button type="submit" id="update-variation-form-submit-btn">update</button>
          <button type="button" class="js-update-variation-form-close-btn">cancel</button>
        </div>

        <span id="submit-msg"></span>
      </form>
    `);

    const form = backdrop.find("#update-variation-form");

    form.find(".js-update-variation-form-close-btn").click(() => closeForm(backdrop));

    let isRemoveImg = false; // Handle update image logic when submit
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
      submitBtn.text("updating variation...");

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
          (formData.get("image") && formData.get("image") !== "null") ? formData : Object.fromEntries(formData) // Only use FormData within file
        );

        if(res.success) {
          crudVariationMsg.text(`* variation id ${id} - number ${number} was updated`);
          setTimeout(() => {
            crudVariationMsg.text("");
          }, DISPLAY_MSG_TIMEOUT);
          renderVariationsData(); // Re-render
          closeForm(backdrop);
          return;
        }

        form.find("#submit-msg").text(`Error: ${res.message}`);
      }

      submitBtn.text("update");
      submitBtn.prop("disabled", false);
    });
  } catch(error) {
    console.error(`Error: ${error.message}`);
    backdrop.html(`<p>Error loading update variation form: ${error.message}</p>`);
  }
}

async function renderDelVariationPopup(number, id) {
  disableBgScroll();

  backdrop.html(`
    <div class="form--g">
      <button class="form__close--g js-delete-variation-popup-close-btn"><i class="uil uil-times"></i></button>
      <h2 class="form__title--g">Confirm delete variation id ${id} - number ${number}?</h2>

      <div>
        <button id="delete-variation-popup-submit-btn">delete</button>
        <button class="js-delete-variation-popup-close-btn">cancel</button>
      </div>

      <span id="delete-variation-popup-msg"></span>
    </div>
  `);

  backdrop.find(".js-delete-variation-popup-close-btn").click(() => {closePopup(backdrop)});

  const submitBtn = backdrop.find("#delete-variation-popup-submit-btn");
  submitBtn.click(async () => {
    submitBtn.prop("disabled", true);
    submitBtn.text("deleting...");

    const res = await deleteVariation(id);

    if(res.success) {
      crudVariationMsg.text(`* variation id ${id} - number ${number} was deleted`);
      setTimeout(() => {
        crudVariationMsg.text("");
      }, DISPLAY_MSG_TIMEOUT);
      renderVariationsData(); // Re-render
      closePopup(backdrop);
      return;
    }

    submitBtn.text("delete");
    submitBtn.prop("disabled", false);
    backdrop.find("#delete-variation-popup-msg").text(`Error: ${res.message}`);
  });

  backdrop.show();
}

function renderAddInstanceForm(variationNumber, variationId) {
  disableBgScroll();
  backdrop.html("<p>Loading add instance form...");
  backdrop.show();

  try {
    backdrop.html(`
       <form class="form--g" id="add-instance-form">
        <button type="button" class="form__close--g js-add-instance-form-close-btn">
          <i class="uil uil-times"></i>
        </button>
        <h2 class="form__title--g">Add instance for product variation id ${variationId} - number ${variationNumber} form</h2>

        <div>
          <label for="serial-number">Supplier serial-number:</label>
          <input
            type="text"
            name="supplier_serial_number"
            id="serial-number"
          >
          <span id="serial-number-msg"></span>
        </div>

        <div>
          <label for="imei-number">Supplier IMEI-number:</label>
          <input
            type="text"
            name="supplier_imei_number"
            id="imei-number"
            placeholder="none"
          >
          <span id="imei-number-msg"></span>
        </div>

        <div>
          <label for="is_sold">Is sold</label>
          <input type="checkbox" name="is_sold" id="is_sold">
        </div>

        <div>
          <button type="submit" id="add-instance-form-submit-btn">add</button>
          <button type="button" class="js-add-instance-form-close-btn">cancel</button>
        </div>

        <span id="submit-msg"></span>
      </form>
    `);

    const form = backdrop.find("#add-instance-form");

    form.find(".js-add-instance-form-close-btn").click(() => closeForm(backdrop));

    form.submit(async e => {
      e.preventDefault();

      const submitBtn = form.find("#add-instance-form-submit-btn");
      submitBtn.prop("disabled", true);
      submitBtn.text("adding instance...");

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
        } else if(await getInstanceBySerialNum(serialNum)) {
          serialNumMsg.text("* serial number already exists");
          allValid = false;
        } else {
          serialNumMsg.text("");
        }

        const imeiNum = formData.get("supplier_imei_number");
        if(imeiNum) {
          if(!isValidIMEI(imeiNum)) {
            imeiNumMsg.text("* invalid IMEI number");
            allValid = false;
          } else if(await getInstanceByIMEI(imeiNum)) {
            imeiNumMsg.text("* IMEI number already exists");
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
        } else formData.delete("is_sold");

        const res = await createInstance(Object.fromEntries(formData));

        if(res.success) {
          crudVariationMsg.text(`* new instance sku '${res.data.sku}' was added to variation id '${variationId}'`);
          setTimeout(() => {
            crudVariationMsg.text("");
          }, DISPLAY_MSG_TIMEOUT);
          renderVariationsData(); // Re-render
          closeForm(backdrop);
          return;
        }

        form.find("#submit-msg").text(`Error: ${res.message}`);
      }

      submitBtn.text("add");
      submitBtn.prop("disabled", false);

    });

  } catch(error) {
    console.error(`Error: ${error.message}`);
    backdrop.html(`<p>Error loading add instance form: ${error.message}</p>`);
  }

}

renderSearchVariationForm();
renderVariationsData();