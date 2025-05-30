import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Map, NavigationControl, Marker, Popup, GeolocateControl } from 'react-map-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MapPin, Coffee, Hotel, Compass, Camera, Search, Filter, X, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGeolocation } from '@/hooks/useGeolocation';
import { cn } from '@/lib/utils';

// Types
interface Coordinates {
  latitude: number;
  longitude: number;
}

interface MapLocation {
  id: string;
  name: string;
  category: 'attraction' | 'hotel' | 'restaurant' | 'cafe' | 'shopping' | 'transportation';
  coordinates: Coordinates;
  rating?: number;
  priceLevel?: number;
  image?: string;
  address: string;
  distance?: number; // meters from current location
}

// Sample data
const mockLocations: MapLocation[] = [
  {
    id: 'loc1',
    name: 'Văn Miếu - Quốc Tử Giám',
    category: 'attraction',
    coordinates: { latitude: 21.0293, longitude: 105.8358 },
    rating: 4.5,
    image: '/images/hanoi.jpg',
    address: '58 Quốc Tử Giám, Đống Đa, Hà Nội',
  },
  {
    id: 'loc2',
    name: 'Khách sạn Metropole Hà Nội',
    category: 'hotel',
    coordinates: { latitude: 21.0245, longitude: 105.8567 },
    rating: 4.8,
    priceLevel: 4,
    image: '/images/metropole.jpg',
    address: '15 P. Ngô Quyền, Hoàn Kiếm, Hà Nội',
  },
  {
    id: 'loc3',
    name: 'Phở Thìn Lò Đúc',
    category: 'restaurant',
    coordinates: { latitude: 21.0138, longitude: 105.8546 },
    rating: 4.3,
    priceLevel: 2,
    image: '/images/pho.jpg',
    address: '13 Lò Đúc, Hai Bà Trưng, Hà Nội',
  },
  {
    id: 'loc4',
    name: 'Cộng Cà Phê',
    category: 'cafe',
    coordinates: { latitude: 21.0312, longitude: 105.8442 },
    rating: 4.2,
    priceLevel: 2,
    image: '/images/coffee.jpg',
    address: '54 P. Nguyễn Hữu Huân, Hoàn Kiếm, Hà Nội',
  },
  {
    id: 'loc5',
    name: 'Hồ Hoàn Kiếm',
    category: 'attraction',
    coordinates: { latitude: 21.0287, longitude: 105.8524 },
    rating: 4.6,
    image: '/images/hoankiem.jpg',
    address: 'P. Lê Thái Tổ, Hoàn Kiếm, Hà Nội',
  },
];

// Styling
const mapStyles = {
  width: '100%',
  height: 'calc(100vh - 4rem)',
  borderRadius: '0.5rem',
};

// Category icons
const categoryIcons: Record<string, React.ReactNode> = {
  attraction: <Camera size={20} />,
  hotel: <Hotel size={20} />,
  restaurant: <MapPin size={20} />,
  cafe: <Coffee size={20} />,
  shopping: <MapPin size={20} />,
  transportation: <Compass size={20} />,
};

// Category colors
const categoryColors: Record<string, string> = {
  attraction: 'bg-blue-500',
  hotel: 'bg-amber-500',
  restaurant: 'bg-green-500',
  cafe: 'bg-orange-500',
  shopping: 'bg-purple-500',
  transportation: 'bg-teal-500',
};

