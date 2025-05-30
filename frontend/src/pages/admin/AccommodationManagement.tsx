import React, { useState, useEffect } from 'react';
import {
  Table, Button, Space, Typography, Input, Modal, Form, Card, message,
  Row, Col, Tabs, Skeleton, Tag, Select, Tooltip, Descriptions, InputNumber
} from 'antd';
import {
  EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined, HomeOutlined,
  TableOutlined, ReloadOutlined, SearchOutlined, EnvironmentOutlined,
  PhoneOutlined, MailOutlined, GlobalOutlined
} from '@ant-design/icons';
import { Permission } from '@/utils/permissions';
import { PermissionGuard } from '@/components/common/PermissionGuards';
import {
  Accommodation, AccommodationResponse, getAccommodations, getAccommodationById,
  createAccommodation, updateAccommodation, deleteAccommodation,
  AccommodationCategory, getAccommodationCategories
} from '@/services/api/accommodationService';
import { getRegions, Region } from '@/services/api/locationService';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Search } = Input;
const { TextArea } = Input;

const AccommodationManagement: React.FC = () => {
  // State
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [categories, setCategories] = useState<AccommodationCategory[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingAccommodation, setEditingAccommodation] = useState<Accommodation | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'create' | 'edit'>('create');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [form] = Form.useForm();
  const [viewAccommodationModalVisible, setViewAccommodationModalVisible] = useState<boolean>(false);
  const [viewAccommodation, setViewAccommodation] = useState<Accommodation | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState<{
    categoryId?: number;
    regionId?: number;
  }>({});

  // Fetch data
  useEffect(() => {
    fetchAccommodations();
    fetchCategories();
    fetchRegions();
  }, [pagination.current, pagination.pageSize, filters]);

  const fetchAccommodations = async () => {
    try {
      setLoading(true);
      const { categoryId, regionId } = filters;
      const response = await getAccommodations(
        pagination.current,
        pagination.pageSize,
        searchQuery,
        categoryId,
        undefined, // countryId
        regionId
      );
      setAccommodations(response.items);
      setPagination({ ...pagination, total: response.total });
      setLoading(false);
    } catch (error) {
      message.error('Failed to fetch accommodations');
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getAccommodationCategories();
      setCategories(data);
    } catch (error) {
      message.error('Failed to fetch accommodation categories');
    }
  };

  const fetchRegions = async () => {
    try {
      const data = await getRegions();
      setRegions(data);
    } catch (error) {
      message.error('Failed to fetch regions');
    }
  };

  const handleTableChange = (newPagination: any) => {
    setPagination({
      ...pagination,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPagination({ ...pagination, current: 1 });
    fetchAccommodations();
  };

  const handleFilterChange = (type: 'categoryId' | 'regionId', value: number | undefined) => {
    setFilters({ ...filters, [type]: value });
    setPagination({ ...pagination, current: 1 });
  };

  const showCreateModal = () => {
    form.resetFields();
    setModalType('create');
    setIsModalVisible(true);
  };

  const showEditModal = async (accommodation: Accommodation) => {
    try {
      setLoading(true);
      const detailedAccommodation = await getAccommodationById(accommodation.id);
      setEditingAccommodation(detailedAccommodation);

      form.setFieldsValue({
        name: detailedAccommodation.name,
        description: detailedAccommodation.description,
        address: detailedAccommodation.address,
        category_id: detailedAccommodation.category_id,
        price_range: detailedAccommodation.price_range,
        facilities: detailedAccommodation.facilities,
        contacts: detailedAccommodation.contacts,
        location: detailedAccommodation.location,
        region_id: detailedAccommodation.region_id,
      });

      setModalType('edit');
      setIsModalVisible(true);
      setLoading(false);
    } catch (error) {
      message.error('Failed to fetch accommodation details');
      setLoading(false);
    }
  };

  const showViewModal = async (accommodationId: number) => {
    try {
      setLoading(true);
      const accommodation = await getAccommodationById(accommodationId);
      setViewAccommodation(accommodation);
      setViewAccommodationModalVisible(true);
      setLoading(false);
    } catch (error) {
      message.error('Failed to fetch accommodation details');
      setLoading(false);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      if (modalType === 'create') {
        await createAccommodation(values);
        message.success('Accommodation created successfully');
      } else if (modalType === 'edit' && editingAccommodation) {
        await updateAccommodation(editingAccommodation.id, values);
        message.success('Accommodation updated successfully');
      }
      setIsModalVisible(false);
      fetchAccommodations();
    } catch (error) {
      message.error('Operation failed');
    }
  };

  const handleDelete = async (accommodationId: number) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this accommodation?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await deleteAccommodation(accommodationId);
          message.success('Accommodation deleted successfully');
          fetchAccommodations();
        } catch (error) {
          message.error('Failed to delete accommodation');
        }
      },
    });
  };

  const getCategory = (categoryId: number) => {
    return categories.find(category => category.id === categoryId);
  };

  const getRegion = (regionId: number) => {
    return regions.find(region => region.id === regionId);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a: Accommodation, b: Accommodation) => a.id - b.id,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Accommodation, b: Accommodation) => a.name.localeCompare(b.name),
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Category',
      dataIndex: 'category_id',
      key: 'category',
      render: (categoryId: number) => {
        const category = getCategory(categoryId);
        return category ? <Tag color="blue">{category.name}</Tag> : 'Unknown';
      },
      filters: categories.map(c => ({ text: c.name, value: c.id })),
      onFilter: (value: number, record: Accommodation) => record.category_id === value,
    },
    {
      title: 'Region',
      dataIndex: 'region_id',
      key: 'region',
      render: (regionId: number) => {
        const region = getRegion(regionId);
        return region ? <Tag color="green">{region.name}</Tag> : 'Unknown';
      },
      filters: regions.map(r => ({ text: r.name, value: r.id })),
      onFilter: (value: number, record: Accommodation) => record.region_id === value,
    },
    {
      title: 'Price Range',
      dataIndex: 'price_range',
      key: 'price_range',
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      sorter: (a: Accommodation, b: Accommodation) => (a.rating || 0) - (b.rating || 0),
      render: (rating: number) => rating ? `${rating} / 5` : 'N/A',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Accommodation) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => showViewModal(record.id)}
          />
          <PermissionGuard requiredPermissions={[Permission.CONTENT_EDIT]}>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => showEditModal(record)}
            />
          </PermissionGuard>
          <PermissionGuard requiredPermissions={[Permission.CONTENT_DELETE]}>
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
            />
          </PermissionGuard>
        </Space>
      ),
    },
  ];

  return (
    <div className="accommodation-management-container">
      <Card>
        <div className="accommodation-management-header" style={{ marginBottom: 16 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={2}>Accommodations</Title>
            </Col>
            <Col>
              <Space>
                <Search
                  placeholder="Search accommodations..."
                  onSearch={handleSearch}
                  style={{ width: 250 }}
                  allowClear
                />
                <Select
                  placeholder="Filter by category"
                  style={{ width: 180 }}
                  allowClear
                  onChange={(value) => handleFilterChange('categoryId', value)}
                >
                  {categories.map(category => (
                    <Select.Option key={category.id} value={category.id}>{category.name}</Select.Option>
                  ))}
                </Select>
                <Select
                  placeholder="Filter by region"
                  style={{ width: 180 }}
                  allowClear
                  onChange={(value) => handleFilterChange('regionId', value)}
                >
                  {regions.map(region => (
                    <Select.Option key={region.id} value={region.id}>{region.name}</Select.Option>
                  ))}
                </Select>
                <PermissionGuard requiredPermissions={[Permission.CONTENT_CREATE]}>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={showCreateModal}
                  >
                    Add Accommodation
                  </Button>
                </PermissionGuard>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => fetchAccommodations()}
                >
                  Refresh
                </Button>
              </Space>
            </Col>
          </Row>
        </div>

        <Table
          columns={columns}
          dataSource={accommodations}
          rowKey="id"
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
        />
      </Card>

      {/* Create/Edit Accommodation Modal */}
      <Modal
        title={modalType === 'create' ? 'Create New Accommodation' : 'Edit Accommodation'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        okText={modalType === 'create' ? 'Create' : 'Update'}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Accommodation Name"
                rules={[{ required: true, message: 'Please enter accommodation name' }]}
              >
                <Input prefix={<HomeOutlined />} placeholder="Accommodation Name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category_id"
                label="Category"
                rules={[{ required: true, message: 'Please select category' }]}
              >
                <Select placeholder="Select category">
                  {categories.map(category => (
                    <Select.Option key={category.id} value={category.id}>
                      {category.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Description"
          >
            <TextArea rows={3} placeholder="Accommodation description" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                name="address"
                label="Address"
                rules={[{ required: true, message: 'Please enter address' }]}
              >
                <Input prefix={<EnvironmentOutlined />} placeholder="Full address" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="region_id"
                label="Region"
                rules={[{ required: true, message: 'Please select region' }]}
              >
                <Select placeholder="Select region">
                  {regions.map(region => (
                    <Select.Option key={region.id} value={region.id}>
                      {region.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="price_range"
                label="Price Range"
                rules={[{ required: true, message: 'Please enter price range' }]}
              >
                <Input placeholder="e.g. 200-500" />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item
                name="facilities"
                label="Facilities"
              >
                <Select mode="tags" placeholder="Enter facilities (pool, spa, gym, etc.)">
                  <Select.Option value="pool">Pool</Select.Option>
                  <Select.Option value="spa">Spa</Select.Option>
                  <Select.Option value="gym">Gym</Select.Option>
                  <Select.Option value="restaurant">Restaurant</Select.Option>
                  <Select.Option value="bar">Bar</Select.Option>
                  <Select.Option value="wifi">Wi-Fi</Select.Option>
                  <Select.Option value="parking">Parking</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Divider>Contact Information</Divider>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name={['contacts', 'phone']}
                label="Phone"
              >
                <Input prefix={<PhoneOutlined />} placeholder="+84 123 456 789" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name={['contacts', 'email']}
                label="Email"
              >
                <Input prefix={<MailOutlined />} placeholder="contact@example.com" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name={['contacts', 'website']}
                label="Website"
              >
                <Input prefix={<GlobalOutlined />} placeholder="https://example.com" />
              </Form.Item>
            </Col>
          </Row>

          <Divider>Location Coordinates</Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name={['location', 'latitude']}
                label="Latitude"
              >
                <InputNumber style={{ width: '100%' }} step="0.000001" placeholder="e.g. 21.0285" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={['location', 'longitude']}
                label="Longitude"
              >
                <InputNumber style={{ width: '100%' }} step="0.000001" placeholder="e.g. 105.8542" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* View Accommodation Modal */}
      <Modal
        title="Accommodation Details"
        open={viewAccommodationModalVisible}
        onCancel={() => setViewAccommodationModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setViewAccommodationModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={800}
      >
        {loading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : viewAccommodation ? (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={16}>
                <Card title="Basic Information">
                  <Descriptions bordered column={1}>
                    <Descriptions.Item label="ID">{viewAccommodation.id}</Descriptions.Item>
                    <Descriptions.Item label="Name">{viewAccommodation.name}</Descriptions.Item>
                    <Descriptions.Item label="Category">
                      {getCategory(viewAccommodation.category_id)?.name || 'Unknown'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Description">
                      {viewAccommodation.description || 'No description'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Address">{viewAccommodation.address}</Descriptions.Item>
                    <Descriptions.Item label="Region">
                      {getRegion(viewAccommodation.region_id)?.name || 'Unknown'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Price Range">{viewAccommodation.price_range}</Descriptions.Item>
                    <Descriptions.Item label="Rating">{viewAccommodation.rating ? `${viewAccommodation.rating} / 5` : 'N/A'}</Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
              <Col span={8}>
                <Card title="Contact Information">
                  <p><strong>Phone:</strong> {viewAccommodation.contacts.phone || 'N/A'}</p>
                  <p><strong>Email:</strong> {viewAccommodation.contacts.email || 'N/A'}</p>
                  <p><strong>Website:</strong> {viewAccommodation.contacts.website || 'N/A'}</p>
                </Card>
                <Card title="Location" style={{ marginTop: 16 }}>
                  <p><strong>Latitude:</strong> {viewAccommodation.location.latitude}</p>
                  <p><strong>Longitude:</strong> {viewAccommodation.location.longitude}</p>
                </Card>
              </Col>
            </Row>

            <Row style={{ marginTop: 16 }}>
              <Col span={24}>
                <Card title="Facilities">
                  {viewAccommodation.facilities && viewAccommodation.facilities.length > 0 ? (
                    <div>
                      {viewAccommodation.facilities.map(facility => (
                        <Tag color="blue" key={facility} style={{ margin: '5px' }}>
                          {facility}
                        </Tag>
                      ))}
                    </div>
                  ) : (
                    <Text type="secondary">No facilities listed</Text>
                  )}
                </Card>
              </Col>
            </Row>

            {viewAccommodation.images && viewAccommodation.images.length > 0 && (
              <Row style={{ marginTop: 16 }}>
                <Col span={24}>
                  <Card title="Images">
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {viewAccommodation.images.map((image, index) => (
                        <Image
                          key={index}
                          src={image}
                          alt={`${viewAccommodation.name} image ${index + 1}`}
                          width={160}
                          height={120}
                          style={{ objectFit: 'cover' }}
                        />
                      ))}
                    </div>
                  </Card>
                </Col>
              </Row>
            )}
          </div>
        ) : (
          <p>No accommodation data available</p>
        )}
      </Modal>
    </div>
  );
};

const { Divider } = require('antd');

export default AccommodationManagement;
