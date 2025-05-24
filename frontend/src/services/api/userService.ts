import apiClient from './apiClient';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';
import { ApiResponse } from '@/types/api';

export interface User {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
  role_id?: number; // Added role_id as the API returns role_id, not role
  role?: string;    // Keep role for backward compatibility
  is_superuser: boolean;
  created_at: string;
  updated_at: string | null; // Updated to match API response that can be null
}

export interface UpdateUserRequest {
  email?: string;
  full_name?: string;
  is_active?: boolean;
}

export interface UpdatePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  full_name: string;
  role: string;
  is_superuser: boolean;
  is_active: boolean;
}

// User API endpoints based on documentation
const getCurrentUser = async (): Promise<ApiResponse<User>> => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.USERS.ME);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch user profile',
    };
  }
};

const updateCurrentUser = async (userData: UpdateUserRequest): Promise<User> => {
  const response = await apiClient.put(API_ENDPOINTS.USERS.ME, userData);
  return response.data;
};

const updatePassword = async (passwordData: UpdatePasswordRequest): Promise<User> => {
  const response = await apiClient.put(API_ENDPOINTS.USERS.PASSWORD, passwordData);
  return response.data;
};

const getUserById = async (id: number): Promise<User> => {
  const response = await apiClient.get(`${API_ENDPOINTS.USERS.BASE}/${id}`);
  return response.data;
};

const getUsers = async (params?: { skip?: number; limit?: number }): Promise<User[]> => {
  const response = await apiClient.get(API_ENDPOINTS.USERS.BASE, { params });
  return response.data;
};

const createUser = async (userData: CreateUserRequest): Promise<User> => {
  const response = await apiClient.post(API_ENDPOINTS.USERS.BASE, userData);
  return response.data;
};

const updateUser = async (id: number, userData: Partial<CreateUserRequest>): Promise<User> => {
  const response = await apiClient.put(`${API_ENDPOINTS.USERS.BASE}/${id}`, userData);
  return response.data;
};

const deleteUser = async (id: number): Promise<void> => {
  await apiClient.delete(`${API_ENDPOINTS.USERS.BASE}/${id}`);
};

// Export all functions as a service object
export const userService = {
  getCurrentUser,
  updateCurrentUser,
  updatePassword,
  getUserById,
  getUsers,
  createUser,
  updateUser,
  deleteUser
};

// Export individual functions as well for direct import
export {
  getCurrentUser,
  updateCurrentUser,
  updatePassword,
  getUserById,
  getUsers,
  createUser,
  updateUser,
  deleteUser
};
