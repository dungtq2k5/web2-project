import {
  deleteProduct,
  getProduct,
  getProductsList,
  updateProduct,
  createProduct,
  getFilterProductsList
} from "../models/product/products.js";
import { getBrandsList } from "../models/product/brands.js";
import { getCategoriesList } from "../models/product/categories.js";
import { createVariation, getVariationsByProductId } from "../models/product/variations.js";
import {
  disableBgScroll,
  isValidImg,
  readFileAsDataURL,
  isDateInPast,
  filterTextInputsInFormData,
  convertToMySQLDatetime,
  convertUtcToLocalDatetime
} from "../utils.js";
import { closeForm, closePopup } from "./components.js";
import {
  VARIATION_IMG_PATH,
  DEFAULT_IMG_PATH,
  PRODUCT_IMG_PATH,
  DISPLAY_MSG_TIMEOUT
} from "../settings.js";
import { getOSList } from "../models/product/os.js";
import { hasPermission } from "../models/auth.js";


const crudProductMsg = $("#crud-product-msg");
const backdrop = $("#backdrop");
const resultCount = $("#result-count");
const tbody = $("#tbody");

const canUpdate = hasPermission("UPDATE_PRODUCT");
const canDelete = hasPermission("DELETE_PRODUCT");
const canCreateVariation = hasPermission("CREATE_PRODUCT_VARIATION");
const canReadVariation = hasPermission("READ_PRODUCT_VARIATION");

if(hasPermission("CREATE_PRODUCT")) {
  $("#create-product-btn").click(() => {
    renderCreateProductForm();
    console.log("render create product form");
  });
} else {
  $("#create-product-btn").remove();
}

function renderSearchProductForm() {
  const form = $("#search-product-form");
  const searchInput = form.find("#search-product-form-input");
  const searchBtn = form.find("#search-product-form-search-btn");
  const clearBtn = form.find("#search-product-form-clear-btn");

  clearBtn.click(async () => {
    clearBtn.prop("disabled", true);
    clearBtn.text("Clearing...");

    await renderProductsData();

    clearBtn.text("Clear search");
    clearBtn.prop("disabled", false);
  });

  form.submit(async e => {
    e.preventDefault();
    searchBtn.prop("disabled", true);
    searchBtn.text("Searching...");

    const filteredProductsList = await getFilterProductsList(searchInput.val());
    await renderProductsData(filteredProductsList);

    searchBtn.text("Search");
    searchBtn.prop("disabled", false);
  });
}

