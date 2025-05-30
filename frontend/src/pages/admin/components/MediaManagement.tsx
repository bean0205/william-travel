import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusIcon, TrashIcon, MagnifyingGlassIcon, ArrowUpTrayIcon } from '@/components/ui/icons';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

// Mock data - would be replaced with API calls
const mockMediaTypes = [
  { id: 1, name: 'Image', code: 'image', status: 1 },
  { id: 2, name: 'Video', code: 'video', status: 1 },
  { id: 3, name: 'Document', code: 'document', status: 1 }
];

const mockMediaCategories = [
  { id: 1, name: 'Accommodation Photos', code: 'accommodation_photos', status: 1 },
  { id: 2, name: 'Food Photos', code: 'food_photos', status: 1 },
  { id: 3, name: 'Location Photos', code: 'location_photos', status: 1 },
  { id: 4, name: 'Article Images', code: 'article_images', status: 1 },
  { id: 5, name: 'Event Videos', code: 'event_videos', status: 1 }
];

const mockMedia = [
  {
    id: 1,
    file_name: 'hotel_facade.jpg',
    file_path: '/media/images/accommodations/hotel_facade.jpg',
    file_url: 'https://example.com/media/images/accommodations/hotel_facade.jpg',
    mime_type: 'image/jpeg',
    file_size: 1024568,
    type_id: 1,
    type_name: 'Image',
    category_id: 1,
    category_name: 'Accommodation Photos',
    entity_type: 'accommodation',
    entity_id: 5,
    entity_name: 'Luxury Hotel & Spa',
    created_at: '2025-05-20T15:30:45'
  },
  {
    id: 2,
    file_name: 'pho_dish.jpg',
    file_path: '/media/images/food/pho_dish.jpg',
    file_url: 'https://example.com/media/images/food/pho_dish.jpg',
    mime_type: 'image/jpeg',
    file_size: 854621,
    type_id: 1,
    type_name: 'Image',
    category_id: 2,
    category_name: 'Food Photos',
    entity_type: 'food',
    entity_id: 3,
    entity_name: 'Pho Restaurant',
    created_at: '2025-05-19T11:25:30'
  },
  {
    id: 3,
    file_name: 'hanoi_walking_tour.mp4',
    file_path: '/media/videos/events/hanoi_walking_tour.mp4',
    file_url: 'https://example.com/media/videos/events/hanoi_walking_tour.mp4',
    mime_type: 'video/mp4',
    file_size: 15784632,
    type_id: 2,
    type_name: 'Video',
    category_id: 5,
    category_name: 'Event Videos',
    entity_type: 'event',
    entity_id: 2,
    entity_name: 'Hanoi Walking Tour',
    created_at: '2025-05-18T09:40:15'
  },
  {
    id: 4,
    file_name: 'travel_guide.pdf',
    file_path: '/media/documents/articles/travel_guide.pdf',
    file_url: 'https://example.com/media/documents/articles/travel_guide.pdf',
    mime_type: 'application/pdf',
    file_size: 2345678,
    type_id: 3,
    type_name: 'Document',
    category_id: 4,
    category_name: 'Article Images',
    entity_type: 'article',
    entity_id: 7,
    entity_name: 'Complete Travel Guide to Vietnam',
    created_at: '2025-05-15T14:22:10'
  }
];

