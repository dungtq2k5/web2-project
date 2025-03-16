import { PRODUCTS_INSTANCES_API_URL } from "../../settings.js";
import { fetchData } from "../../utils.js";


let isFetch = false;
let instancesList = [];

async function fetchInstances(limit=null, offset=null) {
  const res = await fetchData(PRODUCTS_INSTANCES_API_URL, limit, offset);
  setInstancesList(res.data);
  isFetch = true;
}

function setInstancesList(list) {
  instancesList = list;
}

export async function getInstancesList(limit=null, offset=null) {
  if(!isFetch) {
    await fetchInstances();
    console.log("fetch products instances API");
  }

  const start = offset || 0;
  const end = limit ? limit + start : instancesList.length;
  return instancesList.slice(start, end);
}

export async function getInstance(sku) {
  const instancesList = await getInstancesList();
  const instance = instancesList.find(instance => instance.sku === sku);

  return instance || undefined;
}