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
  setBrandsList(res.data);
  isFetch = true;
}

function setBrandsList(list) {
  brandsList = list;
}

export async function getBrandsList(limit=null, offset=null) {
  if(!isFetch) {
    console.log("fetch products' brands API");
    await fetchBrands();
  }

  const start = offset || 0;
  const end = limit ? limit + start : brandsList.length;
  return brandsList.slice(start, end);
}

export async function getBrand(id) {
  const brandsList = await getBrandsList();
  const brand = brandsList.find(brand => brand.id === id);

  return brand || undefined;
}

export async function createBrand(brand, auth) {
  const res = await sendData(PRODUCTS_BRANDS_API_URL, brand, auth);

  if(res.success) {
    if(!isFetch) {
      await fetchBrands();
    } else {
      const brandsList = await getBrandsList();
      brandsList.push(res.data);
      setBrandsList(brandsList);
    }
  }

  return res;
}
export async function deleteBrand(id, auth) {
  const res = await deleteData(PRODUCTS_BRANDS_API_URL, id, auth);

  if(res.success) {
    if(!isFetch) {
      await fetchBrands();
    } else {
      const brandsList = await getBrandsList();
      const newBrandsList = brandsList.filter(brand => brand.id !== id);
      setBrandsList(newBrandsList);
    }
  }

  return res;
}
export async function updateBrand(id, brand, auth) {
  const res = await updateData(PRODUCTS_BRANDS_API_URL, id, brand, auth);

  if(res.success) {
    if(!isFetch) {
      await fetchBrands();
    } else {
      const brandsList = await getBrandsList();
      const newBrandsList = brandsList.map(brand => brand.id === id ? {...brand, ...res.data} : brand);
      setBrandsList(newBrandsList);
    }
  }

  return res;
}
