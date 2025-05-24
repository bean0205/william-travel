import { ApiResponse } from '@/types/api';
import apiClient from './apiClient';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';
import { AxiosError } from 'axios';

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

      const response = await apiClient.post(API_ENDPOINTS.auth.login, formData.toString(), {
      
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      return {
        success: true,
        data: response.data,
        error: null,
        status: response.status,
      };
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ detail?: string }>;
      
      const errorMessage = axiosError.response?.data?.detail || 'An unexpected error occurred during login';
      
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
      const response = await apiClient.post(API_ENDPOINTS.auth.passwordReset, data);

      return {
        success: true,
        data: response.data,
        error: null,
        status: response.status,
      };
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ detail?: string }>;
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
      const response = await apiClient.post(API_ENDPOINTS.auth.passwordResetConfirm, data);

      return {
        success: true,
        data: response.data,
        error: null,
        status: response.status,
      };
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ detail?: string }>;
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
      const response = await apiClient.post(API_ENDPOINTS.auth.logout);
      
      return {
        success: true,
        data: response.data,
        error: null,
        status: response.status,
      };
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ detail?: string }>;
      return {
        success: false,
        data: null,
        error: axiosError.response?.data?.detail || 'An unexpected error occurred during logout',
        status: axiosError.response?.status || 500,
      };
    }
  },
};
