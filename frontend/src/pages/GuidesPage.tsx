import { useEffect } from 'react';
import { useGuidesStore } from '@/store/guidesStore';
import GuideCard from '@/components/features/guides/GuideCard';

const GuidesPage = () => {
  const { guides, fetchGuides, isLoading } = useGuidesStore();

  useEffect(() => {
    fetchGuides();
  }, [fetchGuides]);

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <h1 className="mb-8 text-4xl font-bold">Travel Guides</h1>
      
      <div className="mb-12 max-w-3xl">
        <p className="text-lg text-gray-600">
          Discover expert tips, itineraries, and recommendations for your next adventure. 
          Our travel guides provide insights from local experts and seasoned travelers.
        </p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center pt-12">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {guides.length > 0 ? (
            guides.map((guide) => (
              <GuideCard key={guide.id} guide={guide} />
            ))
          ) : (
            <div className="col-span-full py-16 text-center">
              <h3 className="text-xl font-medium">No guides found</h3>
              <p className="mt-2 text-gray-600">Please check back later for new guides</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GuidesPage;
