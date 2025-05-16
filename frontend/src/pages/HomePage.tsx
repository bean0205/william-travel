import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '@/store/appStore';
import HeroSection from '@/components/features/home/HeroSection';
import FeaturedLocations from '@/components/features/locations/FeaturedLocations';

const HomePage = () => {
  const { fetchFeaturedLocations, isLoading } = useAppStore();

  useEffect(() => {
    fetchFeaturedLocations();
  }, [fetchFeaturedLocations]);

  return (
    <div>
      <HeroSection />
      
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="mb-8 text-3xl font-bold text-center">Featured Destinations</h2>
          
          {isLoading ? (
            <div className="flex justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
            </div>
          ) : (
            <FeaturedLocations />
          )}
          
          <div className="mt-12 text-center">
            <Link to="/locations" className="btn btn-primary">
              View All Destinations
            </Link>
          </div>
        </div>
      </section>
      
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="mb-4 text-3xl font-bold">Plan Your Next Adventure</h2>
              <p className="mb-6 text-lg text-gray-600">
                Discover amazing places, create customized itineraries, and explore interactive maps.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/map" className="btn btn-primary">
                  Explore Map
                </Link>
                <Link to="/guides" className="btn btn-secondary">
                  View Travel Guides
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="rounded-lg bg-white p-8 shadow-lg">
                <h3 className="mb-2 text-xl font-bold">Get Started Today</h3>
                <p className="mb-6 text-gray-600">
                  Create an account to save your favorite destinations and track your travels.
                </p>
                <button className="btn btn-primary w-full">Sign Up Now</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
