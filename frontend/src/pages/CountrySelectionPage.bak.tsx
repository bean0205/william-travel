import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCountryStore, Country } from '@/store/countryStore';
import { useTheme } from '@/providers/ThemeProvider';
import { AnimateElement } from '@/components/common/PageTransition';
import { ThemeSwitch } from '@/components/common/ThemeSwitch';
import { 
  Search, 
  ChevronRight, 
  Globe, 
  X, 
  PlaneTakeoff, 
  Map, 
  ArrowLeft,
  Compass,
  MapPin,
  Palmtree,
  Mountain,
  Building
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const CountrySelectionPage = () => {
  const { countries, setSelectedCountry, isCountrySelected } = useCountryStore();
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountryCard, setSelectedCountryCard] = useState<string | null>(null);
  const [selectedContinent, setSelectedContinent] = useState<string | null>(null);
  const navigate = useNavigate();

  // Define continents with icons and colors
  const continents = [
    { id: 'asia', name: 'Asia', icon: <Globe className="h-8 w-8" />, color: 'from-blue-500 to-teal-400' },
    { id: 'europe', name: 'Europe', icon: <Building className="h-8 w-8" />, color: 'from-purple-500 to-indigo-400' },
    { id: 'americas', name: 'Americas', icon: <Mountain className="h-8 w-8" />, color: 'from-red-500 to-orange-400' },
    { id: 'africa', name: 'Africa', icon: <Palmtree className="h-8 w-8" />, color: 'from-yellow-500 to-amber-400' },
    { id: 'oceania', name: 'Oceania', icon: <Compass className="h-8 w-8" />, color: 'from-cyan-500 to-blue-400' }
  ];
  // If country is already selected, redirect to home page
  useEffect(() => {
    if (isCountrySelected) {
      navigate('/home');
    }
  }, [isCountrySelected, navigate]);
  // Filter countries based on selected continent and search term
  const filteredCountries = countries.filter((country) => {
    const matchesSearchTerm = country.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Map country codes to continents for demonstration (in a real app, this would come from the backend)
    const countryToContinentMap: Record<string, string> = {
      'VN': 'asia',
      'US': 'americas',
      'JP': 'asia',
      'FR': 'europe',
      'IT': 'europe',
      'UK': 'europe',
      'AU': 'oceania',
      'BR': 'americas',
      'ZA': 'africa',
      'EG': 'africa',
      'IN': 'asia',
      'CA': 'americas',
    };
    
    const countryContinent = countryToContinentMap[country.code.toUpperCase()] || '';
    const matchesContinent = selectedContinent ? countryContinent === selectedContinent : true;
    
    return matchesSearchTerm && matchesContinent;
  });

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    navigate('/home');
  };

  return (
    <div
      className="relative h-screen w-full overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>

      {/* Theme switch */}
      <div className="absolute right-4 top-4 z-10">
        <ThemeSwitch />
      </div>

      {/* Logo */}
      <div className="absolute left-6 top-6 z-10 text-white">
        <div className="flex items-center gap-2">
          <PlaneTakeoff className="h-7 w-7" />
          <span className="text-xl font-bold tracking-tight">
            William Travel
          </span>
        </div>
      </div>

      <div className="flex h-full w-full items-center justify-center">
        <div className="z-10 flex h-full w-full flex-col md:flex-row">
          {/* Left panel - Motivational text */}
          <div className="flex w-full flex-col justify-center p-8 text-white md:w-1/2 md:pr-0">
            <AnimateElement animation="fade-right" delay={0.2}>
              <h1 className="mb-8 text-4xl font-bold leading-tight sm:text-5xl md:max-w-md lg:text-6xl">
                Begin your journey across the world
              </h1>
              <p className="mb-6 text-lg font-light text-white/80 md:max-w-md">
                Choose your destination and discover personalized travel
                experiences tailored just for you.
              </p>
              <div className="mb-6 hidden md:block">
                <Badge
                  variant="outline"
                  className="border-white/20 bg-white/10"
                >
                  <span className="mr-1 text-primary-300">✦</span> Personalized
                  recommendations
                </Badge>
                <Badge
                  variant="outline"
                  className="ml-2 border-white/20 bg-white/10"
                >
                  <span className="mr-1 text-primary-300">✦</span> Exclusive
                  deals
                </Badge>
                <Badge
                  variant="outline"
                  className="ml-2 mt-2 border-white/20 bg-white/10"
                >
                  <span className="mr-1 text-primary-300">✦</span> Local
                  experiences
                </Badge>
              </div>
            </AnimateElement>
          </div>

          {/* Right panel - Country selection */}
          <div className="flex w-full justify-center md:w-1/2">
            <Card className="flex h-auto w-full max-w-md flex-col self-center border-white/20 bg-white/10 shadow-2xl backdrop-blur-md md:h-[32rem]">
              <CardContent className="flex flex-1 flex-col p-6">
                <div className="mb-5 text-center text-white">
                  <h2 className="text-2xl font-bold">
                    Select Your Destination
                  </h2>
                  <p className="text-sm text-white/70">
                    Choose a continent and discover amazing places
                  </p>
                </div>

                {/* Search input */}
                <div className="relative mb-5">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
                  <Input
                    type="text"
                    placeholder="Search destinations..."
                    className="border-white/20 bg-white/10 pl-10 text-white placeholder:text-white/60 focus:border-primary-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Continent selection */}
                {!selectedContinent && !searchTerm && (
                  <AnimateElement animation="fade" delay={0.1} className="flex-1">
                    <div className="mb-3 flex items-center text-white">
                      <Globe className="mr-2 h-4 w-4" />
                      <span className="text-sm font-medium">Select a region to explore</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {continents.map((continent) => (
                        <div
                          key={continent.id}
                          className="group cursor-pointer"
                          onClick={() => setSelectedContinent(continent.id)}
                        >
                          <div className={`flex flex-col items-center justify-center rounded-lg bg-gradient-to-br ${continent.color} p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg`}>
                            <div className="mb-2 text-white">
                              {continent.icon}
                            </div>
                            <span className="text-center font-medium text-white">
                              {continent.name}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AnimateElement>
                )}

                {/* Country grid */}
                {(selectedContinent || searchTerm) && (
                  <div className="flex flex-1 flex-col">
                    {selectedContinent && !searchTerm && (
                      <div className="mb-3 flex items-center justify-between text-white">
                        <div className="flex items-center">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="mr-2 flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-white/10 p-0 text-white hover:bg-white/20"
                            onClick={() => setSelectedContinent(null)}
                          >
                            <ArrowLeft className="h-4 w-4" />
                          </Button>
                          <span className="text-sm font-medium">
                            {continents.find(c => c.id === selectedContinent)?.name}
                          </span>
                        </div>
                        <Badge
                          className="bg-white/20 text-white"
                        >
                          {filteredCountries.length} destinations
                        </Badge>
                      </div>
                    )}

                    <div className="custom-scrollbar flex-1 overflow-y-auto overflow-x-hidden pr-2">
                      <div className="grid grid-cols-2 gap-3">
                        {filteredCountries.map((country) => (
                          <AnimateElement 
                            key={country.code} 
                            animation="scale" 
                            delay={0.05}
                            className="group"
                          >
                            <div
                              className={`relative flex h-28 cursor-pointer flex-col overflow-hidden rounded-lg bg-cover bg-center p-3 transition-all duration-200 
                                ${
                                  selectedCountryCard === country.code
                                    ? 'ring-2 ring-primary-400 ring-offset-2 ring-offset-black/50'
                                    : 'hover:ring-1 hover:ring-white/50'
                                }
                              `}
                              style={{
                                backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.7)), url(${country.flagUrl})`,
                              }}
                              onClick={() => setSelectedCountryCard(country.code)}
                              onError={(e) => {
                                (e.target as HTMLDivElement).style.backgroundImage =
                                  "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600')";
                              }}
                            >
                              <div className="mb-auto flex justify-between">
                                <Badge className="border-none bg-white/20 text-white backdrop-blur-sm">
                                  {country.code}
                                </Badge>
                                
                                {/* Show continent badge */}
                                {searchTerm && countryToContinentMap[country.code.toUpperCase()] && (
                                  <Badge 
                                    className="border-none text-white backdrop-blur-sm"
                                    style={{
                                      background: continents.find(
                                        c => c.id === countryToContinentMap[country.code.toUpperCase()]
                                      )?.color.split(' ')[1] || 'bg-white/20'
                                    }}
                                  >
                                    {continents.find(
                                      c => c.id === countryToContinentMap[country.code.toUpperCase()]
                                    )?.name.substring(0, 3)}
                                  </Badge>
                                )}
                              </div>
                              <div className="mt-5">
                                <h3 className="font-medium text-white">
                                  {country.name}
                                </h3>
                                <p className="mt-1 truncate text-xs text-white/70">
                                  {country.description?.substring(0, 30)}...
                                </p>
                              </div>
                              <div
                                className={`absolute bottom-0 left-0 right-0 flex items-center justify-center bg-gradient-to-t from-primary-500 to-primary-600 p-2 text-xs font-medium text-white 
                                  transition-transform duration-300 ${selectedCountryCard === country.code ? 'translate-y-0' : 'translate-y-full group-hover:translate-y-0'}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCountrySelect(country);
                                }}
                              >
                                <span>Explore Now</span>
                                <ChevronRight className="ml-1 h-3 w-3" />
                              </div>
                            </div>
                          </AnimateElement>
                        ))}
                      </div>

                      {filteredCountries.length === 0 && (
                        <div className="flex h-40 flex-col items-center justify-center rounded-lg bg-white/10 p-4 text-center text-white">
                          <Globe className="mb-3 h-10 w-10 text-white/60" />
                          <p className="mb-1 font-medium text-white">
                            No destinations found
                          </p>
                          <p className="mb-3 text-sm text-white/80">
                            Try a different search term or region
                          </p>
                          <div className="flex gap-2">
                            {searchTerm && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-white/20 bg-white/10 text-white hover:bg-white/20"
                                onClick={() => setSearchTerm('')}
                              >
                                Clear search
                              </Button>
                            )}
                            {selectedContinent && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-white/20 bg-white/10 text-white hover:bg-white/20"
                                onClick={() => setSelectedContinent(null)}
                              >
                                All regions
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {selectedCountryCard && (
                  <div className="mt-4">
                    <Button
                      className="w-full bg-primary-500 text-white hover:bg-primary-600"
                      onClick={() => {
                        const country = countries.find(
                          (c) => c.code === selectedCountryCard
                        );
                        if
