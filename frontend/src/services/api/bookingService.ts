import apiClient from './apiClient';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

export interface Booking {
  id: string;
  tourId: string;
  tourName: string;
  customerId: string;
  customerName: string;
  bookingDate: string;
  participants: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  totalAmount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface BookingStats {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  bookingsByMonth: {
    month: string;
    count: number;
  }[];
}

// Get bookings by guide ID
export const getBookingsByGuideId = async (guideId: string, params?: { skip?: number; limit?: number }) => {
  try {
    const response = await apiClient.get(`/v1/bookings/by-guide/${guideId}`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching bookings by guide ID:', error);
    throw error;
  }
};

// Get booking stats by guide ID
export const getBookingStatsByGuideId = async (guideId: string): Promise<BookingStats> => {
  try {
    const response = await apiClient.get(`/v1/bookings/stats/by-guide/${guideId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching booking statistics:', error);
    throw error;
  }
};

// Get booking by ID
export const getBookingById = async (id: string) => {
  try {
    const response = await apiClient.get(`/v1/bookings/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching booking with ID ${id}:`, error);
    throw error;
  }
};

// Update booking status
export const updateBookingStatus = async (id: string, status: 'pending' | 'confirmed' | 'cancelled') => {
  try {
    const response = await apiClient.put(`/v1/bookings/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating booking status for booking ID ${id}:`, error);
    throw error;
  }
};
