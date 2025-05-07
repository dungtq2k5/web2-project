import { getUser } from "../../models/users.js";
import { getVariation } from "../../models/product/variations.js";
import { getProduct } from "../../models/product/products.js";
import {
  enableBgScroll,
  disableBgScroll,
  formatAddress,
  convertUtcToLocalDatetime
} from "../../utils.js";
import {
  PRODUCT_IMG_PATH,
  VARIATION_IMG_PATH,
  DEFAULT_IMG_PATH
} from "../../settings.js";
import { getOrderItem } from "../../models/orders.js";

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
  backdropEle.html("<div class='d-flex justify-content-center align-items-center' style='height: 100vh;'><div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading data...</span></div></div>");
  backdropEle.show();

  try {
    const user = await getUser(userId);
    const rolesHTML = user.roles.map(role => `<li class="list-group-item">${role.name}</li>`).join('');
    const addressesHTML = user.addresses.map(address => `
      <li class="list-group-item">
        <address class="mb-0">${formatAddress(address)}</address>
      </li>
    `).join('');

    backdropEle.html(() => {
      return `
        <div class="card shadow-lg m-3 m-md-5 mx-auto" style="max-width: 900px;">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h2 class="h5 mb-0">User Information</h2>
            <button type="button" class="btn-close js-user-detail-popup-close-btn" aria-label="Close"></button>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <h3 class="h6">Details</h3>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item d-flex justify-content-between"><span><strong>ID:</strong></span> <span>${user.id}</span></li>
                  <li class="list-group-item d-flex justify-content-between"><span><strong>Full Name:</strong></span> <span>${user.full_name}</span></li>
                  <li class="list-group-item d-flex justify-content-between"><span><strong>Email:</strong></span> <span>${user.email}</span></li>
                  <li class="list-group-item d-flex justify-content-between"><span><strong>Phone:</strong></span> <span>${user.phone_number || 'N/A'}</span></li>
                  <li class="list-group-item d-flex justify-content-between"><span><strong>Created At:</strong></span> <span>${convertUtcToLocalDatetime(user.created_at)}</span></li>
                  <li class="list-group-item d-flex justify-content-between"><span><strong>Updated At:</strong></span> <span>${convertUtcToLocalDatetime(user.updated_at)}</span></li>
                </ul>
              </div>
              <div class="col-md-3 mt-3 mt-md-0">
                <h3 class="h6">Roles</h3>
                <ul class="list-group">${rolesHTML || '<li class="list-group-item">No roles assigned.</li>'}</ul>
              </div>
              <div class="col-md-3 mt-3 mt-md-0">
                <h3 class="h6">Addresses</h3>
                <ul class="list-group">${addressesHTML || '<li class="list-group-item">No addresses found.</li>'}</ul>
              </div>
            </div>
          </div>
          <div class="card-footer text-end">
            <button class="btn btn-dark btn-sm js-user-detail-popup-close-btn">Close</button>
          </div>
        </div>
      `;
    });

    backdropEle.find(".js-user-detail-popup-close-btn").click(() => closePopup(backdropEle));

  } catch(error) {
    console.error(`Error: ${error.message}`);
    backdropEle.html(`<div class="alert alert-danger m-3">Error loading user data: ${error.message}</div>`);
  }
}

/**
 * Render a popup also handle await UI.
 * Use this function with caution because of connections with styling files and others.
 *
 * @param variationId product_variation's id.
 * @param backdropEle backdrop element from HTML.
 * @returns none.
 */
