import { PERMISSIONS_API_URL } from "../settings.js";
import { fetchData } from "../utils.js";


let isFetch = false;
let permissionsList = [];

async function fetchPermissions(limit=null, offset=null) {
    const res = await fetchData(PERMISSIONS_API_URL, limit, offset);
    permissionsList = res.data;
    isFetch = true;
}

export async function getPermissionsList(limit=null, offset=null) { // Return a copy
  if(!isFetch) {
    console.log("fetch permissions API");
    await fetchPermissions();
  }

  const start = offset || 0;
  const end = limit ? start + limit : permissionsList.length;
  return JSON.parse(JSON.stringify(permissionsList.slice(start, end)));
}

// export async function getByActionCode(actionCode) {
//   if(!actionCode) return undefined;

//   const permissions = await getPermissionsList();
//   return permissions.find(permission => permission.action_code === actionCode) || undefined;
// }