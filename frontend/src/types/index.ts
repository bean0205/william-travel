// Common types used across the application

// Location type
export interface Location {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  rating: number;
  latitude?: number;
  longitude?: number;
  address?: string;
  phone?: string;
  website?: string;
  featured?: boolean;
}

// Guide type
export interface Guide {
  id: string;
  title: string;
  author: string;
  category: string;
  excerpt: string;
  content?: string;
  imageUrl: string;
  date: string;
}

// User type
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  favorites?: string[]; // Location IDs
}

// API response types
export interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
}

// Filter types
export interface LocationsFilter {
  category?: string;
  searchQuery?: string;
  minRating?: number;
}

export interface MapFilter {
  radius?: number;
  categories?: string[];
}

export interface GuidesFilter {
  category?: string;
  searchQuery?: string;
}

// Generic state types for stores
export interface BaseState {
  isLoading: boolean;
  error: string | null;
}
