import { ROLES_API_URL } from "../settings.js";
import {
  fetchData,
  sendData
} from "../utils.js";


let rolesList = [];

export async function getRolesList(limit=null, offset=null) {
  if(rolesList.length === 0) {
    console.log("fetch roles API");
    await fetchRoles();
  }

  const start = offset || 0;
  const end = limit ? start + limit : rolesList.length;
  return rolesList.slice(start, end);
}

export function setRolesList(list) {
  rolesList = list;
}

export async function fetchRoles(limit=null, offset=null) {
  const res = await fetchData(ROLES_API_URL, limit, offset);
  setRolesList(res.data);
}

export async function createRoles(role, auth) {
  const res = await sendData(ROLES_API_URL, role, auth);
  if(res.success) {
    rolesList.push(res.data);
    setRolesList(rolesList);
  }

  return res;
}