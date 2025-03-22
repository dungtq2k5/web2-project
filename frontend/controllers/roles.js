import { ROLES_API_URL } from "../settings.js";
import {
  deleteData,
  fetchData,
  sendData,
  updateData
} from "../utils.js";


let isFetch = false;
let rolesList = [];


async function fetchRoles(limit=null, offset=null) {
  const res = await fetchData(ROLES_API_URL, limit, offset);
  setRolesList(res.data);
  isFetch = true;
}

function setRolesList(list) {
  rolesList = list;
}

export async function getRolesList(limit=null, offset=null) {
  if(!isFetch) {
    console.log("fetch roles API");
    await fetchRoles();
  }

  const start = offset || 0;
  const end = limit ? start + limit : rolesList.length;
  return rolesList.slice(start, end);
}

export async function createRole(role, auth) {
  const res = await sendData(ROLES_API_URL, role, auth);

  if(res.success) {
    if(!isFetch) {
      await fetchRoles();
    } else {
      const rolesList = await getRolesList();
      rolesList.push(res.data);
      setRolesList(rolesList);
    }
  }

  return res;
}

export async function deleteRole(id, auth) {
  const res = await deleteData(ROLES_API_URL, id, auth);

  if(res.success) {
    if(!isFetch) {
      await fetchRoles();
    } else {
      const rolesList = await getRolesList();
      const newRolesList = rolesList.filter(role => role.id !== id);
      setRolesList(newRolesList);
    }
  }

  return res;
}

export async function updateRole(id, role, auth) {
  const res = await updateData(ROLES_API_URL, id, role, auth);

  if(res.success) {
    if(!isFetch) {
      await fetchRoles();
    } else {
      const rolesList = await getRolesList();
      const newRolesList = rolesList.map(role => role.id === id ? {...role, ...res.data} : role);
      setRolesList(newRolesList);
    }
  }

  return res;
}
