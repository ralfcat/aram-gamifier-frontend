import axios from 'axios';

const api = axios.create({
  baseURL: 'https://aram-gamifier-production.up.railway.app',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
