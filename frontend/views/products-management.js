import {
  deleteProduct,
  getProduct,
  getProductsList,
  updateProduct,
  createProduct,
  getFilterProductsList
} from "../controllers/product/products.js";
import { getBrandsList } from "../controllers/product/brands.js";
import { getCategoriesList } from "../controllers/product/categories.js";
import { createVariation, getVariationsByProductId } from "../controllers/product/variations.js";
import {
  disableBgScroll,
  isValidImg,
  readFileAsDataURL,
  isDateInPast,
  filterTextInputsInFormData,
  convertToMySQLDatetime
} from "../utils.js";
import { closeForm, closePopup } from "./components.js";
import {
  VARIATION_IMG_PATH,
  DEFAULT_IMG_PATH,
  PRODUCT_IMG_PATH,
  DISPLAY_MSG_TIMEOUT
} from "../settings.js";
import { getOSList } from "../controllers/product/os.js";


const crudProductMsg = $("#crud-product-msg");
const backdrop = $("#backdrop");
const resultCount = $("#result-count");
const tbody = $("#tbody");

$("#create-product-btn").click(async () => {
  await renderCreateProductForm();
  console.log("render create product form");
});

function renderSearchProductForm() {
  const form = $("#search-product-form");
  const searchInput = form.find("#search-product-form-input");
  const searchBtn = form.find("#search-product-form-search-btn");
  const clearBtn = form.find("#search-product-form-clear-btn");

  clearBtn.click(async () => {
    clearBtn.prop("disabled", true);
    clearBtn.text("clearing...");

    await renderProductsData();

    clearBtn.text("clear search");
    clearBtn.prop("disabled", false);
  });

  form.submit(async e => {
    e.preventDefault();
    searchBtn.prop("disabled", true);
    searchBtn.text("searching...");

    const filteredProductsList = await getFilterProductsList(searchInput.val());
    await renderProductsData(filteredProductsList);

    searchBtn.text("search");
    searchBtn.prop("disabled", false);
  });
}

async function renderProductsData(productsList=null) {
  tbody.html("<tr><td colspan='11'>Loading data...</td></tr>");

  try {
    const products = productsList || await getProductsList();

    let dataHTML;
    for(const [idx, product] of products.entries()) {
      const variations = await getVariationsByProductId(product.id);
      const img = product.image_name ? `${PRODUCT_IMG_PATH}/${product.image_name}` : DEFAULT_IMG_PATH;

      dataHTML += `
        <tr
          class="content__tr--g"
          data-number="${idx+1}"
          data-product-id="${product.id}"
        >
          <td data-cell="n.o" class="content__td--g">${idx+1}</td>
          <td data-cell="id" class="content__td--g">${product.id}</td>
          <td data-cell="image" class="content__td--g">
            <img src="${img}" class="content__img" alt="smartwatch" loading="lazy">
          </td>
          <td data-cell="name" class="content__td--g">${product.name}</td>
          <td data-cell="model" class="content__td--g">${product.model}</td>
          <td data-cell="brand" class="content__td--g">${product.brand.name}</td>
          <td data-cell="category" class="content__td--g">${product.category.name}</td>
          <td data-cell="description" class="content__td--g">${product.description}</td>
          <td data-cell="stop selling" class="content__td--g">${Boolean(product.stop_selling)}</td>
          <td data-cell="total variations" class="content__td--g">
            ${variations.length}
            ${variations.length ? `<button class="js-view-all-variations-btn">view all variations</button>` : ""}
          </td>
          <td data-cell="actions" class="content__td--g">
            <button class="js-update-product-btn">update</button>
            <button class="js-delete-product-btn">delete</button>
            <button class="js-create-new-variation-btn"><i class="uil uil-plus"></i>create new variation</button>
          </td>
        </tr>
      `;
    }

    tbody.html(dataHTML || "<tr><td colspan='11'>No data found!</td></tr>");

    tbody.find(".js-view-all-variations-btn").click(e => {
      const tr = $(e.currentTarget).closest("tr");
      const productNum = tr.data("number");
      const productId = tr.data("product-id");

      console.log(`View variations of product id ${productId}`);
      renderProductVariationsPopup(productNum, productId);
    });

    tbody.find(".js-update-product-btn").click(e => {
      const tr = $(e.currentTarget).closest("tr");
      const productNum = tr.data("number");
      const productId = tr.data("product-id");

      console.log(`Update product id ${productId}`);
      renderUpdateProductForm(productNum, productId);
    });

    tbody.find(".js-delete-product-btn").click(e => {
      const tr = $(e.currentTarget).closest("tr");
      const productNum = tr.data("number");
      const productId = tr.data("product-id");

      console.log(`Delete product id ${productId}`);
      renderDeleteProductPopup(productNum, productId);
    });

    tbody.find(".js-create-new-variation-btn").click(e => {
      const tr = $(e.currentTarget).closest("tr");
      const productNum = tr.data("number");
      const productId = tr.data("product-id");

      console.log(`Create new product variation id ${productId}`);
      renderCreateVariationForm(productNum, productId);
    });

    resultCount.text(products.length);

  } catch(error) {
    console.error(`Error: ${error.message}`);
    tbody.html(`<tr><td colspan='11'>Error loading data: ${error.message}</td></tr>`)
  }
}

