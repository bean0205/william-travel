import apiClient from './apiClient';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

// Interface cho dữ liệu phân tích
export interface AnalyticsData {
  timeRange: '7d' | '30d' | '90d' | '1y';
  totalVisits: number;
  uniqueUsers: number;
  pageViews: number;
  avgSessionTime: string;
  bounceRate: string;
  topCountries: string[];
  deviceUsage: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
}

export interface PageViewData {
  id: number;
  title: string;
  views: number;
  avgTime: string;
}

export interface ReferrerData {
  id: number;
  source: string;
  visits: number;
  conversionRate: string;
}

// Lấy dữ liệu phân tích theo khoảng thời gian
export const getAnalytics = async (timeRange: '7d' | '30d' | '90d' | '1y' = '30d') => {
  const response = await apiClient.get(API_ENDPOINTS.ANALYTICS.BASE, { params: { timeRange } });
  return response.data;
};

// Lấy số liệu về trang được xem nhiều nhất
export const getMostViewedPages = async (limit: number = 5) => {
  const response = await apiClient.get(`${API_ENDPOINTS.ANALYTICS.BASE}/most-viewed`, { params: { limit } });
  return response.data;
};

// Lấy số liệu về nguồn truy cập
export const getTopReferrers = async (limit: number = 5) => {
  const response = await apiClient.get(`${API_ENDPOINTS.ANALYTICS.BASE}/referrers`, { params: { limit } });
  return response.data;
};

// Lấy báo cáo doanh thu (nếu có)
export const getRevenueReport = async (timeRange: '7d' | '30d' | '90d' | '1y' = '30d') => {
  const response = await apiClient.get(`${API_ENDPOINTS.ANALYTICS.BASE}/revenue`, { params: { timeRange } });
  return response.data;
};

// Lấy báo cáo người dùng
export const getUserReport = async () => {
  const response = await apiClient.get(`${API_ENDPOINTS.ANALYTICS.BASE}/users`);
  return response.data;
};
