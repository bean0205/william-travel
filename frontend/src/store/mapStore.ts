import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { getMapLocations } from '@/services/api/mapService';

type MapState = {
  mapLocations: any[];
  isLoading: boolean;
  error: string | null;
  fetchMapLocations: (params?: Record<string, any>) => Promise<void>;
};

export const useMapStore = create<MapState>()(
  devtools((set) => ({
    mapLocations: [],
    isLoading: false,
    error: null,
    
    fetchMapLocations: async (params = {}) => {
      try {
        set({ isLoading: true, error: null });
        const locations = await getMapLocations(params);
        set({ mapLocations: locations, isLoading: false });
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to fetch map locations', 
          isLoading: false 
        });
      }
    },
  }))
);
