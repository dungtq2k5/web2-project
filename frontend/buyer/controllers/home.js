import {
  getAvailableProductsList,
  getFilterProductsList
} from "../../models/product/products.js";
import {
  PRODUCT_IMG_PATH,
  DEFAULT_IMG_PATH,
  PRODUCTS_PER_PAGE
} from "../../settings.js";
import { centsToDollars, filterTextInputsInFormData } from "../../utils.js";
import { getCategoriesList } from "../../models/product/categories.js";
import { getBrandsList } from "../../models/product/brands.js";


const productsContainer = $("#products-container");
const paginationContainer = $("#pagination");

const limit = PRODUCTS_PER_PAGE;
let offset = 0;
let maxProducts;
let maxPages;
let currentPage = 1;
let currentProductList = null;

const goBackBtn = $("#go-back");
const goForwardBtn = $("#go-forward");

async function renderProducts(renderLimit, renderOffset) {
  productsContainer.html("<p>Loading products...</p>");

  let productsToDisplay;
  if (currentProductList) {
    const start = renderOffset || 0;
    const end = renderLimit ? renderLimit + start : currentProductList.length;
    productsToDisplay = currentProductList.slice(start, end);
  } else {
    productsToDisplay = await getAvailableProductsList(renderLimit, renderOffset);
  }

  const dataHTML = productsToDisplay.map(product => {
    const productImg = product.image_name
      ? `${PRODUCT_IMG_PATH}/${product.image_name}`
      : DEFAULT_IMG_PATH;

    return `
      <div
        class="product-card"
        data-product-id="${product.id}"
      >
        <img src="${productImg}" style="width: 100px;" alt="Smartwatch product" />
        <p>${product.name}</p>
        <p>${product.description}</p>
        <p>&#36;${centsToDollars(parseInt(product.average_price_cents))} USD</p>
      </div>
  `}).join("");

  productsContainer.html(dataHTML || "<p>No products available</p>");

  productsContainer.find(".product-card").click(e => {
    const productId = $(e.currentTarget).data("product-id");
    window.location.href = `./index.php?page=product-detail&id=${productId}`;
  });
}

function updateNavButtonStates() {
  if (!maxPages || maxPages <= 1) {
    goBackBtn.prop("disabled", true);
    goForwardBtn.prop("disabled", true);
  } else {
    goBackBtn.prop("disabled", currentPage === 1);
    goForwardBtn.prop("disabled", currentPage >= maxPages);
  }
}

function renderPageNumbers() {
  const pagesHTML = [];
  for (let p = 0; p < maxPages; p++) {
    pagesHTML.push(`
      <li>
        <button
          class="page-btn ${p + 1 === currentPage ? "btn btn-dark btn-sm" : "btn btn-outline-dark btn-sm"}"
          data-page="${p + 1}"
        >${p + 1}</button>
      </li>
    `);
  }
  paginationContainer.html(pagesHTML.join(""));

  paginationContainer.find(".page-btn").click(async (e) => {
    const clickedButton = $(e.currentTarget);
    const pageNum = parseInt(clickedButton.data("page"));
    if (pageNum === currentPage) return;

    goBackBtn.prop("disabled", true);
    goForwardBtn.prop("disabled", true);
    paginationContainer.find(".page-btn").prop("disabled", true);
    clickedButton.html("...");

    currentPage = pageNum;
    offset = (currentPage - 1) * PRODUCTS_PER_PAGE;

    await renderProducts(limit, offset);

    renderPageNumbers();
    updateNavButtonStates();
  });
}

async function updatePaginationState(sourceList = null) {
  if (sourceList === null) {
    const allProductsForCount = await getAvailableProductsList();
    maxProducts = allProductsForCount.length;
    currentProductList = null;
  } else {
    currentProductList = sourceList;
    maxProducts = currentProductList.length;
  }

  maxPages = Math.ceil(maxProducts / PRODUCTS_PER_PAGE);
  if (maxProducts === 0) {
    maxPages = 0;
  } else if (maxPages === 0 && maxProducts > 0) {
    maxPages = 1;
  }

  currentPage = 1;
  offset = 0;
  renderPageNumbers();
  updateNavButtonStates();
}

