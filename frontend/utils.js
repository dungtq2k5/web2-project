import { restricts, TTL } from "./settings.js";

async function request(url, method = "GET", data = null, headers = {}) {
  try {
    let body = null;

    if (data) {
      if (data instanceof FormData) {
        body = data;
      } else {
        headers["Content-Type"] = "application/json";
        body = JSON.stringify(data);
      }
    }

    const res = await fetch(url, {
      method,
      credentials: "include", // Handle cookies
      headers,
      body,
    });

    // if(!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`); // Let UI handle this

    return await res.json();
  } catch (error) {
    console.error(`Fetch error (${method} ${url}):`, error);
    throw error;
  }
}

export async function fetchData(url, limit = null, offset = null) {
  const params = new URLSearchParams();
  if (limit) params.append("limit", limit);
  if (offset) params.append("offset", offset);

  return await request(`${url}?${params.toString()}`);
}

export async function sendData(url, data = null) {
  return await request(url, "POST", data);
}

export async function deleteData(url, id) {
  return await request(`${url}/${id}`, "DELETE");
}

export async function updateData(url, id, data) {
  let method = "PUT";
  const headers = {};

  if (data instanceof FormData) {
    // While FormData only work with POST
    method = "POST";
    headers["X-HTTP-Method-Override"] = "PUT";
  }

  return await request(`${url}/${id}`, method, data, headers);
}

export function disableBgScroll() {
  $("body").css("overflow", "hidden");
}

export function enableBgScroll() {
  $("body").css("overflow", "");
}

export function isValidVNPhoneNumber(phoneNumber) {
  // AI gen
  // 1. Remove all non-numeric characters (except the leading '+')
  phoneNumber = phoneNumber.replace(/[^0-9+]/g, "");

  // 2. Check for the leading '+' (for international numbers)
  const isInternational = phoneNumber.startsWith("+");

  let pattern = isInternational
    ? /^\+84\d{9}$/ // International format
    : /^0\d{9}$/; // Domestic format

  // 3. Perform the regex match
  return pattern.test(phoneNumber);
}

export function removeOddSpace(str) {
  // AI help
  return str.replace(/\s+/g, " ").trim();
}

export function isValidEmail(email) {
  // AI gen
  if (typeof email !== "string") return false; // Handle non-string input

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPassword(password, minLength = 15) {
  // password contains at least a letter + a number + length >= minLength -> valid
  return (
    password.length >= minLength &&
    /[a-zA-Z]/.test(password) &&
    /\d/.test(password)
  );
}

export function formatAddress(address) {
  const {
    name,
    street,
    apartment_number,
    ward,
    district,
    city_province,
    is_default,
  } = address;

  let addressString = name;
  if (apartment_number) addressString += `, Apartment ${apartment_number}`;
  addressString += `, ${street}`;
  if (ward) addressString += `, ${ward}`;
  if (district) addressString += `, ${district}`;
  if (city_province) addressString += `, ${city_province}`;
  if (is_default) addressString += ` (default)`;

  return addressString;
}

export async function isValidImg( // AI gen
  file,
  allowedTypes = restricts.img.allowedTypes,
  maxFileSize = restricts.img.maxFileSize,
  maxWidth = restricts.img.maxWidth,
  maxHeight = restricts.img.maxHeight
) {
  const errors = [];

  if (!allowedTypes.includes(file.type)) {
    errors.push(
      `Invalid file type. Allowed types are: ${allowedTypes.join(", ")}`
    );
  }

  if (file.size > maxFileSize) {
    errors.push(
      `File size exceeds the maximum of ${maxFileSize / (1024 * 1024)}MB`
    );
  }

  //Check image dimensions
  try {
    const img = new Image();
    img.src = await readFileAsDataURL(file);
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });

    if (img.width > maxWidth || img.height > maxHeight) {
      errors.push(
        `Image dimensions exceed the maximum allowed size of ${maxWidth}x${maxHeight}px`
      );
    }
  } catch (error) {
    errors.push(`Uploaded file is not a valid image`);
  }

  return errors;
}