async function renderProductsData(productsList=null) {
  tbody.html("<tr><td colspan='11' class='p-3 text-center'>Loading data...</td></tr>");

  try {
    const products = productsList || await getProductsList();

    let dataHTML;

    for(const [idx, product] of products.entries()) {
      const variations = await getVariationsByProductId(product.id);
      const img = product.image_name ? `${PRODUCT_IMG_PATH}/${product.image_name}` : DEFAULT_IMG_PATH;

      dataHTML += `
        <tr
          class="align-middle"
          data-number="${idx+1}"
          data-product-id="${product.id}"
        >
          <td data-cell="n.o" class="text-center p-2">${idx+1}</td>
          <td data-cell="id" class="text-center p-2">${product.id}</td>
          <td data-cell="image" class="text-center p-1">
            <img src="${img}" class="img-thumbnail" alt="Product Image" loading="lazy" width="70" height="70" style="object-fit: cover;">
          </td>
          <td data-cell="name" class="p-2">${product.name}</td>
          <td data-cell="model" class="p-2">${product.model}</td>
          <td data-cell="brand" class="p-2">${product.brand.name}</td>
          <td data-cell="category" class="p-2">${product.category.name}</td>
          <td data-cell="description" class="p-2 small">${product.description}</td>
          <td data-cell="stop selling" class="text-center p-2">
            ${product.stop_selling ? "<span class='badge bg-danger'>Yes</span>" : "<span class='badge bg-success'>No</span>"}
          </td>
          <td data-cell="total variations" class="text-center p-2">
            ${variations.length}
            ${
              (canReadVariation && variations.length)
              ? `<button
                  class="js-view-all-variations-btn btn btn-sm btn-outline-info"
                  title="View variations"
                >
                  <i class="uil uil-eye"></i> View
                </button>`
              : ""
            }
          </td>
          <td data-cell="actions" class="text-center p-2" style="min-width: 180px;">
            <div class="btn-group-vertical btn-group-sm d-grid gap-1">
              ${
                canUpdate
                ? `<button
                    class='js-update-product-btn btn btn-info'
                    title="Update product"
                  >
                    <i class='uil uil-pen'></i>
                  </button>`
                : ""
              }
              ${
                canDelete
                ? `<button
                    class='js-delete-product-btn btn btn-danger'
                    title="Delete product"
                  >
                    <i class='uil uil-trash'></i>
                  </button>`
                : ""
              }
              ${
                canCreateVariation
                  ? `<button
                      class='js-create-new-variation-btn btn btn-warning'
                      title="Create new variation"
                    >
                      <i class='uil uil-plus'></i> New variation
                    </button>`
                  : ""
              }
              ${
                !canUpdate && !canDelete && !canCreateVariation
                  ? `<span class="text-muted">No actions</span>`
                  : ""
              }
            </div>
          </td>
        </tr>
      `;
    }

    tbody.html(dataHTML || "<tr><td colspan='11' class='p-3 text-center'>No data found!</td></tr>");

    if(canReadVariation) {
      tbody.find(".js-view-all-variations-btn").click(e => {
        const tr = $(e.currentTarget).closest("tr");
        const productNum = tr.data("number");
        const productId = tr.data("product-id");

        console.log(`View variations of product id ${productId}`);
        renderProductVariationsPopup(productNum, productId);
      });
    }

    if(canUpdate) {
      tbody.find(".js-update-product-btn").click(e => {
        const tr = $(e.currentTarget).closest("tr");
        const productNum = tr.data("number");
        const productId = tr.data("product-id");

        console.log(`Update product id ${productId}`);
        renderUpdateProductForm(productNum, productId);
      });
    }

    if(canDelete) {
      tbody.find(".js-delete-product-btn").click(e => {
        const tr = $(e.currentTarget).closest("tr");
        const productNum = tr.data("number");
        const productId = tr.data("product-id");

        console.log(`Delete product id ${productId}`);
        renderDeleteProductPopup(productNum, productId);
      });
    }

    if(canCreateVariation) {
      tbody.find(".js-create-new-variation-btn").click(e => {
        const tr = $(e.currentTarget).closest("tr");
        const productNum = tr.data("number");
        const productId = tr.data("product-id");

        console.log(`Create new product variation id ${productId}`);
        renderCreateVariationForm(productNum, productId);
      });
    }

    resultCount.text(products.length);

  } catch(error) {
    console.error(`Error: ${error.message}`);
    tbody.html(`<tr><td colspan='11' class="p-3 text-center table-danger">Error loading data: ${error.message}</td></tr>`);
  }
}

