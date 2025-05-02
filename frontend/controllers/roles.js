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
  rolesList = res.data;
  isFetch = true;
}

export async function getRolesList(limit=null, offset=null) { // Return a copy
  if(!isFetch) {
    console.log("fetch roles API");
    await fetchRoles();
  }

  const start = offset || 0;
  const end = limit ? start + limit : rolesList.length;
  return JSON.parse(JSON.stringify(rolesList.slice(start, end)));
}

export async function createRole(role) {
  const res = await sendData(ROLES_API_URL, role);

  if(res.success) {
    if(!isFetch) {
      await fetchRoles();
    } else {
      rolesList.push(res.data);
    }
  }

  return res;
}

export async function deleteRole(id) {
  const res = await deleteData(ROLES_API_URL, id);

  if(res.success) {
    if(!isFetch) {
      await fetchRoles();
    } else {
      const idx = rolesList.findIndex(role => role.id == id);
      if(idx !== -1) {
        rolesList.splice(idx, 1);
      } else {
        console.warn(`Couldn't find role with an id ${id} to delete`);
      }
    }
  }

  return res;
}

export async function updateRole(id, role) {
  const res = await updateData(ROLES_API_URL, id, role);

  if(res.success) {
    if(!isFetch) {
      await fetchRoles();
    } else {
      const idx = rolesList.findIndex(role => role.id == id);
      if(idx !== -1) {
        rolesList[idx] = {...rolesList[idx], ...res.data};
      } else {
        console.warn(`Couldn't find role with an id ${id} to update`);
      }
    }
  }

  return res;
}
