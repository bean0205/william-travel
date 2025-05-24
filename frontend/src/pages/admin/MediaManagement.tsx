// filepath: /Users/williamnguyen/Documents/william travel/frontend/src/pages/admin/MediaManagement.tsx
import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, Typography, Input, Tabs, Card, Spin, Image, message } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  FileImageOutlined,
  BarChartOutlined,
  TableOutlined,
  EyeOutlined,
  UploadOutlined
} from '@ant-design/icons';
import { Permission } from '@/utils/permissions';
import { PermissionGuard } from '@/components/common/PermissionGuards';
import MediaStatistics from '@/components/admin/MediaStatistics';
import MediaForm from '@/components/admin/MediaForm';
import { getMedia, createMedia, updateMedia, deleteMedia, Media } from '@/services/api/mediaService';

const { Search } = Input;
const { TabPane } = Tabs;

// Mock media data - would be replaced with API calls in a real application
const mockMedia = [
  {
    id: '1',
    title: 'Hotel Facade',
    fileUrl: 'https://example.com/media/images/accommodations/hotel_facade.jpg',
    thumbnailUrl: 'https://example.com/media/images/accommodations/hotel_facade_thumb.jpg',
    type: 'image',
    description: 'Front view of Luxury Hotel & Spa',
    altText: 'Luxury Hotel building facade',
    tags: ['hotel', 'accommodation', 'luxury'],
    category: 'Accommodation Photos',
    isFeatured: true,
    fileSize: 1024568,
    dimensions: '1920x1080',
    createdAt: '2025-05-20T15:30:45',
    updatedAt: '2025-05-20T15:30:45',
  },
  {
    id: '2',
    title: 'Vietnamese Pho',
    fileUrl: 'https://example.com/media/images/food/pho_dish.jpg',
    thumbnailUrl: 'https://example.com/media/images/food/pho_dish_thumb.jpg',
    type: 'image',
    description: 'Traditional Vietnamese Pho soup with herbs',
    altText: 'Bowl of Vietnamese Pho noodle soup',
    tags: ['food', 'vietnamese', 'pho', 'cuisine'],
    category: 'Food Photos',
    isFeatured: false,
    fileSize: 854621,
    dimensions: '1600x1200',
    createdAt: '2025-05-19T11:25:30',
    updatedAt: '2025-05-19T11:25:30',
  },
  {
    id: '3',
    title: 'Hanoi City Tour',
    fileUrl: 'https://example.com/media/videos/locations/hanoi_city_tour.mp4',
    thumbnailUrl: 'https://example.com/media/videos/locations/hanoi_city_tour_thumb.jpg',
    type: 'video',
    description: 'Virtual tour of Hanoi\'s Old Quarter',
    altText: 'Video tour of Hanoi city streets and landmarks',
    tags: ['hanoi', 'city tour', 'vietnam', 'travel'],
    category: 'Location Videos',
    isFeatured: true,
    fileSize: 58642189,
    duration: '04:32',
    createdAt: '2025-05-15T09:45:12',
    updatedAt: '2025-05-15T09:45:12',
  },
  {
    id: '4',
    title: 'Ha Long Bay Panorama',
    fileUrl: 'https://example.com/media/images/locations/halong_bay_panorama.jpg',
    thumbnailUrl: 'https://example.com/media/images/locations/halong_bay_panorama_thumb.jpg',
    type: 'image',
    description: 'Panoramic view of Ha Long Bay limestone islands',
    altText: 'Panoramic landscape of Ha Long Bay in Vietnam',
    tags: ['halong bay', 'landscape', 'unesco', 'vietnam'],
    category: 'Location Photos',
    isFeatured: true,
    fileSize: 2548621,
    dimensions: '3840x1080',
    createdAt: '2025-05-12T14:20:35',
    updatedAt: '2025-05-12T14:20:35',
  },
  {
    id: '5',
    title: 'Vietnam Travel Guide 2025',
    fileUrl: 'https://example.com/media/documents/vietnam_travel_guide_2025.pdf',
    thumbnailUrl: 'https://example.com/media/documents/vietnam_travel_guide_2025_thumb.jpg',
    type: 'document',
    description: 'Comprehensive guide for traveling in Vietnam in 2025',
    altText: 'Vietnam Travel Guide document cover',
    tags: ['guide', 'document', 'travel tips', 'vietnam'],
    category: 'Travel Guides',
    isFeatured: false,
    fileSize: 4852361,
    pages: 42,
    createdAt: '2025-05-05T16:10:22',
    updatedAt: '2025-05-05T16:10:22',
  },
];