async function renderProductVariationsPopup(number, id) {
  disableBgScroll();
  backdrop.html("<p>Loading product variations data...</p>");
  backdrop.show();

  try {
    const variations = await getVariationsByProductId(id);
    const variationsHTML = variations.map(variation => {
      const img = variation.image_name ? `${VARIATION_IMG_PATH}/${variation.image_name}` : DEFAULT_IMG_PATH;

      return `
        <li class="variations-popup__item">
          <img src="${img}" alt="smartwatch variation" loading="lazy">
          <div>
            <h3>id</h3>
            <p>${variation.id}</p>
          </div>
          <div>
            <h3>watch size</h3>
            <p>${variation.watch_size_mm}mm</p>
          </div>
          <div>
            <h3>watch color</h3>
            <p>${variation.watch_color}</p>
          </div>
          <div>
            <h3>stock quantity</h3>
            <p>${variation.stock_quantity}</p>
          </div>
          <div>
            <h3>sell price</h3>
            <p>${variation.price_cents}&#162;</p>
          </div>
          <div>
            <h3>base price</h3>
            <p>${variation.base_price_cents}&#162;</p>
          </div>
          <div>
            <h3>display size</h3>
            <p>${variation.display_size_mm}mm</p>
          </div>
          <div>
            <h3>display type</h3>
            <p>${variation.display_type}</p>
          </div>
          <div>
            <h3>resolution</h3>
            <p>${variation.resolution_h_px}px <i class="uil uil-times"></i> ${variation.resolution_w_px}px</p>
          </div>
          <div>
            <h3>memory</h3>
            <p>${variation.ram_bytes}bytes <i class="uil uil-times"></i> ${variation.rom_bytes}bytes</p>
          </div>
          <div>
            <h3>os</h3>
            <p>${variation.os.name}</p>
          </div>
          <div>
            <h3>connectivity</h3>
            <p>${variation.connectivity}</p>
          </div>
          <div>
            <h3>battery life</h3>
            <p>${variation.battery_life_mah}mah</p>
          </div>
          <div>
            <h3>water resistance</h3>
            <p>${variation.water_resistance_value} ${variation.water_resistance_unit}</p>
          </div>
          <div>
            <h3>sensor</h3>
            <p>${variation.sensor}</p>
          </div>
          <div>
            <h3>case material</h3>
            <p>${variation.case_material}</p>
          </div>
          <div>
            <h3>band</h3>
            <p>${variation.band_material} | ${variation.band_size_mm}mm | ${variation.band_color}</p>
          </div>
          <div>
            <h3>weight</h3>
            <p>${variation.weight_milligrams}mg</p>
          </div>
          <div>
            <h3>release at</h3>
            <p>${variation.release_date}</p>
          </div>
        </li>`;
      }).join("");

    backdrop.html(`
      <div class="variations-popup form--g auto-scroll--g">
        <button class="form__close--g js-variations-popup-close-btn"><i class="uil uil-times"></i></button>
        <h2 class="variations-popup__title">Variations of product id ${id} - number ${number}</h2>
        <ul class="variations-popup__list">${variationsHTML}</ul>
        <button class="js-variations-popup-close-btn">close</button>
      </div>
    `);

    backdrop.find(".js-variations-popup-close-btn").click(() => closePopup(backdrop));

  } catch(error) {
    console.error(`Error: ${error.message}`);
    backdrop.html(`<p>Error loading product variations data: ${error.message}</p>`)
  }
}