async function renderProductVariationsPopup(number, id) {
  disableBgScroll();
  backdrop.html("<div class='d-flex justify-content-center align-items-center' style='height: 100vh;'><div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading product variations...</span></div></div>");
  backdrop.show();

  try {
    const variations = await getVariationsByProductId(id);
    const variationsHTML = variations.map(variation => {
      const img = variation.image_name ? `${VARIATION_IMG_PATH}/${variation.image_name}` : DEFAULT_IMG_PATH;

      return `
        <li class="list-group-item p-3">
          <div class="row align-items-center">
            <div class="col-md-2 text-center">
              <img src="${img}" alt="Variation Image" class="img-thumbnail mb-2" loading="lazy" style="width: 80px; height: 80px; object-fit: cover;">
            </div>
            <div class="col-md-10">
              <div class="row small">
                <div class="col-sm-6 col-md-4"><strong>ID:</strong> ${variation.id}</div>
                <div class="col-sm-6 col-md-4"><strong>Watch Size:</strong> ${variation.watch_size_mm}mm</div>
                <div class="col-sm-6 col-md-4"><strong>Watch Color:</strong> <input type="color" value="${variation.watch_color}" disabled class="form-control form-control-sm" style="width: 25px; height: 25px; padding: .1rem"></div>
                <div class="col-sm-6 col-md-4"><strong>Stock:</strong> ${variation.stock_quantity}</div>
                <div class="col-sm-6 col-md-4"><strong>Sell Price:</strong> ${variation.price_cents}&#162;</div>
                <div class="col-sm-6 col-md-4"><strong>Base Price:</strong> ${variation.base_price_cents}&#162;</div>
                <div class="col-sm-6 col-md-4"><strong>Display:</strong> ${variation.display_size_mm}mm, ${variation.display_type}</div>
                <div class="col-sm-6 col-md-4"><strong>Resolution:</strong> ${variation.resolution_h_px}x${variation.resolution_w_px}px</div>
                <div class="col-sm-6 col-md-4"><strong>Memory:</strong> ${variation.ram_bytes}B RAM / ${variation.rom_bytes}B ROM</div>
                <div class="col-sm-6 col-md-4"><strong>OS:</strong> ${variation.os.name}</div>
                <div class="col-sm-6 col-md-4"><strong>Connectivity:</strong> ${variation.connectivity}</div>
                <div class="col-sm-6 col-md-4"><strong>Battery:</strong> ${variation.battery_life_mah}mAh</div>
                <div class="col-sm-6 col-md-4"><strong>Water Resist:</strong> ${variation.water_resistance_value} ${variation.water_resistance_unit}</div>
                <div class="col-sm-6 col-md-4"><strong>Sensor:</strong> ${variation.sensor}</div>
                <div class="col-sm-6 col-md-4"><strong>Case:</strong> ${variation.case_material}</div>
                <div class="col-sm-6 col-md-4"><strong>Band:</strong> ${variation.band_material}, ${variation.band_size_mm}mm, <input type="color" value="${variation.band_color}" disabled class="form-control form-control-sm d-inline-block" style="width: 25px; height: 25px; padding: .1rem"></div>
                <div class="col-sm-6 col-md-4"><strong>Weight:</strong> ${variation.weight_milligrams}mg</div>
                <div class="col-sm-6 col-md-4"><strong>Released:</strong> ${convertUtcToLocalDatetime(variation.release_date)}</div>
              </div>
            </div>
          </div>
        </li>`;
    }).join("");

    backdrop.html(`
      <div class="card shadow-lg m-3 m-md-5 mx-auto" style="max-width: 900px; max-height: 90vh;">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h2 class="h5 mb-0">Variations for Product #${number} (ID: ${id})</h2>
          <button type="button" class="btn-close js-variations-popup-close-btn" aria-label="Close"></button>
        </div>
        <div class="card-body overflow-auto">
          ${variationsHTML ? `<ul class="list-group list-group-flush">${variationsHTML}</ul>` : '<p class="text-center text-muted">No variations found for this product.</p>'}
        </div>
        <div class="card-footer text-end">
          <button class="btn btn-dark btn-sm js-variations-popup-close-btn">Close</button>
        </div>
      </div>
    `);

    backdrop.find(".js-variations-popup-close-btn").click(() => closePopup(backdrop));

  } catch(error) {
    console.error(`Error: ${error.message}`);
    backdrop.html(`<div class="alert alert-danger m-3">Error loading product variations: ${error.message}</div>`);
  }
}

