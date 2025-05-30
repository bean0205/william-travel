import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon, EyeIcon } from '@/components/ui/icons';
import { Badge } from '@/components/ui/badge';

// Mock data - would be replaced with API calls
const mockArticles = [
  {
    id: 1,
    title: 'Top 10 Things to Do in Hanoi',
    slug: 'top-10-things-to-do-in-hanoi',
    summary: 'A quick guide to the best attractions in Hanoi',
    author: {
      id: 2,
      full_name: 'Travel Writer'
    },
    category_id: 1,
    category_name: 'Travel Guide',
    published: true,
    published_at: '2025-05-15T10:30:00',
    created_at: '2025-05-14T15:30:45',
    updated_at: '2025-05-15T10:30:00'
  },
  {
    id: 2,
    title: 'Best Street Food in Ho Chi Minh City',
    slug: 'best-street-food-in-ho-chi-minh-city',
    summary: 'Explore the vibrant street food scene in HCMC',
    author: {
      id: 3,
      full_name: 'Food Expert'
    },
    category_id: 3,
    category_name: 'Food & Dining',
    published: true,
    published_at: '2025-05-12T09:15:30',
    created_at: '2025-05-10T11:20:15',
    updated_at: '2025-05-12T09:15:30'
  },
  {
    id: 3,
    title: 'Hidden Beaches of Vietnam',
    slug: 'hidden-beaches-of-vietnam',
    summary: 'Discover Vietnam\'s lesser-known coastal paradises',
    author: {
      id: 2,
      full_name: 'Travel Writer'
    },
    category_id: 2,
    category_name: 'Destinations',
    published: false,
    published_at: null,
    created_at: '2025-05-20T14:40:22',
    updated_at: '2025-05-20T14:40:22'
  }
];

const mockEvents = [
  {
    id: 1,
    name: 'Lantern Festival',
    description: 'Annual lantern festival in Hoi An',
    category_id: 1,
    category_name: 'Festival',
    organizer_id: 3,
    organizer_name: 'Hoi An Tourism Board',
    start_date: '2025-06-15',
    end_date: '2025-06-16',
    location: {
      address: 'Hoi An Ancient Town',
    },
    region_id: 3,
    region_name: 'Quang Nam',
    created_at: '2025-05-01T00:00:00',
    updated_at: '2025-05-01T00:00:00'
  },
  {
    id: 2,
    name: 'Food and Culture Festival',
    description: 'Festival celebrating Vietnamese food and culture',
    category_id: 2,
    category_name: 'Food Event',
    organizer_id: 2,
    organizer_name: 'HCMC Tourism Department',
    start_date: '2025-07-20',
    end_date: '2025-07-22',
    location: {
      address: 'September 23 Park, Ho Chi Minh City',
    },
    region_id: 2,
    region_name: 'Ho Chi Minh City',
    created_at: '2025-05-05T10:15:30',
    updated_at: '2025-05-05T10:15:30'
  }
];

const mockAccommodations = [
  {
    id: 1,
    name: 'Luxury Hotel & Spa',
    description: '5-star luxury accommodation',
    category_id: 1,
    category_name: 'Hotel',
    price_range: '200-500',
    rating: 4.8,
    region_id: 1,
    region_name: 'Hanoi',
    created_at: '2025-05-01T00:00:00',
    updated_at: '2025-05-01T00:00:00'
  },
  {
    id: 2,
    name: 'Beachside Resort',
    description: 'Beautiful resort by the beach',
    category_id: 3,
    category_name: 'Resort',
    price_range: '300-700',
    rating: 4.6,
    region_id: 4,
    region_name: 'Da Nang',
    created_at: '2025-05-03T14:25:10',
    updated_at: '2025-05-03T14:25:10'
  }
];

const mockFoods = [
  {
    id: 1,
    name: 'Pho Restaurant',
    description: 'Traditional Vietnamese pho restaurant',
    category_id: 1,
    category_name: 'Restaurant',
    cuisine: 'vietnamese',
    price_range: '$',
    rating: 4.7,
    region_id: 1,
    region_name: 'Hanoi',
    created_at: '2025-05-01T00:00:00',
    updated_at: '2025-05-01T00:00:00'
  },
  {
    id: 2,
    name: 'Seafood Restaurant',
    description: 'Fresh seafood directly from the ocean',
    category_id: 1,
    category_name: 'Restaurant',
    cuisine: 'seafood',
    price_range: '$$',
    rating: 4.5,
    region_id: 4,
    region_name: 'Da Nang',
    created_at: '2025-05-04T11:35:20',
    updated_at: '2025-05-04T11:35:20'
  }
];

