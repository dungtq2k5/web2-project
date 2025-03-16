import { ORDERS_API_URL } from "../settings.js";
import { fetchData } from "../utils.js";


let isFetch = false;
let ordersList = [];

async function fetchOrders(limit=null, offset=null) {
  const res = await fetchData(ORDERS_API_URL, limit, offset);
  setOrdersList(res.data);
  isFetch = true;
}

function setOrdersList(list) {
  ordersList = list;
}

export async function getOrdersList(limit=null, offset=null) {
  if(!isFetch) {
    await fetchOrders();
    console.log("fetch orders API");
  }

  const start = offset || 0;
  const end = limit ? limit + start : ordersList.length;
  return ordersList.slice(start, end);
}

export async function getOrder(id) {
  const ordersList = await getOrdersList();
  const order = ordersList.find(order => order.id === id);

  return order || undefined;
}