async function renderUpdateProductForm(number, id) {
  disableBgScroll();
  backdrop.html("<div class='d-flex justify-content-center align-items-center' style='height: 100vh;'><div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading update product form...</span></div></div>");
  backdrop.show();

  try {
    const product = await getProduct(id);
    const brands = await getBrandsList();
    const categories = await getCategoriesList();
    const img = product.image_name && `${PRODUCT_IMG_PATH}/${product.image_name}`;

    const brandsHTML = brands.map(brand => (
      `<option
        value="${brand.id}"
        ${brand.id == product.brand.id ? "selected" : ""}
      >${brand.name}</option>`
    )).join("");

    const categoriesHTML = categories.map(category => (
      `<option
        value="${category.id}"
        ${category.id == product.category.id ? "selected" : ""}
      >${category.name}</option>`
    )).join("");

    backdrop.html(`
      <div class="card shadow-lg m-3 m-md-5 mx-auto" style="max-width: 700px;">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h2 class="h5 mb-0">Update Product #${number} (ID: ${id})</h2>
          <button type="button" class="btn-close js-update-product-form-close-btn" aria-label="Close"></button>
        </div>
        <form id="update-product-form">
          <div class="card-body">
            <div class="row mb-3">
              <div class="col-md-4 text-center">
                <img
                  src="${img || DEFAULT_IMG_PATH}"
                  alt="Product Image Preview"
                  id="update-product-form-img-display"
                  class="img-thumbnail mb-2"
                  style="width: 150px; height: 150px; object-fit: cover;"
                >
                <input
                  type="file"
                  id="img"
                  name="image"
                  accept="image/webp"
                  class="form-control form-control-sm mb-1"
                >
                <button
                  type="button"
                  id="update-product-form-img-remove-btn"
                  class="btn btn-sm btn-outline-danger w-100"
                  style="display: ${!img ? "none" : "block"};"
                ><i class='uil uil-trash'></i> Remove Image</button>
                <small id="img-msg" class="text-danger d-block mt-1"></small>
              </div>
              <div class="col-md-8">
                <div class="mb-3">
                  <label for="name" class="form-label">Name <span class="text-danger">*</span></label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter product name"
                    value="${product.name}"
                    class="form-control"
                    required
                  >
                  <small id="name-msg" class="text-danger"></small>
                </div>
                <div class="mb-3">
                  <label for="model" class="form-label">Model <span class="text-danger">*</span></label>
                  <input
                    type="text"
                    id="model"
                    name="model"
                    placeholder="Enter product model"
                    value="${product.model}"
                    class="form-control"
                    required
                  >
                  <small id="model-msg" class="text-danger"></small>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="brand" class="form-label">Brand</label>
                <select id="brand" name="brand_id" class="form-select">${brandsHTML}</select>
              </div>
              <div class="col-md-6 mb-3">
                <label for="category" class="form-label">Category</label>
                <select id="category" name="category_id" class="form-select">${categoriesHTML}</select>
              </div>
            </div>

            <div class="mb-3">
              <label for="description" class="form-label">Description <span class="text-danger">*</span></label>
              <textarea
                id="description"
                name="description"
                placeholder="Enter product description"
                class="form-control"
                rows="3"
                required
              >${product.description}</textarea>
              <small id="description-msg" class="text-danger"></small>
            </div>

            <div class="form-check mb-3">
              <input
                type="checkbox"
                id="stop-selling"
                name="stop_selling"
                class="form-check-input"
                ${product.stop_selling ? "checked" : ""}
              >
              <label for="stop-selling" class="form-check-label">Stop selling this product</label>
            </div>
            <div id="submit-msg" class="text-danger"></div>
          </div>
          <div class="card-footer d-flex justify-content-end gap-2 btn-group-sm">
            <button type="submit" id="update-product-form-submit-btn" class="btn btn-dark">
              Update
            </button>
            <button type="button" class="btn btn-outline-dark js-update-product-form-close-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    `);

    const form = backdrop.find("#update-product-form");

    backdrop.find(".js-update-product-form-close-btn").click(() => closeForm(backdrop));

    let isRemoveImg = false; // Handle update image logic when submit
    const inputImg = form.find("#img");
    const imgDisplay = form.find("#update-product-form-img-display");
    const removeImgBtn = form.find("#update-product-form-img-remove-btn");

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

      const submitBtn = form.find("#update-product-form-submit-btn");
      submitBtn.prop("disabled", true);
      submitBtn.text("updating product...");

      const formData = filterTextInputsInFormData(new FormData(form[0]));

      const fileMsg = form.find("#img-msg");
      const nameMsg = form.find("#name-msg");
      const modelMsg = form.find("#model-msg");
      const descriptionMsg = form.find("#description-msg");

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

        if(!formData.get("name")) {
          nameMsg.text("* required");
          allValid = false;
        } else nameMsg.text("");

        if(!formData.get("model")) {
          modelMsg.text("* required");
          allValid = false;
        } else modelMsg.text("");

        if(!formData.get("description")) {
          descriptionMsg.text("* required");
          allValid = false;
        } else descriptionMsg.text("");

        return allValid;
      }

      if(await validateForm()) {
        if(isRemoveImg) {
          formData.set("image", "null");
        } else if(!formData.get("image")["name"]) {
          formData.delete("image");
        }
        if(formData.get("stop_selling")) {
          formData.set("stop_selling", true);
        } else formData.delete("stop_selling");

        const res = await updateProduct(
          id,
          (formData.get("image")
            && formData.get("image")["name"] !== "null")
            ? formData : Object.fromEntries(formData) // Only use FormData within file
        );

        if(res.success) {
          crudProductMsg.text(`* product id ${id} - number ${number} was updated`);
          setTimeout(() => {
            crudProductMsg.text("");
          }, DISPLAY_MSG_TIMEOUT);
          renderProductsData(); //re-render
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
    backdrop.html(`<div class="alert alert-danger m-3">Error loading product data: ${error.message}</div>`);
  }
}

function renderDeleteProductPopup(number, id) {
  disableBgScroll();

  backdrop.html(`
    <div class="card shadow-lg m-3 m-md-5 mx-auto" style="max-width: 500px;">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h2 class="h5 mb-0">Confirm Deletion</h2>
        <button type="button" class="btn-close js-delete-product-popup-close-btn" aria-label="Close"></button>
      </div>
      <div class="card-body">
        <p>Are you sure you want to delete product #${number} (ID: <strong>${id}</strong>)?</p>
        <div id="delete-product-popup-msg" class="text-danger mt-2"></div>
      </div>
      <div class="card-footer d-flex justify-content-end gap-2 btn-group-sm">
        <button id="delete-product-popup-submit-btn" class="btn btn-danger">
          Delete
        </button>
        <button type="button" class="btn btn-outline-dark js-delete-product-popup-close-btn">
          Cancel
        </button>
      </div>
    </div>
  `);

  backdrop.find(".js-delete-product-popup-close-btn").click(() => {closePopup(backdrop)});

  const submitBtn = backdrop.find("#delete-product-popup-submit-btn");
  submitBtn.click(async () => {
    submitBtn.prop("disabled", true);
    submitBtn.text("deleting...");

    const res = await deleteProduct(id);

    if(res.success) {
      crudProductMsg.text(`* user id ${id} - number ${number} was deleted`);
      setTimeout(() => {
        crudProductMsg.text("");
      }, DISPLAY_MSG_TIMEOUT);
      renderProductsData(); //Re-render
      closePopup(backdrop);
      return;
    }

    submitBtn.text("delete");
    submitBtn.prop("disabled", false);
    backdrop.find("#delete-product-popup-msg").text(`Error: ${res.message}`);
  });

  backdrop.show();
}

async function renderCreateProductForm() {
  disableBgScroll();
  backdrop.html("<div class='d-flex justify-content-center align-items-center' style='height: 100vh;'><div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading create product form...</span></div></div>");
  backdrop.show();

  try {
    const brands = await getBrandsList();
    const categories = await getCategoriesList();

    const brandsHTML = brands.map(brand => (
      `<option value="${brand.id}">${brand.name}</option>`
    )).join("");

    const categoriesHTML = categories.map(category => (
      `<option value="${category.id}">${category.name}</option>`
    )).join("");

    backdrop.html(`
      <div class="card shadow-lg m-3 m-md-5 mx-auto" style="max-width: 700px;">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h2 class="h5 mb-0">Create New Product</h2>
          <button type="button" class="btn-close js-create-product-form-close-btn" aria-label="Close"></button>
        </div>
        <form id="create-product-form">
          <div class="card-body">
            <div class="row mb-3">
              <div class="col-md-4 text-center">
                <img
                  src="${DEFAULT_IMG_PATH}"
                  alt="Product Image Preview"
                  id="create-product-form-img-display"
                  class="img-thumbnail mb-2"
                  style="width: 150px; height: 150px; object-fit: cover;"
                >
                <input
                  type="file"
                  id="img"
                  name="image"
                  accept="image/webp"
                  class="form-control form-control-sm mb-1"
                >
                <button
                  type="button"
                  id="create-product-form-img-remove-btn"
                  class="btn btn-sm btn-outline-danger w-100"
                  style="display: none;"
                ><i class='uil uil-trash'></i> Remove Image</button>
                <small id="img-msg" class="text-danger d-block mt-1"></small>
              </div>
              <div class="col-md-8">
                <div class="mb-3">
                  <label for="name" class="form-label">Name <span class="text-danger">*</span></label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter product name"
                    class="form-control"
                    required
                  >
                  <small id="name-msg" class="text-danger"></small>
                </div>
                <div class="mb-3">
                  <label for="model" class="form-label">Model <span class="text-danger">*</span></label>
                  <input
                    type="text"
                    id="model"
                    name="model"
                    placeholder="Enter product model"
                    class="form-control"
                    required
                  >
                  <small id="model-msg" class="text-danger"></small>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="brand" class="form-label">Brand</label>
                <select id="brand" name="brand_id" class="form-select">${brandsHTML}</select>
              </div>
              <div class="col-md-6 mb-3">
                <label for="category" class="form-label">Category</label>
                <select id="category" name="category_id" class="form-select">${categoriesHTML}</select>
              </div>
            </div>

            <div class="mb-3">
              <label for="description" class="form-label">Description <span class="text-danger">*</span></label>
              <textarea
                id="description"
                name="description"
                placeholder="Enter product description"
                class="form-control"
                rows="3"
                required
              ></textarea>
              <small id="description-msg" class="text-danger"></small>
            </div>

            <div class="form-check mb-3">
              <input
                type="checkbox"
                id="stop-selling"
                name="stop_selling"
                class="form-check-input"
              >
              <label for="stop-selling" class="form-check-label">Stop selling this product</label>
            </div>
            <div id="submit-msg" class="text-danger"></div>
          </div>
          <div class="card-footer d-flex justify-content-end gap-2 btn-group-sm">
            <button type="submit" id="create-product-form-submit-btn" class="btn btn-dark">
              Create
            </button>
            <button type="button" class="btn btn-outline-dark js-create-product-form-close-btn">Cancel</button>
          </div>
        </form>
      </div>
    `);

    const form = backdrop.find("#create-product-form");

    backdrop.find(".js-create-product-form-close-btn").click(() => closeForm(backdrop));

    const inputImg = form.find("#img");
    const imgDisplay = form.find("#create-product-form-img-display");
    const removeImgBtn = form.find("#create-product-form-img-remove-btn");

    inputImg.change(async e => {
      removeImgBtn.show();
      imgDisplay.prop("src", await readFileAsDataURL(e.target.files[0]));
    });

    removeImgBtn.click(() => {
      removeImgBtn.hide();
      inputImg.val("");
      imgDisplay.prop("src", DEFAULT_IMG_PATH);
    });

    form.submit(async e => {
      e.preventDefault();

      const submitBtn = form.find("#create-product-form-submit-btn");
      submitBtn.prop("disabled", true);
      submitBtn.text("creating product...");

      const formData = filterTextInputsInFormData(new FormData(form[0]));

      const fileMsg = form.find("#img-msg");
      const nameMsg = form.find("#name-msg");
      const modelMsg = form.find("#model-msg");
      const descriptionMsg = form.find("#description-msg");

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

        if(!formData.get("name")) {
          nameMsg.text("* required");
          allValid = false;
        } else nameMsg.text("");

        if(!formData.get("model")) {
          modelMsg.text("* required");
          allValid = false;
        } else modelMsg.text("");

        if(!formData.get("description")) {
          descriptionMsg.text("* required");
          allValid = false;
        } else descriptionMsg.text("");

        return allValid;
      }

      if(await validateForm()) {
        if(!formData.get("image")["name"]) formData.delete("image");
        if(formData.get("stop_selling")) {
          formData.set("stop_selling", true);
        } else formData.delete("stop_selling");

        const res = await createProduct(
          formData.get("image") ? formData : Object.fromEntries(formData) // Only send formData if has file, raw json otherwise
        );

        if(res.success) {
          crudProductMsg.text("* new product was created");
          setTimeout(() => {
            crudProductMsg.text("");
          }, DISPLAY_MSG_TIMEOUT);
          renderProductsData(); // Re-render
          closeForm(backdrop);
          return;
        }

        form.find("#submit-msg").text(`Error: ${res.message}`);
      }

      submitBtn.text("create");
      submitBtn.prop("disabled", false);
    });

  } catch(error) {
    console.error(`Error: ${error.message}`);
    backdrop.html(`<div class="alert alert-danger m-3">Error loading create product form: ${error.message}</div>`);
  }
}

