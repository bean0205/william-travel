import apiClient from './apiClient';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

export interface SystemSettings {
  id: string;
  siteName: string;
  siteDescription: string;
  supportEmail: string;
  contactPhone: string;
  cacheEnabled: boolean;
  cacheTTL: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiKey {
  id: string;
  service: string;
  key: string;
  status: 'active' | 'inactive';
  lastUsed?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FeatureToggle {
  id: string;
  feature: string;
  enabled: boolean;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CacheStats {
  enabled: boolean;
  totalSize: number;
  hitRate: number;
  lastCleared?: string;
}

// System Settings
export const getSystemSettings = async (): Promise<SystemSettings> => {
  const response = await apiClient.get(API_ENDPOINTS.ADMIN.SETTINGS);
  return response.data;
};

export const updateSystemSettings = async (settings: Partial<SystemSettings>): Promise<SystemSettings> => {
  const response = await apiClient.put(API_ENDPOINTS.ADMIN.SETTINGS, settings);
  return response.data;
};

// API Keys Management
export const getApiKeys = async (): Promise<ApiKey[]> => {
  const response = await apiClient.get(`${API_ENDPOINTS.ADMIN.BASE}/api-keys`);
  return response.data;
};

export const createApiKey = async (apiKey: Omit<ApiKey, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiKey> => {
  const response = await apiClient.post(`${API_ENDPOINTS.ADMIN.BASE}/api-keys`, apiKey);
  return response.data;
};

export const updateApiKey = async (id: string, updates: Partial<ApiKey>): Promise<ApiKey> => {
  const response = await apiClient.put(`${API_ENDPOINTS.ADMIN.BASE}/api-keys/${id}`, updates);
  return response.data;
};

export const deleteApiKey = async (id: string): Promise<void> => {
  await apiClient.delete(`${API_ENDPOINTS.ADMIN.BASE}/api-keys/${id}`);
};

// Feature Toggles
export const getFeatureToggles = async (): Promise<FeatureToggle[]> => {
  const response = await apiClient.get(`${API_ENDPOINTS.ADMIN.BASE}/feature-toggles`);
  return response.data;
};

export const updateFeatureToggle = async (id: string, enabled: boolean): Promise<FeatureToggle> => {
  const response = await apiClient.put(`${API_ENDPOINTS.ADMIN.BASE}/feature-toggles/${id}`, { enabled });
  return response.data;
};

export const createFeatureToggle = async (toggle: Omit<FeatureToggle, 'id' | 'createdAt' | 'updatedAt'>): Promise<FeatureToggle> => {
  const response = await apiClient.post(`${API_ENDPOINTS.ADMIN.BASE}/feature-toggles`, toggle);
  return response.data;
};

export const deleteFeatureToggle = async (id: string): Promise<void> => {
  await apiClient.delete(`${API_ENDPOINTS.ADMIN.BASE}/feature-toggles/${id}`);
};

// Cache Management
export const getCacheStats = async (): Promise<CacheStats> => {
  const response = await apiClient.get(`${API_ENDPOINTS.ADMIN.BASE}/cache/stats`);
  return response.data;
};

export const clearCache = async (): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.post(`${API_ENDPOINTS.ADMIN.BASE}/cache/clear`);
  return response.data;
};

export const enableCache = async (enabled: boolean): Promise<{ success: boolean }> => {
  const response = await apiClient.put(`${API_ENDPOINTS.ADMIN.BASE}/cache/settings`, { enabled });
  return response.data;
};

export const setCacheTTL = async (ttl: number): Promise<{ success: boolean }> => {
  const response = await apiClient.put(`${API_ENDPOINTS.ADMIN.BASE}/cache/ttl`, { ttl });
  return response.data;
};
