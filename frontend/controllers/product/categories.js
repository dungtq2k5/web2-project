import { PRODUCTS_CATEGORIES_API_URL } from "../../settings.js";
import { deleteData, fetchData, sendData, updateData } from "../../utils.js";

let isFetch = false;
let categoriesList = [];

async function fetchCategories(limit=null, offset=null) {
  const res = await fetchData(PRODUCTS_CATEGORIES_API_URL, limit, offset);
  setCategoriesList(res.data);
  isFetch = true;
}

function setCategoriesList(list) {
  categoriesList = list;
}

export async function getCategoriesList(limit=null, offset=null) {
  if(!isFetch) {
    console.log("fetch products categories API");
    await fetchCategories();
  }

  const start = offset || 0;
  const end = limit ? limit + start : categoriesList.length;
  return categoriesList.slice(start, end);
}

export async function getCategory(id) {
  const categoriesList = await getCategoriesList();
  const category = categoriesList.find(cate => cate.id === id);

  return category || undefined;
}

export async function createCategory(category, auth) {
  const res = await sendData(PRODUCTS_CATEGORIES_API_URL, category, auth);

  if(res.success) {
    if(!isFetch) {
      await fetchCategories();
    } else {
      const categoriesList = await getCategoriesList();
      categoriesList.push(res.data);
      setCategoriesList(categoriesList);
    }
  }

  return res;
}

export async function deleteCategory(id, auth) {
  const res = await deleteData(PRODUCTS_CATEGORIES_API_URL, id, auth);

  if(res.success) {
    if(!isFetch) {
      await fetchCategories();
    } else {
      const categoriesList = await getCategoriesList();
      const newCategoriesList = categoriesList.filter(cate => cate.id !== id);
      setCategoriesList(newCategoriesList);
    }
  }

  return res;
}

export async function updateCategory(id, category, auth) {
  const res = await updateData(PRODUCTS_CATEGORIES_API_URL, id, category, auth);

  if(res.success) {
    if(!isFetch) {
      await fetchCategories();
    } else {
      const categoriesList = await getCategoriesList();
      const newCategoriesList = categoriesList.map(cate => cate.id === id ? {...cate, ...res.data} : cate);
      setCategoriesList(newCategoriesList);
    }
  }

  return res;
}