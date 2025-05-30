// filepath: /Users/williamnguyen/Documents/william travel/frontend/src/services/api/guideService.ts
import apiClient from './apiClient';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

export interface Guide {
  id?: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  languages?: string;
  specialties?: string;
  experience?: string;
  bio?: string;
  profileImage?: string;
  rating?: number;
  certifications?: string;
  isVerified?: boolean;
  isActive?: boolean;
}

// Get guides (filter users with guide role)
export const getGuides = async (filters?: Record<string, unknown>) => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.USERS.BASE, {
      params: { ...filters, role: 'guide' }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching guides:', error);
    throw error;
  }
};

// Get guide by ID
export const getGuideById = async (id: string) => {
  try {
    const response = await apiClient.get(`${API_ENDPOINTS.USERS.BASE}/${id}`);
    return response.data;  } catch (error) {
    console.error(`Error fetching guide with ID ${id}:`, error);
    throw error;
  }
};

// Create a new guide
export const createGuide = async (guideData: Partial<Guide>) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.USERS.BASE, {
      ...guideData,
      role: 'guide'
    });
    return response.data;
  } catch (error) {
    console.error('Error creating guide:', error);
    throw error;
  }
};

// Update a guide
export const updateGuide = async (id: string, guideData: Partial<Guide>) => {
  try {
    const response = await apiClient.put(`${API_ENDPOINTS.USERS.BASE}/${id}`, guideData);
    return response.data;
  } catch (error) {
    console.error(`Error updating guide with ID ${id}:`, error);
    throw error;
  }
};

// Delete a guide
export const deleteGuide = async (id: string) => {
  try {
    await apiClient.delete(`${API_ENDPOINTS.USERS.BASE}/${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting guide with ID ${id}:`, error);
    throw error;
  }
};
