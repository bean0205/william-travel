// User service for API communication
import apiClient from './apiClient';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';
import { ApiResponse } from '@/types/api';
import { AxiosError } from 'axios';

export interface User {
  id: number;
  email: string;
  full_name: string;
  avatar?: string;
  profile_picture?: string;
  is_active: boolean;
  role?: string;
  role_id?: number;
  is_superuser: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserCreatePayload {
  email: string;
  password: string;
  full_name: string;
  role?: string;
  role_id?: number;
  is_superuser: boolean;
  is_active: boolean;
}

export interface UserUpdatePayload {
  email?: string;
  full_name?: string;
  is_active?: boolean;
  role?: string;
  role_id?: number;
  is_superuser?: boolean;
}

export interface PasswordUpdatePayload {
  current_password: string;
  new_password: string;
}

// Get current user profile
const getCurrentUser = async (): Promise<ApiResponse<User>> => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.users.me);
    return {
      success: true,
      data: response.data,
      error: null,
      status: response.status,
    };
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string }>;
    return {
      success: false,
      data: null,
      error: axiosError.response?.data?.detail || axiosError.message || 'Failed to fetch user profile',
      status: axiosError.response?.status || 500,
    };
  }
};

// Get all users
const getUsers = async (skip = 0, limit = 100): Promise<User[]> => {
  const response = await apiClient.get(API_ENDPOINTS.users.list, {
    params: { skip, limit },
  });
  return response.data;
};

// Get user by ID
const getUserById = async (userId: number): Promise<User> => {
  const response = await apiClient.get(API_ENDPOINTS.users.detail(userId));
  return response.data;
};

// Create a new user
const createUser = async (payload: UserCreatePayload): Promise<User> => {
  const response = await apiClient.post(API_ENDPOINTS.users.list, payload);
  return response.data;
};

// Update a user
const updateUser = async (userId: number, payload: UserUpdatePayload): Promise<User> => {
  const response = await apiClient.put(API_ENDPOINTS.users.detail(userId), payload);
  return response.data;
};

// Update current user
const updateCurrentUser = async (payload: UserUpdatePayload): Promise<ApiResponse<User>> => {
  try {
    const response = await apiClient.put(API_ENDPOINTS.users.me, payload);
    return {
      success: true,
      data: response.data,
      error: null,
      status: response.status,
    };
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string }>;
    return {
      success: false,
      data: null,
      error: axiosError.response?.data?.detail || axiosError.message || 'Failed to update user profile',
      status: axiosError.response?.status || 500,
    };
  }
};

// Update current user's password
const updateCurrentUserPassword = async (payload: PasswordUpdatePayload): Promise<ApiResponse<User>> => {
  try {
    const response = await apiClient.put(API_ENDPOINTS.users.password, payload);
    return {
      success: true,
      data: response.data,
      error: null,
      status: response.status,
    };
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string }>;
    return {
      success: false,
      data: null,
      error: axiosError.response?.data?.detail || axiosError.message || 'Failed to update password',
      status: axiosError.response?.status || 500,
    };
  }
};

// Delete a user
const deleteUser = async (userId: number): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.users.detail(userId));
};

// Alias for auth store compatibility
const updatePassword = updateCurrentUserPassword;

// Named exports for backward compatibility
export { getCurrentUser, getUsers, getUserById, createUser, updateUser, updateCurrentUser, updateCurrentUserPassword, deleteUser };

export const userService = {
  getCurrentUser,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateCurrentUser,
  updateCurrentUserPassword,
  updatePassword, // Alias for auth store
  deleteUser,
};
