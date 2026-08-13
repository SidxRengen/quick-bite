const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8008/api";
export const RESTAURANT_TOKEN_KEY = "quickbite_restaurant_token";

async function request(path, options = {}) {
  const { authToken, ...fetchOptions } = options;
  const token =
    authToken === undefined
      ? localStorage.getItem("quickbite_token")
      : authToken;
  const response = await fetch(`${API_URL}${path}`, {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...fetchOptions.headers,
    },
  });

  if (response.status === 204) return null;
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(body.message || "Request failed");
    error.details = body.details;
    throw error;
  }

  return body;
}

export const api = {
  menu: () => request("/menu"),
  adminMenu: () =>
    request("/menu/admin", {
      authToken: localStorage.getItem(RESTAURANT_TOKEN_KEY),
    }),
  createMenuItem: (body) =>
    request("/menu", {
      method: "POST",
      body: JSON.stringify(body),
      authToken: localStorage.getItem(RESTAURANT_TOKEN_KEY),
    }),
  updateMenuItem: (id, body) =>
    request(`/menu/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
      authToken: localStorage.getItem(RESTAURANT_TOKEN_KEY),
    }),
  deleteMenuItem: (id) =>
    request(`/menu/${id}`, {
      method: "DELETE",
      authToken: localStorage.getItem(RESTAURANT_TOKEN_KEY),
    }),
  order: (id) => request(`/orders/${id}`),
  orders: () => request("/orders"),
  createOrder: (body) =>
    request("/orders", { method: "POST", body: JSON.stringify(body) }),
  register: (body) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  me: () => request("/auth/me"),
  restaurantLogin: (accessKey) =>
    request("/restaurant/login", {
      method: "POST",
      body: JSON.stringify({ accessKey }),
      authToken: null,
    }),
  restaurantOrders: () =>
    request("/restaurant/orders", {
      authToken: localStorage.getItem(RESTAURANT_TOKEN_KEY),
    }),
  updateRestaurantOrderStatus: (id, status) =>
    request(`/restaurant/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
      authToken: localStorage.getItem(RESTAURANT_TOKEN_KEY),
    }),
};
