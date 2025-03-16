import { getUser } from "../controllers/users.js";
import { getVariation } from "../controllers/product/variations.js";
import { getProduct } from "../controllers/product/products.js";
import {
  enableBgScroll,
  disableBgScroll,
  formatAddress
} from "../utils.js";

/**
 * Render a popup also handle await UI.
 * Use this function with caution because of connections with styling files and others.
 *
 * @param   userId user's id.
 * @param backdropEle backdrop element from HTML.
 * @returns none.
 */
export async function renderUserDetailPopup(userId, backdropEle) {
  disableBgScroll();
  backdropEle.html("<p>Loading data...</p>");
  backdropEle.show();

  try {
    const user = await getUser(userId);
    const rolesHTML = user.roles.map(role => `<li>${role.name}</li>`);
    const addressesHTML = user.addresses.map(address => `
      <li><address>${formatAddress(address)}</address></li>
    `);

    backdropEle.html(() => {
      return `
        <div class="user-detail-popup--g" id="user-detail-popup">
          <button type="button" class="form__close--g js-user-detail-popup-close-btn">
            <i class="uil uil-times"></i>
          </button>
          <h2 class="form__title--g">User information</h2>

          <div class="user-detail-popup__info--g">
            <div class="user-detail-popup__detail--g">
              <h3>Information</h3>
              <div>
                <h4>id</h4>
                <p>${user.id}</p>
              </div>
              <div>
                <h4>full name</h4>
                <p>${user.full_name}</p>
              </div>
              <div>
                <h4>email</h4>
                <p>${user.email}</p>
              </div>
              <div>
                <h4>phone number</h4>
                <p>${user.phone_number}</p>
              </div>
              <div>
                <h4>created at</h4>
                <p>${user.created_at}</p>
              </div>
              <div>
                <h4>updated at</h4>
                <p>${user.updated_at}</p>
              </div>
            </div>

            <div class="user-detail-popup__detail--g">
              <h3>Roles</h3>
              <ul>${rolesHTML}</ul>
            </div>

            <div class="user-detail-popup__detail--g">
              <h3>Addresses</h3>
              <ul>${addressesHTML}</ul>
            </div>
          </div>

          <button type="button" class="js-user-detail-popup-close-btn">close</button>
        </div>
      `;
    });

    const form = $("#user-detail-popup");
    form.find(".js-user-detail-popup-close-btn").click(() => closePopup(backdropEle));

  } catch(error) {
    console.error(`Error: ${error.massage}`);
    backdropEle.html(`<p>Error loading data: ${error.message}</p>`);
  }
}

/**
 * Render a popup also handle await UI.
 * Use this function with caution because of connections with styling files and others.
 *
 * @param   variationId product_variation's id.
 * @param backdropEle backdrop element from HTML.
 * @returns none.
 */
export async function renderProductVariationDetailPopup(variationId, backdropEle) {
  disableBgScroll();
  backdropEle.html("<p>Loading data...</p>");
  backdropEle.show();

  try {
    const variation = await getVariation(variationId);
    const product = await getProduct(variation.product_id);

    backdropEle.html(() => {
      return `
        <div class="product-detail-popup--g" id="product-detail-popup">
          <button type="button" class="form__close--g js-product-detail-popup-close-btn"><i class="uil uil-times"></i></button>
          <h2 class="form__title--g">Product information</h2>

          <div class="product-detail-popup__info--g">
            <div class="product-detail-popup__detail--g">
              <h3>Product</h3>
              <img src="./assets/product.png" alt="smartwatch">
              <div>
                <h4>id</h4>
                <p>${product.id}</p>
              </div>
              <div>
                <h4>name</h4>
                <p>${product.name}</p>
              </div>
              <div>
                <h4>brand</h4>
                <p>${product.brand.name}</p>
              </div>
              <div>
                <h4>model</h4>
                <p>${product.model}</p>
              </div>
              <div>
                <h4>category</h4>
                <p>${product.category.name}</p>
              </div>
              <div>
                <h4>description</h4>
                <p>${product.description}</p>
              </div>
            </div>

            <div class="product-detail-popup__divider--g">
              <i class="uil uil-angle-right-b"></i>
            </div>

            <div class="product-detail-popup__detail--g">
              <h3>Variation</h3>
              <img src="./assets/product.png" alt="smartwatch variation">
              <div>
                <h4>id</h4>
                <p>${variation.id}</p>
              </div>
              <div>
                <h4>watch size</h4>
                <p>${variation.watch_size_mm}(mm)</p>
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
                <p>${variation.display_size_mm}(mm)</p>
              </div>
              <div>
                <h4>display type</h4>
                <p>${variation.display_type}</p>
              </div>
              <div>
                <h4>resolution</h4>
                <p>${variation.resolution_h_px}px x ${variation.resolution_w_px}px</p>
              </div>
              <div>
                <h4>memory</h4>
                <p>${variation.ram_bytes}bytes x ${variation.rom_bytes}bytes</p>
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
                <p>${variation.battery_life_mah}(mah)</p>
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
                <p>${variation.band_material} | ${variation.band_size_mm}(mm) | ${variation.band_color}</p>
              </div>
              <div>
                <h4>weight</h4>
                <p>${variation.weight_milligrams}(mg)</p>
              </div>
              <div>
                <h4>release at</h4>
                <p>${variation.release_date}</p>
              </div>
            </div>
          </div>

          <button type="button" class="js-product-detail-popup-close-btn">close</button>
        </div>
      `;
    });

    const form = $("#product-detail-popup");

    form.find(".js-product-detail-popup-close-btn").click(() => closePopup(backdropEle));

  } catch(error) {
    console.error(`Error: ${error.massage}`);
    backdropEle.html(`<p>Error loading data: ${error.message}</p>`);
  }
}

/**
 * What the function do:
 * - hide element
 * - erase all inner elements
 * - enable scrolling
 *
 * @param backdropEle backdrop element from HTML.
 * @returns none.
 */
export function closeBackDrop(backdropEle) {
  backdropEle.hide();
  backdropEle.html("");
  enableBgScroll();
}
/**
 * Similar with closeBackDrop or closePopup but difference name
 */
export let closeForm = closeBackDrop;
/**
 * Similar with closeBackDrop or closeForm but difference name
 */
export let closePopup = closeBackDrop;