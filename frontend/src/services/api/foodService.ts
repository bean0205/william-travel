// Food service for API communication
import apiClient from './apiClient';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

// Food Category interfaces
export interface FoodCategory {
  id: number;
  name: string;
  description: string;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface FoodCategoryPayload {
  name: string;
  description?: string;
  status: number;
}

// Food interfaces
export interface Food {
  id: number;
  name: string;
  description: string;
  address: string;
  category_id: number;
  cuisine: string;
  price_range: string;
  signature_dishes: string[];
  operating_hours: string;
  contacts: {
    phone?: string;
    email?: string;
  };
  location: {
    latitude: number;
    longitude: number;
  };
  region_id: number;
  images: string[];
  rating?: number;
  created_at: string;
  updated_at: string;
}

export interface FoodPayload {
  name: string;
  description?: string;
  address: string;
  category_id: number;
  cuisine: string;
  price_range: string;
  signature_dishes?: string[];
  operating_hours?: string;
  contacts?: {
    phone?: string;
    email?: string;
  };
  location?: {
    latitude: number;
    longitude: number;
  };
  region_id: number;
}

export interface FoodResponse {
  items: Food[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// Food Category API calls
export const getFoodCategories = async (): Promise<FoodCategory[]> => {
  const response = await apiClient.get(API_ENDPOINTS.foods.categories.list);
  return response.data;
};

export const getFoodCategoryById = async (categoryId: number): Promise<FoodCategory> => {
  const response = await apiClient.get(API_ENDPOINTS.foods.categories.detail(categoryId));
  return response.data;
};

export const createFoodCategory = async (payload: FoodCategoryPayload): Promise<FoodCategory> => {
  const response = await apiClient.post(API_ENDPOINTS.foods.categories.list, payload);
  return response.data;
};

export const updateFoodCategory = async (categoryId: number, payload: FoodCategoryPayload): Promise<FoodCategory> => {
  const response = await apiClient.put(API_ENDPOINTS.foods.categories.detail(categoryId), payload);
  return response.data;
};

// Food API calls
export const getFoods = async (
  page = 1,
  limit = 10,
  search?: string,
  categoryId?: number,
  countryId?: number,
  regionId?: number,
  districtId?: number,
  minPrice?: number,
  maxPrice?: number,
): Promise<FoodResponse> => {
  const params: Record<string, any> = { page, limit };

  if (search) params.search = search;
  if (categoryId) params.category_id = categoryId;
  if (countryId) params.country_id = countryId;
  if (regionId) params.region_id = regionId;
  if (districtId) params.district_id = districtId;
  if (minPrice) params.min_price = minPrice;
  if (maxPrice) params.max_price = maxPrice;

  const response = await apiClient.get(API_ENDPOINTS.foods.list, { params });
  return response.data;
};

export const getFoodById = async (foodId: number): Promise<Food> => {
  const response = await apiClient.get(API_ENDPOINTS.foods.detail(foodId));
  return response.data;
};

export const createFood = async (payload: FoodPayload): Promise<Food> => {
  const response = await apiClient.post(API_ENDPOINTS.foods.list, payload);
  return response.data;
};

export const updateFood = async (foodId: number, payload: FoodPayload): Promise<Food> => {
  const response = await apiClient.put(API_ENDPOINTS.foods.detail(foodId), payload);
  return response.data;
};

export const deleteFood = async (foodId: number): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.foods.detail(foodId));
};
