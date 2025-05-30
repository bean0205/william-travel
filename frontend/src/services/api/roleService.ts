// Role service for API communication
import apiClient from './apiClient';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';
import { Permission } from './permissionService';

export interface Role {
  id: number;
  name: string;
  description: string;
  is_default: boolean;
  permissions: Permission[];
  created_at: string;
  updated_at: string;
}

export interface RoleCreatePayload {
  name: string;
  description: string;
  is_default: boolean;
  permission_ids: number[];
}

export interface RoleUpdatePayload {
  name?: string;
  description?: string;
  is_default?: boolean;
  permission_ids?: number[];
}

// Get all roles
export const getRoles = async (skip = 0, limit = 100): Promise<Role[]> => {
  const response = await apiClient.get(API_ENDPOINTS.roles.list, {
    params: { skip, limit },
  });
  return response.data;
};

// Get role by ID
export const getRoleById = async (roleId: number): Promise<Role> => {
  const response = await apiClient.get(API_ENDPOINTS.roles.detail(roleId));
  return response.data;
};

// Create a new role
export const createRole = async (payload: RoleCreatePayload): Promise<Role> => {
  const response = await apiClient.post(API_ENDPOINTS.roles.list, payload);
  return response.data;
};

// Update a role
export const updateRole = async (roleId: number, payload: RoleUpdatePayload): Promise<Role> => {
  const response = await apiClient.put(API_ENDPOINTS.roles.detail(roleId), payload);
  return response.data;
};

// Delete a role
export const deleteRole = async (roleId: number): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.roles.detail(roleId));
};
