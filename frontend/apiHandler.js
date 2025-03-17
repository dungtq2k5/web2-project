import { getAuth } from "./auth.js";

/**
 * Hàm gửi request API chung
 * @param {string} url - API endpoint
 * @param {string} method - Loại request (GET, POST, PUT, DELETE)
 * @param {object|null} data - Dữ liệu gửi đi (nếu có)
 * @param {boolean} requiresAuth - Có cần gửi `Authorization` không?
 * @returns {Promise<object>} - Trả về dữ liệu JSON từ server
 */
export async function apiRequest(url, method = "GET", data = null, requiresAuth = false) {
    try {
        const headers = { "Content-Type": "application/json" };

        // Nếu cần xác thực, thêm `Authorization` header
        if (requiresAuth) {
            const auth = getAuth();
            if (!auth) throw new Error("User is not authenticated");
            headers["Authorization"] = `Basic ${btoa(`${auth.email}:${auth.password}`)}`;
        }

        const options = {
            method,
            headers,
            ...(data && { body: JSON.stringify(data) }) // Chỉ thêm body nếu có dữ liệu
        };

        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`API Error: ${response.statusText}`);

        return await response.json();
    } catch (error) {
        console.error("Fetch Error:", error);
        return { success: false, message: error.message };
    }
}

/**
 * Gửi request GET
 * @param {string} url - API endpoint
 * @param {boolean} requiresAuth - Có cần xác thực không?
 */
export function fetchData(url, requiresAuth = false) {
    return apiRequest(url, "GET", null, requiresAuth);
}

/**
 * Gửi request POST
 * @param {string} url - API endpoint
 * @param {object} data - Dữ liệu gửi đi
 * @param {boolean} requiresAuth - Có cần xác thực không?
 */
export function sendData(url, data, requiresAuth = false) {
    return apiRequest(url, "POST", data, requiresAuth);
}

/**
 * Gửi request PUT (cập nhật dữ liệu)
 * @param {string} url - API endpoint
 * @param {object} data - Dữ liệu cập nhật
 * @param {boolean} requiresAuth - Có cần xác thực không?
 */
export function updateData(url, data, requiresAuth = false) {
    return apiRequest(url, "PUT", data, requiresAuth);
}

/**
 * Gửi request DELETE
 * @param {string} url - API endpoint
 * @param {boolean} requiresAuth - Có cần xác thực không?
 */
export function deleteData(url, requiresAuth = false) {
    return apiRequest(url, "DELETE", null, requiresAuth);
}
