import { getProduct } from "../../models/product/products.js";
import { getVariationsByProductId, getVariation } from "../../models/product/variations.js";
import {
  DEFAULT_IMG_PATH,
  DISPLAY_MSG_TIMEOUT_SHORT,
  VARIATION_IMG_PATH
} from "../../settings.js";
import {
  centsToDollars,
  bytesToMB,
  mgToGrams
} from "../../utils.js";
import { createCart, getCart, updateCart } from "../../models/carts.js";
import { getSigninUser } from "../../models/auth.js";


const user = getSigninUser();

const productsContainer = $("#product-container");
const productSpecsContainer = $("#product-specs");
const productId = new URLSearchParams(window.location.search).get("id");
console.log("Product ID:", productId);

async function renderProduct(variationId=null) {
  productsContainer.html("<p>Loading product...</p>");
  productSpecsContainer.html("<p>Loading specifications...</p>");

  try {
    const product = await getProduct(productId);
    console.log("Product:", product);
    if(!product || product.stop_selling) {
      productsContainer.html("<p>Product not found</p>");
      productSpecsContainer.html("<p>Product not found</p>");
      return;
    }

    const variations = await getVariationsByProductId(productId, false);
    console.log("Variations:", variations);
    if(variations.length === 0) {
      productsContainer.html("<p>No variations available</p>");
      productSpecsContainer.html("<p>No variations available</p>");
      return;
    }

    const defaultVariation = variationId
      ? await getVariation(variationId)
      : variations[0];

    const variationImg = defaultVariation.image_name
      ? `${VARIATION_IMG_PATH}/${defaultVariation.image_name}`
      : DEFAULT_IMG_PATH;

    const sizesHTML = variations.map(variation => (
      `<li>
          <button
            class="btn ${variation.id == defaultVariation.id ? "btn-dark" : ""} js-variation-size"
            data-variation-id="${variation.id}"
          >${variation.watch_size_mm}MM</button>
        </li>`
    )).join("");

    const productsHTML = `
      <img src="${variationImg}" alt="Smartwatch product">

      <div>
        <div>
          <h2>${product.name}</h2>
          <p>${product.description}</p>
          <p>&#36;${centsToDollars(parseInt(defaultVariation.price_cents))} USD</p>
        </div>

        <div>
          <h3>Watch size:</h3>
          <ul>${sizesHTML}</ul>
        </div>

        <div data-variation-id="${defaultVariation.id}">
          <button id="add-cart-btn">Add to cart</button>
          <button id="buy-now-btn">Buy now</button>
          <span id="add-cart-msg"></span>
        </div>

      </div>
    `;

    const specsHTML = `
      <li>Model: ${product.model}</li>
      <li>Brand: ${product.brand.name}</li>
      <li>Category: ${product.category.name}</li>

      <li>Watch size: ${defaultVariation.watch_size_mm}</li>
      <li>Watch color: <input type="color" value="${defaultVariation.watch_color}"></li>
      <li>Display size: ${defaultVariation.display_size_mm}mm</li>
      <li>Display type: ${defaultVariation.display_type}</li>
      <li>Resolution: ${defaultVariation.resolution_h_px}px x ${defaultVariation.resolution_w_px}px</li>
      <li>Memory: ${bytesToMB(defaultVariation.ram_bytes)}MB x ${bytesToMB(defaultVariation.rom_bytes)}MB</li>
      <li>OS: ${defaultVariation.os.name}</li>
      <li>Connectivity: ${defaultVariation.connectivity}</li>
      <li>Battery: ${defaultVariation.battery_life_mah}mah</li>
      <li>Water resistance: ${defaultVariation.water_resistance_value} ${defaultVariation.water_resistance_unit}</li>
      <li>Sensor: ${defaultVariation.sensor}</li>
      <li>Case material: ${defaultVariation.case_material}</li>
      <li>Band material: ${defaultVariation.band_material}</li>
      <li>Band size: ${defaultVariation.band_size_mm}mm</li>
      <li>Band color: <input type="color" value="${defaultVariation.band_color}"></li>
      <li>Weight: ${mgToGrams(defaultVariation.weight_milligrams)}mg</li>
      <li>Release at: ${defaultVariation.release_date}</li>
    `;

    productsContainer.html(productsHTML);
    productSpecsContainer.html(specsHTML);

    productsContainer.find(".js-variation-size").click(e => {
      const variationId = $(e.currentTarget).data("variation-id");

      console.log(`View variation ID: ${variationId}`);
      renderProduct(variationId);
    });

    const addCartBtn = productsContainer.find("#add-cart-btn");
    addCartBtn.click(async e => {
      if(!user) {
        window.location.href = "./index.html?page=signin";
        return;
      }

      addCartBtn.prop("disabled", true);
      addCartBtn.text("Adding to cart...");

      const variationId = $(e.currentTarget).closest("[data-variation-id]").data("variation-id");
      console.log(`Add to cart variation ID: ${variationId}`);

      const existCart = await getCart(user.id, variationId);

      const res = existCart
        ? await updateCart({
          user_id: user.id,
          product_variation_id: variationId,
          quantity: existCart.quantity + 1
        })
        : await createCart({
          user_id: user.id,
          product_variation_id: variationId,
          quantity: 1
        });

      if(res.success) {
        addCartBtn.html(`<i class="uil uil-check"></i> Added to cart`);
        setTimeout(() => {
          addCartBtn.html("Add to cart");
          addCartBtn.prop("disabled", false);
        }, DISPLAY_MSG_TIMEOUT_SHORT);
        return;
      }

      productsContainer.find("#add-cart-msg").text(`Error adding to cart: ${res.message}`);
      addCartBtn.html("Add to cart");
      addCartBtn.prop("disabled", false);
    });

    productsContainer.find(".js-buy-now-btn").click(e => {
      if(!user) {
        window.location.href = "./index.html?page=signin";
        return;
      }

      const variationId = $(e.currentTarget).closest("[data-variation-id]").data("variation-id");
      console.log(`Buy now variation ID: ${variationId}`);
      // TODO Buy now logic here, handle by session storage
    });

  } catch (error) {
    console.error("Error rendering product:", error);
    productsContainer.html("<p>Error loading product</p>");
  }
}

renderProduct();