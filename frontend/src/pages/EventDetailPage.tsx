import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCountryStore } from '@/store/countryStore';
import SimpleLayout from '@/layouts/SimpleLayout';
import { PageTransition } from '@/components/common/PageTransition';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Clock,
  MapPin,
  Share2,
  Heart,
  Users,
  Tag,
  Info,
  ChevronLeft,
  ExternalLink,
  DollarSign,
  CalendarDays,
  User
} from 'lucide-react';

// Types
interface Event {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  location: string;
  venue?: string;
  address?: string;
  startDate: Date;
  endDate: Date;
  image: string;
  gallery?: string[];
  status: 'upcoming' | 'ongoing' | 'past';
  category?: string;
  price?: string;
  organizer?: string;
  organizerLogo?: string;
  organizerDescription?: string;
  ticketUrl?: string;
  website?: string;
  attendees?: number;
  capacity?: number;
  contactEmail?: string;
  contactPhone?: string;
  faq?: Array<{question: string, answer: string}>;
  tags?: string[];
  sponsors?: Array<{name: string, logo: string}>;
}

// Mock service - Replace with actual service
const eventService = {
  getEventById: async (id: string): Promise<Event> => {
    // Simulate API call
    // This would be replaced with a real API call in production
    return {
      id,
      title: 'Cultural Festival 2025',
      description: 'Experience the rich cultural heritage through music, dance, and traditional arts.',
      longDescription: 'Join us for the annual Cultural Festival, a celebration of our rich heritage and traditions. This 5-day event features performances by local and international artists, workshops, food stalls, art exhibitions, and much more.\n\nThe festival opens daily from 10 AM to 10 PM with various activities scheduled throughout the day. Check the schedule below for specific performances and workshop times.\n\nThis is a family-friendly event with activities for all ages. Children under 12 enter for free when accompanied by an adult.',
      location: 'Hanoi',
      venue: 'City Center Square',
      address: '123 Main Street, Hanoi, Vietnam',
      startDate: new Date('2025-05-20T10:00:00'),
      endDate: new Date('2025-05-25T22:00:00'),
      image: '/images/hanoi.jpg',
      gallery: ['/images/hanoi.jpg', '/images/hoian.jpg', '/images/hagiang.jpg', '/images/sapa.jpg'],
      status: 'ongoing',
      category: 'Festival',
      price: 'Free',
      organizer: 'City Cultural Department',
      organizerLogo: '/images/hagiang.jpg',
      organizerDescription: 'The City Cultural Department is dedicated to promoting and preserving cultural heritage through various events and initiatives throughout the year.',
      ticketUrl: 'https://example.com/tickets',
      website: 'https://culturalfestival.example.com',
      attendees: 1250,
      capacity: 5000,
      contactEmail: 'info@culturalfestival.example.com',
      contactPhone: '+84 123 456 789',
      faq: [
        {
          question: 'Is the event suitable for children?',
          answer: 'Yes, the festival has activities for all ages. Children under 12 enter for free when accompanied by an adult.'
        },
        {
          question: 'Are there food and beverages available?',
          answer: 'Yes, there are multiple food stalls offering local and international cuisine. Beverages including water, soft drinks, and alcohol (in designated areas) are available for purchase.'
        },
        {
          question: 'What happens in case of rain?',
          answer: 'Most activities will be moved to covered areas in case of light rain. In case of severe weather, updates will be posted on our website and social media.'
        }
      ],
      tags: ['culture', 'music', 'arts', 'food', 'family-friendly'],
      sponsors: [
        { name: 'Local Bank', logo: '/images/hagiang.jpg' },
        { name: 'National Tourism Board', logo: '/images/hoian.jpg' },
        { name: 'Airline Partner', logo: '/images/hanoi.jpg' }
      ]
    };
  }
};

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const { selectedCountry } = useCountryStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'schedule' | 'faq' | 'organizer'>('overview');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchEventDetail = async () => {
      try {
        setLoading(true);
        if (id) {
          const data = await eventService.getEventById(id);
          setEvent(data);
          
          // Check if the event is in user's favorites
          const favorites = JSON.parse(localStorage.getItem('eventFavorites') || '[]');
          setIsFavorite(favorites.includes(id));
        }
      } catch (err) {
        setError('Không thể tải thông tin sự kiện. Vui lòng thử lại sau.');
        console.error('Error fetching event details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetail();
  }, [id]);

  const toggleFavorite = () => {
    if (!id) return;
    
    const favorites = JSON.parse(localStorage.getItem('eventFavorites') || '[]');
    let newFavorites;

    if (isFavorite) {
      newFavorites = favorites.filter((favId: string) => favId !== id);
    } else {
      newFavorites = [...favorites, id];
    }

    localStorage.setItem('eventFavorites', JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const goBack = () => {
    navigate(-1);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
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

  if (error || !event) {
    return (
      <SimpleLayout>
        <div className="py-12 text-center">
          <div className="mb-4 text-5xl text-red-500">
            <Info className="mx-auto h-12 w-12" />
          </div>
          <h1 className="mb-4 text-2xl font-bold text-gray-800">
            {error || 'Không tìm thấy thông tin sự kiện'}
          </h1>
          <p className="mb-6 text-gray-600">
            Có thể sự kiện này không tồn tại hoặc đã bị xóa.
          </p>
          <Link to="/events" className="rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700">
            Quay lại danh sách sự kiện
          </Link>
        </div>
      </SimpleLayout>
    );
  }

  const eventStatus = (): JSX.Element => {
    switch (event.status) {
      case 'ongoing':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Đang diễn ra</Badge>;
      case 'upcoming':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Sắp diễn ra</Badge>;
      case 'past':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Đã kết thúc</Badge>;
      default:
        return <></>;
    }
  };

  return (
    <PageTransition>
      <SimpleLayout>
        {/* Hero section with main image */}
        <div className="relative h-[50vh] w-full">
          <img
            src={event.image}
            alt={event.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="container mx-auto">
              <button
                onClick={goBack}
                className="mb-4 flex items-center text-white hover:underline"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Quay lại
              </button>

              <div className="mb-2 flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                <span className="text-sm">
                  {event.venue}, {event.location}
                </span>
              </div>

              <h1 className="mb-2 text-4xl font-bold">{event.title}</h1>

              <div className="mb-4 flex flex-wrap items-center gap-2">
                {eventStatus()}
                <Badge variant="outline" className="border-white bg-transparent text-white">
                  {event.category}
                </Badge>
                {event.price && (
                  <Badge variant="outline" className="border-white bg-transparent text-white">
                    {event.price === 'Free' ? 'Miễn phí' : event.price}
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center text-white">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  <span>
                    {formatDate(event.startDate)}
                    {event.endDate.toDateString() !== event.startDate.toDateString() &&
                      ` - ${formatDate(event.endDate)}`}
                  </span>
                </div>
                <div className="flex items-center text-white">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>
                    {formatTime(event.startDate)} - {formatTime(event.endDate)}
                  </span>
                </div>
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
                <Button
                  variant="outline"
                  onClick={toggleFavorite}
                  className={isFavorite ? "text-red-600" : ""}
                >
                  <Heart className={`mr-2 h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
                  {isFavorite ? 'Đã lưu' : 'Lưu'}
                </Button>

                <Button variant="outline">
                  <Share2 className="mr-2 h-4 w-4" />
                  Chia sẻ
                </Button>
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
                    onClick={() => setActiveTab('schedule')}
                    className={`border-b-2 px-1 py-4 text-sm font-medium ${
                      activeTab === 'schedule'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    Lịch trình
                  </button>
                  <button
                    onClick={() => setActiveTab('organizer')}
                    className={`border-b-2 px-1 py-4 text-sm font-medium ${
                      activeTab === 'organizer'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    Nhà tổ chức
                  </button>
                  <button
                    onClick={() => setActiveTab('faq')}
                    className={`border-b-2 px-1 py-4 text-sm font-medium ${
                      activeTab === 'faq'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    FAQ
                  </button>
                </nav>
              </div>

              {/* Tab content */}
              <div className="min-h-[300px]">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="mb-3 text-2xl font-semibold text-gray-900">Mô tả sự kiện</h2>
                      <p className="text-gray-700">{event.description}</p>
                      <p className="mt-4 whitespace-pre-line text-gray-700">{event.longDescription}</p>
                    </div>

                    {event.tags && event.tags.length > 0 && (
                      <div className="mt-4">
                        <h3 className="mb-2 text-lg font-medium">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {event.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="bg-gray-100">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="mb-3 text-xl font-semibold text-gray-900">Địa điểm</h3>
                      <div className="rounded-lg border border-gray-200 p-4">
                        <h4 className="font-medium text-gray-900">{event.venue}</h4>
                        <p className="mt-1 text-gray-700">{event.address}</p>
                        <div className="mt-4 h-64 w-full bg-gray-200">
                          {/* Map would go here, using a placeholder for now */}
                          <div className="flex h-full items-center justify-center">
                            <p className="text-gray-500">Bản đồ địa điểm</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {event.sponsors && event.sponsors.length > 0 && (
                      <div>
                        <h3 className="mb-3 text-xl font-semibold text-gray-900">Nhà tài trợ</h3>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                          {event.sponsors.map((sponsor, index) => (
                            <div key={index} className="flex flex-col items-center rounded-lg border border-gray-200 p-4">
                              <img
                                src={sponsor.logo}
                                alt={sponsor.name}
                                className="mb-2 h-16 w-16 object-contain"
                              />
                              <span className="text-center text-sm font-medium">{sponsor.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="mb-3 text-xl font-semibold text-gray-900">Hình ảnh</h3>
                      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                        {event.gallery?.map((image, index) => (
                          <div
                            key={index}
                            className="relative h-40 cursor-pointer overflow-hidden rounded-lg"
                            onClick={() => handleImageClick(image)}
                          >
                            <img
                              src={image}
                              alt={`${event.title} - Hình ${index + 1}`}
                              className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'schedule' && (
                  <div className="space-y-6">
                    <h2 className="mb-4 text-2xl font-semibold text-gray-900">Lịch trình</h2>
                    <p className="text-gray-700">Lịch trình chi tiết sẽ được cập nhật gần ngày sự kiện.</p>

                    <div className="space-y-4">
                      {/* Schedule items would be mapped here - using static example for now */}
                      <div className="rounded-lg border border-gray-200 p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">Ngày 1: Lễ khai mạc</h3>
                            <p className="mt-1 text-sm text-gray-700">
                              {formatDate(event.startDate)} | {formatTime(event.startDate)} - 22:00
                            </p>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800">Highlight</Badge>
                        </div>
                        <p className="mt-2 text-gray-700">
                          Buổi lễ khai mạc với các tiết mục biểu diễn đặc sắc từ các nghệ sĩ trong nước và quốc tế.
                        </p>
                      </div>

                      <div className="rounded-lg border border-gray-200 p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">Workshop: Nghệ thuật truyền thống</h3>
                            <p className="mt-1 text-sm text-gray-700">
                              {formatDate(new Date(event.startDate.getTime() + 86400000))} | 10:00 - 12:00
                            </p>
                          </div>
                        </div>
                        <p className="mt-2 text-gray-700">
                          Workshop hướng dẫn các nghệ thuật truyền thống như nặn tò he, vẽ tranh dân gian.
                        </p>
                      </div>

                      <div className="rounded-lg border border-gray-200 p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">Trình diễn âm nhạc dân tộc</h3>
                            <p className="mt-1 text-sm text-gray-700">
                              {formatDate(new Date(event.startDate.getTime() + 86400000))} | 19:00 - 21:00
                            </p>
                          </div>
                        </div>
                        <p className="mt-2 text-gray-700">
                          Đêm nhạc với các nhạc cụ dân tộc truyền thống, kết hợp các yếu tố âm nhạc hiện đại.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'organizer' && (
                  <div className="space-y-6">
                    <h2 className="mb-4 text-2xl font-semibold text-gray-900">Thông tin nhà tổ chức</h2>

                    <div className="flex items-center">
                      {event.organizerLogo && (
                        <img
                          src={event.organizerLogo}
                          alt={event.organizer}
                          className="mr-4 h-16 w-16 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <h3 className="text-xl font-medium text-gray-900">{event.organizer}</h3>
                        {event.website && (
                          <a
                            href={event.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 flex items-center text-sm text-primary-600 hover:underline"
                          >
                            <ExternalLink className="mr-1 h-3 w-3" />
                            {event.website.replace(/^https?:\/\//, '')}
                          </a>
                        )}
                      </div>
                    </div>

                    {event.organizerDescription && (
                      <div className="mt-4">
                        <p className="text-gray-700">{event.organizerDescription}</p>
                      </div>
                    )}

                    <div className="mt-6 space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">Thông tin liên hệ</h3>

                      {event.contactEmail && (
                        <div className="flex items-center">
                          <Info className="mr-2 h-4 w-4 text-gray-500" />
                          <span className="text-gray-700">{event.contactEmail}</span>
                        </div>
                      )}

                      {event.contactPhone && (
                        <div className="flex items-center">
                          <Info className="mr-2 h-4 w-4 text-gray-500" />
                          <span className="text-gray-700">{event.contactPhone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'faq' && (
                  <div className="space-y-6">
                    <h2 className="mb-4 text-2xl font-semibold text-gray-900">Câu hỏi thường gặp</h2>

                    <div className="space-y-4">
                      {event.faq?.map((item, index) => (
                        <div key={index} className="rounded-lg border border-gray-200 p-4">
                          <h3 className="font-medium text-gray-900">{item.question}</h3>
                          <p className="mt-2 text-gray-700">{item.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="mt-8 lg:mt-0">
              <div className="sticky top-20 space-y-6">
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 border-b border-gray-200 pb-2 text-lg font-semibold">Thông tin sự kiện</h3>

                  <div className="mb-4 space-y-3">
                    <div className="flex items-center">
                      <Calendar className="mr-3 h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Ngày diễn ra</p>
                        <p className="text-gray-700">
                          {formatDate(event.startDate)}
                          {event.endDate.toDateString() !== event.startDate.toDateString() && (
                            <span> - <br/>{formatDate(event.endDate)}</span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Clock className="mr-3 h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Thời gian</p>
                        <p className="text-gray-700">
                          {formatTime(event.startDate)} - {formatTime(event.endDate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <MapPin className="mr-3 h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Địa điểm</p>
                        <p className="text-gray-700">{event.venue}</p>
                        <p className="text-sm text-gray-600">{event.address}</p>
                      </div>
                    </div>

                    {event.price && (
                      <div className="flex items-center">
                        <DollarSign className="mr-3 h-5 w-5 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Giá vé</p>
                          <p className="text-gray-700">{event.price === 'Free' ? 'Miễn phí' : event.price}</p>
                        </div>
                      </div>
                    )}

                    {(event.attendees !== undefined && event.capacity !== undefined) && (
                      <div className="flex items-center">
                        <Users className="mr-3 h-5 w-5 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Người tham dự</p>
                          <p className="text-gray-700">{event.attendees} / {event.capacity}</p>
                          <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                            <div
                              className="h-full bg-primary-600"
                              style={{width: `${Math.min(100, (event.attendees / event.capacity) * 100)}%`}}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}

                    {event.organizer && (
                      <div className="flex items-center">
                        <User className="mr-3 h-5 w-5 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Nhà tổ chức</p>
                          <p className="text-gray-700">{event.organizer}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {event.status !== 'past' && event.ticketUrl && (
                    <div className="mt-6">
                      <a
                        href={event.ticketUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full rounded-md bg-primary-600 py-3 text-center font-medium text-white hover:bg-primary-700"
                      >
                        {event.price === 'Free' ? 'Đăng ký tham gia' : 'Mua vé ngay'}
                      </a>
                    </div>
                  )}
                </div>

                {event.status === 'upcoming' && (
                  <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
                    <div className="flex">
                      <Info className="mr-2 h-5 w-5 text-orange-500" />
                      <div>
                        <h4 className="font-medium text-orange-800">Sắp diễn ra</h4>
                        <p className="mt-1 text-sm text-orange-700">
                          Sự kiện này sẽ diễn ra sau {Math.ceil((event.startDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} ngày nữa.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {event.status === 'ongoing' && (
                  <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                    <div className="flex">
                      <Info className="mr-2 h-5 w-5 text-green-500" />
                      <div>
                        <h4 className="font-medium text-green-800">Đang diễn ra</h4>
                        <p className="mt-1 text-sm text-green-700">
                          Sự kiện này đang diễn ra. Hãy tham gia ngay hôm nay!
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {event.status === 'past' && (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <div className="flex">
                      <Info className="mr-2 h-5 w-5 text-gray-500" />
                      <div>
                        <h4 className="font-medium text-gray-800">Đã kết thúc</h4>
                        <p className="mt-1 text-sm text-gray-700">
                          Sự kiện này đã kết thúc. Cảm ơn bạn đã quan tâm.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
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
                alt="Hình ảnh phóng to"
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

export default EventDetailPage;

