import apiClient from './apiClient';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

// Interface cho Media File phù hợp với API documentation
export interface MediaFile {
  id: number;
  file_name: string;
  file_path: string;
  file_url: string;
  mime_type: string;
  file_size: number;
  type_id: number;
  category_id: number;
  entity_type?: string;
  entity_id?: number;
  title?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

// Export alias for compatibility
export type Media = MediaFile;

// Interface cho Media Type
export interface MediaType {
  id: number;
  name: string;
  code: string;
  status: number;
  created_at: string;
  updated_at: string;
}

// Interface cho Media Category
export interface MediaCategory {
  id: number;
  name: string;
  code: string;
  status: number;
  created_at: string;
  updated_at: string;
}

// Media file endpoints
export const getMedia = async (params?: {
  skip?: number;
  limit?: number;
  type_id?: number;
  category_id?: number;
  entity_type?: string;
  entity_id?: number;
}) => {
  const response = await apiClient.get(API_ENDPOINTS.MEDIA.BASE, { params });
  return response.data;
};

export const getMediaById = async (id: string) => {
  const response = await apiClient.get(`${API_ENDPOINTS.MEDIA.BASE}/${id}`);
  return response.data;
};

export const uploadMedia = async (formData: FormData) => {
  const response = await apiClient.post(API_ENDPOINTS.MEDIA.BASE, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const deleteMedia = async (id: string) => {
  const response = await apiClient.delete(`${API_ENDPOINTS.MEDIA.BASE}/${id}`);
  return response.data;
};

// Media types endpoints
export const getMediaTypes = async () => {
  const response = await apiClient.get(API_ENDPOINTS.MEDIA.TYPES);
  return response.data;
};

export const getMediaTypeById = async (id: number) => {
  const response = await apiClient.get(API_ENDPOINTS.MEDIA.TYPE_DETAIL(id));
  return response.data;
};

export const createMediaType = async (typeData: Partial<MediaType>) => {
  const response = await apiClient.post(API_ENDPOINTS.MEDIA.TYPES, typeData);
  return response.data;
};

export const updateMediaType = async (id: number, typeData: Partial<MediaType>) => {
  const response = await apiClient.put(API_ENDPOINTS.MEDIA.TYPE_DETAIL(id), typeData);
  return response.data;
};

export const deleteMediaType = async (id: number) => {
  const response = await apiClient.delete(API_ENDPOINTS.MEDIA.TYPE_DETAIL(id));
  return response.data;
};

// Media categories endpoints
export const getMediaCategories = async () => {
  const response = await apiClient.get(API_ENDPOINTS.MEDIA.CATEGORIES);
  return response.data;
};

export const getMediaCategoryById = async (id: number) => {
  const response = await apiClient.get(API_ENDPOINTS.MEDIA.CATEGORY_DETAIL(id));
  return response.data;
};

export const createMediaCategory = async (categoryData: Partial<MediaCategory>) => {
  const response = await apiClient.post(API_ENDPOINTS.MEDIA.CATEGORIES, categoryData);
  return response.data;
};

export const updateMediaCategory = async (id: number, categoryData: Partial<MediaCategory>) => {
  const response = await apiClient.put(API_ENDPOINTS.MEDIA.CATEGORY_DETAIL(id), categoryData);
  return response.data;
};

export const deleteMediaCategory = async (id: number) => {
  const response = await apiClient.delete(API_ENDPOINTS.MEDIA.CATEGORY_DETAIL(id));
  return response.data;
};

