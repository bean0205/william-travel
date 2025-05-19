import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { getLocations } from '@/services/api/locationService';

type LocationsState = {
  locations: any[];
  isLoading: boolean;
  error: string | null;
  fetchLocations: (params?: Record<string, any>) => Promise<void>;
};

export const useLocationsStore = create<LocationsState>()(
  devtools((set) => ({
    locations: [],
    isLoading: false,
    error: null,
    
    fetchLocations: async (params = {}) => {
      try {
        set({ isLoading: true, error: null });
        const locations = await getLocations(params);
        set({ locations, isLoading: false });
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to fetch locations', 
          isLoading: false 
        });
      }
    },
  }))
);
