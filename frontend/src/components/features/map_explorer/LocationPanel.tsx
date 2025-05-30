import { Link } from 'react-router-dom';

type LocationPanelProps = {
  location: any | null;
};

const LocationPanel = ({ location }: LocationPanelProps) => {
  if (!location) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center">
        <div>
          <p className="mb-2 text-lg font-medium">Select a location on the map</p>
          <p className="text-gray-500">
            Click on any marker to view details about that location
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="mb-2 text-2xl font-bold">{location.name}</h2>
      <div className="mb-4">
        <span className="rounded-full bg-primary-100 px-2 py-1 text-xs font-medium text-primary-800">
          {location.category}
        </span>
      </div>

      {location.imageUrl && (
        <img
          src={location.imageUrl}
          alt={location.name}
          className="mb-4 h-48 w-full rounded-lg object-cover"
        />
      )}

      <p className="mb-4 text-gray-600">{location.description}</p>

      <div className="mb-6 space-y-2">
        {location.address && (
          <div className="flex items-start">
            <span className="mr-2 text-gray-500">📍</span>
            <p className="text-sm text-gray-600">{location.address}</p>
          </div>
        )}
        {location.phone && (
          <div className="flex items-start">
            <span className="mr-2 text-gray-500">📱</span>
            <p className="text-sm text-gray-600">{location.phone}</p>
          </div>
        )}
        {location.website && (
          <div className="flex items-start">
            <span className="mr-2 text-gray-500">🌐</span>
            <a
              href={location.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary-600 hover:underline"
            >
              {location.website}
            </a>
          </div>
        )}
      </div>

      <Link
        to={`/locations/${location.id}`}
        className="btn btn-primary w-full"
      >
        View Details
      </Link>
    </div>
  );
};

export default LocationPanel;
