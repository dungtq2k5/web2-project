import { ORDERS_API_URL } from "../settings.js";
import { fetchData, updateData, convertLocalToUtcDatetime } from "../utils.js";


let isFetch = false;
let ordersList = [];

async function fetchOrders(limit=null, offset=null) {
  const res = await fetchData(ORDERS_API_URL, limit, offset);
  ordersList = res.data;
  isFetch = true;
}

export async function getOrdersList(limit=null, offset=null) { // Return a copy of list
  if(!isFetch) {
    await fetchOrders();
    console.log("fetch orders API");
  }

  const start = offset || 0;
  const end = limit ? limit + start : ordersList.length;
  return JSON.parse(JSON.stringify(ordersList.slice(start, end)));
}

export async function getOrder(id) {
  if(!id) return undefined;

  const ordersList = await getOrdersList();
  return ordersList.find(order => order.id == id) || undefined;
}

export async function updateOrder(id, order) {
  const res = await updateData(ORDERS_API_URL, id, order);

  if(res.success) {
    if(!isFetch) {
      await fetchOrders();
    } else {
      const idx = ordersList.findIndex(order => order.id == id);
      if(idx !== -1) {
        ordersList[idx] = {...ordersList[idx], ...res.data};
      } else {
        console.warn(`Couldn't find order with an id ${id} to update`);
      }
    }
  }

  return res;
}

export async function getFilterOrdersList(
  orderFrom=null,
  orderTo=null,
  cityProvince=null,
  district=null,
  ward=null,
  street=null,
  delStateId=null,
  sortByAddress=false,
  limit=null,
  offset=null
) {
  if(
    orderFrom === null &&
    orderTo === null &&
    cityProvince === null &&
    district === null &&
    ward === null &&
    street === null &&
    delStateId === null &&
    sortByAddress === false
  ) return await getOrdersList(limit, offset);

  const ordersList = await getOrdersList();

  if(orderFrom) orderFrom = new Date(convertLocalToUtcDatetime(orderFrom));
  if(orderTo) orderTo = new Date(convertLocalToUtcDatetime(orderTo));

  if(cityProvince) cityProvince = cityProvince.toLowerCase();
  if(district) district = district.toLowerCase();
  if(ward) ward = ward.toLowerCase();
  if(street) street = street.toLowerCase();


  let filterOrdersList = ordersList.filter(order => {
    if(orderFrom || orderTo) {
      const orderDate = new Date(order.order_date); // UTC datetime
      if(orderFrom && orderDate < orderFrom) return false;
      if(orderTo && orderDate > orderTo) return false;
    }

    if(cityProvince && order.delivery_address.city_province.toLowerCase() != cityProvince) return false;
    if(district && order.delivery_address.district.toLowerCase() != district) return false;
    if(ward && order.delivery_address.ward.toLowerCase() != ward) return false;
    if(street && order.delivery_address.street.toLowerCase() != street) return false;

    if(delStateId && order.delivery_state_id != delStateId) return false;

    return true;
  });

  if(sortByAddress) filterOrdersList = await sortOrdersListByAddress(filterOrdersList);

  const start = offset || 0;
  const end = limit ? start + limit : filterOrdersList.length;
  return filterOrdersList.slice(start, end);
}

export async function sortOrdersListByAddress(list=null) { // Sort by city > district > ward > street
  const orders = list || await getOrdersList();

  return orders.sort((orderA, orderB) => {
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

export async function getOrderItem(orderId, variationId) {
  if(!orderId || !variationId) return undefined;

  const order = await getOrder(orderId);
  if(!order) return undefined;

  return order.items.find(item => item.product_variation_id == variationId) || undefined;
}