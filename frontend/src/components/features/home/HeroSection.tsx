import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCountryStore } from '@/store/countryStore';
import { Button } from '@/components/ui/button';
import {
  MapIcon,
  CompassIcon,
  CalendarIcon,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { AnimateElement } from '@/components/common/PageTransition';
import { LocationSelector } from '@/components/features/locations/LocationSelector';
import { Input } from '@/components/ui/input';

const images = [
  {
    url: 'https://images.unsplash.com/photo-1557750255-c76072a7fdf1',
    caption: 'Ha Long Bay, Vietnam',
  },
  {
    url: 'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3',
    caption: 'Tokyo, Japan',
  },
  {
    url: 'https://images.unsplash.com/photo-1538485399081-7c8970e28bc2',
    caption: 'Seoul, South Korea',
  },
  {
    url: 'https://images.unsplash.com/photo-1565967511849-76a60a516170',
    caption: 'Singapore',
  },
];

const HeroSection = () => {
  const { selectedCountry } = useCountryStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Country-specific dynamic content
  const getCountrySpecificContent = () => {
    if (!selectedCountry)
      return {
        title: 'Discover Amazing Places Around the World',
        description:
          'Explore interactive maps, find hidden gems, and plan your next adventure with our comprehensive travel platform.',
        imageUrl:
          'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      };

    // Content based on country code
    switch (selectedCountry.code) {
      case 'VN':
        return {
          title: "Discover Vietnam's Hidden Treasures",
          description:
            "From the emerald waters of Ha Long Bay to the terraced fields of Sapa, explore Vietnam's natural wonders and rich cultural heritage.",
          imageUrl:
            'https://images.unsplash.com/photo-1557750255-c76072a7fdf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        };
      case 'JP':
        return {
          title: "Experience Japan's Timeless Beauty",
          description:
            'Immerse yourself in a land where ancient traditions meet modern wonders, from serene temples to bustling Tokyo streets.',
          imageUrl:
            'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        };
      case 'US':
        return {
          title: "Explore America's Diverse Landscapes",
          description:
            'From the Grand Canyon to New York City, discover the incredible diversity of the United States.',
          imageUrl:
            'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        };
      case 'KR':
        return {
          title: "Discover South Korea's Dynamic Charm",
          description:
            "Experience the perfect blend of traditional heritage and cutting-edge modernity across South Korea's vibrant cities and tranquil countryside.",
          imageUrl:
            'https://images.unsplash.com/photo-1538485399081-7c8970e28bc2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        };
      case 'SG':
        return {
          title: 'Singapore: Where Cultures Converge',
          description:
            'Explore the dazzling cityscape, lush gardens, and diverse culinary scene of this unique island nation.',
          imageUrl:
            'https://images.unsplash.com/photo-1565967511849-76a60a516170?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        };
      case 'TH':
        return {
          title: "Thailand's Tropical Paradise",
          description:
            'Discover pristine beaches, ancient temples, and vibrant street markets in the Land of Smiles.',
          imageUrl:
            'https://images.unsplash.com/photo-1528181304800-259b08848526?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        };
      default:
        return {
          title: `Explore Amazing ${selectedCountry.name}`,
          description: `Discover the unique culture, landscapes, and experiences that ${selectedCountry.name} has to offer.`,
          imageUrl:
            'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        };
    }
  };
  const content = getCountrySpecificContent();

  return (
    <div className="relative min-h-[80vh] bg-gradient-to-r from-primary-700 to-primary-900 py-16 text-white dark:from-gray-900 dark:to-gray-800 lg:py-24">
      {/* Background pattern overlay */}
      <div className="absolute inset-0 bg-[url('/patterns/noise.png')] opacity-10 dark:opacity-20"></div>

      {/* Hero content container */}
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left content - keep existing code */}
          <AnimateElement animation="fade-right" delay={0.1}>
            <div className="space-y-8">
              {/* Title and Description */}
              <div>
                <div className="mb-6 inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-medium backdrop-blur-sm dark:bg-white/10">
                  Explore {selectedCountry?.name || 'the World'} with Confidence
                </div>
                <h1 className="mb-6 text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl xl:text-6xl">
                  {content.title}
                </h1>
                <p className="max-w-xl text-lg text-primary-100/90 dark:text-gray-300">
                  {content.description}
                </p>
              </div>

              {/* Search and Location Selection */}
              <div className="space-y-6 rounded-2xl bg-white/10 p-6 backdrop-blur-md dark:bg-gray-800/50">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search for locations, attractions, or activities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="rounded-xl border-none bg-white/20 pl-10 text-white placeholder:text-gray-400 dark:bg-gray-700/50"
                  />
                </div>
                <LocationSelector
                  onLocationChange={(location) => {
                    console.log('Selected location:', location);
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="gap-2 rounded-full bg-white text-primary-700 shadow-lg transition-all hover:bg-white/90 hover:shadow-xl dark:bg-gray-200 dark:text-gray-800"
                >
                  <Link to="/map">
                    <MapIcon className="h-5 w-5" />
                    Explore Map
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="gap-2 rounded-full border-white/40 text-white backdrop-blur-sm hover:border-white/60 hover:bg-white/10 dark:border-gray-400"
                >
                  <Link to="/locations">
                    <CompassIcon className="h-5 w-5" />
                    Popular Destinations
                  </Link>
                </Button>
              </div>

              {/* Travel Stats */}
              <div className="grid grid-cols-3 gap-4 border-t border-white/20 pt-8 text-center dark:border-gray-600">
                <div className="space-y-2">
                  <div className="text-3xl font-bold">50+</div>
                  <div className="text-sm text-white/80 dark:text-gray-400">
                    Destinations
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold">1000+</div>
                  <div className="text-sm text-white/80 dark:text-gray-400">
                    Happy Travelers
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold">100%</div>
                  <div className="text-sm text-white/80 dark:text-gray-400">
                    Local Experiences
                  </div>
                </div>
              </div>
            </div>
          </AnimateElement>

          {/* Image Slideshow Section */}
          <AnimateElement animation="fade-left" delay={0.3}>
            <div className="relative hidden h-full lg:block">
              <div className="relative mx-auto h-[600px] overflow-hidden rounded-2xl shadow-2xl">
                {/* Slideshow Images */}
                <div className="relative h-full">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-opacity duration-1000 ${
                        index === currentImageIndex
                          ? 'opacity-100'
                          : 'opacity-0'
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={image.caption}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    </div>
                  ))}
                </div>

                {/* Navigation Buttons */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/50"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/50"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>

                {/* Slide Indicators */}
                <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`h-2 w-2 rounded-full transition-all ${
                        index === currentImageIndex
                          ? 'w-6 bg-white'
                          : 'bg-white/50 hover:bg-white/75'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Image Caption */}
                <div className="absolute bottom-16 left-6 right-6">
                  <div className="rounded-xl bg-white/20 p-4 backdrop-blur-md transition-all hover:bg-white/30">
                    <div className="flex items-center">
                      <CalendarIcon className="h-10 w-10 text-yellow-400" />
                      <div className="ml-3">
                        <h3 className="text-lg font-bold">
                          {images[currentImageIndex].caption}
                        </h3>
                        <p className="text-sm">
                          Best time to visit:{' '}
                          {selectedCountry?.code === 'VN'
                            ? 'October to April'
                            : 'All year round'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-yellow-400/30 backdrop-blur-md dark:bg-yellow-500/20"></div>
              <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-primary-500/20 backdrop-blur-md dark:bg-primary-600/20"></div>
            </div>
          </AnimateElement>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
