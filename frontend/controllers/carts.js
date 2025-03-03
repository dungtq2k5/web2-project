// import { USERS_API_URL } from "../settings.js";
// import { fetchData } from "../utils.js";


// let usersCartList = [];

// export async function getUsersCartList(limit=null, offset=null) {
//   if(usersCartList.length === 0) {
//     console.log("fetch carts API");
//     await fetchUsersCart(limit, offset);
//   }

//   const start = offset || 0;
//   const end = limit ? start + limit : usersCartList.length;
//   return usersCartList.slice(start, end);
// }
// export function setUsersCartList(list) {
//   usersCartList = list;
// }


// export async function fetchUsersCart(limit=null, offset=null) {
//   const res = await fetchData(USERS_API_URL, limit, offset);
//   setUsersCartList(res.data);
// }
