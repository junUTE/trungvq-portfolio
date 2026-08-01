const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "");
const AUTH_STORAGE_KEY = "portfolio_admin_token";

let authToken = "";

if (typeof window !== "undefined") {
  authToken = window.localStorage.getItem(AUTH_STORAGE_KEY) || "";
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...(options.headers || {})
    },
    ...options
  });

  let payload = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const error = new Error(payload?.message || "Request failed.");
    error.details = payload?.errors || [];
    throw error;
  }

  return payload;
}

export function getProjects() {
  return request("/projects");
}

export function getProjectBySlug(slug) {
  return request(`/projects/${slug}`);
}

export function createContact(payload) {
  return request("/contacts", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function loginAdmin(payload) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function getCurrentAdmin() {
  return request("/auth/me");
}

export function logoutAdmin() {
  return request("/auth/logout", {
    method: "POST"
  });
}

export function setAuthToken(token) {
  authToken = token || "";

  if (typeof window !== "undefined") {
    if (authToken) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, authToken);
    } else {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }
}

export function getStoredAuthToken() {
  return authToken;
}

export function extractErrorMessage(error) {
  if (error?.details?.length) {
    return error.details.join(" ");
  }

  return error?.message || "Something went wrong. Please try again.";
}
