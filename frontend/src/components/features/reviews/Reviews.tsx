import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ReviewCard } from './ReviewCard';
import { ReviewForm } from './ReviewForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination } from '@/components/common/Pagination';

interface ReviewsProps {
  itemId: string;
  itemType: 'location' | 'accommodation' | 'restaurant' | 'attraction';
}

// Mock review data - replace with actual API call
const mockReviews = [
  {
    id: '1',
    userId: 'user1',
    userName: 'Nguyễn Văn A',
    userAvatar: '/images/avatar1.jpg',
    rating: 5,
    content: 'Địa điểm tuyệt vời, phong cảnh đẹp. Tôi rất thích không khí ở đây, đặc biệt là vào buổi sáng sớm khi mọi thứ còn yên tĩnh. Dịch vụ chuyên nghiệp, nhân viên thân thiện và nhiệt tình. Chắc chắn sẽ quay lại vào lần sau.',
    createdAt: new Date('2025-04-15'),
    likes: 12,
    hasLiked: false,
    replies: 3
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Trần Thị B',
    rating: 4,
    content: 'Thức ăn ngon, cảnh đẹp, nhưng giá hơi cao.',
    createdAt: new Date('2025-05-01'),
    likes: 5,
    hasLiked: true,
    replies: 0
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'Lê Văn C',
    userAvatar: '/images/avatar3.jpg',
    rating: 3,
    content: 'Khách sạn sạch sẽ nhưng hơi ồn vào ban đêm do gần đường lớn.',
    createdAt: new Date('2025-05-10'),
    likes: 2,
    hasLiked: false,
    replies: 1
  }
];

export const Reviews = ({ itemId, itemType }: ReviewsProps) => {
  const { t } = useTranslation(['common', 'reviews']);
  const [reviews, setReviews] = useState(mockReviews);
  const [sortBy, setSortBy] = useState('recent');
  const [filterRating, setFilterRating] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(reviews.length / itemsPerPage);

  useEffect(() => {
    // Fetch reviews from API
    const fetchReviews = async () => {
      setIsLoading(true);
      try {
        // Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 500));
        // setReviews(fetchedReviews);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [itemId, itemType, sortBy, filterRating, currentPage]);

  const handleLike = (reviewId: string) => {
    // Call API to toggle like
    setReviews(prev =>
      prev.map(review =>
        review.id === reviewId
          ? {
              ...review,
              likes: review.hasLiked ? review.likes - 1 : review.likes + 1,
              hasLiked: !review.hasLiked
            }
          : review
      )
    );
  };

  const handleReply = (reviewId: string) => {
    console.log('Reply to review:', reviewId);
    // Implement reply functionality
  };

  const handleReport = (reviewId: string) => {
    console.log('Report review:', reviewId);
    // Implement report functionality
  };

  const handleNewReview = () => {
    // Refresh reviews after a new submission
    // Could refetch from API or optimistically add to the list
  };

  // Apply sorting
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortBy === 'oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    if (sortBy === 'highest') {
      return b.rating - a.rating;
    }
    if (sortBy === 'lowest') {
      return a.rating - b.rating;
    }
    return 0;
  });

  // Apply filtering
  const filteredReviews = filterRating === 'all'
    ? sortedReviews
    : sortedReviews.filter(review => review.rating === parseInt(filterRating));

  // Apply pagination
  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const overallRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const ratingCounts = Array(5).fill(0).map((_, i) => {
    const count = reviews.filter(review => review.rating === i + 1).length;
    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
    return { rating: i + 1, count, percentage };
  });

  return (
    <div className="space-y-6">
      <Tabs defaultValue="reviews" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="reviews">
            {t('reviews.allReviews')} ({reviews.length})
          </TabsTrigger>
          <TabsTrigger value="summary">
            {t('reviews.summary')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <Select defaultValue={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder={t('sort')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">{t('reviews.mostRecent')}</SelectItem>
                  <SelectItem value="oldest">{t('reviews.oldest')}</SelectItem>
                  <SelectItem value="highest">{t('reviews.highestRated')}</SelectItem>
                  <SelectItem value="lowest">{t('reviews.lowestRated')}</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue={filterRating} onValueChange={setFilterRating}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder={t('filter')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('reviews.allStars')}</SelectItem>
                  <SelectItem value="5">5 {t('reviews.stars')}</SelectItem>
                  <SelectItem value="4">4 {t('reviews.stars')}</SelectItem>
                  <SelectItem value="3">3 {t('reviews.stars')}</SelectItem>
                  <SelectItem value="2">2 {t('reviews.stars')}</SelectItem>
                  <SelectItem value="1">1 {t('reviews.star')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <ReviewForm
            itemId={itemId}
            itemType={itemType}
            onSubmitSuccess={handleNewReview}
          />

          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">{t('loading')}...</p>
            </div>
          ) : paginatedReviews.length === 0 ? (
            <div className="text-center py-8 border rounded-lg bg-muted/30">
              <p className="text-muted-foreground">
                {filterRating !== 'all'
                  ? t('reviews.noReviewsWithRating', { rating: filterRating })
                  : t('reviews.noReviews')}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {paginatedReviews.map(review => (
                <ReviewCard
                  key={review.id}
                  {...review}
                  onLike={handleLike}
                  onReply={handleReply}
                  onReport={handleReport}
                />
              ))}

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="summary" className="space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-8 border rounded-lg p-6 bg-card">
            <div className="text-center">
              <div className="text-5xl font-bold text-primary mb-1">{overallRating}</div>
              <div className="flex items-center justify-center gap-1 mb-2">
                {Array(5).fill(0).map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < Math.round(parseFloat(overallRating)) 
                      ? 'text-yellow-500 fill-yellow-500' 
                      : 'text-gray-300'}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                {t('reviews.basedOn', { count: reviews.length })}
              </div>
            </div>

            <div className="flex-grow w-full">
              {ratingCounts.reverse().map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center gap-2 mb-2">
                  <span className="text-sm">{rating} {rating === 1 ? t('reviews.star') : t('reviews.stars')}</span>
                  <div className="flex-grow h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
