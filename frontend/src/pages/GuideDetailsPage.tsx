import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCountryStore } from '@/store/countryStore';
import { PageTransition, AnimateElement } from '@/components/common/PageTransition';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  Star,
  MapPin,
  Clock,
  User,
  ThumbsUp,
  MessageCircle,
  Share2,
  Bookmark,
  ArrowLeft,
  CalendarDays,
  Globe,
} from 'lucide-react';

// Types for guide details
interface GuideAuthor {
  id: string;
  name: string;
  avatar: string;
  title: string;
  bio: string;
  joinedDate: string;
  guidesCount: number;
  rating: number;
}

interface GuideLocation {
  id: string;
  name: string;
  description: string;
  image: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface GuideDetails {
  id: string;
  title: string;
  description: string;
  content: string;
  coverImage: string;
  publishedDate: string;
  lastUpdated: string;
  readTime: string;
  author: GuideAuthor;
  locations: GuideLocation[];
  categories: string[];
  tags: string[];
  viewCount: number;
  likesCount: number;
  commentsCount: number;
  rating: number;
  isFeatured: boolean;
}

const GuideDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { selectedCountry, isCountrySelected } = useCountryStore();
  const navigate = useNavigate();
  const [guide, setGuide] = useState<GuideDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Check if country is selected
  useEffect(() => {
    if (!isCountrySelected) {
      navigate('/');
      return;
    }

    // Simulate fetching guide data
    setIsLoading(true);
    // In a real app, this would be an API call like:
    // api.getGuideDetails(id).then(data => setGuide(data))
    setTimeout(() => {
      setGuide(mockGuideData);
      setIsLoading(false);
    }, 500);
  }, [id, isCountrySelected, navigate]);

