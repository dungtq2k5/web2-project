export async function fetchData(url, limit=null, offset=null) {
  try {
    const res = await fetch(url + `?limit=${limit}&offset=${offset}`, {
      method: "GET"
    });
    if(!res.ok) throw new Error(`Response status: ${res.status}`);

    const data = await res.json();
    return data;

  } catch(error) {
    console.error("Fetch error: " + error);
    throw error;
  }
}

export async function sendData(url, data, auth) {
  try {
    const credentials = btoa(`${auth.email}:${auth.password}`); //Encode credentials
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
      },
      body: JSON.stringify(data),
    });

    return await res.json();

  } catch(error) {
    console.error("Fetch error: " + error);
    throw error;
  }
}

export async function deleteData(url, id, auth) {
  try {
    const credentials = btoa(`${auth.email}:${auth.password}`); //Encode credentials
    const res = await fetch(`${url}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    });

    return await res.json();

  } catch(error) {
    console.error("Fetch error: " + error);
    throw error;
  }
}

export async function updateData(url, id, data, auth) {
  try {
    const credentials = btoa(`${auth.email}:${auth.password}`); //Encode credentials
    const res = await fetch(`${url}/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Basic ${credentials}`,
      },
      body: JSON.stringify(data),
    });

    return await res.json();

  } catch(error) {
    console.error("Fetch error: " + error);
    throw error;
  }
}

export function disableBgScroll() {
  $("body").css("overflow", "hidden");
}

export function enableBgScroll() {
  $("body").css("overflow", "");
}

export function isValidVNPhoneNumber(phoneNumber) { //AI gen
  // 1. Remove all non-numeric characters (except the leading '+')
  phoneNumber = phoneNumber.replace(/[^0-9+]/g, '');

  // 2. Check for the leading '+' (for international numbers)
  const isInternational = phoneNumber.startsWith('+');

  let pattern = isInternational
    ? /^\+84\d{9}$/ // International format
    : /^0\d{9}$/; // Domestic format

  // 3. Perform the regex match
  return pattern.test(phoneNumber);
}

export function removeOddSpace(str) { //AI help
  return str.replace(/\s+/g, " ").trim();
}

export function isValidEmail(email) { //AI gen
  if (typeof email !== 'string') return false; // Handle non-string input

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPassword(password, minLength=8) {
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
    is_default
  } = address;

  let addressString = name;
  if(apartment_number) addressString += `, Apartment ${apartment_number}`;
  addressString += `, ${street}`;
  if(ward) addressString += `, ${ward}`;
  if(district) addressString += `, ${district}`;
  if(city_province) addressString += `, ${city_province}`;
  if(is_default) addressString += ` (default)`;

  return addressString;
}