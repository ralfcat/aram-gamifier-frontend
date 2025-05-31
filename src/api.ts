// --- file: frontend/src/api.ts ---
import axios from 'axios';

// In production, use the same origin for API calls
const base = import.meta.env.PROD
  ? window.location.origin
  : (import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:4000');

const api = axios.create({
  baseURL: `${base}/api`,
});

export default api;
