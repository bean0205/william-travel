import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FaSearch,
  FaImages,
  FaVideo,
  FaFilter,
  FaMapMarkerAlt,
  FaSortAmountDown,
  FaTh,
  FaThLarge,
  FaShareAlt
} from 'react-icons/fa';

interface GalleryItem {
  id: string;
  type: 'photo' | 'video';
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  location: string;
  tags: string[];
  photographer: string;
  date: string;
  featured: boolean;
  likes: number;
}

const GalleryPage = () => {
  const { t } = useTranslation(['common']);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState({
    type: 'all',
    searchQuery: '',
    location: 'all',
    tag: 'all',
    featuredOnly: false
  });
  const [viewMode, setViewMode] = useState<'grid' | 'large'>('grid');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [currentLocation, setCurrentLocation] = useState('All Locations');
  const [currentTag, setCurrentTag] = useState('All Tags');

  const filterMenuRef = useRef<HTMLDivElement>(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Get unique locations and tags for filters
  const locations = ['All Locations', ...new Set(galleryItems.map(item => item.location))];
  const tags = ['All Tags', ...new Set(galleryItems.flatMap(item => item.tags))];

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchGalleryItems = async () => {
      try {
        setIsLoading(true);
        // Simulating API call with timeout
        setTimeout(() => {
          const mockData: GalleryItem[] = [
            {
              id: '1',
              type: 'photo',
              title: 'Halong Bay Sunset',
              description: 'Spectacular sunset over limestone karsts in Halong Bay',
              url: '/images/halong_wal.jpg',
              thumbnail: '/images/halong_wal.jpg',
              location: 'Halong Bay',
              tags: ['sunset', 'landscape', 'unesco', 'water'],
              photographer: 'John Smith',
              date: '2023-04-15',
              featured: true,
              likes: 245
            },
            {
              id: '2',
              type: 'photo',
              title: 'Hanoi Old Quarter',
              description: 'Bustling streets of Hanoi\'s historic Old Quarter',
              url: '/images/hanoi.jpg',
              thumbnail: '/images/hanoi.jpg',
              location: 'Hanoi',
              tags: ['city', 'culture', 'street', 'people'],
              photographer: 'Emily Wong',
              date: '2023-05-22',
              featured: true,
              likes: 189
            },
            {
              id: '3',
              type: 'video',
              title: 'Sapa Rice Terraces',
              description: 'Stunning tiered rice fields in Sapa valley',
              url: '/images/sapa.jpg',  // Would be a video URL in real app
              thumbnail: '/images/sapa.jpg',
              location: 'Sapa',
              tags: ['mountains', 'nature', 'agriculture', 'ethnic'],
              photographer: 'David Lee',
              date: '2023-06-10',
              featured: false,
              likes: 156
            },
            {
              id: '4',
              type: 'photo',
              title: 'Hoi An Lanterns',
              description: 'Colorful lanterns illuminating Hoi An Ancient Town at night',
              url: '/images/hoian.jpg',
              thumbnail: '/images/hoian.jpg',
              location: 'Hoi An',
              tags: ['night', 'culture', 'unesco', 'lights'],
              photographer: 'Sarah Johnson',
              date: '2023-02-18',
              featured: true,
              likes: 327
            },
            {
              id: '5',
              type: 'photo',
              title: 'Ha Giang Loop',
              description: 'Winding roads through the spectacular mountains of Ha Giang',
              url: '/images/hagiang.jpg',
              thumbnail: '/images/hagiang.jpg',
              location: 'Ha Giang',
              tags: ['mountains', 'road trip', 'adventure', 'landscape'],
              photographer: 'Michael Chen',
              date: '2023-07-05',
              featured: false,
              likes: 203
            },
            {
              id: '6',
              type: 'video',
              title: 'Mekong Delta Floating Market',
              description: 'Vibrant early morning activities at Cai Rang floating market',
              url: '/images/halong_wal.jpg',  // Would be a video URL in real app
              thumbnail: '/images/halong_wal.jpg',
              location: 'Mekong Delta',
              tags: ['market', 'water', 'culture', 'food'],
              photographer: 'Lisa Nguyen',
              date: '2023-03-30',
              featured: true,
              likes: 178
            },
            {
              id: '7',
              type: 'photo',
              title: 'Phong Nha Caves',
              description: 'Exploring the massive cave systems of Phong Nha-Ke Bang National Park',
              url: '/images/hagiang.jpg',
              thumbnail: '/images/hagiang.jpg',
              location: 'Phong Nha',
              tags: ['caves', 'adventure', 'unesco', 'nature'],
              photographer: 'Tom Wilson',
              date: '2023-08-12',
              featured: false,
              likes: 163
            },
            {
              id: '8',
              type: 'photo',
              title: 'Hue Imperial City',
              description: 'Historic monuments of the ancient imperial city of Hue',
              url: '/images/hanoi.jpg',
              thumbnail: '/images/hanoi.jpg',
              location: 'Hue',
              tags: ['history', 'architecture', 'unesco', 'culture'],
              photographer: 'Anna Tran',
              date: '2023-01-25',
              featured: true,
              likes: 212
            },
            {
              id: '9',
              type: 'video',
              title: 'Mui Ne Sand Dunes',
              description: 'Sunrise over the stunning red and white sand dunes of Mui Ne',
              url: '/images/halong_wal.jpg',  // Would be a video URL in real app
              thumbnail: '/images/halong_wal.jpg',
              location: 'Mui Ne',
              tags: ['desert', 'landscape', 'sunrise', 'adventure'],
              photographer: 'Robert Zhang',
              date: '2023-09-03',
              featured: false,
              likes: 145
            },
            {
              id: '10',
              type: 'photo',
              title: 'Da Nang Dragon Bridge',
              description: 'Famous Dragon Bridge illuminated at night in Da Nang city',
              url: '/images/hoian.jpg',
              thumbnail: '/images/hoian.jpg',
              location: 'Da Nang',
              tags: ['city', 'architecture', 'night', 'lights'],
              photographer: 'James Pham',
              date: '2023-04-07',
              featured: true,
              likes: 276
            },
            {
              id: '11',
              type: 'photo',
              title: 'Ninh Binh Boat Tour',
              description: 'Traditional sampan boat tour through the scenic waterways of Tam Coc',
              url: '/images/sapa.jpg',
              thumbnail: '/images/sapa.jpg',
              location: 'Ninh Binh',
              tags: ['water', 'landscape', 'boat', 'nature'],
              photographer: 'Kate Brown',
              date: '2023-05-19',
              featured: false,
              likes: 198
            },
            {
              id: '12',
              type: 'video',
              title: 'Hanoi Street Food Tour',
              description: 'Exploring the diverse and delicious street food scene in Hanoi',
              url: '/images/hanoi.jpg',  // Would be a video URL in real app
              thumbnail: '/images/hanoi.jpg',
              location: 'Hanoi',
              tags: ['food', 'culture', 'street', 'city'],
              photographer: 'Peter Lee',
              date: '2023-06-22',
              featured: true,
              likes: 315
            },
          ];

          setGalleryItems(mockData);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching gallery data:', error);
        setIsLoading(false);
      }
    };

    fetchGalleryItems();

    // Close filter menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target as Node)) {
        setShowFilterMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLocationChange = (location: string) => {
    setCurrentLocation(location);
    setFilter(prev => ({
      ...prev,
      location: location === 'All Locations' ? 'all' : location
    }));
    setShowFilterMenu(false);
  };

  const handleTagChange = (tag: string) => {
    setCurrentTag(tag);
    setFilter(prev => ({
      ...prev,
      tag: tag === 'All Tags' ? 'all' : tag
    }));
    setShowFilterMenu(false);
  };

  const openLightbox = (item: GalleryItem) => {
    setSelectedItem(item);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedItem(null);
    document.body.style.overflow = 'auto';
  };

  const filteredItems = galleryItems.filter((item) => {
    const matchesType = filter.type === 'all' || item.type === filter.type;
    const matchesSearch =
      item.title.toLowerCase().includes(filter.searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(filter.searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(filter.searchQuery.toLowerCase()));
    const matchesLocation = filter.location === 'all' || item.location === filter.location;
    const matchesTag = filter.tag === 'all' || item.tags.includes(filter.tag);
    const matchesFeatured = !filter.featuredOnly || item.featured;

    return matchesType && matchesSearch && matchesLocation && matchesTag && matchesFeatured;
  });

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="mb-8 rounded-xl bg-gradient-to-r from-indigo-800 to-purple-800 p-6 text-white md:p-10">
        <div className="flex flex-col items-center space-y-4 md:flex-row md:space-x-8 md:space-y-0">
          <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-white/20 text-4xl backdrop-blur-sm">
            <FaImages />
          </div>
          <div className="text-center md:text-left">
            <h1 className="mb-3 text-3xl font-bold md:text-4xl">Photo & Video Gallery</h1>
            <p className="text-lg text-indigo-100">Explore stunning visuals from across Vietnam</p>
          </div>
        </div>
      </div>

      {/* Filters and controls */}
      <div className="mb-8 rounded-lg bg-white p-4 shadow-md md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search photos and videos..."
                className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 focus:border-indigo-500 focus:outline-none"
                value={filter.searchQuery}
                onChange={(e) => setFilter(prev => ({ ...prev, searchQuery: e.target.value }))}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="relative" ref={filterMenuRef}>
              <button
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className="flex items-center rounded-lg border border-gray-300 px-3 py-2 hover:bg-gray-50"
              >
                <FaFilter className="mr-2 text-indigo-600" />
                Filters
              </button>

              {showFilterMenu && (
                <div className="absolute right-0 top-full z-10 mt-1 w-64 rounded-lg bg-white p-4 shadow-lg">
                  <div className="mb-4">
                    <label className="mb-1 block text-sm font-medium text-gray-700">Media Type</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setFilter(prev => ({ ...prev, type: 'all' }))}
                        className={`rounded-full px-3 py-1 text-sm ${filter.type === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800'}`}
                      >
                        All
                      </button>
                      <button
                        onClick={() => setFilter(prev => ({ ...prev, type: 'photo' }))}
                        className={`flex items-center rounded-full px-3 py-1 text-sm ${filter.type === 'photo' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800'}`}
                      >
                        <FaImages className="mr-1" size={12} /> Photos
                      </button>
                      <button
                        onClick={() => setFilter(prev => ({ ...prev, type: 'video' }))}
                        className={`flex items-center rounded-full px-3 py-1 text-sm ${filter.type === 'video' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800'}`}
                      >
                        <FaVideo className="mr-1" size={12} /> Videos
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="mb-1 block text-sm font-medium text-gray-700">Location</label>
                    <div className="max-h-32 overflow-y-auto">
                      {locations.map((location, index) => (
                        <div
                          key={index}
                          onClick={() => handleLocationChange(location)}
                          className={`cursor-pointer p-1 text-sm hover:bg-gray-100 ${currentLocation === location ? 'font-medium text-indigo-600' : ''}`}
                        >
                          {location}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="mb-1 block text-sm font-medium text-gray-700">Tags</label>
                    <div className="max-h-32 overflow-y-auto">
                      {tags.map((tag, index) => (
                        <div
                          key={index}
                          onClick={() => handleTagChange(tag)}
                          className={`cursor-pointer p-1 text-sm hover:bg-gray-100 ${currentTag === tag ? 'font-medium text-indigo-600' : ''}`}
                        >
                          {tag}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        checked={filter.featuredOnly}
                        onChange={(e) => setFilter(prev => ({ ...prev, featuredOnly: e.target.checked }))}
                      />
                      <span className="ml-2 text-sm text-gray-700">Featured items only</span>
                    </label>
                  </div>

                  <div className="mt-4 border-t pt-4">
                    <button
                      onClick={() => {
                        setFilter({
                          type: 'all',
                          searchQuery: '',
                          location: 'all',
                          tag: 'all',
                          featuredOnly: false
                        });
                        setCurrentLocation('All Locations');
                        setCurrentTag('All Tags');
                      }}
                      className="w-full rounded bg-gray-200 px-4 py-2 text-sm text-gray-800 hover:bg-gray-300"
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setFilter(prev => ({ ...prev, featuredOnly: !prev.featuredOnly }))}
              className={`flex items-center rounded-lg border px-3 py-2 ${
                filter.featuredOnly 
                  ? 'border-indigo-300 bg-indigo-50 text-indigo-700' 
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <FaSortAmountDown className="mr-2" />
              Featured
            </button>

            <div className="flex rounded-lg border border-gray-300">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center px-3 py-2 ${
                  viewMode === 'grid' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50'
                }`}
              >
                <FaTh />
              </button>
              <button
                onClick={() => setViewMode('large')}
                className={`flex items-center px-3 py-2 ${
                  viewMode === 'large' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50'
                }`}
              >
                <FaThLarge />
              </button>
            </div>
          </div>
        </div>

        {/* Active filters */}
        {(filter.type !== 'all' || filter.location !== 'all' || filter.tag !== 'all' || filter.featuredOnly || filter.searchQuery) && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-500">Active filters:</span>

            {filter.type !== 'all' && (
              <span className="flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs text-indigo-800">
                {filter.type === 'photo' ? 'Photos' : 'Videos'}
                <button
                  onClick={() => setFilter(prev => ({ ...prev, type: 'all' }))}
                  className="ml-1 text-indigo-600 hover:text-indigo-800"
                >
                  ×
                </button>
              </span>
            )}

            {filter.location !== 'all' && (
              <span className="flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs text-indigo-800">
                Location: {filter.location}
                <button
                  onClick={() => {
                    setFilter(prev => ({ ...prev, location: 'all' }));
                    setCurrentLocation('All Locations');
                  }}
                  className="ml-1 text-indigo-600 hover:text-indigo-800"
                >
                  ×
                </button>
              </span>
            )}

            {filter.tag !== 'all' && (
              <span className="flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs text-indigo-800">
                Tag: {filter.tag}
                <button
                  onClick={() => {
                    setFilter(prev => ({ ...prev, tag: 'all' }));
                    setCurrentTag('All Tags');
                  }}
                  className="ml-1 text-indigo-600 hover:text-indigo-800"
                >
                  ×
                </button>
              </span>
            )}

            {filter.featuredOnly && (
              <span className="flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs text-indigo-800">
                Featured Only
                <button
                  onClick={() => setFilter(prev => ({ ...prev, featuredOnly: false }))}
                  className="ml-1 text-indigo-600 hover:text-indigo-800"
                >
                  ×
                </button>
              </span>
            )}

            {filter.searchQuery && (
              <span className="flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs text-indigo-800">
                Search: "{filter.searchQuery}"
                <button
                  onClick={() => setFilter(prev => ({ ...prev, searchQuery: '' }))}
                  className="ml-1 text-indigo-600 hover:text-indigo-800"
                >
                  ×
                </button>
              </span>
            )}

            <button
              onClick={() => {
                setFilter({
                  type: 'all',
                  searchQuery: '',
                  location: 'all',
                  tag: 'all',
                  featuredOnly: false
                });
                setCurrentLocation('All Locations');
                setCurrentTag('All Tags');
              }}
              className="ml-2 text-xs text-indigo-600 hover:text-indigo-800 hover:underline"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Gallery Items */}
      {isLoading ? (
        <div className="flex justify-center pt-12">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
        </div>
      ) : (
        <>
          {filteredItems.length > 0 ? (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
                : 'sm:grid-cols-2 md:grid-cols-2'
            }`}>
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => openLightbox(item)}
                  className="group cursor-pointer overflow-hidden rounded-lg bg-white shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className={`relative ${viewMode === 'large' ? 'h-80' : 'h-48'}`}>
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />

                    {item.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-white transition-transform group-hover:scale-110">
                          <FaVideo className="text-xl" />
                        </div>
                      </div>
                    )}

                    {item.featured && (
                      <div className="absolute left-0 top-3 bg-yellow-500 px-2 py-1 text-xs font-bold uppercase text-white shadow-md">
                        Featured
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <div className="flex items-center text-xs font-medium text-pink-600">
                        <span>♥</span>
                        <span className="ml-1">{item.likes}</span>
                      </div>
                    </div>

                    {viewMode === 'large' && (
                      <p className="mb-3 text-sm text-gray-600">{item.description}</p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <FaMapMarkerAlt className="mr-1 text-red-500" />
                        {item.location}
                      </div>

                      <div className="flex">
                        {item.tags.slice(0, 1).map((tag, index) => (
                          <span key={index} className="ml-1 rounded-full bg-indigo-100 px-2 py-1 text-xs text-indigo-800">
                            {tag}
                          </span>
                        ))}
                        {item.tags.length > 1 && (
                          <span className="ml-1 rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-800">
                            +{item.tags.length - 1}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg bg-white py-16 text-center shadow">
              <FaImages className="mx-auto mb-4 text-4xl text-gray-400" />
              <h3 className="text-xl font-medium">No images or videos found</h3>
              <p className="mt-2 text-gray-600">Try adjusting your filters</p>
            </div>
          )}
        </>
      )}

      {/* Lightbox/Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={closeLightbox}
        >
          <div
            className="relative max-h-[90vh] max-w-7xl overflow-hidden rounded-lg bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
              onClick={closeLightbox}
            >
              <span className="text-2xl">&times;</span>
            </button>

            <div className="flex flex-col md:flex-row">
              <div className="flex-1 bg-black md:min-h-[600px]">
                {selectedItem.type === 'photo' ? (
                  <img
                    src={selectedItem.url}
                    alt={selectedItem.title}
                    className="h-auto max-h-[80vh] w-full object-contain md:h-full"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    {/* This would be a video player in a real app */}
                    <div className="flex h-full w-full flex-col items-center justify-center text-white">
                      <FaVideo className="mb-4 text-4xl" />
                      <p>Video would play here</p>
                      <img
                        src={selectedItem.url}
                        alt={selectedItem.title}
                        className="mt-4 h-auto w-full max-w-xl object-contain opacity-60"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="w-full p-6 md:max-w-md">
                <h2 className="mb-2 text-2xl font-bold">{selectedItem.title}</h2>
                <p className="mb-4 text-gray-600">{selectedItem.description}</p>

                <div className="mb-6 space-y-4">
                  <div className="flex items-start">
                    <FaMapMarkerAlt className="mr-3 mt-1 text-red-500" />
                    <div>
                      <h3 className="font-medium text-gray-700">Location</h3>
                      <p>{selectedItem.location}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-1 font-medium text-gray-700">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        By {selectedItem.photographer}
                      </span>
                      <span className="text-sm text-gray-500">
                        {selectedItem.date}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {selectedItem.type === 'photo' ? 'Photo' : 'Video'}
                      </span>
                      <div className="flex items-center">
                        <span className="text-pink-600">♥</span>
                        <span className="ml-1 text-sm">{selectedItem.likes} likes</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
                    Download
                  </button>
                  <button className="rounded-lg bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300">
                    <FaShareAlt className="mr-1 inline" /> Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
