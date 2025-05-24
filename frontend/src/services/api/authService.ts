import { ApiResponse } from '@/types/api';
import apiClient from './apiClient';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

export interface LoginRequest {
  username: string; // Email is used as username
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetResponse {
  message: string;
}

export interface PasswordResetConfirmRequest {
  token: string;
  password: string;
}

interface AuthService {
  login: (data: LoginRequest) => Promise<ApiResponse<LoginResponse>>;
  logout: () => Promise<ApiResponse<{ message: string }>>;
  requestPasswordReset: (data: PasswordResetRequest) => Promise<ApiResponse<PasswordResetResponse>>;
  resetPassword: (data: PasswordResetConfirmRequest) => Promise<ApiResponse<LoginResponse>>;
}

export const authService: AuthService = {
  login: async (data) => {
    try {
      // Create form data
      const formData = new URLSearchParams();
      formData.append('username', data.username);
      formData.append('password', data.password);
      
      console.log('Login request data:', { username: data.username, password: '***' });
      console.log('FormData:', formData.toString());

      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, formData.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      console.log('Login success response:', response);
      return {
        success: true,
        data: response.data,
        error: null,
        status: response.status,
      };
    } catch (error: unknown) {
      console.error('Login error:', error);
      const axiosError = error as any;
      console.error('Error response:', axiosError.response);
      console.error('Error response data:', axiosError.response?.data);
      console.error('Error detail:', axiosError.response?.data?.detail);
      console.error('Error status:', axiosError.response?.status);
      
      const errorMessage = axiosError.response?.data?.detail || 'An unexpected error occurred during login';
      console.error('Final error message:', errorMessage);
      
      return {
        success: false,
        data: null,
        error: errorMessage,
        status: axiosError.response?.status || 500,
      };
    }
  },

  requestPasswordReset: async (data) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);

      return {
        success: true,
        data: response.data,
        error: null,
        status: response.status,
      };
    } catch (error: unknown) {
      console.error('Password reset request error:', error);
      const axiosError = error as any;
      return {
        success: false,
        data: null,
        error: axiosError.response?.data?.detail || 'An unexpected error occurred during password reset request',
        status: axiosError.response?.status || 500,
      };
    }
  },

  resetPassword: async (data) => {
    try {
      const response = await apiClient.post(`${API_ENDPOINTS.AUTH.RESET_PASSWORD}/confirm`, data);

      return {
        success: true,
        data: response.data,
        error: null,
        status: response.status,
      };
    } catch (error: unknown) {
      console.error('Password reset error:', error);
      const axiosError = error as any;
      return {
        success: false,
        data: null,
        error: axiosError.response?.data?.detail || 'An unexpected error occurred during password reset',
        status: axiosError.response?.status || 500,
      };
    }
  },
  
  logout: async () => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
      
      return {
        success: true,
        data: response.data,
        error: null,
        status: response.status,
      };
    } catch (error: unknown) {
      console.error('Logout error:', error);
      const axiosError = error as any;
      return {
        success: false,
        data: null,
        error: axiosError.response?.data?.detail || 'An unexpected error occurred during logout',
        status: axiosError.response?.status || 500,
      };
    }
  },
};
