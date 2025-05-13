import { PRODUCTS_OS_API_URL } from "../../settings.js";
import {
  deleteData,
  fetchData,
  sendData,
  updateData
} from "../../utils.js";


let isFetch = false;
let osList = [];

async function fetchOS(limit=null, offset=null) {
  const res = await fetchData(PRODUCTS_OS_API_URL, limit, offset);
  osList = res.data;
  isFetch = true;
}

export async function getOSList(limit=null, offset=null) { // Return a copy
  if(!isFetch) {
    console.log("Fetch products' OS API");
    await fetchOS();
  }

  const start = offset || 0;
  const end = limit ? limit + start : osList.length;
  return JSON.parse(JSON.stringify(osList.slice(start, end)));
}

export async function getOS(id) {
  if(!id) return undefined;

  const osList = await getOSList();
  return osList.find(os => os.id == id) || undefined;
}

export async function createOS(os) {
  if(await getByName(os.name)) {
    return {
      success: false,
      message: `OS name '${os.name}' was already taken, please try another`
    }
  }

  const res = await sendData(PRODUCTS_OS_API_URL, os);

  if(res.success) {
    if(!isFetch) {
      await fetchOS();
    } else {
      osList.push(res.data);
    }
  }

  return res;
}

export async function deleteOS(id) {
  const res = await deleteData(PRODUCTS_OS_API_URL, id);

  if(res.success) {
    if(!isFetch) {
      await fetchOS();
    } else {
      const idx = osList.findIndex(os => os.id == id);
      if(idx !== -1) {
        osList.splice(idx, 1);
      } else {
        console.warn(`Couldn't find os with an ID ${id} to delete`);
      }
    }
  }

  return res;
}

export async function updateOS(id, os) {
  const existOS = await getByName(os.name)
  if(existOS && existOS.id != id) {
    return {
      success: false,
      message: `OS name '${os.name}' was already taken, please try another`
    }
  }

  const res = await updateData(PRODUCTS_OS_API_URL, id, os);

  if(res.success) {
    if(!isFetch) {
      await fetchOS();
    } else {
      const idx = osList.findIndex(os => os.id == id);
      if(idx !== -1) {
        osList[idx] = {...osList[idx], ...res.data};
      } else {
        console.warn(`Couldn't find os with an ID ${id} to update`);
      }
    }
  }

  return res;
}

async function getByName(name) {
  if(!name) return undefined;

  const osList = await getOSList();
  return osList.find(os => os.name === name) || undefined;
}