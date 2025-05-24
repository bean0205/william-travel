import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@/components/ui/icons';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

// Mock data - would be replaced with API calls
const mockContinents = [
  {
    id: 1,
    name: 'Asia',
    code: 'AS',
    name_code: 'asia',
    description: 'Largest and most populous continent',
    description_code: 'asia_desc',
    background_image: 'https://example.com/asia.jpg',
    logo: 'https://example.com/asia-logo.png',
    status: 1,
    created_at: '2025-05-01T00:00:00',
    updated_at: '2025-05-01T00:00:00'
  },
  {
    id: 2,
    name: 'Europe',
    code: 'EU',
    name_code: 'europe',
    description: 'Western peninsula of Eurasia',
    description_code: 'europe_desc',
    background_image: 'https://example.com/europe.jpg',
    logo: 'https://example.com/europe-logo.png',
    status: 1,
    created_at: '2025-05-01T00:00:00',
    updated_at: '2025-05-01T00:00:00'
  }
];

const mockCountries = [
  {
    id: 1,
    name: 'Vietnam',
    code: 'VN',
    name_code: 'vietnam',
    description: 'Country in Southeast Asia',
    description_code: 'vietnam_desc',
    background_image: 'https://example.com/vietnam.jpg',
    logo: 'https://example.com/vietnam-logo.png',
    status: 1,
    continent_id: 1,
    created_at: '2025-05-01T00:00:00',
    updated_at: '2025-05-01T00:00:00'
  },
  {
    id: 2,
    name: 'Thailand',
    code: 'TH',
    name_code: 'thailand',
    description: 'Country in Southeast Asia',
    description_code: 'thailand_desc',
    background_image: 'https://example.com/thailand.jpg',
    logo: 'https://example.com/thailand-logo.png',
    status: 1,
    continent_id: 1,
    created_at: '2025-05-01T00:00:00',
    updated_at: '2025-05-01T00:00:00'
  }
];

const mockRegions = [
  {
    id: 1,
    name: 'Hanoi',
    code: 'HN',
    name_code: 'hanoi',
    description: 'Capital of Vietnam',
    description_code: 'hanoi_desc',
    background_image: 'https://example.com/hanoi.jpg',
    logo: 'https://example.com/hanoi-logo.png',
    status: 1,
    country_id: 1,
    created_at: '2025-05-01T00:00:00',
    updated_at: '2025-05-01T00:00:00'
  },
  {
    id: 2,
    name: 'Ho Chi Minh City',
    code: 'HCM',
    name_code: 'ho_chi_minh',
    description: 'Largest city in Vietnam',
    description_code: 'hcm_desc',
    background_image: 'https://example.com/hcm.jpg',
    logo: 'https://example.com/hcm-logo.png',
    status: 1,
    country_id: 1,
    created_at: '2025-05-01T00:00:00',
    updated_at: '2025-05-01T00:00:00'
  }
];

const mockLocationCategories = [
  {
    id: 1,
    name: 'Tourist Attraction',
    code: 'attraction',
    status: 1,
    created_at: '2025-05-01T00:00:00',
    updated_at: '2025-05-01T00:00:00'
  },
  {
    id: 2,
    name: 'Beach',
    code: 'beach',
    status: 1,
    created_at: '2025-05-01T00:00:00',
    updated_at: '2025-05-01T00:00:00'
  }
];

