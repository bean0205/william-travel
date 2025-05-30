import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/appStore';
import { useCountryStore } from '@/store/countryStore';
import { PageTransition, AnimateElement } from '@/components/common/PageTransition';
import { AccommodationSection } from '@/components/features/accommodations/AccommodationSection';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Building, 
  Filter, 
  MapPin, 
  Search,
  Bookmark,
  SlidersHorizontal,
  BedDouble
} from 'lucide-react';

// Types
interface FilterOptions {
  type: string;
  priceRange: string;
  amenities: string[];
  sortBy: 'popular' | 'price-low' | 'price-high' | 'rating';
}

const AccommodationsPage = () => {
  const { selectedCountry, isCountrySelected } = useCountryStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState<string | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    type: 'All',
    priceRange: 'All',
    amenities: [],
    sortBy: 'popular'
  });

  // Sample accommodation types and amenities for filter
  const accommodationTypes = ['All', 'Hotel', 'Homestay', 'Apartment', 'Resort', 'Villa', 'Hostel'];
  const priceRanges = ['All', 'Budget', 'Mid-range', 'Luxury'];
  const amenitiesList = [
    'Free Wifi', 'Pool', 'Restaurant', 'Parking', 'Spa', 'Air Conditioning',
    'Kitchen', 'Breakfast Included', 'Pet Friendly', 'Private Beach', 'Gym'
  ];
  const sortOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' }
  ];

  // Check if country is selected
  useEffect(() => {
    if (!isCountrySelected) {
      navigate('/');
    }
  }, [isCountrySelected, navigate]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle filter changes
  const handleTypeChange = (type: string) => {
    setFilters({ ...filters, type });
  };

  const handlePriceChange = (priceRange: string) => {
    setFilters({ ...filters, priceRange });
  };

  const handleAmenityToggle = (amenity: string) => {
    const updatedAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    
    setFilters({ ...filters, amenities: updatedAmenities });
  };

  const handleSortChange = (sortBy: 'popular' | 'price-low' | 'price-high' | 'rating') => {
    setFilters({ ...filters, sortBy });
  };

  // Reset all filters
  const handleResetFilters = () => {
    setFilters({
      type: 'All',
      priceRange: 'All',
      amenities: [],
      sortBy: 'popular'
    });
    setSearchQuery('');
  };

  if (!selectedCountry) return null;

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Decorative floating elements for background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="bg-primary/10 animate-float absolute -left-20 top-[10%] h-40 w-40 rounded-full blur-3xl"></div>
          <div
            className="animate-float absolute -right-20 top-[30%] h-60 w-60 rounded-full bg-indigo-600/10 blur-3xl"
            style={{ animationDelay: '2s' }}
          ></div>
        </div>

        {/* Page Header */}
        <section className="relative pt-16 pb-8 md:pt-24 md:pb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AnimateElement animation="fade-down" delay={0.1}>
              <h1 className="text-3xl font-bold tracking-tight mb-2 md:text-4xl lg:text-5xl">
                <span className="flex items-center gap-3">
                  <Building className="h-8 w-8 text-primary" />
                  Accommodations in {selectedCountry.name}
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl">
                Find the perfect place to stay - from luxury hotels to authentic homestays and budget-friendly options.
              </p>
            </AnimateElement>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="py-6 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AnimateElement animation="fade-up" delay={0.2}>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search accommodations, locations, or amenities..."
                    className="pl-10 h-12"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant={location ? "default" : "outline"} 
                    className="h-12 px-4 flex items-center gap-2"
                  >
                    <MapPin className="h-4 w-4" />
                    {location || "Set Location"}
                  </Button>
                  <Button 
                    variant={showAdvancedFilters ? "secondary" : "outline"} 
                    className="h-12 w-12 p-0 flex items-center justify-center"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  >
                    <SlidersHorizontal className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Advanced Filters */}
              {showAdvancedFilters && (
                <Card className="mt-4 border border-muted/40 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                      {/* Accommodation Types */}
                      <div>
                        <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                          <BedDouble className="h-4 w-4 text-primary" />
                          Property Type
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {accommodationTypes.map(type => (
                            <Badge 
                              key={type}
                              variant={filters.type === type ? "default" : "outline"}
                              className="cursor-pointer"
                              onClick={() => handleTypeChange(type)}
                            >
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Price Ranges */}
                      <div>
                        <h3 className="text-sm font-medium mb-3">Price Range</h3>
                        <div className="flex flex-wrap gap-2">
                          {priceRanges.map(price => (
                            <Badge 
                              key={price}
                              variant={filters.priceRange === price ? "default" : "outline"}
                              className="cursor-pointer"
                              onClick={() => handlePriceChange(price)}
                            >
                              {price}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Amenities */}
                      <div>
                        <h3 className="text-sm font-medium mb-3">Amenities</h3>
                        <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto custom-scrollbar">
                          {amenitiesList.map(amenity => (
                            <Badge 
                              key={amenity}
                              variant={filters.amenities.includes(amenity) ? "default" : "outline"}
                              className="cursor-pointer"
                              onClick={() => handleAmenityToggle(amenity)}
                            >
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Sort Options */}
                      <div>
                        <h3 className="text-sm font-medium mb-3">Sort By</h3>
                        <div className="flex flex-wrap gap-2">
                          {sortOptions.map(option => (
                            <Badge 
                              key={option.value}
                              variant={filters.sortBy === option.value ? "default" : "outline"}
                              className="cursor-pointer"
                              onClick={() => handleSortChange(option.value as any)}
                            >
                              {option.label}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end mt-6">
                      <Button variant="outline" size="sm" className="mr-2" onClick={handleResetFilters}>
                        Reset All
                      </Button>
                      <Button size="sm">Apply Filters</Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </AnimateElement>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AnimateElement animation="fade" delay={0.3}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">All Accommodations</h2>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <Bookmark className="h-4 w-4" />
                  Saved
                </Button>
              </div>

              {/* Main Accommodation Section */}
              <AccommodationSection 
                countryName={selectedCountry.name} 
                location={location || undefined}
              />
            </AnimateElement>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default AccommodationsPage;
