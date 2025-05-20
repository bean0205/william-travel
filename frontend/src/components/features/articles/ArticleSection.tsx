import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  Filter,
  Clock,
  ArrowRight,
  ThumbsUp,
  Eye,
  BookmarkPlus,
  Calendar
} from 'lucide-react';

// Define types
interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  image: string;
  author: {
    name: string;
    avatar: string;
  };
  publishedAt: string;
  readTime: string;
  likes: number;
  views: number;
}

interface ArticleSectionProps {
  countryName: string;
  location?: string;
}

// Sample data for articles
const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Top 10 Must-Visit Attractions in Hanoi',
    excerpt: 'Discover the most iconic places in Vietnam\'s capital city that showcase its rich history and culture.',
    category: 'Travel Guide',
    tags: ['Attractions', 'Culture', 'City Guide'],
    image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375',
    author: {
      name: 'Minh Nguyen',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    publishedAt: '2025-04-15',
    readTime: '8 min read',
    likes: 243,
    views: 4521
  },
  {
    id: '2',
    title: 'A Culinary Journey Through Vietnamese Street Food',
    excerpt: 'Explore the vibrant street food scene of Vietnam with this comprehensive guide to local delicacies.',
    category: 'Food & Dining',
    tags: ['Food', 'Street Food', 'Cuisine'],
    image: 'https://images.unsplash.com/photo-1508166022924-4701fcd7a4c2',
    author: {
      name: 'Linh Tran',
      avatar: 'https://randomuser.me/api/portraits/women/65.jpg'
    },
    publishedAt: '2025-04-02',
    readTime: '12 min read',
    likes: 158,
    views: 3207
  },
  {
    id: '3',
    title: 'Exploring Vietnam\'s Hidden Beaches and Islands',
    excerpt: 'Venture beyond the popular beaches to discover secluded paradise spots along Vietnam\'s coastline.',
    category: 'Adventure',
    tags: ['Beaches', 'Islands', 'Nature'],
    image: 'https://images.unsplash.com/photo-1546484475-7f7bd55792da',
    author: {
      name: 'David Wilson',
      avatar: 'https://randomuser.me/api/portraits/men/47.jpg'
    },
    publishedAt: '2025-03-21',
    readTime: '10 min read',
    likes: 189,
    views: 2756
  },
  {
    id: '4',
    title: 'Traditional Crafts of Northern Vietnam: A Photo Essay',
    excerpt: 'Intimate portraits of artisans keeping ancient crafting traditions alive in the villages of northern Vietnam.',
    category: 'Culture',
    tags: ['Crafts', 'Traditions', 'Photography'],
    image: 'https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534',
    author: {
      name: 'Mai Pham',
      avatar: 'https://randomuser.me/api/portraits/women/22.jpg'
    },
    publishedAt: '2025-03-10',
    readTime: '15 min read',
    likes: 201,
    views: 1892
  },
  {
    id: '5',
    title: 'Ultimate Guide to Trekking in Sapa\'s Terraced Mountains',
    excerpt: 'Everything you need to know about hiking in Vietnam\'s breathtaking northern highlands region.',
    category: 'Adventure',
    tags: ['Trekking', 'Mountains', 'Outdoor'],
    image: 'https://images.unsplash.com/photo-1512291647282-5e9ac15fab11',
    author: {
      name: 'John Reeves',
      avatar: 'https://randomuser.me/api/portraits/men/72.jpg'
    },
    publishedAt: '2025-02-28',
    readTime: '18 min read',
    likes: 312,
    views: 5647
  },
  {
    id: '6',
    title: 'Sustainable Tourism Initiatives in Vietnam',
    excerpt: 'Learn about eco-friendly travel options and conservation projects that protect Vietnam\'s natural beauty.',
    category: 'Eco Travel',
    tags: ['Sustainability', 'Eco-Friendly', 'Conservation'],
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592',
    author: {
      name: 'Emma Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/33.jpg'
    },
    publishedAt: '2025-02-15',
    readTime: '14 min read',
    likes: 176,
    views: 2103
  },
];

// Article categories
const articleCategories = [
  'All Categories',
  'Travel Guide',
  'Food & Dining',
  'Adventure',
  'Culture',
  'Eco Travel',
  'History'
];

export const ArticleSection = ({ countryName, location }: ArticleSectionProps) => {
  const [activeCategory, setActiveCategory] = useState('All Categories');
  const [showFilters, setShowFilters] = useState(false);

  // Filter articles based on selected category
  const filteredArticles = mockArticles.filter(article => {
    return activeCategory === 'All Categories' || article.category === activeCategory;
  });

  // Format date function
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <section className="py-8 bg-muted/30 md:py-12">
      <div className="container px-4 mx-auto sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 mb-8 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              <span className="flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-primary" />
                Travel Stories & Guides
              </span>
            </h2>
            <p className="mt-1 text-muted-foreground">
              {location ? `Read about experiences in ${location}` : `Articles and guides about ${countryName}`}
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
              Categories
            </Button>
          </div>
        </div>

        {/* Filters/Categories */}
        {showFilters && (
          <Card className="mb-6 border border-muted/40 bg-card/50 backdrop-blur-sm">
            <CardContent className="px-4 py-4">
              <div>
                <h3 className="mb-3 text-sm font-medium">Browse by Category</h3>
                <div className="flex flex-wrap gap-2">
                  {articleCategories.map(category => (
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
            </CardContent>
          </Card>
        )}

        {/* Articles list */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map(article => (
            <Card
              key={article.id}
              className="group overflow-hidden transition-all duration-300 hover:shadow-lg dark:bg-card dark:hover:shadow-primary/5"
            >
              <Link to={`/articles/${article.id}`} className="block">
                <div className="relative w-full h-48 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-primary/80 backdrop-blur-sm text-white">
                      {article.category}
                    </Badge>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute z-10 top-4 right-4 h-8 w-8 bg-black/20 hover:bg-black/30 text-white backdrop-blur-sm"
                    onClick={(e) => {
                      e.preventDefault();
                      // Add bookmark function here
                    }}
                  >
                    <BookmarkPlus className="w-4 h-4" />
                  </Button>
                </div>
              </Link>

              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <img
                      src={article.author.avatar}
                      alt={article.author.name}
                      className="w-6 h-6 rounded-full border border-muted"
                    />
                    <span className="text-xs font-medium">{article.author.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">•</span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(article.publishedAt)}</span>
                  </div>
                </div>

                <Link to={`/articles/${article.id}`}>
                  <h3 className="mb-2 text-lg font-bold line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>

                  <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                    {article.excerpt}
                  </p>
                </Link>

                <div className="flex items-center justify-between pt-2 text-xs border-t border-border">
                  <div className="flex gap-3">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{article.readTime}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Eye className="w-3 h-3" />
                      <span>{article.views}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <ThumbsUp className="w-3 h-3" />
                      <span>{article.likes}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {article.tags.slice(0, 1).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {article.tags.length > 1 && (
                      <Badge variant="outline" className="text-xs">
                        +{article.tags.length - 1}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <Button variant="outline" className="group">
            Read More Articles
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
};
