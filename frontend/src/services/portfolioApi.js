const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
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

export function extractErrorMessage(error) {
  if (error?.details?.length) {
    return error.details.join(" ");
  }

  return error?.message || "Something went wrong. Please try again.";
}
