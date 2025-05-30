import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/store/appStore';
import { useCountryStore } from '@/store/countryStore';
import { ModernHeroSection } from '@/components/features/home/ModernHeroSection';
import { EventsCarousel } from '@/components/features/events/EventsCarousel';
import { FoodSection } from '@/components/features/food/FoodSection';
import { AccommodationSection } from '@/components/features/accommodations/AccommodationSection';
import { ArticleSection } from '@/components/features/articles/ArticleSection';
import { TransportationSection } from '@/components/features/transportation/TransportationSection';
import { ShoppingSection } from '@/components/features/shopping/ShoppingSection';
import { TipsWarningsSection } from '@/components/features/tips/TipsWarningsSection';
import { PhotoVideoGallery } from '@/components/features/gallery/PhotoVideoGallery';
import { AnimateElement } from '@/components/common/PageTransition';

import { Button } from '@/components/ui/button';
import {
  CalendarDays,
  Building,
  Car,
  ShoppingBag,
  AlertTriangle,
  Camera,
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
  const { t } = useTranslation();
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
      
      {/* Quick Links to Main Sections */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateElement animation="fade" delay={0.1}>
            <h2 className="text-2xl font-bold tracking-tight mb-6 sm:text-3xl">
              {t('home:navigation.explore')} {selectedCountry.name}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                size="lg" 
                className="flex flex-col items-center justify-center h-32 p-4 border-2 hover:bg-muted/50"
                onClick={() => navigate('/accommodations')}
              >
                <Building className="h-8 w-8 mb-2 text-primary" />
                <span className="text-lg font-medium">{t('home:navigation.accommodations')}</span>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="flex flex-col items-center justify-center h-32 p-4 border-2 hover:bg-muted/50"
                onClick={() => navigate('/food')}
              >
                <svg className="h-8 w-8 mb-2 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 20C21 16.6863 16.9706 14 12 14C7.02944 14 3 16.6863 3 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-lg font-medium">{t('home:navigation.foodAndDining')}</span>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="flex flex-col items-center justify-center h-32 p-4 border-2 hover:bg-muted/50"
                onClick={() => navigate('/articles')}
              >
                <svg className="h-8 w-8 mb-2 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 19.5V4.5C4 3.95 4.196 3.479 4.588 3.087C4.979 2.696 5.45 2.5 6 2.5H18C18.55 2.5 19.021 2.696 19.413 3.087C19.804 3.479 20 3.95 20 4.5V19.5C20 20.05 19.804 20.521 19.413 20.913C19.021 21.304 18.55 21.5 18 21.5H6C5.45 21.5 4.979 21.304 4.588 20.913C4.196 20.521 4 20.05 4 19.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 6.5H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 10.5H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 14.5H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-lg font-medium">{t('home:navigation.articles')}</span>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="flex flex-col items-center justify-center h-32 p-4 border-2 hover:bg-muted/50"
                onClick={() => navigate('/events')}
              >
                <CalendarDays className="h-8 w-8 mb-2 text-primary" />
                <span className="text-lg font-medium">{t('home:navigation.events')}</span>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="flex flex-col items-center justify-center h-32 p-4 border-2 hover:bg-muted/50"
                onClick={() => navigate('/transportation')}
              >
                <Car className="h-8 w-8 mb-2 text-primary" />
                <span className="text-lg font-medium">{t('home:navigation.transportation')}</span>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="flex flex-col items-center justify-center h-32 p-4 border-2 hover:bg-muted/50"
                onClick={() => navigate('/shopping')}
              >
                <ShoppingBag className="h-8 w-8 mb-2 text-primary" />
                <span className="text-lg font-medium">{t('home:navigation.shoppingAndSouvenirs')}</span>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="flex flex-col items-center justify-center h-32 p-4 border-2 hover:bg-muted/50"
                onClick={() => navigate('/tips-warnings')}
              >
                <AlertTriangle className="h-8 w-8 mb-2 text-primary" />
                <span className="text-lg font-medium">{t('home:navigation.tipsAndWarnings')}</span>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="flex flex-col items-center justify-center h-32 p-4 border-2 hover:bg-muted/50"
                onClick={() => navigate('/gallery')}
              >
                <Camera className="h-8 w-8 mb-2 text-primary" />
                <span className="text-lg font-medium">{t('home:navigation.photoVideoAlbum')}</span>
              </Button>
            </div>
          </AnimateElement>
        </div>
      </section>
      
      {/* Events Section */}
      <section className="py-8 bg-muted/30 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateElement animation="fade" delay={0.1}>
            <div className="mb-8">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    {t('home:events.title')}
                  </h2>
                  <p className="mt-1 text-muted-foreground">
                    {t('home:common.discoverIn')} {selectedCountry.name}
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
                    {t('home:eventTabs.allEvents')} ({mockEvents.length})
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
                    {t('home:eventTabs.ongoing')} ({ongoingEvents.length})
                  </Button>
                  <Button
                    variant={activeTab === 'upcoming' ? "secondary" : "outline"}
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => setActiveTab('upcoming')}
                  >
                    <CalendarDays className="h-4 w-4" />
                    {t('home:eventTabs.upcoming')} ({upcomingEvents.length})
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

      {/* Transportation Section */}
      <TransportationSection countryName={selectedCountry.name} />

      {/* Shopping Section */}
      <ShoppingSection countryName={selectedCountry.name} />

      {/* Tips & Warnings Section */}
      <TipsWarningsSection countryName={selectedCountry.name} />

      {/* Photo/Video Album Section */}
      <PhotoVideoGallery countryName={selectedCountry.name} />
    </div>
  );
};

export default HomePage;
