import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Utensils, Filter, Star, Clock, MapPin, ArrowRight } from 'lucide-react';

// Define types
interface Food {
  id: string;
  name: string;
  category: string;
  cuisine: string;
  rating: number;
  price: string;
  image: string;
  location: string;
  timeOpen: string;
  description: string;
}

interface FoodSectionProps {
  countryName: string;
  location?: string;
}

// Sample data for foods
const mockFoods: Food[] = [
  {
    id: '1',
    name: 'Pho Bo',
    category: 'Soup',
    cuisine: 'Traditional',
    rating: 4.8,
    price: '$$',
    image: 'https://images.unsplash.com/photo-1503764654157-72d979d9af2f',
    location: 'Hanoi Food Street',
    timeOpen: '6:00 AM - 10:00 PM',
    description: 'Traditional Vietnamese beef noodle soup with aromatic herbs and spices.'
  },
  {
    id: '2',
    name: 'Banh Mi',
    category: 'Sandwich',
    cuisine: 'Fusion',
    rating: 4.5,
    price: '$',
    image: 'https://images.unsplash.com/photo-1600626886861-f6ed8da4066f',
    location: 'Local Market',
    timeOpen: '7:00 AM - 8:00 PM',
    description: 'Crispy baguette filled with savory meats, pickled vegetables, and fresh herbs.'
  },
  {
    id: '3',
    name: 'Bun Cha',
    category: 'Noodles',
    cuisine: 'Traditional',
    rating: 4.7,
    price: '$$',
    image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba',
    location: 'Old Quarter',
    timeOpen: '11:00 AM - 9:00 PM',
    description: 'Grilled pork with rice noodles, herbs, and dipping sauce.'
  },
  {
    id: '4',
    name: 'Cha Ca',
    category: 'Seafood',
    cuisine: 'Regional',
    rating: 4.6,
    price: '$$$',
    image: 'https://images.unsplash.com/photo-1559847844-5315695dadae',
    location: 'Cha Ca Street',
    timeOpen: '11:30 AM - 10:00 PM',
    description: 'Turmeric-marinated fish served with rice noodles, peanuts, and herbs.'
  },
  {
    id: '5',
    name: 'Goi Cuon',
    category: 'Appetizer',
    cuisine: 'Traditional',
    rating: 4.4,
    price: '$',
    image: 'https://images.unsplash.com/photo-1562967916-eb82221dfb92',
    location: 'Central District',
    timeOpen: '10:00 AM - 8:00 PM',
    description: 'Fresh spring rolls with shrimp, herbs, and rice noodles.'
  },
  {
    id: '6',
    name: 'Ca Phe Trung',
    category: 'Beverage',
    cuisine: 'Specialty',
    rating: 4.9,
    price: '$',
    image: 'https://images.unsplash.com/photo-1608651057580-4a150ad53ecc',
    location: 'Old Quarter Cafe',
    timeOpen: '7:00 AM - 11:00 PM',
    description: 'Vietnamese egg coffee - a sweet, custard-like coffee drink.'
  },
];

// Define categories
const foodCategories = [
  'All',
  'Traditional',
  'Seafood',
  'Noodles',
  'Street Food',
  'Dessert',
  'Beverage'
];

// Define price ranges
const priceRanges = ['All', '$', '$$', '$$$', '$$$$'];

export function FoodSection({ countryName, location }: FoodSectionProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activePriceRange, setActivePriceRange] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  // Filter foods based on selected category and price range
  const filteredFoods = mockFoods.filter(food => {
    const categoryMatch = activeCategory === 'All' || 
                          food.category === activeCategory || 
                          food.cuisine === activeCategory;
    
    const priceMatch = activePriceRange === 'All' || food.price === activePriceRange;
    
    return categoryMatch && priceMatch;
  });

  return (
    <section className="py-8 bg-background dark:bg-background md:py-12">
      <div className="container px-4 mx-auto sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 mb-8 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              <span className="flex items-center gap-2">
                <Utensils className="w-6 h-6 text-primary" />
                Local Cuisine
              </span>
            </h2>
            <p className="mt-1 text-muted-foreground">
              {location ? `Discover ${location}'s` : `Explore ${countryName}'s`} delicious food and culinary traditions
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
                  <h3 className="mb-3 text-sm font-medium">Cuisine Type</h3>
                  <div className="flex flex-wrap gap-2">
                    {foodCategories.map(category => (
                      <Badge 
                        key={category}
                        variant={activeCategory === category ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setActiveCategory(category)}
                      >
                        {category}
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

        {/* Food list */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredFoods.map(food => (
            <Card
              key={food.id}
              className="group overflow-hidden transition-all duration-300 hover:shadow-lg dark:bg-card dark:hover:shadow-primary/5"
            >
              <Link to={`/food/${food.id}`} className="block">
                <div className="relative w-full h-48 overflow-hidden">
                  <img
                    src={food.image}
                    alt={food.name}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent pt-10 pb-4 px-4">
                    <Badge className="bg-primary/80 backdrop-blur-sm text-white">
                      {food.category}
                    </Badge>
                    <h3 className="mt-2 text-lg font-bold text-white">
                      {food.name}
                    </h3>
                  </div>
                </div>
              </Link>

              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-yellow-500" />
                    <span className="font-medium">{food.rating}</span>
                  </div>
                  <Badge variant="outline">{food.price}</Badge>
                </div>

                <Link to={`/food/${food.id}`}>
                  <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                    {food.description}
                  </p>
                </Link>

                <div className="flex flex-col gap-1 pt-2 text-xs text-muted-foreground border-t border-border">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{food.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{food.timeOpen}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-center mt-8">
          <Button variant="outline" className="group">
            View All Cuisine
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
}
