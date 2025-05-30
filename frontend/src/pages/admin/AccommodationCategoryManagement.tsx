import React, { useState, useEffect } from 'react';
import {
  Table, Button, Space, Typography, Input, Modal, Form, Card, message,
  Row, Col, Tabs, Skeleton, Tag, Select
} from 'antd';
import {
  EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined, HomeOutlined,
  TableOutlined, ReloadOutlined, SearchOutlined
} from '@ant-design/icons';
import { Permission } from '@/utils/permissions';
import { PermissionGuard } from '@/components/common/PermissionGuards';
import {
  AccommodationCategory, getAccommodationCategories, getAccommodationCategoryById,
  createAccommodationCategory, updateAccommodationCategory
} from '@/services/api/accommodationService';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Search } = Input;

const AccommodationCategoryManagement: React.FC = () => {
  // State
  const [categories, setCategories] = useState<AccommodationCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingCategory, setEditingCategory] = useState<AccommodationCategory | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'create' | 'edit'>('create');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [form] = Form.useForm();
  const [viewCategoryModalVisible, setViewCategoryModalVisible] = useState<boolean>(false);
  const [viewCategory, setViewCategory] = useState<AccommodationCategory | null>(null);

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getAccommodationCategories();
      setCategories(data);
      setLoading(false);
    } catch (error) {
      message.error('Failed to fetch accommodation categories');
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (value.trim() === '') {
      fetchCategories();
    }
  };

  const showCreateModal = () => {
    form.resetFields();
    setModalType('create');
    setIsModalVisible(true);
  };

  const showEditModal = async (category: AccommodationCategory) => {
    try {
      setLoading(true);
      const detailedCategory = await getAccommodationCategoryById(category.id);
      setEditingCategory(detailedCategory);

      form.setFieldsValue({
        name: detailedCategory.name,
        description: detailedCategory.description,
        status: detailedCategory.status,
      });

      setModalType('edit');
      setIsModalVisible(true);
      setLoading(false);
    } catch (error) {
      message.error('Failed to fetch category details');
      setLoading(false);
    }
  };

  const showViewModal = async (categoryId: number) => {
    try {
      setLoading(true);
      const category = await getAccommodationCategoryById(categoryId);
      setViewCategory(category);
      setViewCategoryModalVisible(true);
      setLoading(false);
    } catch (error) {
      message.error('Failed to fetch category details');
      setLoading(false);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      if (modalType === 'create') {
        await createAccommodationCategory(values);
        message.success('Category created successfully');
      } else if (modalType === 'edit' && editingCategory) {
        await updateAccommodationCategory(editingCategory.id, values);
        message.success('Category updated successfully');
      }
      setIsModalVisible(false);
      fetchCategories();
    } catch (error) {
      message.error('Operation failed');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a: AccommodationCategory, b: AccommodationCategory) => a.id - b.id,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: AccommodationCategory, b: AccommodationCategory) => a.name.localeCompare(b.name),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => (
        <Tag color={status === 1 ? 'green' : 'red'}>
          {status === 1 ? 'Active' : 'Inactive'}
        </Tag>
      ),
      filters: [
        { text: 'Active', value: 1 },
        { text: 'Inactive', value: 0 },
      ],
      onFilter: (value: number, record: AccommodationCategory) => record.status === value,
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: AccommodationCategory) => (
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
        </Space>
      ),
    },
  ];

  const filteredCategories = searchQuery
    ? categories.filter(
        category =>
          category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          category.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : categories;

  return (
    <div className="accommodation-category-management-container">
      <Card>
        <div className="category-management-header" style={{ marginBottom: 16 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={2}>Accommodation Categories</Title>
            </Col>
            <Col>
              <Space>
                <Search
                  placeholder="Search categories..."
                  onSearch={handleSearch}
                  style={{ width: 250 }}
                  allowClear
                />
                <PermissionGuard requiredPermissions={[Permission.CONTENT_CREATE]}>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={showCreateModal}
                  >
                    Add Category
                  </Button>
                </PermissionGuard>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => fetchCategories()}
                >
                  Refresh
                </Button>
              </Space>
            </Col>
          </Row>
        </div>

        <Table
          columns={columns}
          dataSource={filteredCategories}
          rowKey="id"
          loading={loading}
        />
      </Card>

      {/* Create/Edit Category Modal */}
      <Modal
        title={modalType === 'create' ? 'Create New Category' : 'Edit Category'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
        okText={modalType === 'create' ? 'Create' : 'Update'}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Category Name"
            rules={[{ required: true, message: 'Please enter category name' }]}
          >
            <Input prefix={<HomeOutlined />} placeholder="Category Name" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea rows={3} placeholder="Category description" />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select placeholder="Select status">
              <Select.Option value={1}>Active</Select.Option>
              <Select.Option value={0}>Inactive</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Category Modal */}
      <Modal
        title="Category Details"
        open={viewCategoryModalVisible}
        onCancel={() => setViewCategoryModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setViewCategoryModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={600}
      >
        {loading ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : viewCategory ? (
          <div>
            <Card>
              <p><strong>ID:</strong> {viewCategory.id}</p>
              <p><strong>Name:</strong> {viewCategory.name}</p>
              <p><strong>Description:</strong> {viewCategory.description || 'No description'}</p>
              <p><strong>Status:</strong>
                <Tag color={viewCategory.status === 1 ? 'green' : 'red'} style={{ marginLeft: 8 }}>
                  {viewCategory.status === 1 ? 'Active' : 'Inactive'}
                </Tag>
              </p>
              <p><strong>Created At:</strong> {new Date(viewCategory.created_at).toLocaleString()}</p>
              <p><strong>Updated At:</strong> {new Date(viewCategory.updated_at).toLocaleString()}</p>
            </Card>
          </div>
        ) : (
          <p>No category data available</p>
        )}
      </Modal>
    </div>
  );
};

export default AccommodationCategoryManagement;
