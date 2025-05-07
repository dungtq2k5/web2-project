import { hasPermission } from "../models/auth.js";
import {
  getInstance,
  getInstancesList,
  updateInstance,
  deleteInstance,
  getFilterInstancesList
} from "../models/product/instances.js";
import { getVariation } from "../models/product/variations.js";
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

const canUpdate = hasPermission("UPDATE_PRODUCT_INSTANCE");
const canDelete = hasPermission("DELETE_PRODUCT_INSTANCE");

function renderSearchInstancesForm() {
  const form = $("#search-instances-form");
  const searchBtn = form.find("#search-instances-form-search-btn");
  const clearBtn = form.find("#search-instances-form-clear-btn");

  clearBtn.click(async () => {
    clearBtn.prop("disabled", true);
    clearBtn.text("Clearing...");

    await renderInstancesData();

    clearBtn.text("Clear search");
    clearBtn.prop("disabled", false);
  });

  form.submit(async e => {
    e.preventDefault();
    searchBtn.prop("disabled", true);
    searchBtn.text("Searching...");

    const formData = new FormData(form[0]);
    const filteredInstancesList = await getFilterInstancesList(
      formData.get("receipt_id") || null,
      formData.get("variation_id") || null,
      formData.get("is_sold") ? toBoolean(formData.get("is_sold")) : null
    );

    await renderInstancesData(filteredInstancesList);

    searchBtn.text("Search");
    searchBtn.prop("disabled", false);
  });
}

async function renderInstancesData(instancesList=null) {
  tbody.html("<tr><td colspan='9' class='p-3 text-center'>Loading data...</td></tr>");

  try {
    const instances = instancesList || await getInstancesList();

    let dataHTML;

    for(const [idx, instance] of instances.entries()) {
      const variation = await getVariation(instance.product_variation_id);
      const variationImg = variation && variation.image_name
        ? `${VARIATION_IMG_PATH}/${variation.image_name}`
        : DEFAULT_IMG_PATH
      ;

      dataHTML += `
        <tr
          class="align-middle"
          data-instance-number="${idx+1}"
          data-instance-sku="${instance.sku}"
          data-variation-id="${instance.product_variation_id}"
        >
          <td data-cell="n.o" class="text-center p-2">${idx+1}</td>
          <td data-cell="sku" class="p-2">${instance.sku}</td>
          <td data-cell="image" class="text-center p-1">
            <img
              src="${variationImg}"
              width="60"
              height="60"
              class="img-thumbnail"
              alt="Variation Image"
              loading="lazy"
              style="object-fit: cover;"
            >
          </td>
          <td data-cell="variation id" class="p-2 text-center">${instance.product_variation_id}</td>
          <td data-cell="serial-number" class="p-2">${instance.supplier_serial_number}</td>
          <td data-cell="IMEI-number" class="p-2">${instance.supplier_imei_number || "<span class='text-muted'>N/A</span>"}</td>
          <td data-cell="receipt note id" class="p-2 text-center">${instance.goods_receipt_note_id || "<span class='text-muted'>N/A</span>"}</td>
          <td data-cell="is sold" class="text-center p-2">
            ${
              instance.is_sold
                ? "<span class='badge bg-success'>Sold</span>"
                : "<span class='badge bg-secondary'>Available</span>"
            }
          </td>
          <td data-cell="actions" class="text-center p-2">
            <div class="btn-group-sm">
            ${
              canUpdate
                ? `<button
                    class='js-update-instance-btn btn btn-info'
                    title="Update instance"
                  >
                    <i class='uil uil-pen'></i>
                  </button>`
                : ""
            }
            ${
              canDelete
                ? `<button
                    class='js-delete-instance-btn btn btn-danger'
                    title="Delete instance"
                  >
                    <i class="uil uil-trash"></i>
                  </button>`
                : ""
            }
            ${!canUpdate && !canDelete ? "<span class='text-muted'>No actions</span>" : ""}
            </div>
          </td>
        </tr>
      `;
      // TODO next...
    }

    tbody.html(dataHTML || "<tr><td colspan='9' class='p-3 text-center'>No data found!</td></tr>");

    if(canUpdate) {
      tbody.find(".js-update-instance-btn").click(e => {
        const tr = $(e.currentTarget).closest("tr");
        const instanceNum = tr.data("instance-number");
        const instanceSku = tr.data("instance-sku");

        console.log(`Update is sold instance sku ${instanceSku}`);
        renderUpdateInstanceForm(instanceNum, instanceSku);
      });
    }

    if(canDelete) {
      tbody.find(".js-delete-instance-btn").click(e => {
        const tr = $(e.currentTarget).closest("tr");
        const instanceNum = tr.data("instance-number");
        const instanceSku = tr.data("instance-sku");
        const variationId = tr.data("variation-id");

        console.log(`Delete instance sku ${instanceSku}`);
        renderDelInstancePopup(instanceNum, instanceSku, variationId);
      });
    }

    resultCount.text(instances.length);

  } catch(error) {
    console.error(`Error: ${error.message}`);
    tbody.html(`<tr><td colspan='9' class="p-3 text-center table-danger">Error loading data: ${error.message}</td></tr>`);
  }
}

