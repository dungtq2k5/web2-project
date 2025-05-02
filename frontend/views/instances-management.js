import {
  getInstance,
  getInstancesList,
  updateInstance,
  deleteInstance,
  getFilterInstancesList,
  getInstanceBySerialNum,
  getInstanceByIMEI
} from "../controllers/product/instances.js";
import { getVariation } from "../controllers/product/variations.js";
import { getReceiptNote } from "../controllers/receipt-notes.js";
import {
  DEFAULT_IMG_PATH,
  VARIATION_IMG_PATH,
  DISPLAY_MSG_TIMEOUT
 } from "../settings.js";
import {
  disableBgScroll,
  filterTextInputsInFormData,
  toBoolean,
  isValidSerialNum,
  isValidIMEI
} from "../utils.js";
import { closeForm, closePopup } from "./components.js";


const crudInstanceMsg = $("#crud-instance-msg");
const backdrop = $("#backdrop");
const resultCount = $("#result-count");
const tbody = $("#tbody");

function renderSearchInstancesForm() {
  const form = $("#search-instances-form");
  const searchBtn = form.find("#search-instances-form-search-btn");
  const clearBtn = form.find("#search-instances-form-clear-btn");

  clearBtn.click(async () => {
    clearBtn.prop("disabled", true);
    clearBtn.text("clearing...");

    await renderInstancesData();

    clearBtn.text("clear search");
    clearBtn.prop("disabled", false);
  });

  form.submit(async e => {
    e.preventDefault();
    searchBtn.prop("disabled", true);
    searchBtn.text("searching...");

    const formData = new FormData(form[0]);
    const filteredInstancesList = await getFilterInstancesList(
      formData.get("receipt_id") || null,
      formData.get("variation_id") || null,
      formData.get("is_sold") ? toBoolean(formData.get("is_sold")) : null
    );

    await renderInstancesData(filteredInstancesList);

    searchBtn.text("search");
    searchBtn.prop("disabled", false);
  });
}

async function renderInstancesData(instancesList=null) {
  tbody.html("<tr><td colspan='7'>Loading data...</td></tr>");

  try {
    const instances = instancesList || await getInstancesList();

    let dataHTML;
    for(const [idx, instance] of instances.entries()) {
      const variation = await getVariation(instance.product_variation_id);
      const variationImg = variation.image_name ? `${VARIATION_IMG_PATH}/${variation.image_name}` : DEFAULT_IMG_PATH;

      dataHTML += `
        <tr
          class="content__tr--g"
          data-instance-number="${idx+1}"
          data-instance-sku="${instance.sku}"
          data-variation-id="${instance.product_variation_id}"
        >
          <td data-cell="n.o" class="content__td--g">${idx+1}</td>
          <td data-cell="sku" class="content__td--g">${instance.sku}</td>
          <td data-cell="image" class="content__td--g">
            <img
              src="${variationImg}"
              min-width="66"
              min-height="50"
              class="content__img"
              alt="smartwatch"
              loading="lazy"
            >
          </td>
          <td data-cell="variation id" class="content__td--g">${instance.product_variation_id}</td>
          <td data-cell="serial-number" class="content__td--g">${instance.supplier_serial_number}</td>
          <td data-cell="IMEI-number" class="content__td--g">${instance.supplier_imei_number || "none"}</td>
          <td data-cell="receipt note id" class="content__td--g">${instance.goods_receipt_note_id}</td>
          <td data-cell="is sold" class="content__td--g">${Boolean(instance.is_sold)}</td>
          <td data-cell="actions" class="content__td--g">
            <button class="js-delete-instance-btn">delete</button>
            <button class="js-update-instance-btn">update</button>
          </td>
        </tr>
      `;
    }

    tbody.html(dataHTML || "<tr><td colspan='7'>No data found!</td></tr>");

    tbody.find(".js-update-instance-btn").click(e => {
      const tr = $(e.currentTarget).closest("tr");
      const instanceNum = tr.data("instance-number");
      const instanceSku = tr.data("instance-sku");

      console.log(`Update is sold instance sku ${instanceSku}`);
      renderUpdateInstanceForm(instanceNum, instanceSku);
    });

    tbody.find(".js-delete-instance-btn").click(e => {
      const tr = $(e.currentTarget).closest("tr");
      const instanceNum = tr.data("instance-number");
      const instanceSku = tr.data("instance-sku");
      const variationId = tr.data("variation-id");

      console.log(`Delete instance sku ${instanceSku}`);
      renderDelInstancePopup(instanceNum, instanceSku, variationId);
    });

    resultCount.text(instances.length);

  } catch(error) {
    console.error(`Error: ${error.message}`);
    tbody.html(`<tr><td colspan='7'>Error loading data: ${error.message}</td></tr>`);
  }
}

