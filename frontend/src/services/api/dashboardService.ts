import apiClient from './apiClient';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

export interface DashboardStats {
  totalUsers: number;
  totalContent: number;
  totalRoles: number;
  monthlyViews: number;
  activeUsers: number;
  pendingApprovals: number;
  totalLocations: number;
  totalGuides: number;
  userGrowth?: number;
  contentGrowth?: number;
  locationGrowth?: number;
  viewsGrowth?: number;
}

export interface SystemStatus {
  apiStatus: 'operational' | 'warning' | 'error';
  databaseStatus: 'healthy' | 'warning' | 'error';
  storageUsed: number; // percentage
  lastBackup: string;
}

export interface RecentActivity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  user?: string;
}

// Get dashboard overview statistics
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const response = await apiClient.get(`${API_ENDPOINTS.ANALYTICS.BASE}/dashboard-stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

// Get system status information
export const getSystemStatus = async (): Promise<SystemStatus> => {
  try {
    const response = await apiClient.get(`${API_ENDPOINTS.ANALYTICS.BASE}/system-status`);
    return response.data;
  } catch (error) {
    console.error('Error fetching system status:', error);
    throw error;
  }
};

// Get recent activity feed
export const getRecentActivity = async (limit: number = 10): Promise<RecentActivity[]> => {
  try {
    const response = await apiClient.get(`${API_ENDPOINTS.ANALYTICS.BASE}/recent-activity`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    throw error;
  }
};

// Get quick stats for admin dashboard cards
export const getQuickStats = async () => {
  try {
    const response = await apiClient.get(`${API_ENDPOINTS.ANALYTICS.BASE}/quick-stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching quick stats:', error);
    throw error;
  }
};
