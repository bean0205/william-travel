import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaSearch, FaTag, FaMapMarkerAlt, FaStar, FaShoppingBag } from 'react-icons/fa';
import { MdLocalMall, MdStorefront, MdCategory } from 'react-icons/md';

interface ShoppingItem {
  id: string;
  name: string;
  type: 'market' | 'mall' | 'shop' | 'souvenir' | 'craft' | 'specialty';
  description: string;
  image: string;
  priceRange: string;
  rating: number;
  location: string;
  categories: string[];
  isPopular: boolean;
}

const ShoppingPage = () => {
  const { t } = useTranslation(['common']);
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState({
    type: 'all',
    searchQuery: '',
    priceRange: 'all',
    isPopular: false,
  });

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchShoppingItems = async () => {
      try {
        setIsLoading(true);
        // Simulating API call with timeout
        setTimeout(() => {
          const mockData: ShoppingItem[] = [
            {
              id: '1',
              name: 'Ben Thanh Market',
              type: 'market',
              description: 'Historic market offering a wide variety of local goods, souvenirs, and street food.',
              image: '/images/hanoi.jpg',
              priceRange: '$-$$',
              rating: 4.3,
              location: 'Ho Chi Minh City',
              categories: ['Handicrafts', 'Clothing', 'Food'],
              isPopular: true
            },
            {
              id: '2',
              name: 'Dong Ba Market',
              type: 'market',
              description: 'Hue\'s largest market with local handicrafts, specialties and traditional items.',
              image: '/images/hoian.jpg',
              priceRange: '$',
              rating: 4.1,
              location: 'Hue',
              categories: ['Traditional Crafts', 'Food', 'Textiles'],
              isPopular: true
            },
            {
              id: '3',
              name: 'Vincom Center',
              type: 'mall',
              description: 'Modern shopping mall with international brands, restaurants, and entertainment.',
              image: '/images/halong_wal.jpg',
              priceRange: '$$$',
              rating: 4.5,
              location: 'Hanoi',
              categories: ['Fashion', 'Electronics', 'Dining'],
              isPopular: false
            },
            {
              id: '4',
              name: 'Hoi An Silk Village',
              type: 'specialty',
              description: 'Traditional silk production and high-quality silk products and tailoring.',
              image: '/images/hoian.jpg',
              priceRange: '$$',
              rating: 4.7,
              location: 'Hoi An',
              categories: ['Silk', 'Tailoring', 'Traditional Crafts'],
              isPopular: true
            },
            {
              id: '5',
              name: 'Saigon Square',
              type: 'mall',
              description: 'Popular shopping center known for discounted clothing and accessories.',
              image: '/images/sapa.jpg',
              priceRange: '$-$$',
              rating: 4.0,
              location: 'Ho Chi Minh City',
              categories: ['Fashion', 'Accessories', 'Bargains'],
              isPopular: true
            },
            {
              id: '6',
              name: 'Artisan Craft Shop',
              type: 'souvenir',
              description: 'Boutique offering high-quality, handmade Vietnamese crafts and souvenirs.',
              image: '/images/hagiang.jpg',
              priceRange: '$$-$$$',
              rating: 4.8,
              location: 'Hanoi',
              categories: ['Handicrafts', 'Art', 'Gifts'],
              isPopular: false
            },
            {
              id: '7',
              name: 'Bat Trang Ceramic Village',
              type: 'craft',
              description: 'Traditional village known for its beautiful handmade ceramics and pottery.',
              image: '/images/hanoi.jpg',
              priceRange: '$$',
              rating: 4.6,
              location: 'Hanoi',
              categories: ['Ceramics', 'Pottery', 'Traditional Crafts'],
              isPopular: true
            },
            {
              id: '8',
              name: 'Aeon Mall',
              type: 'mall',
              description: 'Large shopping complex with international brands, supermarket, and food court.',
              image: '/images/hoian.jpg',
              priceRange: '$$-$$$',
              rating: 4.4,
              location: 'Ho Chi Minh City',
              categories: ['Fashion', 'Electronics', 'Groceries'],
              isPopular: false
            },
          ];

          setShoppingItems(mockData);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching shopping data:', error);
        setIsLoading(false);
      }
    };

    fetchShoppingItems();
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'market':
        return <MdStorefront className="text-amber-500" />;
      case 'mall':
        return <MdLocalMall className="text-blue-500" />;
      case 'souvenir':
        return <FaShoppingBag className="text-purple-500" />;
      case 'craft':
        return <FaTag className="text-green-500" />;
      case 'specialty':
        return <MdCategory className="text-red-500" />;
      default:
        return <MdStorefront className="text-gray-500" />;
    }
  };

  const filteredItems = shoppingItems.filter((item) => {
    const matchesType = filter.type === 'all' || item.type === filter.type;
    const matchesSearch =
      item.name.toLowerCase().includes(filter.searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(filter.searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(filter.searchQuery.toLowerCase());
    const matchesPriceRange = filter.priceRange === 'all' || item.priceRange.includes(filter.priceRange);
    const matchesPopular = !filter.isPopular || item.isPopular;

    return matchesType && matchesSearch && matchesPriceRange && matchesPopular;
  });

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="mb-8 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-700 p-6 text-white md:p-10">
        <h1 className="mb-3 text-3xl font-bold md:text-4xl">Shopping & Souvenirs</h1>
        <p className="text-lg text-purple-100">Discover the best markets, malls, and specialty shops for authentic Vietnamese goods</p>
      </div>

      {/* Filters */}
      <div className="mb-8 rounded-lg bg-white p-4 shadow-md md:p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Search</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search shopping places..."
                className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 focus:border-indigo-500 focus:outline-none"
                value={filter.searchQuery}
                onChange={(e) => setFilter(prev => ({ ...prev, searchQuery: e.target.value }))}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Type</label>
            <select
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none"
              value={filter.type}
              onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value }))}
            >
              <option value="all">All Types</option>
              <option value="market">Markets</option>
              <option value="mall">Shopping Malls</option>
              <option value="souvenir">Souvenir Shops</option>
              <option value="craft">Craft Shops</option>
              <option value="specialty">Specialty Stores</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Price Range</label>
            <select
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none"
              value={filter.priceRange}
              onChange={(e) => setFilter(prev => ({ ...prev, priceRange: e.target.value }))}
            >
              <option value="all">All Prices</option>
              <option value="$">Budget ($)</option>
              <option value="$$">Mid-range ($$)</option>
              <option value="$$$">Premium ($$$)</option>
            </select>
          </div>

          <div className="flex items-end">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                checked={filter.isPopular}
                onChange={(e) => setFilter(prev => ({ ...prev, isPopular: e.target.checked }))}
              />
              <span className="ml-2 text-gray-700">Show only popular places</span>
            </label>
          </div>
        </div>
      </div>

      {/* Shopping Items */}
      {isLoading ? (
        <div className="flex justify-center pt-12">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <Link
                to={`/shopping/${item.id}`}
                key={item.id}
                className="group overflow-hidden rounded-lg bg-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-48 overflow-hidden">
                  {item.isPopular && (
                    <div className="absolute left-0 top-4 z-10 bg-red-500 px-3 py-1 text-xs font-bold uppercase text-white shadow-md">
                      Popular
                    </div>
                  )}
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
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="mr-1 text-red-500" />
                      <span className="text-sm text-gray-600">{item.location}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-1 text-amber-500">★</span>
                      <span>{item.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <p className="mb-3 text-gray-600 line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-indigo-600">{item.priceRange}</span>
                    <div className="flex flex-wrap gap-1">
                      {item.categories.slice(0, 2).map((category, index) => (
                        <span key={index} className="rounded-full bg-indigo-100 px-2 py-1 text-xs text-indigo-800">
                          {category}
                        </span>
                      ))}
                      {item.categories.length > 2 && (
                        <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-800">
                          +{item.categories.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-16 text-center">
              <h3 className="text-xl font-medium">No shopping options found</h3>
              <p className="mt-2 text-gray-600">Try adjusting your filters</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShoppingPage;