const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState('articles');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState(null);

  // State for different content types
  const [articles, setArticles] = useState(mockArticles);
  const [events, setEvents] = useState(mockEvents);
  const [accommodations, setAccommodations] = useState(mockAccommodations);
  const [foods, setFoods] = useState(mockFoods);

  // Filter data based on search term and current tab
  const getFilteredData = () => {
    const term = searchTerm.toLowerCase();

    switch (activeTab) {
      case 'articles':
        return articles.filter(item =>
          item.title.toLowerCase().includes(term) ||
          item.summary.toLowerCase().includes(term) ||
          item.author.full_name.toLowerCase().includes(term)
        );
      case 'events':
        return events.filter(item =>
          item.name.toLowerCase().includes(term) ||
          item.description.toLowerCase().includes(term) ||
          item.location.address.toLowerCase().includes(term)
        );
      case 'accommodations':
        return accommodations.filter(item =>
          item.name.toLowerCase().includes(term) ||
          item.description.toLowerCase().includes(term) ||
          item.region_name.toLowerCase().includes(term)
        );
      case 'foods':
        return foods.filter(item =>
          item.name.toLowerCase().includes(term) ||
          item.description.toLowerCase().includes(term) ||
          item.cuisine.toLowerCase().includes(term)
        );
      default:
        return [];
    }
  };

  const handleDelete = () => {
    switch (activeTab) {
      case 'articles':
        setArticles(articles.filter(item => item.id !== deletingItem.id));
        break;
      case 'events':
        setEvents(events.filter(item => item.id !== deletingItem.id));
        break;
      case 'accommodations':
        setAccommodations(accommodations.filter(item => item.id !== deletingItem.id));
        break;
      case 'foods':
        setFoods(foods.filter(item => item.id !== deletingItem.id));
        break;
    }
    setIsDeleteDialogOpen(false);
  };

  const openDeleteDialog = (item) => {
    setDeletingItem(item);
    setIsDeleteDialogOpen(true);
  };

  const getItemTitle = (item) => {
    if (activeTab === 'articles') return item.title;
    return item.name;
  };

  const getEditUrl = (item) => {
    switch (activeTab) {
      case 'articles':
        return `/admin/articles/edit/${item.id}`;
      case 'events':
        return `/admin/events/edit/${item.id}`;
      case 'accommodations':
        return `/admin/accommodations/edit/${item.id}`;
      case 'foods':
        return `/admin/foods/edit/${item.id}`;
      default:
        return '#';
    }
  };

  const getCreateUrl = () => {
    switch (activeTab) {
      case 'articles':
        return '/admin/articles/create';
      case 'events':
        return '/admin/events/create';
      case 'accommodations':
        return '/admin/accommodations/create';
      case 'foods':
        return '/admin/foods/create';
      default:
        return '#';
    }
  };

  const getViewUrl = (item) => {
    switch (activeTab) {
      case 'articles':
        return `/articles/${item.slug}`;
      case 'events':
        return `/events/${item.id}`;
      case 'accommodations':
        return `/accommodations/${item.id}`;
      case 'foods':
        return `/foods/${item.id}`;
      default:
        return '#';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Content Management</CardTitle>
            <CardDescription>
              Manage articles, events, accommodations, and food listings
            </CardDescription>
          </div>
          <Button asChild>
            <a href={getCreateUrl()}>
              <PlusIcon className="mr-2 h-4 w-4" /> Add {activeTab.slice(0, -1)}
            </a>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="accommodations">Accommodations</TabsTrigger>
            <TabsTrigger value="foods">Food</TabsTrigger>
          </TabsList>

          <div className="flex items-center mb-4">
            <MagnifyingGlassIcon className="mr-2 h-4 w-4 opacity-50" />
            <Input
              placeholder={`Search ${activeTab}...`}
              className="max-w-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <TabsContent value="articles" className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getFilteredData().map(article => (
                  <TableRow key={article.id}>
                    <TableCell>{article.id}</TableCell>
                    <TableCell className="font-medium">{article.title}</TableCell>
                    <TableCell>{article.author.full_name}</TableCell>
                    <TableCell>{article.category_name}</TableCell>
                    <TableCell>
                      <Badge variant={article.published ? "success" : "secondary"}>
                        {article.published ? 'Published' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(article.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" asChild>
                          <a href={getViewUrl(article)} target="_blank" rel="noopener noreferrer">
                            <EyeIcon className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <a href={getEditUrl(article)}>
                            <PencilIcon className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-500" onClick={() => openDeleteDialog(article)}>
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="events" className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Organizer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getFilteredData().map(event => (
                  <TableRow key={event.id}>
                    <TableCell>{event.id}</TableCell>
                    <TableCell className="font-medium">{event.name}</TableCell>
                    <TableCell>{event.category_name}</TableCell>
                    <TableCell>{event.organizer_name}</TableCell>
                    <TableCell>{event.start_date} to {event.end_date}</TableCell>
                    <TableCell>{event.location.address}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" asChild>
                          <a href={getViewUrl(event)} target="_blank" rel="noopener noreferrer">
                            <EyeIcon className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <a href={getEditUrl(event)}>
                            <PencilIcon className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-500" onClick={() => openDeleteDialog(event)}>
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="accommodations" className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Price Range</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getFilteredData().map(accommodation => (
                  <TableRow key={accommodation.id}>
                    <TableCell>{accommodation.id}</TableCell>
                    <TableCell className="font-medium">{accommodation.name}</TableCell>
                    <TableCell>{accommodation.category_name}</TableCell>
                    <TableCell>{accommodation.region_name}</TableCell>
                    <TableCell>{accommodation.price_range}</TableCell>
                    <TableCell>{accommodation.rating}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" asChild>
                          <a href={getViewUrl(accommodation)} target="_blank" rel="noopener noreferrer">
                            <EyeIcon className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <a href={getEditUrl(accommodation)}>
                            <PencilIcon className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-500" onClick={() => openDeleteDialog(accommodation)}>
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="foods" className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Cuisine</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getFilteredData().map(food => (
                  <TableRow key={food.id}>
                    <TableCell>{food.id}</TableCell>
                    <TableCell className="font-medium">{food.name}</TableCell>
                    <TableCell>{food.category_name}</TableCell>
                    <TableCell>{food.cuisine}</TableCell>
                    <TableCell>{food.region_name}</TableCell>
                    <TableCell>{food.price_range}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" asChild>
                          <a href={getViewUrl(food)} target="_blank" rel="noopener noreferrer">
                            <EyeIcon className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <a href={getEditUrl(food)}>
                            <PencilIcon className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-500" onClick={() => openDeleteDialog(food)}>
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>

        {/* Delete Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{deletingItem && getItemTitle(deletingItem)}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDelete}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ContentManagement;
