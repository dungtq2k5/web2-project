import { PRODUCTS_INSTANCES_API_URL } from "../../settings.js";
import {
  deleteData,
  fetchData,
  removeOddSpace,
  sendData,
  updateData
} from "../../utils.js";
import { softUpdateVariationStock } from "./variations.js";


let isFetch = false;
let instancesList = [];

async function fetchInstances(limit=null, offset=null) {
  const res = await fetchData(PRODUCTS_INSTANCES_API_URL, limit, offset);
  instancesList = res.data;
  isFetch = true;
}

export async function getInstancesList(limit=null, offset=null) { // Return a copy
  if(!isFetch) {
    await fetchInstances();
    console.log("fetch products instances API");
  }

  const start = offset || 0;
  const end = limit ? limit + start : instancesList.length;
  return JSON.parse(JSON.stringify(instancesList.slice(start, end)));
}

export async function getInstance(sku) {
  if(!sku) return undefined;

  const instancesList = await getInstancesList();
  return instancesList.find(instance => instance.sku == sku) || undefined;
}

export async function createInstance(instance) {
  const res = await sendData(PRODUCTS_INSTANCES_API_URL, instance);

  if(res.success) {
    if(!isFetch) {
      await fetchInstances();
    } else {
      instancesList.push(res.data);
    }

    await softUpdateVariationStock(instance.product_variation_id); // When create an instance -> update variations list
  }

  return res;
}

export async function deleteInstance(sku, variationId) {
  const res = await deleteData(PRODUCTS_INSTANCES_API_URL, sku);

  if(res.success) {
    if(!isFetch) {
      await fetchInstances();
    } else {
      const idx = instancesList.findIndex(instance => instance.sku == sku);
      if(idx !== -1) {
        instancesList.splice(idx, 1);
      } else {
        console.warn(`Couldn't find instance with an sku ${sku} to delete`);
      }
    }

    await softUpdateVariationStock(variationId, -1); // When delete an instance -> update variations list
  }

  return res;
}

export async function updateInstance(sku, currInstance, newInstance) {
  const res = await updateData(PRODUCTS_INSTANCES_API_URL, sku, newInstance);

  if(res.success) {
    if(!isFetch) {
      await fetchInstances();
    } else {
      const idx = instancesList.findIndex(instance => instance.sku == sku);
      if(idx !== -1) {
        instancesList[idx] = {...instancesList[idx], ...res.data};
      } else {
        console.warn(`Couldn't find instance with an sku ${sku} to update`);
      }
    }

    if("is_sold" in newInstance && currInstance.is_sold != newInstance.is_sold) { // When is_sold changed -> update variations list
      await softUpdateVariationStock(currInstance.product_variation_id, Boolean(currInstance.is_sold) - Boolean(newInstance.is_sold));
    }
  }

  return res;
}

export async function getFilterInstancesList(
  receiptId=null,   // null or null string or a number string
  variationId=null, // null or a number
  isSold=null,      // null or true or false
  limit=null,
  offset=null
) {
  if(
    receiptId === null &&
    variationId === null &&
    isSold === null
  ) return await getInstancesList(limit, offset);

  const instancesList = await getInstancesList();

  if(receiptId) receiptId = removeOddSpace(receiptId).toLowerCase();
  if(variationId) variationId = removeOddSpace(variationId);

  const filteredInstancesList = instancesList.filter(instance => {
    if(receiptId && String(instance.goods_receipt_note_id) != receiptId) return false;

    if(variationId && instance.product_variation_id != variationId) return false;

    return !(isSold !== null && instance.is_sold != isSold);
  });

  const start = offset || 0;
  const end = limit ? limit + start : filteredInstancesList.length;
  return filteredInstancesList.slice(start, end);
}

export async function getInstanceBySerialNum(serialNum) {
  if(!serialNum) return undefined;

  const instancesList = await getInstancesList();
  return instancesList.find(instance => instance.supplier_serial_number == serialNum) || null;
}

export async function getInstanceByIMEI(imei) { // IMEI can be null base on business logic so only find instance with IMEI is not null
  if(!imei) return undefined;

  const instancesList = await getInstancesList();
  return instancesList.find(instance => instance.supplier_imei_number == imei) || null;
}