export function readFileAsDataURL(file) {
  // AI gen
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

export function isDateInPast(date) {
  // AI help
  if (!(date instanceof Date)) date = new Date(date);
  const currentDate = new Date();

  // Reset the time portion of both dates to midnight for accurate comparison
  date.setHours(0, 0, 0, 0);
  currentDate.setHours(0, 0, 0, 0);

  // Compare the dates
  return date < currentDate;
}

export function filterTextInputsInFormData(formData) {
  // AI help
  const updatedFormData = new FormData();

  for (const [key, val] of formData.entries()) {
    const input = $(`[name="${key}"]`);

    if (input.length && input.attr("type") === "text") {
      updatedFormData.append(key, removeOddSpace(val));
    } else {
      updatedFormData.append(key, val);
    }
  }

  return updatedFormData;
}

export function convertToMySQLDatetime(datetime, utc = true) {
  // AI help
  if (!(datetime instanceof Date)) datetime = new Date(datetime);

  const year = utc ? datetime.getUTCFullYear() : datetime.getFullYear();
  const month = String(
    (utc ? datetime.getUTCMonth() : datetime.getMonth()) + 1
  ).padStart(2, "0"); // Months are 0-indexed
  const day = String(utc ? datetime.getUTCDate() : datetime.getDate()).padStart(
    2,
    "0"
  );
  const hours = String(
    utc ? datetime.getUTCHours() : datetime.getHours()
  ).padStart(2, "0");
  const minutes = String(
    utc ? datetime.getUTCMinutes() : datetime.getMinutes()
  ).padStart(2, "0");
  const seconds = String(
    utc ? datetime.getUTCSeconds() : datetime.getSeconds()
  ).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function convertUtcToLocalDatetime(utcDateTime) {
  // Ai help
  // Create a Date object from the UTC datetime string.
  // Appending 'Z' tells JavaScript that the string is in UTC.
  const utcDate = new Date(utcDateTime + "Z");

  return convertToMySQLDatetime(utcDate, false);
}

export function convertLocalToUtcDatetime(localDatetime) {
  return convertToMySQLDatetime(localDatetime);
}

export function toBoolean(val) {
  if (typeof val === "boolean") return val;
  if (val == 1 || val.toLowerCase() === "true") return true;
  if (val == 0 || val.toLowerCase() === "false") return false;

  return false;
}

// Serial number format depends on the manufacturers so for this function implements basic checks
export function isValidSerialNum(serialNum, minLength = 5) {
  // AI help
  if (typeof serialNum !== "string" || serialNum.trim() === "") return false;

  if (serialNum.length < minLength) return false;

  const isSerialFormat = /^[a-zA-Z0-9_-]+$/.test(serialNum);
  if (!isSerialFormat) return false;

  return true;
}

// Basic IMEI check only contains numbers and has a length not smaller than 15
export function isValidIMEI(imei) {
  if (typeof imei !== "string") return false;

  const cleanedIMEI = imei.replace(/[^0-9]/g, ""); // Remove non-numeric characters

  if (cleanedIMEI.length < 15 || !/^\d+$/.test(cleanedIMEI)) return false;

  return true;
}

export function isInterpretableNull(val) {
  if (val === null) return true;

  return val.toLowerCase() === "null";
}

function encodeDecodeData(data, action = "encode") {
  // AI gen
  try {
    if (action === "encode") {
      const jsonString = JSON.stringify(data);

      // Encode to UTF-8 and then map each character to its charCodeAt value
      const utf8Bytes = new TextEncoder().encode(jsonString);
      let binaryString = "";

      utf8Bytes.forEach((byte) => {
        binaryString += String.fromCharCode(byte);
      });

      return btoa(binaryString);
    } else if (action === "decode") {
      const binaryString = atob(data);
      const byteArray = new Uint8Array(binaryString.length);

      for (let i = 0; i < binaryString.length; i++) {
        byteArray[i] = binaryString.charCodeAt(i);
      }

      // Decode the UTF-8 byte array back to a string
      return JSON.parse(new TextDecoder().decode(byteArray));
    } else {
      console.error("Invalid action. Use 'encode' or 'decode'.");
      return null;
    }
  } catch (error) {
    console.error("Error during data processing:", error);
    return null;
  }
}

export function saveToStorage(key, val, ttl = TTL) {
  // time to live 1 hour as a default
  const now = new Date();
  const valEncoded = encodeDecodeData(val);

  localStorage.setItem(
    key,
    JSON.stringify({ val: valEncoded, expiry: now.getTime() + ttl })
  );
}

export function getFromStorage(key) {
  const valStr = localStorage.getItem(key);

  if (!valStr) return null;

  const { val, expiry } = JSON.parse(valStr);
  const now = new Date();

  if (now.getTime() > expiry) {
    localStorage.removeItem(key);
    return null;
  }

  return encodeDecodeData(val, "decode");
}

export function removeStorage(key) {
  localStorage.removeItem(key);
}

export function centsToDollars(cents) {
  if (cents === null || cents === undefined) return null;

  if (typeof cents !== "number") {
    console.error("Invalid input: cents should be a number");
    return null;
  }

  return (cents / 100).toFixed(2);
}

export function bytesToMB(bytes) {
  if (bytes === null || bytes === undefined) return null;

  if (typeof bytes !== "number") {
    console.error("Invalid input: bytes should be a number");
    return null;
  }

  return (bytes / (1024 * 1024)).toFixed(2);
}

export function mgToGrams(mg) {
  if (mg === null || mg === undefined) return null;

  if (typeof mg !== "number") {
    console.error("Invalid input: mg should be a number");
    return null;
  }

  return (mg / 1000).toFixed(2);
}
