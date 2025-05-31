import axios from 'axios';

const api = axios.create({
  baseURL: (import.meta.env.VITE_BACKEND_URL || 'https://aram-gamifier-production.up.railway.app') + '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