async function renderUpdateInstanceForm(number, sku) {
  disableBgScroll();
  backdrop.html("<div class='d-flex justify-content-center align-items-center' style='height: 100vh;'><div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading update instance form...</span></div></div>");
  backdrop.show();

  try {
    const instance = await getInstance(sku);

    backdrop.html(`
      <div class="card shadow-lg m-3 m-md-5 mx-auto" style="max-width: 600px;">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h2 class="h5 mb-0">Update Instance #${number} (SKU: ${sku})</h2>
          <button type="button" class="btn-close js-update-instance-form-close-btn" aria-label="Close"></button>
        </div>
        <form id="update-instance-form">
          <div class="card-body">
            <div class="mb-3">
              <label for="serial-number" class="form-label">Supplier Serial Number:</label>
              <input
                type="text"
                name="supplier_serial_number"
                id="serial-number"
                class="form-control"
                placeholder="Enter serial number"
                value="${instance.supplier_serial_number}"
              >
              <small id="serial-number-msg" class="text-danger"></small>
            </div>

            <div class="mb-3">
              <label for="imei-number" class="form-label">Supplier IMEI Number: <small class='text-muted'>(Optional)</small></label>
              <input
                type="text"
                name="supplier_imei_number"
                id="imei-number"
                class="form-control"
                placeholder="Enter IMEI or leave blank"
                value="${instance.supplier_imei_number || ''}"
              >
              <small id="imei-number-msg" class="text-danger"></small>
            </div>

            <div class="mb-3">
              <label for="receipt-note-id" class="form-label">Goods Receipt Note ID: <small class='text-muted'>(Optional)</small></label>
              <input
                type="number"
                name="goods_receipt_note_id"
                id="receipt-note-id"
                class="form-control"
                min="1"
                placeholder="Enter note ID or leave blank"
                value="${instance.goods_receipt_note_id || ''}"
              >
              <small id="receipt-note-id-msg" class="text-danger"></small>
            </div>

            <div class="form-check mb-3">
              <input
                type="checkbox"
                name="is_sold"
                id="is-sold"
                class="form-check-input"
                ${instance.is_sold ? "checked" : ""}
              >
              <label for="is-sold" class="form-check-label">Is Sold</label>
            </div>
            <div id="submit-msg" class="text-danger"></div>
          </div>
          <div class="card-footer d-flex justify-content-end btn-group-sm gap-2">
            <button type="submit" id="update-instance-form-submit-btn" class="btn btn-dark">
              Update
            </button>
            <button type="button" class="btn btn-outline-dark js-update-instance-form-close-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    `);

    const form = backdrop.find("#update-instance-form");

    backdrop.find(".js-update-instance-form-close-btn").click(() => {closeForm(backdrop)});

    form.submit(async e => {
      e.preventDefault();

      const submitBtn = form.find("#update-instance-form-submit-btn");
      submitBtn.prop("disabled", true);
      submitBtn.text("Updating...");

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
        } else if(!isValidSerialNum(serialNum)) {
          serialNumMsg.text("* invalid serial number");
          allValid = false;
        } else {
          serialNumMsg.text("");
        }

        const imeiNum = formData.get("supplier_imei_number");
        if(imeiNum && !isValidIMEI(imeiNum)) {
          imeiNumMsg.text("* invalid IMEI number");
          allValid = false;
        } else {
          imeiNumMsg.text("");
        }

        return allValid;
      }

      if(await validateForm()) {
        formData.set("supplier_imei_number", formData.get("supplier_imei_number") || null);
        formData.set("goods_receipt_note_id", formData.get("goods_receipt_note_id") || null);

        const isSold = formData.get("is_sold") ? true : false;
        if(isSold != instance.is_sold) {
          formData.set("is_sold", isSold);
        } else {
          formData.delete("is_sold");
        }

        const res = await updateInstance(sku, Object.fromEntries(formData));

        if(res.success) {
          crudInstanceMsg.text(`* instance sku ${sku} - number ${number} was updated`);
          setTimeout(() => {
            crudInstanceMsg.text("");
          }, DISPLAY_MSG_TIMEOUT);
          renderInstancesData();
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
    backdrop.html(`<div class="alert alert-danger m-3">Error loading instance data: ${error.message}</div>`);
  }
}

async function renderDelInstancePopup(number, sku, variationId) {
  disableBgScroll();

  backdrop.html(`
    <div class="card shadow-lg m-3 m-md-5 mx-auto" style="max-width: 500px;">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h2 class="h5 mb-0">Confirm Deletion</h2>
        <button type="button" class="btn-close js-delete-instance-popup-close-btn" aria-label="Close"></button>
      </div>
      <div class="card-body">
        <p>Are you sure you want to delete instance #${number} (SKU: <strong>${sku}</strong>)?</p>
        <div id="delete-instance-popup-msg" class="text-danger mt-2"></div>
      </div>
      <div class="card-footer d-flex justify-content-end btn-group-sm gap-2">
        <button id="delete-instance-popup-submit-btn" class="btn btn-danger">
          Delete
        </button>
        <button type="button" class="btn btn-outline-dark js-delete-instance-popup-close-btn">
          Cancel
        </button>
      </div>
    </div>
  `);

  backdrop.find(".js-delete-instance-popup-close-btn").click(() => {closePopup(backdrop)});

  const submitBtn = backdrop.find("#delete-instance-popup-submit-btn");
  submitBtn.click(async () => {
    submitBtn.prop("disabled", true);
    submitBtn.text("Deleting...");

    const res = await deleteInstance(sku, variationId);

    if(res.success) {
      crudInstanceMsg.text(`* instance sku ${sku} - number ${number} was deleted`);
      setTimeout(() => {
        crudInstanceMsg.text("");
      }, DISPLAY_MSG_TIMEOUT);
      renderInstancesData();
      closePopup(backdrop);
      return;
    }

    submitBtn.text("Delete");
    submitBtn.prop("disabled", false);
    backdrop.find("#delete-instance-popup-msg").text(`Error: ${res.message}`);
  });

  backdrop.show();
}

renderInstancesData();
renderSearchInstancesForm();