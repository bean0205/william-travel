import axios from 'axios';
import { API_URL } from '@/config/appConfig';

export interface Content {
  id?: string;
  title: string;
  contentType: string;
  body: string;
  slug?: string;
  status: 'published' | 'draft' | 'archived';
  featured?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  imageUrl?: string;
  categoryId?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  viewCount?: number;
}

export interface ArticleCategory {
  id: number;
  name: string;
  description: string;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface ArticleTag {
  id: number;
  name: string;
  status: number;
  created_at: string;
  updated_at: string;
}

// Content/Article endpoints
export const getContents = async (filters?: any) => {
  // This would be replaced with the articles endpoint in a real application
  // For now, keep existing implementation for backward compatibility
  const response = await axios.get(`${API_URL}/contents`, { params: filters });
  return response.data;
};

export const getContentById = async (id: number) => {
  // This would be replaced with the articles endpoint in a real application
  const response = await axios.get(`${API_URL}/contents/${id}`);
  return response.data;
};

export const createContent = async (contentData: Partial<Content>) => {
  // This would be replaced with the articles endpoint in a real application
  const response = await axios.post(`${API_URL}/contents`, contentData);
  return response.data;
};

export const updateContent = async (id: number, contentData: Partial<Content>) => {
  // This would be replaced with the articles endpoint in a real application
  const response = await axios.put(`${API_URL}/contents/${id}`, contentData);
  return response.data;
};

export const deleteContent = async (id: number) => {
  // This would be replaced with the articles endpoint in a real application
  const response = await axios.delete(`${API_URL}/contents/${id}`);
  return response.data;
};

// Article API endpoints based on documentation
export const getArticles = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  category_id?: number;
  tag_id?: number;
  author_id?: number;
  published?: boolean;
}) => {
  const response = await axios.get(`${API_URL}/v1/articles/`, { params });
  return response.data;
};

export const getArticleById = async (id: number) => {
  const response = await axios.get(`${API_URL}/v1/articles/${id}`);
  return response.data;
};

export const getArticleBySlug = async (slug: string) => {
  const response = await axios.get(`${API_URL}/v1/articles/slug/${slug}`);
  return response.data;
};

export const createArticle = async (articleData: Partial<Content>) => {
  const response = await axios.post(`${API_URL}/v1/articles/`, articleData);
  return response.data;
};

export const updateArticle = async (id: number, articleData: Partial<Content>) => {
  const response = await axios.put(`${API_URL}/v1/articles/${id}`, articleData);
  return response.data;
};

export const deleteArticle = async (id: number) => {
  const response = await axios.delete(`${API_URL}/v1/articles/${id}`);
  return response.data;
};

// Article categories endpoints
export const getArticleCategories = async () => {
  const response = await axios.get(`${API_URL}/v1/articles/categories/`);
  return response.data;
};

export const getArticleCategoryById = async (id: number) => {
  const response = await axios.get(`${API_URL}/v1/articles/categories/${id}`);
  return response.data;
};

export const createArticleCategory = async (categoryData: Partial<ArticleCategory>) => {
  const response = await axios.post(`${API_URL}/v1/articles/categories/`, categoryData);
  return response.data;
};

// Article tags endpoints
export const getArticleTags = async () => {
  const response = await axios.get(`${API_URL}/v1/articles/tags/`);
  return response.data;
};

export const getArticleTagById = async (id: number) => {
  const response = await axios.get(`${API_URL}/v1/articles/tags/${id}`);
  return response.data;
};

export const createArticleTag = async (tagData: Partial<ArticleTag>) => {
  const response = await axios.post(`${API_URL}/v1/articles/tags/`, tagData);
  return response.data;
};


