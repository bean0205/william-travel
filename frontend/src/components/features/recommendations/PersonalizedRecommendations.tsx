import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  ThumbsUp,
  MapPin,
  Clock,
  Calendar,
  Compass,
  Users,
  Heart,
  History,
  Search,
  ArrowRight,
  LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuthStore } from '@/store/authStore';
import { ScrollArea } from '@/components/ui/scroll-area';

// Mock user browsing history
interface BrowsingHistoryItem {
  id: string;
  type: 'location' | 'accommodation' | 'restaurant' | 'article';
  title: string;
  image?: string;
  timestamp: Date;
}

// Mock recommendation
interface Recommendation {
  id: string;
  title: string;
  description: string;
  image?: string;
  matchScore: number; // 0-100%
  reason?: string;
  category: string;
  location?: string;
  isNew?: boolean;
  isFavorited?: boolean;
}

// Mock user preferences
interface UserPreferences {
  travelTypes: string[];
  interests: string[];
  accommodationPreferences: string[];
  budgetLevel: string;
  preferredDestinations: string[];
  avoidDestinations: string[];
}

// Mock data
const mockBrowsingHistory: BrowsingHistoryItem[] = [
  {
    id: 'hist1',
    type: 'location',
    title: 'Phố cổ Hội An',
    image: '/images/hoian.jpg',
    timestamp: new Date('2025-05-19T14:32:00')
  },
  {
    id: 'hist2',
    type: 'accommodation',
    title: 'Vinpearl Resort & Spa Hạ Long',
    timestamp: new Date('2025-05-18T10:15:00')
  },
  {
    id: 'hist3',
    type: 'restaurant',
    title: 'Nhà hàng Madame Lân',
    timestamp: new Date('2025-05-17T19:45:00')
  },
  {
    id: 'hist4',
    type: 'location',
    title: 'Bãi biển Mỹ Khê',
    image: '/images/beach.jpg',
    timestamp: new Date('2025-05-17T16:20:00')
  },
  {
    id: 'hist5',
    type: 'article',
    title: 'Top 10 món ăn phải thử ở Đà Nẵng',
    timestamp: new Date('2025-05-16T08:50:00')
  }
];

const mockRecommendations: Recommendation[] = [
  {
    id: 'rec1',
    title: 'Khám phá Hà Giang',
    description: 'Chuyến đi 3 ngày khám phá cao nguyên đá Đồng Văn, hẻm Tu Sản và các vùng lân cận.',
    image: '/images/hagiang.jpg',
    matchScore: 92,
    reason: 'Dựa trên sở thích về chuyến đi mạo hiểm và phong cảnh thiên nhiên của bạn',
    category: 'Khám phá thiên nhiên',
    location: 'Hà Giang, Việt Nam',
    isNew: true,
  },
  {
    id: 'rec2',
    title: 'Khách sạn The Anam Resort',
    description: 'Resort 5 sao với kiến trúc Đông Dương cổ điển và bãi biển riêng.',
    image: '/images/anam.jpg',
    matchScore: 88,
    reason: 'Phù hợp với sở thích nghỉ dưỡng cao cấp của bạn',
    category: 'Nghỉ dưỡng',
    location: 'Cam Ranh, Khánh Hòa',
    isFavorited: true,
  },
  {
    id: 'rec3',
    title: 'Phố đi bộ Nguyễn Huệ',
    description: 'Khu phố đi bộ sôi động với nhiều hoạt động văn hóa và ẩm thực đường phố.',
    image: '/images/nguyenhue.jpg',
    matchScore: 85,
    reason: 'Dựa trên sở thích khám phá văn hóa đô thị của bạn',
    category: 'Đô thị',
    location: 'Hồ Chí Minh',
  },
  {
    id: 'rec4',
    title: 'Tour thử rượu vang Đà Lạt',
    description: 'Khám phá quy trình sản xuất rượu vang và nếm thử các loại rượu vang Đà Lạt nổi tiếng.',
    image: '/images/wine.jpg',
    matchScore: 78,
    reason: 'Phù hợp với sở thích ẩm thực và rượu vang của bạn',
    category: 'Trải nghiệm ẩm thực',
    location: 'Đà Lạt, Lâm Đồng',
  },
  {
    id: 'rec5',
    title: 'Làng nghề truyền thống Bát Tràng',
    description: 'Làng gốm cổ với lịch sử 700 năm, nơi bạn có thể tự tay làm gốm và mua sắm đồ lưu niệm.',
    image: '/images/battrang.jpg',
    matchScore: 75,
    reason: 'Dựa trên lịch sử xem các địa điểm văn hóa và làng nghề',
    category: 'Văn hóa',
    location: 'Hà Nội',
  }
];

