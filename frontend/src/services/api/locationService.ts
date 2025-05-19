import apiClient from './apiClient';

// For demo purposes, we'll use this mock data
// In a real application, you would replace this with actual API calls
const mockLocations = [
  {
    id: '1',
    name: 'Eiffel Tower',
    category: 'historical',
    description: 'Iconic iron tower in Paris that offers breathtaking views of the city.',
    imageUrl: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e',
    rating: 4.7,
    latitude: 48.8584,
    longitude: 2.2945,
    address: 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France',
    website: 'https://www.toureiffel.paris/en',
    featured: true,
    countryCode: 'FR'
  },
  {
    id: '2',
    name: 'Bali Beach',
    category: 'beach',
    description: 'Beautiful beach with white sand and crystal clear water in Bali, Indonesia.',
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
    rating: 4.5,
    latitude: -8.3405,
    longitude: 115.0920,
    address: 'Kuta Beach, Bali, Indonesia',
    featured: true,
    countryCode: 'ID'
  },
  {
    id: '3',
    name: 'Swiss Alps',
    category: 'mountain',
    description: 'Majestic mountain range in Switzerland, offering incredible hiking and skiing opportunities.',
    imageUrl: 'https://images.unsplash.com/photo-1531795951970-40c4d7cda2f7',
    rating: 4.9,
    latitude: 46.8182,
    longitude: 8.2275,
    address: 'Swiss Alps, Switzerland',
    featured: true,
    countryCode: 'CH'
  },
  {
    id: '4',
    name: 'Tokyo Tower',
    category: 'city',
    description: 'Famous landmark in Tokyo with observation decks offering panoramic views of the city.',
    imageUrl: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc',
    rating: 4.4,
    latitude: 35.6586,
    longitude: 139.7454,
    address: '4 Chome-2-8 Shibakoen, Minato City, Tokyo 105-0011, Japan',
    countryCode: 'JP'
  },
  {
    id: '5',
    name: 'Grand Canyon',
    category: 'countryside',
    description: 'Stunning natural wonder in Arizona featuring layered bands of red rock.',
    imageUrl: 'https://images.unsplash.com/photo-1527600478564-f82b361a3be2',
    rating: 4.8,
    latitude: 36.0544,
    longitude: -112.2401,
    address: 'Grand Canyon National Park, Arizona, USA',
    countryCode: 'US'  },
  {
    id: '6',
    name: 'Ha Long Bay',
    category: 'natural',
    description: 'Stunning limestone karsts and isles in various shapes and sizes in northeastern Vietnam.',
    imageUrl: 'https://images.unsplash.com/photo-1573270689103-d7a4e42b609a',
    rating: 4.8,
    latitude: 20.9101,
    longitude: 107.1839,
    address: 'Ha Long Bay, Quang Ninh Province, Vietnam',
    featured: true,
    countryCode: 'VN'
  },
  {
    id: '7',
    name: 'Hoi An Ancient Town',
    category: 'historical',
    description: 'A well-preserved example of a Southeast Asian trading port dating from the 15th to the 19th century.',
    imageUrl: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b',
    rating: 4.7,
    latitude: 15.8801,
    longitude: 108.3380,
    address: 'Hoi An, Quang Nam Province, Vietnam',
    featured: true,
    countryCode: 'VN'
  },
  {
    id: '8',
    name: 'Sapa Rice Terraces',
    category: 'countryside',
    description: 'Stunning terraced rice fields in the mountainous region of northern Vietnam.',
    imageUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592',
    rating: 4.6,
    latitude: 22.3364,
    longitude: 103.8438,
    address: 'Sapa, Lao Cai Province, Vietnam',
    countryCode: 'VN'
  },
  {
    id: '9',
    name: 'Gyeongbokgung Palace',
    category: 'historical',
    description: 'The main royal palace of the Joseon dynasty in Seoul, South Korea.',
    imageUrl: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58',
    rating: 4.7,
    latitude: 37.5796,
    longitude: 126.9770,
    address: '161 Sajik-ro, Jongno-gu, Seoul, South Korea',
    featured: true,
    countryCode: 'KR'
  },
  {
    id: '10',
    name: 'Gardens by the Bay',
    category: 'city',
    description: 'Nature park spanning 101 hectares in the Central Region of Singapore.',
    imageUrl: 'https://images.unsplash.com/photo-1506351421178-63b52a2d2562',
    rating: 4.8,
    latitude: 1.2815,
    longitude: 103.8636,
    address: '18 Marina Gardens Dr, Singapore 018953',
    featured: true,
    countryCode: 'SG'
  }
];

export const getLocations = async (params: Record<string, any> = {}) => {
  // In a real app, you would do:
  // const { data } = await apiClient.get('/locations', { params });
  // return data;
  
  // For demo, we'll filter the mock data based on params
  await new Promise((resolve) => setTimeout(resolve, 800)); // Simulated delay
  
  let filteredLocations = [...mockLocations];
  
  if (params.featured) {
    filteredLocations = filteredLocations.filter((loc) => loc.featured);
  }
  
  if (params.countryCode) {
    filteredLocations = filteredLocations.filter((loc) => loc.countryCode === params.countryCode);
  }
  
  if (params.category && params.category !== 'all') {
    filteredLocations = filteredLocations.filter((loc) => loc.category === params.category);
  }
  
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredLocations = filteredLocations.filter(
      (loc) =>
        loc.name.toLowerCase().includes(searchLower) ||
        loc.description.toLowerCase().includes(searchLower)
    );
  }
  
  return filteredLocations;
};

export const getLocationById = async (id: string) => {
  // In a real app, you would do:
  // const { data } = await apiClient.get(`/locations/${id}`);
  // return data;
    // For demo, we'll find the mock location
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulated delay
  
  const location = mockLocations.find((loc) => loc.id === id);
  
  if (!location) {
    throw new Error('Location not found');
  }
  return location;
};

// Get locations by category
export const getLocationsByCategory = async (category: string) => {
  return getLocations({ category });
};

// Search locations
export const searchLocations = async (query: string) => {
  return getLocations({ search: query });
};

// Export the locationService
export const locationService = {
  getLocations,
  getLocationById,
  getLocationsByCategory,
  searchLocations
};
