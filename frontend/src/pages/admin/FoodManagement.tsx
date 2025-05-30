import React, { useState, useEffect } from 'react';
import {
  Table, Button, Space, Typography, Input, Modal, Form, Card, message,
  Row, Col, Tabs, Skeleton, Tag, Select, Tooltip, Descriptions, InputNumber, TimePicker
} from 'antd';
import {
  EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined, CoffeeOutlined,
  TableOutlined, ReloadOutlined, SearchOutlined, EnvironmentOutlined,
  PhoneOutlined, MailOutlined, ClockCircleOutlined
} from '@ant-design/icons';
import { Permission } from '@/utils/permissions';
import { PermissionGuard } from '@/components/common/PermissionGuards';
import moment from 'moment';
import {
  Food, FoodResponse, getFoods, getFoodById,
  createFood, updateFood, deleteFood,
  FoodCategory, getFoodCategories
} from '@/services/api/foodService';
import { getRegions, Region } from '@/services/api/locationService';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Search } = Input;
const { TextArea } = Input;
const { Divider } = require('antd');

const FoodManagement: React.FC = () => {
  // State
  const [foods, setFoods] = useState<Food[]>([]);
  const [categories, setCategories] = useState<FoodCategory[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingFood, setEditingFood] = useState<Food | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'create' | 'edit'>('create');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [form] = Form.useForm();
  const [viewFoodModalVisible, setViewFoodModalVisible] = useState<boolean>(false);
  const [viewFood, setViewFood] = useState<Food | null>(null);
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
    fetchFoods();
    fetchCategories();
    fetchRegions();
  }, [pagination.current, pagination.pageSize, filters]);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const { categoryId, regionId } = filters;
      const response = await getFoods(
        pagination.current,
        pagination.pageSize,
        searchQuery,
        categoryId,
        undefined, // countryId
        regionId
      );
      setFoods(response.items);
      setPagination({ ...pagination, total: response.total });
      setLoading(false);
    } catch (error) {
      message.error('Failed to fetch foods');
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getFoodCategories();
      setCategories(data);
    } catch (error) {
      message.error('Failed to fetch food categories');
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
    fetchFoods();
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

  const showEditModal = async (food: Food) => {
    try {
      setLoading(true);
      const detailedFood = await getFoodById(food.id);
      setEditingFood(detailedFood);

      form.setFieldsValue({
        name: detailedFood.name,
        description: detailedFood.description,
        address: detailedFood.address,
        category_id: detailedFood.category_id,
        cuisine: detailedFood.cuisine,
        price_range: detailedFood.price_range,
        signature_dishes: detailedFood.signature_dishes,
        operating_hours: detailedFood.operating_hours,
        contacts: detailedFood.contacts,
        location: detailedFood.location,
        region_id: detailedFood.region_id,
      });

      setModalType('edit');
      setIsModalVisible(true);
      setLoading(false);
    } catch (error) {
      message.error('Failed to fetch food details');
      setLoading(false);
    }
  };

  const showViewModal = async (foodId: number) => {
    try {
      setLoading(true);
      const food = await getFoodById(foodId);
      setViewFood(food);
      setViewFoodModalVisible(true);
      setLoading(false);
    } catch (error) {
      message.error('Failed to fetch food details');
      setLoading(false);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      if (modalType === 'create') {
        await createFood(values);
        message.success('Food/Restaurant created successfully');
      } else if (modalType === 'edit' && editingFood) {
        await updateFood(editingFood.id, values);
        message.success('Food/Restaurant updated successfully');
      }
      setIsModalVisible(false);
      fetchFoods();
    } catch (error) {
      message.error('Operation failed');
    }
  };

  const handleDelete = async (foodId: number) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this food/restaurant?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await deleteFood(foodId);
          message.success('Food/Restaurant deleted successfully');
          fetchFoods();
        } catch (error) {
          message.error('Failed to delete food/restaurant');
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
      sorter: (a: Food, b: Food) => a.id - b.id,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Food, b: Food) => a.name.localeCompare(b.name),
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
      onFilter: (value: number, record: Food) => record.category_id === value,
    },
    {
      title: 'Cuisine',
      dataIndex: 'cuisine',
      key: 'cuisine',
      render: (text: string) => <Tag>{text}</Tag>,
    },
    {
      title: 'Price Range',
      dataIndex: 'price_range',
      key: 'price_range',
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
      onFilter: (value: number, record: Food) => record.region_id === value,
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      sorter: (a: Food, b: Food) => (a.rating || 0) - (b.rating || 0),
      render: (rating: number) => rating ? `${rating} / 5` : 'N/A',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Food) => (
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
    <div className="food-management-container">
      <Card>
        <div className="food-management-header" style={{ marginBottom: 16 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={2}>Foods & Restaurants</Title>
            </Col>
            <Col>
              <Space>
                <Search
                  placeholder="Search foods/restaurants..."
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
                    Add Food/Restaurant
                  </Button>
                </PermissionGuard>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => fetchFoods()}
                >
                  Refresh
                </Button>
              </Space>
            </Col>
          </Row>
        </div>

        <Table
          columns={columns}
          dataSource={foods}
          rowKey="id"
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
        />
      </Card>

      {/* Create/Edit Food Modal */}
      <Modal
        title={modalType === 'create' ? 'Create New Food/Restaurant' : 'Edit Food/Restaurant'}
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
                label="Name"
                rules={[{ required: true, message: 'Please enter name' }]}
              >
                <Input prefix={<CoffeeOutlined />} placeholder="Restaurant or Food Name" />
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
            <TextArea rows={3} placeholder="Description" />
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
                name="cuisine"
                label="Cuisine"
                rules={[{ required: true, message: 'Please enter cuisine type' }]}
              >
                <Input placeholder="e.g. vietnamese, italian" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="price_range"
                label="Price Range"
                rules={[{ required: true, message: 'Please enter price range' }]}
              >
                <Input placeholder="e.g. $, $$, $$$" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="operating_hours"
                label="Operating Hours"
              >
                <Input placeholder="e.g. 7:00 AM - 10:00 PM" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="signature_dishes"
            label="Signature Dishes"
          >
            <Select mode="tags" style={{ width: '100%' }} placeholder="Enter signature dishes">
              <Select.Option value="pho">Pho</Select.Option>
              <Select.Option value="banh_mi">Banh Mi</Select.Option>
              <Select.Option value="bun_cha">Bun Cha</Select.Option>
            </Select>
          </Form.Item>

          <Divider>Contact Information</Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name={['contacts', 'phone']}
                label="Phone"
              >
                <Input prefix={<PhoneOutlined />} placeholder="+84 123 456 789" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={['contacts', 'email']}
                label="Email"
              >
                <Input prefix={<MailOutlined />} placeholder="contact@example.com" />
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

      {/* View Food Modal */}
      <Modal
        title="Food/Restaurant Details"
        open={viewFoodModalVisible}
        onCancel={() => setViewFoodModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setViewFoodModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={800}
      >
        {loading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : viewFood ? (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={16}>
                <Card title="Basic Information">
                  <Descriptions bordered column={1}>
                    <Descriptions.Item label="ID">{viewFood.id}</Descriptions.Item>
                    <Descriptions.Item label="Name">{viewFood.name}</Descriptions.Item>
                    <Descriptions.Item label="Category">
                      {getCategory(viewFood.category_id)?.name || 'Unknown'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Cuisine">{viewFood.cuisine}</Descriptions.Item>
                    <Descriptions.Item label="Description">
                      {viewFood.description || 'No description'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Address">{viewFood.address}</Descriptions.Item>
                    <Descriptions.Item label="Region">
                      {getRegion(viewFood.region_id)?.name || 'Unknown'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Price Range">{viewFood.price_range}</Descriptions.Item>
                    <Descriptions.Item label="Operating Hours">{viewFood.operating_hours}</Descriptions.Item>
                    <Descriptions.Item label="Rating">{viewFood.rating ? `${viewFood.rating} / 5` : 'N/A'}</Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
              <Col span={8}>
                <Card title="Contact Information">
                  <p><strong>Phone:</strong> {viewFood.contacts?.phone || 'N/A'}</p>
                  <p><strong>Email:</strong> {viewFood.contacts?.email || 'N/A'}</p>
                </Card>
                <Card title="Location" style={{ marginTop: 16 }}>
                  <p><strong>Latitude:</strong> {viewFood.location.latitude}</p>
                  <p><strong>Longitude:</strong> {viewFood.location.longitude}</p>
                </Card>
              </Col>
            </Row>

            <Row style={{ marginTop: 16 }}>
              <Col span={24}>
                <Card title="Signature Dishes">
                  {viewFood.signature_dishes && viewFood.signature_dishes.length > 0 ? (
                    <div>
                      {viewFood.signature_dishes.map(dish => (
                        <Tag color="blue" key={dish} style={{ margin: '5px' }}>
                          {dish}
                        </Tag>
                      ))}
                    </div>
                  ) : (
                    <Text type="secondary">No signature dishes listed</Text>
                  )}
                </Card>
              </Col>
            </Row>

            {viewFood.images && viewFood.images.length > 0 && (
              <Row style={{ marginTop: 16 }}>
                <Col span={24}>
                  <Card title="Images">
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {viewFood.images.map((image, index) => (
                        <Image
                          key={index}
                          src={image}
                          alt={`${viewFood.name} image ${index + 1}`}
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
          <p>No food/restaurant data available</p>
        )}
      </Modal>
    </div>
  );
};

export default FoodManagement;
