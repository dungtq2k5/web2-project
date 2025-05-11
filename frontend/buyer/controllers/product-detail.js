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
import { updateCartQuantityDisplay } from "./navbar.js";

const user = getSigninUser();

const productsContainer = $("#product-container");
const productSpecsContainer = $("#product-specs");
const productId = new URLSearchParams(window.location.search).get("id");
console.log("Product ID:", productId);

async function renderProduct(variationId=null) {
  productsContainer.html(`<div class="col-12 text-center p-5"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div><p>Loading product...</p></div>`);
  productSpecsContainer.html(`<li class="list-group-item text-center"><div class="spinner-border spinner-border-sm text-primary" role="status"><span class="visually-hidden">Loading...</span></div> Loading specifications...</li>`);

  try {
    const product = await getProduct(productId);
    console.log("Product:", product);
    if(!product || product.stop_selling) {
      productsContainer.html(`<div class="col-12"><p class="alert alert-warning text-center">Product not found or no longer available.</p></div>`);
      productSpecsContainer.html(`<li class="list-group-item text-center">Product not found.</li>`);
      return;
    }

    const variations = await getVariationsByProductId(productId, false);
    console.log("Variations:", variations);
    if(variations.length === 0) {
      productsContainer.html(`<div class="col-12"><p class="alert alert-info text-center">No variations available for this product.</p></div>`);
      productSpecsContainer.html(`<li class="list-group-item text-center">No variations available.</li>`);
      return;
    }

    const defaultVariation = variationId
      ? await getVariation(variationId)
      : variations[0];

    const variationImg = defaultVariation.image_name
      ? `${VARIATION_IMG_PATH}/${defaultVariation.image_name}`
      : DEFAULT_IMG_PATH;

    const sizesHTML = variations.map(variation => (
      `<li class="list-inline-item">
          <button
            class="btn btn-sm ${variation.id == defaultVariation.id ? "btn-dark" : "btn-outline-dark"} js-variation-size"
            data-variation-id="${variation.id}"
          >${variation.watch_size_mm}MM</button>
        </li>`
    )).join("");

    const productsHTML = `
      <div class="col-md-6 text-center">
        <img src="${variationImg}" alt="${product.name} - ${defaultVariation.watch_size_mm}MM" class="img-fluid rounded shadow-sm mb-3" style="max-height: 400px; object-fit: contain;">
      </div>
      <div class="col-md-6">
        <div class="card shadow-sm">
          <div class="card-body">
            <h2 class="card-title h3">${product.name}</h2>
            <p class="card-text text-muted small">${product.description}</p>
            <p class="fs-4 fw-bold text-primary mb-3">&#36;${centsToDollars(parseInt(defaultVariation.price_cents))} USD</p>

            <div class="mb-3">
              <h3 class="fs-6 mb-2">Watch size:</h3>
              <ul class="list-inline">${sizesHTML}</ul>
            </div>

            <div class="d-grid gap-2 d-md-flex btn-group-sm" data-variation-id="${defaultVariation.id}">
              <button id="add-cart-btn" class="btn btn-dark flex-grow-1"><i class="uil uil-shopping-cart-alt"></i> Add to cart</button>
              <button id="buy-now-btn" class="btn btn-outline-dark flex-grow-1 js-buy-now-btn"><i class="uil uil-money-bill"></i> Buy now</button>
            </div>
            <span id="add-cart-msg" class="form-text d-block mt-2 text-danger"></span>
          </div>
        </div>
      </div>
    `;

    const specsArray = [
      { label: "Model", value: product.model },
      { label: "Brand", value: product.brand.name },
      { label: "Category", value: product.category.name },
      { label: "Watch size", value: `${defaultVariation.watch_size_mm}MM` },
      { label: "Watch color", value: `<input type="color" value="${defaultVariation.watch_color}" disabled class="form-control form-control-color form-control-sm d-inline-block" style="width: 30px; height: 20px; vertical-align: middle;">` },
      { label: "Display size", value: `${defaultVariation.display_size_mm}mm` },
      { label: "Display type", value: defaultVariation.display_type },
      { label: "Resolution", value: `${defaultVariation.resolution_h_px}px x ${defaultVariation.resolution_w_px}px` },
      { label: "Memory (RAM x ROM)", value: `${bytesToMB(defaultVariation.ram_bytes)}MB x ${bytesToMB(defaultVariation.rom_bytes)}MB` },
      { label: "OS", value: defaultVariation.os.name },
      { label: "Connectivity", value: defaultVariation.connectivity },
      { label: "Battery", value: `${defaultVariation.battery_life_mah}mAh` },
      { label: "Water resistance", value: `${defaultVariation.water_resistance_value} ${defaultVariation.water_resistance_unit}` },
      { label: "Sensor", value: defaultVariation.sensor },
      { label: "Case material", value: defaultVariation.case_material },
      { label: "Band material", value: defaultVariation.band_material },
      { label: "Band size", value: `${defaultVariation.band_size_mm}mm` },
      { label: "Band color", value: `<input type="color" value="${defaultVariation.band_color}" disabled class="form-control form-control-color form-control-sm d-inline-block" style="width: 30px; height: 20px; vertical-align: middle;">` },
      { label: "Weight", value: `${mgToGrams(defaultVariation.weight_milligrams)}g` },
      { label: "Release date", value: new Date(defaultVariation.release_date).toLocaleDateString() }
    ];

    const specsHTML = specsArray.map(spec => (
      `<li class="list-group-item d-flex justify-content-between align-items-center">
        <span class="fw-medium">${spec.label}:</span>
        <span>${spec.value}</span>
      </li>`
    )).join("");

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
        window.location.href = "./index.php?page=signin";
        return;
      }

      addCartBtn.prop("disabled", true);
      addCartBtn.html(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Adding...`);

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
        addCartBtn.html(`<i class="uil uil-check"></i> Added`);
        await updateCartQuantityDisplay();
        setTimeout(() => {
          addCartBtn.html(`<i class="uil uil-shopping-cart-alt"></i> Add to cart`);
          addCartBtn.prop("disabled", false);
        }, DISPLAY_MSG_TIMEOUT_SHORT);
        return;
      }

      productsContainer.find("#add-cart-msg").text(`Error adding to cart: ${res.message}`);
      addCartBtn.html(`<i class="uil uil-shopping-cart-alt"></i> Add to cart`);
      addCartBtn.prop("disabled", false);
    });

    productsContainer.find(".js-buy-now-btn").click(async e => {
      if(!user) {
        window.location.href = "./index.php?page=signin";
        return;
      }

      const variationId = $(e.currentTarget).closest("[data-variation-id]").data("variation-id");
      console.log(`Buy now variation ID: ${variationId}`);

      const buyNowBtn = $(e.currentTarget);
      buyNowBtn.prop("disabled", true).html(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...`);

      const existCart = await getCart(user.id, variationId);
      const cartData = {
        user_id: user.id,
        product_variation_id: variationId,
        quantity: existCart ? existCart.quantity + 1 : 1
      };

      const cartRes = existCart ? await updateCart(cartData) : await createCart(cartData);

      if (cartRes.success) {
        await updateCartQuantityDisplay();
        sessionStorage.setItem('buyNowVariationId', variationId);
        window.location.href = "./index.php?page=checkout";
      } else {
        productsContainer.find("#add-cart-msg").text(`Error processing "Buy Now": ${cartRes.message}`);
        buyNowBtn.prop("disabled", false).html(`<i class="uil uil-money-bill"></i> Buy now`);
      }
    });

  } catch (error) {
    console.error("Error rendering product:", error);
    productsContainer.html(`<div class="col-12"><p class="alert alert-danger text-center">Error loading product details. Please try again later.</p></div>`);
    productSpecsContainer.html(`<li class="list-group-item text-center">Error loading specifications.</li>`);
  }
}

renderProduct();