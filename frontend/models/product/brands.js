import { PRODUCTS_BRANDS_API_URL } from "../../settings.js";
import {
  deleteData,
  fetchData,
  sendData,
  updateData
} from "../../utils.js";


let isFetch = false;
let brandsList = [];

async function fetchBrands(limit=null, offset=null) {
  const res = await fetchData(PRODUCTS_BRANDS_API_URL, limit, offset);
  brandsList = res.data;
  isFetch = true;
}

export async function getBrandsList(limit=null, offset=null) { // Return a copy
  if(!isFetch) {
    console.log("Fetch products' brands API");
    await fetchBrands();
  }

  const start = offset || 0;
  const end = limit ? limit + start : brandsList.length;
  return JSON.parse(JSON.stringify(brandsList.slice(start, end)));
}

export async function getBrand(id) {
  if(!id) return undefined;

  const brandsList = await getBrandsList();
  return brandsList.find(brand => brand.id == id) || undefined;
}

export async function createBrand(brand) {
  if(await getByName(brand.name)) {
    return {
      success: false,
      message: `Brand name '${brand.name}' was already taken, please try another`
    }
  }

  const res = await sendData(PRODUCTS_BRANDS_API_URL, brand);

  if(res.success) {
    if(!isFetch) {
      await fetchBrands();
    } else {
      brandsList.push(res.data);
    }
  }

  return res;
}

export async function deleteBrand(id) {
  const res = await deleteData(PRODUCTS_BRANDS_API_URL, id);

  if(res.success) {
    if(!isFetch) {
      await fetchBrands();
    } else {
      const idx = brandsList.findIndex(brand => brand.id == id);
      if(idx != -1) {
        brandsList.splice(idx, 1);
      } else {
        console.warn(`Couldn't find brand with an id ${id} to delete`);
      }
    }
  }

  return res;
}

export async function updateBrand(id, brand) {
  const existBrand = await getByName(brand.name);
  if(existBrand && existBrand.id != id) {
    return {
      success: false,
      message: `Brand name '${brand.name}' was already taken, please try another`
    }
  }

  const res = await updateData(PRODUCTS_BRANDS_API_URL, id, brand);

  if(res.success) {
    if(!isFetch) {
      await fetchBrands();
    } else {
      const idx = brandsList.findIndex(brand => brand.id == id);
      if(idx !== -1) {
        brandsList[idx] = {...brandsList[idx], ...res.data};
      } else {
        console.warn(`Couldn't find brand with an id ${id} to update`);
      }
    }
  }

  return res;
}

async function getByName(name) {
  if(!name) return undefined;

  const brands = await getBrandsList();
  return brands.find(brand => brand.name === name) || undefined;
}