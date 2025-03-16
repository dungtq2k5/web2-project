import { PRODUCTS_VARIATIONS_API_URL } from "../../settings.js";
import { fetchData, sendData, deleteData } from "../../utils.js";


let isFetch = false;
let variationsList = [];

async function fetchVariations(limit=null, offset=null) {
  const res = await fetchData(PRODUCTS_VARIATIONS_API_URL, limit, offset);
  setVariationsList(res.data);
  isFetch = true;
}

function setVariationsList(list) {
  variationsList = list;
}

export async function getVariationsList(limit=null, offset=null) {
  if(!isFetch) {
    await fetchVariations();
    console.log("fetch products variations API");
  }

  const start = offset || 0;
  const end = limit ? limit + start : variationsList.length;
  return variationsList.slice(start, end);
}

export async function getVariation(id) {
  const variationsList = await getVariationsList();
  const variation = variationsList.find(variation => variation.id === id);

  return variation || undefined;
}

export async function createVariation(variation, auth) {
  const res = await sendData(PRODUCTS_VARIATIONS_API_URL, variation, auth);

  if(res.success) {
    if(!isFetch) {
      await fetchVariations();
    } else {
      const variationsList = await getVariationsList();
      variationsList.push(res.data);
      setVariationsList(variationsList);
    }
  }

  return res;
}

export async function deleteVariation(id, auth) {
  const res = await deleteData(PRODUCTS_VARIATIONS_API_URL, id, auth);

  if(res.success) {
    if(!isFetch) {
      await fetchVariations();
    } else {
      const variationsList = await getVariationsList();
      const newVariationsList = variationsList.filter(variation => variation.id !== id);
      setVariationsList(newVariationsList);
    }
  }

  return res;
}

export async function updateVariation(id, variation, auth) {
  const res = await updateData(PRODUCTS_VARIATIONS_API_URL, id, variation, auth);

  if(res.success) {
    if(!isFetch) {
      await fetchVariations();
    } else {
      const variationsList = await getVariationsList();
      const newVariationsList = variationsList.map(variation => variation.id === id ? {...variation, ...res.data} : variation);
      setVariationsList(newVariationsList);
    }
  }

  return res;
}