interface MediaStats {
  totalMedia: number;
  imageCount: number;
  videoCount: number;
  audioCount: number;
  documentCount: number;
  otherCount: number;
  featuredMedia: number;
  storageUsed: number;
  mediaByCategory: Array<{ name: string; value: number }>;
  mediaByMonth: Array<{ month: string; count: number }>;
  popularTags: Array<{ name: string; value: number }>;
  storageUsageOverTime: Array<{ date: string; usage: number }>;
}

const MediaManagement: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<Media[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('table');
  const [formLoading, setFormLoading] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid');

  // Statistics state
  const [stats, setStats] = useState<MediaStats>({
    totalMedia: 0,
    imageCount: 0,
    videoCount: 0,
    audioCount: 0,
    documentCount: 0,
    otherCount: 0,
    featuredMedia: 0,
    storageUsed: 0,
    mediaByCategory: [],
    mediaByMonth: [],
    popularTags: [],
    storageUsageOverTime: [],
  });

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      setIsLoading(true);
      // In a real app, replace this with API call: const data = await getMedia();
      const data = mockMedia as Media[];
      setMediaItems(data);

      // Calculate statistics
      calculateStatistics(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching media:', error);
      message.error('Failed to fetch media items');
      setIsLoading(false);
    }
  };

  const calculateStatistics = (data: Media[]) => {
    // Count by type
    const imageCount = data.filter(item => item.type === 'image').length;
    const videoCount = data.filter(item => item.type === 'video').length;
    const audioCount = data.filter(item => item.type === 'audio').length;
    const documentCount = data.filter(item => item.type === 'document').length;
    const otherCount = data.filter(item => !['image', 'video', 'audio', 'document'].includes(item.type || '')).length;

    // Count featured items
    const featuredCount = data.filter(item => item.isFeatured).length;

    // Calculate total storage used
    const storageUsed = data.reduce((acc, item) => acc + (item.fileSize || 0), 0);

    // Group by category
    const categoryMap = new Map();
    data.forEach(item => {
      const category = item.category || 'Uncategorized';
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    });

    const categoryStats = Array.from(categoryMap.entries()).map(([name, value]) => ({
      name,
      value,
    }));

    // Count media added by month
    const monthMap = new Map();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    data.forEach(item => {
      if (item.createdAt) {
        const date = new Date(item.createdAt);
        const monthName = months[date.getMonth()];
        monthMap.set(monthName, (monthMap.get(monthName) || 0) + 1);
      }
    });

    const monthData = months.map(month => ({
      month,
      count: monthMap.get(month) || 0,
    }));

    // Get popular tags
    const tagCounts = new Map();
    data.forEach(item => {
      (item.tags || []).forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });

    const tagStats = Array.from(tagCounts.entries())
      .sort((a, b) => b[1] as number - (a[1] as number))
      .map(([name, value]) => ({
        name,
        value,
      }));

    // Mock storage usage over time (in a real app, this would come from historical data)
    const storageOverTime = [
      { date: '2025-01', usage: 1258291200 },  // 1.2 GB
      { date: '2025-02', usage: 1573741824 },  // 1.5 GB
      { date: '2025-03', usage: 2147483648 },  // 2.0 GB
      { date: '2025-04', usage: 2684354560 },  // 2.5 GB
      { date: '2025-05', usage: 3221225472 },  // 3.0 GB
    ];

    setStats({
      totalMedia: data.length,
      imageCount,
      videoCount,
      audioCount,
      documentCount,
      otherCount,
      featuredMedia: featuredCount,
      storageUsed,
      mediaByCategory: categoryStats,
      mediaByMonth: monthData,
      popularTags: tagStats,
      storageUsageOverTime: storageOverTime,
    });
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleCreateMedia = () => {
    setSelectedMedia(null);
    setIsModalVisible(true);
  };

  const handleEditMedia = (media: Media) => {
    setSelectedMedia(media);
    setIsModalVisible(true);
  };

  const handleDeleteMedia = async (id: string) => {
    try {
      // In a real app: await deleteMedia(id);
      setMediaItems(mediaItems.filter(item => item.id !== id));
      message.success('Media deleted successfully');

      // Recalculate stats
      calculateStatistics(mediaItems.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting media:', error);
      message.error('Failed to delete media');
    }
  };

  const handleFormSubmit = async (mediaData: Partial<Media>) => {
    try {
      setFormLoading(true);

      if (selectedMedia) {
        // Update existing media
        // In a real app: await updateMedia(selectedMedia.id, mediaData);
        const updatedMediaItems = mediaItems.map(item =>
          item.id === selectedMedia.id ? { ...item, ...mediaData } : item
        );
        setMediaItems(updatedMediaItems);
        message.success('Media updated successfully');

        // Recalculate stats
        calculateStatistics(updatedMediaItems);
      } else {
        // Create new media
        // In a real app: const newMedia = await createMedia(mediaData);
        const newMedia = {
          id: String(mediaItems.length + 1),
          ...mediaData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          fileSize: 1048576, // Mock file size (1MB)
        } as Media;

        const updatedMediaItems = [...mediaItems, newMedia];
        setMediaItems(updatedMediaItems);
        message.success('Media uploaded successfully');

        // Recalculate stats
        calculateStatistics(updatedMediaItems);
      }

      setIsModalVisible(false);
      setFormLoading(false);
    } catch (error) {
      console.error('Error saving media:', error);
      message.error('Failed to save media');
      setFormLoading(false);
    }
  };

  const handleTypeFilter = (type: string | null) => {
    setTypeFilter(type);
    setCurrentPage(1);
  };

  const columns = [
    {
      title: 'Media',
      key: 'media',
      render: (text: string, record: Media) => (
        <div className="flex items-center">
          {record.type === 'image' ? (
            <Image
              src={record.thumbnailUrl || record.fileUrl}
              alt={record.altText || record.title}
              width={80}
              height={80}
              className="object-cover mr-3"
              placeholder={<div className="bg-gray-200 w-20 h-20 flex items-center justify-center">Loading</div>}
              fallback="data:image/png;base64,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"
            />
          ) : record.type === 'video' ? (
            <div className="w-20 h-20 bg-gray-800 flex items-center justify-center mr-3 rounded">
              <div className="text-white flex flex-col items-center justify-center">
                <span className="text-2xl">▶</span>
                <span className="text-xs">Video</span>
              </div>
            </div>
          ) : record.type === 'document' ? (
            <div className="w-20 h-20 bg-blue-100 flex items-center justify-center mr-3 rounded">
              <div className="text-blue-800 flex flex-col items-center justify-center">
                <span className="text-xl">📄</span>
                <span className="text-xs">Document</span>
              </div>
            </div>
          ) : (
            <div className="w-20 h-20 bg-gray-100 flex items-center justify-center mr-3 rounded">
              <div className="text-gray-600 flex flex-col items-center justify-center">
                <span className="text-xl">📁</span>
                <span className="text-xs">{record.type}</span>
              </div>
            </div>
          )}
          <div>
            <div className="font-medium">{record.title}</div>
            <div className="text-gray-500 text-sm truncate max-w-md">{record.description}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        let color = 'default';
        switch (type) {
          case 'image':
            color = 'blue';
            break;
          case 'video':
            color = 'red';
            break;
          case 'audio':
            color = 'green';
            break;
          case 'document':
            color = 'orange';
            break;
          default:
            color = 'default';
        }
        return <Tag color={color}>{type}</Tag>;
      },
      filters: [
        { text: 'Image', value: 'image' },
        { text: 'Video', value: 'video' },
        { text: 'Audio', value: 'audio' },
        { text: 'Document', value: 'document' },
        { text: 'Other', value: 'other' },
      ],
      onFilter: (value: string, record: Media) => record.type === value,
    },
    {
      title: 'Size',
      dataIndex: 'fileSize',
      key: 'fileSize',
      render: (fileSize: number) => {
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = fileSize;
        let unitIndex = 0;

        while (size >= 1024 && unitIndex < units.length - 1) {
          size /= 1024;
          unitIndex++;
        }

        return `${size.toFixed(1)} ${units[unitIndex]}`;
      },
      sorter: (a: Media, b: Media) => (a.fileSize || 0) - (b.fileSize || 0),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Featured',
      dataIndex: 'isFeatured',
      key: 'isFeatured',
      render: (isFeatured: boolean) => isFeatured && <Tag color="gold">Featured</Tag>,
    },
    {
      title: 'Uploaded',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: (a: Media, b: Media) =>
        new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime(),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: string, record: Media) => (
        <Space size="middle">
          <Button
            icon={<EyeOutlined />}
            type="link"
            title="View Media"
            onClick={() => window.open(record.fileUrl || '', '_blank')}
          />
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditMedia(record)}
            type="link"
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteMedia(record.id || '')}
            type="link"
            danger
          />
        </Space>
      ),
    },
  ];

  const filteredMedia = mediaItems.filter(item => {
    const matchesSearch =
      (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchesType = typeFilter ? item.type === typeFilter : true;

    return matchesSearch && matchesType;
  });

  // Render media grid view
  const renderMediaGrid = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {filteredMedia.map(media => (
        <Card
          key={media.id}
          hoverable
          cover={
            media.type === 'image' ? (
              <Image
                alt={media.altText || media.title}
                src={media.thumbnailUrl || media.fileUrl}
                className="h-40 object-cover"
                placeholder={<div className="bg-gray-200 h-40 flex items-center justify-center">Loading</div>}
              />
            ) : media.type === 'video' ? (
              <div className="h-40 bg-gray-800 flex items-center justify-center">
                <div className="text-white flex flex-col items-center justify-center">
                  <span className="text-3xl">▶</span>
                  <span className="text-sm">Video</span>
                </div>
              </div>
            ) : media.type === 'document' ? (
              <div className="h-40 bg-blue-100 flex items-center justify-center">
                <div className="text-blue-800 flex flex-col items-center justify-center">
                  <span className="text-3xl">📄</span>
                  <span className="text-sm">Document</span>
                </div>
              </div>
            ) : (
              <div className="h-40 bg-gray-100 flex items-center justify-center">
                <div className="text-gray-600 flex flex-col items-center justify-center">
                  <span className="text-3xl">📁</span>
                  <span className="text-sm">{media.type}</span>
                </div>
              </div>
            )
          }
          actions={[
            <EyeOutlined key="view" onClick={() => window.open(media.fileUrl || '', '_blank')} />,
            <EditOutlined key="edit" onClick={() => handleEditMedia(media)} />,
            <DeleteOutlined key="delete" onClick={() => handleDeleteMedia(media.id || '')} />,
          ]}
        >
          <Card.Meta
            title={media.title}
            description={
              <div>
                <div className="truncate text-xs text-gray-500 mb-2">{media.description}</div>
                <div className="flex justify-between">
                  <Tag color={media.type === 'image' ? 'blue' : media.type === 'video' ? 'red' : media.type === 'audio' ? 'green' : 'orange'}>
                    {media.type}
                  </Tag>
                  {media.isFeatured && <Tag color="gold">Featured</Tag>}
                </div>
              </div>
            }
          />
        </Card>
      ))}
    </div>
  );

  return (
    <div className="p-6">
      <Typography.Title level={2}>
        <FileImageOutlined /> Media Management
      </Typography.Title>

      <Tabs activeKey={activeTab} onChange={setActiveTab} className="mb-6">
        <TabPane
          tab={<span><TableOutlined /> Media Library</span>}
          key="table"
        >
          <div className="mb-4 flex justify-between flex-wrap">
            <div className="flex items-center space-x-4">
              <Search
                placeholder="Search media by title or tags"
                onSearch={handleSearch}
                onChange={(e) => handleSearch(e.target.value)}
                style={{ width: 300, marginBottom: 16 }}
              />
              <Button.Group style={{ marginBottom: 16 }}>
                <Button
                  type={viewMode === 'table' ? 'primary' : 'default'}
                  onClick={() => setViewMode('table')}
                >
                  <TableOutlined /> Table
                </Button>
                <Button
                  type={viewMode === 'grid' ? 'primary' : 'default'}
                  onClick={() => setViewMode('grid')}
                >
                  <FileImageOutlined /> Grid
                </Button>
              </Button.Group>
            </div>

            <PermissionGuard permission={Permission.UploadMedia}>
              <Button
                type="primary"
                icon={<UploadOutlined />}
                onClick={handleCreateMedia}
              >
                Upload Media
              </Button>
            </PermissionGuard>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-60">
              <Spin size="large" />
            </div>
          ) : (
            viewMode === 'table' ? (
              <Table
                columns={columns}
                dataSource={filteredMedia}
                rowKey="id"
                pagination={{
                  current: currentPage,
                  onChange: (page) => setCurrentPage(page),
                  showSizeChanger: true,
                  showTotal: (total) => `Total ${total} media items`,
                }}
              />
            ) : (
              renderMediaGrid()
            )
          )}
        </TabPane>
        <TabPane
          tab={<span><BarChartOutlined /> Statistics</span>}
          key="statistics"
        >
          {isLoading ? (
            <div className="flex justify-center items-center h-60">
              <Spin size="large" />
            </div>
          ) : (
            <MediaStatistics stats={stats} />
          )}
        </TabPane>
      </Tabs>

      {/* Media Form Modal */}
      {isModalVisible && (
        <Card
          title={selectedMedia ? "Edit Media" : "Upload Media"}
          className="fixed inset-0 z-50 w-full md:w-3/4 lg:w-2/3 xl:w-1/2 mx-auto my-16 overflow-auto"
          extra={
            <Button
              type="text"
              onClick={() => setIsModalVisible(false)}
            >
              Close
            </Button>
          }
        >
          <MediaForm
            media={selectedMedia || undefined}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsModalVisible(false)}
            loading={formLoading}
          />
        </Card>
      )}
    </div>
  );
};

export default MediaManagement;
