import apiClient from './apiClient';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

// Interface for the admin dashboard statistics
export interface AdminStats {
  usersCount: number;
  contentCount: number;
  locationsCount: number;
  bookingsCount: number;
  newUsers: {
    date: string;
    count: number;
  }[];
  contentViews: {
    date: string;
    count: number;
  }[];
}

// Interface for system activity logs
export interface SystemLog {
  id: string;
  action: string;
  userId?: string;
  userEmail?: string;
  message: string;
  timestamp: string;
  ip?: string;
  details?: Record<string, unknown>;
}

// Get admin dashboard statistics
export const getAdminStats = async (): Promise<AdminStats> => {
  try {
    const response = await apiClient.get(`${API_ENDPOINTS.ADMIN.DASHBOARD}/stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching admin statistics:', error);
    throw error;
  }
};

// Get system logs
export const getSystemLogs = async (params?: { 
  skip?: number; 
  limit?: number;
  startDate?: string;
  endDate?: string;
  action?: string;
  userId?: string;
}): Promise<{items: SystemLog[], total: number}> => {
  try {
    const response = await apiClient.get(`${API_ENDPOINTS.SYSTEM.LOGS}`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching system logs:', error);
    throw error;
  }
};

// Get system health status
export const getSystemHealth = async (): Promise<{
  status: 'healthy' | 'unhealthy' | 'degraded';
  api: 'up' | 'down';
  database: 'up' | 'down';
  cache: 'up' | 'down';
  storage: 'up' | 'down';
  responseTime: number;
  uptime: number;
  lastRestart: string;
  version: string;
}> => {
  try {
    const response = await apiClient.get(`${API_ENDPOINTS.SYSTEM.SETTINGS}/health`);
    return response.data;
  } catch (error) {
    console.error('Error fetching system health:', error);
    throw error;
  }
};

// Run system maintenance tasks
export const runSystemMaintenance = async (task: string): Promise<{
  success: boolean;
  message: string;
  details?: Record<string, any>;
}> => {
  try {
    const response = await apiClient.post(`${API_ENDPOINTS.SYSTEM.SETTINGS}/maintenance`, { task });
    return response.data;
  } catch (error) {
    console.error(`Error running maintenance task '${task}':`, error);
    throw error;
  }
};

// Update system settings
export const updateSystemSettings = async (settings: Record<string, unknown>): Promise<{
  success: boolean;
  message: string;
  settings: Record<string, unknown>;
}> => {
  try {
    const response = await apiClient.put(`${API_ENDPOINTS.SYSTEM.SETTINGS}`, settings);
    return response.data;
  } catch (error) {
    console.error('Error updating system settings:', error);
    throw error;
  }
};

// Get system backup status
export const getBackupStatus = async (): Promise<{
  lastBackup: string | null;
  backupSize: number;
  backupCount: number;
  autoBackup: boolean;
  backupSchedule?: string;
  backupLocation: string;
}> => {
  try {
    const response = await apiClient.get(`${API_ENDPOINTS.ADMIN.BASE}/backups`);
    return response.data;
  } catch (error) {
    console.error('Error fetching backup status:', error);
    throw error;
  }
};

// Create a new backup
export const createBackup = async (): Promise<{
  success: boolean;
  message: string;
  backupId?: string;
  timestamp?: string;
  size?: number;
}> => {
  try {
    const response = await apiClient.post(`${API_ENDPOINTS.ADMIN.BASE}/backups`);
    return response.data;
  } catch (error) {
    console.error('Error creating backup:', error);
    throw error;
  }
};

// Get API usage statistics
export const getApiUsageStats = async (params?: { 
  startDate?: string;
  endDate?: string;
}): Promise<{
  totalRequests: number;
  averageResponseTime: number;
  errorRate: number;
  endpointStats: {
    endpoint: string;
    requests: number;
    averageResponseTime: number;
    errorRate: number;
  }[];
  requestsPerDay: {
    date: string;
    count: number;
  }[];
}> => {
  try {
    const response = await apiClient.get(`${API_ENDPOINTS.ANALYTICS.BASE}/api-usage`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching API usage statistics:', error);
    throw error;
  }
};