const MediaManagement = () => {
  const [activeTab, setActiveTab] = useState('library');
  const [searchTerm, setSearchTerm] = useState('');
  const [media, setMedia] = useState(mockMedia);
  const [mediaTypes] = useState(mockMediaTypes);
  const [mediaCategories] = useState(mockMediaCategories);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const [uploadForm, setUploadForm] = useState({
    file: null,
    type_id: '',
    category_id: '',
    entity_type: '',
    entity_id: '',
    title: '',
    description: ''
  });

  const [newType, setNewType] = useState({
    name: '',
    code: '',
    status: 1
  });

  const [newCategory, setNewCategory] = useState({
    name: '',
    code: '',
    status: 1
  });

  const [isAddTypeDialogOpen, setIsAddTypeDialogOpen] = useState(false);
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);

  const filteredMedia = media.filter(item =>
    item.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.entity_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.type_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = () => {
    // Would make an API call in a real implementation
    setMedia(media.filter(item => item.id !== selectedMedia.id));
    setIsDeleteDialogOpen(false);
  };

  const openDeleteDialog = (item) => {
    setSelectedMedia(item);
    setIsDeleteDialogOpen(true);
  };

  const handleUpload = () => {
    // This would be an actual file upload in a real implementation
    const newMediaItem = {
      id: media.length + 1,
      file_name: uploadForm.file ? uploadForm.file.name : 'uploaded_file.jpg',
      file_path: `/media/uploads/${uploadForm.file ? uploadForm.file.name : 'uploaded_file.jpg'}`,
      file_url: `https://example.com/media/uploads/${uploadForm.file ? uploadForm.file.name : 'uploaded_file.jpg'}`,
      mime_type: uploadForm.file ? uploadForm.file.type : 'image/jpeg',
      file_size: uploadForm.file ? uploadForm.file.size : 1000000,
      type_id: parseInt(uploadForm.type_id),
      type_name: mediaTypes.find(t => t.id === parseInt(uploadForm.type_id))?.name || 'Unknown',
      category_id: parseInt(uploadForm.category_id),
      category_name: mediaCategories.find(c => c.id === parseInt(uploadForm.category_id))?.name || 'Unknown',
      entity_type: uploadForm.entity_type,
      entity_id: uploadForm.entity_id ? parseInt(uploadForm.entity_id) : null,
      entity_name: uploadForm.title,
      created_at: new Date().toISOString()
    };

    setMedia([...media, newMediaItem]);
    setUploadForm({
      file: null,
      type_id: '',
      category_id: '',
      entity_type: '',
      entity_id: '',
      title: '',
      description: ''
    });
    setIsUploadDialogOpen(false);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadForm({
        ...uploadForm,
        file: e.target.files[0]
      });
    }
  };

  const handleAddType = () => {
    // Would make an API call in a real implementation
    const newTypeItem = {
      id: mediaTypes.length + 1,
      name: newType.name,
      code: newType.code,
      status: newType.status
    };

    setIsAddTypeDialogOpen(false);
  };

  const handleAddCategory = () => {
    // Would make an API call in a real implementation
    const newCategoryItem = {
      id: mediaCategories.length + 1,
      name: newCategory.name,
      code: newCategory.code,
      status: newCategory.status
    };

    setIsAddCategoryDialogOpen(false);
  };

  const getFileTypeIcon = (mimeType) => {
    if (mimeType.startsWith('image/')) {
      return '🖼️';
    } else if (mimeType.startsWith('video/')) {
      return '🎬';
    } else if (mimeType === 'application/pdf') {
      return '📄';
    } else {
      return '📁';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB';
    else return (bytes / 1073741824).toFixed(1) + ' GB';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Media Management</CardTitle>
            <CardDescription>
              Manage media files, types, and categories
            </CardDescription>
          </div>
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button><ArrowUpTrayIcon className="mr-2 h-4 w-4" /> Upload Media</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Upload Media</DialogTitle>
                <DialogDescription>
                  Upload a new media file to the system.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="media">Media File</Label>
                  <Input id="media" type="file" onChange={handleFileChange} />
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="mediaType">Media Type</Label>
                  <Select
                    value={uploadForm.type_id.toString()}
                    onValueChange={(value) => setUploadForm({...uploadForm, type_id: value})}
                  >
                    <SelectTrigger id="mediaType">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {mediaTypes.map(type => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="mediaCategory">Media Category</Label>
                  <Select
                    value={uploadForm.category_id.toString()}
                    onValueChange={(value) => setUploadForm({...uploadForm, category_id: value})}
                  >
                    <SelectTrigger id="mediaCategory">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {mediaCategories.map(category => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="entityType">Related To</Label>
                  <Select
                    value={uploadForm.entity_type}
                    onValueChange={(value) => setUploadForm({...uploadForm, entity_type: value})}
                  >
                    <SelectTrigger id="entityType">
                      <SelectValue placeholder="Select entity type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="accommodation">Accommodation</SelectItem>
                      <SelectItem value="food">Food</SelectItem>
                      <SelectItem value="article">Article</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="location">Location</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="entityId">Entity ID</Label>
                  <Input
                    id="entityId"
                    placeholder="ID of related content"
                    value={uploadForm.entity_id}
                    onChange={(e) => setUploadForm({...uploadForm, entity_id: e.target.value})}
                  />
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Media title"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                  />
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Media description"
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleUpload}>Upload</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="library">Media Library</TabsTrigger>
            <TabsTrigger value="types">Media Types</TabsTrigger>
            <TabsTrigger value="categories">Media Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="library">
            <div className="flex items-center mb-4">
              <MagnifyingGlassIcon className="mr-2 h-4 w-4 opacity-50" />
              <Input
                placeholder="Search media files..."
                className="max-w-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Preview</TableHead>
                    <TableHead>File Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Related To</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMedia.map(item => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="text-2xl">
                          {getFileTypeIcon(item.mime_type)}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        <a href={item.file_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {item.file_name}
                        </a>
                      </TableCell>
                      <TableCell>{item.type_name}</TableCell>
                      <TableCell>{item.category_name}</TableCell>
                      <TableCell>
                        {item.entity_type && (
                          <Badge variant="outline">
                            {item.entity_type}: {item.entity_name || item.entity_id}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{formatFileSize(item.file_size)}</TableCell>
                      <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
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
          </TabsContent>

          <TabsContent value="types">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Media Types</h3>
              <Dialog open={isAddTypeDialogOpen} onOpenChange={setIsAddTypeDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm"><PlusIcon className="mr-2 h-4 w-4" /> Add Type</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Media Type</DialogTitle>
                    <DialogDescription>
                      Create a new media type for organizing files.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="typeName" className="text-right">Name</Label>
                      <Input
                        id="typeName"
                        value={newType.name}
                        onChange={(e) => setNewType({...newType, name: e.target.value})}
                        className="col-span-3"
                        placeholder="e.g., Audio"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="typeCode" className="text-right">Code</Label>
                      <Input
                        id="typeCode"
                        value={newType.code}
                        onChange={(e) => setNewType({...newType, code: e.target.value})}
                        className="col-span-3"
                        placeholder="e.g., audio"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddTypeDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddType}>Add Type</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mediaTypes.map(type => (
                    <TableRow key={type.id}>
                      <TableCell>{type.id}</TableCell>
                      <TableCell className="font-medium">{type.name}</TableCell>
                      <TableCell><code>{type.code}</code></TableCell>
                      <TableCell>
                        <Badge variant={type.status === 1 ? "outline" : "secondary"}>
                          {type.status === 1 ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="categories">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Media Categories</h3>
              <Dialog open={isAddCategoryDialogOpen} onOpenChange={setIsAddCategoryDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm"><PlusIcon className="mr-2 h-4 w-4" /> Add Category</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Media Category</DialogTitle>
                    <DialogDescription>
                      Create a new media category for organizing files.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="categoryName" className="text-right">Name</Label>
                      <Input
                        id="categoryName"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                        className="col-span-3"
                        placeholder="e.g., Profile Pictures"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="categoryCode" className="text-right">Code</Label>
                      <Input
                        id="categoryCode"
                        value={newCategory.code}
                        onChange={(e) => setNewCategory({...newCategory, code: e.target.value})}
                        className="col-span-3"
                        placeholder="e.g., profile_pictures"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddCategoryDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddCategory}>Add Category</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mediaCategories.map(category => (
                    <TableRow key={category.id}>
                      <TableCell>{category.id}</TableCell>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell><code>{category.code}</code></TableCell>
                      <TableCell>
                        <Badge variant={category.status === 1 ? "outline" : "secondary"}>
                          {category.status === 1 ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>

        {/* Delete Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the file "{selectedMedia?.file_name}"? This action cannot be undone.
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

export default MediaManagement;
