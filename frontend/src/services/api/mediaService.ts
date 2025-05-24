import apiClient from './apiClient';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

export interface Media {
  id?: string;
  title?: string;
  fileUrl?: string;
  thumbnailUrl?: string;
  type?: string;
  description?: string;
  altText?: string;
  tags?: string[];
  category?: string;
  isFeatured?: boolean;
  fileSize?: number;
  dimensions?: string;
  duration?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MediaType {
  id: number;
  name: string;
  code: string;
  status: number;
  createdAt: string;
  updatedAt: string;
}

export interface MediaCategory {
  id: number;
  name: string;
  code: string;
  status: number;
  createdAt: string;
  updatedAt: string;
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
  const response = await apiClient.get(`${API_ENDPOINTS.MEDIA.BASE}/types/`);
  return response.data;
};

export const getMediaTypeById = async (id: number) => {
  const response = await apiClient.get(`${API_ENDPOINTS.MEDIA.BASE}/types/${id}`);
  return response.data;
};

export const createMediaType = async (typeData: Partial<MediaType>) => {
  const response = await apiClient.post(`${API_ENDPOINTS.MEDIA.BASE}/types/`, typeData);
  return response.data;
};

// Media categories endpoints
export const getMediaCategories = async () => {
  const response = await apiClient.get(`${API_ENDPOINTS.MEDIA.BASE}/categories/`);
  return response.data;
};

export const getMediaCategoryById = async (id: number) => {
  const response = await apiClient.get(`${API_ENDPOINTS.MEDIA.BASE}/categories/${id}`);
  return response.data;
};

export const createMediaCategory = async (categoryData: Partial<MediaCategory>) => {
  const response = await apiClient.post(`${API_ENDPOINTS.MEDIA.BASE}/categories/`, categoryData);
  return response.data;
};
