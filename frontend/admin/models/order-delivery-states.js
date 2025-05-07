import { ORDERS_DELIVERY_STATES_API_URL } from "../../settings.js";
import { fetchData } from "../../utils.js";


let isFetch = false;
let statesList = [];

async function fetchStatesList(limit=null, offset=null) {
  const res = await fetchData(ORDERS_DELIVERY_STATES_API_URL, limit, offset);
  statesList = res.data;
  isFetch = true;
}

export async function getStatesList(limit=null, offset=null) { // Return a copy
  if(!isFetch) {
    await fetchStatesList();
    console.log("fetch delivery states API");
  }

  const start = offset || 0;
  const end = limit ? limit + start : statesList.length;
  return JSON.parse(JSON.stringify(statesList.slice(start, end)));
}

export async function getState(id) {
  if(!id) return undefined;

  const statesList = await getStatesList();
  return statesList.find(state => state.id == id) || undefined;
}
