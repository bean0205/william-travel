// filepath: /Users/williamnguyen/Documents/william travel/frontend/src/services/api/communityPostService.ts
import apiClient from './apiClient';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

// Định nghĩa interfaces cho Community Post
export interface CommunityPost {
  id: number;
  title: string;
  content: string;
  user: {
    id: number;
    full_name: string;
  };
  location?: {
    id: number;
    name: string;
  };
  images: string[];
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
  flagged?: boolean;
  status?: 'published' | 'pending' | 'flagged';
}

// Định nghĩa interfaces cho Community Post Detail (bao gồm comments)
export interface CommunityPostDetail extends CommunityPost {
  comments: PostComment[];
}

// Định nghĩa interfaces cho Post Comment
export interface PostComment {
  id: number;
  content: string;
  user: {
    id: number;
    full_name: string;
  };
  created_at: string;
}

// Định nghĩa interfaces cho Post Like Response
export interface PostLikeResponse {
  liked: boolean;
  likes_count: number;
}

// Định nghĩa interfaces cho pagination response
export interface PaginationResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// Community Post endpoints
export const getCommunityPosts = async (params?: {
  page?: number;
  limit?: number;
  user_id?: number | string;
  location_id?: number | string;
  search?: string;
  sort_by?: string;
  sort_order?: string;
  flagged?: boolean;
  status?: string;
  start_date?: string;
  end_date?: string;
}): Promise<PaginationResponse<CommunityPost>> => {
  const response = await apiClient.get(API_ENDPOINTS.COMMUNITY.POSTS, { params });
  return response.data;
};

export const getCommunityPostById = async (id: number): Promise<CommunityPostDetail> => {
  const response = await apiClient.get(API_ENDPOINTS.COMMUNITY.POST_DETAIL(id));
  return response.data;
};

export const createCommunityPost = async (postData: {
  title: string;
  content: string;
  location_id?: number;
  image_ids?: number[];
}) => {
  const response = await apiClient.post(API_ENDPOINTS.COMMUNITY.POSTS, postData);
  return response.data;
};

export const updateCommunityPost = async (id: number, postData: {
  title?: string;
  content?: string;
  location_id?: number;
  image_ids?: number[];
  status?: 'published' | 'pending' | 'flagged';
}) => {
  const response = await apiClient.put(API_ENDPOINTS.COMMUNITY.POST_DETAIL(id), postData);
  return response.data;
};

export const updatePostStatus = async (id: number, status: 'published' | 'pending' | 'flagged'): Promise<CommunityPost> => {
  const response = await apiClient.patch(`${API_ENDPOINTS.COMMUNITY.POST_DETAIL(id)}/status`, { status });
  return response.data;
};

export const deleteCommunityPost = async (id: number) => {
  const response = await apiClient.delete(API_ENDPOINTS.COMMUNITY.POST_DETAIL(id));
  return response.data;
};

// Thích/bỏ thích bài đăng
export const togglePostLike = async (postId: number): Promise<PostLikeResponse> => {
  const response = await apiClient.post(API_ENDPOINTS.COMMUNITY.LIKE_POST(postId));
  return response.data;
};

// Thêm bình luận vào bài đăng
export const addPostComment = async (postId: number, content: string): Promise<PostComment> => {
  const response = await apiClient.post(API_ENDPOINTS.COMMUNITY.POST_COMMENTS(postId), { content });
  return response.data;
};

// Xóa bình luận từ bài đăng
export const deletePostComment = async (postId: number, commentId: number): Promise<void> => {
  await apiClient.delete(`${API_ENDPOINTS.COMMUNITY.POST_COMMENTS(postId)}/${commentId}`);
};
