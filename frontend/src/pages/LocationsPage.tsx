import { useEffect, useState } from 'react';
import { useLocationsStore } from '@/store/locationsStore';
import LocationCard from '@/components/features/locations/LocationCard';
import LocationsFilter from '@/components/features/locations/LocationsFilter';

const LocationsPage = () => {
  const { locations, fetchLocations, isLoading } = useLocationsStore();
  const [filter, setFilter] = useState({
    category: 'all',
    searchQuery: '',
  });

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const filteredLocations = locations.filter((location) => {
    const matchesCategory = 
      filter.category === 'all' || location.category === filter.category;
    const matchesSearch = 
      location.name.toLowerCase().includes(filter.searchQuery.toLowerCase()) ||
      location.description.toLowerCase().includes(filter.searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <h1 className="mb-8 text-4xl font-bold">Explore Amazing Destinations</h1>
      
      <LocationsFilter filter={filter} onFilterChange={setFilter} />
      
      {isLoading ? (
        <div className="flex justify-center pt-12">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredLocations.length > 0 ? (
            filteredLocations.map((location) => (
              <LocationCard key={location.id} location={location} />
            ))
          ) : (
            <div className="col-span-full py-16 text-center">
              <h3 className="text-xl font-medium">No locations found</h3>
              <p className="mt-2 text-gray-600">Try adjusting your filters</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationsPage;
