import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  getLocations,
  getPaginatedLocations,
  LocationsParams,
  LocationsResponse
} from '@/services/api/locationService';

// Define the locations data structure based on what getLocations returns
type LocationsData = {
  continents?: any[];
  countries?: any[];
  regions?: any[];
  districts?: any[];
  wards?: any[];
  categories?: any[];
};

type LocationsState = {
  // Original locations data structure
  locations: LocationsData;
  // New paginated locations data
  paginatedLocations: LocationsResponse | null;
  isLoading: boolean;
  error: string | null;
  // Original fetch function
  fetchLocations: (params?: Record<string, any>) => Promise<void>;
  // New fetch function for paginated locations
  fetchPaginatedLocations: (params: LocationsParams) => Promise<void>;
};

export const useLocationsStore = create<LocationsState>()(
  devtools((set) => ({
    locations: {},
    paginatedLocations: null,
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

    fetchPaginatedLocations: async (params: LocationsParams) => {
      try {
        set({ isLoading: true, error: null });
        const paginatedLocations = await getPaginatedLocations(params);
        set({ paginatedLocations, isLoading: false });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to fetch paginated locations',
          isLoading: false
        });
      }
    },
  }))
);
