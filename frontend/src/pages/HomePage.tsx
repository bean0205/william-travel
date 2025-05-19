import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/appStore';
import { useCountryStore } from '@/store/countryStore';
import { ModernHeroSection } from '@/components/features/home/ModernHeroSection';
import { LocationSelector } from '@/components/features/locations/LocationSelector';
import { EventsCarousel } from '@/components/features/events/EventsCarousel';
import { FoodSection } from '@/components/features/food/FoodSection';
import { AccommodationSection } from '@/components/features/accommodations/AccommodationSection';
import { ArticleSection } from '@/components/features/articles/ArticleSection';
import { AnimateElement } from '@/components/common/PageTransition';
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
  Building,
  ArrowRight,
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
  const { fetchFeaturedLocations } = useAppStore();
  const { selectedCountry, isCountrySelected } = useCountryStore();
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState<{
    province?: { name: string; code: string };
    district?: { name: string; code: string };
    ward?: { name: string; code: string };
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
  
  // Handle location selection from the selector
  const handleLocationChange = (location: {
    province?: { name: string; code: string };
    district?: { name: string; code: string };
    ward?: { name: string; code: string };
  }) => {
    setSelectedLocation(location);
    // Process the selected location
  };

  // Check if a complete location is selected (province, district, and ward)
  const isFullLocationSelected =
    selectedLocation?.province &&
    selectedLocation?.district &&
    selectedLocation?.ward;
  // Handle location confirmation
  const handleLocationConfirm = () => {
    if (selectedLocation?.province) {
      // Process the confirmed location
    }
  };
  if (!selectedCountry) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Custom scrollbar styles */}
      <style>{scrollbarStyles}</style>
      
      {/* Decorative floating elements for background */}
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
      </div>        {/* Hero Section */}
      <ModernHeroSection 
        countryName={selectedCountry.name}
        countryCode={selectedCountry.code}
        countryDescription={selectedCountry.description}
      />
      
   
      
      {/* Events Section */}
      <section className="py-8 bg-muted/30 md:py-12">
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
                    Ongoing ({ongoingEvents.length})
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
      </section>
      
      {/* Food Section */}
      <FoodSection countryName={selectedCountry.name} />
      
      {/* Accommodation Section */}
      <AccommodationSection countryName={selectedCountry.name} />
      
      {/* Articles Section */}
      <ArticleSection countryName={selectedCountry.name} />
      
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
