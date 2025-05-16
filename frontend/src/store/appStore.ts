import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { getLocations } from '@/services/api/locationService';

type AppState = {
  user: any | null;
  isLoading: boolean;
  error: string | null;
  featuredLocations: any[];
  fetchFeaturedLocations: () => Promise<void>;
  setUser: (user: any | null) => void;
};

export const useAppStore = create<AppState>()(
  devtools((set) => ({
    user: null,
    isLoading: false,
    error: null,
    featuredLocations: [],
    
    fetchFeaturedLocations: async () => {
      try {
        set({ isLoading: true, error: null });
        const locations = await getLocations({ featured: true });
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
