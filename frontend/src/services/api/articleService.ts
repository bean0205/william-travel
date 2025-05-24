import apiClient from './apiClient';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

// Cập nhật interface Article để phù hợp với API document
export interface Article {
  id: number;
  title: string;
  slug: string;
  summary?: string;
  content: string;
  category_id: number;
  tags?: ArticleTag[];
  author: {
    id: number;
    full_name: string;
  };
  cover_image?: string;
  reading_time?: number;
  related_locations?: Array<{
    id: number;
    name: string;
  }>;
  published: boolean;
  published_at?: string;
  status: 'published' | 'draft' | 'archived';
  views: number;
  created_at: string;
  updated_at: string;
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

// Article endpoints
export const getArticles = async (filters?: Record<string, unknown>) => {
  const response = await apiClient.get(API_ENDPOINTS.CONTENT.ARTICLES, { params: filters });
  return response.data;
};

export const getArticleById = async (id: number) => {
  const response = await apiClient.get(API_ENDPOINTS.CONTENT.ARTICLE_BY_ID(id));
  return response.data;
};

// Thêm hàm lấy article theo slug
export const getArticleBySlug = async (slug: string) => {
  const response = await apiClient.get(API_ENDPOINTS.CONTENT.ARTICLE_BY_SLUG(slug));
  return response.data;
};

export const createArticle = async (articleData: Omit<Article, 'id' | 'views' | 'created_at' | 'updated_at' | 'slug' | 'author' | 'tags'>) => {
  const response = await apiClient.post(API_ENDPOINTS.CONTENT.ARTICLES, articleData);
  return response.data;
};

export const updateArticle = async (id: number, articleData: Partial<Article>) => {
  const response = await apiClient.put(API_ENDPOINTS.CONTENT.ARTICLE_BY_ID(id), articleData);
  return response.data;
};

export const deleteArticle = async (id: number) => {
  const response = await apiClient.delete(API_ENDPOINTS.CONTENT.ARTICLE_BY_ID(id));
  return response.data;
};

// Article Categories endpoints
export const getArticleCategories = async () => {
  const response = await apiClient.get(API_ENDPOINTS.CONTENT.ARTICLE_CATEGORIES);
  return response.data;
};

export const getArticleCategoryById = async (id: number) => {
  const response = await apiClient.get(API_ENDPOINTS.CONTENT.ARTICLE_CATEGORY_BY_ID(id));
  return response.data;
};

export const createArticleCategory = async (categoryData: Partial<ArticleCategory>) => {
  const response = await apiClient.post(API_ENDPOINTS.CONTENT.ARTICLE_CATEGORIES, categoryData);
  return response.data;
};

export const updateArticleCategory = async (id: number, categoryData: Partial<ArticleCategory>) => {
  const response = await apiClient.put(API_ENDPOINTS.CONTENT.ARTICLE_CATEGORY_BY_ID(id), categoryData);
  return response.data;
};

export const deleteArticleCategory = async (id: number) => {
  const response = await apiClient.delete(API_ENDPOINTS.CONTENT.ARTICLE_CATEGORY_BY_ID(id));
  return response.data;
};

// Article Tags endpoints
export const getArticleTags = async () => {
  const response = await apiClient.get(API_ENDPOINTS.CONTENT.ARTICLE_TAGS);
  return response.data;
};

export const getArticleTagById = async (id: number) => {
  const response = await apiClient.get(API_ENDPOINTS.CONTENT.ARTICLE_TAG_BY_ID(id));
  return response.data;
};

export const createArticleTag = async (tagData: Partial<ArticleTag>) => {
  const response = await apiClient.post(API_ENDPOINTS.CONTENT.ARTICLE_TAGS, tagData);
  return response.data;
};

export const updateArticleTag = async (id: number, tagData: Partial<ArticleTag>) => {
  const response = await apiClient.put(API_ENDPOINTS.CONTENT.ARTICLE_TAG_BY_ID(id), tagData);
  return response.data;
};

export const deleteArticleTag = async (id: number) => {
  const response = await apiClient.delete(API_ENDPOINTS.CONTENT.ARTICLE_TAG_BY_ID(id));
  return response.data;
};
