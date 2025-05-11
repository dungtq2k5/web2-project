import { fetchData, sendData } from "../utils.js"
import { ADDRESSES_API_URL } from "../settings.js";


let isFetch = false;
// Sure that if user is buyer only, the API will return the addresses of this user not all users
let addressesList = [];

export async function fetchAddresses() {
  const res  = await fetchData(ADDRESSES_API_URL);
  addressesList = res.data;
  isFetch = true;
}

export async function getAddressesList(limit=null, offset=null) { // Return a copy
  if(!isFetch) { // First call not fetch -> fetch
    await fetchAddresses();
    console.log("fetch addresses API");
  }
  console.log(addressesList);
  const start = offset || 0;
  const end = limit ? limit + start : addressesList.length;
  return JSON.parse(JSON.stringify(addressesList.slice(start, end)));
}

export async function createAddress(address) {
  const res = await sendData(ADDRESSES_API_URL, address);

  if(res.success)  {
    if(!isFetch) {
      await fetchAddresses();
    } else {
      if(res.data.is_default) {
        const idx = addressesList.findIndex(address => address.is_default);
        if(idx !== -1) {
          addressesList[idx].is_default = false;
        } else {
          console.warn("No default address found");
        }
      }
      addressesList.push(res.data);
    }
  }

  return res;
}