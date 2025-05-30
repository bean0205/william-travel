import axios from 'axios';
import { API_BASE_URL } from '@/config/appConfig';

// Types
export interface User {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
  role: string;
  is_superuser: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  full_name: string;
  role: string;
  is_superuser: boolean;
  is_active: boolean;
}

const API_URL = `${API_BASE_URL}/api/v1/users`;

// Get auth token from local storage
const getAuthToken = () => localStorage.getItem('authToken');

// Headers configuration with auth token
const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getAuthToken()}`,
  },
});

export const usersApi = {
  // Get current user profile
  getCurrentUser: async (): Promise<User> => {
    const response = await axios.get(`${API_URL}/me`, getAuthHeaders());
    return response.data;
  },

  // Get all users (superuser only)
  getAllUsers: async (skip = 0, limit = 100): Promise<User[]> => {
    const response = await axios.get(
      `${API_URL}/?skip=${skip}&limit=${limit}`,
      getAuthHeaders()
    );
    return response.data;
  },

  // Get user by ID
  getUserById: async (id: number): Promise<User> => {
    const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
    return response.data;
  },

  // Create new user (superuser only)
  createUser: async (userData: CreateUserRequest): Promise<User> => {
    const response = await axios.post(API_URL, userData, getAuthHeaders());
    return response.data;
  },

  // Update user
  updateUser: async (id: number, userData: Partial<CreateUserRequest>): Promise<User> => {
    const response = await axios.put(`${API_URL}/${id}`, userData, getAuthHeaders());
    return response.data;
  },

  // Delete user (not explicitly mentioned in the API docs, but common pattern)
  deleteUser: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  },

  // Update current user's profile
  updateCurrentUser: async (userData: {
    email?: string;
    full_name?: string;
    is_active?: boolean;
  }): Promise<User> => {
    const response = await axios.put(`${API_URL}/me`, userData, getAuthHeaders());
    return response.data;
  },

  // Update current user's password
  updatePassword: async (passwordData: {
    current_password: string;
    new_password: string;
  }): Promise<User> => {
    const response = await axios.put(`${API_URL}/me/password`, passwordData, getAuthHeaders());
    return response.data;
  },
};

export default usersApi;
