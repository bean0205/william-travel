import apiClient from './apiClient';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

export interface Tour {
  id: string;
  title: string;
  description: string;
  location: string;
  duration: string;
  price: number;
  categories: string[];
  highlights?: string;
  itinerary?: string;
  includedItems?: string;
  notIncludedItems?: string;
  meetingPoint?: string;
  groupSize?: number;
  views?: number;
  bookings?: number;
  rating?: number;
  guideId: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt?: string;
  updatedAt?: string;
}

export interface TourStats {
  totalTours: number;
  totalBookings: number;
  averageRating: number;
  viewsByMonth: {
    month: string;
    count: number;
  }[];
  bookingsByMonth: {
    month: string;
    count: number;
  }[];
}

// Get tours by guide ID
export const getToursByGuideId = async (guideId: string, params?: { skip?: number; limit?: number }) => {
  try {
    const response = await apiClient.get(`${API_ENDPOINTS.CONTENT.GUIDES}/by-guide/${guideId}`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching tours by guide ID:', error);
    throw error;
  }
};

// Get all tours
export const getTours = async (params?: { 
  skip?: number; 
  limit?: number;
  status?: string;
  category?: string;
  location?: string;
}) => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.CONTENT.GUIDES, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching tours:', error);
    throw error;
  }
};

// Get tour by ID
export const getTourById = async (id: string) => {
  try {
    const response = await apiClient.get(`${API_ENDPOINTS.CONTENT.GUIDES}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching tour with ID ${id}:`, error);
    throw error;
  }
};

// Create a new tour
export const createTour = async (tourData: Omit<Tour, 'id' | 'views' | 'bookings' | 'createdAt' | 'updatedAt'>) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.CONTENT.GUIDES, tourData);
    return response.data;
  } catch (error) {
    console.error('Error creating tour:', error);
    throw error;
  }
};

// Update a tour
export const updateTour = async (id: string, tourData: Partial<Tour>) => {
  try {
    const response = await apiClient.put(`${API_ENDPOINTS.CONTENT.GUIDES}/${id}`, tourData);
    return response.data;
  } catch (error) {
    console.error(`Error updating tour with ID ${id}:`, error);
    throw error;
  }
};

// Delete a tour
export const deleteTour = async (id: string) => {
  try {
    const response = await apiClient.delete(`${API_ENDPOINTS.CONTENT.GUIDES}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting tour with ID ${id}:`, error);
    throw error;
  }
};

// Get tour statistics
export const getTourStatsByGuideId = async (guideId: string): Promise<TourStats> => {
  try {
    const response = await apiClient.get(`${API_ENDPOINTS.CONTENT.GUIDES}/stats/by-guide/${guideId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tour statistics:', error);
    throw error;
  }
};
