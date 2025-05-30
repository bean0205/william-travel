import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building, 
  Filter, 
  Star, 
  Wifi, 
  Coffee, 
  Bath, 
  ParkingCircle,
  Utensils,
  MapPin, 
  ArrowRight,
  Heart,
  BedDouble
} from 'lucide-react';

// Define types
interface Accommodation {
  id: string;
  name: string;
  type: string;
  rating: number;
  price: number;
  currency: string;
  image: string;
  location: string;
  amenities: string[];
  description: string;
  distance?: string;
}

interface AccommodationSectionProps {
  countryName: string;
  location?: string;
}

// Sample data for accommodations
const mockAccommodations: Accommodation[] = [
  {
    id: '1',
    name: 'Grand Plaza Hotel',
    type: 'Hotel',
    rating: 4.7,
    price: 120,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
    location: 'City Center',
    amenities: ['Free Wifi', 'Pool', 'Restaurant', 'Parking', 'Spa'],
    description: 'Luxury hotel in the heart of the city with stunning views and premium amenities.',
    distance: '0.5 km from city center',
  },
  {
    id: '2',
    name: 'Riverside Homestay',
    type: 'Homestay',
    rating: 4.8,
    price: 45,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739',
    location: 'Riverfront District',
    amenities: ['Free Wifi', 'Kitchen', 'Garden', 'Local Guide'],
    description: 'Authentic homestay experience with a local family in a traditional house.',
    distance: '1.2 km from city center',
  },
  {
    id: '3',
    name: 'Modern Urban Apartment',
    type: 'Apartment',
    rating: 4.6,
    price: 80,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
    location: 'Shopping District',
    amenities: ['Free Wifi', 'Kitchen', 'Washer', 'Air Conditioning'],
    description: 'Contemporary apartment with all modern conveniences in the shopping district.',
    distance: '0.8 km from city center',
  },
  {
    id: '4',
    name: 'Tropical Beachfront Resort',
    type: 'Resort',
    rating: 4.9,
    price: 220,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4',
    location: 'Coastal Area',
    amenities: ['Private Beach', 'Pool', 'Spa', 'Restaurant', 'Water Sports'],
    description: 'Luxurious beachfront resort with private beach access and water activities.',
    distance: '5.0 km from city center',
  },
  {
    id: '5',
    name: 'Cozy Backpacker Hostel',
    type: 'Hostel',
    rating: 4.3,
    price: 15,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5',
    location: 'Old Quarter',
    amenities: ['Free Wifi', 'Shared Kitchen', 'Lounge', 'Breakfast'],
    description: 'Budget-friendly hostel with a social atmosphere, perfect for backpackers.',
    distance: '1.0 km from city center',
  },
  {
    id: '6',
    name: 'Traditional Wooden Villa',
    type: 'Villa',
    rating: 4.8,
    price: 150,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233',
    location: 'Cultural District',
    amenities: ['Private Garden', 'Kitchen', 'Cultural Decor', 'Free Parking'],
    description: 'Beautiful traditional villa showcasing local architecture and design.',
    distance: '2.2 km from city center',
  },
];

// Define accommodation types
const accommodationTypes = ['All', 'Hotel', 'Homestay', 'Apartment', 'Resort', 'Villa', 'Hostel'];

// Define price ranges
const priceRanges = ['All', 'Budget', 'Mid-range', 'Luxury'];

