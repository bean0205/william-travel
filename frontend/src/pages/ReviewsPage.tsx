import { Reviews } from '@/components/features/reviews/Reviews';

const ReviewsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Đánh giá và bình luận</h1>
      <Reviews itemId="demo-location" itemType="location" />
    </div>
  );
};

export default ReviewsPage;
