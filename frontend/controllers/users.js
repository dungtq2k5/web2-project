import { USERS_API_URL, AUTH_STORAGE } from "../settings.js";
import {
  deleteData,
  fetchData,
  sendData,
  updateData,
  removeOddSpace
} from "../utils.js";


let usersList = [];

export async function getUsersList(limit=null, offset=null) {
  if(usersList.length === 0) {
    console.log("fetch users API");
    await fetchUsers(); //first call get -> fetch
  }

  const start = offset || 0;
  const end = limit ? start + limit : usersList.length;
  return usersList.slice(start, end);
}
export async function getUser(id) {
  const usersList = await getUsersList();
  const userFind = usersList.find(user => user.id===id);

  return userFind ? userFind : undefined;
}
export function setUsersList(list) {
  usersList = list;
}
export async function getFilterUsersList(valueSearch,limit=null, offset=null) { //filter users base on almost all fields
  const usersList = await getUsersList();
  const formattedValueSearch = removeOddSpace(valueSearch.toLowerCase());

  const filteredUsersList = usersList.filter(user => {
    return (
      user.full_name.toLowerCase().includes(formattedValueSearch) ||
      user.email.toLowerCase().includes(formattedValueSearch) ||
      user.phone_number.toLowerCase().includes(formattedValueSearch) ||
      includeRoles(formattedValueSearch, user.roles)
    );
  });

  const start = offset || 0;
  const end = limit ? start + limit : usersList.length;
  return filteredUsersList.slice(start, end);
}
function includeRoles(valueSearch, userRoles) { //support for getFilterUsersList
  const formattedValueSearch = removeOddSpace(valueSearch.toLowerCase());
  return userRoles.some(role => role.name.toLowerCase().includes(formattedValueSearch));
}


export async function fetchUsers(limit=null, offset=null) {
  const res = await fetchData(USERS_API_URL, limit, offset);
  setUsersList(res.data);
}
export async function createUser(user, auth) {
  const res = await sendData(USERS_API_URL, user, auth);
  if(res.success) {
    usersList.push(res.data);
    setUsersList(usersList);
  }

  return res;
}
export async function deleteUser(id, auth) {
  const res = await deleteData(USERS_API_URL, id, auth);
  if(res.success) {
    const newUsersList = usersList.filter(user => user.id != id);
    setUsersList(newUsersList);
  }

  return res;
}
export async function updateUser(id, user, auth) {
  const res = await updateData(USERS_API_URL, id, user, auth);
  if(res.success) {
    const usersList = await getUsersList();
    const updatedUsersList = usersList.map(user => user.id === id ? {...user, ...res.data} : user);
    setUsersList(updatedUsersList);
  }

  return res;
}


export function getAuth() {
  if(!sessionStorage.getItem(AUTH_STORAGE)) return false;
  return JSON.parse(sessionStorage.getItem(AUTH_STORAGE));
}
export function setAuth(auth) {
  sessionStorage.setItem(AUTH_STORAGE, JSON.stringify(auth));
}