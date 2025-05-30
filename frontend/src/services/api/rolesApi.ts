import axios from 'axios';
import { API_BASE_URL } from '@/config/appConfig';

// Types based on your API documentation
export interface Permission {
  id: number;
  name: string;
  code: string;
  description: string;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  is_default: boolean;
  permissions: Permission[];
  created_at: string;
  updated_at: string;
}

export interface CreateRoleRequest {
  name: string;
  description: string;
  is_default: boolean;
  permission_ids: number[];
}

export interface UpdateRoleRequest {
  name?: string;
  description?: string;
  is_default?: boolean;
  permission_ids?: number[];
}

const API_URL = `${API_BASE_URL}/api/v1/roles`;

// Get auth token from local storage
const getAuthToken = () => localStorage.getItem('authToken');

// Headers configuration with auth token
const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getAuthToken()}`,
  },
});

export const rolesApi = {
  // Get all roles
  getAllRoles: async (skip = 0, limit = 100): Promise<Role[]> => {
    const response = await axios.get(
      `${API_URL}/?skip=${skip}&limit=${limit}`,
      getAuthHeaders()
    );
    return response.data;
  },

  // Get role by ID
  getRoleById: async (id: number): Promise<Role> => {
    const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
    return response.data;
  },

  // Create new role
  createRole: async (roleData: CreateRoleRequest): Promise<Role> => {
    const response = await axios.post(API_URL, roleData, getAuthHeaders());
    return response.data;
  },

  // Update role
  updateRole: async (id: number, roleData: UpdateRoleRequest): Promise<Role> => {
    const response = await axios.put(`${API_URL}/${id}`, roleData, getAuthHeaders());
    return response.data;
  },

  // Delete role
  deleteRole: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  },
};

export default rolesApi;
