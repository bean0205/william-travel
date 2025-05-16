import { Link } from 'react-router-dom';
import { useAppStore } from '@/store/appStore';

const FeaturedLocations = () => {
  const { featuredLocations } = useAppStore();

  if (featuredLocations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">No featured locations available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {featuredLocations.map((location) => (
        <div key={location.id} className="overflow-hidden rounded-lg bg-white shadow-md transition-transform hover:scale-[1.02]">
          <img
            src={location.imageUrl}
            alt={location.name}
            className="h-48 w-full object-cover"
          />
          <div className="p-5">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-xl font-bold">{location.name}</h3>
              <span className="rounded-full bg-primary-100 px-2 py-1 text-xs font-medium text-primary-800">
                {location.category}
              </span>
            </div>
            <p className="mb-4 text-gray-600 line-clamp-3">{location.description}</p>
            <Link
              to={`/locations/${location.id}`}
              className="text-primary-600 font-medium hover:text-primary-700"
            >
              Learn more →
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeaturedLocations;
