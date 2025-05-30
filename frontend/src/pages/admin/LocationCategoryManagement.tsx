import React, { useState, useEffect } from 'react';
import {
  Table, Button, Space, Typography, Input, Modal, Form, Card, message,
  Row, Col, Tabs, Skeleton, Tag, Select
} from 'antd';
import {
  EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined,
  TableOutlined, ReloadOutlined, SearchOutlined, TagOutlined
} from '@ant-design/icons';
import { Permission } from '@/utils/permissions';
import { PermissionGuard } from '@/components/common/PermissionGuards';
import {
  LocationCategory, getLocationCategories, getLocationCategoryById,
  createLocationCategory, updateLocationCategory, deleteLocationCategory
} from '@/services/api/locationService';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Search } = Input;

const LocationCategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<LocationCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingCategory, setEditingCategory] = useState<LocationCategory | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'create' | 'edit'>('create');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [form] = Form.useForm();
  const [viewCategoryModalVisible, setViewCategoryModalVisible] = useState<boolean>(false);
  const [viewCategory, setViewCategory] = useState<LocationCategory | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    fetchCategories();
  }, [pagination.current, pagination.pageSize]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const skip = (pagination.current - 1) * pagination.pageSize;
      const data = await getLocationCategories(skip, pagination.pageSize);
      setCategories(data);
      setPagination({ ...pagination, total: data.length * 10 }); // Just a placeholder, actual backend should return total count
      setLoading(false);
    } catch (error) {
      message.error('Failed to fetch categories');
      setLoading(false);
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
    if (value.trim() === '') {
      fetchCategories();
    }
  };

  const showCreateModal = () => {
    form.resetFields();
    setModalType('create');
    setIsModalVisible(true);
  };

  const showEditModal = async (category: LocationCategory) => {
    try {
      setLoading(true);
      const detailedCategory = await getLocationCategoryById(category.id);
      setEditingCategory(detailedCategory);

      form.setFieldsValue({
        name: detailedCategory.name,
        code: detailedCategory.code,
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
      const category = await getLocationCategoryById(categoryId);
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
        await createLocationCategory(values);
        message.success('Category created successfully');
      } else if (modalType === 'edit' && editingCategory) {
        await updateLocationCategory(editingCategory.id, values);
        message.success('Category updated successfully');
      }
      setIsModalVisible(false);
      fetchCategories();
    } catch (error) {
      console.error('Operation failed:', error);
      message.error('Operation failed');
    }
  };

  const handleDelete = async (categoryId: number) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this category?',
      content: 'This action cannot be undone and may affect related data.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await deleteLocationCategory(categoryId);
          message.success('Category deleted successfully');
          fetchCategories();
        } catch (error) {
          message.error('Failed to delete category');
        }
      },
    });
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a: LocationCategory, b: LocationCategory) => a.id - b.id,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: LocationCategory, b: LocationCategory) => a.name.localeCompare(b.name),
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
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
      onFilter: (value: number, record: LocationCategory) => record.status === value,
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: LocationCategory) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => showViewModal(record.id)}
          />
          <PermissionGuard requiredPermissions={[Permission.LOCATION_EDIT]}>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => showEditModal(record)}
            />
          </PermissionGuard>
          <PermissionGuard requiredPermissions={[Permission.LOCATION_DELETE]}>
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

  const filteredCategories = searchQuery
    ? categories.filter(
        category =>
          category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          category.code.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : categories;

  return (
    <div className="location-category-management-container">
      <Card>
        <div className="location-category-management-header" style={{ marginBottom: 16 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={2}>Location Category Management</Title>
            </Col>
            <Col>
              <Space>
                <Search
                  placeholder="Search categories..."
                  onSearch={handleSearch}
                  style={{ width: 250 }}
                  allowClear
                />
                <PermissionGuard requiredPermissions={[Permission.LOCATION_CREATE]}>
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

        <Tabs defaultActiveKey="table">
          <TabPane
            tab={
              <span>
                <TableOutlined />
                Categories List
              </span>
            }
            key="table"
          >
            <Table
              columns={columns}
              dataSource={filteredCategories}
              rowKey="id"
              loading={loading}
              pagination={pagination}
              onChange={handleTableChange}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* Create/Edit Category Modal */}
      <Modal
        title={modalType === 'create' ? 'Create New Location Category' : 'Edit Location Category'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={500}
        okText={modalType === 'create' ? 'Create' : 'Update'}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Category Name"
            rules={[{ required: true, message: 'Please enter category name' }]}
          >
            <Input prefix={<TagOutlined />} placeholder="Category Name" />
          </Form.Item>

          <Form.Item
            name="code"
            label="Code"
            rules={[{ required: true, message: 'Please enter code' }]}
          >
            <Input placeholder="e.g. attraction" />
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
        title="Location Category Details"
        open={viewCategoryModalVisible}
        onCancel={() => setViewCategoryModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setViewCategoryModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={500}
      >
        {loading ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : viewCategory ? (
          <div>
            <Card title="Basic Information">
              <p><strong>ID:</strong> {viewCategory.id}</p>
              <p><strong>Name:</strong> {viewCategory.name}</p>
              <p><strong>Code:</strong> <Tag color="blue">{viewCategory.code}</Tag></p>
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

export default LocationCategoryManagement;