export async function renderProductVariationDetailPopup(variationId, backdropEle, orderId = null) { // If has orderId -> display product instances
  disableBgScroll();
  backdropEle.html("<div class='d-flex justify-content-center align-items-center' style='height: 100vh;'><div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading data...</span></div></div>");
  backdropEle.show();

  try {
    const variation = await getVariation(variationId);
    const product = await getProduct(variation.product_id);
    const productImg = product.image_name ? `${PRODUCT_IMG_PATH}/${product.image_name}` : DEFAULT_IMG_PATH;
    const variationImg = variation.image_name ? `${VARIATION_IMG_PATH}/${variation.image_name}` : DEFAULT_IMG_PATH;

    const productHTML = `
      <div class="col-lg-4 border-end p-3">
        <h3 class="h6 mb-3">Product Details</h3>
        <img src="${productImg}" alt="Product Image" class="img-fluid rounded mb-3" loading="lazy" style="max-height: 200px; object-fit: contain;">
        <ul class="list-unstyled small">
          <li><strong>ID:</strong> ${product.id}</li>
          <li><strong>Name:</strong> ${product.name}</li>
          <li><strong>Brand:</strong> ${product.brand.name}</li>
          <li><strong>Model:</strong> ${product.model}</li>
          <li><strong>Category:</strong> ${product.category.name}</li>
          <li><strong>Description:</strong> <p class="small">${product.description || 'N/A'}</p></li>
        </ul>
      </div>
    `;

    const variationHTML = `
      <div class="col-lg-5 border-end p-3">
        <h3 class="h6 mb-3">Variation Details</h3>
        <img src="${variationImg}" alt="Variation Image" class="img-fluid rounded mb-3" loading="lazy" style="max-height: 200px; object-fit: contain;">
        <ul class="list-unstyled small row">
          <li class="col-sm-6"><strong>ID:</strong> ${variation.id}</li>
          <li class="col-sm-6"><strong>Size:</strong> ${variation.watch_size_mm}mm</li>
          <li class="col-sm-6"><strong>Color:</strong> <input type="color" value="${variation.watch_color}" disabled class="form-control form-control-sm" style="width: 50px; height: 20px;"></li>
          <li class="col-sm-6"><strong>Stock:</strong> ${variation.stock_quantity}</li>
          <li class="col-sm-6"><strong>Price:</strong> ${variation.price_cents}&#162;</li>
          <li class="col-sm-6"><strong>Base Price:</strong> ${variation.base_price_cents}&#162;</li>
          <li class="col-sm-6"><strong>Display:</strong> ${variation.display_size_mm}mm, ${variation.display_type}</li>
          <li class="col-sm-6"><strong>Resolution:</strong> ${variation.resolution_h_px}x${variation.resolution_w_px}px</li>
          <li class="col-sm-6"><strong>Memory:</strong> ${variation.ram_bytes}B RAM / ${variation.rom_bytes}B ROM</li>
          <li class="col-sm-6"><strong>OS:</strong> ${variation.os.name}</li>
          <li class="col-sm-6"><strong>Connectivity:</strong> ${variation.connectivity}</li>
          <li class="col-sm-6"><strong>Battery:</strong> ${variation.battery_life_mah}mAh</li>
          <li class="col-sm-6"><strong>Water Resist:</strong> ${variation.water_resistance_value} ${variation.water_resistance_unit}</li>
          <li class="col-sm-6"><strong>Sensor:</strong> ${variation.sensor}</li>
          <li class="col-sm-6"><strong>Case:</strong> ${variation.case_material}</li>
          <li class="col-sm-6"><strong>Band:</strong> ${variation.band_material}, ${variation.band_size_mm}mm <input type="color" value="${variation.band_color}" disabled class="form-control form-control-sm" style="width: 50px; height: 20px;"></li>
          <li class="col-sm-6"><strong>Weight:</strong> ${variation.weight_milligrams}mg</li>
          <li class="col-sm-6"><strong>Released:</strong> ${convertUtcToLocalDatetime(variation.release_date)}</li>
        </ul>
      </div>
    `;

    const instancesHTML = orderId ? await genInstancesHTML(orderId, variationId, true) : ""; // Pass true for styled output

    backdropEle.html(() => {
      return `
        <div class="card shadow-lg m-3 m-md-5 mx-auto" style="max-width: 1200px;">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h2 class="h5 mb-0">Product & Variation Information</h2>
            <button type="button" class="btn-close js-product-detail-popup-close-btn" aria-label="Close"></button>
          </div>
          <div class="card-body">
            <div class="row">
              ${productHTML}
              ${variationHTML}
              ${instancesHTML ? `<div class="col-lg-3 p-3">${instancesHTML}</div>` : ""}
            </div>
          </div>
          <div class="card-footer text-end">
            <button class="btn btn-dark btn-sm js-product-detail-popup-close-btn">Close</button>
          </div>
        </div>
      `;
    });

    backdropEle.find(".js-product-detail-popup-close-btn").click(() => closePopup(backdropEle));

  } catch(error) {
    console.error(`Error: ${error.message}`);
    backdropEle.html(`<div class="alert alert-danger m-3">Error loading product data: ${error.message}</div>`);
  }
}

async function genInstancesHTML(orderId, variationId, styled = false) { // Support for renderProductVariationDetailPopup()
  const orderItem = await getOrderItem(orderId, variationId);
  if (!styled) {
    const instancesListHTML = orderItem.product_instances.map(instance => (
      `<li>
        <p>${instance.sku}</p>
        <i class="uil uil-times"></i>
        <p>${instance.supplier_serial_number}</p>
        <i class="uil uil-times"></i>
        <p>${instance.supplier_imei_number || "N/A"}</p>
      </li>`
    )).join("");

    return `
      <div class="product-detail-popup__info-instances">
        <h3>Product Instances</h3>
        <div>
          <h4>SKU</h4>
          <i class="uil uil-times"></i>
          <h4>Serial Number</h4>
          <i class="uil uil-times"></i>
          <h4>IMEI Number</h4>
        </div>
        <ul>${instancesListHTML}</ul>
      </div>
    `;
  }

  // Styled output for Bootstrap
  const instancesListHTML = orderItem.product_instances.map(instance => (
    `<li class="list-group-item small">
      <div class="d-flex justify-content-between"><span><strong>SKU:</strong></span> <span>${instance.sku}</span></div>
      <div class="d-flex justify-content-between"><span><strong>Serial:</strong></span> <span>${instance.supplier_serial_number}</span></div>
      <div class="d-flex justify-content-between"><span><strong>IMEI:</strong></span> <span>${instance.supplier_imei_number || "N/A"}</span></div>
    </li>`
  )).join("");

  return `
    <div>
      <h3 class="h6 mb-3">Product Instances</h3>
      ${instancesListHTML ? `<ul class="list-group list-group-flush">${instancesListHTML}</ul>` : '<p class="text-muted small">No instances found for this item in the order.</p>'}
    </div>
  `;
}

/**
 * What the function does:
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
export const closeForm = closeBackDrop;
/**
 * Similar with closeBackDrop or closeForm but difference name
 */
export const closePopup = closeBackDrop;