import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCountryStore } from '@/store/countryStore';
import { PageTransition, AnimateElement } from '@/components/common/PageTransition';
import { EventsCarousel } from '@/components/features/events/EventsCarousel';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  CalendarDays,
  Search,
  MapPin,
  Filter,
  Clock,
  SlidersHorizontal,
} from 'lucide-react';

// Types for events and filters
interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  image: string;
  status: 'upcoming' | 'ongoing' | 'past';
  category?: string;
  price?: string;
  organizer?: string;
}

interface FilterOptions {
  category: string;
  timeframe: 'all' | 'today' | 'this-week' | 'this-month' | 'custom';
  priceRange: string;
  sortBy: 'date' | 'popularity' | 'price';
}

const EventsPage = () => {
  const { selectedCountry, isCountrySelected } = useCountryStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState<string | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'All',
    timeframe: 'all',
    priceRange: 'All',
    sortBy: 'date'
  });
  const [activeTab, setActiveTab] = useState<'all' | 'ongoing' | 'upcoming'>('all');

  // Sample mock events data
  const mockEvents: Event[] = [
    {
      id: '1',
      title: 'Cultural Festival 2025',
      description:
        'Experience the rich cultural heritage through music, dance, and traditional arts.',
      location: 'City Center Square',
      startDate: new Date('2025-05-20T10:00:00'),
      endDate: new Date('2025-05-25T22:00:00'),
      image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3',
      status: 'upcoming',
      category: 'Festival',
      price: 'Free',
      organizer: 'City Cultural Department',
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
      status: 'ongoing',
      category: 'Food',
      price: '$15',
      organizer: 'Culinary Association',
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
      status: 'upcoming',
      category: 'Music',
      price: '$25',
      organizer: 'MusicLife Productions',
    },
    {
      id: '4',
      title: 'Traditional Craft Workshop',
      description:
        'Learn traditional crafts from local artisans in an interactive workshop.',
      location: 'Cultural Center',
      startDate: new Date('2025-05-22T09:00:00'),
      endDate: new Date('2025-05-22T16:00:00'),
      image: 'https://images.unsplash.com/photo-1594128956593-99752d8a62c0',
      status: 'upcoming',
      category: 'Workshop',
      price: '$10',
      organizer: 'Heritage Preservation Society',
    },
    {
      id: '5',
      title: 'Night Market Experience',
      description:
        'Explore local street food, handicrafts, and entertainment at this vibrant night market.',
      location: 'Old Town Street',
      startDate: new Date('2025-05-19T18:00:00'),
      endDate: new Date('2025-05-19T23:00:00'),
      image: 'https://images.unsplash.com/photo-1545579133-99bb5ab189bd',
      status: 'ongoing',
      category: 'Market',
      price: 'Free',
      organizer: 'Street Vendors Association',
    },
    {
      id: '6',
      title: 'Photography Exhibition',
      description:
        'A showcase of stunning photographs capturing the beauty and culture of Vietnam.',
      location: 'Modern Art Gallery',
      startDate: new Date('2025-05-15T10:00:00'),
      endDate: new Date('2025-05-30T18:00:00'),
      image: 'https://images.unsplash.com/photo-1600411032649-29f9d9637e9a',
      status: 'ongoing',
      category: 'Exhibition',
      price: '$5',
      organizer: 'Photographers Alliance',
    },
  ];

  // Get current date
  const today = new Date();

  // Filter events based on status
  const ongoingEvents = mockEvents.filter(
    (event) => today >= event.startDate && today <= event.endDate
  );

  const upcomingEvents = mockEvents.filter((event) => today < event.startDate);

  // Sample categories and filter options
  const eventCategories = [
    'All', 'Festival', 'Music', 'Food', 'Cultural', 'Workshop', 
    'Exhibition', 'Market', 'Sports', 'Nature'
  ];
  
  const timeframeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'this-week', label: 'This Week' },
    { value: 'this-month', label: 'This Month' },
    { value: 'custom', label: 'Custom Dates' }
  ];
  
  const priceRanges = ['All', 'Free', 'Under $10', '$10-$25', '$25-$50', 'Above $50'];
  
  const sortOptions = [
    { value: 'date', label: 'Date (Soonest)' },
    { value: 'popularity', label: 'Popularity' },
    { value: 'price', label: 'Price (Low to High)' }
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
  const handleCategoryChange = (category: string) => {
    setFilters({ ...filters, category });
  };

  const handleTimeframeChange = (timeframe: 'all' | 'today' | 'this-week' | 'this-month' | 'custom') => {
    setFilters({ ...filters, timeframe });
  };

  const handlePriceChange = (priceRange: string) => {
    setFilters({ ...filters, priceRange });
  };

  const handleSortChange = (sortBy: 'date' | 'popularity' | 'price') => {
    setFilters({ ...filters, sortBy });
  };

  // Reset all filters
  const handleResetFilters = () => {
    setFilters({
      category: 'All',
      timeframe: 'all',
      priceRange: 'All',
      sortBy: 'date'
    });
    setSearchQuery('');
  };

  // Format date function for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format time function for display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!selectedCountry) return null;

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Decorative floating elements for background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="bg-primary/10 animate-float absolute -left-20 top-[10%] h-40 w-40 rounded-full blur-3xl"></div>
          <div
            className="animate-float absolute -right-20 top-[30%] h-60 w-60 rounded-full bg-purple-600/10 blur-3xl"
            style={{ animationDelay: '2s' }}
          ></div>
        </div>

        {/* Page Header */}
        <section className="relative pt-16 pb-8 md:pt-24 md:pb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AnimateElement animation="fade-down" delay={0.1}>
              <h1 className="text-3xl font-bold tracking-tight mb-2 md:text-4xl lg:text-5xl">
                <span className="flex items-center gap-3">
                  <CalendarDays className="h-8 w-8 text-primary" />
                  Events & Festivals in {selectedCountry.name}
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl">
                Discover cultural celebrations, workshops, performances, and other exciting events happening across the country.
              </p>
            </AnimateElement>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="py-6 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AnimateElement animation="fade-up" delay={0.2}>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search events, festivals, or activities..."
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
                    {location || "Any Location"}
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

              {/* Tab filters */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Button
                  variant={activeTab === 'all' ? "secondary" : "outline"}
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => setActiveTab('all')}
                >
                  <CalendarDays className="h-4 w-4" />
                  All Events ({mockEvents.length})
                </Button>
                <Button
                  variant={activeTab === 'ongoing' ? "secondary" : "outline"}
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => setActiveTab('ongoing')}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                  </span>
                  Happening Now ({ongoingEvents.length})
                </Button>
                <Button
                  variant={activeTab === 'upcoming' ? "secondary" : "outline"}
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => setActiveTab('upcoming')}
                >
                  <CalendarDays className="h-4 w-4" />
                  Upcoming ({upcomingEvents.length})
                </Button>
              </div>

              {/* Advanced Filters */}
              {showAdvancedFilters && (
                <Card className="mt-4 border border-muted/40 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                      {/* Event Categories */}
                      <div>
                        <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                          <Filter className="h-4 w-4 text-primary" />
                          Event Type
                        </h3>
                        <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto custom-scrollbar">
                          {eventCategories.map(category => (
                            <Badge 
                              key={category}
                              variant={filters.category === category ? "default" : "outline"}
                              className="cursor-pointer"
                              onClick={() => handleCategoryChange(category)}
                            >
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Timeframe */}
                      <div>
                        <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                          <Clock className="h-4 w-4 text-primary" />
                          When
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {timeframeOptions.map(option => (
                            <Badge 
                              key={option.value}
                              variant={filters.timeframe === option.value ? "default" : "outline"}
                              className="cursor-pointer"
                              onClick={() => handleTimeframeChange(option.value as any)}
                            >
                              {option.label}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Price Range */}
                      <div>
                        <h3 className="text-sm font-medium mb-3">Price</h3>
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

        {/* Main Content - Events Carousel */}
        <section className="py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AnimateElement animation="fade" delay={0.3}>
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
        </section>

        {/* Events List */}
        <section className="py-8 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AnimateElement animation="fade" delay={0.4}>
              <h2 className="text-2xl font-bold mb-6">All Events</h2>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {(activeTab === 'all' 
                  ? mockEvents 
                  : activeTab === 'ongoing'
                    ? ongoingEvents
                    : upcomingEvents
                ).map(event => (
                  <Card key={event.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <Link to={`/events/${event.id}`} className="block">
                      <div className="relative h-48">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                        {event.status === 'ongoing' && (
                          <Badge className="absolute top-2 right-2 bg-green-500 text-white">
                            Happening Now
                          </Badge>
                        )}
                      </div>
                      <CardHeader>
                        <CardTitle className="text-xl">{event.title}</CardTitle>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          <CalendarDays className="h-4 w-4" />
                          <span>{formatDate(event.startDate)}{event.startDate.toDateString() !== event.endDate.toDateString() && ` - ${formatDate(event.endDate)}`}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{formatTime(event.startDate)} - {formatTime(event.endDate)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                      </CardHeader>
                    </Link>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{event.description}</p>
                      <div className="flex justify-between items-center">
                        {event.category && (
                          <Badge variant="outline">{event.category}</Badge>
                        )}
                        <span className="font-medium">{event.price || 'Free'}</span>
                      </div>
                      <Link to={`/events/${event.id}`}>
                        <Button className="w-full mt-4">View Details</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </AnimateElement>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default EventsPage;
