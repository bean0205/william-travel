import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SimpleLayout from '@/layouts/SimpleLayout';
import { FaTaxi, FaBus, FaTrain, FaMotorcycle, FaMapMarkerAlt, FaClock, FaMoneyBillWave, FaPhoneAlt, FaGlobe, FaArrowLeft, FaHeart, FaRegHeart, FaShare } from 'react-icons/fa';
import { MdFlight, MdDirectionsBoat, MdSchedule, MdStar } from 'react-icons/md';
import { BsInfoCircle } from 'react-icons/bs';

interface TransportationDetail {
  id: string;
  name: string;
  type: 'taxi' | 'bus' | 'train' | 'air' | 'motorcycle' | 'boat' | 'other';
  description: string;
  longDescription: string;
  image: string;
  gallery: string[];
  price: string;
  rating: number;
  routes: string[];
  schedule: string;
  contact: {
    phone: string;
    website: string;
  };
  tips: string[];
  location: string;
}

const TransportationDetailPage = () => {
  const { t } = useTranslation(['common']);
  const { id } = useParams<{ id: string }>();
  const [transportItem, setTransportItem] = useState<TransportationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransportDetail = async () => {
      try {
        setLoading(true);
        // Simulating API call with timeout
        setTimeout(() => {
          // Mock data
          const mockDetail: TransportationDetail = {
            id: id || '1',
            name: id === '1' ? 'City Bus Network' :
                  id === '2' ? 'Express Train' :
                  id === '3' ? 'GrabBike' :
                  id === '4' ? 'Domestic Flights' :
                  id === '5' ? 'Halong Bay Cruise' : 'Traditional Taxi',
            type: id === '1' ? 'bus' :
                  id === '2' ? 'train' :
                  id === '3' ? 'motorcycle' :
                  id === '4' ? 'air' :
                  id === '5' ? 'boat' : 'taxi',
            description: 'Convenient transportation option for travelers',
            longDescription: `This is a comprehensive transportation service that offers reliable and comfortable travel options. 
                              The service is designed to cater to both locals and tourists, ensuring everyone can reach their desired destinations with ease.
                              
                              The service operates on an extensive network covering major landmarks, tourist attractions, and important transport hubs.
                              Safety is a top priority, with regular maintenance checks and professional staff.`,
            image: `/images/halong_wal.jpg`,
            gallery: [
              '/images/hanoi.jpg',
              '/images/hoian.jpg',
              '/images/sapa.jpg',
              '/images/hagiang.jpg',
            ],
            price: '$5-$30',
            rating: 4.5,
            routes: ['City Center', 'Tourist Districts', 'Airport'],
            schedule: 'Daily from 6:00 AM to 10:00 PM',
            contact: {
              phone: '+84 123 456 789',
              website: 'https://transport.example.com',
            },
            tips: [
              'Book tickets in advance during peak season',
              'Have small denominations of cash ready',
              'Keep your ticket until the end of your journey',
              'Download the official app for real-time schedules',
            ],
            location: 'Various stations across the city',
          };

          setTransportItem(mockDetail);
          setLoading(false);

          // Check if it's a favorite
          const favorites = JSON.parse(localStorage.getItem('transportFavorites') || '[]');
          setIsFavorite(favorites.includes(id));
        }, 1000);
      } catch (err) {
        setError('Error fetching transportation details');
        console.error('Error fetching transportation details:', err);
        setLoading(false);
      }
    };

    if (id) {
      fetchTransportDetail();
    }
  }, [id]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('transportFavorites') || '[]');
    let newFavorites;

    if (isFavorite) {
      newFavorites = favorites.filter((favId: string) => favId !== id);
    } else {
      newFavorites = [...favorites, id];
    }

    localStorage.setItem('transportFavorites', JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'taxi':
        return <FaTaxi className="text-2xl text-yellow-500" />;
      case 'bus':
        return <FaBus className="text-2xl text-blue-500" />;
      case 'train':
        return <FaTrain className="text-2xl text-green-500" />;
      case 'air':
        return <MdFlight className="text-2xl text-sky-500" />;
      case 'motorcycle':
        return <FaMotorcycle className="text-2xl text-red-500" />;
      case 'boat':
        return <MdDirectionsBoat className="text-2xl text-teal-500" />;
      default:
        return <FaBus className="text-2xl text-gray-500" />;
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

  if (error || !transportItem) {
    return (
      <SimpleLayout>
        <div className="py-12 text-center">
          <div className="mb-4 text-5xl text-red-500">
            <BsInfoCircle className="inline" />
          </div>
          <h1 className="mb-4 text-2xl font-bold text-gray-800">
            {error || 'Transportation information not found'}
          </h1>
          <p className="mb-6 text-gray-600">
            The requested transportation information could not be found or is unavailable.
          </p>
          <Link
            to="/transportation"
            className="inline-flex items-center rounded-lg bg-primary-600 px-5 py-2 text-center text-white hover:bg-primary-700 focus:ring-4 focus:ring-primary-300"
          >
            <FaArrowLeft className="mr-2" /> Back to Transportation
          </Link>
        </div>
      </SimpleLayout>
    );
  }

  return (
    <SimpleLayout>
      <div className="container mx-auto px-4 py-8 md:px-6">
        {/* Back button */}
        <div className="mb-6">
          <Link
            to="/transportation"
            className="inline-flex items-center text-primary-600 hover:text-primary-700"
          >
            <FaArrowLeft className="mr-2" /> Back to all transportation options
          </Link>
        </div>

        {/* Hero Section */}
        <div className="relative mb-8 overflow-hidden rounded-xl bg-gradient-to-r from-primary-700 to-primary-900 md:h-96">
          <img
            src={transportItem.image}
            alt={transportItem.name}
            className="h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 flex items-center justify-center p-6 md:items-end md:justify-start md:p-12">
            <div className="text-center md:text-left">
              <div className="mb-2 inline-block rounded-full bg-white/20 p-2 backdrop-blur-sm">
                {getTypeIcon(transportItem.type)}
              </div>
              <h1 className="mb-2 text-3xl font-bold text-white md:text-5xl">{transportItem.name}</h1>
              <p className="text-xl text-white/90">{transportItem.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {transportItem.routes.map((route, index) => (
                  <span key={index} className="rounded-full bg-white/20 px-4 py-1 text-sm text-white backdrop-blur-sm">
                    {route}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mb-8 flex flex-wrap gap-4">
          <button
            onClick={toggleFavorite}
            className="flex items-center rounded-lg bg-white px-4 py-2 text-gray-800 shadow-md hover:bg-gray-50"
          >
            {isFavorite ? (
              <FaHeart className="mr-2 text-red-500" />
            ) : (
              <FaRegHeart className="mr-2" />
            )}
            {isFavorite ? 'Saved' : 'Save'}
          </button>
          <button className="flex items-center rounded-lg bg-white px-4 py-2 text-gray-800 shadow-md hover:bg-gray-50">
            <FaShare className="mr-2" />
            Share
          </button>
        </div>

        {/* Tab navigation */}
        <div className="mb-6 border-b">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`border-b-2 pb-4 pt-2 font-medium ${
                activeTab === 'overview'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`border-b-2 pb-4 pt-2 font-medium ${
                activeTab === 'gallery'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Gallery
            </button>
            <button
              onClick={() => setActiveTab('tips')}
              className={`border-b-2 pb-4 pt-2 font-medium ${
                activeTab === 'tips'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Tips
            </button>
          </div>
        </div>

        {/* Tab content */}
        <div className="mb-12">
          {activeTab === 'overview' && (
            <div className="grid gap-8 md:grid-cols-3">
              <div className="md:col-span-2">
                <div className="mb-6">
                  <h2 className="mb-4 text-2xl font-bold">About this Transportation</h2>
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-line text-gray-700">{transportItem.longDescription}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-gray-50 p-6 shadow-md">
                <h2 className="mb-4 text-xl font-semibold">Quick Information</h2>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <FaMoneyBillWave className="mr-3 mt-1 text-lg text-green-600" />
                    <div>
                      <h3 className="font-medium text-gray-700">Price Range</h3>
                      <p>{transportItem.price}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MdSchedule className="mr-3 mt-1 text-lg text-blue-600" />
                    <div>
                      <h3 className="font-medium text-gray-700">Schedule</h3>
                      <p>{transportItem.schedule}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FaMapMarkerAlt className="mr-3 mt-1 text-lg text-red-600" />
                    <div>
                      <h3 className="font-medium text-gray-700">Location</h3>
                      <p>{transportItem.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MdStar className="mr-3 mt-1 text-lg text-amber-500" />
                    <div>
                      <h3 className="font-medium text-gray-700">Rating</h3>
                      <p>{transportItem.rating.toFixed(1)} / 5</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FaPhoneAlt className="mr-3 mt-1 text-lg text-gray-600" />
                    <div>
                      <h3 className="font-medium text-gray-700">Contact</h3>
                      <p>{transportItem.contact.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FaGlobe className="mr-3 mt-1 text-lg text-purple-600" />
                    <div>
                      <h3 className="font-medium text-gray-700">Website</h3>
                      <a href={transportItem.contact.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                        Visit website
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'gallery' && (
            <div>
              <h2 className="mb-6 text-2xl font-bold">Gallery</h2>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {transportItem.gallery.map((img, index) => (
                  <div
                    key={index}
                    className="cursor-pointer overflow-hidden rounded-lg"
                    onClick={() => handleImageClick(img)}
                  >
                    <img
                      src={img}
                      alt={`${transportItem.name} - Image ${index + 1}`}
                      className="h-48 w-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'tips' && (
            <div>
              <h2 className="mb-6 text-2xl font-bold">Travel Tips</h2>
              <div className="rounded-lg bg-amber-50 p-6">
                <ul className="space-y-4">
                  {transportItem.tips.map((tip, index) => (
                    <li key={index} className="flex">
                      <span className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-800">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Related options */}
        <div>
          <h2 className="mb-6 text-2xl font-bold">Other Transportation Options</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Link
                key={index}
                to={`/transportation/${(Number(id) % 6) + 1 + index}`}
                className="group overflow-hidden rounded-lg bg-white shadow-md transition-transform hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={`/images/${index === 0 ? 'hanoi' : index === 1 ? 'hoian' : 'sapa'}.jpg`}
                    alt="Transportation"
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/30"></div>
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <h3 className="text-lg font-semibold">
                      {index === 0 ? 'Local Buses' : index === 1 ? 'Rental Cars' : 'River Ferries'}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Image modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={closeImageModal}
        >
          <div className="relative max-h-[90vh] max-w-5xl overflow-hidden">
            <img
              src={selectedImage}
              alt="Transportation enlarged view"
              className="h-auto max-h-[85vh] w-auto max-w-full object-contain"
            />
            <button
              className="absolute right-4 top-4 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
              onClick={closeImageModal}
            >
              <span className="text-2xl">&times;</span>
            </button>
          </div>
        </div>
      )}
    </SimpleLayout>
  );
};

export default TransportationDetailPage;
