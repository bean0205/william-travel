import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { useAuthStore } from '@/store/authStore';

// Types for API responses and requests
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

// Request timeout in milliseconds
const REQUEST_TIMEOUT = 30000;

// Create a custom Axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from Zustand store
    const state = useAuthStore.getState();
    const token = state.token;

    // Add authorization header if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add language header from localStorage if available
    const lang = localStorage.getItem('william-travel-language') || 'vi';
    config.headers['Accept-Language'] = lang;

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // You can transform the response data here if needed
    return response;
  },
  (error: AxiosError) => {
    // Handle specific error cases
    const { response } = error;

    if (!response) {
      // Network errors or timeout
      console.error('Network Error:', error.message);
      return Promise.reject({
        status: 0,
        message: 'Network error. Please check your internet connection.'
      });
    }

    // Handle unauthorized errors (401)
    if (response.status === 401) {
      const state = useAuthStore.getState();
      // Clear authentication in store
      state.logout();
      // You could also redirect to login page here
    }

    // Handle forbidden errors (403)
    if (response.status === 403) {
      console.error('Forbidden access:', error);
      // Handle forbidden error, maybe redirect to unauthorized page
    }

    // Handle server errors (500)
    if (response.status >= 500) {
      console.error('Server Error:', error);
      // Handle server error, maybe show a generic error message
    }

    // Return a standardized error object
    return Promise.reject({
      status: response.status,
      message: response.data?.message || 'Something went wrong',
      errors: response.data?.errors || {}
    });
  }
);

// HTTP client service with typed methods
class HttpClient {
  // GET method
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await axiosInstance.get<T>(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // POST method
  async post<T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await axiosInstance.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // PUT method
  async put<T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await axiosInstance.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // PATCH method
  async patch<T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await axiosInstance.patch<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // DELETE method
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await axiosInstance.delete<T>(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Upload files method
  async uploadFile<T = any>(url: string, file: File, fieldName: string = 'file', additionalData?: Record<string, any>, config?: AxiosRequestConfig): Promise<T> {
    const formData = new FormData();
    formData.append(fieldName, file);

    // Add any additional data
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    const uploadConfig: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...config,
    };

    try {
      const response = await axiosInstance.post<T>(url, formData, uploadConfig);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Method to download files
  async downloadFile(url: string, filename?: string, config?: AxiosRequestConfig): Promise<Blob> {
    const downloadConfig: AxiosRequestConfig = {
      responseType: 'blob',
      ...config,
    };

    try {
      const response = await axiosInstance.get(url, downloadConfig);

      // Create a download link and click it to start the download
      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename || this.getFilenameFromUrl(url);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return blob;
    } catch (error) {
      throw error;
    }
  }

  // Helper to extract filename from URL
  private getFilenameFromUrl(url: string): string {
    const urlParts = url.split('/');
    return urlParts[urlParts.length - 1] || 'downloaded_file';
  }

  // Method to cancel requests (using AbortController)
  getCancelToken() {
    return axios.CancelToken.source();
  }
}

export const httpClient = new HttpClient();
export default httpClient;