export const InteractiveMap = () => {
  const { t } = useTranslation(['common', 'map']);
  const mapRef = useRef<any>(null);
  const { coordinates: userLocation, error: locationError } = useGeolocation();

  // State
  const [viewState, setViewState] = useState({
    longitude: 105.8342,
    latitude: 21.0278,
    zoom: 14,
  });
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<MapLocation[]>(mockLocations);
  const [mapStyle, setMapStyle] = useState<string>('streets-v11'); // or satellite-v9

  // Filter locations based on search and category filters
  useEffect(() => {
    let results = [...mockLocations];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(location =>
        location.name.toLowerCase().includes(query) ||
        location.address.toLowerCase().includes(query)
      );
    }

    if (activeFilters.length > 0) {
      results = results.filter(location =>
        activeFilters.includes(location.category)
      );
    }

    // Calculate distance if user location is available
    if (userLocation) {
      results = results.map(location => ({
        ...location,
        distance: calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          location.coordinates.latitude,
          location.coordinates.longitude
        )
      })).sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
    }

    setFilteredLocations(results);
  }, [searchQuery, activeFilters, userLocation]);

  // Handle category filter toggle
  const toggleFilter = (category: string) => {
    setActiveFilters(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  // Handle map click to deselect location
  const handleMapClick = () => {
    setSelectedLocation(null);
  };

  // Fly to user location
  const flyToUserLocation = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.flyTo({
        center: [userLocation.longitude, userLocation.latitude],
        zoom: 15
      });
    }
  };

  // Calculate distance between two coordinates in meters
  function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  // Format distance for display
  const formatDistance = (meters?: number): string => {
    if (!meters) return '';
    return meters < 1000
      ? `${Math.round(meters)}m`
      : `${(meters / 1000).toFixed(1)}km`;
  };

  return (
    <div className="relative">
      <Map
        ref={mapRef}
        mapLib={import('maplibre-gl')}
        mapStyle={`https://api.maptiler.com/maps/${mapStyle}/style.json?key=YOUR_MAPTILER_API_KEY`}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        style={mapStyles}
        onClick={handleMapClick}
      >
        <NavigationControl position="bottom-right" />
        <GeolocateControl
          position="bottom-right"
          trackUserLocation={true}
          showUserLocation={true}
        />

        {/* Map markers */}
        {filteredLocations.map(location => (
          <Marker
            key={location.id}
            longitude={location.coordinates.longitude}
            latitude={location.coordinates.latitude}
            anchor="bottom"
            onClick={e => {
              e.originalEvent.stopPropagation();
              setSelectedLocation(location);
            }}
          >
            <div
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full text-white cursor-pointer transform transition-transform hover:scale-110",
                categoryColors[location.category] || "bg-gray-500",
                selectedLocation?.id === location.id ? "ring-2 ring-white shadow-lg scale-125" : ""
              )}
            >
              {categoryIcons[location.category]}
            </div>
          </Marker>
        ))}

        {/* Selected location popup */}
        {selectedLocation && (
          <Popup
            longitude={selectedLocation.coordinates.longitude}
            latitude={selectedLocation.coordinates.latitude}
            anchor="top"
            closeOnClick={false}
            closeButton={true}
            onClose={() => setSelectedLocation(null)}
            className="min-w-[250px] max-w-[300px] z-50"
          >
            <div className="p-2">
              <h3 className="font-bold">{selectedLocation.name}</h3>
              {selectedLocation.image && (
                <img
                  src={selectedLocation.image}
                  alt={selectedLocation.name}
                  className="w-full h-28 object-cover rounded-md my-2"
                />
              )}
              <div className="text-sm text-muted-foreground mb-1">{selectedLocation.address}</div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <Badge variant="secondary">
                    {t(`map.category.${selectedLocation.category}`)}
                  </Badge>
                  {selectedLocation.distance && (
                    <span className="text-xs text-muted-foreground">
                      {formatDistance(selectedLocation.distance)}
                    </span>
                  )}
                </div>
                <Button size="sm" variant="outline">
                  {t('details')}
                </Button>
              </div>
            </div>
          </Popup>
        )}
      </Map>

      {/* Search and filters overlay */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-col gap-4">
        <Card className="bg-background/95 backdrop-blur-sm border shadow-lg">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('map.searchPlaces')}
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                  onClick={flyToUserLocation}
                >
                  <Compass size={18} />
                </Button>

                <Button variant="outline" className="gap-2 shrink-0">
                  <Filter size={16} />
                  {activeFilters.length ? `${activeFilters.length} ${t('active')}` : t('filter')}
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                  onClick={() => setMapStyle(mapStyle === 'streets-v11' ? 'satellite-v9' : 'streets-v11')}
                >
                  <Layers size={18} />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-2 overflow-x-auto pb-2 px-1">
          <Button
            variant={activeFilters.includes('attraction') ? 'default' : 'outline'}
            size="sm"
            className="rounded-full flex gap-2 shadow-sm bg-background/95 backdrop-blur-sm"
            onClick={() => toggleFilter('attraction')}
          >
            <Camera size={16} />
            {t('map.category.attraction')}
            {activeFilters.includes('attraction') && (
              <X size={14} className="ml-1" />
            )}
          </Button>

          <Button
            variant={activeFilters.includes('hotel') ? 'default' : 'outline'}
            size="sm"
            className="rounded-full flex gap-2 shadow-sm bg-background/95 backdrop-blur-sm"
            onClick={() => toggleFilter('hotel')}
          >
            <Hotel size={16} />
            {t('map.category.hotel')}
            {activeFilters.includes('hotel') && (
              <X size={14} className="ml-1" />
            )}
          </Button>

          <Button
            variant={activeFilters.includes('restaurant') ? 'default' : 'outline'}
            size="sm"
            className="rounded-full flex gap-2 shadow-sm bg-background/95 backdrop-blur-sm"
            onClick={() => toggleFilter('restaurant')}
          >
            <MapPin size={16} />
            {t('map.category.restaurant')}
            {activeFilters.includes('restaurant') && (
              <X size={14} className="ml-1" />
            )}
          </Button>

          <Button
            variant={activeFilters.includes('cafe') ? 'default' : 'outline'}
            size="sm"
            className="rounded-full flex gap-2 shadow-sm bg-background/95 backdrop-blur-sm"
            onClick={() => toggleFilter('cafe')}
          >
            <Coffee size={16} />
            {t('map.category.cafe')}
            {activeFilters.includes('cafe') && (
              <X size={14} className="ml-1" />
            )}
          </Button>
        </div>
      </div>

      {/* Nearby locations panel */}
      <div className="absolute bottom-4 left-4 w-96 max-w-[calc(100%-2rem)] z-10">
        <Card className="bg-background/95 backdrop-blur-sm border shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t('map.nearbyPlaces')}</CardTitle>
            <CardDescription>{t('map.locationCount', { count: filteredLocations.length })}</CardDescription>
          </CardHeader>
          <Tabs defaultValue="all">
            <div className="px-4">
              <TabsList className="w-full">
                <TabsTrigger value="all" className="flex-1">{t('all')}</TabsTrigger>
                <TabsTrigger value="saved" className="flex-1">{t('saved')}</TabsTrigger>
                <TabsTrigger value="visited" className="flex-1">{t('visited')}</TabsTrigger>
              </TabsList>
            </div>
            <CardContent className="h-72 overflow-auto py-3">
              {filteredLocations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <MapPin className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-1">{t('map.noLocationsFound')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('map.tryDifferentSearch')}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredLocations.map((location) => (
                    <div
                      key={location.id}
                      className={cn(
                        "border rounded-lg p-3 cursor-pointer hover:border-primary transition-colors",
                        selectedLocation?.id === location.id ? "border-primary bg-primary/5" : ""
                      )}
                      onClick={() => {
                        setSelectedLocation(location);
                        mapRef.current?.flyTo({
                          center: [location.coordinates.longitude, location.coordinates.latitude],
                          zoom: 15
                        });
                      }}
                    >
                      <div className="flex gap-3">
                        <div
                          className={cn(
                            "flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-white",
                            categoryColors[location.category] || "bg-gray-500"
                          )}
                        >
                          {categoryIcons[location.category]}
                        </div>
                        <div className="flex-grow min-w-0">
                          <h4 className="font-medium text-sm truncate">
                            {location.name}
                          </h4>
                          <p className="text-xs text-muted-foreground truncate">
                            {location.address}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            {location.rating && (
                              <Badge variant="secondary" className="text-[10px] h-4 px-1">
                                ★ {location.rating}
                              </Badge>
                            )}
                            {location.distance && (
                              <span className="text-xs text-muted-foreground">
                                {formatDistance(location.distance)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};
