import { PRODUCTS_API_URL } from "../../../settings.js";
import {
  deleteData,
  fetchData,
  updateData,
  sendData,
  removeOddSpace
} from "../../../utils.js";


let isFetch = false;
let productsList = [];

async function fetchProducts(limit=null, offset=null) {
  const res = await fetchData(PRODUCTS_API_URL, limit, offset);
  productsList = res.data;
  isFetch = true;
}

export async function getProductsList(limit=null, offset=null) {
  if(!isFetch) {
    await fetchProducts();
    console.log("fetch products API");
  }

  const start = offset || 0;
  const end = limit ? limit + start : productsList.length;
  return JSON.parse(JSON.stringify(productsList.slice(start, end)));
}

export async function getProduct(id) {
  if(!id) return undefined;

  const productsList = await getProductsList();
  return productsList.find(product => product.id == id) || undefined;
}

export async function createProduct(product) {
  if(await getByNameAndModel(product.name, product.model)) {
    return {
      success: false,
      message: `Product name '${product.name}' with model name '${product.model}' was already taken, please try another`
    }
  }

  const res = await sendData(PRODUCTS_API_URL, product);

  if(res.success) {
    if(!isFetch) {
      await fetchProducts();
    } else {
      productsList.push(res.data);
    }
  }

  return res;
}

export async function deleteProduct(id) {
  const res = await deleteData(PRODUCTS_API_URL, id);

  if(res.success) {
    if(!isFetch) {
      await fetchProducts();
    } else {
      const idx = productsList.findIndex(product => product.id == id);
      if(idx !== -1) {
        productsList.splice(idx, 1);
      } else {
        console.warn(`Couldn't find product with and ID ${id} to delete`);
      }
    }
  }

  return res;
}

export async function updateProduct(id, product) {
  const existProduct = await getByNameAndModel(product.name, product.model);
  if(existProduct && existProduct.id != id) {
    return {
      success: false,
      message: `Product name '${product.name}' with model name '${product.model}' was already taken, please try another`
    }
  }

  const res = await updateData(PRODUCTS_API_URL, id, product);

  if(res.success) {
    if(!isFetch) {
      await fetchProducts();
    } else {
      const idx = productsList.findIndex(product => product.id == id);
      if(idx !== -1) {
        productsList[idx] = {...productsList[idx], ...res.data};
      } else {
        console.warn(`Couldn't find product with and ID ${id} to update`);
      }
    }
  }

  return res;
}

export async function getFilterProductsList(valSearch=null, limit=null, offset=null) {
  if(!valSearch) return await getProductsList(limit, offset);

  const productsList = await getProductsList();
  const formattedValSearch = removeOddSpace(valSearch.toLowerCase());

  const filteredProductsList = productsList.filter(product => {
    return (
      String(product.id).includes(formattedValSearch) ||
      product.name.toLowerCase().includes(formattedValSearch) ||
      product.model.toLowerCase().includes(formattedValSearch) ||
      product.brand.name.toLowerCase().includes(formattedValSearch) ||
      product.category.name.toLowerCase().includes(formattedValSearch) ||
      product.description.toLowerCase().includes(formattedValSearch) ||
      String(Boolean(product.stop_selling)).includes(formattedValSearch)
    )
  });

  const start = offset || 0;
  const end = limit ? start + limit : filteredProductsList.length;
  return filteredProductsList.slice(start, end);
}

async function getByNameAndModel(name, model) {
  if(!name || !model) return undefined;

  const products = await getProductsList();
  return products.find(product => product.name === name && product.model === model) || undefined;
}