// User service for API communication
import axios from 'axios';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

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

export interface UserCreatePayload {
  email: string;
  password: string;
  full_name: string;
  role: string;
  is_superuser: boolean;
  is_active: boolean;
}

export interface UserUpdatePayload {
  email?: string;
  full_name?: string;
  is_active?: boolean;
  role?: string;
  is_superuser?: boolean;
}

export interface PasswordUpdatePayload {
  current_password: string;
  new_password: string;
}

// Get current user profile
export const getCurrentUser = async (): Promise<User> => {
  const response = await axios.get(API_ENDPOINTS.users.me);
  return response.data;
};

// Get all users
export const getUsers = async (skip = 0, limit = 100): Promise<User[]> => {
  const response = await axios.get(API_ENDPOINTS.users.list, {
    params: { skip, limit },
  });
  return response.data;
};

// Get user by ID
export const getUserById = async (userId: number): Promise<User> => {
  const response = await axios.get(API_ENDPOINTS.users.detail(userId));
  return response.data;
};

// Create a new user
export const createUser = async (payload: UserCreatePayload): Promise<User> => {
  const response = await axios.post(API_ENDPOINTS.users.list, payload);
  return response.data;
};

// Update a user
export const updateUser = async (userId: number, payload: UserUpdatePayload): Promise<User> => {
  const response = await axios.put(API_ENDPOINTS.users.detail(userId), payload);
  return response.data;
};

// Update current user
export const updateCurrentUser = async (payload: UserUpdatePayload): Promise<User> => {
  const response = await axios.put(API_ENDPOINTS.users.me, payload);
  return response.data;
};

// Update current user's password
export const updateCurrentUserPassword = async (payload: PasswordUpdatePayload): Promise<User> => {
  const response = await axios.put(API_ENDPOINTS.users.password, payload);
  return response.data;
};

// Delete a user
export const deleteUser = async (userId: number): Promise<void> => {
  await axios.delete(API_ENDPOINTS.users.detail(userId));
};