async function renderUpdateProductForm(number, id) {
  disableBgScroll();
  backdrop.html("<p>Loading update product form...</p>");
  backdrop.show();

  try {
    const product = await getProduct(id);
    const brands = await getBrandsList();
    const categories = await getCategoriesList();
    const img = product.image_name && `${PRODUCT_IMG_PATH}/${product.image_name}`;

    const brandsHTML = brands.map(brand => (
      `<option
        value="${brand.id}"
        ${brand.id == product.brand.id && "selected"}
      >${brand.name}</option>`
    )).join("");

    const categoriesHTML = categories.map(category => (
      `<option
        value="${category.id}"
        ${category.id == product.category.id && "selected"}
      >${category.name}</option>`
    )).join("");

    backdrop.html(`
      <form class="form--g" id="update-product-form">
        <button type="button" class="form__close--g js-update-product-form-close-btn">
          <i class="uil uil-times"></i>
        </button>
        <h2 class="form__title--g">Update product id ${id} - number ${number} form</h2>

        <div class="update-product-form-img">
          <img
            src="${img || DEFAULT_IMG_PATH}"
            alt="smartwatch"
            id="update-product-form-img-display"
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
            type="button"
            id="update-product-form-img-remove-btn"
            style="display: ${!img && "none"};"
          >remove image</button>

          <span id="img-msg"></span>
        </div>

        <div>
          <div class="form__field--g">
            <label for="name">Name * unique</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="${product.name}"
              value="${product.name}"
              class="form__input--g"
            >
          </div>
          <span id="name-msg"></span>
        </div>

        <div>
          <div class="form__field--g">
            <label for="model">Model * unique</label>
            <input
              type="text"
              id="model"
              name="model"
              placeholder="${product.model}"
              value="${product.model}"
              class="form__input--g"
            >
          </div>
          <span id="model-msg"></span>
        </div>

        <div>
          <label for="brand">Brand</label>
          <select
            id="brand"
            name="brand_id"
            class="form__select--g"
          >${brandsHTML}</select>
        </div>

        <div>
          <label for="category">Category</label>
          <select
            id="category"
            name="category_id"
            class="form__select--g"
          >${categoriesHTML}</select>
        </div>

        <div>
          <div class="form__field--g">
            <label for="description">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="${product.description}"
              class="form__input--g"
            >${product.description}</textarea>
          </div>
          <span id="description-msg"></span>
        </div>

        <div>
          <label for="stop-selling">Stop selling</label>
          <input
            type="checkbox"
            id="stop-selling"
            name="stop_selling"
            ${product.stop_selling && "checked"}
          >
        </div>

        <div>
          <button type="submit" id="update-product-form-submit-btn">update</button>
          <button type="button" class="js-update-product-form-close-btn">cancel</button>
        </div>

        <span id="submit-msg"></span>
      </form>
    `);

    const form = backdrop.find("#update-product-form");

    form.find(".js-update-product-form-close-btn").click(() => closeForm(backdrop));

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

      submitBtn.text("update");
      submitBtn.prop("disabled", false);
    });

  } catch(error) {
    console.error(`Error: ${error.message}`);
    backdrop.html(`<p>Error loading product data: ${error.message}</p>`);
  }
}

