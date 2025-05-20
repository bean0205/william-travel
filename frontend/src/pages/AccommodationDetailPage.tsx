import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import SimpleLayout from '@/layouts/SimpleLayout';
import { PageTransition } from '@/components/common/PageTransition';
import {
  FaMapMarkerAlt,
  FaStar,
  FaBed,
  FaSwimmingPool,
  FaWifi,
  FaParking,
  FaUtensils,
  FaHeart,
  FaRegHeart,
  FaShare,
  FaInfoCircle,
  FaCalendarAlt,
  FaPhone,
  FaGlobe
} from 'react-icons/fa';
import { MdOutlineCleaningServices, MdPets, MdAirportShuttle } from 'react-icons/md';
import { IoBusiness } from 'react-icons/io5';

// Mock service - Replace with your actual service
const accommodationService = {
  getAccommodationById: async (id: string) => {
    // Simulate API call
    return {
      id,
      name: 'Boutique Garden Resort',
      description: 'A tranquil retreat nestled in the heart of nature with stunning mountain views and luxurious amenities for a truly relaxing experience.',
      longDescription: 'Located just 10 minutes from the city center, our boutique resort offers a perfect blend of convenience and serenity. Wake up to the sounds of nature, enjoy breakfast overlooking lush gardens, and unwind in our infinity pool with panoramic mountain views.\n\nOur rooms are tastefully decorated with local artwork and equipped with premium amenities for your comfort. The resort restaurant serves fresh, locally-sourced ingredients prepared by our award-winning chef.',
      type: 'Resort',
      address: '123 Tranquil Valley Road, Ha Giang',
      region: 'Ha Giang Province',
      country: 'Vietnam',
      coordinates: { lat: 22.8, lng: 104.9 },
      rating: 4.8,
      reviewCount: 124,
      priceRange: '$$$',
      featuredImage: '/images/hagiang.jpg',
      images: ['/images/hagiang.jpg', '/images/hoian.jpg', '/images/halong_wal.jpg'],
      amenities: [
        { name: 'Free WiFi', icon: 'wifi' },
        { name: 'Swimming Pool', icon: 'pool' },
        { name: 'Restaurant', icon: 'restaurant' },
        { name: 'Parking', icon: 'parking' },
        { name: 'Air Conditioning', icon: 'ac' },
        { name: 'Room Service', icon: 'roomService' },
        { name: 'Pet Friendly', icon: 'pets' },
        { name: 'Airport Shuttle', icon: 'shuttle' },
        { name: 'Business Center', icon: 'business' },
        { name: 'Spa', icon: 'spa' },
      ],
      rooms: [
        {
          id: 'room1',
          name: 'Garden View Suite',
          description: 'Spacious suite with garden views, king bed, and luxury bathroom',
          price: 120,
          capacity: 2,
          size: '45m²',
          beds: 'King',
          image: '/images/hagiang.jpg'
        },
        {
          id: 'room2',
          name: 'Mountain View Villa',
          description: 'Private villa with stunning mountain views, private pool, and outdoor seating',
          price: 250,
          capacity: 4,
          size: '90m²',
          beds: '1 King, 2 Twin',
          image: '/images/halong_wal.jpg'
        },
      ],
      policies: {
        checkIn: '14:00',
        checkOut: '12:00',
        cancellation: 'Free cancellation up to 3 days before check-in',
        extraBeds: 'Extra beds available for $20 per night',
        children: 'Children of all ages are welcome',
        pets: 'Pets allowed with additional fee'
      },
      nearbyAttractions: [
        { name: 'Dong Van Karst Plateau', distance: '5 km' },
        { name: 'Lung Cu Flag Tower', distance: '20 km' },
        { name: `Heaven's Gate`, distance: '15 km' }
      ],
      contactInfo: {
        phone: '+84 123 456 789',
        email: 'info@boutiquegardenresort.com',
        website: 'www.boutiquegardenresort.com',
      }
    };
  }
};

const AccommodationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [accommodation, setAccommodation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const fetchAccommodationDetail = async () => {
      try {
        setLoading(true);
        const data = await accommodationService.getAccommodationById(id as string);
        setAccommodation(data);
        // Check if the accommodation is in user's favorites
        const favorites = JSON.parse(localStorage.getItem('accommodationFavorites') || '[]');
        setIsFavorite(favorites.includes(id));
      } catch (err) {
        setError('Không thể tải thông tin chỗ ở. Vui lòng thử lại sau.');
        console.error('Error fetching accommodation details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAccommodationDetail();
    }
  }, [id]);

  const toggleFavorite = () => {
    if (!isAuthenticated) {
      // Redirect to login or show login modal
      return;
    }

    const favorites = JSON.parse(localStorage.getItem('accommodationFavorites') || '[]');
    let newFavorites;

    if (isFavorite) {
      newFavorites = favorites.filter((favId: string) => favId !== id);
    } else {
      newFavorites = [...favorites, id];
    }

    localStorage.setItem('accommodationFavorites', JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const renderAmenityIcon = (icon: string) => {
    switch (icon) {
      case 'wifi': return <FaWifi />;
      case 'pool': return <FaSwimmingPool />;
      case 'restaurant': return <FaUtensils />;
      case 'parking': return <FaParking />;
      case 'ac': return <FaInfoCircle />;
      case 'roomService': return <MdOutlineCleaningServices />;
      case 'pets': return <MdPets />;
      case 'shuttle': return <MdAirportShuttle />;
      case 'business': return <IoBusiness />;
      default: return <FaInfoCircle />;
    }
  };

  if (loading) {
    return (
      <SimpleLayout>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary-600"></div>
        </div>
      </SimpleLayout>
    );
  }

  if (error || !accommodation) {
    return (
      <SimpleLayout>
        <div className="py-12 text-center">
          <div className="mb-4 text-5xl text-red-500">
            <FaInfoCircle className="inline" />
          </div>
          <h1 className="mb-4 text-2xl font-bold text-gray-800">
            {error || 'Không tìm thấy thông tin chỗ ở'}
          </h1>
          <p className="mb-6 text-gray-600">
            Có thể chỗ ở này không tồn tại hoặc đã bị xóa.
          </p>
          <Link to="/accommodations" className="rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700">
            Quay lại danh sách chỗ ở
          </Link>
        </div>
      </SimpleLayout>
    );
  }

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={`text-xl ${i <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
        />
      );
    }
    return stars;
  };

  return (
    <PageTransition>
      <SimpleLayout>
        {/* Hero section with main image */}
        <div className="relative h-[50vh] w-full">
          <img
            src={accommodation.featuredImage || accommodation.images?.[0] || '/placeholder-image.jpg'}
            alt={accommodation.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="container mx-auto">
              <div className="mb-2 flex items-center">
                <FaMapMarkerAlt className="mr-2" />
                <span className="text-sm">
                  {accommodation.address}
                </span>
              </div>
              <h1 className="mb-2 text-4xl font-bold">{accommodation.name}</h1>
              <div className="mb-4 flex items-center">
                <div className="mr-4 flex">
                  {renderStars(accommodation.rating || 0)}
                  <span className="ml-2">
                    ({accommodation.reviewCount || 0} đánh giá)
                  </span>
                </div>
                <span className="rounded-full bg-primary-100 bg-opacity-90 px-3 py-1 text-xs font-medium text-primary-800">
                  {accommodation.type}
                </span>
                <span className="ml-4 text-lg font-semibold">{accommodation.priceRange}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Main content column */}
            <div className="lg:col-span-2">
              {/* Action buttons */}
              <div className="mb-6 flex items-center space-x-4">
                <button
                  onClick={toggleFavorite}
                  className={`flex items-center rounded-md px-4 py-2 font-medium ${
                    isFavorite
                      ? 'bg-red-100 text-red-600 hover:bg-red-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {isFavorite ? (
                    <FaHeart className="mr-2" />
                  ) : (
                    <FaRegHeart className="mr-2" />
                  )}
                  {isFavorite ? 'Đã lưu' : 'Lưu'}
                </button>

                <button className="flex items-center rounded-md bg-gray-100 px-4 py-2 font-medium text-gray-700 hover:bg-gray-200">
                  <FaShare className="mr-2" />
                  Chia sẻ
                </button>
              </div>

              {/* Tabs navigation */}
              <div className="mb-6 border-b border-gray-200">
                <nav className="flex space-x-8">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`border-b-2 px-1 py-4 text-sm font-medium ${
                      activeTab === 'overview'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    Tổng quan
                  </button>
                  <button
                    onClick={() => setActiveTab('rooms')}
                    className={`border-b-2 px-1 py-4 text-sm font-medium ${
                      activeTab === 'rooms'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    Phòng
                  </button>
                  <button
                    onClick={() => setActiveTab('amenities')}
                    className={`border-b-2 px-1 py-4 text-sm font-medium ${
                      activeTab === 'amenities'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    Tiện nghi
                  </button>
                  <button
                    onClick={() => setActiveTab('policies')}
                    className={`border-b-2 px-1 py-4 text-sm font-medium ${
                      activeTab === 'policies'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    Chính sách
                  </button>
                </nav>
              </div>

              {/* Tab content */}
              <div className="min-h-[300px]">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="mb-3 text-2xl font-semibold text-gray-900">Giới thiệu</h2>
                      <p className="text-gray-700">{accommodation.description}</p>
                      <p className="mt-4 whitespace-pre-line text-gray-700">{accommodation.longDescription}</p>
                    </div>

                    <div>
                      <h3 className="mb-3 text-xl font-semibold text-gray-900">Điểm tham quan gần đây</h3>
                      <ul className="space-y-2">
                        {accommodation.nearbyAttractions?.map((attraction: any, index: number) => (
                          <li key={index} className="flex items-start">
                            <FaMapMarkerAlt className="mr-2 mt-1 text-primary-500" />
                            <div>
                              <p className="font-medium text-gray-800">{attraction.name}</p>
                              <p className="text-sm text-gray-600">Cách {attraction.distance}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="mb-3 text-xl font-semibold text-gray-900">Hình ảnh</h3>
                      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                        {accommodation.images?.map((image: string, index: number) => (
                          <div
                            key={index}
                            className="relative h-40 cursor-pointer overflow-hidden rounded-lg"
                            onClick={() => handleImageClick(image)}
                          >
                            <img
                              src={image}
                              alt={`${accommodation.name} - Hình ${index + 1}`}
                              className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'rooms' && (
                  <div className="space-y-6">
                    <h2 className="mb-4 text-2xl font-semibold text-gray-900">Các loại phòng</h2>
                    {accommodation.rooms?.map((room: any) => (
                      <div key={room.id} className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-3">
                          <div className="h-48 md:h-full">
                            <img
                              src={room.image || accommodation.images?.[0]}
                              alt={room.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="p-4 md:col-span-2">
                            <h3 className="mb-2 text-xl font-medium text-gray-900">{room.name}</h3>
                            <p className="mb-4 text-gray-700">{room.description}</p>

                            <div className="mb-4 grid grid-cols-2 gap-2 text-sm">
                              <div className="flex items-center">
                                <FaBed className="mr-2 text-gray-500" />
                                <span>{room.beds}</span>
                              </div>
                              <div className="flex items-center">
                                <FaInfoCircle className="mr-2 text-gray-500" />
                                <span>{room.size}</span>
                              </div>
                              <div className="flex items-center">
                                <FaInfoCircle className="mr-2 text-gray-500" />
                                <span>Sức chứa: {room.capacity} người</span>
                              </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                              <span className="text-xl font-bold text-primary-600">${room.price} / đêm</span>
                              <button
                                className="rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
                                onClick={() => setSelectedRoom(room.id)}
                              >
                                Đặt phòng
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'amenities' && (
                  <div>
                    <h2 className="mb-4 text-2xl font-semibold text-gray-900">Tiện nghi</h2>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                      {accommodation.amenities?.map((amenity: any, index: number) => (
                        <div key={index} className="flex items-center rounded-lg border border-gray-100 bg-gray-50 p-3">
                          <div className="mr-3 text-primary-500">
                            {renderAmenityIcon(amenity.icon)}
                          </div>
                          <span>{amenity.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'policies' && (
                  <div className="space-y-6">
                    <h2 className="mb-4 text-2xl font-semibold text-gray-900">Chính sách</h2>

                    <div className="rounded-lg border border-gray-200 p-4">
                      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="flex items-start">
                          <FaCalendarAlt className="mr-2 mt-1 text-gray-500" />
                          <div>
                            <p className="font-medium text-gray-800">Nhận phòng</p>
                            <p className="text-gray-600">Từ {accommodation.policies?.checkIn}</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <FaCalendarAlt className="mr-2 mt-1 text-gray-500" />
                          <div>
                            <p className="font-medium text-gray-800">Trả phòng</p>
                            <p className="text-gray-600">Trước {accommodation.policies?.checkOut}</p>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 py-4">
                        <h3 className="mb-2 font-medium text-gray-800">Hủy phòng</h3>
                        <p className="text-gray-600">{accommodation.policies?.cancellation}</p>
                      </div>

                      <div className="border-t border-gray-200 py-4">
                        <h3 className="mb-2 font-medium text-gray-800">Trẻ em và giường phụ</h3>
                        <p className="mb-2 text-gray-600">{accommodation.policies?.children}</p>
                        <p className="text-gray-600">{accommodation.policies?.extraBeds}</p>
                      </div>

                      <div className="border-t border-gray-200 py-4">
                        <h3 className="mb-2 font-medium text-gray-800">Thú cưng</h3>
                        <p className="text-gray-600">{accommodation.policies?.pets}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="mt-8 lg:mt-0">
              <div className="sticky top-20 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 border-b border-gray-200 pb-2 text-lg font-semibold">Thông tin liên hệ</h3>

                <div className="mb-4 space-y-3">
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="mr-3 text-primary-500" />
                    <span className="text-gray-700">{accommodation.address}</span>
                  </div>
                  {accommodation.contactInfo?.phone && (
                    <div className="flex items-center">
                      <FaPhone className="mr-3 text-primary-500" />
                      <span className="text-gray-700">{accommodation.contactInfo.phone}</span>
                    </div>
                  )}
                  {accommodation.contactInfo?.email && (
                    <div className="flex items-center">
                      <FaInfoCircle className="mr-3 text-primary-500" />
                      <span className="text-gray-700">{accommodation.contactInfo.email}</span>
                    </div>
                  )}
                  {accommodation.contactInfo?.website && (
                    <div className="flex items-center">
                      <FaGlobe className="mr-3 text-primary-500" />
                      <a
                        href={`https://${accommodation.contactInfo.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:underline"
                      >
                        {accommodation.contactInfo.website}
                      </a>
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <button className="w-full rounded-md bg-primary-600 py-3 text-center font-medium text-white hover:bg-primary-700">
                    Liên hệ đặt phòng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Image modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
            onClick={closeImageModal}
          >
            <div className="relative max-h-[90vh] max-w-4xl">
              <img
                src={selectedImage}
                alt="Enlarged view"
                className="max-h-[90vh] max-w-full object-contain"
              />
              <button
                className="absolute -top-12 right-0 rounded-full bg-white p-2 text-black"
                onClick={closeImageModal}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </SimpleLayout>
    </PageTransition>
  );
};

export default AccommodationDetailPage;
