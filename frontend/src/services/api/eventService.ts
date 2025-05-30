// filepath: /Users/williamnguyen/Documents/william travel/frontend/src/services/api/eventService.ts
import apiClient from './apiClient';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

// Định nghĩa interfaces cho Event
export interface Event {
  id: number;
  name: string;
  description: string;
  category_id: number;
  organizer_id: number;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  region_id: number;
  cover_image?: string;
  ticket_price?: string;
  website?: string;
  created_at: string;
  updated_at: string;
  status?: 'upcoming' | 'ongoing' | 'past' | string; // Derived field for UI
  category?: EventCategory;
  organizer?: EventOrganizer;
  images?: string[];
}

// Định nghĩa interfaces cho Event Category
export interface EventCategory {
  id: number;
  name: string;
  description: string;
  status: number;
  created_at: string;
  updated_at: string;
}

// Định nghĩa interfaces cho Event Organizer
export interface EventOrganizer {
  id: number;
  name: string;
  description: string;
  logo?: string;
  website?: string;
  email: string;
  phone?: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

// Định nghĩa interfaces cho pagination response
export interface PaginationResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// Event endpoints
export const getEvents = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  category_id?: number;
  organizer_id?: number;
  country_id?: number;
  region_id?: number;
  district_id?: number;
  status?: string;
  sort_by?: string;
  sort_order?: string;
}): Promise<PaginationResponse<Event>> => {
  const response = await apiClient.get(API_ENDPOINTS.EVENTS.BASE, { params });
  return response.data;
};

export const getEventById = async (id: number): Promise<Event> => {
  const response = await apiClient.get(API_ENDPOINTS.EVENTS.DETAIL(id));
  return response.data;
};

export const createEvent = async (eventData: Omit<Event, 'id' | 'created_at' | 'updated_at'>) => {
  const response = await apiClient.post(API_ENDPOINTS.EVENTS.BASE, eventData);
  return response.data;
};

export const updateEvent = async (id: number, eventData: Partial<Event>) => {
  const response = await apiClient.put(API_ENDPOINTS.EVENTS.DETAIL(id), eventData);
  return response.data;
};

export const deleteEvent = async (id: number) => {
  const response = await apiClient.delete(API_ENDPOINTS.EVENTS.DETAIL(id));
  return response.data;
};

// Event Categories endpoints
export const getEventCategories = async () => {
  const response = await apiClient.get(API_ENDPOINTS.EVENTS.CATEGORIES);
  return response.data;
};

export const getEventCategoryById = async (id: number): Promise<EventCategory> => {
  const response = await apiClient.get(API_ENDPOINTS.EVENTS.CATEGORY_DETAIL(id));
  return response.data;
};

export const createEventCategory = async (categoryData: Omit<EventCategory, 'id' | 'created_at' | 'updated_at'>) => {
  const response = await apiClient.post(API_ENDPOINTS.EVENTS.CATEGORIES, categoryData);
  return response.data;
};

export const updateEventCategory = async (id: number, categoryData: Partial<EventCategory>) => {
  const response = await apiClient.put(API_ENDPOINTS.EVENTS.CATEGORY_DETAIL(id), categoryData);
  return response.data;
};

export const deleteEventCategory = async (id: number) => {
  const response = await apiClient.delete(API_ENDPOINTS.EVENTS.CATEGORY_DETAIL(id));
  return response.data;
};

// Event Organizers endpoints
export const getEventOrganizers = async () => {
  const response = await apiClient.get(API_ENDPOINTS.EVENTS.ORGANIZERS);
  return response.data;
};

export const getEventOrganizerById = async (id: number): Promise<EventOrganizer> => {
  const response = await apiClient.get(API_ENDPOINTS.EVENTS.ORGANIZER_DETAIL(id));
  return response.data;
};

export const createEventOrganizer = async (organizerData: Omit<EventOrganizer, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
  const response = await apiClient.post(API_ENDPOINTS.EVENTS.ORGANIZERS, organizerData);
  return response.data;
};

export const updateEventOrganizer = async (id: number, organizerData: Partial<EventOrganizer>) => {
  const response = await apiClient.put(API_ENDPOINTS.EVENTS.ORGANIZER_DETAIL(id), organizerData);
  return response.data;
};

export const deleteEventOrganizer = async (id: number) => {
  const response = await apiClient.delete(API_ENDPOINTS.EVENTS.ORGANIZER_DETAIL(id));
  return response.data;
};