function renderDeleteProductPopup(number, id) {
  disableBgScroll();

  backdrop.html(`
    <div class="form--g">
      <button class="form__close--g js-delete-product-popup-close-btn"><i class="uil uil-times"></i></button>
      <h2 class="form__title--g">Confirm delete product id ${id} - number ${number}?</h2>

      <div>
        <button id="delete-product-popup-submit-btn">delete</button>
        <button class="js-delete-product-popup-close-btn">cancel</button>
      </div>

      <span id="delete-product-popup-msg"></span>
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
  backdrop.html("<p>Loading create product form...</p>");
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
      <form class="form--g" id="create-product-form">
        <button type="button" class="form__close--g js-create-product-form-close-btn">
          <i class="uil uil-times"></i>
        </button>
        <h2 class="form__title--g">Create product form</h2>

        <div class="create-product-form-img">
          <img
            src="${DEFAULT_IMG_PATH}"
            alt="smartwatch"
            id="create-product-form-img-display"
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
            type="button"
            id="create-product-form-img-remove-btn"
            style="display: none;"
          >remove image</button>

          <span id="img-msg"></span>
        </div>

        <div>
          <div class="form__field--g">
            <label for="name">Name * unique</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="smartwatch ABC"
              class="form__input--g"
            >
          </div>
          <span id="name-msg"></span>
        </div>

        <div>
          <div class="form__field--g">
            <label for="model">Model * unique</label>
            <input
              type="text"
              id="model"
              name="model"
              placeholder="model abc"
              class="form__input--g"
            >
          </div>
          <span id="model-msg"></span>
        </div>

        <div>
          <label for="brand">Brand</label>
          <select
            id="brand"
            name="brand_id"
            class="form__select--g"
          >${brandsHTML}</select>
        </div>

        <div>
          <label for="category">Category</label>
          <select
            id="category"
            name="category_id"
            class="form__select--g"
          >${categoriesHTML}</select>
        </div>

        <div>
          <div class="form__field--g">
            <label for="description">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="lorem ipsum"
              class="form__input--g"
            ></textarea>
          </div>
          <span id="description-msg"></span>
        </div>

        <div>
          <label for="stop-selling">Stop selling</label>
          <input
            type="checkbox"
            id="stop-selling"
            name="stop_selling"
          >
        </div>

        <div>
          <button type="submit" id="create-product-form-submit-btn">create</button>
          <button type="button" class="js-create-product-form-close-btn">cancel</button>
        </div>

        <span id="submit-msg"></span>
      </form>
    `);

    const form = backdrop.find("#create-product-form");

    form.find(".js-create-product-form-close-btn").click(() => closeForm(backdrop));

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
    backdrop.html(`<p>Error loading product data: ${error.message}</p>`);
  }
}

