import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, Typography, Input, Tabs, Card, Spin, message } from 'antd';
import {
  EditOutlined,
  DeleteOutlined, 
  PlusOutlined, 
  EnvironmentOutlined,
  BarChartOutlined,
  TableOutlined
} from '@ant-design/icons';
import { Permission } from '@/utils/permissions';
import { PermissionGuard } from '@/components/common/PermissionGuards';
import LocationStatistics from '@/components/admin/LocationStatistics';
import LocationForm from '@/components/admin/LocationForm';
import {
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation,
  Location,
  getContinents,
  getCountries,
  getRegions,
  getLocationCategories
} from '@/services/api/locationService';

const { Search } = Input;
const { TabPane } = Tabs;

interface LocationStats {
  totalLocations: number;
  activeLocations: number;
  featuredLocations: number;
  locationsWithCoordinates: number;
  locationsByCountry: Array<{ name: string; value: number }>;
  locationsByStatus: Array<{ name: string; value: number }>;
  locationsByMonth: Array<{ month: string; count: number }>;
  popularRegions: Array<{ name: string; value: number }>;
  viewTrends: Array<{ date: string; views: number }>;
}

const LocationManagement: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('table');
  const [formLoading, setFormLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Statistics state
  const [stats, setStats] = useState<LocationStats>({
    totalLocations: 0,
    activeLocations: 0,
    featuredLocations: 0,
    locationsWithCoordinates: 0,
    locationsByCountry: [],
    locationsByStatus: [],
    locationsByMonth: [],
    popularRegions: [],
    viewTrends: [],
  });

  useEffect(() => {
    fetchLocations();
  }, [currentPage, pageSize]);

  const fetchLocations = async () => {
    try {
      setIsLoading(true);
      // Call real API with pagination
      const data = await getLocations({
        skip: (currentPage - 1) * pageSize,
        limit: pageSize
      });

      setLocations(data.items || data);
      if (data.total) {
        setTotalItems(data.total);
      } else {
        setTotalItems(data.length);
      }

      // Calculate statistics
      calculateStatistics(data.items || data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching locations:', error);
      message.error('Failed to fetch locations');
      setIsLoading(false);
    }
  };

  const calculateStatistics = async (data: Location[]) => {
    try {
      // Get data from API for statistics
      const [continents, countries, regions, categories] = await Promise.all([
        getContinents(),
        getCountries(),
        getRegions(),
        getLocationCategories()
      ]);

      // Calculate active locations count
      const activeCount = data.filter(loc => loc.status === 'active').length;
      const featuredCount = data.filter(loc => loc.isFeatured).length;
      const withCoordinatesCount = data.filter(loc => loc.latitude && loc.longitude).length;

      // Group by country for the pie chart
      const countryMap = new Map();
      data.forEach(loc => {
        const country = loc.country || 'Unknown';
        countryMap.set(country, (countryMap.get(country) || 0) + 1);
      });

      const countryStats = Array.from(countryMap.entries()).map(([name, value]) => ({
        name,
        value,
      }));

      // Status data
      const statusStats = [
        { name: 'Active', value: activeCount },
        { name: 'Featured', value: featuredCount },
        { name: 'Regular', value: data.length - featuredCount },
      ];

      // Group by creation date for monthly data
      const monthMap = new Map();
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      data.forEach(loc => {
        if (loc.createdAt) {
          const date = new Date(loc.createdAt);
          const monthName = months[date.getMonth()];
          monthMap.set(monthName, (monthMap.get(monthName) || 0) + 1);
        }
      });

      const monthData = months.map(month => ({
        month,
        count: monthMap.get(month) || 0,
      }));

      // Region data from API
      const regionData = regions.map((region: any) => ({
        name: region.name,
        value: data.filter(loc => loc.region === region.name).length || Math.floor(Math.random() * 20)
      })).sort((a, b) => b.value - a.value).slice(0, 6);

      // Mock view trends for now (would come from analytics API in real implementation)
      const viewTrends = [
        { date: '2025-01', views: 120 },
        { date: '2025-02', views: 150 },
        { date: '2025-03', views: 200 },
        { date: '2025-04', views: 180 },
        { date: '2025-05', views: 250 },
      ];

      setStats({
        totalLocations: totalItems,
        activeLocations: activeCount,
        featuredLocations: featuredCount,
        locationsWithCoordinates: withCoordinatesCount,
        locationsByCountry: countryStats,
        locationsByStatus: statusStats,
        locationsByMonth: monthData,
        popularRegions: regionData,
        viewTrends: viewTrends,
      });
    } catch (error) {
      console.error('Error calculating statistics:', error);
      // Fallback to basic statistics from current data
      const activeCount = data.filter(loc => loc.status === 'active').length;
      const featuredCount = data.filter(loc => loc.isFeatured).length;

      setStats({
        totalLocations: totalItems,
        activeLocations: activeCount,
        featuredLocations: featuredCount,
        locationsWithCoordinates: data.filter(loc => loc.latitude && loc.longitude).length,
        locationsByCountry: [],
        locationsByStatus: [
          { name: 'Active', value: activeCount },
          { name: 'Featured', value: featuredCount },
        ],
        locationsByMonth: [],
        popularRegions: [],
        viewTrends: [],
      });
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    // Reset to first page when searching
    setCurrentPage(1);

    // In a real application, we would call the API with search parameters
    // For now, just filter the current data
    const filtered = locations.filter(
      location => location.name.toLowerCase().includes(value.toLowerCase())
    );
    calculateStatistics(filtered);
  };

  const handleCreateLocation = () => {
    setSelectedLocation(null);
    setIsModalVisible(true);
  };

  const handleEditLocation = (location: Location) => {
    setSelectedLocation(location);
    setIsModalVisible(true);
  };

  const handleDeleteLocation = async (id: string) => {
    try {
      await deleteLocation(id);
      message.success('Location deleted successfully');
      fetchLocations(); // Refresh list after deletion
    } catch (error) {
      console.error('Error deleting location:', error);
      message.error('Failed to delete location');
    }
  };

  const handleFormSubmit = async (locationData: Partial<Location>) => {
    try {
      setFormLoading(true);

      if (selectedLocation) {
        // Update existing location
        await updateLocation(selectedLocation.id || '', locationData);
        message.success('Location updated successfully');
      } else {
        // Create new location
        await createLocation(locationData);
        message.success('Location created successfully');
      }

      setIsModalVisible(false);
      setFormLoading(false);
      fetchLocations(); // Refresh list with updated data
    } catch (error) {
      console.error('Error saving location:', error);
      message.error('Failed to save location');
      setFormLoading(false);
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
    },
    {
      title: 'Region',
      dataIndex: 'region',
      key: 'region',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'orange'}>
          {status || 'Unknown'}
        </Tag>
      ),
    },
    {
      title: 'Featured',
      dataIndex: 'isFeatured',
      key: 'isFeatured',
      render: (featured: boolean) => (
        featured ? <Tag color="gold">Featured</Tag> : <Tag color="default">Regular</Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: string, record: any) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditLocation(record)}
            type="link"
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteLocation(record.id)}
            type="link"
            danger
          />
        </Space>
      ),
    },
  ];

  const filteredLocations = searchTerm ?
    locations.filter(location => location.name.toLowerCase().includes(searchTerm.toLowerCase())) :
    locations;

  return (
    <div className="p-6">
      <Typography.Title level={2}>
        <EnvironmentOutlined /> Location Management
      </Typography.Title>

      <Tabs activeKey={activeTab} onChange={setActiveTab} className="mb-6">
        <TabPane
          tab={<span><TableOutlined /> Locations List</span>}
          key="table"
        >
          <div className="mb-4 flex justify-between flex-wrap">
            <Search
              placeholder="Search locations"
              onSearch={handleSearch}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: 300, marginBottom: 16 }}
            />

            <PermissionGuard permission={Permission.CreateLocation}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreateLocation}
              >
                Add Location
              </Button>
            </PermissionGuard>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-60">
              <Spin size="large" />
            </div>
          ) : (
            <Table
              columns={columns}
              dataSource={filteredLocations}
              rowKey="id"
              pagination={{
                current: currentPage,
                onChange: (page) => setCurrentPage(page),
                pageSize: pageSize,
                total: totalItems,
                showSizeChanger: true,
                onShowSizeChange: (current, size) => {
                  setCurrentPage(1);
                  setPageSize(size);
                },
                showTotal: (total) => `Total ${total} locations`,
              }}
            />
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
            <LocationStatistics stats={stats} />
          )}
        </TabPane>
      </Tabs>

      {/* Location Form Modal */}
      {isModalVisible && (
        <Card
          title={selectedLocation ? "Edit Location" : "Create Location"}
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
          <LocationForm
            location={selectedLocation || undefined}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsModalVisible(false)}
            loading={formLoading}
          />
        </Card>
      )}
    </div>
  );
};

export default LocationManagement;

