export const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

if (!import.meta.env.VITE_API_URL) {
  console.warn("VITE_API_URL is undefined. Using default fallback: http://localhost:5000");
}
