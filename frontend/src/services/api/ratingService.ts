// filepath: /Users/williamnguyen/Documents/william travel/frontend/src/services/api/ratingService.ts
import apiClient from './apiClient';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

// Định nghĩa interfaces cho Rating
export interface Rating {
  id: number;
  reference_id: number;
  reference_type: string;
  rating: number;
  comment?: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  status?: 'published' | 'pending' | 'flagged';
}

// Định nghĩa interfaces cho Rating với thông tin người dùng
export interface RatingWithUser {
  id: number;
  reference_id: number;
  reference_type: string;
  rating: number;
  comment?: string;
  user: {
    id: number;
    full_name: string;
  };
  created_at: string;
  status?: 'published' | 'pending' | 'flagged';
}

// Định nghĩa interfaces cho Average Rating
export interface AverageRating {
  average_rating: number;
  ratings_count: number;
}

// Định nghĩa interfaces cho pagination response
export interface PaginationResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// Rating endpoints
export const createRating = async (ratingData: {
  reference_id: number;
  reference_type: string;
  rating: number;
  comment?: string;
}): Promise<Rating> => {
  const response = await apiClient.post(API_ENDPOINTS.RATINGS.BASE, ratingData);
  return response.data;
};

export const getRatings = async (params?: {
  page?: number;
  limit?: number;
  reference_id?: number;
  reference_type?: string;
  user_id?: number | string;
  status?: string;
  search?: string;
  sort_by?: string;
  sort_order?: string;
  rating?: number;
  location?: string;
  start_date?: string;
  end_date?: string;
  skip?: number;
}): Promise<PaginationResponse<RatingWithUser>> => {
  const response = await apiClient.get(API_ENDPOINTS.RATINGS.BASE, { params });
  return response.data;
};

export const getRatingById = async (id: number): Promise<RatingWithUser> => {
  const response = await apiClient.get(`${API_ENDPOINTS.RATINGS.BASE}/${id}`);
  return response.data;
};

export const updateRating = async (id: number, data: Partial<Rating>): Promise<Rating> => {
  const response = await apiClient.put(`${API_ENDPOINTS.RATINGS.BASE}/${id}`, data);
  return response.data;
};

export const deleteRating = async (id: number): Promise<void> => {
  await apiClient.delete(`${API_ENDPOINTS.RATINGS.BASE}/${id}`);
};

export const updateRatingStatus = async (id: number, status: 'published' | 'pending' | 'flagged'): Promise<Rating> => {
  const response = await apiClient.patch(`${API_ENDPOINTS.RATINGS.BASE}/${id}/status`, { status });
  return response.data;
};

export const respondToReview = async (id: number, response: string): Promise<Rating> => {
  const res = await apiClient.post(`${API_ENDPOINTS.RATINGS.BASE}/${id}/response`, { response });
  return res.data;
};

export const getAverageRating = async (params: {
  reference_id?: number;
  reference_type: string;
}): Promise<AverageRating> => {
  const response = await apiClient.get(API_ENDPOINTS.RATINGS.AVERAGE, { params });
  return response.data;
};

export const getUserRating = async (params: {
  reference_id: number;
  reference_type: string;
}): Promise<Rating> => {
  const response = await apiClient.get(API_ENDPOINTS.RATINGS.USER, { params });
  return response.data;
};
