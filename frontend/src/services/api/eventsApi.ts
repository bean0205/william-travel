import axios from 'axios';
import { API_BASE_URL } from '@/config/appConfig';

// Types based on API documentation
export interface EventCategory {
  id: number;
  name: string;
  description: string;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface EventOrganizer {
  id: number;
  name: string;
  description: string;
  logo: string;
  website: string;
  email: string;
  phone: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface EventLocation {
  address: string;
  latitude: number;
  longitude: number;
}

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
  location: EventLocation;
  region_id: number;
  cover_image: string;
  ticket_price: string;
  website: string;
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

export interface CreateEventRequest {
  name: string;
  description: string;
  category_id: number;
  organizer_id: number;
  start_date: string;
  end_date: string;
  start_time?: string;
  end_time?: string;
  location: EventLocation;
  region_id: number;
  cover_image?: string;
  ticket_price?: string;
  website?: string;
}

export interface UpdateEventRequest {
  name?: string;
  description?: string;
  category_id?: number;
  start_date?: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  location?: EventLocation;
  region_id?: number;
  cover_image?: string;
  ticket_price?: string;
  website?: string;
}

export interface CreateEventOrganizerRequest {
  name: string;
  description: string;
  logo?: string;
  website?: string;
  email: string;
  phone: string;
}

export interface UpdateEventOrganizerRequest {
  name?: string;
  description?: string;
  logo?: string;
  website?: string;
  email?: string;
  phone?: string;
}

export interface CreateEventCategoryRequest {
  name: string;
  description: string;
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
const API_URL = `${API_BASE_URL}/api/v1/events`;
const CATEGORIES_URL = `${API_URL}/categories`;
const ORGANIZERS_URL = `${API_URL}/organizers`;

export const eventsApi = {
  // Event endpoints
  getEvents: async (
    page = 1,
    limit = 10,
    search?: string,
    categoryId?: number,
    organizerId?: number,
    countryId?: number,
    regionId?: number,
    districtId?: number
  ): Promise<PaginatedResponse<Event>> => {
    let url = `${API_URL}/?page=${page}&limit=${limit}`;

    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (categoryId) url += `&category_id=${categoryId}`;
    if (organizerId) url += `&organizer_id=${organizerId}`;
    if (countryId) url += `&country_id=${countryId}`;
    if (regionId) url += `&region_id=${regionId}`;
    if (districtId) url += `&district_id=${districtId}`;

    const response = await axios.get(url);
    return response.data;
  },

  getEventById: async (id: number): Promise<Event> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  createEvent: async (event: CreateEventRequest): Promise<Event> => {
    const response = await axios.post(API_URL, event, getAuthHeaders());
    return response.data;
  },

  updateEvent: async (id: number, event: UpdateEventRequest): Promise<Event> => {
    const response = await axios.put(`${API_URL}/${id}`, event, getAuthHeaders());
    return response.data;
  },

  deleteEvent: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  },

  // Category endpoints
  getCategories: async (): Promise<EventCategory[]> => {
    const response = await axios.get(CATEGORIES_URL);
    return response.data;
  },

  getCategoryById: async (id: number): Promise<EventCategory> => {
    const response = await axios.get(`${CATEGORIES_URL}/${id}`);
    return response.data;
  },

  createCategory: async (category: CreateEventCategoryRequest): Promise<EventCategory> => {
    const response = await axios.post(CATEGORIES_URL, category, getAuthHeaders());
    return response.data;
  },

  updateCategory: async (id: number, category: Partial<CreateEventCategoryRequest>): Promise<EventCategory> => {
    const response = await axios.put(`${CATEGORIES_URL}/${id}`, category, getAuthHeaders());
    return response.data;
  },

  deleteCategory: async (id: number): Promise<void> => {
    await axios.delete(`${CATEGORIES_URL}/${id}`, getAuthHeaders());
  },

  // Organizer endpoints
  getOrganizers: async (): Promise<EventOrganizer[]> => {
    const response = await axios.get(ORGANIZERS_URL, getAuthHeaders());
    return response.data;
  },

  getOrganizerById: async (id: number): Promise<EventOrganizer> => {
    const response = await axios.get(`${ORGANIZERS_URL}/${id}`, getAuthHeaders());
    return response.data;
  },

  createOrganizer: async (organizer: CreateEventOrganizerRequest): Promise<EventOrganizer> => {
    const response = await axios.post(ORGANIZERS_URL, organizer, getAuthHeaders());
    return response.data;
  },

  updateOrganizer: async (id: number, organizer: UpdateEventOrganizerRequest): Promise<EventOrganizer> => {
    const response = await axios.put(`${ORGANIZERS_URL}/${id}`, organizer, getAuthHeaders());
    return response.data;
  },

  deleteOrganizer: async (id: number): Promise<void> => {
    await axios.delete(`${ORGANIZERS_URL}/${id}`, getAuthHeaders());
  }
};

export default eventsApi;
