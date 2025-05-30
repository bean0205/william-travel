import React, { useState, useEffect } from 'react';
import {
  Table, Button, Space, Typography, Input, Modal, Form, Card, message,
  Row, Col, Tabs, Skeleton, Image, Tag, Select
} from 'antd';
import {
  EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined, GlobalOutlined,
  TableOutlined, ReloadOutlined
} from '@ant-design/icons';
import { Permission } from '@/utils/permissions';
import { PermissionGuard } from '@/components/common/PermissionGuards';
import {
  Continent, getContinents, getContinentById, createContinent,
  updateContinent, deleteContinent
} from '@/services/api/locationService';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Search } = Input;
const { TextArea } = Input;

const ContinentManagement: React.FC = () => {
  const [continents, setContinents] = useState<Continent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingContinent, setEditingContinent] = useState<Continent | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'create' | 'edit'>('create');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [form] = Form.useForm();
  const [viewContinentModalVisible, setViewContinentModalVisible] = useState<boolean>(false);
  const [viewContinent, setViewContinent] = useState<Continent | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    fetchContinents();
  }, [pagination.current, pagination.pageSize, searchQuery]);

  const fetchContinents = async () => {
    try {
      setLoading(true);
      const response = await getContinents(pagination.current, pagination.pageSize, searchQuery);

      // Xử lý kết quả phân trang
      if (response && 'items' in response) {
        // Nếu API đã trả về đúng định dạng phân trang
        setContinents(response.items);
        setPagination({
          ...pagination,
          total: response.total
        });
      } else if (Array.isArray(response)) {
        // Fallback nếu API trả về mảng đơn giản
        setContinents(response);
        setPagination({
          ...pagination,
          total: response.length
        });
      }

      setLoading(false);
    } catch (error) {
      message.error('Failed to fetch continents');
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
    // Reset về trang đầu tiên khi thực hiện tìm kiếm mới
    setPagination({
      ...pagination,
      current: 1
    });
  };

  const showCreateModal = () => {
    form.resetFields();
    setModalType('create');
    setIsModalVisible(true);
  };

  const showEditModal = async (continent: Continent) => {
    try {
      setLoading(true);
      const detailedContinent = await getContinentById(continent.id);
      setEditingContinent(detailedContinent);

      form.setFieldsValue({
        name: detailedContinent.name,
        code: detailedContinent.code,
        name_code: detailedContinent.name_code,
        description: detailedContinent.description,
        description_code: detailedContinent.description_code,
        background_image: detailedContinent.background_image,
        logo: detailedContinent.logo,
        status: detailedContinent.status,
      });

      setModalType('edit');
      setIsModalVisible(true);
      setLoading(false);
    } catch (error) {
      message.error('Failed to fetch continent details');
      setLoading(false);
    }
  };

  const showViewModal = async (continentId: number) => {
    try {
      setLoading(true);
      const continent = await getContinentById(continentId);
      setViewContinent(continent);
      setViewContinentModalVisible(true);
      setLoading(false);
    } catch (error) {
      message.error('Failed to fetch continent details');
      setLoading(false);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      if (modalType === 'create') {
        await createContinent(values);
        message.success('Continent created successfully');
      } else if (modalType === 'edit' && editingContinent) {
        await updateContinent(editingContinent.id, values);
        message.success('Continent updated successfully');
      }
      setIsModalVisible(false);
      fetchContinents();
    } catch (error) {
      console.error('Operation failed:', error);
      message.error('Operation failed');
    }
  };

  const handleDelete = async (continentId: number) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this continent?',
      content: 'This action cannot be undone and may affect related data.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await deleteContinent(continentId);
          message.success('Continent deleted successfully');
          fetchContinents();
        } catch (error) {
          message.error('Failed to delete continent');
        }
      },
    });
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a: Continent, b: Continent) => a.id - b.id,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Continent, b: Continent) => a.name.localeCompare(b.name),
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Logo',
      dataIndex: 'logo',
      key: 'logo',
      render: (logo: string) => (
        logo ? <Image src={logo} alt="Logo" width={50} height={50} /> : <Text type="secondary">No logo</Text>
      ),
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
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: (a: Continent, b: Continent) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Continent) => (
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

  const filteredContinents = searchQuery
    ? continents.filter(
        continent =>
          continent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          continent.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          continent.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : continents;

  return (
    <div className="continent-management-container">
      <Card>
        <div className="continent-management-header" style={{ marginBottom: 16 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={2}>Continent Management</Title>
            </Col>
            <Col>
              <Space>
                <Search
                  placeholder="Search continents..."
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
                    Add Continent
                  </Button>
                </PermissionGuard>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => fetchContinents()}
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
                Continents List
              </span>
            }
            key="table"
          >
            <Table
              columns={columns}
              dataSource={filteredContinents}
              rowKey="id"
              loading={loading}
              pagination={pagination}
              onChange={handleTableChange}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* Create/Edit Continent Modal */}
      <Modal
        title={modalType === 'create' ? 'Create New Continent' : 'Edit Continent'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={700}
        okText={modalType === 'create' ? 'Create' : 'Update'}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Continent Name"
                rules={[{ required: true, message: 'Please enter continent name' }]}
              >
                <Input prefix={<GlobalOutlined />} placeholder="Continent Name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="code"
                label="Code"
                rules={[
                  { required: true, message: 'Please enter code' },
                  { max: 2, message: 'Code should be maximum 2 characters' }
                ]}
              >
                <Input placeholder="e.g. AS" style={{ textTransform: 'uppercase' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name_code"
                label="Name Code"
                rules={[{ required: true, message: 'Please enter name code' }]}
              >
                <Input placeholder="e.g. asia" />
              </Form.Item>
            </Col>
            <Col span={12}>
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
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Description"
          >
            <TextArea rows={3} placeholder="Continent description" />
          </Form.Item>

          <Form.Item
            name="description_code"
            label="Description Code"
          >
            <Input placeholder="e.g. asia_desc" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="background_image"
                label="Background Image URL"
              >
                <Input placeholder="https://example.com/image.jpg" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="logo"
                label="Logo URL"
              >
                <Input placeholder="https://example.com/logo.png" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* View Continent Modal */}
      <Modal
        title="Continent Details"
        open={viewContinentModalVisible}
        onCancel={() => setViewContinentModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setViewContinentModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={700}
      >
        {loading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : viewContinent ? (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card title="Basic Information">
                  <p><strong>ID:</strong> {viewContinent.id}</p>
                  <p><strong>Name:</strong> {viewContinent.name}</p>
                  <p><strong>Code:</strong> <Tag color="blue">{viewContinent.code}</Tag></p>
                  <p><strong>Name Code:</strong> {viewContinent.name_code}</p>
                  <p><strong>Status:</strong>
                    <Tag color={viewContinent.status === 1 ? 'green' : 'red'} style={{ marginLeft: 8 }}>
                      {viewContinent.status === 1 ? 'Active' : 'Inactive'}
                    </Tag>
                  </p>
                  <p><strong>Created At:</strong> {new Date(viewContinent.created_at).toLocaleString()}</p>
                  <p><strong>Updated At:</strong> {new Date(viewContinent.updated_at).toLocaleString()}</p>
                </Card>
              </Col>
              <Col span={12}>
                <Card title="Media">
                  <div style={{ marginBottom: 16 }}>
                    <p><strong>Logo:</strong></p>
                    {viewContinent.logo ? (
                      <Image src={viewContinent.logo} alt="Logo" width={120} />
                    ) : (
                      <Text type="secondary">No logo available</Text>
                    )}
                  </div>
                  <div>
                    <p><strong>Background Image:</strong></p>
                    {viewContinent.background_image ? (
                      <Image src={viewContinent.background_image} alt="Background" width="100%" />
                    ) : (
                      <Text type="secondary">No background image available</Text>
                    )}
                  </div>
                </Card>
              </Col>
            </Row>
            <Row style={{ marginTop: 16 }}>
              <Col span={24}>
                <Card title="Description">
                  <p>{viewContinent.description || 'No description available'}</p>
                  <p><strong>Description Code:</strong> {viewContinent.description_code || 'N/A'}</p>
                </Card>
              </Col>
            </Row>
          </div>
        ) : (
          <p>No continent data available</p>
        )}
      </Modal>
    </div>
  );
};

export default ContinentManagement;