export function AccommodationSection({ countryName, location }: AccommodationSectionProps) {
  const [activeType, setActiveType] = useState('All');
  const [activePriceRange, setActivePriceRange] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  // Function to determine price category
  const getPriceCategory = (price: number): string => {
    if (price < 50) return 'Budget';
    if (price < 150) return 'Mid-range';
    return 'Luxury';
  };

  // Filter accommodations based on selected type and price range
  const filteredAccommodations = mockAccommodations.filter(accommodation => {
    const typeMatch = activeType === 'All' || accommodation.type === activeType;
    
    const priceCategory = getPriceCategory(accommodation.price);
    const priceMatch = activePriceRange === 'All' || priceCategory === activePriceRange;
    
    return typeMatch && priceMatch;
  });

  // Render amenity icon
  const renderAmenityIcon = (amenity: string) => {
    if (amenity.includes('Wifi')) return <Wifi className="w-3 h-3" />;
    if (amenity.includes('Pool')) return <Bath className="w-3 h-3" />;
    if (amenity.includes('Restaurant')) return <Utensils className="w-3 h-3" />;
    if (amenity.includes('Parking')) return <ParkingCircle className="w-3 h-3" />;
    if (amenity.includes('Breakfast')) return <Coffee className="w-3 h-3" />;
    if (amenity.includes('Kitchen')) return <Utensils className="w-3 h-3" />;
    return <BedDouble className="w-3 h-3" />;
  };

  return (
    <section className="py-8 bg-background md:py-12">
      <div className="container px-4 mx-auto sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 mb-8 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              <span className="flex items-center gap-2">
                <Building className="w-6 h-6 text-primary" />
                Places to Stay
              </span>
            </h2>
            <p className="mt-1 text-muted-foreground">
              {location ? `Find accommodation in ${location}` : `Where to stay in ${countryName}`}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={showFilters ? "secondary" : "outline"} 
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <Card className="mb-6 border border-muted/40 bg-card/50 backdrop-blur-sm">
            <CardContent className="px-4 py-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="mb-3 text-sm font-medium">Accommodation Type</h3>
                  <div className="flex flex-wrap gap-2">
                    {accommodationTypes.map(type => (
                      <Badge 
                        key={type}
                        variant={activeType === type ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setActiveType(type)}
                      >
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="mb-3 text-sm font-medium">Price Range</h3>
                  <div className="flex flex-wrap gap-2">
                    {priceRanges.map(price => (
                      <Badge 
                        key={price}
                        variant={activePriceRange === price ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setActivePriceRange(price)}
                      >
                        {price}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Accommodations list */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAccommodations.map(accommodation => (
            <Card
              key={accommodation.id}
              className="group overflow-hidden transition-all duration-300 hover:shadow-lg dark:bg-card dark:hover:shadow-primary/5"
            >
              <Link to={`/accommodations/${accommodation.id}`} className="block">
                <div className="relative w-full h-48 overflow-hidden">
                  <img
                    src={accommodation.image}
                    alt={accommodation.name}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute z-10 top-2 right-2 h-8 w-8 bg-black/20 hover:bg-black/30 text-white backdrop-blur-sm"
                    onClick={(e) => {
                      e.preventDefault();
                      // Add to favorites function
                    }}
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent pt-10 pb-4 px-4">
                    <Badge className="bg-primary/80 backdrop-blur-sm text-white">
                      {accommodation.type}
                    </Badge>
                    <h3 className="mt-2 text-lg font-bold text-white">
                      {accommodation.name}
                    </h3>
                  </div>
                </div>
              </Link>

              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-yellow-500" />
                    <span className="font-medium">{accommodation.rating}</span>
                  </div>
                  <div className="font-semibold text-right">
                    ${accommodation.price}
                    <span className="block text-xs text-muted-foreground">per night</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-3 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span>{accommodation.location}</span>
                  {accommodation.distance && (
                    <span className="ml-1 text-xs">({accommodation.distance})</span>
                  )}
                </div>

                <Link to={`/accommodations/${accommodation.id}`}>
                  <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                    {accommodation.description}
                  </p>
                </Link>

                <div className="flex flex-wrap items-center gap-2 pt-2 text-xs border-t border-border">
                  {accommodation.amenities.slice(0, 4).map((amenity, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1 bg-muted/50">
                      {renderAmenityIcon(amenity)}
                      {amenity}
                    </Badge>
                  ))}
                  {accommodation.amenities.length > 4 && (
                    <Badge variant="outline">+{accommodation.amenities.length - 4}</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-center mt-8">
          <Button variant="outline" className="group">
            View All Accommodations
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
}
