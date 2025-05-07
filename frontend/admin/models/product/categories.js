import { PRODUCTS_CATEGORIES_API_URL } from "../../../settings.js";
import { deleteData, fetchData, sendData, updateData } from "../../../utils.js";

let isFetch = false;
let categoriesList = [];

async function fetchCategories(limit=null, offset=null) {
  const res = await fetchData(PRODUCTS_CATEGORIES_API_URL, limit, offset);
  categoriesList = res.data;
  isFetch = true;
}

export async function getCategoriesList(limit=null, offset=null) { // Return a copy
  if(!isFetch) {
    console.log("fetch products' categories API");
    await fetchCategories();
  }

  const start = offset || 0;
  const end = limit ? limit + start : categoriesList.length;
  return JSON.parse(JSON.stringify(categoriesList.slice(start, end)));
}

export async function getCategory(id) {
  if(!id) return undefined;

  const categoriesList = await getCategoriesList();
  return categoriesList.find(cate => cate.id == id) || undefined;
}

export async function createCategory(category) {
  if(await getByName(category.name)) {
    return {
      success: false,
      message: `Category name '${category.name}' was already taken, please try another`
    }
  }

  const res = await sendData(PRODUCTS_CATEGORIES_API_URL, category);

  if(res.success) {
    if(!isFetch) {
      await fetchCategories();
    } else {
      categoriesList.push(res.data);
    }
  }

  return res;
}

export async function deleteCategory(id) {
  const res = await deleteData(PRODUCTS_CATEGORIES_API_URL, id);

  if(res.success) {
    if(!isFetch) {
      await fetchCategories();
    } else {
      const idx = categoriesList.findIndex(cate => cate.id == id);
      if(idx !== -1) {
        categoriesList.splice(idx, 1);
      } else {
        console.warn(`Couldn't find category with an id ${id} to delete`);
      }
    }
  }

  return res;
}

export async function updateCategory(id, category) {
  const existCate = await getByName(category.name);
  if(existCate && existCate.id != id) {
    return {
      success: false,
      message: `Category name '${category.name}' was already taken, please try another`
    }
  }

  const res = await updateData(PRODUCTS_CATEGORIES_API_URL, id, category);

  if(res.success) {
    if(!isFetch) {
      await fetchCategories();
    } else {
      const idx = categoriesList.findIndex(cate => cate.id == id);
      if(idx !== -1) {
        categoriesList[idx] = {...categoriesList[idx], ...res.data};
      }
    }
  }

  return res;
}

async function getByName(name) {
  if(!name) return undefined;

  const categories = await getCategoriesList();
  return categories.find(cate => cate.name === name) || undefined;
}