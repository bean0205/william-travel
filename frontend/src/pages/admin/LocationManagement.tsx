import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, Typography, Input, Tabs, Card, Spin, message, Modal, Form } from 'antd';
import {
  EditOutlined,
  DeleteOutlined, 
  PlusOutlined, 
  EnvironmentOutlined,
  BarChartOutlined,
  TableOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Permission } from '@/utils/permissions';
import { PermissionGuard } from '@/components/common/PermissionGuards';
import LocationStatistics from '@/components/admin/LocationStatistics';
import LocationForm from '@/components/admin/LocationForm';
import LocationNavigationMenu from '@/components/admin/LocationNavigationMenu';
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
  const navigate = useNavigate();
  const [locations, setLocations] = useState<Location[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('table');
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Navigation handler for location management sections
  const navigateToSection = (path: string) => {
    navigate(path);
  };

  useEffect(() => {
    fetchLocations();
    fetchStatistics();
  }, [currentPage, pageSize]);

  const fetchLocations = async () => {
    try {
      setIsLoading(true);
      // Implement API call to fetch locations
      const offset = (currentPage - 1) * pageSize;
      const response = await getLocations(offset, pageSize, searchTerm);
      setLocations(response.items || []);
      setTotalItems(response.total || 0);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch locations:', error);
      message.error('Failed to load locations');
      setIsLoading(false);
    }
  };

  const fetchStatistics = async () => {
    // Implement statistics fetching logic here
    // This is a placeholder for actual API integration
  };

  const handleCreateOrUpdateLocation = async (values: any) => {
    try {
      setIsSubmitting(true);
      if (selectedLocation) {
        // Update existing location
        await updateLocation(selectedLocation.id, values);
        message.success('Location updated successfully');
      } else {
        // Create new location
        await createLocation(values);
        message.success('Location created successfully');
      }
      setIsModalVisible(false);
      fetchLocations(); // Refresh the list
    } catch (error) {
      console.error('Failed to save location:', error);
      message.error('Failed to save location. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLocation = async (id: number) => {
    try {
      await deleteLocation(id);
      message.success('Location deleted successfully');
      fetchLocations(); // Refresh the list
    } catch (error) {
      console.error('Failed to delete location:', error);
      message.error('Failed to delete location');
    }
  };

  return (
    <div className="location-management-container">
      <Card>
        <Typography.Title level={2}>Location Management</Typography.Title>

        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane
            tab={
              <span>
                <TableOutlined />
                Locations
              </span>
            }
            key="table"
          >
            <div className="table-operations" style={{ marginBottom: 16 }}>
              <Space>
                <Search
                  placeholder="Search locations"
                  onSearch={(value) => {
                    setSearchTerm(value);
                    setCurrentPage(1);
                    fetchLocations();
                  }}
                  style={{ width: 250 }}
                  allowClear
                />
                <PermissionGuard requiredPermissions={[Permission.LOCATION_CREATE]}>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                      setSelectedLocation(null);
                      setIsModalVisible(true);
                    }}
                  >
                    Add Location
                  </Button>
                </PermissionGuard>
              </Space>
            </div>

            <Table
              loading={isLoading}
              dataSource={locations}
              rowKey="id"
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: totalItems,
                onChange: (page) => setCurrentPage(page),
                onShowSizeChange: (current, size) => setPageSize(size),
              }}
              // Add your columns and other table properties here
            />
          </TabPane>

          <TabPane
            tab={
              <span>
                <BarChartOutlined />
                Statistics
              </span>
            }
            key="statistics"
          >
            {isLoading ? <Spin size="large" /> : <LocationStatistics stats={stats} />}
          </TabPane>
        </Tabs>
      </Card>

      {/* Location Form Modal */}
      <Modal
        title={selectedLocation ? 'Edit Location' : 'Add New Location'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        <LocationForm
          form={form}
          initialValues={selectedLocation || {}}
          onFinish={handleCreateOrUpdateLocation}
          onCancel={() => setIsModalVisible(false)}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </div>
  );
};

export default LocationManagement;

