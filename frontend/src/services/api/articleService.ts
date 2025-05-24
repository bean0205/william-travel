import apiClient from './apiClient';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

export interface Article {
  id: number;
  title: string;
  status: 'published' | 'draft' | 'archived';
  author: string;
  content: string;
  thumbnailUrl?: string;
  views: number;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  categoryId?: number;
}

export const getArticles = async (filters?: Record<string, unknown>) => {
  const response = await apiClient.get(API_ENDPOINTS.CONTENT.ARTICLES, { params: filters });
  return response.data;
};

export const getArticleById = async (id: number) => {
  const response = await apiClient.get(`${API_ENDPOINTS.CONTENT.ARTICLES}/${id}`);
  return response.data;
};

export const createArticle = async (articleData: Omit<Article, 'id' | 'views' | 'createdAt' | 'updatedAt'>) => {
  const response = await apiClient.post(API_ENDPOINTS.CONTENT.ARTICLES, articleData);
  return response.data;
};

export const updateArticle = async (id: number, articleData: Partial<Article>) => {
  const response = await apiClient.put(`${API_ENDPOINTS.CONTENT.ARTICLES}/${id}`, articleData);
  return response.data;
};

export const deleteArticle = async (id: number) => {
  const response = await apiClient.delete(`${API_ENDPOINTS.CONTENT.ARTICLES}/${id}`);
  return response.data;
};
