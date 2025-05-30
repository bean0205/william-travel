import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { getGuides } from '@/services/api/guideService';

type GuidesState = {
  guides: any[];
  isLoading: boolean;
  error: string | null;
  fetchGuides: (params?: Record<string, any>) => Promise<void>;
};

export const useGuidesStore = create<GuidesState>()(
  devtools((set) => ({
    guides: [],
    isLoading: false,
    error: null,
    
    fetchGuides: async (params = {}) => {
      try {
        set({ isLoading: true, error: null });
        const guides = await getGuides(params);
        set({ guides, isLoading: false });
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to fetch guides', 
          isLoading: false 
        });
      }
    },
  }))
);
