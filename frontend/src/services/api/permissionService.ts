// Permission service for API communication
import apiClient from './apiClient';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

export interface Permission {
  id: number;
  name: string;
  code: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface PermissionCreatePayload {
  name: string;
  code: string;
  description: string;
}

export interface PermissionUpdatePayload {
  name?: string;
  code?: string;
  description?: string;
}

// Get all permissions
export const getPermissions = async (skip = 0, limit = 100): Promise<Permission[]> => {
  const response = await apiClient.get(API_ENDPOINTS.permissions.list, {
    params: { skip, limit },
  });
  return response.data;
};

// Get permission by ID
export const getPermissionById = async (permissionId: number): Promise<Permission> => {
  const response = await apiClient.get(API_ENDPOINTS.permissions.detail(permissionId));
  return response.data;
};

// Create a new permission
export const createPermission = async (payload: PermissionCreatePayload): Promise<Permission> => {
  const response = await apiClient.post(API_ENDPOINTS.permissions.list, payload);
  return response.data;
};

// Update a permission
export const updatePermission = async (permissionId: number, payload: PermissionUpdatePayload): Promise<Permission> => {
  const response = await apiClient.put(API_ENDPOINTS.permissions.detail(permissionId), payload);
  return response.data;
};

// Delete a permission
export const deletePermission = async (permissionId: number): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.permissions.detail(permissionId));
};
