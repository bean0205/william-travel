import axios from 'axios';
import { API_BASE_URL } from '@/config/appConfig';

// Types based on API documentation
export interface ArticleTag {
  id: number;
  name: string;
  status: number;
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

export interface ArticleAuthor {
  id: number;
  full_name: string;
}

export interface RelatedLocation {
  id: number;
  name: string;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category_id: number;
  tags: ArticleTag[];
  author: ArticleAuthor;
  cover_image: string;
  reading_time: number;
  related_locations: RelatedLocation[];
  published: boolean;
  published_at: string | null;
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

export interface CreateArticleRequest {
  title: string;
  summary: string;
  content: string;
  category_id: number;
  tag_ids: number[];
  cover_image: string;
  related_location_ids: number[];
  published: boolean;
}

export interface UpdateArticleRequest {
  title?: string;
  summary?: string;
  content?: string;
  category_id?: number;
  tag_ids?: number[];
  cover_image?: string;
  related_location_ids?: number[];
  published?: boolean;
}

export interface CreateArticleCategoryRequest {
  name: string;
  description: string;
  status: number;
}

export interface UpdateArticleCategoryRequest {
  name?: string;
  description?: string;
  status?: number;
}

export interface CreateArticleTagRequest {
  name: string;
  status: number;
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
const API_URL = `${API_BASE_URL}/api/v1/articles`;
const CATEGORIES_URL = `${API_URL}/categories`;
const TAGS_URL = `${API_URL}/tags`;

export const articlesApi = {
  // Article endpoints
  getArticles: async (
    page = 1,
    limit = 10,
    search?: string,
    categoryId?: number,
    tagId?: number,
    authorId?: number,
    published?: boolean
  ): Promise<PaginatedResponse<Article>> => {
    let url = `${API_URL}/?page=${page}&limit=${limit}`;

    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (categoryId) url += `&category_id=${categoryId}`;
    if (tagId) url += `&tag_id=${tagId}`;
    if (authorId) url += `&author_id=${authorId}`;
    if (published !== undefined) url += `&published=${published}`;

    const response = await axios.get(url);
    return response.data;
  },

  getArticleById: async (id: number): Promise<Article> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  getArticleBySlug: async (slug: string): Promise<Article> => {
    const response = await axios.get(`${API_URL}/slug/${slug}`);
    return response.data;
  },

  createArticle: async (article: CreateArticleRequest): Promise<Article> => {
    const response = await axios.post(API_URL, article, getAuthHeaders());
    return response.data;
  },

  updateArticle: async (id: number, article: UpdateArticleRequest): Promise<Article> => {
    const response = await axios.put(`${API_URL}/${id}`, article, getAuthHeaders());
    return response.data;
  },

  deleteArticle: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  },

  // Category endpoints
  getCategories: async (): Promise<ArticleCategory[]> => {
    const response = await axios.get(CATEGORIES_URL);
    return response.data;
  },

  getCategoryById: async (id: number): Promise<ArticleCategory> => {
    const response = await axios.get(`${CATEGORIES_URL}/${id}`);
    return response.data;
  },

  createCategory: async (category: CreateArticleCategoryRequest): Promise<ArticleCategory> => {
    const response = await axios.post(CATEGORIES_URL, category, getAuthHeaders());
    return response.data;
  },

  updateCategory: async (id: number, category: UpdateArticleCategoryRequest): Promise<ArticleCategory> => {
    const response = await axios.put(`${CATEGORIES_URL}/${id}`, category, getAuthHeaders());
    return response.data;
  },

  deleteCategory: async (id: number): Promise<void> => {
    await axios.delete(`${CATEGORIES_URL}/${id}`, getAuthHeaders());
  },

  // Tag endpoints
  getTags: async (): Promise<ArticleTag[]> => {
    const response = await axios.get(TAGS_URL);
    return response.data;
  },

  getTagById: async (id: number): Promise<ArticleTag> => {
    const response = await axios.get(`${TAGS_URL}/${id}`);
    return response.data;
  },

  createTag: async (tag: CreateArticleTagRequest): Promise<ArticleTag> => {
    const response = await axios.post(TAGS_URL, tag, getAuthHeaders());
    return response.data;
  },

  updateTag: async (id: number, tag: Partial<CreateArticleTagRequest>): Promise<ArticleTag> => {
    const response = await axios.put(`${TAGS_URL}/${id}`, tag, getAuthHeaders());
    return response.data;
  },

  deleteTag: async (id: number): Promise<void> => {
    await axios.delete(`${TAGS_URL}/${id}`, getAuthHeaders());
  }
};

export default articlesApi;
