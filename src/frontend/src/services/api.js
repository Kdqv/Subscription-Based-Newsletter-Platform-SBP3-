import axios from 'axios';

// Détecter automatiquement l'hôte pour mobile
const getApiUrl = () => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // En production, utiliser le backend Render
  if (process.env.NODE_ENV === 'production') {
    return 'https://votre-backend.onrender.com/api';
  }
  
  // Détecter si on est sur mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
  
  if (isMobile) {
    // Mobile : utiliser l'IP locale
    return 'http://10.4.2.127:5000/api';
  } else {
    // PC : utiliser localhost
    return 'http://localhost:5000/api';
  }
};

const API_BASE_URL = getApiUrl();
console.log('Final API URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000, // 8 secondes timeout
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  async (error) => {
    console.error('API Error:', error);
    console.error('Error details:', error.response?.data);
    console.error('Error status:', error.response?.status);
    
    const originalRequest = error.config;
    
    // Si erreur 401, essayer de rafraîchir le token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await authAPI.refreshToken(refreshToken);
          const newToken = response.data.accessToken;
          localStorage.setItem('token', newToken);
          
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api.request(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }
    
    // Si erreur de réseau ou CORS, essayer un fallback
    if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
      console.log('Network error detected, trying fallback...');
      
      const fallbackUrl = 'http://10.4.2.127:5000/api';
      console.log('Trying fallback URL:', fallbackUrl);
      
      if (originalRequest) {
        const fallbackConfig = { ...originalRequest };
        fallbackConfig.baseURL = fallbackUrl;
        return api.request(fallbackConfig);
      }
    }
    
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  refreshToken: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
};

export const postsAPI = {
  getAllPosts: () => api.get('/posts'),
  getPostById: (id) => api.get(`/posts/${id}`),
  createPost: (postData) => api.post('/posts', postData),
  updatePost: (id, postData) => api.put(`/posts/${id}`, postData),
  deletePost: (id) => api.delete(`/posts/${id}`),
  getCreatorPosts: () => api.get('/posts/creator/my-posts'),
};

export const subscriptionsAPI = {
  subscribe: () => api.post('/subscriptions/subscribe'),
  getSubscriptionStatus: () => api.get('/subscriptions/status'),
  mockPayment: () => api.post('/subscriptions/mock-payment'),
  getSubscribers: () => api.get('/subscriptions/subscribers'),
  getCreatorSubscribers: () => api.get('/subscriptions/creator/subscribers'),
  getCreatorStats: () => api.get('/subscriptions/creator/stats'),
};

export const paymentsAPI = {
  createCheckoutSession: () => api.post('/payments/create-checkout-session'),
  confirmPayment: (sessionId) => api.get(`/payments/confirm?session_id=${sessionId}`),
  mockPayment: () => api.post('/payments/mock'),
};

export default api;