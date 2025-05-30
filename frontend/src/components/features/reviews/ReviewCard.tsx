import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Star, ThumbsUp, MessageSquare, Flag, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useAuthStore } from '@/store/authStore';

interface ReviewCardProps {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  content: string;
  createdAt: Date;
  likes: number;
  hasLiked: boolean;
  replies?: number;
  onLike?: (id: string) => void;
  onReply?: (id: string) => void;
  onReport?: (id: string) => void;
}

export const ReviewCard = ({
  id,
  userId,
  userName,
  userAvatar,
  rating,
  content,
  createdAt,
  likes,
  hasLiked,
  replies = 0,
  onLike,
  onReply,
  onReport,
}: ReviewCardProps) => {
  const { t } = useTranslation('common');
  const { user } = useAuthStore();
  const [showMore, setShowMore] = useState(content.length > 300);
  const isCurrentUser = user?.id === userId;

  // Format the date in Vietnamese
  const formattedDate = formatDistanceToNow(new Date(createdAt), {
    addSuffix: true,
    locale: vi
  });

  return (
    <div className="border rounded-lg p-4 mb-4 bg-card">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            {userAvatar ? (
              <img src={userAvatar} alt={userName} />
            ) : (
              <div className="bg-primary/10 h-full w-full flex items-center justify-center rounded-full">
                <span className="text-primary font-medium">{userName.charAt(0).toUpperCase()}</span>
              </div>
            )}
          </Avatar>
          <div>
            <div className="font-medium">{userName}</div>
            <div className="text-sm text-muted-foreground">{formattedDate}</div>
          </div>
        </div>
        <div className="flex items-center">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <Star
                key={i}
                size={16}
                className={i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
              />
            ))}
        </div>
      </div>

      <div className="text-sm mb-4">
        {showMore ? `${content.substring(0, 300)}...` : content}
        {content.length > 300 && (
          <button
            onClick={() => setShowMore(!showMore)}
            className="text-primary font-medium ml-2 text-sm"
          >
            {showMore ? t('readMore') : t('showLess')}
          </button>
        )}
      </div>

      <div className="flex items-center gap-4 text-sm">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => onLike?.(id)}
        >
          <ThumbsUp
            size={16}
            className={hasLiked ? 'text-primary fill-primary' : ''}
          />
          <span>{likes}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => onReply?.(id)}
        >
          <MessageSquare size={16} />
          <span>{replies}</span>
        </Button>
        {!isCurrentUser && (
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={() => onReport?.(id)}
          >
            <Flag size={16} />
          </Button>
        )}
        {isCurrentUser && (
          <Button variant="ghost" size="sm" className="text-muted-foreground ml-auto">
            <MoreHorizontal size={16} />
          </Button>
        )}
      </div>
    </div>
  );
};
