import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/appStore';
import { useCountryStore } from '@/store/countryStore';
import { AnimateElement } from '@/components/common/PageTransition';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LocationSelector } from '@/components/features/locations/LocationSelector';
import { EventsCarousel } from '@/components/features/events/EventsCarousel';
import {
  Search,
  ChevronRight,
  MapPin,
  CalendarDays,
  Compass,
  PlaneTakeoff,
  Globe,
  Building,
  Palmtree,
  Mountain,
  Sailboat,
  Heart,
  Star,
  ArrowRight,
  MapPinned,
  Filter,
  X,
  Map,
  Home,
} from 'lucide-react';

// Custom scrollbar styles
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 5px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 10px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 10px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.3);
  }

  /* For Firefox */
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.2) rgba(0, 0, 0, 0.05);
  }

  .dark .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
  }
  
  .dark .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
  }
  
  .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  .dark .custom-scrollbar {
    scrollbar-color: rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.05);
  }

  /* Animation keyframes */
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }

  @keyframes pulse {
    0% { opacity: 0.6; }
    50% { opacity: 1; }
    100% { opacity: 0.6; }
  }

  @keyframes slideInFromBottom {
    0% { transform: translateY(30px); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
  }

  .animate-float {
    animation: float 6s ease-in-out infinite;
  }

  .animate-pulse-slow {
    animation: pulse 3s ease-in-out infinite;
  }

  .animate-slide-in {
    animation: slideInFromBottom 0.5s ease-out forwards;
  }
`;

// Sample travel categories
const travelCategories = [
  {
    id: 'cultural',
    name: 'Cultural',
    icon: <Building className="h-5 w-5" />,
    color: 'from-purple-500 to-indigo-600',
    image:
      'https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=400',
  },
  {
    id: 'beaches',
    name: 'Beaches',
    icon: <Palmtree className="h-5 w-5" />,
    color: 'from-cyan-500 to-blue-600',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400',
  },
  {
    id: 'mountains',
    name: 'Mountains',
    icon: <Mountain className="h-5 w-5" />,
    color: 'from-green-500 to-emerald-600',
    image:
      'https://images.unsplash.com/photo-1491555103944-7c647fd857e6?q=80&w=400',
  },
  {
    id: 'islands',
    name: 'Islands',
    icon: <Sailboat className="h-5 w-5" />,
    color: 'from-amber-500 to-orange-600',
    image:
      'https://images.unsplash.com/photo-1516091877493-bf6e132b91a3?q=80&w=400',
  },
];

const mockEvents = [
  {
    id: '1',
    title: 'Cultural Festival 2025',
    description:
      'Experience the rich cultural heritage through music, dance, and traditional arts.',
    location: 'City Center Square',
    startDate: new Date('2025-05-20T10:00:00'),
    endDate: new Date('2025-05-25T22:00:00'),
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3',
    status: 'upcoming' as const,
  },
  {
    id: '2',
    title: 'Food & Wine Festival',
    description:
      'Discover local cuisine and wine tasting from top restaurants and wineries.',
    location: 'Riverside Park',
    startDate: new Date('2025-05-19T11:00:00'),
    endDate: new Date('2025-05-19T23:00:00'),
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1',
    status: 'ongoing' as const,
  },
  {
    id: '3',
    title: 'Summer Music Festival',
    description:
      'Three days of live music performances from local and international artists.',
    location: 'Beach Amphitheater',
    startDate: new Date('2025-06-01T15:00:00'),
    endDate: new Date('2025-06-03T23:00:00'),
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea',
    status: 'upcoming' as const,
  },
];

const HomePage = () => {
  const { fetchFeaturedLocations, isLoading, featuredLocations } =
    useAppStore();
  const { selectedCountry, isCountrySelected } = useCountryStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLocations, setFilteredLocations] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{
    province?: any;
    district?: any;
    ward?: any;
  }>({});
  const [activeTab, setActiveTab] = useState<'all' | 'ongoing' | 'upcoming'>(
    'all'
  );

  // Get current date
  const today = new Date();

  // Filter events
  const ongoingEvents = mockEvents.filter(
    (event) => today >= event.startDate && today <= event.endDate
  );

  const upcomingEvents = mockEvents.filter((event) => today < event.startDate);

  useEffect(() => {
    if (!isCountrySelected) {
      navigate('/');
      return;
    }

    if (selectedCountry) {
      fetchFeaturedLocations(selectedCountry.code);
    } else {
      fetchFeaturedLocations();
    }
  }, [fetchFeaturedLocations, isCountrySelected, navigate, selectedCountry]);

  // Filter locations based on search term
  useEffect(() => {
    if (featuredLocations) {
      setFilteredLocations(
        featuredLocations.filter((location) =>
          location.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, featuredLocations]);
  // Handle location selection from the selector
  const handleLocationChange = (location: any) => {
    setSelectedLocation(location);
    console.log('Selected location:', location);
  };

  // Check if a complete location is selected (province, district, and ward)
  const isFullLocationSelected =
    selectedLocation?.province &&
    selectedLocation?.district &&
    selectedLocation?.ward;

  // Handle location confirmation
  const handleLocationConfirm = () => {
    if (selectedLocation?.province) {
      console.log('Location confirmed:', selectedLocation);
      // Here you could navigate to a details page or perform other actions
    }
  };

  if (!selectedCountry) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Custom scrollbar styles */}
      <style>{scrollbarStyles}</style>
      {/* Decorative floating elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-primary/10 animate-float absolute -left-20 top-[20%] h-40 w-40 rounded-full blur-3xl"></div>
        <div
          className="animate-float absolute -right-20 top-[40%] h-60 w-60 rounded-full bg-indigo-600/10 blur-3xl"
          style={{ animationDelay: '2s' }}
        ></div>
        <div
          className="animate-float absolute -bottom-20 left-[30%] h-40 w-40 rounded-full bg-cyan-600/10 blur-3xl"
          style={{ animationDelay: '1s' }}
        ></div>
      </div>
      {/* Hero Section */}
      <section className="from-primary/5 relative overflow-hidden bg-gradient-to-b via-background to-background pb-8 pt-8 md:pb-12 md:pt-10 lg:pb-16 lg:pt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
            <AnimateElement animation="fade-right" delay={0.1}>
              <div className="flex flex-col justify-center space-y-4 md:space-y-6">
                {' '}
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
                    Explore {selectedCountry.name}
                  </h1>
                  <p className="mt-3 text-base text-muted-foreground md:text-lg">
                    Discover amazing places, local experiences, and
                    unforgettable adventures
                  </p>
                </div>
                {/* Search Bar with Animation */}
                <div
                  className="animate-slide-in relative max-w-xl"
                  style={{ animationDelay: '0.2s' }}
                >
                  <Input
                    type="text"
                    placeholder="Search for locations, attractions, or activities..."
                    className="h-12 rounded-full pl-12 pr-4"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                </div>
                {/* Highlighted action */}
                <div
                  className="animate-slide-in"
                  style={{ animationDelay: '0.4s' }}
                >
                  <Button
                    size="lg"
                    className="group rounded-full"
                    onClick={() => {
                      // Scroll to location selector section
                      document
                        .querySelector('#location-selector-section')
                        ?.scrollIntoView({
                          behavior: 'smooth',
                          block: 'start',
                        });
                    }}
                  >
                    Find Your Perfect Destination
                    <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
                {/* Quick access badges */}
                <div
                  className="animate-slide-in flex flex-wrap gap-2"
                  style={{ animationDelay: '0.3s' }}
                >
                  {travelCategories.map((category) => (
                    <Badge
                      key={category.id}
                      variant="outline"
                      className="cursor-pointer bg-card/80 backdrop-blur-sm hover:bg-card"
                    >
                      <span
                        className={`mr-1 bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}
                      >
                        •
                      </span>{' '}
                      {category.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </AnimateElement>

            <AnimateElement animation="fade-left" delay={0.2}>
              <div className="relative aspect-square overflow-hidden rounded-2xl shadow-xl lg:aspect-[4/3]">
                <img
                  src={`https://source.unsplash.com/featured/1200x800/?${selectedCountry.name},landscape`}
                  alt={`${selectedCountry.name} landscape`}
                  className="duration-10000 h-full w-full object-cover transition-transform hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6">
                  <div className="flex items-center">
                    <Badge className="bg-primary/80 backdrop-blur-sm">
                      Featured Destination
                    </Badge>
                  </div>
                  <h3 className="mt-2 text-xl font-bold text-white md:text-2xl">
                    Beautiful {selectedCountry.name}
                  </h3>
                </div>
              </div>
            </AnimateElement>
          </div>
        </div>
      </section>{' '}
      {/* Location Selector & Search Results Section */}
      <section id="location-selector-section" className="py-8 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            {' '}
            <AnimateElement animation="fade" delay={0.1}>
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    Explore Destinations
                  </h2>
                  <p className="mt-1 text-muted-foreground">
                    Find your perfect location in {selectedCountry.name}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <Filter className="h-4 w-4" />
                    Filters
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <MapPinned className="h-4 w-4" />
                    Popular Locations
                  </Button>
                </div>
              </div>
            </AnimateElement>
          </div>

          <div className="grid gap-8 md:grid-cols-3 lg:gap-12">
            {/* Location Selector */}
            <div className="md:col-span-1">
              <AnimateElement animation="fade-right" delay={0.2}>
                <LocationSelector
                  title="Find Your Destination"
                  subtitle="Select your travel location"
                  variant="modern"
                  onLocationChange={handleLocationChange}
                  className="shadow-md"
                  showConfirmButton={true}
                  confirmButtonText="Set Destination"
                  onConfirm={handleLocationConfirm}
                />

                {isFullLocationSelected && (
                  <Card className="border-primary/20 bg-primary/5 mt-4 overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        Selected Destination
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <div className="flex flex-col gap-1 text-sm">
                        <div className="flex items-center gap-1.5">
                          <Building className="text-primary h-3.5 w-3.5" />
                          <span className="font-medium">
                            {selectedLocation.province?.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Map className="text-primary h-3.5 w-3.5" />
                          <span>{selectedLocation.district?.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Home className="text-primary h-3.5 w-3.5" />
                          <span>{selectedLocation.ward?.name}</span>
                        </div>
                      </div>
                      <Button
                        className="mt-3 w-full"
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          // Navigate to destination details or other action
                          console.log('View destination details');
                        }}
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </AnimateElement>
            </div>

            {/* Search Results or Featured Locations */}
            <div className="md:col-span-2">
              <AnimateElement animation="fade-left" delay={0.3}>
                <Card className="h-full overflow-hidden bg-gradient-to-br from-background to-muted/50">
                  <CardHeader className="bg-primary/5 pb-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-xl">
                          <MapPin className="text-primary h-5 w-5" />
                          {searchTerm ? 'Search Results' : 'Featured Locations'}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {searchTerm
                            ? `Found ${filteredLocations.length} locations matching "${searchTerm}"`
                            : `Discover the top destinations in ${selectedCountry.name}`}
                        </CardDescription>
                      </div>
                      <div className="w-full sm:max-w-xs">
                        <div className="relative">
                          <Input
                            type="text"
                            placeholder="Search locations..."
                            className="pr-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                          {searchTerm ? (
                            <button
                              className="absolute right-3 top-1/2 -translate-y-1/2"
                              onClick={() => setSearchTerm('')}
                            >
                              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                            </button>
                          ) : (
                            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="custom-scrollbar max-h-[400px] overflow-y-auto p-4">
                    {isLoading ? (
                      <div className="flex h-32 items-center justify-center">
                        <div className="flex flex-col items-center gap-2 text-center">
                          <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
                          <p className="text-sm text-muted-foreground">
                            Loading locations...
                          </p>
                        </div>
                      </div>
                    ) : filteredLocations.length === 0 ? (
                      <div className="flex h-32 items-center justify-center">
                        <div className="text-center">
                          <p className="text-muted-foreground">
                            {searchTerm
                              ? 'No locations found matching your search'
                              : 'No featured locations available'}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {filteredLocations.map((location) => (
                          <Card
                            key={location.id}
                            className="overflow-hidden transition-all hover:shadow-md"
                          >
                            <div className="relative h-28 w-full">
                              <img
                                src={`https://source.unsplash.com/featured/300x200/?${location.name},city`}
                                alt={location.name}
                                className="h-full w-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                              <div className="absolute bottom-3 left-3">
                                <h3 className="font-semibold text-white">
                                  {location.name}
                                </h3>
                              </div>
                            </div>
                            <div className="p-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <MapPin className="h-3 w-3" />
                                  {selectedCountry.name}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                >
                                  <Heart className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </AnimateElement>
            </div>
          </div>
        </div>
      </section>{' '}
      {/* Events Section */}
      <section className="bg-muted/30 py-8 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateElement animation="fade" delay={0.1}>
            <div className="mb-8">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    Events & Festivals
                  </h2>
                  <p className="mt-1 text-muted-foreground">
                    Discover what's happening in {selectedCountry.name}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={activeTab === 'all' ? 'secondary' : 'outline'}
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => setActiveTab('all')}
                  >
                    <CalendarDays className="h-4 w-4" />
                    All Events ({mockEvents.length})
                  </Button>
                  <Button
                    variant={activeTab === 'ongoing' ? 'secondary' : 'outline'}
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => setActiveTab('ongoing')}
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                    </span>
                    Ongoing ({ongoingEvents.length})
                  </Button>
                  <Button
                    variant={activeTab === 'upcoming' ? 'secondary' : 'outline'}
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => setActiveTab('upcoming')}
                  >
                    <CalendarDays className="h-4 w-4" />
                    Upcoming ({upcomingEvents.length})
                  </Button>
                </div>
              </div>
            </div>
          </AnimateElement>

          <AnimateElement animation="slide-up" delay={0.2}>
            <EventsCarousel
              events={
                activeTab === 'all'
                  ? mockEvents
                  : activeTab === 'ongoing'
                    ? ongoingEvents
                    : upcomingEvents
              }
            />
          </AnimateElement>
        </div>
      </section>{' '}
      {/* Travel Categories Section */}
      <section className="bg-gradient-to-b from-background via-muted/10 to-background py-8 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateElement animation="fade" delay={0.1}>
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Discover by Category
              </h2>
              <p className="mx-auto mt-2 max-w-3xl text-muted-foreground">
                Find the perfect experiences for your {selectedCountry.name}{' '}
                adventure
              </p>
            </div>
          </AnimateElement>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {travelCategories.map((category, index) => (
              <AnimateElement
                key={category.id}
                animation="slide-up"
                delay={0.1 + index * 0.1}
              >
                <div className="group relative cursor-pointer overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                  {/* Image with gradient overlay */}
                  <div className="relative h-52 w-full overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-70 mix-blend-multiply`}
                    ></div>
                  </div>

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-between p-5">
                    <div className="flex w-fit items-center rounded-full bg-white/20 px-3 py-1.5 backdrop-blur-sm">
                      <div className="mr-2 text-white">{category.icon}</div>
                      <h3 className="text-sm font-medium text-white">
                        {category.name}
                      </h3>
                    </div>

                    <div className="space-y-2">
                      <p className="line-clamp-2 text-sm text-white/90">
                        {category.id === 'cultural' &&
                          'Explore historical sites, museums, and traditional villages'}
                        {category.id === 'beaches' &&
                          'Relax on pristine shores with crystal clear waters'}
                        {category.id === 'mountains' &&
                          'Experience breathtaking views and hiking adventures'}
                        {category.id === 'islands' &&
                          'Discover hidden paradises and unique ecosystems'}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-center border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/30 group-hover:bg-white/20"
                      >
                        <span>Explore {category.name}</span>
                        <ChevronRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </AnimateElement>
            ))}
          </div>
        </div>
      </section>{' '}
      {/* Newsletter Section */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateElement animation="fade" delay={0.1}>
            <div className="from-primary/90 to-primary-foreground/80 relative overflow-hidden rounded-2xl bg-gradient-to-r p-6 md:p-10">
              <div className="absolute inset-0 overflow-hidden opacity-20">
                <div
                  style={{
                    backgroundImage: `url('/patterns/noise.png')`,
                    backgroundSize: '200px',
                    width: '100%',
                    height: '100%',
                  }}
                ></div>
              </div>

              {/* Decorative elements */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="animate-float absolute -right-16 top-[20%] h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
                <div
                  className="animate-float absolute -left-16 bottom-[20%] h-24 w-24 rounded-full bg-white/10 blur-2xl"
                  style={{ animationDelay: '2s' }}
                ></div>
              </div>

              <div className="relative z-10 mx-auto max-w-2xl text-center">
                <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-sm text-white/90 backdrop-blur-sm">
                  <span className="relative mr-2 mt-1 flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
                  </span>
                  Travel updates for {selectedCountry.name}
                </div>
                <h2 className="mb-4 mt-4 text-2xl font-bold text-white sm:text-3xl">
                  Stay Updated with Exclusive Travel News
                </h2>
                <p className="mb-8 text-white/80">
                  Subscribe to receive personalized travel insights, seasonal
                  recommendations, and special offers for your next adventure in{' '}
                  {selectedCountry.name}.
                </p>
                <div className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <Input
                      type="email"
                      placeholder="Your email address"
                      className="h-12 border-white/20 bg-white/10 pl-4 pr-4 text-white placeholder:text-white/60 focus:border-white/30 focus-visible:ring-white/20"
                    />
                  </div>
                  <Button className="text-primary h-12 gap-2 bg-white hover:bg-white/90">
                    Subscribe
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                <p className="mt-4 text-xs text-white/60">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </div>
            </div>
          </AnimateElement>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
