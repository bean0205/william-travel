import apiClient from './apiClient';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

export interface Event {
  id?: string;
  name: string;
  description: string;
  category_id: number;
  organizer_id?: number;
  start_date: string;
  end_date: string;
  start_time?: string;
  end_time?: string;
  location?: {
    address: string;
    latitude: number;
    longitude: number;
  };
  region_id?: number;
  cover_image?: string;
  ticket_price?: string;
  website?: string;
  created_at?: string;
  updated_at?: string;

  // For backward compatibility
  title?: string;
  status?: 'upcoming' | 'ongoing' | 'past';
  attendees?: number;
  startDate?: string;
  endDate?: string;
  organizer?: string;
  contactInfo?: string;
  imageUrl?: string;
}

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
  logo?: string;
  website?: string;
  email?: string;
  phone?: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

// Event API endpoints based on documentation
export const getEvents = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  category_id?: number;
  organizer_id?: number;
  country_id?: number;
  region_id?: number;
  district_id?: number;
}) => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.EVENTS.BASE, { params });
    return response.data.items; // Return items array from paginated response
  } catch (error) {
    console.error('Error fetching events:', error);
    // Return empty array or throw error based on your error handling strategy
    throw error;
  }
};

export const getEventById = async (id: string) => {
  try {
    const response = await apiClient.get(`${API_ENDPOINTS.EVENTS.BASE}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching event with ID ${id}:`, error);
    throw error;
  }
};

export const createEvent = async (eventData: Partial<Event>) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.EVENTS.BASE, eventData);
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

export const updateEvent = async (id: string, eventData: Partial<Event>) => {
  try {
    const response = await apiClient.put(`${API_ENDPOINTS.EVENTS.BASE}/${id}`, eventData);
    return response.data;
  } catch (error) {
    console.error(`Error updating event with ID ${id}:`, error);
    throw error;
  }
};

export const deleteEvent = async (id: string) => {
  try {
    await apiClient.delete(`${API_ENDPOINTS.EVENTS.BASE}/${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting event with ID ${id}:`, error);
    throw error;
  }
};

// Event categories endpoints
export const getEventCategories = async () => {
  try {
    const response = await apiClient.get(`${API_ENDPOINTS.EVENTS.BASE}/categories/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching event categories:', error);
    throw error;
  }
};

export const getEventCategoryById = async (id: number) => {
  try {
    const response = await apiClient.get(`${API_ENDPOINTS.EVENTS.BASE}/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching event category with ID ${id}:`, error);
    throw error;
  }
};

export const createEventCategory = async (categoryData: Partial<EventCategory>) => {
  try {
    const response = await apiClient.post(`${API_ENDPOINTS.EVENTS.BASE}/categories/`, categoryData);
    return response.data;
  } catch (error) {
    console.error('Error creating event category:', error);
    throw error;
  }
};

// Event organizers endpoints
export const getEventOrganizers = async () => {
  try {
    const response = await apiClient.get(`${API_ENDPOINTS.EVENTS.BASE}/organizers/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching event organizers:', error);
    throw error;
  }
};

export const getEventOrganizerById = async (id: number) => {
  try {
    const response = await apiClient.get(`${API_ENDPOINTS.EVENTS.BASE}/organizers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching event organizer with ID ${id}:`, error);
    throw error;
  }
};

export const createEventOrganizer = async (organizerData: Partial<EventOrganizer>) => {
  try {
    const response = await apiClient.post(`${API_ENDPOINTS.EVENTS.BASE}/organizers/`, organizerData);
    return response.data;
  } catch (error) {
    console.error('Error creating event organizer:', error);
    throw error;
  }
};

export const updateEventOrganizer = async (id: number, organizerData: Partial<EventOrganizer>) => {
  try {
    const response = await apiClient.put(`${API_ENDPOINTS.EVENTS.BASE}/organizers/${id}`, organizerData);
    return response.data;
  } catch (error) {
    console.error(`Error updating event organizer with ID ${id}:`, error);
    throw error;
  }
};
