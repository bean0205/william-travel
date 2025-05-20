import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import SimpleLayout from '@/layouts/SimpleLayout';
import { PageTransition } from '@/components/common/PageTransition';
import {
  FaMapMarkerAlt,
  FaStar,
  FaUtensils,
  FaClock,
  FaMoneyBillWave,
  FaPhoneAlt,
  FaGlobe,
  FaHeart,
  FaRegHeart,
  FaShare,
  FaInfoCircle,
  FaRegClock,
} from 'react-icons/fa';
import { GiKnifeFork } from 'react-icons/gi';
import { MdRestaurantMenu, MdFastfood, MdOutlineLunchDining } from 'react-icons/md';

// Mock service - Replace with your actual service
const foodService = {
  getFoodById: async (id: string) => {
    // Simulate API call
    return {
      id,
      name: 'Pho Bo Hanoi',
      description: 'Authentic Vietnamese beef noodle soup with rich broth, tender slices of beef, rice noodles, and fresh herbs.',
      longDescription: 'Pho Bo is Vietnam\'s iconic dish that embodies the essence of Vietnamese culinary tradition. Our signature Pho features a meticulously prepared broth simmered for 12 hours with beef bones, star anise, cinnamon, and other secret spices. \n\nServed with fresh rice noodles, thinly sliced beef (rare or well-done), and accompanied by a plate of fresh herbs including Thai basil, cilantro, bean sprouts, lime wedges, and chili peppers allowing you to customize the flavor to your liking.',
      category: 'Traditional',
      cuisine: 'Vietnamese',
      restaurantName: 'Pho Nguyen',
      address: '123 Hang Bac Street, Hoan Kiem District',
      region: 'Hanoi',
      country: 'Vietnam',
      coordinates: { lat: 21.031, lng: 105.851 },
      rating: 4.7,
      reviewCount: 235,
      priceRange: '$',
      featuredImage: '/images/hanoi.jpg',
      images: ['/images/hanoi.jpg', '/images/hoian.jpg', '/images/sapa.jpg'],
      openingHours: {
        monday: '7:00 - 22:00',
        tuesday: '7:00 - 22:00',
        wednesday: '7:00 - 22:00',
        thursday: '7:00 - 22:00',
        friday: '7:00 - 23:00',
        saturday: '7:00 - 23:00',
        sunday: '8:00 - 21:00',
      },
      dietaryOptions: ['Gluten-free options', 'Vegetarian friendly'],
      popularDishes: [
        {
          name: 'Special Beef Pho',
          description: 'Our signature pho with rare beef slices, brisket, and beef balls',
          price: 5.99,
          image: '/images/hanoi.jpg'
        },
        {
          name: 'Chicken Pho',
          description: 'Delicate chicken broth with tender chicken pieces and rice noodles',
          price: 4.99,
          image: '/images/sapa.jpg'
        },
        {
          name: 'Vegetarian Pho',
          description: 'Flavorful vegetable broth with tofu, mushrooms, and vegetables',
          price: 4.50,
          image: '/images/hoian.jpg'
        }
      ],
      contactInfo: {
        phone: '+84 24 1234 5678',
        email: 'info@phonguyen.com',
        website: 'www.phonguyen.com',
      }
    };
  }
};

const FoodDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [food, setFood] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const fetchFoodDetail = async () => {
      try {
        setLoading(true);
        const data = await foodService.getFoodById(id as string);
        setFood(data);
        // Check if the food is in user's favorites
        const favorites = JSON.parse(localStorage.getItem('foodFavorites') || '[]');
        setIsFavorite(favorites.includes(id));
      } catch (err) {
        setError('Không thể tải thông tin món ăn. Vui lòng thử lại sau.');
        console.error('Error fetching food details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFoodDetail();
    }
  }, [id]);

  const toggleFavorite = () => {
    if (!isAuthenticated) {
      // Redirect to login or show login modal
      return;
    }

    const favorites = JSON.parse(localStorage.getItem('foodFavorites') || '[]');
    let newFavorites;

    if (isFavorite) {
      newFavorites = favorites.filter((favId: string) => favId !== id);
    } else {
      newFavorites = [...favorites, id];
    }

    localStorage.setItem('foodFavorites', JSON.stringify(newFavorites));
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
      <SimpleLayout>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary-600"></div>
        </div>
      </SimpleLayout>
    );
  }

  if (error || !food) {
    return (
      <SimpleLayout>
        <div className="py-12 text-center">
          <div className="mb-4 text-5xl text-red-500">
            <FaInfoCircle className="inline" />
          </div>
          <h1 className="mb-4 text-2xl font-bold text-gray-800">
            {error || 'Không tìm thấy thông tin món ăn'}
          </h1>
          <p className="mb-6 text-gray-600">
            Có thể món ăn này không tồn tại hoặc đã bị xóa.
          </p>
          <Link to="/food" className="rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700">
            Quay lại danh sách món ăn
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

  const renderOpenHours = () => {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayNames = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];

    return days.map((day, index) => (
      <div key={day} className="flex justify-between border-b border-gray-100 py-2 last:border-0">
        <span className="font-medium">{dayNames[index]}</span>
        <span>{food.openingHours[day]}</span>
      </div>
    ));
  };

  return (
    <PageTransition>
      <SimpleLayout>
        {/* Hero section with main image */}
        <div className="relative h-[50vh] w-full">
          <img
            src={food.featuredImage || food.images?.[0] || '/placeholder-image.jpg'}
            alt={food.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="container mx-auto">
              <div className="mb-2 flex items-center">
                <FaMapMarkerAlt className="mr-2" />
                <span className="text-sm">
                  {food.restaurantName}, {food.region}
                </span>
              </div>
              <h1 className="mb-2 text-4xl font-bold">{food.name}</h1>
              <div className="mb-4 flex items-center">
                <div className="mr-4 flex">
                  {renderStars(food.rating || 0)}
                  <span className="ml-2">
                    ({food.reviewCount || 0} đánh giá)
                  </span>
                </div>
                <span className="rounded-full bg-primary-100 bg-opacity-90 px-3 py-1 text-xs font-medium text-primary-800">
                  {food.cuisine}
                </span>
                <span className="ml-4 text-lg font-semibold">{food.priceRange}</span>
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
                  {isFavorite ? 'Đã lưu' : 'Lưu món'}
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
                    onClick={() => setActiveTab('menu')}
                    className={`border-b-2 px-1 py-4 text-sm font-medium ${
                      activeTab === 'menu'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    Món phổ biến
                  </button>
                  <button
                    onClick={() => setActiveTab('info')}
                    className={`border-b-2 px-1 py-4 text-sm font-medium ${
                      activeTab === 'info'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    Thông tin
                  </button>
                </nav>
              </div>

              {/* Tab content */}
              <div className="min-h-[300px]">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="mb-3 text-2xl font-semibold text-gray-900">Mô tả</h2>
                      <p className="text-gray-700">{food.description}</p>
                      <p className="mt-4 whitespace-pre-line text-gray-700">{food.longDescription}</p>
                    </div>

                    <div>
                      <h3 className="mb-3 text-xl font-semibold text-gray-900">Ẩm thực</h3>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-800">
                          {food.cuisine}
                        </span>
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-800">
                          {food.category}
                        </span>
                        {food.dietaryOptions?.map((option: string, index: number) => (
                          <span key={index} className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-800">
                            {option}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-3 text-xl font-semibold text-gray-900">Hình ảnh</h3>
                      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                        {food.images?.map((image: string, index: number) => (
                          <div
                            key={index}
                            className="relative h-40 cursor-pointer overflow-hidden rounded-lg"
                            onClick={() => handleImageClick(image)}
                          >
                            <img
                              src={image}
                              alt={`${food.name} - Hình ${index + 1}`}
                              className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'menu' && (
                  <div className="space-y-6">
                    <h2 className="mb-4 text-2xl font-semibold text-gray-900">Món ăn phổ biến</h2>
                    {food.popularDishes?.map((dish: any, index: number) => (
                      <div key={index} className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-4">
                          <div className="h-48 md:h-full">
                            <img
                              src={dish.image || food.images?.[0]}
                              alt={dish.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="p-4 md:col-span-3">
                            <h3 className="mb-2 text-xl font-medium text-gray-900">{dish.name}</h3>
                            <p className="mb-4 text-gray-700">{dish.description}</p>

                            <div className="mt-4 flex items-center justify-between">
                              <span className="text-xl font-bold text-primary-600">${dish.price}</span>
                              <button className="rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700">
                                Đặt món
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'info' && (
                  <div className="space-y-6">
                    <h2 className="mb-4 text-2xl font-semibold text-gray-900">Thông tin nhà hàng</h2>

                    <div className="overflow-hidden rounded-lg border border-gray-200">
                      <div className="grid grid-cols-1 gap-4 p-6 lg:grid-cols-2">
                        <div>
                          <h3 className="mb-3 text-lg font-semibold text-gray-800">Địa chỉ</h3>
                          <div className="flex items-start">
                            <FaMapMarkerAlt className="mr-2 mt-1 text-primary-500" />
                            <p className="text-gray-700">{food.address}, {food.region}, {food.country}</p>
                          </div>
                        </div>

                        <div>
                          <h3 className="mb-3 text-lg font-semibold text-gray-800">Liên hệ</h3>
                          <div className="space-y-2">
                            {food.contactInfo?.phone && (
                              <div className="flex items-center">
                                <FaPhoneAlt className="mr-2 text-primary-500" />
                                <span className="text-gray-700">{food.contactInfo.phone}</span>
                              </div>
                            )}
                            {food.contactInfo?.website && (
                              <div className="flex items-center">
                                <FaGlobe className="mr-2 text-primary-500" />
                                <a
                                  href={`https://${food.contactInfo.website}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary-600 hover:underline"
                                >
                                  {food.contactInfo.website}
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 bg-gray-50 p-6">
                        <h3 className="mb-3 text-lg font-semibold text-gray-800">Giờ mở cửa</h3>
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                          {renderOpenHours()}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="mt-8 lg:mt-0">
              <div className="sticky top-20 space-y-6">
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 border-b border-gray-200 pb-2 text-lg font-semibold">Nhà hàng</h3>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900">{food.restaurantName}</h4>
                    <p className="text-gray-600">{food.address}</p>
                  </div>

                  <div className="mb-4 flex items-center">
                    <FaClock className="mr-2 text-primary-500" />
                    <span className="text-gray-700">Hôm nay: {food.openingHours?.monday}</span>
                  </div>

                  <div className="mb-4 flex items-center">
                    <FaMoneyBillWave className="mr-2 text-primary-500" />
                    <span className="text-gray-700">Mức giá: {food.priceRange}</span>
                  </div>

                  <div className="mt-6">
                    <a
                      href={`https://maps.google.com/?q=${food.coordinates.lat},${food.coordinates.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full rounded-md bg-primary-600 py-3 text-center font-medium text-white hover:bg-primary-700"
                    >
                      Xem bản đồ
                    </a>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 border-b border-gray-200 pb-2 text-lg font-semibold">Món ăn cùng loại</h3>

                  <div className="space-y-4">
                    {[1, 2, 3].map(item => (
                      <div key={item} className="flex">
                        <div className="mr-3 h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                          <img
                            src={food.images?.[item % food.images.length] || '/placeholder-image.jpg'}
                            alt="Related food"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Món ăn liên quan {item}</h4>
                          <p className="text-sm text-gray-500">
                            {food.cuisine}
                          </p>
                          <div className="mt-1 flex text-xs text-yellow-500">
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar className="text-gray-300" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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

export default FoodDetailPage;
