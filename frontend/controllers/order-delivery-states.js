import { ORDERS_DELIVERY_STATES_API_URL } from "../settings.js";
import { fetchData } from "../utils.js";


let isFetch = false;
let statesList = [];

async function fetchStatesList(limit=null, offset=null) {
  const res = await fetchData(ORDERS_DELIVERY_STATES_API_URL, limit, offset);
  setStatesList(res.data);
  isFetch = true;
}

function setStatesList(list) {
  statesList = list;
}

export async function getStatesList(limit=null, offset=null) {
  if(!isFetch) {
    await fetchStatesList();
    console.log("fetch delivery states API");
  }

  const start = offset || 0;
  const end = limit ? limit + start : statesList.length;
  return statesList.slice(start, end);
}

export async function getState(id) {
  const statesList = await getStatesList();
  const state = statesList.find(state => state.id === id);

  return state || undefined;
}