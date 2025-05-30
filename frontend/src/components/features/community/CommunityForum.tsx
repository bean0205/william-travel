import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  Heart,
  Eye,
  Calendar,
  User,
  ChevronRight,
  Tag,
  Filter,
  Search,
  PlusSquare,
  Pin,
  Bookmark,
  Flag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface ForumPost {
  id: string;
  title: string;
  excerpt: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: Date;
  tags: string[];
  likes: number;
  comments: number;
  views: number;
  isPinned?: boolean;
  isFeatured?: boolean;
}

interface ForumCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  postCount: number;
}

// Mock data for demonstration
const mockCategories: ForumCategory[] = [
  {
    id: 'general',
    name: 'Thảo luận chung',
    description: 'Thảo luận về mọi chủ đề liên quan đến du lịch',
    icon: '🌍',
    postCount: 156
  },
  {
    id: 'tips',
    name: 'Mẹo và thủ thuật',
    description: 'Chia sẻ mẹo du lịch hữu ích cho mọi người',
    icon: '💡',
    postCount: 97
  },
  {
    id: 'destinations',
    name: 'Điểm đến',
    description: 'Khám phá và thảo luận về các điểm đến du lịch trong và ngoài nước',
    icon: '🏝️',
    postCount: 124
  }
];

export const CommunityForum = () => {
  const { t } = useTranslation(['common', 'community']);
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">{t('community.communityForum')}</h2>
      <p className="text-muted-foreground">{t('community.joinDiscussions')}</p>

      {/* Forum content would go here */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Categories */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>{t('community.categories')}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {mockCategories.map(category => (
                  <div key={category.id} className="p-3 flex items-center gap-3 hover:bg-muted/50 cursor-pointer">
                    <div className="text-2xl">{category.icon}</div>
                    <div className="flex-grow">
                      <div className="font-medium">{category.name}</div>
                      <div className="text-sm text-muted-foreground">{category.description}</div>
                    </div>
                    <Badge variant="outline">{category.postCount}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Posts list */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t('community.latestDiscussions')}</CardTitle>
                <Button onClick={() => navigate('/community/new')}>
                  <PlusSquare className="mr-2 h-4 w-4" />
                  {t('community.newPost')}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {/* Sample posts that would navigate to detail page */}
                <div
                  className="p-4 hover:bg-muted/50 cursor-pointer"
                  onClick={() => navigate('/community/1')}
                >
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <User className="h-4 w-4" />
                    </Avatar>
                    <div>
                      <h3 className="font-medium">Tư vấn chuyến du lịch Đà Nẵng - Hội An 5 ngày</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        Chào mọi người, mình đang lên kế hoạch đi Đà Nẵng - Hội An 5 ngày, mọi người có thể tư vấn giúp mình lịch trình hợp lý không ạ?
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline">Đà Nẵng</Badge>
                        <Badge variant="outline">Hội An</Badge>
                        <Badge variant="outline">Lịch trình</Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          TravelLover
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          4 ngày trước
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          12 bình luận
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          156 lượt xem
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="p-4 hover:bg-muted/50 cursor-pointer"
                  onClick={() => navigate('/community/2')}
                >
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <User className="h-4 w-4" />
                    </Avatar>
                    <div>
                      <h3 className="font-medium">Kinh nghiệm du lịch Sapa tháng 11</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        Mình vừa đi Sapa tháng 11 này, muốn chia sẻ với mọi người kinh nghiệm du lịch Sapa vào mùa đông. Trời khá lạnh nhưng phong cảnh rất đẹp với sương mù.
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline">Sapa</Badge>
                        <Badge variant="outline">Mùa đông</Badge>
                        <Badge variant="outline">Kinh nghiệm</Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          MountainHiker
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          1 tuần trước
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          28 bình luận
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          312 lượt xem
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center p-4">
              <Button variant="outline">Xem thêm bài viết</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};
