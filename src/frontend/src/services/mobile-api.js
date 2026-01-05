import axios from 'axios';

// API simplifiée pour mobile avec IP directe
const MOBILE_API_URL = 'http://10.4.2.127:5000/api';

const mobileApi = axios.create({
  baseURL: MOBILE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000, // 8 secondes timeout
});

// Ajouter le token automatiquement
mobileApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Mobile API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

// Gérer les réponses
mobileApi.interceptors.response.use(
  (response) => {
    console.log('Mobile API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('Mobile API Error:', error.message);
    return Promise.reject(error);
  }
);

export const mobileAuthAPI = {
  register: (userData) => mobileApi.post('/auth/register', userData),
  login: (credentials) => mobileApi.post('/auth/login', credentials),
  getProfile: () => mobileApi.get('/auth/profile'),
};
