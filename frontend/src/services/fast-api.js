import axios from 'axios';

// API ultra-simplifiée pour mobile avec timeout très court
const FAST_API_URL = 'http://10.4.2.127:5000/api';

// Alert pour vérifier l'URL
alert('API URL: ' + FAST_API_URL);

const fastApi = axios.create({
  baseURL: FAST_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, // 5 secondes timeout ultra-court
});

// Intercepteur minimal
fastApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);

export const fastAuthAPI = {
  register: (userData) => fastApi.post('/auth/register', userData),
  login: (credentials) => fastApi.post('/auth/login', credentials),
};
