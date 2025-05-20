import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaTaxi, FaBus, FaTrain, FaMotorcycle, FaSearch } from 'react-icons/fa';
import { MdFlight, MdDirectionsBoat } from 'react-icons/md';

interface TransportationItem {
  id: string;
  name: string;
  type: 'taxi' | 'bus' | 'train' | 'air' | 'motorcycle' | 'boat' | 'other';
  description: string;
  image: string;
  price: string;
  rating: number;
  routes: string[];
}

const TransportationPage = () => {
  const { t } = useTranslation(['common']);
  const [transportItems, setTransportItems] = useState<TransportationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState({
    type: 'all',
    searchQuery: '',
  });

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchTransportation = async () => {
      try {
        setIsLoading(true);
        // Simulating API call with timeout
        setTimeout(() => {
          const mockData: TransportationItem[] = [
            {
              id: '1',
              name: 'City Bus Network',
              type: 'bus',
              description: 'Comprehensive bus network covering all major districts in the city.',
              image: '/images/hanoi.jpg',
              price: '$0.50-$1.50',
              rating: 4.2,
              routes: ['Downtown', 'Old Quarter', 'West Lake']
            },
            {
              id: '2',
              name: 'Express Train',
              type: 'train',
              description: 'High-speed train connecting major cities with comfortable seating.',
              image: '/images/hoian.jpg',
              price: '$15-$45',
              rating: 4.7,
              routes: ['Hanoi-Ho Chi Minh', 'Hanoi-Da Nang', 'Da Nang-Ho Chi Minh']
            },
            {
              id: '3',
              name: 'GrabBike',
              type: 'motorcycle',
              description: 'Motorcycle taxi service for quick trips around the city.',
              image: '/images/sapa.jpg',
              price: '$1-$5',
              rating: 4.5,
              routes: ['On-demand']
            },
            {
              id: '4',
              name: 'Domestic Flights',
              type: 'air',
              description: 'Quick flights between major Vietnamese cities.',
              image: '/images/halong_wal.jpg',
              price: '$40-$120',
              rating: 4.3,
              routes: ['Hanoi-Ho Chi Minh', 'Da Nang-Hanoi', 'Hue-Ho Chi Minh']
            },
            {
              id: '5',
              name: 'Halong Bay Cruise',
              type: 'boat',
              description: 'Scenic boat tours around the beautiful Halong Bay.',
              image: '/images/hagiang.jpg',
              price: '$80-$250',
              rating: 4.8,
              routes: ['Halong Bay Tour', 'Overnight Cruises']
            },
            {
              id: '6',
              name: 'Traditional Taxi',
              type: 'taxi',
              description: 'Convenient taxi service with meters for city travel.',
              image: '/images/hanoi.jpg',
              price: '$3-$15',
              rating: 4.0,
              routes: ['On-demand']
            },
          ];
          setTransportItems(mockData);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching transportation data:', error);
        setIsLoading(false);
      }
    };

    fetchTransportation();
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'taxi':
        return <FaTaxi className="text-yellow-500" />;
      case 'bus':
        return <FaBus className="text-blue-500" />;
      case 'train':
        return <FaTrain className="text-green-500" />;
      case 'air':
        return <MdFlight className="text-sky-500" />;
      case 'motorcycle':
        return <FaMotorcycle className="text-red-500" />;
      case 'boat':
        return <MdDirectionsBoat className="text-teal-500" />;
      default:
        return <FaBus className="text-gray-500" />;
    }
  };

  const filteredItems = transportItems.filter((item) => {
    const matchesType = filter.type === 'all' || item.type === filter.type;
    const matchesSearch =
      item.name.toLowerCase().includes(filter.searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(filter.searchQuery.toLowerCase());

    return matchesType && matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <h1 className="mb-8 text-4xl font-bold">Transportation Options</h1>

      {/* Filters */}
      <div className="mb-8 rounded-lg bg-white p-4 shadow-md">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search transportation..."
                className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 focus:border-primary-500 focus:outline-none"
                value={filter.searchQuery}
                onChange={(e) => setFilter(prev => ({ ...prev, searchQuery: e.target.value }))}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          <div className="flex-shrink-0">
            <select
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none"
              value={filter.type}
              onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value }))}
            >
              <option value="all">All Types</option>
              <option value="taxi">Taxi</option>
              <option value="bus">Bus</option>
              <option value="train">Train</option>
              <option value="air">Air</option>
              <option value="motorcycle">Motorcycle</option>
              <option value="boat">Boat</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transportation Items */}
      {isLoading ? (
        <div className="flex justify-center pt-12">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <Link
                to={`/transportation/${item.id}`}
                key={item.id}
                className="group overflow-hidden rounded-lg bg-white shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold">{item.name}</h3>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                        {getTypeIcon(item.type)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium text-gray-700">{item.price}</span>
                    <div className="flex items-center">
                      <span className="mr-1 text-amber-500">★</span>
                      <span>{item.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <p className="mb-3 text-gray-600 line-clamp-2">{item.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.routes.map((route, index) => (
                      <span key={index} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
                        {route}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-16 text-center">
              <h3 className="text-xl font-medium">No transportation options found</h3>
              <p className="mt-2 text-gray-600">Try adjusting your filters</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TransportationPage;