async function renderUpdateInstanceForm(number, sku) {
  disableBgScroll();
  backdrop.html("<p>Loading update instance form...");
  backdrop.show();

  try {
    const instance = await getInstance(sku);

    backdrop.html(`
      <form class="form--g" id="update-instance-form">
        <button type="button" class="form__close--g js-update-instance-form-close-btn">
          <i class="uil uil-times"></i>
        </button>
        <h2 class="form__title--g">Update product instance sku ${sku} - number ${number} form</h2>

        <div>
          <label for="serial-number">Supplier serial-number:</label>
          <input
            type="text"
            name="supplier_serial_number"
            id="serial-number"
            placeholder="${instance.supplier_serial_number}"
            value="${instance.supplier_serial_number}"
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
            value="${instance.supplier_imei_number || ''}"
            title="Enter IMEI number or leave blank as none"
          >
          <span id="imei-number-msg"></span>
        </div>

        <div>
          <label for="receipt-note-id">Goods receipt note id:</label>
          <input
            type="number"
            name="goods_receipt_note_id"
            id="receipt-note-id"
            min="1"
            placeholder="none"
            value="${instance.goods_receipt_note_id || ''}"
            title="Enter note id or leave blank as a none"
          >
          <span id="receipt-note-id-msg"></span>
        </div>

        <div>
          <label for="is-sold">Is sold:</label>
          <input
            type="checkbox"
            name="is_sold"
            id="is-sold"
            ${instance.is_sold ? "checked" : ""}
          >
        </div>

        <div>
          <button type="submit" id="update-instance-form-submit-btn">update</button>
          <button type="button" class="js-update-instance-form-close-btn">cancel</button>
        </div>

        <span id="submit-msg"></span>
      </form>
    `);

    const form = backdrop.find("#update-instance-form");

    form.find(".js-update-instance-form-close-btn").click(() => {closeForm(backdrop)});

    form.submit(async e => {
      e.preventDefault();

      const submitBtn = form.find("#update-instance-form-submit-btn");
      submitBtn.prop("disabled", true);
      submitBtn.text("updating...");

      const formData = filterTextInputsInFormData(new FormData(form[0]));

      const serialNumMsg = form.find("#serial-number-msg");
      const imeiNumMsg = form.find("#imei-number-msg");
      const receiptNoteMsg = form.find("#receipt-note-id-msg");

      const validateForm = async () => {
        let allValid = true;

        const serialNum = formData.get("supplier_serial_number");
        if(!serialNum) {
          serialNumMsg.text("* required");
          allValid = false;
        } else if(serialNum != instance.supplier_serial_number) {
          if(!isValidSerialNum(serialNum)) {
            serialNumMsg.text("* invalid serial number");
            allValid = false;
          } else if(await getInstanceBySerialNum(serialNum)) {
            serialNumMsg.text("* serial number already exists");
            allValid = false;
          } else {
            serialNumMsg.text("");
          }
        } else {
          serialNumMsg.text("");
        }

        const imeiNum = formData.get("supplier_imei_number");
        if(imeiNum && imeiNum != instance.supplier_imei_number) {
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

        const receiptNoteId = formData.get("goods_receipt_note_id");
        if(receiptNoteId && receiptNoteId != instance.goods_receipt_note_id) {
          if(receiptNoteId <= 0) {
            receiptNoteMsg.text("Receipt note id can't smaller than 1");
            allValid = false
          } else if(!await getReceiptNote(parseInt(receiptNoteId))) {
            receiptNoteMsg.text(`Receipt note id '${receiptNoteId}' doesn't exist, please check again`);
            allValid = false
          } else {
            receiptNoteMsg.text("");
          }
        } else {
          receiptNoteMsg.text("");
        }

        return allValid;
      }

      if(await validateForm()) {
        formData.set("supplier_imei_number", formData.get("supplier_imei_number") || null);
        formData.set("goods_receipt_note_id", formData.get("goods_receipt_note_id") || null);

        const isSold = formData.get("is_sold") ? true : false;
        if(isSold != instance.is_sold) { // Only update is_sold if changed, because there is a rich calculation in backend
          formData.set("is_sold", isSold);
        } else {
          formData.delete("is_sold");
        }

        const res = await updateInstance(sku, instance, Object.fromEntries(formData));

        if(res.success) {
          crudInstanceMsg.text(`* instance sku ${sku} - number ${number} was updated`);
          setTimeout(() => {
            crudInstanceMsg.text("");
          }, DISPLAY_MSG_TIMEOUT);
          renderInstancesData(); // Re-render
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
    backdrop.html(`<p>Error loading instance data: ${error.message}</p>`);
  }
}

async function renderDelInstancePopup(number, sku, variationId) {
  disableBgScroll();

  backdrop.html(`
    <div class="form--g">
      <button class="form__close--g js-delete-instance-popup-close-btn"><i class="uil uil-times"></i></button>
      <h2 class="form__title--g">Confirm delete instance sku ${sku} - number ${number}?</h2>

      <div>
        <button id="delete-instance-popup-submit-btn">delete</button>
        <button class="js-delete-instance-popup-close-btn">cancel</button>
      </div>

      <span id="delete-instance-popup-msg"></span>
    </div>
  `);

  backdrop.find(".js-delete-instance-popup-close-btn").click(() => {closePopup(backdrop)});

  const submitBtn = backdrop.find("#delete-instance-popup-submit-btn");
  submitBtn.click(async () => {
    submitBtn.prop("disabled", true);
    submitBtn.text("deleting...");

    const res = await deleteInstance(sku, variationId);

    if(res.success) {
      crudInstanceMsg.text(`* instance sku ${sku} - number ${number} was deleted`);
      setTimeout(() => {
        crudInstanceMsg.text("");
      }, DISPLAY_MSG_TIMEOUT);
      renderInstancesData(); // Re-render
      closePopup(backdrop);
      return;
    }

    submitBtn.text("delete");
    submitBtn.prop("disabled", false);
    backdrop.find("#delete-instance-popup-msg").text(`Error: ${res.message}`);
  });

  backdrop.show();
}

renderInstancesData();
renderSearchInstancesForm();