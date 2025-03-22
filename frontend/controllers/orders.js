import { ORDERS_API_URL } from "../settings.js";
import { fetchData, updateData } from "../utils.js";


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

export async function updateOrder(id, order, auth) {
  const res = await updateData(ORDERS_API_URL, id, order, auth);

  if(res.success) {
    if(!isFetch) {
      await fetchOrders();
    } else {
      const ordersList = await getOrdersList();
      const newOrdersList = ordersList.map(order => order.id === id ? {...order, ...res.data} : order);
      setOrdersList(newOrdersList);
    }
  }

  return res;
}

export async function getFilterOrdersList(orderFrom=null, orderTo=null, delStateId=null, sortByAddress=false, limit=null, offset=null) {
  const ordersList = await getOrdersList();
  if(orderFrom && !(orderFrom instanceof Date)) orderFrom = new Date(orderFrom);
  if(orderTo && !(orderTo instanceof Date)) orderTo = new Date(orderTo);

  let filterOrdersList = ordersList.filter(order => {
    const orderDate = new Date(order.order_date);
    if(orderFrom && orderDate < orderFrom) return false;
    if(orderTo && orderDate > orderTo) return false;
    if(delStateId && order.delivery_state_id != delStateId) return false;
    return true;
  });

  if(sortByAddress) filterOrdersList = await sortOrdersListByAddress(filterOrdersList);

  const start = offset || 0;
  const end = limit ? start + limit : filterOrdersList.length;
  return filterOrdersList.slice(start, end);
}

export async function sortOrdersListByAddress(list=null) {
  if(!list) list = await getOrdersList();

  return list.slice().sort((orderA, orderB) => {
    const delAddrA = orderA.delivery_address;
    const delAddrB = orderB.delivery_address;

    const compareCity = delAddrA.city_province.localeCompare(delAddrB.city_province);
    if(compareCity) return compareCity;

    const compareDistrict = delAddrA.district.localeCompare(delAddrB.district);
    if(compareDistrict) return compareDistrict;

    const compareWard = delAddrA.ward.localeCompare(delAddrB.ward);
    if(compareWard) return compareWard;

    const compareStreet = delAddrA.street.localeCompare(delAddrB.street);
    if(compareStreet) return compareStreet;

    return delAddrA.apartment_number.localeCompare(delAddrB.apartment_number);
  });
}