  // Mock guide data for demonstration
  const mockGuideData: GuideDetails = {
    id: id || '1',
    title: "Ultimate Guide to Exploring Vietnam's Hidden Gems",
    description: "Discover lesser-known destinations, local experiences, and authentic cultural insights in this comprehensive guide to Vietnam's most beautiful secrets.",
    content: `
      <h2>Introduction</h2>
      <p>Vietnam is a country of breathtaking natural beauty, rich cultural heritage, and warm hospitality. While places like Ha Long Bay, Hoi An, and Ho Chi Minh City attract millions of tourists each year, there are countless hidden gems waiting to be discovered by the adventurous traveler.</p>
      
      <p>In this guide, we'll take you off the beaten path to explore some of Vietnam's lesser-known treasures, from remote mountain villages to secluded beaches and authentic local experiences that showcase the true essence of this remarkable country.</p>
      
      <h2>Northern Treasures</h2>
      <p>The northern regions of Vietnam offer spectacular landscapes and cultural diversity that often get overlooked by conventional tourism.</p>
      
      <h3>Ha Giang Province</h3>
      <p>Located in the northernmost part of Vietnam, Ha Giang is home to breathtaking mountain passes, terraced rice fields, and ethnic minority villages. The Dong Van Karst Plateau Geopark, recognized by UNESCO, features unique limestone formations and stunning viewpoints like Ma Pi Leng Pass.</p>
      
      <h3>Bai Tu Long Bay</h3>
      <p>While Ha Long Bay draws crowds, its neighbor Bai Tu Long Bay offers equally spectacular scenery with far fewer tourists. Cruise among limestone karsts, visit floating fishing villages, and enjoy pristine beaches in peaceful tranquility.</p>
      
      <h2>Central Vietnam's Hidden Spots</h2>
      <p>Beyond the popular destinations of Hue and Hoi An, central Vietnam hides some remarkable treasures.</p>
      
      <h3>Phong Nha-Ke Bang National Park</h3>
      <p>Home to some of the world's most impressive caves, including Son Doong (the world's largest cave), Phong Nha-Ke Bang National Park offers adventurous travelers a chance to explore underground rivers, massive caverns, and lush jungle landscapes.</p>
      
      <h3>Quy Nhon</h3>
      <p>This coastal city remains relatively untouched by mass tourism, offering beautiful beaches, fresh seafood, and a glimpse into authentic Vietnamese coastal life without the crowds.</p>
      
      <h2>Southern Secrets</h2>
      <p>The southern regions of Vietnam hold their own unique charm and hidden spots waiting to be discovered.</p>
      
      <h3>Con Dao Islands</h3>
      <p>This remote archipelago offers pristine beaches, rich marine life for snorkeling and diving, and a somber historical significance as a former prison island. Today, it's a peaceful paradise with luxury resorts and untouched natural beauty.</p>
      
      <h3>Mekong Delta's Back Channels</h3>
      <p>While many tourists take day trips to the Mekong Delta, few venture beyond the main waterways. Exploring the smaller channels reveals a more authentic glimpse into the daily lives of the delta's inhabitants, from floating markets to fruit orchards and rural villages.</p>
      
      <h2>Practical Tips</h2>
      <ul>
        <li>Best time to visit: October to April for northern regions; February to August for central and southern areas</li>
        <li>Transportation: Consider renting a motorbike for flexibility in rural areas</li>
        <li>Accommodation: Homestays offer the most authentic cultural experiences</li>
        <li>Language: Learn a few basic Vietnamese phrases to enhance your experience</li>
        <li>Responsible tourism: Respect local customs and support community-based tourism initiatives</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>Vietnam's hidden gems offer travelers an opportunity to connect with the country's natural beauty, rich cultural heritage, and warm hospitality in a more intimate and authentic way. By venturing beyond the well-trodden tourist path, you'll discover the true essence of Vietnam and create memories that will last a lifetime.</p>
    `,
    coverImage: "https://images.unsplash.com/photo-1528127269322-539801943592",
    publishedDate: "2025-04-15",
    lastUpdated: "2025-05-10",
    readTime: "15 min read",
    author: {
      id: "auth1",
      name: "Minh Nguyen",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      title: "Travel Writer & Photographer",
      bio: "Minh is a native Vietnamese travel writer who has spent the last decade exploring every corner of his homeland. His guides focus on authentic cultural experiences and sustainable tourism.",
      joinedDate: "2022-03-15",
      guidesCount: 24,
      rating: 4.9
    },
    locations: [
      {
        id: "loc1",
        name: "Ha Giang",
        description: "Vietnam's northernmost province featuring spectacular mountain landscapes and ethnic minority villages.",
        image: "https://images.unsplash.com/photo-1570366583862-f91883984fde",
        coordinates: {
          lat: 22.8,
          lng: 104.9833
        }
      },
      {
        id: "loc2",
        name: "Phong Nha-Ke Bang",
        description: "National park featuring spectacular limestone karsts and the world's largest cave system.",
        image: "https://images.unsplash.com/photo-1573468206217-4430c0a12867",
        coordinates: {
          lat: 17.55,
          lng: 106.283333
        }
      },
      {
        id: "loc3",
        name: "Con Dao Islands",
        description: "Remote archipelago with pristine beaches, diverse marine life, and historical significance.",
        image: "https://images.unsplash.com/photo-1548080819-68f8a7523055",
        coordinates: {
          lat: 8.683333,
          lng: 106.6
        }
      }
    ],
    categories: ["Adventure", "Cultural", "Nature", "Off the Beaten Path"],
    tags: ["mountains", "islands", "local experiences", "hidden gems", "nature", "cultural heritage"],
    viewCount: 3245,
    likesCount: 187,
    commentsCount: 23,
    rating: 4.8,
    isFeatured: true
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

  // Toggle bookmark
  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // In a real app, you would save this to user preferences/API
  };

  // Toggle like
  const toggleLike = () => {
    setIsLiked(!isLiked);
    if (!isLiked) {
      // Increment likes count
      if (guide) {
        const updatedGuide = { ...guide, likesCount: guide.likesCount + 1 };
        setGuide(updatedGuide);
      }
    } else {
      // Decrement likes count
      if (guide) {
        const updatedGuide = { ...guide, likesCount: guide.likesCount - 1 };
        setGuide(updatedGuide);
      }
    }
    // In a real app, you would update this to an API
  };

