import { TripPlanner } from '@/components/features/trip-planner/TripPlanner';

const TripPlannerPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Lập kế hoạch chuyến đi</h1>
      <TripPlanner />
    </div>
  );
};

export default TripPlannerPage;
