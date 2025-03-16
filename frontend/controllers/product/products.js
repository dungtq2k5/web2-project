import { PRODUCTS_API_URL } from "../../settings.js";
import { deleteData, fetchData, updateData } from "../../utils.js";


let isFetch = false;
let productsList = [];

async function fetchProducts(limit=null, offset=null) {
  const res = await fetchData(PRODUCTS_API_URL, limit, offset);
  setProductsList(res.data);
  isFetch = true;
}

function setProductsList(list) {
  productsList = list;
}

export async function getProductsList(limit=null, offset=null) {
  if(!isFetch) {
    await fetchProducts();
    console.log("fetch products API");
  }

  const start = offset || 0;
  const end = limit ? limit + start : productsList.length;
  return productsList.slice(start, end);
}

export async function getProduct(id) {
  const productsList = await getProductsList();
  const product = productsList.find(product => product.id === id);

  return product || undefined;
}

export async function createProduct(product, auth) {
  const res = await sendData(PRODUCTS_API_URL, product, auth);

  if(res.success) {
    if(!isFetch) {
      await fetchProducts();
    } else {
      const productsList = await getProductsList();
      productsList.push(res.data);
      setProductsList(productsList);
    }
  }

  return res;
}

export async function deleteProduct(id, auth) {
  const res = await deleteData(PRODUCTS_API_URL, id, auth);

  if(res.success) {
    if(!isFetch) {
      await fetchProducts();
    } else {
      const productsList = await getProductsList();
      const newProductsList = productsList.filter(product => product.id !== id);
      setProductsList(newProductsList);
    }

  }

  return res;
}

export async function updateProduct(id, product, auth) {
  const res = await updateData(PRODUCTS_API_URL, id, product, auth);

  if(res.success) {
    if(!isFetch) {
      await fetchProducts();
    } else {
      const productsList = await getProductsList();
      const newProductsList = productsList.map(product => product.id === id ? {...product, ...res.data} : product);
      setProductsList(newProductsList);
    }
  }

  return res;
}
