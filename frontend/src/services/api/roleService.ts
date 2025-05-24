import apiClient from './apiClient';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

export interface Permission {
  id: string;
  name: string;
  code: string;
  description?: string;
  category?: string;
  isSystem?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  isSystem?: boolean;
  permissionIds?: string[];
  permissions?: Permission[];
  userCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Role API endpoints
export const getRoles = async (params?: { skip?: number; limit?: number }) => {
  const response = await apiClient.get(API_ENDPOINTS.ROLES.BASE, { params });
  return response.data;
};

export const getRoleById = async (id: string) => {
  const response = await apiClient.get(`${API_ENDPOINTS.ROLES.BASE}/${id}`);
  return response.data;
};

export const createRole = async (roleData: Partial<Role>) => {
  const response = await apiClient.post(API_ENDPOINTS.ROLES.BASE, roleData);
  return response.data;
};

export const updateRole = async (id: string, roleData: Partial<Role>) => {
  const response = await apiClient.put(`${API_ENDPOINTS.ROLES.BASE}/${id}`, roleData);
  return response.data;
};

export const deleteRole = async (id: string) => {
  const response = await apiClient.delete(`${API_ENDPOINTS.ROLES.BASE}/${id}`);
  return response.data;
};

// Permission API endpoints
export const getPermissions = async (params?: { skip?: number; limit?: number }) => {
  const response = await apiClient.get(API_ENDPOINTS.PERMISSIONS.BASE, { params });
  return response.data;
};

export const getPermissionById = async (id: string) => {
  const response = await apiClient.get(`${API_ENDPOINTS.PERMISSIONS.BASE}/${id}`);
  return response.data;
};

export const createPermission = async (permissionData: Partial<Permission>) => {
  const response = await apiClient.post(API_ENDPOINTS.PERMISSIONS.BASE, permissionData);
  return response.data;
};

export const updatePermission = async (id: string, permissionData: Partial<Permission>) => {
  const response = await apiClient.put(`${API_ENDPOINTS.PERMISSIONS.BASE}/${id}`, permissionData);
  return response.data;
};

export const deletePermission = async (id: string) => {
  const response = await apiClient.delete(`${API_ENDPOINTS.PERMISSIONS.BASE}/${id}`);
  return response.data;
};