const LocationsManagement = () => {
  const [activeTab, setActiveTab] = useState('continents');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // State for different location types
  const [continents, setContinents] = useState(mockContinents);
  const [countries, setCountries] = useState(mockCountries);
  const [regions, setRegions] = useState(mockRegions);
  const [locationCategories, setLocationCategories] = useState(mockLocationCategories);

  // State for the item being edited
  const [editingItem, setEditingItem] = useState(null);

  // New item state
  const [newContinent, setNewContinent] = useState({
    name: '',
    code: '',
    name_code: '',
    description: '',
    description_code: '',
    background_image: '',
    logo: '',
    status: 1
  });

  const [newCountry, setNewCountry] = useState({
    name: '',
    code: '',
    name_code: '',
    description: '',
    description_code: '',
    background_image: '',
    logo: '',
    status: 1,
    continent_id: ''
  });

  const [newRegion, setNewRegion] = useState({
    name: '',
    code: '',
    name_code: '',
    description: '',
    description_code: '',
    background_image: '',
    logo: '',
    status: 1,
    country_id: ''
  });

  const [newCategory, setNewCategory] = useState({
    name: '',
    code: '',
    status: 1
  });

  // Filter data based on search term and current tab
  const getFilteredData = () => {
    const term = searchTerm.toLowerCase();
    switch (activeTab) {
      case 'continents':
        return continents.filter(item =>
          item.name.toLowerCase().includes(term) ||
          item.code.toLowerCase().includes(term)
        );
      case 'countries':
        return countries.filter(item =>
          item.name.toLowerCase().includes(term) ||
          item.code.toLowerCase().includes(term)
        );
      case 'regions':
        return regions.filter(item =>
          item.name.toLowerCase().includes(term) ||
          item.code.toLowerCase().includes(term)
        );
      case 'categories':
        return locationCategories.filter(item =>
          item.name.toLowerCase().includes(term) ||
          item.code.toLowerCase().includes(term)
        );
      default:
        return [];
    }
  };

  // Handle CRUD operations
  const handleCreate = () => {
    switch (activeTab) {
      case 'continents':
        const newContinentItem = {
          ...newContinent,
          id: continents.length + 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setContinents([...continents, newContinentItem]);
        setNewContinent({
          name: '',
          code: '',
          name_code: '',
          description: '',
          description_code: '',
          background_image: '',
          logo: '',
          status: 1
        });
        break;
      case 'countries':
        const newCountryItem = {
          ...newCountry,
          id: countries.length + 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setCountries([...countries, newCountryItem]);
        setNewCountry({
          name: '',
          code: '',
          name_code: '',
          description: '',
          description_code: '',
          background_image: '',
          logo: '',
          status: 1,
          continent_id: ''
        });
        break;
      case 'regions':
        const newRegionItem = {
          ...newRegion,
          id: regions.length + 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setRegions([...regions, newRegionItem]);
        setNewRegion({
          name: '',
          code: '',
          name_code: '',
          description: '',
          description_code: '',
          background_image: '',
          logo: '',
          status: 1,
          country_id: ''
        });
        break;
      case 'categories':
        const newCategoryItem = {
          ...newCategory,
          id: locationCategories.length + 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setLocationCategories([...locationCategories, newCategoryItem]);
        setNewCategory({
          name: '',
          code: '',
          status: 1
        });
        break;
    }
    setIsCreateDialogOpen(false);
  };

  const handleEdit = () => {
    switch (activeTab) {
      case 'continents':
        setContinents(continents.map(item => item.id === editingItem.id ? editingItem : item));
        break;
      case 'countries':
        setCountries(countries.map(item => item.id === editingItem.id ? editingItem : item));
        break;
      case 'regions':
        setRegions(regions.map(item => item.id === editingItem.id ? editingItem : item));
        break;
      case 'categories':
        setLocationCategories(locationCategories.map(item => item.id === editingItem.id ? editingItem : item));
        break;
    }
    setIsEditDialogOpen(false);
  };

  const handleDelete = () => {
    switch (activeTab) {
      case 'continents':
        setContinents(continents.filter(item => item.id !== editingItem.id));
        break;
      case 'countries':
        setCountries(countries.filter(item => item.id !== editingItem.id));
        break;
      case 'regions':
        setRegions(regions.filter(item => item.id !== editingItem.id));
        break;
      case 'categories':
        setLocationCategories(locationCategories.filter(item => item.id !== editingItem.id));
        break;
    }
    setIsDeleteDialogOpen(false);
  };

  const openEditDialog = (item) => {
    setEditingItem({ ...item });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (item) => {
    setEditingItem(item);
    setIsDeleteDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Locations Management</CardTitle>
            <CardDescription>
              Manage geographic locations and categories
            </CardDescription>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button><PlusIcon className="mr-2 h-4 w-4" /> Add {activeTab.slice(0, -1).charAt(0).toUpperCase() + activeTab.slice(0, -1).slice(1)}</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New {activeTab.slice(0, -1).charAt(0).toUpperCase() + activeTab.slice(0, -1).slice(1)}</DialogTitle>
                <DialogDescription>
                  Add new location data to the system.
                </DialogDescription>
              </DialogHeader>

              {activeTab === 'continents' && (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Name</Label>
                    <Input
                      id="name"
                      value={newContinent.name}
                      onChange={(e) => setNewContinent({...newContinent, name: e.target.value})}
                      className="col-span-3"
                      placeholder="e.g., North America"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="code" className="text-right">Code</Label>
                    <Input
                      id="code"
                      value={newContinent.code}
                      onChange={(e) => setNewContinent({...newContinent, code: e.target.value})}
                      className="col-span-3"
                      placeholder="e.g., NA"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name_code" className="text-right">Name Code</Label>
                    <Input
                      id="name_code"
                      value={newContinent.name_code}
                      onChange={(e) => setNewContinent({...newContinent, name_code: e.target.value})}
                      className="col-span-3"
                      placeholder="e.g., north_america"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">Description</Label>
                    <Textarea
                      id="description"
                      value={newContinent.description}
                      onChange={(e) => setNewContinent({...newContinent, description: e.target.value})}
                      className="col-span-3"
                      placeholder="Continent description"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description_code" className="text-right">Description Code</Label>
                    <Input
                      id="description_code"
                      value={newContinent.description_code}
                      onChange={(e) => setNewContinent({...newContinent, description_code: e.target.value})}
                      className="col-span-3"
                      placeholder="e.g., north_america_desc"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="background_image" className="text-right">Background Image</Label>
                    <Input
                      id="background_image"
                      value={newContinent.background_image}
                      onChange={(e) => setNewContinent({...newContinent, background_image: e.target.value})}
                      className="col-span-3"
                      placeholder="Image URL"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="logo" className="text-right">Logo</Label>
                    <Input
                      id="logo"
                      value={newContinent.logo}
                      onChange={(e) => setNewContinent({...newContinent, logo: e.target.value})}
                      className="col-span-3"
                      placeholder="Logo URL"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">Status</Label>
                    <div className="col-span-3 flex items-center space-x-2">
                      <Switch
                        id="status"
                        checked={newContinent.status === 1}
                        onCheckedChange={(checked) => setNewContinent({...newContinent, status: checked ? 1 : 0})}
                      />
                      <Label htmlFor="status">{newContinent.status === 1 ? 'Active' : 'Inactive'}</Label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'countries' && (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Name</Label>
                    <Input
                      id="name"
                      value={newCountry.name}
                      onChange={(e) => setNewCountry({...newCountry, name: e.target.value})}
                      className="col-span-3"
                      placeholder="e.g., Vietnam"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="code" className="text-right">Code</Label>
                    <Input
                      id="code"
                      value={newCountry.code}
                      onChange={(e) => setNewCountry({...newCountry, code: e.target.value})}
                      className="col-span-3"
                      placeholder="e.g., VN"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="continent" className="text-right">Continent</Label>
                    <Select
                      value={newCountry.continent_id.toString()}
                      onValueChange={(value) => setNewCountry({...newCountry, continent_id: parseInt(value)})}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select continent" />
                      </SelectTrigger>
                      <SelectContent>
                        {continents.map(continent => (
                          <SelectItem key={continent.id} value={continent.id.toString()}>
                            {continent.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name_code" className="text-right">Name Code</Label>
                    <Input
                      id="name_code"
                      value={newCountry.name_code}
                      onChange={(e) => setNewCountry({...newCountry, name_code: e.target.value})}
                      className="col-span-3"
                      placeholder="e.g., vietnam"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">Description</Label>
                    <Textarea
                      id="description"
                      value={newCountry.description}
                      onChange={(e) => setNewCountry({...newCountry, description: e.target.value})}
                      className="col-span-3"
                      placeholder="Country description"
                    />
                  </div>
                  {/* More fields similar to continent form */}
                </div>
              )}

              {activeTab === 'regions' && (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Name</Label>
                    <Input
                      id="name"
                      value={newRegion.name}
                      onChange={(e) => setNewRegion({...newRegion, name: e.target.value})}
                      className="col-span-3"
                      placeholder="e.g., Hanoi"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="country" className="text-right">Country</Label>
                    <Select
                      value={newRegion.country_id.toString()}
                      onValueChange={(value) => setNewRegion({...newRegion, country_id: parseInt(value)})}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map(country => (
                          <SelectItem key={country.id} value={country.id.toString()}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* More fields similar to country form */}
                </div>
              )}

              {activeTab === 'categories' && (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Name</Label>
                    <Input
                      id="name"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                      className="col-span-3"
                      placeholder="e.g., Beach"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="code" className="text-right">Code</Label>
                    <Input
                      id="code"
                      value={newCategory.code}
                      onChange={(e) => setNewCategory({...newCategory, code: e.target.value})}
                      className="col-span-3"
                      placeholder="e.g., beach"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">Status</Label>
                    <div className="col-span-3 flex items-center space-x-2">
                      <Switch
                        id="status"
                        checked={newCategory.status === 1}
                        onCheckedChange={(checked) => setNewCategory({...newCategory, status: checked ? 1 : 0})}
                      />
                      <Label htmlFor="status">{newCategory.status === 1 ? 'Active' : 'Inactive'}</Label>
                    </div>
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreate}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="continents">Continents</TabsTrigger>
            <TabsTrigger value="countries">Countries</TabsTrigger>
            <TabsTrigger value="regions">Regions</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
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

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Code</TableHead>
                  {activeTab === 'countries' && <TableHead>Continent</TableHead>}
                  {activeTab === 'regions' && <TableHead>Country</TableHead>}
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getFilteredData().map(item => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.code}</TableCell>
                    {activeTab === 'countries' && (
                      <TableCell>
                        {continents.find(c => c.id === item.continent_id)?.name || 'Unknown'}
                      </TableCell>
                    )}
                    {activeTab === 'regions' && (
                      <TableCell>
                        {countries.find(c => c.id === item.country_id)?.name || 'Unknown'}
                      </TableCell>
                    )}
                    <TableCell>
                      <Badge variant={item.status === 1 ? "outline" : "secondary"}>
                        {item.status === 1 ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => openEditDialog(item)}>
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-500" onClick={() => openDeleteDialog(item)}>
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Tabs>

        {/* Edit Dialog - Would need specific forms for each location type */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit {activeTab.slice(0, -1).charAt(0).toUpperCase() + activeTab.slice(0, -1).slice(1)}</DialogTitle>
              <DialogDescription>
                Update location information.
              </DialogDescription>
            </DialogHeader>
            {editingItem && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">Name</Label>
                  <Input
                    id="edit-name"
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-code" className="text-right">Code</Label>
                  <Input
                    id="edit-code"
                    value={editingItem.code}
                    onChange={(e) => setEditingItem({...editingItem, code: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                {/* More fields would be added based on the location type */}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleEdit}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{editingItem?.name}"? This action cannot be undone.
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

export default LocationsManagement;
