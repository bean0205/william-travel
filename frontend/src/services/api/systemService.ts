import apiClient from './apiClient';
import { API_URL } from '@/config/appConfig';

export interface SystemSettings {
  siteName: string;
  siteDescription: string;
  supportEmail: string;
  contactPhone: string;
  maintenanceMode: boolean;
  cacheEnabled: boolean;
  cacheTTL: number;
}

export interface ApiKey {
  id: number;
  service: string;
  key: string;
  status: 'active' | 'inactive';
  lastUsed: string;
}

export interface FeatureToggle {
  id: number;
  feature: string;
  enabled: boolean;
  description?: string;
}

// Lấy thông tin cài đặt hệ thống
export const getSystemSettings = async () => {
  const response = await apiClient.get(`${API_URL}/settings/system`);
  return response.data;
};

// Cập nhật thông tin cài đặt hệ thống
export const updateSystemSettings = async (settings: Partial<SystemSettings>) => {
  const response = await apiClient.put(`${API_URL}/settings/system`, settings);
  return response.data;
};

// Lấy danh sách các API key
export const getApiKeys = async () => {
  const response = await apiClient.get(`${API_URL}/settings/api-keys`);
  return response.data;
};

// Tạo API key mới
export const createApiKey = async (keyData: { service: string }) => {
  const response = await apiClient.post(`${API_URL}/settings/api-keys`, keyData);
  return response.data;
};

// Tạo lại API key
export const regenerateApiKey = async (id: number) => {
  const response = await apiClient.put(`${API_URL}/settings/api-keys/${id}/regenerate`);
  return response.data;
};

// Xóa API key
export const deleteApiKey = async (id: number) => {
  const response = await apiClient.delete(`${API_URL}/settings/api-keys/${id}`);
  return response.data;
};

// Lấy danh sách các feature toggle
export const getFeatureToggles = async () => {
  const response = await apiClient.get(`${API_URL}/settings/features`);
  return response.data;
};

// Cập nhật feature toggle
export const updateFeatureToggle = async (id: number, enabled: boolean) => {
  const response = await apiClient.patch(`${API_URL}/settings/features/${id}`, { enabled });
  return response.data;
};

// Xóa cache
export const clearSystemCache = async () => {
  const response = await apiClient.post(`${API_URL}/settings/clear-cache`);
  return response.data;
};
