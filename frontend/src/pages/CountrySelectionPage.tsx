import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCountryStore, Country } from '@/store/countryStore';
import { useTheme } from '@/providers/ThemeProvider';
import { AnimateElement } from '@/components/common/PageTransition';
import { SettingsToggle } from '@/components/common/SettingsToggle';
import WelcomeLoadingScreen from '@/components/common/WelcomeLoadingScreen';
import axios from 'axios';
import {
  Search,
  ChevronRight,
  Globe,
  X,
  PlaneTakeoff,
  ArrowLeft,
  MapPin,
  Mountain,
  Palmtree,
  Building,
  Sailboat,
  Compass,
  Heart,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Custom scrollbar styles
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 5px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  /* For Firefox */
  .custom-scrollbar {
    scrollbar-width: thin;
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

// Types for continents and featured destinations
interface Continent {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  image: string;
  description: string;
  backgroundImage: string;
}

interface FeaturedDestination {
  name: string;
  image: string;
  countryCode: string;
}

// API response interface for continents
interface ContinentApiItem {
  id: number;
  name: string;
  code: string;
  name_code: string;
  background_image: string;
  logo: string;
  description: string | null;
  description_code: string | null;
  status: number;
  created_date: string;
  updated_date: string | null;
}

interface CountryApiItem {
  id: number;
  name: string;
  code: string;
  name_code: string;
  background_image: string;
  logo: string;
  description: string | null;
  description_code: string | null;
  status: number;
  continent_id: number;
  created_date: string;
  updated_date: string | null;
}

interface ContinentDetailApiResponse {
  id: number;
  name: string;
  code: string;
  name_code: string;
  background_image: string;
  logo: string;
  description: string | null;
  description_code: string | null;
  status: number;
  created_date: string;
  updated_date: string | null;
  countries: CountryApiItem[];
}


const CountrySelectionPage = () => {
  const { countries, setSelectedCountry, isCountrySelected } = useCountryStore();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountryCard, setSelectedCountryCard] = useState<string | null>(null);
  const [selectedContinent, setSelectedContinent] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showWelcomeLoading, setShowWelcomeLoading] = useState(false);
  const [loadingCountry, setLoadingCountry] = useState<Country | null>(null);
  const [apiContinents, setApiContinents] = useState<ContinentApiItem[]>([]);
  const [apiCountries, setApiCountries] = useState<CountryApiItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countryError, setCountryError] = useState<string | null>(null);
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  // Fetch continents from API
  useEffect(() => {
    const fetchContinents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get<any>(
          'http://localhost:8080/api/public/continents'
        );
        setApiContinents(response.data);
        debugger
      } catch (err) {
        console.error('Failed to fetch continents:', err);
        setError('Failed to load continents data. Using fallback data.');
        // Continue with hardcoded data if API fails
      } finally {
        setIsLoading(false);
      }
    };

    fetchContinents();
  }, []);

  // Define continents with enhanced visual information
  // Map API continents to UI continents with appropriate icons and styles
  const getContinentIconAndColor = (code: string): { icon: React.ReactNode; color: string; gradient: string } => {
    switch(code.toLowerCase()) {
      case 'as':
        return {
          icon: <Building className="h-6 w-6 text-yellow-100" />,
          color: 'from-yellow-500 to-orange-600',
          gradient: 'bg-gradient-to-br from-yellow-500 to-orange-600',
        };
      case 'eu':
        return {
          icon: <Building className="h-6 w-6 text-indigo-100" />,
          color: 'from-indigo-600 to-purple-700',
          gradient: 'bg-gradient-to-br from-indigo-600 to-purple-700',
        };
      case 'na':
        return {
          icon: <Mountain className="h-6 w-6 text-red-100" />,
          color: 'from-red-600 to-rose-700',
          gradient: 'bg-gradient-to-br from-red-600 to-rose-700',
        };
      case 'sa':
        return {
          icon: <Palmtree className="h-6 w-6 text-emerald-100" />,
          color: 'from-emerald-600 to-green-700',
          gradient: 'bg-gradient-to-br from-emerald-600 to-green-700',
        };
      case 'af':
        return {
          icon: <Palmtree className="h-6 w-6 text-amber-100" />,
          color: 'from-amber-600 to-yellow-700',
          gradient: 'bg-gradient-to-br from-amber-600 to-yellow-700',
        };
      case 'oc':
        return {
          icon: <Sailboat className="h-6 w-6 text-cyan-100" />,
          color: 'from-cyan-600 to-blue-700',
          gradient: 'bg-gradient-to-br from-cyan-600 to-blue-700',
        };
      case 'an':
        return {
          icon: <Mountain className="h-6 w-6 text-blue-100" />,
          color: 'from-blue-600 to-sky-700',
          gradient: 'bg-gradient-to-br from-blue-600 to-sky-700',
        };
      default:
        return {
          icon: <Globe className="h-6 w-6 text-gray-100" />,
          color: 'from-gray-600 to-gray-700',
          gradient: 'bg-gradient-to-br from-gray-600 to-gray-700',
        };
    }
  };

  // Map API continents to the UI format
  const continents: Continent[] = apiContinents.length > 0
    ? apiContinents.map(continent => {
        const { icon, color, gradient } = getContinentIconAndColor(continent.code);
        return {
          id: continent.code.toLowerCase(),
          name: t(`countrySelection.continents.${continent.code}`) || continent.name,
          icon,
          color,
          gradient,
          image: `url('${continent.background_image}')`,
          description: t(`countrySelection.continentDesc.${continent.code}`) || continent.description || '',
        };
      })
    : [
        {
          id: 'asia',
          name: t('countrySelection.continents.asia'),
          icon: <Building className="h-6 w-6 text-yellow-100" />,
          color: 'from-yellow-500 to-orange-600',
          gradient: 'bg-gradient-to-br from-yellow-500 to-orange-600',
          image: "url('https://images.unsplash.com/photo-1535139262971-c51845709a48?q=80&w=800')",
          description: t('countrySelection.continentDesc.asia'),
        },
        {
          id: 'europe',
          name: t('countrySelection.continents.europe'),
          icon: <Building className="h-6 w-6 text-indigo-100" />,
          color: 'from-indigo-600 to-purple-700',
          gradient: 'bg-gradient-to-br from-indigo-600 to-purple-700',
          image: "url('https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800')",
          description: t('countrySelection.continentDesc.europe'),
        },
        {
          id: 'north-america',
          name: t('countrySelection.continents.northAmerica'),
          icon: <Mountain className="h-6 w-6 text-red-100" />,
          color: 'from-red-600 to-rose-700',
          gradient: 'bg-gradient-to-br from-red-600 to-rose-700',
          image: "url('https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=800')",
          description: t('countrySelection.continentDesc.northAmerica'),
        },
        {
          id: 'south-america',
          name: t('countrySelection.continents.southAmerica'),
          icon: <Palmtree className="h-6 w-6 text-emerald-100" />,
          color: 'from-emerald-600 to-green-700',
          gradient: 'bg-gradient-to-br from-emerald-600 to-green-700',
          image: "url('https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?q=80&w=800')",
          description: t('countrySelection.continentDesc.southAmerica'),
        },
        {
          id: 'africa',
          name: t('countrySelection.continents.africa'),
          icon: <Palmtree className="h-6 w-6 text-amber-100" />,
          color: 'from-amber-600 to-yellow-700',
          gradient: 'bg-gradient-to-br from-amber-600 to-yellow-700',
          image: "url('https://images.unsplash.com/photo-1523805009345-7448845a9e53?q=80&w=800')",
          description: t('countrySelection.continentDesc.africa'),
        },
        {
          id: 'oceania',
          name: t('countrySelection.continents.oceania'),
          icon: <Sailboat className="h-6 w-6 text-cyan-100" />,
          color: 'from-cyan-600 to-blue-700',
          gradient: 'bg-gradient-to-br from-cyan-600 to-blue-700',
          image: "url('https://images.unsplash.com/photo-1507699622108-4be3abd695ad?q=80&w=800')",
          description: t('countrySelection.continentDesc.oceania'),
        },
      ];

  // Featured destinations to show on the home screen
  const featuredDestinations: FeaturedDestination[] = [
    {
      name: 'Bali, Indonesia',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600',
      countryCode: 'ID',
    },
    {
      name: 'Paris, France',
      image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600',
      countryCode: 'FR',
    },
    {
      name: 'Tokyo, Japan',
      image: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=600',
      countryCode: 'JP',
    },
  ];

  // Assign continent to each country
  const getCountryContinent = (code: string): string => {
    const continentMap: Record<string, string> = {
      // Asia
      VN: 'asia', JP: 'asia', KR: 'asia', SG: 'asia', TH: 'asia', MY: 'asia', ID: 'asia',
      CN: 'asia', HK: 'asia', TW: 'asia', IN: 'asia', PH: 'asia', LK: 'asia', NP: 'asia',
      KH: 'asia', LA: 'asia', MM: 'asia', BN: 'asia', MN: 'asia', BT: 'asia', MV: 'asia',
      AE: 'asia', SA: 'asia', QA: 'asia', OM: 'asia', BH: 'asia', KW: 'asia', JO: 'asia',
      IL: 'asia', LB: 'asia', IQ: 'asia', IR: 'asia', SY: 'asia', TR: 'asia', CY: 'asia',
      PK: 'asia', AF: 'asia', BD: 'asia', MO: 'asia', PS: 'asia', YE: 'asia', KZ: 'asia',
      UZ: 'asia', TM: 'asia', KG: 'asia', TJ: 'asia',
      
      // North America
      US: 'north-america', CA: 'north-america', MX: 'north-america', 
      CR: 'north-america', PA: 'north-america', BS: 'north-america', BB: 'north-america',
      JM: 'north-america', DO: 'north-america', HT: 'north-america', CU: 'north-america',
      GT: 'north-america', BZ: 'north-america', SV: 'north-america', HN: 'north-america',
      NI: 'north-america', PR: 'north-america', TC: 'north-america', KY: 'north-america',
      GP: 'north-america', MQ: 'north-america', TT: 'north-america', LC: 'north-america',
      
      // South America
      BR: 'south-america', AR: 'south-america', CL: 'south-america', PE: 'south-america',
      CO: 'south-america', VE: 'south-america', EC: 'south-america', BO: 'south-america',
      PY: 'south-america', UY: 'south-america', GY: 'south-america', SR: 'south-america',
      GF: 'south-america', FK: 'south-america',
      
      // Europe
      GB: 'europe', FR: 'europe', DE: 'europe', IT: 'europe', ES: 'europe', PT: 'europe',
      NL: 'europe', BE: 'europe', CH: 'europe', AT: 'europe', DK: 'europe', SE: 'europe',
      NO: 'europe', FI: 'europe', IE: 'europe', IS: 'europe', GR: 'europe', PL: 'europe',
      CZ: 'europe', SK: 'europe', HU: 'europe', RO: 'europe', BG: 'europe', HR: 'europe',
      RS: 'europe', SI: 'europe', ME: 'europe', MK: 'europe', AL: 'europe', BA: 'europe',
      LT: 'europe', LV: 'europe', EE: 'europe', UA: 'europe', BY: 'europe', MD: 'europe',
      RU: 'europe', MT: 'europe', LU: 'europe', MC: 'europe', SM: 'europe', VA: 'europe',
      LI: 'europe', AD: 'europe',
      
      // Africa
      ZA: 'africa', EG: 'africa', KE: 'africa', MA: 'africa', TN: 'africa', DZ: 'africa',
      NG: 'africa', GH: 'africa', ET: 'africa', TZ: 'africa', UG: 'africa', ZM: 'africa',
      ZW: 'africa', MZ: 'africa', AO: 'africa', NA: 'africa', BW: 'africa', SN: 'africa',
      CI: 'africa', CM: 'africa', RW: 'africa', MU: 'africa', SC: 'africa', MG: 'africa',
      SL: 'africa', LR: 'africa', ML: 'africa', BF: 'africa', NE: 'africa', TD: 'africa',
      SD: 'africa', SS: 'africa', ER: 'africa', DJ: 'africa', SO: 'africa', LY: 'africa',
      GM: 'africa', GN: 'africa', BJ: 'africa', TG: 'africa', GW: 'africa', GA: 'africa',
      CG: 'africa', CD: 'africa', CF: 'africa', GQ: 'africa', CV: 'africa', KM: 'africa',
      
      // Oceania
      AU: 'oceania', NZ: 'oceania', FJ: 'oceania', PG: 'oceania', SB: 'oceania',
      VU: 'oceania', WS: 'oceania', TO: 'oceania', FM: 'oceania', PW: 'oceania',
      MH: 'oceania', NR: 'oceania', KI: 'oceania', TV: 'oceania', NC: 'oceania',
      PF: 'oceania', GU: 'oceania', AS: 'oceania', MP: 'oceania', CK: 'oceania',
      NU: 'oceania'
    };
    return continentMap[code] || 'asia'; // Default to Asia if not found
  };

  // Redirect if country is already selected
  useEffect(() => {
    if (isCountrySelected) {
      navigate('/home');
    }
  }, [isCountrySelected, navigate]);

  // Fetch countries of the selected continent
  useEffect(() => {
    if (selectedContinent) {
      const fetchCountriesByContinent = async () => {
        setIsLoadingCountries(true);
        setCountryError(null);
        const selectedContinentData = apiContinents.find(
          continent => continent.code.toLowerCase() === selectedContinent
        );

        if (!selectedContinentData) {
          setCountryError('Could not find continent data');
          setIsLoadingCountries(false);
          return;
        }

        try {
          const response = await axios.get<ContinentDetailApiResponse>(
            `http://localhost:8000/api/continents/${selectedContinentData.id}`
          );

          setApiCountries(response.data.countries);
        } catch (err) {
          console.error('Failed to fetch countries for continent:', err);
          setCountryError('Failed to load countries. Using fallback data.');
        } finally {
          setIsLoadingCountries(false);
        }
      };

      fetchCountriesByContinent();
    } else {
      // Reset countries data when no continent is selected
      setApiCountries([]);
    }
  }, [selectedContinent, apiContinents]);

  // Filter countries by continent and search term
  const filteredCountries = selectedContinent && apiCountries.length > 0
    ? apiCountries
        .filter(country => {
          return country.name.toLowerCase().includes(searchTerm.toLowerCase());
        })
        .map(apiCountry => {
          // Convert API country to UI country format
          return {
            name: t(`countrySelection.countries.${apiCountry.code}`) || apiCountry.code,
            code: apiCountry.code,
            flagUrl: apiCountry.logo || `https://flagcdn.com/w320/${apiCountry.code.toLowerCase()}.png` || '',
            description: apiCountry.description || '',
          } as Country;
        })
    : countries.filter((country) => {
        const matchesSearch = country.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesContinent = selectedContinent
          ? getCountryContinent(country.code) === selectedContinent
          : true;
        return matchesSearch && (selectedContinent ? matchesContinent : true);
      });

  // Handle country selection
  const handleCountrySelect = (country: Country) => {
    setLoadingCountry(country);
    setShowWelcomeLoading(true);
    // Fix: align timeout with the actual duration of WelcomeLoadingScreen
    // Use a slightly longer time to ensure animation completes
    const loadingDuration = 3500; // match the default duration in WelcomeLoadingScreen
    setTimeout(() => {
      setSelectedCountry(country);
      navigate('/home');
    }, loadingDuration);
  };

  // Reset when going back to continent selection
  const handleBackToContinent = () => {
    setSelectedContinent(null);
    setSelectedCountryCard(null);
    setSearchTerm('');
    setShowSearch(false);
  };

  // Get a nice featured image for a continent
  const getContinentFeaturedImage = (continentId: string) => {
    const continent = continents.find(c => c.id === continentId);
    if (!continent) return '';
    return continent.backgroundImage.replace("url('", '').replace("')", '');
  };

  // Handle featured destination click
  const handleFeaturedDestinationClick = (countryCode: string) => {
    const country = filteredCountries.find((c) => c.code === countryCode);
    if (country) {
      setSelectedCountry(country);
      navigate('/home');
    }
  };

  return (
    <div 
      className="relative min-h-screen w-full bg-cover bg-center bg-fixed flex flex-col"
      style={{
        backgroundImage: selectedContinent 
          ? `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url('${getContinentFeaturedImage(selectedContinent)}')`
          : "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=1600')",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      {/* Welcome Loading Screen */}
      {showWelcomeLoading && loadingCountry && (
        <WelcomeLoadingScreen
          country={loadingCountry}
          onComplete={() => {
            setShowWelcomeLoading(false);
            navigate('/home');
          }}
          duration={3500}
        />
      )}

      {/* Custom styles */}
      <style>{scrollbarStyles}</style>

      {/* Decorative floating elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-[20%] h-40 w-40 rounded-full bg-primary-600/10 blur-3xl animate-float"></div>
        <div className="absolute -right-20 top-[40%] h-60 w-60 rounded-full bg-indigo-600/10 blur-3xl animate-float" style={{ animationDelay: '2s'}}></div>
        <div className="absolute left-[30%] -bottom-20 h-40 w-40 rounded-full bg-cyan-600/10 blur-3xl animate-float" style={{ animationDelay: '1s'}}></div>
      </div>

      {/* Logo and Navigation with integrated Theme and Language switchers */}
      <header className="absolute left-0 top-0 z-40 w-full px-4 py-4 sm:px-6 sm:py-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md">
              <PlaneTakeoff className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              {t('appName')}
            </span>
          </div>

          {/* Theme and Language switchers integrated in header */}
          <div className="ml-auto">
            <SettingsToggle
              mode="separated"
              style="floating"
              size="md"
              colorScheme="dark"
              showText
              position="left"
              className="shadow-lg"
            />
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-col px-4 py-20 md:py-24 flex-grow pb-24">
        {!selectedContinent ? (
          /* Home view with continents */
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-12">
            {/* Welcome header */}
            <div className="col-span-1 flex flex-col justify-center md:col-span-2 lg:col-span-3 xl:col-span-4">
              <AnimateElement animation="fade-right" delay={0.2}>
                <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
                  {t('countrySelection.title')}
                </h1>
                <p className="mt-4 text-lg font-light text-white/80">
                  {t('countrySelection.subtitle')}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  <Badge variant="outline" className="border-white/20 bg-white/10 backdrop-blur-sm">
                    <span className="mr-1 text-primary-300">✦</span> {t('countrySelection.personalizedRecs')}
                  </Badge>
                  <Badge variant="outline" className="border-white/20 bg-white/10 backdrop-blur-sm">
                    <span className="mr-1 text-primary-300">✦</span> {t('countrySelection.exclusiveDeals')}
                  </Badge>
                </div>

                {/* Featured destinations */}
                <div className="mt-8">
                  <h3 className="mb-3 flex items-center gap-2 text-lg font-medium text-white">
                    <Heart className="h-4 w-4 text-red-400" /> {t('countrySelection.featuredDestinations')}
                  </h3>

                  <div className="flex flex-wrap gap-3">
                    {featuredDestinations.map((destination, index) => (
                      <div
                        key={destination.name}
                        className="group relative cursor-pointer overflow-hidden rounded-lg animate-slide-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                        onClick={() => handleFeaturedDestinationClick(destination.countryCode)}
                      >
                        <div className="relative h-24 w-40 overflow-hidden rounded-lg sm:h-20 sm:w-32">
                          <img
                            src={destination.image}
                            alt={destination.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                          <div className="absolute bottom-0 left-0 right-0 p-2">
                            <p className="text-xs font-medium text-white">{destination.name}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimateElement>
            </div>

            {/* Continent grid */}
            <div className="col-span-1 grid grid-cols-1 gap-4 sm:grid-cols-2 md:col-span-2 lg:col-span-3 xl:col-span-8 xl:grid-cols-3 grid-rows-[auto] auto-rows-fr">
              {continents.map((continent, index) => (
                <div
                  key={continent.id}
                  className="group relative flex cursor-pointer flex-col overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-slide-in min-h-[250px]"
                  style={{ animationDelay: `${0.1 + index * 0.1}s` }}
                  onClick={() => setSelectedContinent(continent.id)}
                >
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: continent.backgroundImage }}></div>
                  <div className={`absolute inset-0 bg-gradient-to-br ${continent.color} opacity-70`}></div>

                  <div className="relative flex h-full flex-col justify-between p-5 md:p-6">
                    <div className="mb-auto flex w-fit items-center rounded-full bg-white/20 px-3 py-1.5 backdrop-blur-sm">
                      <div className="mr-2">{continent.icon}</div>
                      <h3 className="text-sm font-semibold text-white">{continent.name}</h3>
                    </div>

                    <div>
                      <p className="mt-4 line-clamp-2 text-sm text-white/90">{continent.description}</p>
                      <div className="mt-3 flex items-center text-xs text-white/80">
                        <Compass className="mr-1 h-3.5 w-3.5" />
                        <span>{t('countrySelection.exploreRegion')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Country selection view */
          <div className="mx-auto flex w-full max-w-3xl flex-col">
            {/* Header */}
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                {t('countrySelection.explore')} {continents.find((c) => c.id === selectedContinent)?.name}
              </h2>
              <p className="mt-2 text-white/70">
                {continents.find((c) => c.id === selectedContinent)?.description}
              </p>
            </div>
            
            {/* Search bar and controls */}
            <div className="relative mb-6 flex items-center justify-between">
              {showSearch ? (
                <div className="relative flex w-full items-center rounded-full bg-white/10 backdrop-blur-md">
                  <Search className="absolute left-3 h-5 w-5 text-white/60" />
                  <Input
                    type="text"
                    placeholder={t('countrySelection.searchCountries')}
                    className="h-11 w-full border-transparent bg-transparent pl-10 text-white placeholder:text-white/60 focus:border-white/30 focus:ring-0"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setShowSearch(false);
                    }}
                    className="absolute right-3 rounded-full p-1 text-white/60 hover:bg-white/10 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  {selectedContinent && (
                      <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleBackToContinent}
                          className="text-white/80 hover:bg-white/10 hover:text-white"
                      >
                        <ArrowLeft className="mr-1 h-4 w-4" />
                        <span className="hidden sm:inline">{t('buttons.back')}</span>
                      </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSearch(true)}
                    className="rounded-full bg-white/10 text-white hover:bg-white/20"
                  >
                    <Search className="mr-1 h-4 w-4" />
                    <span>{t('buttons.search')}</span>
                  </Button>
                </>
              )}
            </div>
            
            {/* Country list */}
            <div className="custom-scrollbar mb-6 max-h-[60vh] overflow-y-auto rounded-xl bg-white/5 p-1 backdrop-blur-md sm:p-2">
              {filteredCountries.length > 0 ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredCountries.map((country, index) => (
                    <div
                      key={country.code}
                      className={`
                        group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border transition-all duration-300 animate-slide-in
                        ${selectedCountryCard === country.code
                          ? 'border-primary-400 bg-white/10'
                          : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10'
                        }
                      `}
                      style={{ animationDelay: `${index * 0.05}s` }}
                      onClick={() => setSelectedCountryCard(country.code)}
                    >
                      {/* Flag background with gradient overlay */}
                      <div className="relative h-24 w-full overflow-hidden sm:h-28">
                        <img
                          src={country.flagUrl}
                          alt={country.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                      </div>
                      
                      {/* Country info */}
                      <div className="flex flex-1 flex-col justify-between p-3">
                        <div>
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-white">{country.name}</h3>
                            <Badge className="ml-1 bg-white/20 text-white">{country.code}</Badge>
                          </div>
                          <p className="mt-1 line-clamp-2 text-xs text-white/70">
                            {country.description || t('countrySelection.noDescription')}
                          </p>
                        </div>
                        
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`h-2 w-2 rounded-full ${selectedCountryCard === country.code ? 'bg-primary-400' : 'bg-white/30'}`}></div>
                            <span className="ml-1.5 text-[10px] text-white/60">{t('countrySelection.tap')}</span>
                          </div>
                          
                          <Button
                            size="sm"
                            className={`
                              h-7 rounded-full px-2.5 text-xs font-medium
                              ${selectedCountryCard === country.code
                                ? 'bg-primary-600 text-white hover:bg-primary-700'
                                : 'bg-white/10 text-white hover:bg-white/20'
                              }
                            `}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCountrySelect(country);
                            }}
                          >
                            <span>{t('buttons.exploreNow')}</span>
                            <ChevronRight className="ml-1 h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Selection indicator */}
                      {selectedCountryCard === country.code && (
                        <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-primary-600 to-primary-400"></div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-40 flex-col items-center justify-center rounded-lg p-4 text-center">
                  <Globe className="mb-3 h-10 w-10 text-white/40" />
                  <p className="text-white/80">{t('countrySelection.noDestinations')}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 border-white/20 bg-white/10 text-white hover:bg-white/20"
                    onClick={() => {
                      setSearchTerm('');
                      setShowSearch(false);
                    }}
                  >
                    {t('buttons.viewAll')}
                  </Button>
                </div>
              )}
            </div>
            
            {/* Continue button */}
            {selectedCountryCard && (
              <div className="mx-auto w-full max-w-md">
                <Button
                  className="relative w-full overflow-hidden bg-gradient-to-r from-primary-600 to-primary-500 py-3 text-white transition-all duration-300 hover:from-primary-500 hover:to-primary-600"
                  onClick={() => {
                    const country = filteredCountries.find((c) => c.code === selectedCountryCard);
                    if (country) handleCountrySelect(country);
                  }}
                >
                  <span className="flex items-center justify-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    <span>{t('buttons.continueWith')} {filteredCountries.find((c) => c.code === selectedCountryCard)?.name}</span>
                  </span>
                </Button>
              </div>
            )}
          </div>
        )}
      </main>
      
      {/* Footer - Fixed at bottom of viewport */}
      <footer className="fixed bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-black/50 py-4 text-center text-sm text-white/60 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4">
          {t('footer.copyright')} © {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default CountrySelectionPage;
