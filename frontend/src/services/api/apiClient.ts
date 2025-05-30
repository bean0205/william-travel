import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Get token from Zustand store
    const state = useAuthStore.getState();
    const token = state.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add cache-busting headers to prevent 304 responses
    config.headers['Cache-Control'] = 'no-cache';
    config.headers['Pragma'] = 'no-cache';
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    // Handle unauthorized errors (401)
    if (response && response.status === 401) {
      const state = useAuthStore.getState();
      // Clear authentication in store
      state.logout();
    }

    return Promise.reject(error);
  }
);

export default apiClient;

