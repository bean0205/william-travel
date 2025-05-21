import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuthStore } from '@/store/authStore';

const reviewSchema = z.object({
  rating: z.number().min(1, 'Bạn phải chọn ít nhất 1 sao').max(5),
  content: z.string().min(5, 'Đánh giá phải có ít nhất 5 ký tự')
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  itemId: string;
  itemType: 'location' | 'accommodation' | 'restaurant' | 'attraction';
  onSubmitSuccess?: () => void;
}

export const ReviewForm = ({ itemId, itemType, onSubmitSuccess }: ReviewFormProps) => {
  const { t } = useTranslation('common');
  const { user, isAuthenticated } = useAuthStore();
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      content: ''
    }
  });

  const rating = watch('rating');

  const onSubmit = async (data: ReviewFormValues) => {
    if (!isAuthenticated) {
      // Handle not authenticated
      return;
    }

    setIsSubmitting(true);

    // Simulating API call - replace with actual API call
    try {
      // Submit review data with user details, itemId, and itemType
      console.log('Submitting review', {
        ...data,
        userId: user?.id,
        itemId,
        itemType,
      });

      // Wait for API response
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Reset form
      reset();

      // Notify parent
      onSubmitSuccess?.();
    } catch (error) {
      console.error('Failed to submit review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStarClick = (starValue: number) => {
    setValue('rating', starValue);
  };

  if (!isAuthenticated) {
    return (
      <div className="border rounded-lg p-4 bg-muted/30 text-center">
        <p className="text-muted-foreground">{t('loginToReview')}</p>
        <Button variant="outline" className="mt-2">{t('login')}</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="border rounded-lg p-4 bg-card">
      <h3 className="font-medium mb-4">{t('writeReview')}</h3>

      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          {Array(5).fill(0).map((_, i) => (
            <button
              type="button"
              key={i}
              onClick={() => handleStarClick(i + 1)}
              onMouseEnter={() => setHoveredStar(i + 1)}
              onMouseLeave={() => setHoveredStar(0)}
              className="p-1 focus:outline-none"
            >
              <Star
                size={24}
                className={
                  (hoveredStar ? i < hoveredStar : i < rating)
                    ? 'text-yellow-500 fill-yellow-500'
                    : 'text-gray-300'
                }
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-muted-foreground">
            {rating ? `${rating}/5` : t('tapToRate')}
          </span>
        </div>
        {errors.rating && (
          <p className="text-destructive text-xs mt-1">{errors.rating.message}</p>
        )}
      </div>

      <div className="mb-4">
        <Textarea
          id="review-content"
          placeholder={t('shareYourExperience')}
          className="resize-none"
          rows={4}
          {...register('content')}
        />
        {errors.content && (
          <p className="text-destructive text-xs mt-1">{errors.content.message}</p>
        )}
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? t('submitting') : t('submitReview')}
        </Button>
      </div>
    </form>
  );
};
