import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SimpleLayout from '@/layouts/SimpleLayout';
import { FaMapMarkerAlt, FaClock, FaMoneyBillWave, FaPhoneAlt, FaGlobe, FaArrowLeft, FaHeart, FaRegHeart, FaShare, FaTag, FaShoppingBag } from 'react-icons/fa';
import { MdLocalMall, MdStorefront, MdCategory, MdDirections, MdLocalOffer } from 'react-icons/md';
import { BsInfoCircle } from 'react-icons/bs';

interface ShoppingDetail {
  id: string;
  name: string;
  type: 'market' | 'mall' | 'shop' | 'souvenir' | 'craft' | 'specialty';
  description: string;
  longDescription: string;
  image: string;
  gallery: string[];
  priceRange: string;
  rating: number;
  location: string;
  address: string;
  openingHours: string;
  contact: {
    phone: string;
    website: string;
  };
  categories: string[];
  specialties: string[];
  isPopular: boolean;
  tips: string[];
}

const ShoppingDetailPage = () => {
  const { t } = useTranslation(['common']);
  const { id } = useParams<{ id: string }>();
  const [shopItem, setShopItem] = useState<ShoppingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchShoppingDetail = async () => {
      try {
        setLoading(true);
        // Simulating API call with timeout
        setTimeout(() => {
          // Mock data
          const mockDetail: ShoppingDetail = {
            id: id || '1',
            name: id === '1' ? 'Ben Thanh Market' :
                  id === '2' ? 'Dong Ba Market' :
                  id === '3' ? 'Vincom Center' :
                  id === '4' ? 'Hoi An Silk Village' :
                  id === '5' ? 'Saigon Square' :
                  id === '6' ? 'Artisan Craft Shop' :
                  id === '7' ? 'Bat Trang Ceramic Village' : 'Aeon Mall',
            type: id === '1' || id === '2' ? 'market' :
                  id === '3' || id === '5' || id === '8' ? 'mall' :
                  id === '4' ? 'specialty' :
                  id === '6' ? 'souvenir' : 'craft',
            description: 'Popular shopping destination with a wide variety of goods',
            longDescription: `This is one of Vietnam's most iconic shopping destinations, offering an authentic experience for locals and tourists alike. 
                            The location features a diverse range of products including traditional handicrafts, textiles, souvenirs, local specialties, and more.
                            
                            Visitors can enjoy the vibrant atmosphere while browsing through countless stalls and shops. The place is known for its rich cultural 
                            heritage and the opportunity to find unique items that reflect Vietnamese traditions and craftsmanship.
                            
                            Whether you're looking for gifts to bring home, local delicacies to taste, or just want to experience the bustling commercial 
                            energy of Vietnam, this is a must-visit destination.`,
            image: `/images/hoian.jpg`,
            gallery: [
              '/images/hanoi.jpg',
              '/images/hoian.jpg',
              '/images/sapa.jpg',
              '/images/hagiang.jpg',
              '/images/halong_wal.jpg',
            ],
            priceRange: '$$',
            rating: 4.6,
            location: 'Ho Chi Minh City',
            address: '123 Le Loi Street, District 1',
            openingHours: 'Daily from 7:00 AM to 7:00 PM',
            contact: {
              phone: '+84 123 456 789',
              website: 'https://shopping.example.com',
            },
            categories: ['Handicrafts', 'Textiles', 'Souvenirs', 'Food', 'Jewelry', 'Home Decor'],
            specialties: [
              'Traditional silk products',
              'Handmade ceramics',
              'Local coffee and tea',
              'Vietnamese lacquerware',
              'Custom-tailored clothing'
            ],
            isPopular: true,
            tips: [
              'Bargaining is expected at markets, start at 50-70% of the asking price',
              'Morning is the best time to visit for a less crowded experience',
              'Bring small denominations of cash for easier transactions',
              'Check for authenticity certificates when buying high-end items',
              'Take a business card from shops you like for future reference'
            ],
          };

          setShopItem(mockDetail);
          setLoading(false);

          // Check if it's a favorite
          const favorites = JSON.parse(localStorage.getItem('shoppingFavorites') || '[]');
          setIsFavorite(favorites.includes(id));
        }, 1000);
      } catch (err) {
        setError('Error fetching shopping details');
        console.error('Error fetching shopping details:', err);
        setLoading(false);
      }
    };

    if (id) {
      fetchShoppingDetail();
    }
  }, [id]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('shoppingFavorites') || '[]');
    let newFavorites;

    if (isFavorite) {
      newFavorites = favorites.filter((favId: string) => favId !== id);
    } else {
      newFavorites = [...favorites, id];
    }

    localStorage.setItem('shoppingFavorites', JSON.stringify(newFavorites));
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
      case 'market':
        return <MdStorefront className="text-2xl text-amber-500" />;
      case 'mall':
        return <MdLocalMall className="text-2xl text-blue-500" />;
      case 'souvenir':
        return <FaShoppingBag className="text-2xl text-purple-500" />;
      case 'craft':
        return <FaTag className="text-2xl text-green-500" />;
      case 'specialty':
        return <MdCategory className="text-2xl text-red-500" />;
      default:
        return <MdStorefront className="text-2xl text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <SimpleLayout>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-indigo-600"></div>
        </div>
      </SimpleLayout>
    );
  }

  if (error || !shopItem) {
    return (
      <SimpleLayout>
        <div className="py-12 text-center">
          <div className="mb-4 text-5xl text-red-500">
            <BsInfoCircle className="inline" />
          </div>
          <h1 className="mb-4 text-2xl font-bold text-gray-800">
            {error || 'Shopping information not found'}
          </h1>
          <p className="mb-6 text-gray-600">
            The requested shopping destination could not be found or is unavailable.
          </p>
          <Link
            to="/shopping"
            className="inline-flex items-center rounded-lg bg-indigo-600 px-5 py-2 text-center text-white hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300"
          >
            <FaArrowLeft className="mr-2" /> Back to Shopping
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
            to="/shopping"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700"
          >
            <FaArrowLeft className="mr-2" /> Back to all shopping places
          </Link>
        </div>

        {/* Hero Section */}
        <div className="relative mb-8 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-700 to-purple-800 md:h-96">
          <img
            src={shopItem.image}
            alt={shopItem.name}
            className="h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 flex items-center justify-center p-6 md:items-end md:justify-start md:p-12">
            <div className="text-center md:text-left">
              <div className="mb-2 inline-block rounded-full bg-white/20 p-2 backdrop-blur-sm">
                {getTypeIcon(shopItem.type)}
              </div>
              <h1 className="mb-2 text-3xl font-bold text-white md:text-5xl">{shopItem.name}</h1>
              <p className="text-xl text-white/90">{shopItem.description}</p>
              {shopItem.isPopular && (
                <span className="mt-4 inline-block rounded-full bg-red-500 px-4 py-1 text-sm font-semibold text-white">
                  Popular Choice
                </span>
              )}
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
          <a
            href={`https://maps.google.com/?q=${shopItem.address}, ${shopItem.location}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-white shadow-md hover:bg-indigo-700"
          >
            <MdDirections className="mr-2" />
            Directions
          </a>
        </div>

        {/* Tab navigation */}
        <div className="mb-6 border-b">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`border-b-2 pb-4 pt-2 font-medium ${
                activeTab === 'overview'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('specialties')}
              className={`border-b-2 pb-4 pt-2 font-medium ${
                activeTab === 'specialties'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Specialties
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`border-b-2 pb-4 pt-2 font-medium ${
                activeTab === 'gallery'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Gallery
            </button>
            <button
              onClick={() => setActiveTab('tips')}
              className={`border-b-2 pb-4 pt-2 font-medium ${
                activeTab === 'tips'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Shopping Tips
            </button>
          </div>
        </div>

        {/* Tab content */}
        <div className="mb-12">
          {activeTab === 'overview' && (
            <div className="grid gap-8 md:grid-cols-3">
              <div className="md:col-span-2">
                <div className="mb-6">
                  <h2 className="mb-4 text-2xl font-bold">About this Place</h2>
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-line text-gray-700">{shopItem.longDescription}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="mb-3 text-xl font-semibold">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {shopItem.categories.map((category, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-800"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-indigo-50 p-6 shadow-md">
                <h2 className="mb-4 text-xl font-semibold text-indigo-900">Quick Information</h2>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <FaMapMarkerAlt className="mr-3 mt-1 text-lg text-red-600" />
                    <div>
                      <h3 className="font-medium text-gray-700">Address</h3>
                      <p>{shopItem.address}, {shopItem.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FaClock className="mr-3 mt-1 text-lg text-blue-600" />
                    <div>
                      <h3 className="font-medium text-gray-700">Opening Hours</h3>
                      <p>{shopItem.openingHours}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FaMoneyBillWave className="mr-3 mt-1 text-lg text-green-600" />
                    <div>
                      <h3 className="font-medium text-gray-700">Price Range</h3>
                      <p>{shopItem.priceRange}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FaPhoneAlt className="mr-3 mt-1 text-lg text-gray-600" />
                    <div>
                      <h3 className="font-medium text-gray-700">Contact</h3>
                      <p>{shopItem.contact.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FaGlobe className="mr-3 mt-1 text-lg text-purple-600" />
                    <div>
                      <h3 className="font-medium text-gray-700">Website</h3>
                      <a href={shopItem.contact.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                        Visit website
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-indigo-200 pt-6">
                  <div className="text-center">
                    <a
                      href={`https://maps.google.com/?q=${shopItem.address}, ${shopItem.location}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block rounded-lg bg-indigo-600 px-5 py-2 text-center text-white hover:bg-indigo-700"
                    >
                      <MdDirections className="mr-1 inline" /> View on Map
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'specialties' && (
            <div>
              <h2 className="mb-6 text-2xl font-bold">Special Items & Products</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {shopItem.specialties.map((specialty, index) => (
                  <div
                    key={index}
                    className="flex overflow-hidden rounded-lg bg-white shadow-md transition-all hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="flex w-16 flex-shrink-0 items-center justify-center bg-gradient-to-b from-indigo-600 to-indigo-800 text-white">
                      <MdLocalOffer className="text-2xl" />
                    </div>
                    <div className="p-4">
                      <h3 className="mb-1 font-semibold">{specialty}</h3>
                      <p className="text-sm text-gray-600">Authentic handcrafted item unique to this shopping destination</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'gallery' && (
            <div>
              <h2 className="mb-6 text-2xl font-bold">Gallery</h2>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {shopItem.gallery.map((img, index) => (
                  <div
                    key={index}
                    className="group cursor-pointer overflow-hidden rounded-lg shadow-md"
                    onClick={() => handleImageClick(img)}
                  >
                    <img
                      src={img}
                      alt={`${shopItem.name} - Image ${index + 1}`}
                      className="h-52 w-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="p-2 text-center">
                      <span className="text-sm text-gray-600">{shopItem.name} - View {index + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'tips' && (
            <div>
              <h2 className="mb-6 text-2xl font-bold">Shopping Tips</h2>
              <div className="rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 p-6">
                <ul className="space-y-4">
                  {shopItem.tips.map((tip, index) => (
                    <li key={index} className="flex items-start rounded-lg bg-white p-4 shadow-sm">
                      <span className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-gray-700">{tip}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Related shopping places */}
        <div>
          <h2 className="mb-6 text-2xl font-bold">You Might Also Like</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Link
                key={index}
                to={`/shopping/${(Number(id) % 8) + 1 + index}`}
                className="group overflow-hidden rounded-lg bg-white shadow-md transition-transform hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={`/images/${index === 0 ? 'hanoi' : index === 1 ? 'hoian' : 'sapa'}.jpg`}
                    alt="Shopping place"
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/30"></div>
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <h3 className="text-lg font-semibold">
                      {index === 0 ? 'Hanoi Night Market' : index === 1 ? 'Craft Village Tours' : 'Luxury Boutiques'}
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
              alt="Shopping place enlarged view"
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

export default ShoppingDetailPage;
