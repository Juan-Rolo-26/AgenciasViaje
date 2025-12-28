const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function normalizeBody(options) {
  if (!options.body || typeof options.body === "string") {
    return options;
  }

  return {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    },
    body: JSON.stringify(options.body)
  };
}

export async function apiRequest(path, options = {}) {
  const config = normalizeBody(options);
  const response = await fetch(`${API_BASE_URL}${path}`, config);

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Error en la solicitud");
  }

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}
