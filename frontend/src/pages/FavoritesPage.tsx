import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCountryStore } from '@/store/countryStore';
import { PageTransition, AnimateElement } from '@/components/common/PageTransition';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Heart,
  MapPin,
  Star,
  Search,
  Building,
  Utensils,
  BookOpen,
  MapPinned,
  CalendarDays,
  User,
  Clock,
  X,
  Filter,
  SlidersHorizontal,
} from 'lucide-react';

// Types for favorite items
interface FavoriteLocation {
  id: string;
  name: string;
  description: string;
  image: string;
  type: 'location';
  category: string;
  rating: number;
  savedAt: string;
}

interface FavoriteAccommodation {
  id: string;
  name: string;
  description: string;
  image: string;
  type: 'accommodation';
  category: string;
  price: string;
  rating: number;
  savedAt: string;
}

interface FavoriteFood {
  id: string;
  name: string;
  description: string;
  image: string;
  type: 'food';
  category: string;
  cuisine: string;
  price: string;
  rating: number;
  savedAt: string;
}

interface FavoriteGuide {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  type: 'guide';
  author: {
    name: string;
    avatar: string;
  };
  readTime: string;
  rating: number;
  savedAt: string;
}

type FavoriteItem = FavoriteLocation | FavoriteAccommodation | FavoriteFood | FavoriteGuide;

