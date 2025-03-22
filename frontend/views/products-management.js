import { getProduct, getProductsList, updateProduct } from "../controllers/product/products.js";
import { getBrandsList } from "../controllers/product/brands.js";
import { getCategoriesList } from "../controllers/product/categories.js";
import { getVariationsByProductId } from "../controllers/product/variations.js";
import { disableBgScroll, removeOddSpace } from "../utils.js";
import { closeForm, closePopup } from "./components.js";
import { getAuth } from "../controllers/users.js";


const crudProductMsg = $("#curd-product-msg");
const backdrop = $("#backdrop");
const resultCount = $("#result-count");
const tbody = $("#tbody");

async function renderProductsData(productsList=null) {
  tbody.html("<tr><td colspan='11'>Loading data...</td></tr>");

  try {
    const products = productsList || await getProductsList();

    let dataHTML;
    for(const [idx, product] of products.entries()) {
      const variations = await getVariationsByProductId(product.id);

      dataHTML += `
        <tr
          class="content__tr--g"
          data-product-id="${product.id}"
        >
          <td data-cell="n.o" class="content__td--g">${idx}</td>
          <td data-cell="id" class="content__td--g">${product.id}</td>
          <td data-cell="img" class="content__td--g">
            <img src="./assets/product.png" class="content__img" alt="smartwatch">
          </td>
          <td data-cell="name" class="content__td--g">${product.name}</td>
          <td data-cell="model" class="content__td--g">${product.model}</td>
          <td data-cell="brand" class="content__td--g">${product.brand.name}</td>
          <td data-cell="category" class="content__td--g">${product.category.name}</td>
          <td data-cell="description" class="content__td--g">${product.description}</td>
          <td data-cell="stop selling" class="content__td--g">${Boolean(product.stop_selling)}</td>
          <td data-cell="total variations" class="content__td--g">
            ${variations.length}
            <button class="js-view-all-variations-btn">view all variations</button>
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
      const productId = $(e.currentTarget).closest("tr").data("product-id");
      console.log(`View variations of product id ${productId}`);
      renderProductVariationsPopup(productId);
    });

    tbody.find(".js-update-product-btn").click(e => {
      const productId = $(e.currentTarget).closest("tr").data("product-id");
      console.log(`Update product id ${productId}`);
      renderUpdateProductForm(productId);
    });

    tbody.find(".js-delete-product-btn").click(() => {

    });

    resultCount.text(products.length);


  } catch(error) {
    console.error(`Error: ${error.message}`);
    tbody.html(`<tr><td colspan='11'>Error loading data: ${error.message}</td></tr>`)
  }
}

async function renderProductVariationsPopup(productId) {
  disableBgScroll();
  backdrop.html("<p>Loading product variations data...</p>");
  backdrop.show();

  try {
    const variations = await getVariationsByProductId(productId);
    const variationsHTML = variations.map(variation => `
      <li class="variations-popup__item">
        <img src="./assets/product.png" alt="smartwatch variation">
        <div>
          <h4>id</h4>
          <p>${variation.id}</p>
        </div>
        <div>
          <h4>watch size</h4>
          <p>${variation.watch_size_mm}mm</p>
        </div>
        <div>
          <h4>watch color</h4>
          <p>${variation.watch_color}</p>
        </div>
        <div>
          <h4>stock quantity</h4>
          <p>${variation.stock_quantity}</p>
        </div>
        <div>
          <h4>sell price</h4>
          <p>${variation.price_cents}&#162;</p>
        </div>
        <div>
          <h4>base price</h4>
          <p>${variation.base_price_cents}&#162;</p>
        </div>
        <div>
          <h4>display size</h4>
          <p>${variation.display_size_mm}mm</p>
        </div>
        <div>
          <h4>display type</h4>
          <p>${variation.display_type}</p>
        </div>
        <div>
          <h4>resolution</h4>
          <p>${variation.resolution_h_px}px <i class="uil uil-times"></i> ${variation.resolution_w_px}px</p>
        </div>
        <div>
          <h4>memory</h4>
          <p>${variation.ram_bytes}bytes <i class="uil uil-times"></i> ${variation.rom_bytes}bytes</p>
        </div>
        <div>
          <h4>os</h4>
          <p>${variation.os.name}</p>
        </div>
        <div>
          <h4>connectivity</h4>
          <p>${variation.connectivity}</p>
        </div>
        <div>
          <h4>battery life</h4>
          <p>${variation.battery_life_mah}mah</p>
        </div>
        <div>
          <h4>water resistance</h4>
          <p>${variation.water_resistance_value} ${variation.water_resistance_unit}</p>
        </div>
        <div>
          <h4>sensor</h4>
          <p>${variation.sensor}</p>
        </div>
        <div>
          <h4>case material</h4>
          <p>${variation.case_material}</p>
        </div>
        <div>
          <h4>band</h4>
          <p>${variation.band_material} | ${variation.band_size_mm}mm | ${variation.band_color}</p>
        </div>
        <div>
          <h4>weight</h4>
          <p>${variation.weight_milligrams}mg</p>
        </div>
        <div>
          <h4>release at</h4>
          <p>${variation.release_date}</p>
        </div>
      </li>
    `).join("");

    backdrop.html(`
      <div class="variations-popup form--g auto-scroll--g">
        <button type="button" class="form__close--g js-variations-popup-close-btn"><i class="uil uil-times"></i></button>
        <h3 class="variations-popup__title">Variations of product id ${productId}</h3>
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

async function renderUpdateProductForm(productId) {
  disableBgScroll();
  backdrop.html("<p>Loading update product form...</p>");
  backdrop.show();

  try {
    const product = await getProduct(productId);
    const brands = await getBrandsList();
    const categories = await getCategoriesList();

    const brandsHTML = brands.map(brand => (
      `<option
        value="${brand.id}"
        ${brand.id === product.brand.id && "selected"}
      >${brand.name}</option>`
    )).join("");

    const categoriesHTML = categories.map(category => (
      `<option
        value="${category.id}"
        ${category.id === product.category.id && "selected"}
      >${category.name}</option>`
    )).join("");

    //TODO handle CRUD image
    backdrop.html(`
      <form class="form--g">
        <button type="button" class="form__close--g js-update-product-form-close-btn">
          <i class="uil uil-times"></i>
        </button>
        <h2 class="form__title--g">Update product form</h2>

        <div>
          upload image handle by PHP
        </div>

        <div>
          <div class="form__field--g">
            <label for="name">Name * unique</label>
            <input
              type="text"
              id="name"
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
              placeholder="${product.model}"
              value="${product.model}"
              class="form__input--g"
            >
          </div>
          <span id="model-msg"></span>
        </div>

        <div>
          <label for="brand">Brand</label>
          <select id="brand" class="form__select--g">${brandsHTML}</select>
        </div>

        <div>
          <label for="category">Category</label>
          <select id="category" class="form__select--g">${categoriesHTML}</select>
        </div>

        <div>
          <div class="form__field--g">
            <label for="description">Description</label>
            <textarea
              id="description"
              placeholder="${product.description}"
              class="form__input--g"
            >${product.description}</textarea>
          </div>
          <span id="description-msg"></span>
        </div>

        <div>
          <label for="stop-selling">Stop selling</label>
          <input type="checkbox" id="stop-selling" ${product.stop_selling && "checked"}>
        </div>

        <div>
          <button id="update-product-form-submit-btn">update</button>
          <button type="button" class="js-update-product-form-close-btn">cancel</button>
        </div>

        <span id="submit-msg"></span>
      </form>
    `);

    backdrop.find(".js-update-product-form-close-btn").click(() => closeForm(backdrop));

    const submitBtn = backdrop.find("#update-product-form-submit-btn");
    submitBtn.click(async e => {
      e.preventDefault();
      const nameMsg = backdrop.find("#name-msg");
      const modelMsg = backdrop.find("#model-msg");
      const descriptionMsg = backdrop.find("#description");

      const name = removeOddSpace(backdrop.find("#name").val());
      const model = removeOddSpace(backdrop.find("#model").val());
      const brandId = backdrop.find("#brand").val();
      const categoryId = backdrop.find("#category").val();
      const description = removeOddSpace(backdrop.find("#description").val());
      const stopSelling = backdrop.find("#stop-selling");

      const validateForm = () => {
        let allValid = true;

        if(!name) {
          nameMsg.text("* required");
          allValid = false;
        } else nameMsg.text("");

        if(!model) {
          modelMsg.text("* required");
          allValid = false;
        } else modelMsg.text("");

        if(!description) {
          descriptionMsg.text("* required");
          allValid = false;
        } else descriptionMsg.text("");
      }

      if(validateForm()) {
        submitBtn.prop("disabled", true);
        submitBtn.text("updating...");

        const product = {
          name,
          model,
          brand_id: brandId,
          category_id: categoryId,
          description,
          stop_selling: stopSelling
        }
        const res = await updateProduct(productId, product, getAuth());

        if(!res.success) {
          submitBtn.text("update");
          submitBtn.prop("disabled", false);
          backdrop.find("#submit-msg").text(res.message);
          return;
        }

        crudProductMsg.text(`* product id ${productId} was updated`);
        setTimeout(() => {
          crudProductMsg.text("");
        }, 2000);
        renderProductsData(); //re-render
        closeForm(backdrop);
      }
    });

  } catch(error) {
    console.error(`Error: ${error.message}`);
    backdrop.html(`<p>Error loading product data: ${error.message}</p>`);
  }
}

renderProductsData();