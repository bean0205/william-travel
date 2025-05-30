import { useEffect, useState } from 'react';
import { useLocationsStore } from '@/store/locationsStore';
import { useCountryStore } from '@/store/countryStore';
import LocationCard from '@/components/features/locations/LocationCard';
import LocationsFilter from '@/components/features/locations/LocationsFilter';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

const LocationsPage = () => {
  const { paginatedLocations, fetchPaginatedLocations, isLoading } = useLocationsStore();
  const { selectedCountry } = useCountryStore();
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(null);

  const [filter, setFilter] = useState({
    searchQuery: '',
    countryId: null as number | null,
    regionId: null as number | null,
    districtId: null as number | null,
    categoryId: null as number | null,
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
  });

  // Effect to set the country ID based on the selected country
  useEffect(() => {
    if (selectedCountry) {
      // In a real app, you would fetch the country ID by code from your API
      // For this demo, we're using a simplified approach
      const getCountryIdByCode = async (code: string) => {
        try {
          // Mock function - replace with actual API call
          const mockId = code === 'VN' ? 1 : code.charCodeAt(0) + code.charCodeAt(1);
          setSelectedCountryId(mockId);
          setFilter(prev => ({ ...prev, countryId: mockId }));
        } catch (error) {
          console.error('Failed to get country ID:', error);
        }
      };

      getCountryIdByCode(selectedCountry.code);
    }
  }, [selectedCountry]);

  // Effect to fetch locations when filters or pagination changes
  useEffect(() => {
    const params = {
      page: pagination.page,
      limit: pagination.limit,
      search: filter.searchQuery || undefined,
      country_id: filter.countryId || undefined,
      region_id: filter.regionId || undefined,
      district_id: filter.districtId || undefined,
      category_id: filter.categoryId || undefined,
    };

    fetchPaginatedLocations(params);
  }, [
    fetchPaginatedLocations,
    filter.searchQuery,
    filter.countryId,
    filter.regionId,
    filter.districtId,
    filter.categoryId,
    pagination.page,
    pagination.limit
  ]);

  // Handle filter changes
  const handleFilterChange = (newFilter: typeof filter) => {
    setFilter(newFilter);
    // Reset to page 1 when filters change
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Handle pagination
  const handleNextPage = () => {
    if (paginatedLocations && pagination.page < paginatedLocations.totalPages) {
      setPagination(prev => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const handlePrevPage = () => {
    if (pagination.page > 1) {
      setPagination(prev => ({ ...prev, page: prev.page - 1 }));
    }
  };

  const locationItems = paginatedLocations?.items || [];
  const totalPages = paginatedLocations?.totalPages || 0;

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <h1 className="mb-8 text-4xl font-bold">
        {selectedCountry ? `Explore ${selectedCountry.name}` : 'Explore Amazing Destinations'}
      </h1>

      <LocationsFilter
        filter={filter}
        onFilterChange={handleFilterChange}
        isCountrySelected={!!selectedCountry}
        selectedCountry={selectedCountry}
      />

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : locationItems.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-lg">No locations found matching your criteria.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {locationItems.map((location) => (
              <LocationCard key={location.id} location={location} />
            ))}
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrevPage}
                disabled={pagination.page === 1}
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>

              <span className="text-muted-foreground">
                Page {pagination.page} of {totalPages}
              </span>

              <Button
                variant="outline"
                size="icon"
                onClick={handleNextPage}
                disabled={pagination.page >= totalPages}
              >
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LocationsPage;

