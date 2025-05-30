// Accommodation service for API communication
import apiClient from './apiClient';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

// Accommodation Category interfaces
export interface AccommodationCategory {
  id: number;
  name: string;
  description: string;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface AccommodationCategoryPayload {
  name: string;
  description?: string;
  status: number;
}

// Accommodation interfaces
export interface Accommodation {
  id: number;
  name: string;
  description: string;
  address: string;
  category_id: number;
  price_range: string;
  rating?: number;
  facilities: string[];
  contacts: {
    phone?: string;
    email?: string;
    website?: string;
  };
  location: {
    latitude: number;
    longitude: number;
  };
  region_id: number;
  images: string[];
  created_at: string;
  updated_at: string;
}

export interface AccommodationPayload {
  name: string;
  description?: string;
  address: string;
  category_id: number;
  price_range: string;
  facilities?: string[];
  contacts?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  location?: {
    latitude: number;
    longitude: number;
  };
  region_id: number;
}

export interface AccommodationResponse {
  items: Accommodation[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// Accommodation Category API calls
export const getAccommodationCategories = async (): Promise<AccommodationCategory[]> => {
  const response = await apiClient.get(API_ENDPOINTS.accommodations.categories.list);
  return response.data;
};

export const getAccommodationCategoryById = async (categoryId: number): Promise<AccommodationCategory> => {
  const response = await apiClient.get(API_ENDPOINTS.accommodations.categories.detail(categoryId));
  return response.data;
};

export const createAccommodationCategory = async (payload: AccommodationCategoryPayload): Promise<AccommodationCategory> => {
  const response = await apiClient.post(API_ENDPOINTS.accommodations.categories.list, payload);
  return response.data;
};

export const updateAccommodationCategory = async (categoryId: number, payload: AccommodationCategoryPayload): Promise<AccommodationCategory> => {
  const response = await apiClient.put(API_ENDPOINTS.accommodations.categories.detail(categoryId), payload);
  return response.data;
};

// Accommodation API calls
export const getAccommodations = async (
  page = 1,
  limit = 10,
  search?: string,
  categoryId?: number,
  countryId?: number,
  regionId?: number,
  districtId?: number,
  minPrice?: number,
  maxPrice?: number,
): Promise<AccommodationResponse> => {
  const params: Record<string, any> = { page, limit };

  if (search) params.search = search;
  if (categoryId) params.category_id = categoryId;
  if (countryId) params.country_id = countryId;
  if (regionId) params.region_id = regionId;
  if (districtId) params.district_id = districtId;
  if (minPrice) params.min_price = minPrice;
  if (maxPrice) params.max_price = maxPrice;

  const response = await apiClient.get(API_ENDPOINTS.accommodations.list, { params });
  return response.data;
};

export const getAccommodationById = async (accommodationId: number): Promise<Accommodation> => {
  const response = await apiClient.get(API_ENDPOINTS.accommodations.detail(accommodationId));
  return response.data;
};

export const createAccommodation = async (payload: AccommodationPayload): Promise<Accommodation> => {
  const response = await apiClient.post(API_ENDPOINTS.accommodations.list, payload);
  return response.data;
};

export const updateAccommodation = async (accommodationId: number, payload: AccommodationPayload): Promise<Accommodation> => {
  const response = await apiClient.put(API_ENDPOINTS.accommodations.detail(accommodationId), payload);
  return response.data;
};

export const deleteAccommodation = async (accommodationId: number): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.accommodations.detail(accommodationId));
};
