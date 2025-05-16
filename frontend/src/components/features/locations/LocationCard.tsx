import { Link } from 'react-router-dom';

type LocationCardProps = {
  location: {
    id: string;
    name: string;
    category: string;
    description: string;
    imageUrl: string;
    rating: number;
  };
};

const LocationCard = ({ location }: LocationCardProps) => {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-md transition-transform hover:scale-[1.02]">
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
        <div className="mb-3 flex items-center">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`mr-1 text-lg ${
                i < location.rating ? 'text-yellow-500' : 'text-gray-300'
              }`}
            >
              ★
            </span>
          ))}
          <span className="text-sm text-gray-600 ml-1">
            ({location.rating.toFixed(1)})
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
  );
};

export default LocationCard;