const mockUserPreferences: UserPreferences = {
  travelTypes: ['Khám phá thiên nhiên', 'Nghỉ dưỡng', 'Trải nghiệm văn hóa'],
  interests: ['Ẩm thực', 'Chụp ảnh', 'Thể thao mạo hiểm', 'Mua sắm'],
  accommodationPreferences: ['Resort', 'Khách sạn boutique'],
  budgetLevel: 'Trung bình-Cao',
  preferredDestinations: ['Đà Nẵng', 'Hà Giang', 'Phú Quốc', 'Nha Trang'],
  avoidDestinations: []
};

// Interest icon mapping
const interestIcons: Record<string, LucideIcon> = {
  'Ẩm thực': ThumbsUp,
  'Chụp ảnh': Compass,
  'Thể thao mạo hiểm': Users,
  'Mua sắm': Heart,
};

export const PersonalizedRecommendations = () => {
  const { t } = useTranslation(['common', 'recommendations']);
  const { user } = useAuthStore();
  const navigate = useNavigate(); // Add navigation hook

  const [recommendations, setRecommendations] = useState<Recommendation[]>(mockRecommendations);
  const [browsingHistory, setBrowsingHistory] = useState<BrowsingHistoryItem[]>(mockBrowsingHistory);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(mockUserPreferences);
  const [activeTab, setActiveTab] = useState('recommendations');

  // In a real app, you would fetch these from an API based on the user's profile
  useEffect(() => {
    // Simulate API call to get personalized recommendations
    const fetchRecommendations = async () => {
      try {
        // Replace with actual API call
        // const response = await api.getUserRecommendations(user.id);
        // setRecommendations(response.data);
      } catch (error) {
        console.error('Failed to fetch recommendations:', error);
      }
    };

    if (user) {
      fetchRecommendations();
    }
  }, [user]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">{t('recommendations.personalizedForYou')}</h2>
        <p className="text-muted-foreground">{t('recommendations.basedOnYourPreferences')}</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="recommendations">{t('recommendations.forYou')}</TabsTrigger>
          <TabsTrigger value="preferences">{t('recommendations.yourPreferences')}</TabsTrigger>
          <TabsTrigger value="history">{t('recommendations.browsingHistory')}</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map(recommendation => (
              <Card key={recommendation.id} className="overflow-hidden">
                {recommendation.image && (
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={recommendation.image}
                      alt={recommendation.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                    {recommendation.isNew && (
                      <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md">
                        {t('recommendations.new')}
                      </div>
                    )}
                    <div
                      className="absolute top-2 right-2 h-8 w-8 rounded-full flex items-center justify-center bg-background/80 backdrop-blur-sm"
                      title={recommendation.isFavorited ? t('removeFromFavorites') : t('addToFavorites')}
                    >
                      <Heart
                        size={16}
                        className={recommendation.isFavorited ? "fill-primary text-primary" : ""}
                      />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm text-sm px-2 py-1 rounded-md flex items-center gap-1">
                      <MapPin size={14} />
                      {recommendation.location}
                    </div>
                  </div>
                )}
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>{recommendation.title}</CardTitle>
                    <Badge variant="outline" className="bg-primary/10 text-primary text-xs">
                      {recommendation.matchScore}% {t('recommendations.match')}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <Badge variant="secondary">{recommendation.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <p className="text-sm">{recommendation.description}</p>

                  {recommendation.reason && (
                    <div className="mt-3 text-xs bg-muted p-2 rounded-md text-muted-foreground">
                      {recommendation.reason}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="pt-0">
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    onClick={() => navigate(`/recommendations/${recommendation.id}`)}
                  >
                    {t('recommendations.viewDetails')}
                    <ArrowRight size={16} />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('recommendations.yourTravelPreferences')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">{t('recommendations.travelTypes')}</h4>
                  <div className="flex flex-wrap gap-2">
                    {userPreferences.travelTypes.map(type => (
                      <Badge key={type} variant="secondary">
                        {type}
                      </Badge>
                    ))}
                    <Button variant="ghost" size="sm" className="h-6 rounded-full">+ {t('add')}</Button>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">{t('recommendations.interests')}</h4>
                  <div className="flex flex-wrap gap-2">
                    {userPreferences.interests.map(interest => {
                      const IconComponent = interestIcons[interest] || Compass;
                      return (
                        <Badge key={interest} variant="secondary" className="flex items-center gap-1">
                          <IconComponent size={12} />
                          {interest}
                        </Badge>
                      );
                    })}
                    <Button variant="ghost" size="sm" className="h-6 rounded-full">+ {t('add')}</Button>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">{t('recommendations.accommodationTypes')}</h4>
                  <div className="flex flex-wrap gap-2">
                    {userPreferences.accommodationPreferences.map(pref => (
                      <Badge key={pref} variant="secondary">
                        {pref}
                      </Badge>
                    ))}
                    <Button variant="ghost" size="sm" className="h-6 rounded-full">+ {t('add')}</Button>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">{t('recommendations.budget')}</h4>
                  <Badge>{userPreferences.budgetLevel}</Badge>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  {t('recommendations.editPreferences')}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('recommendations.destinationPreferences')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">{t('recommendations.favoriteDestinations')}</h4>
                  <div className="flex flex-wrap gap-2">
                    {userPreferences.preferredDestinations.map(destination => (
                      <Badge key={destination} variant="secondary" className="flex items-center gap-1">
                        <MapPin size={12} />
                        {destination}
                      </Badge>
                    ))}
                    <Button variant="ghost" size="sm" className="h-6 rounded-full">+ {t('add')}</Button>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">{t('recommendations.placesToAvoid')}</h4>
                  {userPreferences.avoidDestinations.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {userPreferences.avoidDestinations.map(destination => (
                        <Badge key={destination} variant="outline" className="flex items-center gap-1 text-muted-foreground">
                          {destination}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">{t('recommendations.noAvoidPlaces')}</p>
                  )}
                </div>

                <div>
                  <h4 className="font-medium mb-2">{t('recommendations.suggestedPlacesForYou')}</h4>
                  <ScrollArea className="h-[150px] rounded-md border p-3">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <MapPin size={14} />
                          <span>Đà Lạt</span>
                        </div>
                        <Badge variant="outline" className="bg-primary/10 text-primary">95%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <MapPin size={14} />
                          <span>Phú Quốc</span>
                        </div>
                        <Badge variant="outline" className="bg-primary/10 text-primary">92%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <MapPin size={14} />
                          <span>Sapa</span>
                        </div>
                        <Badge variant="outline" className="bg-primary/10 text-primary">89%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <MapPin size={14} />
                          <span>Ninh Bình</span>
                        </div>
                        <Badge variant="outline" className="bg-primary/10 text-primary">87%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <MapPin size={14} />
                          <span>Huế</span>
                        </div>
                        <Badge variant="outline" className="bg-primary/10 text-primary">85%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <MapPin size={14} />
                          <span>Quy Nhơn</span>
                        </div>
                        <Badge variant="outline" className="bg-primary/10 text-primary">82%</Badge>
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  {t('recommendations.updateDestinations')}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>{t('recommendations.recentBrowsingHistory')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {browsingHistory.map(item => (
                  <div key={item.id} className="flex items-center gap-4 pb-4 border-b">
                    {item.image ? (
                      <div className="h-16 w-16 rounded-md overflow-hidden shrink-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center shrink-0">
                        <MapPin size={24} className="text-muted-foreground" />
                      </div>
                    )}

                    <div className="flex-grow">
                      <div className="font-medium">{item.title}</div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="outline">{t(`recommendations.${item.type}`)}</Badge>
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          {new Date(item.timestamp).toLocaleString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                            day: '2-digit',
                            month: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>

                    <Button variant="ghost" size="sm">
                      {t('viewAgain')}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">
                {t('recommendations.clearHistory')}
              </Button>
              <Button variant="ghost">
                {t('recommendations.viewFullHistory')}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
