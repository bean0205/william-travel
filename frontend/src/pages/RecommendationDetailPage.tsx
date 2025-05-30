import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Star,
  Share2,
  Heart,
  Clock,
  DollarSign,
  Users
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data - replace with actual API call
const getRecommendation = (id: string) => {
  return {
    id,
    title: 'Hidden Gems of Northern Vietnam',
    type: 'Experience',
    coverImage: '/images/sapa.jpg',
    rating: 4.8,
    reviewCount: 124,
    location: 'Sapa, Vietnam',
    duration: '3 days',
    recommendedSeason: 'Spring, Fall',
    budget: 'Medium',
    activities: ['Trekking', 'Cultural Immersion', 'Photography'],
    tags: ['Off-the-beaten path', 'Nature', 'Adventure'],
    description: 'Discover the breathtaking landscapes and rich cultural heritage of Northern Vietnam with this curated experience. Trek through terraced rice fields, interact with local ethnic minorities, and capture stunning photographs of misty mountains.',
    highlights: [
      'Homestay with a local H\'mong family to experience authentic customs and cuisine',
      'Guided trek through hidden valleys and remote villages not visited by typical tourists',
      'Photography session during the golden hour at the most scenic viewpoints',
      'Traditional cooking class using locally sourced ingredients'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival and Village Exploration',
        description: 'Arrive in Sapa and settle into your accommodations. In the afternoon, take a gentle trek to Cat Cat village to acclimate to the altitude and enjoy panoramic views of the valley.'
      },
      {
        day: 2,
        title: 'Remote Trek and Homestay Experience',
        description: 'Embark on a full-day trek through terraced rice fields to reach a remote H\'mong village. Spend the night with a local family, helping prepare dinner and learning about their traditions.'
      },
      {
        day: 3,
        title: 'Market Visit and Departure',
        description: 'Visit the colorful local market in the morning to see the various ethnic minorities trading goods. After lunch, depart with unforgettable memories of your authentic Northern Vietnam experience.'
      }
    ],
    similarExperiences: [
      { id: '234', title: 'Mekong Delta Authentic Tour', image: '/images/hoian.jpg' },
      { id: '345', title: 'Hanoi Street Food Adventure', image: '/images/hanoi.jpg' }
    ]
  };
};

const RecommendationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [recommendation, setRecommendation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Replace with actual API call
    if (id) {
      const data = getRecommendation(id);
      setRecommendation(data);
      setLoading(false);
    }
  }, [id]);

  const toggleSave = () => {
    setIsSaved(!isSaved);
    // Here you would also call an API to save this to the user's favorites
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">{t('loading')}...</p>
        </div>
      </div>
    );
  }

  if (!recommendation) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{t('recommendationNotFound')}</h2>
          <Button onClick={() => navigate('/recommendations')}>{t('backToRecommendations')}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        className="mb-4 flex items-center gap-2"
        onClick={() => navigate('/recommendations')}
      >
        <ArrowLeft size={16} />
        {t('backToRecommendations')}
      </Button>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="relative aspect-video w-full mb-6">
            <img
              src={recommendation.coverImage}
              alt={recommendation.title}
              className="rounded-lg object-cover w-full h-full"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge variant="secondary" className="bg-white/90 text-black">
                {recommendation.type}
              </Badge>
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-2">{recommendation.title}</h1>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
              <span className="font-medium">{recommendation.rating}</span>
            </div>
            <span className="text-muted-foreground">({recommendation.reviewCount} {t('reviews')})</span>
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{recommendation.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{recommendation.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{recommendation.recommendedSeason}</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span>{recommendation.budget}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {recommendation.tags.map((tag: string, index: number) => (
              <Badge key={index} variant="outline">{tag}</Badge>
            ))}
          </div>

          <Tabs defaultValue="overview" className="mb-8">
            <TabsList>
              <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
              <TabsTrigger value="itinerary">{t('itinerary')}</TabsTrigger>
              <TabsTrigger value="highlights">{t('highlights')}</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-4">
              <Card className="p-4">
                <h3 className="text-xl font-semibold mb-3">{t('about')}</h3>
                <p className="mb-4">{recommendation.description}</p>

                <h4 className="font-semibold mb-2">{t('activities')}:</h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  {recommendation.activities.map((activity: string, index: number) => (
                    <Badge key={index} variant="secondary">{activity}</Badge>
                  ))}
                </div>
              </Card>
            </TabsContent>
            <TabsContent value="itinerary" className="mt-4">
              <Card className="p-4">
                <h3 className="text-xl font-semibold mb-3">{t('suggestedItinerary')}</h3>
                <div className="space-y-6">
                  {recommendation.itinerary.map((day: any) => (
                    <div key={day.day} className="border-l-2 border-primary pl-4 pb-2">
                      <h4 className="font-bold mb-1">{t('day')} {day.day}: {day.title}</h4>
                      <p>{day.description}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
            <TabsContent value="highlights" className="mt-4">
              <Card className="p-4">
                <h3 className="text-xl font-semibold mb-3">{t('experienceHighlights')}</h3>
                <ul className="space-y-2">
                  {recommendation.highlights.map((highlight: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <Star className="h-4 w-4 text-yellow-500 mr-2 mt-1" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card className="p-4">
            <h3 className="font-semibold mb-3">{t('saveOrShare')}</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={toggleSave}
              >
                <Heart className={`mr-2 h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                {isSaved ? t('saved') : t('save')}
              </Button>
              <Button variant="outline" className="flex-1">
                <Share2 className="mr-2 h-4 w-4" />
                {t('share')}
              </Button>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-3">{t('similarExperiences')}</h3>
            <div className="space-y-3">
              {recommendation.similarExperiences.map((exp: any) => (
                <div key={exp.id} className="flex items-center gap-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-md"
                     onClick={() => navigate(`/recommendations/${exp.id}`)}>
                  <img src={exp.image} alt={exp.title} className="w-16 h-16 object-cover rounded" />
                  <div>
                    <h4 className="font-medium">{exp.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-3">{t('travelWith')}</h3>
            <Button className="w-full">
              <Users className="mr-2 h-4 w-4" />
              {t('planGroupTrip')}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RecommendationDetailPage;
