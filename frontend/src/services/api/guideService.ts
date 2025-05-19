import apiClient from './apiClient';

// Mock data for guides
const mockGuides = [
  {
    id: '1',
    title: 'Ultimate Paris Travel Guide',
    author: 'Sophie Martin',
    category: 'Europe',
    excerpt: 'Discover the best of Paris with our comprehensive guide to attractions, dining, and accommodation.',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
    date: '2023-06-15',
  },
  {
    id: '2',
    title: 'Exploring Bali: Hidden Gems',
    author: 'Michael Wong',
    category: 'Asia',
    excerpt: 'Beyond the tourist spots, Bali offers secluded beaches, cultural experiences, and authentic cuisine.',
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
    date: '2023-07-22',
  },
  {
    id: '3',
    title: 'New York City on a Budget',
    author: 'Emily Johnson',
    category: 'North America',
    excerpt: 'See the best of NYC without breaking the bank with these insider tips and free attractions.',
    imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9',
    date: '2023-05-09',
  },
  {
    id: '4',
    title: 'Adventure Guide to New Zealand',
    author: 'Daniel Smith',
    category: 'Oceania',
    excerpt: 'From bungee jumping to hiking volcanic landscapes, experience the ultimate adventure in New Zealand.',
    imageUrl: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad',
    date: '2023-08-03',
  },
  {
    id: '5',
    title: 'Safari Experience in Tanzania',
    author: 'Lisa Okoro',
    category: 'Africa',
    excerpt: 'Plan your dream safari in Tanzania with tips on wildlife viewing, accommodation, and best seasons to visit.',
    imageUrl: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53',
    date: '2023-04-17',
  },
];

export const getGuides = async (params: Record<string, any> = {}) => {
  // In a real app, you would do:
  // const { data } = await apiClient.get('/guides', { params });
  // return data;
  
  // For demo, we'll filter the mock data based on params
  await new Promise((resolve) => setTimeout(resolve, 700)); // Simulated delay
  
  let filteredGuides = [...mockGuides];
  
  if (params.category) {
    filteredGuides = filteredGuides.filter((guide) => guide.category === params.category);
  }
  
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredGuides = filteredGuides.filter(
      (guide) =>
        guide.title.toLowerCase().includes(searchLower) ||
        guide.excerpt.toLowerCase().includes(searchLower)
    );
  }
  
  return filteredGuides;
};

export const getGuideById = async (id: string) => {
  // In a real app, you would do:
  // const { data } = await apiClient.get(`/guides/${id}`);
  // return data;
  
  // For demo, we'll find the mock guide
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulated delay
  
  const guide = mockGuides.find((g) => g.id === id);
  
  if (!guide) {
    throw new Error('Guide not found');
  }
  
  return guide;
};
