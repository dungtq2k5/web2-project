import { CORE_ROLES_ID, ROLES_API_URL } from "../settings.js";
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
  if((await getRoleByName(role.name))) {
    return {
      success: false,
      message: `Role name '${role.name}' was already taken, please try another`
    }
  }

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
  if(CORE_ROLES_ID.includes(parseInt(id))) {
    return {
      success: false,
      message: "Cannot delete base roles"
    }
  }

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
  if(CORE_ROLES_ID.includes(parseInt(id))) {
    return {
      success: false,
      message: "Cannot update base roles"
    }
  }

  const existRole = await getRoleByName(role.name);
  if(existRole && existRole.id != id) {
    return {
      success: false,
      message: `Role name '${role.name}' was already taken, please try another`
    }
  }

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

export async function getRole(id) {
  if(!id) return undefined;

  const rolesList = await getRolesList();
  return rolesList.find(role => role.id == id) || undefined;
}

export async function getRoleByName(name) {
  if(!name) return undefined;

  const rolesList = await getRolesList();
  return rolesList.find(role => role.name == name) || undefined;
}