async function renderCreateVariationForm(productNumber, productId) {
  disableBgScroll();
  backdrop.html("<p>Loading create variation form...");
  backdrop.show();

  try {
    const os = await getOSList();

    const osHTML = os.map(os => (
      `<option value="${os.id}">${os.name}</option>`
    )).join("");

    backdrop.html(`
      <form class="form--g create-variation-form" id="create-variation-form">
        <button type="button" class="form__close--g js-create-variation-form-close-btn">
          <i class="uil uil-times"></i>
        </button>
        <h2 class="form__title--g">Create variation of product id ${productId} - number ${productNumber} form</h2>

        <div class="create-variation-form-img">
          <img
            src="${DEFAULT_IMG_PATH}"
            alt="smartwatch"
            id="create-variation-form-img-display"
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
            id="create-variation-form-img-remove-btn"
            type="button"
            style="display: none;"
          >remove image</button>

          <span id="img-msg"></span>
        </div>

        <div class="create-variation-form__input">
          <label for="watch-size">Watch size:</label>
          <input
            type="number"
            name="watch_size_mm"
            id="watch-size"
            placeholder="0"
          >
          <span>mm</span>
          <span id="watch-size-msg"></span>
        </div>

        <div class="create-variation-form__input">
          <label for="watch-color">Watch color:</label>
          <input
            type="color"
            name="watch_color"
            id="watch-color"
            value="#000000"
          >
        </div>

        <div class="create-variation-form__input">
          <label for="base-price">Base(stock) price:</label>
          <input
            type="number"
            name="base_price_cents"
            id="base-price"
            placeholder="0"
          >
          <span>&#162;</span>
          <span id="base-price-msg"></span>
        </div>

        <div class="create-variation-form__input">
          <label for="sell-price">Sell price:</label>
          <input
            type="number"
            name="price_cents"
            id="sell-price"
            placeholder="0"
          >
          <span>&#162;</span>
          <span id="sell-price-msg"></span>
        </div>

        <div class="create-variation-form__input">
          <label for="display-size">Display size:</label>
          <input
            type="number"
            name="display_size_mm"
            id="display-size"
            placeholder="0"
          >
          <span>mm</span>
          <span id="display-size-msg"></span>
        </div>

        <div class="create-variation-form__input">
          <label for="display-type">Display type:</label>
          <input
            type="text"
            name="display_type"
            id="display-type"
            placeholder="amoled"
          >
          <span id="display-type-msg"></span>
        </div>

        <div class="create-variation-form__input">
          <p>Resolution:</p>
          <div>
            <label for="resolution_h" hidden></label>
            <input type="number" name="resolution_h_px" id="resolution_h" placeholder="0">
            <span>px</span>

            <i class="uil uil-times"></i>

            <label for="resolution_w" hidden></label>
            <input type="number" name="resolution_w_px" id="resolution_w" placeholder="0">

            <span>px</span>
          </div>
          <span id="resolution-msg"></span>
        </div>

        <div class="create-variation-form__input">
          <p>Memory:</p>
          <div>
            <label for="ram" hidden></label>
            <input type="number" name="ram_bytes" id="ram" placeholder="0">
            <span>bytes of RAM</span>

            <i class="uil uil-times"></i>

            <label for="rom" hidden></label>
            <input type="number" name="rom_bytes" id="rom" placeholder="0">
            <span>bytes of ROM</span>
          </div>
          <span id="memory-msg"></span>
        </div>

        <div class="create-variation-form__input">
          <label for="os">OS:</label>
          <select name="os_id" id="os">${osHTML}</select>
          <span id="os-msg"></span>
        </div>

        <div class="create-variation-form__input">
          <label for="connectivity">Connectivity:</label>
          <input type="text" name="connectivity" id="connectivity" placeholder="wifi, bluetooth,...">
          <span id="connectivity-msg"></span>
        </div>

        <div class="create-variation-form__input">
          <label for="battery">Battery capacity:</label>
          <input type="number" name="battery_life_mah" id="battery" placeholder="0">
          <span>mah</span>
          <span id="battery-msg"></span>
        </div>

        <div class="create-variation-form__input">
          <p>Water resistance:</p>
          <div>
            <label for="resistance-value">value</label>
            <input type="text" name="water_resistance_value" id="resistance-value" placeholder="5">
            <label for="resistance-unit">unit</label>
            <input type="text" name="water_resistance_unit" id="resistance-unit" placeholder="atm">
          </div>
          <span id="resistance-msg"></span>
        </div>

        <div class="create-variation-form__input">
          <label for="sensor">Sensor:</label>
          <input
            type="text"
            name="sensor"
            id="sensor"
            placeholder="accelerometer, magnetometer,..."
          >
          <span id="sensor-msg"></span>
        </div>

        <div class="create-variation-form__input">
          <label for="case-material">Case material:</label>
          <input
            type="text"
            name="case_material"
            id="case-material"
            placeholder="standless steel"
          >
          <span id="case-material-msg"></span>
        </div>

        <div class="create-variation-form__input">
          <label for="band-material">Band material:</label>
          <input
            type="text"
            name="band_material"
            id="band-material"
            placeholder="silicone"
          >
          <span id="band-material-msg"></span>
        </div>

        <div class="create-variation-form__input">
          <label for="band-size">Band size:</label>
          <input
            type="number"
            name="band_size_mm"
            id="band-size"
            placeholder="0"
          >
          <span>mm</span>
          <span id="band-size-msg"></span>
        </div>

        <div class="create-variation-form__input">
          <label for="band-color">Band color:</label>
          <input
            type="color"
            name="band_color"
            id="band-color"
            placeholder="#000000"
          >
          <span id="band-color-msg"></span>
        </div>

        <div class="create-variation-form__input">
          <label for="weight">Total weight: </label>
          <input
            type="number"
            name="weight_milligrams"
            id="weight"
            placeholder="0"
          >
          <span>mg</span>
          <span id="weight-msg"></span>
        </div>

        <div class="create-variation-form__input">
          <label for="release-date">Release at:</label>
          <input
            type="datetime-local"
            name="release_date"
            id="release-date"
          >
          <span id="release-date-msg"></span>
        </div>

        <div class="create-variation-form__input">
          <label for="stop-selling">Stop selling</label>
          <input
            type="checkbox"
            name="stop_selling"
            id="stop-selling"
          >
        </div>

        <div>
          <button type="submit" id="create-variation-form-submit-btn">create</button>
          <button type="button" class="js-create-variation-form-close-btn">cancel</button>
        </div>

        <span id="submit-msg"></span>
      </form>
    `);

    const form = backdrop.find("#create-variation-form");

    form.find(".js-create-variation-form-close-btn").click(() => closeForm(backdrop));

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
    backdrop.html(`<p>Error loading create variation form: ${error.message}</p>`);
  }
}

renderProductsData();
renderSearchProductForm();