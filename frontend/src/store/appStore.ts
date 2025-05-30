import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { getLocations } from '@/services/api/locationService';
import { useCountryStore } from './countryStore';

type AppState = {
  user: any | null;
  isLoading: boolean;
  error: string | null;
  featuredLocations: any[];
  fetchFeaturedLocations: (countryCode?: string) => Promise<void>;
  setUser: (user: any | null) => void;
};

export const useAppStore = create<AppState>()(
  devtools((set) => ({
    user: null,
    isLoading: false,
    error: null,
    featuredLocations: [],
    
    fetchFeaturedLocations: async (countryCode?: string) => {
      try {
        set({ isLoading: true, error: null });
        const params: Record<string, any> = { featured: true };
        
        // If countryCode is provided, filter by it
        if (countryCode) {
          params.countryCode = countryCode;
        }
        
        const locations = await getLocations(params);
        set({ featuredLocations: locations, isLoading: false });
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to fetch featured locations', 
          isLoading: false 
        });
      }
    },
    
    setUser: (user) => set({ user }),
  }))
);
