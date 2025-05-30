import axios from 'axios';
import { API_BASE_URL } from '@/config/appConfig';

// Types based on API documentation
export interface AccommodationCategory {
  id: number;
  name: string;
  description: string;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface AccommodationLocation {
  latitude: number;
  longitude: number;
}

export interface AccommodationContacts {
  phone: string;
  email: string;
  website?: string;
}

export interface Accommodation {
  id: number;
  name: string;
  description: string;
  address: string;
  category_id: number;
  price_range: string;
  rating: number;
  facilities: string[];
  contacts: AccommodationContacts;
  location: AccommodationLocation;
  region_id: number;
  images: string[];
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface CreateAccommodationRequest {
  name: string;
  description: string;
  address: string;
  category_id: number;
  price_range: string;
  facilities: string[];
  contacts: AccommodationContacts;
  location: AccommodationLocation;
  region_id: number;
}

export interface UpdateAccommodationRequest {
  name?: string;
  description?: string;
  address?: string;
  category_id?: number;
  price_range?: string;
  facilities?: string[];
  contacts?: AccommodationContacts;
  location?: AccommodationLocation;
  region_id?: number;
}

export interface CreateAccommodationCategoryRequest {
  name: string;
  description: string;
  status: number;
}

export interface UpdateAccommodationCategoryRequest {
  name?: string;
  description?: string;
  status?: number;
}

// Get auth token from local storage
const getAuthToken = () => localStorage.getItem('authToken');

// Headers configuration with auth token
const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getAuthToken()}`,
  },
});

// API endpoints
const API_URL = `${API_BASE_URL}/api/v1/accommodations`;
const CATEGORIES_URL = `${API_URL}/categories`;

export const accommodationsApi = {
  // Accommodation endpoints
  getAccommodations: async (
    page = 1,
    limit = 10,
    search?: string,
    categoryId?: number,
    countryId?: number,
    regionId?: number,
    districtId?: number,
    minPrice?: number,
    maxPrice?: number
  ): Promise<PaginatedResponse<Accommodation>> => {
    let url = `${API_URL}/?page=${page}&limit=${limit}`;

    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (categoryId) url += `&category_id=${categoryId}`;
    if (countryId) url += `&country_id=${countryId}`;
    if (regionId) url += `&region_id=${regionId}`;
    if (districtId) url += `&district_id=${districtId}`;
    if (minPrice) url += `&min_price=${minPrice}`;
    if (maxPrice) url += `&max_price=${maxPrice}`;

    const response = await axios.get(url);
    return response.data;
  },

  getAccommodationById: async (id: number): Promise<Accommodation> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  createAccommodation: async (accommodation: CreateAccommodationRequest): Promise<Accommodation> => {
    const response = await axios.post(API_URL, accommodation, getAuthHeaders());
    return response.data;
  },

  updateAccommodation: async (id: number, accommodation: UpdateAccommodationRequest): Promise<Accommodation> => {
    const response = await axios.put(`${API_URL}/${id}`, accommodation, getAuthHeaders());
    return response.data;
  },

  deleteAccommodation: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  },

  // Category endpoints
  getCategories: async (): Promise<AccommodationCategory[]> => {
    const response = await axios.get(CATEGORIES_URL);
    return response.data;
  },

  getCategoryById: async (id: number): Promise<AccommodationCategory> => {
    const response = await axios.get(`${CATEGORIES_URL}/${id}`);
    return response.data;
  },

  createCategory: async (category: CreateAccommodationCategoryRequest): Promise<AccommodationCategory> => {
    const response = await axios.post(CATEGORIES_URL, category, getAuthHeaders());
    return response.data;
  },

  updateCategory: async (id: number, category: UpdateAccommodationCategoryRequest): Promise<AccommodationCategory> => {
    const response = await axios.put(`${CATEGORIES_URL}/${id}`, category, getAuthHeaders());
    return response.data;
  },

  deleteCategory: async (id: number): Promise<void> => {
    await axios.delete(`${CATEGORIES_URL}/${id}`, getAuthHeaders());
  }
};

export default accommodationsApi;
