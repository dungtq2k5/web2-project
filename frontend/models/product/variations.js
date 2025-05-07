import { PRODUCTS_VARIATIONS_API_URL } from "../../settings.js";
import {
  fetchData,
  sendData,
  deleteData,
  updateData,
  removeOddSpace,
  convertLocalToUtcDatetime
} from "../../utils.js";


let isFetch = false;
let variationsList = [];

async function fetchVariations(limit=null, offset=null) {
  const res = await fetchData(PRODUCTS_VARIATIONS_API_URL, limit, offset);
  variationsList = res.data;
  isFetch = true;
}

export async function getVariationsList(limit=null, offset=null) { // Return a copy
  if(!isFetch) {
    await fetchVariations();
    console.log("fetch products variations API");
  }

  const start = offset || 0;
  const end = limit ? limit + start : variationsList.length;
  return JSON.parse(JSON.stringify(variationsList.slice(start, end)));
}

export async function getVariation(id) {
  if(!id) return undefined;

  const variationsList = await getVariationsList();
  return variationsList.find(variation => variation.id == id) || undefined;
}

export async function getVariationsByProductId(id) {
  const variationsList = await getVariationsList();
  return variationsList.filter(variation => variation.product_id == id);
}

export async function createVariation(variation) {
  const res = await sendData(PRODUCTS_VARIATIONS_API_URL, variation);

  if(res.success) {
    if(!isFetch) {
      await fetchVariations();
    } else {
      variationsList.push(res.data);
    }
  }

  return res;
}

export async function deleteVariation(id) {
  const res = await deleteData(PRODUCTS_VARIATIONS_API_URL, id);

  if(res.success) {
    if(!isFetch) {
      await fetchVariations();
    } else {
      const idx = variationsList.findIndex(variation => variation.id == id);
      if(idx !== -1) {
        variationsList.splice(idx, 1);
      } else {
        console.error(`Couldn't find variation with an ID ${id} to delete`);
      }
    }
  }

  return res;
}

export async function updateVariation(id, variation) {
  const res = await updateData(PRODUCTS_VARIATIONS_API_URL, id, variation);

  if(res.success) {
    if(!isFetch) {
      await fetchVariations();
    } else {
      const idx = variationsList.findIndex(variation => variation.id == id);
      if(idx !== -1) {
        variationsList[idx] = {...variationsList[idx], ...res.data};
      } else {
        console.error(`Couldn't find variation with an ID ${id} to update`);
      }
    }
  }

  return res;
}

export async function getFilterVariationsList(
  productId=null,
  priceFrom=null,
  priceTo=null,
  releaseFrom=null,
  releaseTo=null,
  stopSelling=null,
  limit=null,
  offset=null
) {
  if(
    productId === null &&
    priceFrom === null &&
    priceTo === null &&
    releaseFrom === null &&
    releaseTo === null &&
    stopSelling === null
  ) return await getVariationsList(limit, offset);

  const variationsList = await getVariationsList();

  if(productId) productId = removeOddSpace(productId);
  if(releaseFrom) releaseFrom = new Date(convertLocalToUtcDatetime(releaseFrom));
  if(releaseTo) releaseTo = new Date(convertLocalToUtcDatetime(releaseTo));

  const filteredVariationsList = variationsList.filter(variation => {
    if(productId && variation.product_id != productId) return false;

    if(priceFrom && (variation.price_cents < priceFrom && variation.base_price_cents < priceFrom)) return false;
    if(priceTo && (variation.price_cents > priceTo && variation.base_price_cents > priceTo)) return false;

    if(releaseFrom && new Date(variation.release_date) < releaseFrom) return false;
    if(releaseTo && new Date(variation.release_date) > releaseTo) return false;

    return !(stopSelling !== null && variation.stop_selling != stopSelling);
  });

  const start = offset || 0;
  const end = limit ? limit + start : filteredVariationsList.length;
  return filteredVariationsList.slice(start, end);
}

export async function softUpdateVariationStock(id, amount=1) {
  variationsList = variationsList.map(
    variation => variation.id == id
      ? {...variation, stock_quantity: variation.stock_quantity + amount}
      : variation
  );
}