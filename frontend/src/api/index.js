import axios from 'axios';

// Configuración para tu API propia
export const apiEmpanadas = axios.create({
  baseURL: import.meta.env.VITE_API_EMPANADAS_URL || 'http://192.168.1.107:3000/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Configuración para API del dólar (sin autenticación)
export const dolarApi = axios.create({
  baseURL: 'https://api.dolarvzla.com/public',
  timeout: 5000
});