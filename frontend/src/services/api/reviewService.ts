import apiClient from './apiClient';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

export interface Review {
  id: number;
  title: string;
  rating: number; // 1-5
  status: 'published' | 'pending' | 'flagged';
  content: string;
  reviewer: string;
  reviewerId?: number;
  location: string;
  locationId?: number;
  date: string;
  images?: string[];
  responseText?: string;
  responseDate?: string;
}

export const getReviews = async (filters?: Record<string, unknown>) => {
  const response = await apiClient.get(API_ENDPOINTS.REVIEWS.BASE, { params: filters });
  return response.data;
};

export const getReviewById = async (id: number) => {
  const response = await apiClient.get(`${API_ENDPOINTS.REVIEWS.BASE}/${id}`);
  return response.data;
};

export const updateReviewStatus = async (id: number, status: 'published' | 'pending' | 'flagged') => {
  const response = await apiClient.patch(`${API_ENDPOINTS.REVIEWS.BASE}/${id}/status`, { status });
  return response.data;
};

export const respondToReview = async (id: number, responseText: string) => {
  const response = await apiClient.post(`${API_ENDPOINTS.REVIEWS.BASE}/${id}/response`, { responseText });
  return response.data;
};

export const deleteReview = async (id: number) => {
  const response = await apiClient.delete(`${API_ENDPOINTS.REVIEWS.BASE}/${id}`);
  return response.data;
};
