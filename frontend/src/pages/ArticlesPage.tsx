import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCountryStore } from '@/store/countryStore';
import { PageTransition, AnimateElement } from '@/components/common/PageTransition';
import { ArticleSection } from '@/components/features/articles/ArticleSection';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  BookOpen,
  Search,
  Filter,
  Calendar,
  SlidersHorizontal,
  Bookmark,
  Clock,
} from 'lucide-react';

// Types
interface FilterOptions {
  category: string;
  tag: string;
  dateRange: 'all' | 'this-week' | 'this-month' | 'this-year';
  sortBy: 'recent' | 'popular' | 'trending';
}

const ArticlesPage = () => {
  const { selectedCountry, isCountrySelected } = useCountryStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'All Categories',
    tag: 'All',
    dateRange: 'all',
    sortBy: 'recent'
  });

  // Sample article categories and filters
  const articleCategories = [
    'All Categories', 'Travel Guide', 'Food & Dining', 'Culture', 
    'Adventure', 'Photography', 'Tips & Tricks', 'Eco Travel', 'History'
  ];
  
  const articleTags = [
    'All', 'Attractions', 'Beaches', 'Mountains', 'Cities', 'Festivals', 
    'Local Cuisine', 'Hidden Gems', 'Budget Travel', 'Luxury'
  ];
  
  const dateRanges = [
    { value: 'all', label: 'All Time' },
    { value: 'this-week', label: 'This Week' },
    { value: 'this-month', label: 'This Month' },
    { value: 'this-year', label: 'This Year' }
  ];
  
  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'trending', label: 'Trending Now' }
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

  const handleTagChange = (tag: string) => {
    setFilters({ ...filters, tag });
  };

  const handleDateRangeChange = (dateRange: 'all' | 'this-week' | 'this-month' | 'this-year') => {
    setFilters({ ...filters, dateRange });
  };

  const handleSortChange = (sortBy: 'recent' | 'popular' | 'trending') => {
    setFilters({ ...filters, sortBy });
  };

  // Reset all filters
  const handleResetFilters = () => {
    setFilters({
      category: 'All Categories',
      tag: 'All',
      dateRange: 'all',
      sortBy: 'recent'
    });
    setSearchQuery('');
  };

  if (!selectedCountry) return null;

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Decorative floating elements for background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="bg-primary/10 animate-float absolute -left-20 top-[10%] h-40 w-40 rounded-full blur-3xl"></div>
          <div
            className="animate-float absolute -right-20 top-[30%] h-60 w-60 rounded-full bg-blue-600/10 blur-3xl"
            style={{ animationDelay: '2s' }}
          ></div>
        </div>

        {/* Page Header */}
        <section className="relative pt-16 pb-8 md:pt-24 md:pb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AnimateElement animation="fade-down" delay={0.1}>
              <h1 className="text-3xl font-bold tracking-tight mb-2 md:text-4xl lg:text-5xl">
                <span className="flex items-center gap-3">
                  <BookOpen className="h-8 w-8 text-primary" />
                  Travel Articles & Stories
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl">
                Discover insightful guides, inspiring stories, and local perspectives about {selectedCountry.name}.
              </p>
            </AnimateElement>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="py-6 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AnimateElement animation="fade-up" delay={0.2}>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search articles, guides, or topics..."
                    className="pl-10 h-12"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant={showAdvancedFilters ? "secondary" : "outline"} 
                    className="h-12 w-12 p-0 flex items-center justify-center"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  >
                    <SlidersHorizontal className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Advanced Filters */}
              {showAdvancedFilters && (
                <Card className="mt-4 border border-muted/40 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                      {/* Categories */}
                      <div>
                        <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-primary" />
                          Categories
                        </h3>
                        <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto custom-scrollbar">
                          {articleCategories.map(category => (
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

                      {/* Tags */}
                      <div>
                        <h3 className="text-sm font-medium mb-3">Tags</h3>
                        <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto custom-scrollbar">
                          {articleTags.map(tag => (
                            <Badge 
                              key={tag}
                              variant={filters.tag === tag ? "default" : "outline"}
                              className="cursor-pointer"
                              onClick={() => handleTagChange(tag)}
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Date Range */}
                      <div>
                        <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          Date Published
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {dateRanges.map(range => (
                            <Badge 
                              key={range.value}
                              variant={filters.dateRange === range.value ? "default" : "outline"}
                              className="cursor-pointer"
                              onClick={() => handleDateRangeChange(range.value as any)}
                            >
                              {range.label}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Sort Options */}
                      <div>
                        <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                          <Clock className="h-4 w-4 text-primary" />
                          Sort By
                        </h3>
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

        {/* Main Content */}
        <section className="py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AnimateElement animation="fade" delay={0.3}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Featured Articles</h2>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <Bookmark className="h-4 w-4" />
                  Saved Articles
                </Button>
              </div>

              {/* Articles Section */}
              <ArticleSection 
                countryName={selectedCountry.name} 
              />
            </AnimateElement>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default ArticlesPage;
