import axios from 'axios';

let rawBase = (import.meta.env.VITE_API_URL || '/api').trim().replace(/\/+$/, '');
if (rawBase.startsWith('http') && !rawBase.endsWith('/api')) {
  rawBase = `${rawBase}/api`;
}

const api = axios.create({
  baseURL: rawBase,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