  // Go back to guides page
  const handleGoBack = () => {
    navigate('/guides');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !guide) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Guide Not Found</h2>
          <p className="text-muted-foreground mb-6">The guide you're looking for doesn't exist or has been removed.</p>
          <Button onClick={handleGoBack}>Back to Guides</Button>
        </div>
      </div>
    );
  }

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

        {/* Back Button */}
        <div className="container mx-auto px-4 pt-6 sm:px-6 lg:px-8">
          <Button 
            variant="ghost" 
            className="flex items-center gap-2 mb-6"
            onClick={handleGoBack}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Guides
          </Button>
        </div>

        {/* Guide Hero Section */}
        <section className="relative mb-8">
          <div className="h-[40vh] md:h-[50vh] w-full relative">
            <div className="absolute inset-0 bg-black/40 z-10"></div>
            <img 
              src={guide.coverImage} 
              alt={guide.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 to-transparent pt-32 pb-8">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <AnimateElement animation="fade-up" delay={0.1}>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {guide.categories.map((category, index) => (
                      <Badge key={index} className="bg-primary/90 text-white">
                        {category}
                      </Badge>
                    ))}
                    {guide.isFeatured && (
                      <Badge className="bg-amber-500/90 text-white">
                        Featured
                      </Badge>
                    )}
                  </div>
                  
                  <h1 className="text-2xl md:text-4xl font-bold text-white mb-4">
                    {guide.title}
                  </h1>
                  
                  <p className="text-lg text-white/90 mb-4 max-w-3xl">
                    {guide.description}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>By {guide.author.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      <span>Published {formatDate(guide.publishedDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{guide.readTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span>{guide.rating} ({guide.likesCount} likes)</span>
                    </div>
                  </div>
                </AnimateElement>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <AnimateElement animation="fade" delay={0.2}>
                  <Card className="mb-8">
                    <CardContent className="p-6 md:p-8">
                      <div 
                        className="prose prose-lg dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: guide.content }}
                      />
                      
                      {/* Tags */}
                      <div className="mt-8 pt-6 border-t">
                        <h4 className="text-sm font-medium mb-2">Topics</h4>
                        <div className="flex flex-wrap gap-2">
                          {guide.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="cursor-pointer">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {/* Action buttons */}
                      <div className="mt-8 pt-6 border-t flex flex-wrap gap-4">
                        <Button 
                          variant={isLiked ? "default" : "outline"}
                          className="flex items-center gap-2"
                          onClick={toggleLike}
                        >
                          <ThumbsUp className={`h-4 w-4 ${isLiked ? 'fill-white' : ''}`} />
                          {isLiked ? 'Liked' : 'Like'} ({guide.likesCount})
                        </Button>
                        
                        <Button 
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          <MessageCircle className="h-4 w-4" />
                          Comments ({guide.commentsCount})
                        </Button>
                        
                        <Button 
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          <Share2 className="h-4 w-4" />
                          Share
                        </Button>
                        
                        <Button 
                          variant={isBookmarked ? "secondary" : "outline"}
                          className="flex items-center gap-2 ml-auto"
                          onClick={toggleBookmark}
                        >
                          <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-primary' : ''}`} />
                          {isBookmarked ? 'Saved' : 'Save'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </AnimateElement>
              </div>
              
              {/* Sidebar */}
              <div>
                <AnimateElement animation="fade-left" delay={0.3}>
                  {/* Author Card */}
                  <Card className="mb-6">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <img 
                          src={guide.author.avatar}
                          alt={guide.author.name}
                          className="h-16 w-16 rounded-full object-cover border-2 border-muted"
                        />
                        <div>
                          <h3 className="font-bold">{guide.author.name}</h3>
                          <p className="text-sm text-muted-foreground">{guide.author.title}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            <span className="text-xs">{guide.author.rating} • {guide.author.guidesCount} guides</span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4">
                        {guide.author.bio}
                      </p>
                      
                      <Button variant="outline" className="w-full">
                        View Profile
                      </Button>
                    </CardContent>
                  </Card>
                  
                  {/* Locations Card */}
                  <Card className="mb-6">
                    <CardContent className="p-6">
                      <h3 className="font-bold mb-4 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        Featured Locations
                      </h3>
                      
                      <div className="space-y-4">
                        {guide.locations.map(location => (
                          <div key={location.id} className="flex gap-3">
                            <img 
                              src={location.image}
                              alt={location.name}
                              className="h-20 w-20 object-cover rounded-md"
                            />
                            <div>
                              <h4 className="font-medium">{location.name}</h4>
                              <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
                                {location.description}
                              </p>
                              <Button variant="link" className="text-xs h-auto p-0">
                                View on Map
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Guide Info Card */}
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-bold mb-4 flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        Guide Information
                      </h3>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Published:</span>
                          <span>{formatDate(guide.publishedDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Last Updated:</span>
                          <span>{formatDate(guide.lastUpdated)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Reading Time:</span>
                          <span>{guide.readTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Views:</span>
                          <span>{guide.viewCount.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <div className="border-t mt-4 pt-4">
                        <Button variant="outline" className="w-full flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          View All Vietnam Guides
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </AnimateElement>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default GuideDetailsPage;
