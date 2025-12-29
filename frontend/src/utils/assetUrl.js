import { API_BASE_URL } from "../api/api.js";

const baseUrl =
  API_BASE_URL && API_BASE_URL.endsWith("/")
    ? API_BASE_URL.slice(0, -1)
    : API_BASE_URL || "";

export function resolveAssetUrl(path) {
  if (!path) {
    return path;
  }

  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("data:") ||
    path.startsWith("blob:")
  ) {
    return path;
  }

  if (path.startsWith("/")) {
    return `${baseUrl}${path}`;
  }

  return path;
}
