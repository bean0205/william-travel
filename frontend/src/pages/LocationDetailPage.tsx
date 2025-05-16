import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppStore } from '@/store/appStore';
import MainLayout from '@/layouts/MainLayout';
import { locationService } from '@/services/api/locationService';
import { FaMapMarkerAlt, FaStar, FaGlobe, FaPhone, FaInfoCircle, FaHeart, FaRegHeart, FaShare, FaComments } from 'react-icons/fa';
import { IoMdPhotos } from 'react-icons/io';
import { MdOutlineRecommend } from 'react-icons/md';

const LocationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [location, setLocation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { isAuthenticated } = useAppStore();

  useEffect(() => {
    const fetchLocationDetail = async () => {
      try {
        setLoading(true);
        // Replace with your actual API call
        const data = await locationService.getLocationById(id as string);
        setLocation(data);
        // Check if the location is in user's favorites
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setIsFavorite(favorites.includes(id));
      } catch (err) {
        setError('Không thể tải thông tin địa điểm. Vui lòng thử lại sau.');
        console.error('Error fetching location details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchLocationDetail();
    }
  }, [id]);

  const toggleFavorite = () => {
    if (!isAuthenticated) {
      // Redirect to login or show login modal
      return;
    }

    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    let newFavorites;
    
    if (isFavorite) {
      newFavorites = favorites.filter((favId: string) => favId !== id);
    } else {
      newFavorites = [...favorites, id];
    }
    
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </MainLayout>
    );
  }

  if (error || !location) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <div className="text-red-500 text-5xl mb-4">
            <FaInfoCircle className="inline" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {error || 'Không tìm thấy địa điểm'}
          </h1>
          <p className="text-gray-600 mb-6">
            Có thể địa điểm này không tồn tại hoặc đã bị xóa.
          </p>
          <Link
            to="/locations"
            className="btn btn-primary"
          >
            Quay lại danh sách địa điểm
          </Link>
        </div>
      </MainLayout>
    );
  }

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar 
          key={i} 
          className={`${i <= rating ? 'text-yellow-500' : 'text-gray-300'} text-xl`} 
        />
      );
    }
    return stars;
  };

  return (
    <MainLayout>
      {/* Hero section with main image */}
      <div className="relative h-[50vh] w-full">
        <img 
          src={location.featuredImage || location.images?.[0] || '/placeholder-image.jpg'} 
          alt={location.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="container mx-auto">
            <div className="flex items-center mb-2">
              <FaMapMarkerAlt className="mr-2" />
              <span className="text-sm">{location.region || location.country}</span>
            </div>
            <h1 className="text-4xl font-bold mb-2">{location.name}</h1>
            <div className="flex items-center mb-4">
              <div className="flex mr-4">
                {renderStars(location.rating || 0)}
                <span className="ml-2">({location.reviewCount || 0} đánh giá)</span>
              </div>
              <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-800 bg-opacity-90">
                {location.category}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content column */}
          <div className="lg:col-span-2">
            {/* Action buttons */}
            <div className="flex items-center space-x-4 mb-6">
              <button 
                onClick={toggleFavorite}
                className={`flex items-center rounded-md px-4 py-2 font-medium ${
                  isFavorite 
                    ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isFavorite ? <FaHeart className="mr-2" /> : <FaRegHeart className="mr-2" />}
                {isFavorite ? 'Đã yêu thích' : 'Yêu thích'}
              </button>
              
              <button className="flex items-center rounded-md bg-gray-100 px-4 py-2 font-medium text-gray-700 hover:bg-gray-200">
                <FaShare className="mr-2" />
                Chia sẻ
              </button>
            </div>

            {/* Tabs navigation */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'overview'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Tổng quan
                </button>
                <button
                  onClick={() => setActiveTab('photos')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'photos'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Hình ảnh
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'reviews'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Đánh giá
                </button>
              </nav>
            </div>

            {/* Tab content */}
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Giới thiệu</h2>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {location.description}
                </p>

                {location.highlights && location.highlights.length > 0 && (
                  <>
                    <h3 className="text-xl font-bold mb-3 mt-8">Điểm nổi bật</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {location.highlights.map((highlight: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="text-primary-500 mr-2">✓</span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {location.activities && location.activities.length > 0 && (
                  <>
                    <h3 className="text-xl font-bold mb-3 mt-8">Hoạt động phổ biến</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                      {location.activities.map((activity: any, index: number) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-medium mb-2">{activity.name}</h4>
                          <p className="text-sm text-gray-600">{activity.description}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                <h3 className="text-xl font-bold mb-3 mt-8">Vị trí trên bản đồ</h3>
                <div className="h-80 bg-gray-200 rounded-lg mb-8">
                  {/* Replace with your map component */}
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-gray-500">Bản đồ đang được tải...</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'photos' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Thư viện ảnh</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {(location.images || []).map((image: string, index: number) => (
                    <div 
                      key={index} 
                      className="cursor-pointer rounded-lg overflow-hidden h-48"
                      onClick={() => handleImageClick(image)}
                    >
                      <img 
                        src={image} 
                        alt={`${location.name} - Ảnh ${index + 1}`} 
                        className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                      />
                    </div>
                  ))}
                </div>

                {/* Empty state for no images */}
                {(!location.images || location.images.length === 0) && (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <IoMdPhotos className="mx-auto text-4xl text-gray-400 mb-3" />
                    <p className="text-gray-500">Chưa có hình ảnh nào cho địa điểm này</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Đánh giá từ du khách</h2>
                  <button className="btn btn-primary">
                    <FaComments className="mr-2" />
                    Viết đánh giá
                  </button>
                </div>

                {location.reviews && location.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {location.reviews.map((review: any, index: number) => (
                      <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                        <div className="flex items-center mb-2">
                          <div className="h-10 w-10 rounded-full bg-primary-200 text-center text-lg leading-10 mr-3">
                            {review.author[0].toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-medium">{review.author}</h4>
                            <div className="flex items-center text-sm text-gray-500">
                              <span className="mr-2">{new Date(review.date).toLocaleDateString()}</span>
                              <div className="flex">
                                {renderStars(review.rating).map((star, i) => (
                                  <span key={i} className="text-xs">{star}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <FaComments className="mx-auto text-4xl text-gray-400 mb-3" />
                    <p className="text-gray-500">Chưa có đánh giá nào cho địa điểm này</p>
                    <p className="text-gray-500 mt-2">Hãy là người đầu tiên chia sẻ trải nghiệm của bạn!</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar column */}
          <div className="lg:col-span-1">
            {/* Quick information */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-bold mb-4">Thông tin cơ bản</h3>
              
              <div className="space-y-4">
                {location.address && (
                  <div className="flex">
                    <FaMapMarkerAlt className="text-gray-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Địa chỉ</p>
                      <p className="text-gray-600">{location.address}</p>
                    </div>
                  </div>
                )}

                {location.website && (
                  <div className="flex">
                    <FaGlobe className="text-gray-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Website</p>
                      <a 
                        href={location.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:underline text-sm"
                      >
                        {location.website.replace(/^https?:\/\/(www\.)?/, '')}
                      </a>
                    </div>
                  </div>
                )}

                {location.phone && (
                  <div className="flex">
                    <FaPhone className="text-gray-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Điện thoại</p>
                      <p className="text-gray-600">{location.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Best time to visit */}
            {location.bestTimeToVisit && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-bold mb-3">Thời điểm lý tưởng để đến</h3>
                <p className="text-gray-700">{location.bestTimeToVisit}</p>
              </div>
            )}

            {/* Weather information */}
            {location.weather && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-bold mb-3">Thời tiết</h3>
                <p className="text-gray-700 mb-2">{location.weather.description}</p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-blue-50 p-2 rounded">
                    <p className="text-xs text-gray-500">Mùa Xuân</p>
                    <p className="font-medium">{location.weather.spring}°C</p>
                  </div>
                  <div className="bg-yellow-50 p-2 rounded">
                    <p className="text-xs text-gray-500">Mùa Hè</p>
                    <p className="font-medium">{location.weather.summer}°C</p>
                  </div>
                  <div className="bg-orange-50 p-2 rounded">
                    <p className="text-xs text-gray-500">Mùa Thu</p>
                    <p className="font-medium">{location.weather.autumn}°C</p>
                  </div>
                  <div className="bg-blue-100 p-2 rounded col-span-3">
                    <p className="text-xs text-gray-500">Mùa Đông</p>
                    <p className="font-medium">{location.weather.winter}°C</p>
                  </div>
                </div>
              </div>
            )}

            {/* Related locations */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <MdOutlineRecommend className="mr-2" />
                Địa điểm tương tự
              </h3>
              
              {location.relatedLocations && location.relatedLocations.length > 0 ? (
                <div className="space-y-4">
                  {location.relatedLocations.map((item: any, index: number) => (
                    <Link key={index} to={`/locations/${item.id}`} className="flex items-start group">
                      <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                        <img 
                          src={item.imageUrl} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="ml-3">
                        <h4 className="font-medium text-gray-900 group-hover:text-primary-600">{item.name}</h4>
                        <div className="flex text-xs text-yellow-500 mb-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className={i < item.rating ? 'text-yellow-500' : 'text-gray-300'}>★</span>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500">{item.region}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Không có địa điểm tương tự</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen image modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
          onClick={closeImageModal}
        >
          <button 
            className="absolute top-4 right-4 text-white p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70"
            onClick={closeImageModal}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img 
            src={selectedImage} 
            alt="Location" 
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />
        </div>
      )}
    </MainLayout>
  );
};

export default LocationDetailPage;