const FavoritesPage = () => {
  const { selectedCountry, isCountrySelected } = useCountryStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'locations' | 'accommodation' | 'food' | 'guides'>('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortOrder, setSortOrder] = useState<'recent' | 'rating' | 'name'>('recent');

  // Mock favorites data
  const mockFavorites: FavoriteItem[] = [
    // Locations
    {
      id: 'loc1',
      name: 'Ha Long Bay',
      description: 'Stunning limestone islands rising from emerald waters, a UNESCO World Heritage site.',
      image: 'https://images.unsplash.com/photo-1573270689103-d7a4e42b609a',
      type: 'location',
      category: 'Natural Wonder',
      rating: 4.9,
      savedAt: '2025-04-15',
    },
    {
      id: 'loc2',
      name: 'Hoi An Ancient Town',
      description: 'Beautifully preserved historic trading port known for its colorful lanterns and tailors.',
      image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b',
      type: 'location',
      category: 'UNESCO Site',
      rating: 4.8,
      savedAt: '2025-04-20',
    },
    // Accommodations
    {
      id: 'acc1',
      name: 'Riverside Boutique Resort',
      description: 'Luxury resort with stunning views and traditional Vietnamese architecture.',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b',
      type: 'accommodation',
      category: 'Resort',
      price: '$$$',
      rating: 4.7,
      savedAt: '2025-05-01',
    },
    {
      id: 'acc2',
      name: 'Old Quarter Homestay',
      description: 'Authentic local experience in a traditional house in Hanoi\'s historic district.',
      image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074',
      type: 'accommodation',
      category: 'Homestay',
      price: '$$',
      rating: 4.6,
      savedAt: '2025-05-05',
    },
    // Foods
    {
      id: 'food1',
      name: 'Pho Bo',
      description: 'Traditional Vietnamese beef noodle soup with aromatic herbs and spices.',
      image: 'https://images.unsplash.com/photo-1569058242567-93de6f36f8eb',
      type: 'food',
      category: 'Soup',
      cuisine: 'Traditional',
      price: '$',
      rating: 4.8,
      savedAt: '2025-05-10',
    },
    {
      id: 'food2',
      name: 'Banh Mi',
      description: 'Crispy baguette filled with savory meats, pickled vegetables, and fresh herbs.',
      image: 'https://images.unsplash.com/photo-1600628421055-4d30de868b8f',
      type: 'food',
      category: 'Sandwich',
      cuisine: 'Fusion',
      price: '$',
      rating: 4.5,
      savedAt: '2025-05-12',
    },
    // Guides
    {
      id: 'guide1',
      title: 'Ultimate Guide to Exploring Vietnam\'s Hidden Gems',
      excerpt: 'Discover lesser-known destinations, local experiences, and authentic cultural insights.',
      image: 'https://images.unsplash.com/photo-1528127269322-539801943592',
      type: 'guide',
      author: {
        name: 'Minh Nguyen',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      },
      readTime: '15 min read',
      rating: 4.8,
      savedAt: '2025-05-10',
    },
    {
      id: 'guide2',
      title: 'Street Food Tour: Hanoi\'s Best Culinary Experiences',
      excerpt: 'A food lover\'s journey through the bustling streets of Vietnam\'s capital.',
      image: 'https://images.unsplash.com/photo-1590492290883-08debf249d6f',
      type: 'guide',
      author: {
        name: 'Linh Tran',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      },
      readTime: '12 min read',
      rating: 4.9,
      savedAt: '2025-05-02',
    },
  ];

  // Filter favorites based on search, active tab, and category
  const filteredFavorites = mockFavorites.filter(item => {
    // Filter by search query
    const matchesSearch = searchQuery === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.type === 'guide' && item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      ('description' in item && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filter by tab
    const matchesTab = activeTab === 'all' || activeTab === item.type + 's';
    
    // Filter by category
    const matchesCategory = !selectedCategory || 
      ('category' in item && item.category === selectedCategory);
    
    return matchesSearch && matchesTab && matchesCategory;
  });

  // Sort favorites
  const sortedFavorites = [...filteredFavorites].sort((a, b) => {
    if (sortOrder === 'recent') {
      return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime();
    } else if (sortOrder === 'rating') {
      return b.rating - a.rating;
    } else {
      // Sort by name
      const nameA = a.type === 'guide' ? a.title : a.name;
      const nameB = b.type === 'guide' ? b.title : b.name;
      return nameA.localeCompare(nameB);
    }
  });

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

  // Format date function
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setActiveTab('all');
    setSortOrder('recent');
  };

  // Get all unique categories
  const allCategories = Array.from(new Set(
    mockFavorites
      .filter(item => 'category' in item)
      .map(item => (item as any).category)
  ));

  // Remove item from favorites (would connect to API in real app)
  const removeFromFavorites = (id: string) => {
    // In a real app, this would call an API to remove the item
    // For this demo, we'll just show what it would look like
    alert(`Item ${id} would be removed from favorites`);
  };

  if (!selectedCountry) return null;

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Decorative floating elements for background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="bg-primary/10 animate-float absolute -left-20 top-[10%] h-40 w-40 rounded-full blur-3xl"></div>
          <div
            className="animate-float absolute -right-20 top-[30%] h-60 w-60 rounded-full bg-pink-600/10 blur-3xl"
            style={{ animationDelay: '2s' }}
          ></div>
        </div>

        {/* Page Header */}
        <section className="relative pt-16 pb-8 md:pt-24 md:pb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AnimateElement animation="fade-down" delay={0.1}>
              <h1 className="text-3xl font-bold tracking-tight mb-2 md:text-4xl lg:text-5xl">
                <span className="flex items-center gap-3">
                  <Heart className="h-8 w-8 text-primary" />
                  My Favorites
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl">
                All your saved places, accommodations, food, and guides in one place.
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
                    placeholder="Search your favorites..."
                    className="pl-10 h-12"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="h-12"
                    onClick={clearFilters}
                    disabled={!searchQuery && !selectedCategory && activeTab === 'all' && sortOrder === 'recent'}
                  >
                    Clear Filters
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
              <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-4">
                <Button
                  variant={activeTab === 'all' ? "secondary" : "outline"}
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => setActiveTab('all')}
                >
                  <Heart className="h-4 w-4" />
                  All Favorites ({mockFavorites.length})
                </Button>
                <Button
                  variant={activeTab === 'locations' ? "secondary" : "outline"}
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => setActiveTab('locations')}
                >
                  <MapPinned className="h-4 w-4" />
                  Locations ({mockFavorites.filter(item => item.type === 'location').length})
                </Button>
                <Button
                  variant={activeTab === 'accommodation' ? "secondary" : "outline"}
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => setActiveTab('accommodation')}
                >
                  <Building className="h-4 w-4" />
                  Accommodations ({mockFavorites.filter(item => item.type === 'accommodation').length})
                </Button>
                <Button
                  variant={activeTab === 'food' ? "secondary" : "outline"}
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => setActiveTab('food')}
                >
                  <Utensils className="h-4 w-4" />
                  Food ({mockFavorites.filter(item => item.type === 'food').length})
                </Button>
                <Button
                  variant={activeTab === 'guides' ? "secondary" : "outline"}
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => setActiveTab('guides')}
                >
                  <BookOpen className="h-4 w-4" />
                  Guides ({mockFavorites.filter(item => item.type === 'guide').length})
                </Button>
              </div>

              {/* Advanced filters */}
              {showAdvancedFilters && (
                <Card className="mb-4 border border-muted/40 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Categories filter */}
                      <div>
                        <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                          <Filter className="h-4 w-4 text-primary" />
                          Categories
                        </h3>
                        <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto custom-scrollbar">
                          {allCategories.map(category => (
                            <Badge 
                              key={category}
                              variant={selectedCategory === category ? "default" : "outline"}
                              className="cursor-pointer"
                              onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                            >
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Sort order */}
                      <div>
                        <h3 className="text-sm font-medium mb-3">Sort By</h3>
                        <div className="flex flex-wrap gap-2">
                          <Badge 
                            variant={sortOrder === 'recent' ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => setSortOrder('recent')}
                          >
                            Most Recent
                          </Badge>
                          <Badge 
                            variant={sortOrder === 'rating' ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => setSortOrder('rating')}
                          >
                            Highest Rated
                          </Badge>
                          <Badge 
                            variant={sortOrder === 'name' ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => setSortOrder('name')}
                          >
                            Name (A-Z)
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </AnimateElement>
          </div>
        </section>

        {/* Favorites List */}
        <section className="py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AnimateElement animation="fade" delay={0.3}>
              {sortedFavorites.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedFavorites.map(item => (
                    <Card key={item.id} className="group overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative aspect-video">
                        <img
                          src={item.image}
                          alt={item.type === 'guide' ? item.title : item.name}
                          className="w-full h-full object-cover"
                        />
                        <Button 
                          size="icon" 
                          variant="destructive"
                          className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeFromFavorites(item.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="icon" 
                          className="absolute top-2 left-2 h-8 w-8 bg-white/20 backdrop-blur-sm hover:bg-white/30"
                        >
                          <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                        </Button>

                        {/* Type badge */}
                        <Badge className="absolute bottom-2 left-2 bg-primary/80 backdrop-blur-sm text-white">
                          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        {item.type === 'guide' ? (
                          <>
                            <h3 className="font-bold text-lg line-clamp-2 mb-2">{item.title}</h3>
                            <div className="flex items-center gap-2 mb-2">
                              <img 
                                src={item.author.avatar} 
                                alt={item.author.name}
                                className="w-6 h-6 rounded-full border border-muted"
                              />
                              <span className="text-xs font-medium">{item.author.name}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.excerpt}</p>
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>{item.readTime}</span>
                              </div>
                              <div className="flex items-center gap-1 text-amber-500">
                                <Star className="h-4 w-4 fill-amber-500" />
                                <span>{item.rating}</span>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {'category' in item && (
                                <Badge variant="outline">{item.category}</Badge>
                              )}
                              {'cuisine' in item && item.cuisine && (
                                <Badge variant="outline">{item.cuisine}</Badge>
                              )}
                              {'price' in item && (
                                <Badge variant="secondary">{item.price}</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{item.description}</p>
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <CalendarDays className="h-4 w-4" />
                                <span>Saved {formatDate(item.savedAt)}</span>
                              </div>
                              <div className="flex items-center gap-1 text-amber-500">
                                <Star className="h-4 w-4 fill-amber-500" />
                                <span>{item.rating}</span>
                              </div>
                            </div>
                          </>
                        )}
                      </CardContent>
                      <CardFooter className="px-4 pb-4 pt-0">
                        <Button className="w-full">
                          {item.type === 'guide' ? 'Read Guide' : 'View Details'}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <Heart className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">No favorites found</h3>
                  <p className="text-muted-foreground mb-6">
                    {searchQuery || selectedCategory || activeTab !== 'all' 
                      ? "Try adjusting your filters to see more results" 
                      : "Start exploring to add some favorites"}
                  </p>
                  {(searchQuery || selectedCategory || activeTab !== 'all') && (
                    <Button onClick={clearFilters}>Clear All Filters</Button>
                  )}
                </div>
              )}
            </AnimateElement>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default FavoritesPage;