function setupPaginationControls() {
  goBackBtn.click(async () => {
    if (currentPage <= 1) {
      updateNavButtonStates();
      return;
    }

    goBackBtn.prop("disabled", true);
    goForwardBtn.prop("disabled", true);
    paginationContainer.find(".page-btn").prop("disabled", true);

    currentPage--;
    offset -= PRODUCTS_PER_PAGE;
    await renderProducts(limit, offset);
    renderPageNumbers();
    updateNavButtonStates();
  });

  goForwardBtn.click(async () => {
    if (currentPage >= maxPages) {
      updateNavButtonStates();
      return;
    }

    goForwardBtn.prop("disabled", true);
    goBackBtn.prop("disabled", true);
    paginationContainer.find(".page-btn").prop("disabled", true);

    currentPage++;
    offset += PRODUCTS_PER_PAGE;
    await renderProducts(limit, offset);
    renderPageNumbers();
    updateNavButtonStates();
  });
}


async function renderSearchForm() {
  const form = $("#search-form");
  const searchBtn = form.find("#search-btn");
  const clearBtn = form.find("#reset-search-btn");

  const searchCategory = form.find("#search-category");
  const searchBrand = form.find("#search-brand");

  searchCategory.html(`<option value="-1">Loading categories...</option>`);
  searchBrand.html(`<option value="-1">Loading brands...</option>`);

  try {
    const categories = await getCategoriesList();
    const categoriesHTML = `<option value="-1">All</option>` + categories.map(category => (`
      <option value="${category.id}">${category.name}</option>
    `)).join("");
    searchCategory.html(categoriesHTML);

    const brands = await getBrandsList();
    const brandsHTML = `<option value="-1">All</option>` + brands.map(brand => (`
      <option value="${brand.id}">${brand.name}</option>
    `)).join("");
    searchBrand.html(brandsHTML);
  } catch (error) {
    console.error("Failed to load categories or brands:", error);
    searchCategory.html(`<option value="-1">Error loading</option>`);
    searchBrand.html(`<option value="-1">Error loading</option>`);
  }


  searchBtn.click(async e => {
    e.preventDefault();

    searchBtn.prop("disabled", true).html("Searching...");
    goBackBtn.prop("disabled", true);
    goForwardBtn.prop("disabled", true);
    if(paginationContainer.find(".page-btn").length) {
        paginationContainer.find(".page-btn").prop("disabled", true);
    }

    const formData = filterTextInputsInFormData(new FormData(form[0]));
    const filteredProductsList = await getFilterProductsList(
      formData.get("search_input") || null,
      formData.get("search_category") != -1 ? formData.get("search_category") : null,
      formData.get("search_brand") != -1 ? formData.get("search_brand") : null,
      formData.get("search_price_from") || null,
      formData.get("search_price_to") || null,
      false
    );

    await updatePaginationState(filteredProductsList);
    await renderProducts(limit, offset);

    searchBtn.prop("disabled", false).html("Search");
  });

  clearBtn.click(async () => {
    clearBtn.prop("disabled", true).html("Clearing...");
    goBackBtn.prop("disabled", true);
    goForwardBtn.prop("disabled", true);
    if(paginationContainer.find(".page-btn").length) {
        paginationContainer.find(".page-btn").prop("disabled", true);
    }
    form[0].reset();

    await updatePaginationState(null);
    await renderProducts(limit, offset);

    clearBtn.prop("disabled", false).html("Clear search");
  });
}

async function init() {
  await renderSearchForm();
  await updatePaginationState(null);
  setupPaginationControls();
  await renderProducts(limit, offset);
}

init();