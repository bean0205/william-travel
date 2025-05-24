// filepath: /Users/williamnguyen/Documents/william travel/frontend/src/services/api/locationService.ts
import apiClient from './apiClient';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

// Location interfaces based on API documentation
export interface Location {
  id: string;
  name: string;
  slug?: string;
  country?: string;
  region?: string;
  city?: string;
  description?: string;
  latitude?: string;
  longitude?: string;
  imageUrl?: string;
  featuredImageUrl?: string;
  isFeatured?: boolean;
  status?: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface Continent {
  id: number;
  name: string;
  code: string;
  name_code: string;
  background_image?: string;
  logo?: string;
  description?: string;
  description_code?: string;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface Country {
  id: number;
  name: string;
  code: string;
  name_code: string;
  description?: string;
  description_code?: string;
  background_image?: string;
  logo?: string;
  continent_id: number;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface Region {
  id: number;
  name: string;
  code: string;
  name_code: string;
  description?: string;
  description_code?: string;
  background_image?: string;
  logo?: string;
  country_id: number;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface District {
  id: number;
  name: string;
  code: string;
  name_code: string;
  description?: string;
  description_code?: string;
  status: number;
  region_id: number;
  created_at: string;
  updated_at: string;
}

export interface Ward {
  id: number;
  name: string;
  code: string;
  name_code: string;
  status: number;
  district_id: number;
  created_at: string;
  updated_at: string;
}

export interface LocationCategory {
  id: number;
  name: string;
  code: string;
  status: number;
  created_at: string;
  updated_at: string;
}

// Continent endpoints
export const getContinents = async (params?: { skip?: number; limit?: number }) => {
  const response = await apiClient.get(API_ENDPOINTS.LOCATIONS.CONTINENTS, { params });
  return response.data;
};

export const getContinentById = async (id: number) => {
  const response = await apiClient.get(`${API_ENDPOINTS.LOCATIONS.CONTINENTS}/${id}`);
  return response.data;
};

export const createContinent = async (continentData: Partial<Continent>) => {
  const response = await apiClient.post(API_ENDPOINTS.LOCATIONS.CONTINENTS, continentData);
  return response.data;
};

export const updateContinent = async (id: number, continentData: Partial<Continent>) => {
  const response = await apiClient.put(`${API_ENDPOINTS.LOCATIONS.CONTINENTS}/${id}`, continentData);
  return response.data;
};

// Country endpoints
export const getCountries = async (params?: { skip?: number; limit?: number; continent_id?: number }) => {
  const response = await apiClient.get(API_ENDPOINTS.LOCATIONS.COUNTRIES, { params });
  return response.data;
};

export const getCountryById = async (id: number) => {
  const response = await apiClient.get(`${API_ENDPOINTS.LOCATIONS.COUNTRIES}/${id}`);
  return response.data;
};

export const updateCountry = async (id: number, countryData: Partial<Country>) => {
  const response = await apiClient.put(`${API_ENDPOINTS.LOCATIONS.COUNTRIES}/${id}`, countryData);
  return response.data;
};

// Region endpoints
export const getRegions = async (params?: { skip?: number; limit?: number; country_id?: number }) => {
  const response = await apiClient.get(API_ENDPOINTS.LOCATIONS.REGIONS, { params });
  return response.data;
};

export const getRegionById = async (id: number) => {
  const response = await apiClient.get(`${API_ENDPOINTS.LOCATIONS.REGIONS}/${id}`);
  return response.data;
};

export const updateRegion = async (id: number, regionData: Partial<Region>) => {
  const response = await apiClient.put(`${API_ENDPOINTS.LOCATIONS.REGIONS}/${id}`, regionData);
  return response.data;
};

// District endpoints
export const getDistricts = async (params?: { skip?: number; limit?: number; region_id?: number }) => {
  const response = await apiClient.get(API_ENDPOINTS.LOCATIONS.DISTRICTS, { params });
  return response.data;
};

export const getDistrictById = async (id: number) => {
  const response = await apiClient.get(`${API_ENDPOINTS.LOCATIONS.DISTRICTS}/${id}`);
  return response.data;
};

// Ward endpoints
export const getWards = async (params?: { skip?: number; limit?: number; district_id?: number }) => {
  const response = await apiClient.get(API_ENDPOINTS.LOCATIONS.WARDS, { params });
  return response.data;
};

export const getWardById = async (id: number) => {
  const response = await apiClient.get(`${API_ENDPOINTS.LOCATIONS.WARDS}/${id}`);
  return response.data;
};

// Location categories endpoints
export const getLocationCategories = async () => {
  const response = await apiClient.get(API_ENDPOINTS.LOCATIONS.CATEGORIES);
  return response.data;
};

export const getLocationCategoryById = async (id: number) => {
  const response = await apiClient.get(`${API_ENDPOINTS.LOCATIONS.CATEGORIES}/${id}`);
  return response.data;
};

// Real API implementation
export const getLocations = async (params?: { skip?: number; limit?: number; category_id?: number; country_id?: number }) => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.LOCATIONS.BASE, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw error;
  }
};

export const createLocation = async (locationData: Partial<Location>) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.LOCATIONS.BASE, locationData);
    return response.data;
  } catch (error) {
    console.error('Error creating location:', error);
    throw error;
  }
};

export const updateLocation = async (id: string, locationData: Partial<Location>) => {
  try {
    const response = await apiClient.put(`${API_ENDPOINTS.LOCATIONS.BASE}/${id}`, locationData);
    return response.data;
  } catch (error) {
    console.error(`Error updating location with id ${id}:`, error);
    throw error;
  }
};

export const deleteLocation = async (id: string) => {
  try {
    const response = await apiClient.delete(`${API_ENDPOINTS.LOCATIONS.BASE}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting location with id ${id}:`, error);
    throw error;
  }
};

// No mock data needed anymore as we're using real API