async function renderCreateVariationForm(productNumber, productId) {
  disableBgScroll();
  backdrop.html("<div class='d-flex justify-content-center align-items-center' style='height: 100vh;'><div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading create variation form...</span></div></div>");
  backdrop.show();

  try {
    const osList = await getOSList(); // Renamed for clarity

    const osHTML = osList.map(os => (
      `<option value="${os.id}">${os.name}</option>`
    )).join("");

    backdrop.html(`
      <div class="card shadow-lg m-3 m-md-5 mx-auto" style="max-width: 900px;">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h2 class="h5 mb-0">Create Variation for Product #${productNumber} (ID: ${productId})</h2>
          <button type="button" class="btn-close js-create-variation-form-close-btn" aria-label="Close"></button>
        </div>
        <form id="create-variation-form">
          <div class="card-body" style="max-height: 75vh; overflow-y: auto;">
            <div class="row">
              <div class="col-md-3 text-center mb-3">
                <img
                  src="${DEFAULT_IMG_PATH}"
                  alt="Variation Image Preview"
                  id="create-variation-form-img-display"
                  class="img-thumbnail mb-2"
                  style="width: 150px; height: 150px; object-fit: cover;"
                >
                <input
                  type="file"
                  id="img"
                  name="image"
                  accept="image/webp"
                  class="form-control form-control-sm mb-1"
                >
                <button
                  id="create-variation-form-img-remove-btn"
                  type="button"
                  class="btn btn-sm btn-outline-danger w-100"
                  style="display: none;"
                ><i class='uil uil-trash'></i> Remove Image</button>
                <small id="img-msg" class="text-danger d-block mt-1"></small>
              </div>

              <div class="col-md-9">
                <div class="row">
                  <div class="col-md-4 mb-3">
                    <label for="watch-size" class="form-label">Watch Size (mm) <span class="text-danger">*</span></label>
                    <input type="number" name="watch_size_mm" id="watch-size" placeholder="e.g., 45" class="form-control" required>
                    <small id="watch-size-msg" class="text-danger"></small>
                  </div>
                  <div class="col-md-4 mb-3">
                    <label for="watch-color" class="form-label">Watch Color</label>
                    <input type="color" name="watch_color" id="watch-color" value="#000000" class="form-control form-control-color">
                  </div>
                   <div class="col-md-4 mb-3">
                    <label for="stock-quantity" class="form-label">Stock Quantity <span class="text-danger">*</span></label>
                    <input type="number" name="stock_quantity" id="stock-quantity" placeholder="e.g., 100" class="form-control" required>
                    <small id="stock-quantity-msg" class="text-danger"></small>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="base-price" class="form-label">Base Price (cents) <span class="text-danger">*</span></label>
                    <input type="number" name="base_price_cents" id="base-price" placeholder="e.g., 25000" class="form-control" required>
                    <small id="base-price-msg" class="text-danger"></small>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="sell-price" class="form-label">Sell Price (cents) <span class="text-danger">*</span></label>
                    <input type="number" name="price_cents" id="sell-price" placeholder="e.g., 29900" class="form-control" required>
                    <small id="sell-price-msg" class="text-danger"></small>
                  </div>
                </div>
              </div>
            </div>

            <hr class="my-4">
            <h6 class="mb-3 text-primary">Display & Memory</h6>
            <div class="row">
              <div class="col-md-4 mb-3">
                <label for="display-size" class="form-label">Display Size (mm) <span class="text-danger">*</span></label>
                <input type="number" name="display_size_mm" id="display-size" placeholder="e.g., 1.4" step="0.1" class="form-control" required>
                <small id="display-size-msg" class="text-danger"></small>
              </div>
              <div class="col-md-4 mb-3">
                <label for="display-type" class="form-label">Display Type <span class="text-danger">*</span></label>
                <input type="text" name="display_type" id="display-type" placeholder="e.g., AMOLED" class="form-control" required>
                <small id="display-type-msg" class="text-danger"></small>
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">Resolution (H x W) <span class="text-danger">*</span></label>
                <div class="input-group">
                  <input type="number" name="resolution_h_px" id="resolution_h" placeholder="Height" class="form-control" required>
                  <span class="input-group-text">x</span>
                  <input type="number" name="resolution_w_px" id="resolution_w" placeholder="Width" class="form-control" required>
                </div>
                <small id="resolution-msg" class="text-danger"></small>
              </div>
              <div class="col-md-6 mb-3">
                <label for="ram" class="form-label">RAM (bytes) <span class="text-danger">*</span></label>
                <input type="number" name="ram_bytes" id="ram" placeholder="e.g., 1024" class="form-control" required>
                <small id="ram-msg" class="text-danger"></small>
              </div>
              <div class="col-md-6 mb-3">
                <label for="rom" class="form-label">ROM (bytes) <span class="text-danger">*</span></label>
                <input type="number" name="rom_bytes" id="rom" placeholder="e.g., 8192" class="form-control" required>
                <small id="rom-msg" class="text-danger"></small> <!-- Combined from memory-msg -->
              </div>
            </div>

            <hr class="my-4">
            <h6 class="mb-3 text-primary">Connectivity & OS</h6>
            <div class="row">
              <div class="col-md-4 mb-3">
                <label for="os" class="form-label">Operating System</label>
                <select name="os_id" id="os" class="form-select">${osHTML}</select>
                <small id="os-msg" class="text-danger"></small>
              </div>
              <div class="col-md-8 mb-3">
                <label for="connectivity" class="form-label">Connectivity <span class="text-danger">*</span></label>
                <input type="text" name="connectivity" id="connectivity" placeholder="e.g., Wi-Fi, Bluetooth 5.0, NFC" class="form-control" required>
                <small id="connectivity-msg" class="text-danger"></small>
              </div>
            </div>

            <hr class="my-4">
            <h6 class="mb-3 text-primary">Physical Attributes</h6>
            <div class="row">
              <div class="col-md-4 mb-3">
                <label for="battery" class="form-label">Battery Capacity (mAh) <span class="text-danger">*</span></label>
                <input type="number" name="battery_life_mah" id="battery" placeholder="e.g., 300" class="form-control" required>
                <small id="battery-msg" class="text-danger"></small>
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">Water Resistance <span class="text-danger">*</span></label>
                <div class="input-group">
                  <input type="text" name="water_resistance_value" id="resistance-value" placeholder="Value" class="form-control" required>
                  <input type="text" name="water_resistance_unit" id="resistance-unit" placeholder="Unit (e.g., ATM)" class="form-control" required>
                </div>
                <small id="resistance-msg" class="text-danger"></small>
              </div>
              <div class="col-md-4 mb-3">
                <label for="weight" class="form-label">Total Weight (mg) <span class="text-danger">*</span></label>
                <input type="number" name="weight_milligrams" id="weight" placeholder="e.g., 50000" class="form-control" required>
                <small id="weight-msg" class="text-danger"></small>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12 mb-3">
                <label for="sensor" class="form-label">Sensors <span class="text-danger">*</span></label>
                <input type="text" name="sensor" id="sensor" placeholder="e.g., Accelerometer, Gyro, HRM, SpO2" class="form-control" required>
                <small id="sensor-msg" class="text-danger"></small>
              </div>
            </div>

            <hr class="my-4">
            <h6 class="mb-3 text-primary">Materials & Band</h6>
            <div class="row">
              <div class="col-md-4 mb-3">
                <label for="case-material" class="form-label">Case Material <span class="text-danger">*</span></label>
                <input type="text" name="case_material" id="case-material" placeholder="e.g., Stainless Steel" class="form-control" required>
                <small id="case-material-msg" class="text-danger"></small>
              </div>
              <div class="col-md-3 mb-3">
                <label for="band-material" class="form-label">Band Material <span class="text-danger">*</span></label>
                <input type="text" name="band_material" id="band-material" placeholder="e.g., Silicone" class="form-control" required>
                <small id="band-material-msg" class="text-danger"></small>
              </div>
              <div class="col-md-2 mb-3">
                <label for="band-size" class="form-label">Band Size (mm) <span class="text-danger">*</span></label>
                <input type="number" name="band_size_mm" id="band-size" placeholder="e.g., 22" class="form-control" required>
                <small id="band-size-msg" class="text-danger"></small>
              </div>
              <div class="col-md-3 mb-3">
                <label for="band-color" class="form-label">Band Color</label>
                <input type="color" name="band_color" id="band-color" value="#000000" class="form-control form-control-color">
                <small id="band-color-msg" class="text-danger"></small>
              </div>
            </div>

            <hr class="my-4">
            <h6 class="mb-3 text-primary">Other Details</h6>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="release-date" class="form-label">Release Date <span class="text-danger">*</span></label>
                <input type="datetime-local" name="release_date" id="release-date" class="form-control" required>
                <small id="release-date-msg" class="text-danger"></small>
              </div>
              <div class="col-md-6 mb-3 align-self-center">
                <div class="form-check mt-3">
                  <input type="checkbox" name="stop_selling" id="stop-selling" class="form-check-input">
                  <label for="stop-selling" class="form-check-label">Stop selling this variation</label>
                </div>
              </div>
            </div>
            <div id="submit-msg" class="text-danger mt-3"></div>
          </div>
          <div class="card-footer d-flex justify-content-end gap-2 btn-group-sm">
            <button type="submit" id="create-variation-form-submit-btn" class="btn btn-dark">
              Create
            </button>
            <button type="button" class="btn btn-outline-dark js-create-variation-form-close-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    `);

    const form = backdrop.find("#create-variation-form");

    backdrop.find(".js-create-variation-form-close-btn").click(() => closeForm(backdrop));

    const inputImg = form.find("#img");
    const imgDisplay = form.find("#create-variation-form-img-display");
    const removeImgBtn = form.find("#create-variation-form-img-remove-btn");

    inputImg.change(async e => {
      removeImgBtn.show();
      imgDisplay.prop("src", await readFileAsDataURL(e.target.files[0]));
    });

    removeImgBtn.click(() => {
      removeImgBtn.hide();
      inputImg.val("");
      imgDisplay.prop("src", DEFAULT_IMG_PATH);
    });

    form.submit(async e => {
      e.preventDefault();

      const submitBtn = form.find("#create-variation-form-submit-btn");
      submitBtn.prop("disabled", true);
      submitBtn.text("creating variation...");

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
        if(!formData.get("image")["name"]) formData.delete("image");
        formData.append("product_id", productId);
        formData.set("release_date", convertToMySQLDatetime(formData.get("release_date"))); // Store time as UTC to db

        if(formData.get("stop_selling")) {
          formData.set("stop_selling", true);
        } else {
          formData.delete("stop_selling");
        }

        const res = await createVariation(
          formData.get("image") ? formData : Object.fromEntries(formData)
        );

        if(res.success) {
          crudProductMsg.text(`* new variation of product id ${productId} - number ${productNumber} was created`);
          setTimeout(() => {
            crudProductMsg.text("");
          }, DISPLAY_MSG_TIMEOUT);
          renderProductsData(); // Re-render
          closeForm(backdrop);
          return;
        }

        form.find("#submit-msg").text(`Error: ${res.message}`);
      }

      submitBtn.text("create");
      submitBtn.prop("disabled", false);
    });
  } catch(error) {
    console.error(`Error: ${error.message}`);
    backdrop.html(`<div class="alert alert-danger m-3">Error loading create variation form: ${error.message}</div>`);
  }
}

renderProductsData();
renderSearchProductForm();