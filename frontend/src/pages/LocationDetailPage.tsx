import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useTranslation } from 'react-i18next';
import SimpleLayout from '@/layouts/SimpleLayout';
import * as locationService from '@/services/api/locationService';
import {
  FaMapMarkerAlt,
  FaStar,
  FaGlobe,
  FaPhone,
  FaInfoCircle,
  FaHeart,
  FaRegHeart,
  FaShare,
  FaComments,
} from 'react-icons/fa';
import { IoMdPhotos } from 'react-icons/io';
import { MdOutlineRecommend } from 'react-icons/md';

const LocationDetailPage = () => {
  const { t } = useTranslation(['locations', 'common']);
  const { id } = useParams<{ id: string }>();
  const [location, setLocation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { isAuthenticated } = useAuthStore();

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
        setError(t('locations:detail.error'));
        console.error('Error fetching location details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchLocationDetail();
    }
  }, [id, t]);

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
      <SimpleLayout>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary-600"></div>
        </div>
      </SimpleLayout>
    );
  }

  if (error || !location) {
    return (
      <SimpleLayout>
        <div className="py-12 text-center">
          <div className="mb-4 text-5xl text-red-500">
            <FaInfoCircle className="inline" />
          </div>
          <h1 className="mb-4 text-2xl font-bold text-gray-800">
            {error || t('locations:detail.notFound')}
          </h1>
          <p className="mb-6 text-gray-600">
            {t('locations:detail.notFoundDescription')}
          </p>
          <Link to="/locations" className="btn btn-primary">
            {t('common:backToList')}
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
          className={`${i <= rating ? 'text-yellow-500' : 'text-gray-300'} text-xl`}
        />
      );
    }
    return stars;
  };
  return (
    <SimpleLayout>
      {/* Hero section with main image */}
      <div className="relative h-[50vh] w-full">
        <img
          src={
            location.featuredImage ||
            location.images?.[0] ||
            '/placeholder-image.jpg'
          }
          alt={location.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="container mx-auto">
            <div className="mb-2 flex items-center">
              <FaMapMarkerAlt className="mr-2" />
              <span className="text-sm">
                {location.region || location.country}
              </span>
            </div>
            <h1 className="mb-2 text-4xl font-bold">{location.name}</h1>
            <div className="mb-4 flex items-center">
              <div className="mr-4 flex">
                {renderStars(location.rating || 0)}
                <span className="ml-2">
                  ({location.reviewCount || 0} {t('locations:detail.reviews')})
                </span>
              </div>
              <span className="rounded-full bg-primary-100 bg-opacity-90 px-3 py-1 text-xs font-medium text-primary-800">
                {location.category}
              </span>
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
                {isFavorite ? t('locations:detail.favorited') : t('locations:detail.favorite')}
              </button>

              <button className="flex items-center rounded-md bg-gray-100 px-4 py-2 font-medium text-gray-700 hover:bg-gray-200">
                <FaShare className="mr-2" />
                {t('locations:detail.share')}
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
                  {t('locations:detail.overview')}
                </button>
                <button
                  onClick={() => setActiveTab('photos')}
                  className={`border-b-2 px-1 py-4 text-sm font-medium ${
                    activeTab === 'photos'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {t('locations:detail.photos')}
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`border-b-2 px-1 py-4 text-sm font-medium ${
                    activeTab === 'reviews'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {t('locations:detail.reviews')}
                </button>
              </nav>
            </div>

            {/* Tab content */}
            {activeTab === 'overview' && (
              <div>
                <h2 className="mb-4 text-2xl font-bold">{t('locations:detail.introduction')}</h2>
                <p className="mb-6 leading-relaxed text-gray-700">
                  {location.description}
                </p>

                {location.highlights && location.highlights.length > 0 && (
                  <>
                    <h3 className="mb-3 mt-8 text-xl font-bold">
                      {t('locations:detail.highlights')}
                    </h3>
                    <ul className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                      {location.highlights.map(
                        (highlight: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-2 text-primary-500">✓</span>
                            <span>{highlight}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </>
                )}

                {location.activities && location.activities.length > 0 && (
                  <>
                    <h3 className="mb-3 mt-8 text-xl font-bold">
                      {t('locations:detail.activities')}
                    </h3>
                    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                      {location.activities.map(
                        (activity: any, index: number) => (
                          <div
                            key={index}
                            className="rounded-lg bg-gray-50 p-4"
                          >
                            <h4 className="mb-2 font-medium">
                              {activity.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {activity.description}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </>
                )}

                <h3 className="mb-3 mt-8 text-xl font-bold">
                  {t('locations:detail.map')}
                </h3>
                <div className="mb-8 h-80 rounded-lg bg-gray-200">
                  {/* Replace with your map component */}
                  <div className="flex h-full w-full items-center justify-center">
                    <p className="text-gray-500">{t('locations:detail.mapLoading')}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'photos' && (
              <div>
                <h2 className="mb-4 text-2xl font-bold">{t('locations:detail.photoGallery')}</h2>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {(location.images || []).map(
                    (image: string, index: number) => (
                      <div
                        key={index}
                        className="h-48 cursor-pointer overflow-hidden rounded-lg"
                        onClick={() => handleImageClick(image)}
                      >
                        <img
                          src={image}
                          alt={`${location.name} - Ảnh ${index + 1}`}
                          className="h-full w-full object-cover transition-opacity hover:opacity-90"
                        />
                      </div>
                    )
                  )}
                </div>

                {/* Empty state for no images */}
                {(!location.images || location.images.length === 0) && (
                  <div className="rounded-lg bg-gray-50 py-12 text-center">
                    <IoMdPhotos className="mx-auto mb-3 text-4xl text-gray-400" />
                    <p className="text-gray-500">
                      {t('locations:detail.noPhotos')}
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold">{t('locations:detail.visitorReviews')}</h2>
                  <button className="btn btn-primary">
                    <FaComments className="mr-2" />
                    {t('locations:detail.writeReview')}
                  </button>
                </div>

                {location.reviews && location.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {location.reviews.map((review: any, index: number) => (
                      <div
                        key={index}
                        className="border-b border-gray-200 pb-6 last:border-b-0"
                      >
                        <div className="mb-2 flex items-center">
                          <div className="mr-3 h-10 w-10 rounded-full bg-primary-200 text-center text-lg leading-10">
                            {review.author[0].toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-medium">{review.author}</h4>
                            <div className="flex items-center text-sm text-gray-500">
                              <span className="mr-2">
                                {new Date(review.date).toLocaleDateString()}
                              </span>
                              <div className="flex">
                                {renderStars(review.rating).map((star, i) => (
                                  <span key={i} className="text-xs">
                                    {star}
                                  </span>
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
                  <div className="rounded-lg bg-gray-50 py-12 text-center">
                    <FaComments className="mx-auto mb-3 text-4xl text-gray-400" />
                    <p className="text-gray-500">
                      {t('locations:detail.noReviews')}
                    </p>
                    <p className="mt-2 text-gray-500">
                      {t('locations:detail.firstReviewPrompt')}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar column */}
          <div className="lg:col-span-1">
            {/* Quick information */}
            <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
              <h3 className="mb-4 text-lg font-bold">{t('locations:detail.basicInfo')}</h3>

              <div className="space-y-4">
                {location.address && (
                  <div className="flex">
                    <FaMapMarkerAlt className="mr-3 mt-1 flex-shrink-0 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {t('locations:detail.address')}
                      </p>
                      <p className="text-gray-600">{location.address}</p>
                    </div>
                  </div>
                )}

                {location.website && (
                  <div className="flex">
                    <FaGlobe className="mr-3 mt-1 flex-shrink-0 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {t('locations:detail.website')}
                      </p>
                      <a
                        href={location.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary-600 hover:underline"
                      >
                        {location.website.replace(/^https?:\/\/(www\.)?/, '')}
                      </a>
                    </div>
                  </div>
                )}

                {location.phone && (
                  <div className="flex">
                    <FaPhone className="mr-3 mt-1 flex-shrink-0 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {t('locations:detail.phone')}
                      </p>
                      <p className="text-gray-600">{location.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Best time to visit */}
            {location.bestTimeToVisit && (
              <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
                <h3 className="mb-3 text-lg font-bold">
                  {t('locations:detail.bestTimeToVisit')}
                </h3>
                <p className="text-gray-700">{location.bestTimeToVisit}</p>
              </div>
            )}

            {/* Weather information */}
            {location.weather && (
              <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
                <h3 className="mb-3 text-lg font-bold">{t('locations:detail.weather')}</h3>
                <p className="mb-2 text-gray-700">
                  {location.weather.description}
                </p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded bg-blue-50 p-2">
                    <p className="text-xs text-gray-500">{t('locations:detail.spring')}</p>
                    <p className="font-medium">{location.weather.spring}°C</p>
                  </div>
                  <div className="rounded bg-yellow-50 p-2">
                    <p className="text-xs text-gray-500">{t('locations:detail.summer')}</p>
                    <p className="font-medium">{location.weather.summer}°C</p>
                  </div>
                  <div className="rounded bg-orange-50 p-2">
                    <p className="text-xs text-gray-500">{t('locations:detail.autumn')}</p>
                    <p className="font-medium">{location.weather.autumn}°C</p>
                  </div>
                  <div className="col-span-3 rounded bg-blue-100 p-2">
                    <p className="text-xs text-gray-500">{t('locations:detail.winter')}</p>
                    <p className="font-medium">{location.weather.winter}°C</p>
                  </div>
                </div>
              </div>
            )}

            {/* Related locations */}
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="mb-4 flex items-center text-lg font-bold">
                <MdOutlineRecommend className="mr-2" />
                {t('locations:detail.relatedLocations')}
              </h3>

              {location.relatedLocations &&
              location.relatedLocations.length > 0 ? (
                <div className="space-y-4">
                  {location.relatedLocations.map((item: any, index: number) => (
                    <Link
                      key={index}
                      to={`/locations/${item.id}`}
                      className="group flex items-start"
                    >
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="ml-3">
                        <h4 className="font-medium text-gray-900 group-hover:text-primary-600">
                          {item.name}
                        </h4>
                        <div className="mb-1 flex text-xs text-yellow-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span
                              key={i}
                              className={
                                i < item.rating
                                  ? 'text-yellow-500'
                                  : 'text-gray-300'
                              }
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500">{item.region}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  {t('locations:detail.noRelatedLocations')}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen image modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
          onClick={closeImageModal}
        >
          <button
            className="absolute right-4 top-4 rounded-full bg-black bg-opacity-50 p-2 text-white hover:bg-opacity-70"
            onClick={closeImageModal}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <img
            src={selectedImage}
            alt="Location"
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />{' '}
        </div>
      )}
    </SimpleLayout>
  );
};

export default LocationDetailPage;
