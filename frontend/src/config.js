export const API = import.meta.env.VITE_API_URL;

if (!API) {
  console.warn("VITE_API_URL is undefined. Backend requests may fail.");
}
