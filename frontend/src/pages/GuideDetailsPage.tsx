import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useCountryStore } from '@/store/countryStore';
import { PageTransition } from '@/components/common/PageTransition';
import SimpleLayout from '@/layouts/SimpleLayout';
import {
  FaMapMarkerAlt,
  FaStar,
  FaClock,
  FaCalendarAlt,
  FaLanguage,
  FaUser,
  FaUsers,
  FaMoneyBillWave,
  FaPhoneAlt,
  FaEnvelope,
  FaWhatsapp,
  FaHeart,
  FaRegHeart,
  FaShare,
  FaInfoCircle,
  FaMapMarked,
  FaCertificate,
} from 'react-icons/fa';
import { MdVerified, MdOutlineHealthAndSafety, MdLocalActivity } from 'react-icons/md';

// Types for guide details
interface GuideAuthor {
  id: string;
  name: string;
  avatar: string;
  title: string;
  bio: string;
  joinedDate: string;
  guidesCount: number;
  rating: number;
  languages: string[];
  certifications: string[];
  verificationStatus: 'verified' | 'pending' | 'unverified';
  contactInfo: {
    phone: string;
    email: string;
    whatsapp?: string;
  };
}

interface GuideLocation {
  id: string;
  name: string;
  description: string;
  image: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface GuideTour {
  id: string;
  title: string;
  description: string;
  duration: string;
  maxGroupSize: number;
  price: number;
  image: string;
  includedServices: string[];
  excludedServices: string[];
  meetingPoint: string;
  highlights: string[];
}

interface GuideReview {
  id: string;
  author: {
    name: string;
    avatar: string;
    country: string;
  };
  rating: number;
  content: string;
  date: string;
}

interface GuideDetails {
  id: string;
  title: string;
  description: string;
  author: GuideAuthor;
  locations: GuideLocation[];
  tours: GuideTour[];
  reviews: GuideReview[];
  rating: number;
  reviewCount: number;
  featuredImage: string;
  images: string[];
  availability: {
    available: boolean;
    nextAvailableDate: string;
    unavailableDates: string[];
  };
}

// Mock service - Replace with your actual service
const guideService = {
  getGuideById: async (id: string) => {
    // Simulate API call
    return {
      id,
      title: 'Khám phá Hà Nội Cổ Kính trong một ngày',
      description: 'Tour tham quan những địa điểm lịch sử và văn hóa nổi tiếng nhất của Hà Nội, khám phá ẩm thực đường phố và trải nghiệm cuộc sống hàng ngày của người dân địa phương.',
      author: {
        id: 'guide1',
        name: 'Nguyễn Minh Tuấn',
        avatar: '/images/vite.svg',
        title: 'Hướng dẫn viên kinh nghiệm tại Hà Nội',
        bio: 'Tôi là hướng dẫn viên du lịch chuyên nghiệp với hơn 8 năm kinh nghiệm dẫn tour tại Hà Nội và miền Bắc Việt Nam. Tôi có niềm đam mê với lịch sử, văn hóa và ẩm thực Việt Nam, và luôn mong muốn chia sẻ những kiến thức của mình với du khách từ khắp nơi trên thế giới.',
        joinedDate: '2017-05-12',
        guidesCount: 15,
        rating: 4.8,
        languages: ['Tiếng Việt', 'Tiếng Anh', 'Tiếng Pháp'],
        certifications: ['Hướng dẫn viên quốc tế được cấp phép', 'Sơ cứu nâng cao', 'Nhà sử học văn hóa Hà Nội'],
        verificationStatus: 'verified',
        contactInfo: {
          phone: '+84 987 654 321',
          email: 'tuan.nguyen@localguides.vn',
          whatsapp: '+84 987 654 321'
        }
      },
      locations: [
        {
          id: 'loc1',
          name: 'Phố Cổ Hà Nội',
          description: 'Khu phố cổ đầy sức sống với lịch sử hơn 1000 năm, 36 phố phường truyền thống.',
          image: '/images/hanoi.jpg',
          coordinates: {
            lat: 21.0285,
            lng: 105.8542
          }
        },
        {
          id: 'loc2',
          name: 'Hồ Hoàn Kiếm',
          description: 'Hồ trung tâm thành phố với tháp Rùa và đền Ngọc Sơn nổi tiếng, biểu tượng của Hà Nội.',
          image: '/images/hanoi.jpg',
          coordinates: {
            lat: 21.0288,
            lng: 105.8525
          }
        },
        {
          id: 'loc3',
          name: 'Văn Miếu - Quốc Tử Giám',
          description: 'Đại học đầu tiên của Việt Nam, được xây dựng từ năm 1070 dưới triều Lý.',
          image: '/images/hanoi.jpg',
          coordinates: {
            lat: 21.0293,
            lng: 105.8354
          }
        }
      ],
      tours: [
        {
          id: 'tour1',
          title: 'Khám phá Hà Nội Cổ Kính - Tour Cơ Bản',
          description: 'Hành trình nửa ngày khám phá những địa điểm nổi tiếng nhất của Hà Nội bao gồm Phố Cổ, Hồ Hoàn Kiếm và Văn Miếu.',
          duration: '4 giờ',
          maxGroupSize: 10,
          price: 25,
          image: '/images/hanoi.jpg',
          includedServices: [
            'Hướng dẫn viên nói tiếng Anh',
            'Vé vào cửa các điểm tham quan',
            'Đồ uống và đồ ăn nhẹ',
            'Bảo hiểm du lịch cơ bản'
          ],
          excludedServices: [
            'Đồ uống thêm',
            'Bữa trưa/tối',
            'Chi phí cá nhân',
            'Tiền tip cho hướng dẫn viên'
          ],
          meetingPoint: 'Trước Đền Ngọc Sơn, Hồ Hoàn Kiếm, Hà Nội',
          highlights: [
            'Tham quan Hồ Hoàn Kiếm và Đền Ngọc Sơn',
            'Khám phá 36 phố phường Hà Nội',
            'Thăm Văn Miếu - Quốc Tử Giám'
          ]
        },
        {
          id: 'tour2',
          title: 'Hà Nội Văn Hóa và Ẩm Thực - Tour Đầy Đủ',
          description: 'Tour trọn ngày kết hợp tham quan các địa điểm văn hóa lịch sử và trải nghiệm ẩm thực đường phố đặc sắc của Hà Nội.',
          duration: '8 giờ',
          maxGroupSize: 8,
          price: 45,
          image: '/images/hanoi.jpg',
          includedServices: [
            'Hướng dẫn viên nói tiếng Anh',
            'Vé vào cửa các điểm tham quan',
            'Bữa trưa ẩm thực đường phố',
            'Đồ uống (nước, trà)',
            'Tour thử đồ ăn đường phố',
            'Bảo hiểm du lịch cơ bản',
            'Đón tại khách sạn (trong phạm vi trung tâm)'
          ],
          excludedServices: [
            'Đồ uống có cồn',
            'Chi phí cá nhân',
            'Tiền tip cho hướng dẫn viên'
          ],
          meetingPoint: 'Đón tại khách sạn hoặc điểm hẹn tùy chọn trong trung tâm Hà Nội',
          highlights: [
            'Tham quan Hồ Hoàn Kiếm và Đền Ngọc Sơn',
            'Khám phá các con phố ẩm thực Hà Nội',
            'Thử nhiều món ăn đường phố nổi tiếng',
            'Thăm Văn Miếu - Quốc Tử Giám',
            'Tham quan Bảo tàng Lịch sử Quốc gia',
            'Trải nghiệm đi xe máy xung quanh Hồ Tây (tùy chọn)'
          ]
        }
      ],
      reviews: [
        {
          id: 'review1',
          author: {
            name: 'David Thompson',
            avatar: '/images/vite.svg',
            country: 'Hoa Kỳ'
          },
          rating: 5,
          content: 'Tuấn là hướng dẫn viên tuyệt vời với kiến thức sâu rộng về lịch sử và văn hóa Hà Nội. Tour ẩm thực đường phố là trải nghiệm đáng nhớ mà tôi chưa từng có ở bất kỳ quốc gia nào khác. Rất đáng để trải nghiệm!',
          date: '2025-02-15'
        },
        {
          id: 'review2',
          author: {
            name: 'Sophie Martin',
            avatar: '/images/vite.svg',
            country: 'Pháp'
          },
          rating: 4,
          content: 'Tour thật tuyệt vời và thú vị. Tuấn nói tiếng Pháp rất giỏi nên giao tiếp rất dễ dàng. Tôi thích nhất phần ẩm thực đường phố và câu chuyện về lịch sử của từng món ăn.',
          date: '2025-01-20'
        },
        {
          id: 'review3',
          author: {
            name: 'Hiroshi Tanaka',
            avatar: '/images/vite.svg',
            country: 'Nhật Bản'
          },
          rating: 5,
          content: 'Chuyến tham quan cá nhân hóa tuyệt vời. Tuấn rất chu đáo và am hiểu. Tôi đặc biệt thích phần thăm các con phố nghề truyền thống và cách anh ấy kết nối lịch sử với cuộc sống hiện đại của Hà Nội.',
          date: '2024-12-05'
        }
      ],
      rating: 4.8,
      reviewCount: 125,
      featuredImage: '/images/hanoi.jpg',
      images: [
        '/images/hanoi.jpg',
        '/images/halong_wal.jpg',
        '/images/sapa.jpg',
        '/images/hoian.jpg'
      ],
      availability: {
        available: true,
        nextAvailableDate: '2025-05-22',
        unavailableDates: ['2025-05-25', '2025-05-26', '2025-05-27']
      }
    };
  }
};

const GuideDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { selectedCountry, isCountrySelected } = useCountryStore();
  const navigate = useNavigate();
  const [guide, setGuide] = useState<GuideDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedTour, setSelectedTour] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    if (!isCountrySelected) {
      navigate('/');
      return;
    }

    const fetchGuideData = async () => {
      try {
        setIsLoading(true);
        const data = await guideService.getGuideById(id as string);
        setGuide(data);

        // Check if guide is in favorites
        const favorites = JSON.parse(localStorage.getItem('guideFavorites') || '[]');
        setIsFavorite(favorites.includes(id));
      } catch (err) {
        setError('Không thể tải thông tin hướng dẫn viên. Vui lòng thử lại sau.');
        console.error('Error fetching guide details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGuideData();
  }, [id, isCountrySelected, navigate]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('guideFavorites') || '[]');
    let newFavorites;

    if (isFavorite) {
      newFavorites = favorites.filter((favId: string) => favId !== id);
    } else {
      newFavorites = [...favorites, id];
    }

    localStorage.setItem('guideFavorites', JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };

  const handleBookTour = (tourId: string) => {
    setSelectedTour(tourId);
    // In a real app, you would open a booking modal or navigate to a booking page
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={`text-lg ${i <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
        />
      );
    }
    return stars;
  };

  if (isLoading) {
    return (
      <SimpleLayout>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary-600"></div>
        </div>
      </SimpleLayout>
    );
  }

  if (error || !guide) {
    return (
      <SimpleLayout>
        <div className="py-12 text-center">
          <div className="mb-4 text-5xl text-red-500">
            <FaInfoCircle className="inline" />
          </div>
          <h1 className="mb-4 text-2xl font-bold text-gray-800">
            {error || 'Không tìm thấy thông tin hướng dẫn viên'}
          </h1>
          <p className="mb-6 text-gray-600">
            Có thể thông tin này không tồn tại hoặc đã bị xóa.
          </p>
          <Link to="/guides" className="rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700">
            Quay lại danh sách hướng dẫn viên
          </Link>
        </div>
      </SimpleLayout>
    );
  }

  return (
    <PageTransition>
      <SimpleLayout>
        {/* Hero Section */}
        <div className="relative h-[40vh] w-full md:h-[50vh]">
          <img
            src={guide.featuredImage}
            alt={guide.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="container mx-auto">
              <h1 className="mb-2 text-3xl font-bold md:text-4xl">{guide.title}</h1>

              <div className="mb-4 flex flex-wrap items-center gap-4">
                <div className="flex items-center">
                  {renderStars(guide.rating)}
                  <span className="ml-2 text-sm">
                    ({guide.reviewCount} đánh giá)
                  </span>
                </div>

                {guide.author.verificationStatus === 'verified' && (
                  <div className="flex items-center rounded-full bg-green-100 bg-opacity-30 px-3 py-1 text-sm text-green-100">
                    <MdVerified className="mr-1" />
                    <span>Đã xác thực</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={guide.author.avatar}
                alt={guide.author.name}
                className="h-16 w-16 rounded-full border-2 border-white object-cover shadow-md"
              />
              <div>
                <h2 className="text-xl font-semibold">{guide.author.name}</h2>
                <p className="text-gray-600">{guide.author.title}</p>
              </div>
            </div>

            <div className="flex gap-3">
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
          </div>

          {/* Tabs */}
          <div className="mb-6 border-b border-gray-200">
            <nav className="flex flex-wrap -mb-px">
              <button
                onClick={() => setActiveTab('overview')}
                className={`mr-8 flex border-b-2 py-4 px-1 text-sm font-medium ${
                  activeTab === 'overview'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Tổng quan
              </button>
              <button
                onClick={() => setActiveTab('tours')}
                className={`mr-8 flex border-b-2 py-4 px-1 text-sm font-medium ${
                  activeTab === 'tours'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Tours
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`mr-8 flex border-b-2 py-4 px-1 text-sm font-medium ${
                  activeTab === 'reviews'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Đánh giá ({guide.reviewCount})
              </button>
              <button
                onClick={() => setActiveTab('photos')}
                className={`flex border-b-2 py-4 px-1 text-sm font-medium ${
                  activeTab === 'photos'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Hình ảnh
              </button>
            </nav>
          </div>

          {/* Tab content */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Main content */}
            <div className="lg:col-span-2">
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="mb-3 text-xl font-semibold">Về tour</h3>
                    <p className="text-gray-700">{guide.description}</p>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xl font-semibold">Địa điểm tham quan</h3>
                    <div className="space-y-4">
                      {guide.locations.map((location) => (
                        <div key={location.id} className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                          <div className="grid grid-cols-1 md:grid-cols-3">
                            <div className="h-48 md:h-full">
                              <img
                                src={location.image}
                                alt={location.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="p-4 md:col-span-2">
                              <h4 className="mb-2 text-lg font-medium">{location.name}</h4>
                              <p className="mb-4 text-gray-600">{location.description}</p>

                              <a
                                href={`https://maps.google.com/?q=${location.coordinates.lat},${location.coordinates.lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex w-fit items-center text-primary-600 hover:underline"
                              >
                                <FaMapMarked className="mr-2" />
                                Xem trên bản đồ
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xl font-semibold">Về hướng dẫn viên</h3>
                    <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <div className="mb-4">
                        <p className="whitespace-pre-line text-gray-700">{guide.author.bio}</p>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <h4 className="mb-2 font-medium">Ngôn ngữ</h4>
                          <div className="flex flex-wrap gap-2">
                            {guide.author.languages.map((language, index) => (
                              <span key={index} className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
                                {language}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="mb-2 font-medium">Chứng chỉ</h4>
                          <div className="flex flex-col gap-2">
                            {guide.author.certifications.map((cert, index) => (
                              <div key={index} className="flex items-center">
                                <FaCertificate className="mr-2 text-primary-500" />
                                <span className="text-sm">{cert}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'tours' && (
                <div className="space-y-6">
                  <h3 className="mb-3 text-xl font-semibold">Tours có sẵn</h3>
                  {guide.tours.map((tour) => (
                    <div key={tour.id} className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                      <div className="grid grid-cols-1 md:grid-cols-3">
                        <div className="h-48 md:h-full">
                          <img
                            src={tour.image}
                            alt={tour.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="p-4 md:col-span-2">
                          <h4 className="mb-1 text-lg font-medium">{tour.title}</h4>

                          <div className="mb-2 flex flex-wrap gap-3 text-sm text-gray-600">
                            <div className="flex items-center">
                              <FaClock className="mr-1 text-gray-500" />
                              {tour.duration}
                            </div>
                            <div className="flex items-center">
                              <FaUsers className="mr-1 text-gray-500" />
                              Tối đa {tour.maxGroupSize} người
                            </div>
                            <div className="flex items-center">
                              <FaMoneyBillWave className="mr-1 text-gray-500" />
                              ${tour.price}/người
                            </div>
                          </div>

                          <p className="mb-3 text-gray-600">{tour.description}</p>

                          <div className="mb-3">
                            <h5 className="mb-1 font-medium">Điểm nổi bật:</h5>
                            <ul className="pl-5 text-sm text-gray-600">
                              {tour.highlights.slice(0, 3).map((highlight, index) => (
                                <li key={index} className="mb-1 list-disc">{highlight}</li>
                              ))}
                              {tour.highlights.length > 3 && (
                                <li className="list-none text-primary-600 hover:underline">
                                  + {tour.highlights.length - 3} điểm nổi bật khác
                                </li>
                              )}
                            </ul>
                          </div>

                          <div className="mt-4 flex items-center justify-between">
                            <button
                              className="rounded-md bg-primary-600 px-4 py-2 text-white transition hover:bg-primary-700"
                              onClick={() => handleBookTour(tour.id)}
                            >
                              Đặt tour này
                            </button>

                            <Link
                              to={`/guides/${guide.id}/tours/${tour.id}`}
                              className="text-primary-600 hover:underline"
                            >
                              Xem chi tiết
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Đánh giá từ du khách</h3>
                    <div className="flex items-center">
                      <div className="mr-2 flex">{renderStars(guide.rating)}</div>
                      <span className="font-medium">{guide.rating}/5</span>
                      <span className="ml-1 text-gray-500">({guide.reviewCount})</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {guide.reviews.map((review) => (
                      <div key={review.id} className="rounded-lg border border-gray-200 p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <div className="flex items-center">
                            <img
                              src={review.author.avatar}
                              alt={review.author.name}
                              className="mr-3 h-10 w-10 rounded-full"
                            />
                            <div>
                              <h4 className="font-medium">{review.author.name}</h4>
                              <p className="text-sm text-gray-500">{review.author.country}</p>
                            </div>
                          </div>
                          <div className="flex">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        <p className="text-gray-600">{review.content}</p>
                        <p className="mt-2 text-right text-xs text-gray-500">
                          {new Date(review.date).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 text-center">
                    <button className="rounded-md border border-primary-600 px-4 py-2 text-primary-600 hover:bg-primary-50">
                      Xem tất cả đánh giá
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'photos' && (
                <div>
                  <h3 className="mb-4 text-xl font-semibold">Thư viện hình ảnh</h3>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    {guide.images.map((image, index) => (
                      <div key={index} className="overflow-hidden rounded-lg">
                        <img
                          src={image}
                          alt={`Tour image ${index + 1}`}
                          className="h-48 w-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="mt-6 lg:mt-0">
              <div className="sticky top-20 space-y-6">
                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                  <h3 className="mb-3 font-semibold">Thông tin liên hệ</h3>

                  {guide.availability.available ? (
                    <div className="mb-3 rounded-md bg-green-100 p-2 text-center font-medium text-green-800">
                      Sẵn sàng dẫn tour
                    </div>
                  ) : (
                    <div className="mb-3 rounded-md bg-yellow-100 p-2 text-center font-medium text-yellow-800">
                      Bận đến {new Date(guide.availability.nextAvailableDate).toLocaleDateString('vi-VN')}
                    </div>
                  )}

                  <div className="space-y-3">
                    {guide.author.contactInfo.phone && (
                      <div className="flex items-center">
                        <FaPhoneAlt className="mr-3 text-primary-500" />
                        <a href={`tel:${guide.author.contactInfo.phone}`} className="text-gray-700 hover:underline">
                          {guide.author.contactInfo.phone}
                        </a>
                      </div>
                    )}

                    {guide.author.contactInfo.email && (
                      <div className="flex items-center">
                        <FaEnvelope className="mr-3 text-primary-500" />
                        <a href={`mailto:${guide.author.contactInfo.email}`} className="text-gray-700 hover:underline">
                          {guide.author.contactInfo.email}
                        </a>
                      </div>
                    )}

                    {guide.author.contactInfo.whatsapp && (
                      <div className="flex items-center">
                        <FaWhatsapp className="mr-3 text-primary-500" />
                        <a
                          href={`https://wa.me/${guide.author.contactInfo.whatsapp.replace(/\s+/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-700 hover:underline"
                        >
                          WhatsApp
                        </a>
                      </div>
                    )}
                  </div>

                  <button className="mt-4 w-full rounded-md bg-primary-600 py-2 font-medium text-white hover:bg-primary-700">
                    Nhắn tin
                  </button>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                  <h3 className="mb-3 font-semibold">Đặt Tour Nhanh</h3>

                  <div className="mb-3">
                    <label className="mb-1 block text-sm font-medium text-gray-700">Chọn tour</label>
                    <select
                      className="w-full rounded-md border border-gray-300 p-2 focus:border-primary-500 focus:outline-none"
                      value={selectedTour || ''}
                      onChange={(e) => setSelectedTour(e.target.value)}
                    >
                      <option value="">Chọn tour</option>
                      {guide.tours.map(tour => (
                        <option key={tour.id} value={tour.id}>
                          {tour.title} - ${tour.price}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="mb-1 block text-sm font-medium text-gray-700">Ngày</label>
                    <input
                      type="date"
                      className="w-full rounded-md border border-gray-300 p-2 focus:border-primary-500 focus:outline-none"
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="mb-1 block text-sm font-medium text-gray-700">Số người</label>
                    <input
                      type="number"
                      className="w-full rounded-md border border-gray-300 p-2 focus:border-primary-500 focus:outline-none"
                      min="1"
                      defaultValue="2"
                    />
                  </div>

                  <button className="mt-3 w-full rounded-md bg-primary-600 py-2 font-medium text-white hover:bg-primary-700">
                    Kiểm tra giá & Đặt tour
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SimpleLayout>
    </PageTransition>
  );
};

export default GuideDetailsPage;
