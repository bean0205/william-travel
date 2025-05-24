import React, { useState, useEffect } from 'react';
import {
  Table, Button, Space, Typography, Input, Modal, Form, Card, message,
  Row, Col, Tabs, Skeleton, Tag, Select
} from 'antd';
import {
  EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined,
  TableOutlined, ReloadOutlined, SearchOutlined, HomeOutlined
} from '@ant-design/icons';
import { Permission } from '@/utils/permissions';
import { PermissionGuard } from '@/components/common/PermissionGuards';
import {
  Ward, getWards, getWardById, createWard, updateWard, deleteWard,
  getDistricts, District
} from '@/services/api/locationService';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Search } = Input;

const WardManagement: React.FC = () => {
  const [wards, setWards] = useState<Ward[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingWard, setEditingWard] = useState<Ward | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'create' | 'edit'>('create');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [form] = Form.useForm();
  const [viewWardModalVisible, setViewWardModalVisible] = useState<boolean>(false);
  const [viewWard, setViewWard] = useState<Ward | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);

  useEffect(() => {
    fetchWards();
    fetchDistricts();
  }, [pagination.current, pagination.pageSize, selectedDistrict]);

  const fetchWards = async () => {
    try {
      setLoading(true);
      const skip = (pagination.current - 1) * pagination.pageSize;
      const data = await getWards(skip, pagination.pageSize, selectedDistrict || undefined);
      setWards(data);
      setPagination({ ...pagination, total: data.length * 10 }); // Just a placeholder, actual backend should return total count
      setLoading(false);
    } catch (error) {
      message.error('Failed to fetch wards');
      setLoading(false);
    }
  };

  const fetchDistricts = async () => {
    try {
      const data = await getDistricts();
      setDistricts(data);
    } catch (error) {
      message.error('Failed to fetch districts');
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
      fetchWards();
    }
  };

  const handleDistrictFilterChange = (districtId: number | null) => {
    setSelectedDistrict(districtId);
    setPagination({ ...pagination, current: 1 });
  };

  const showCreateModal = () => {
    form.resetFields();
    setModalType('create');
    setIsModalVisible(true);
  };

  const showEditModal = async (ward: Ward) => {
    try {
      setLoading(true);
      const detailedWard = await getWardById(ward.id);
      setEditingWard(detailedWard);

      form.setFieldsValue({
        name: detailedWard.name,
        code: detailedWard.code,
        name_code: detailedWard.name_code,
        status: detailedWard.status,
        district_id: detailedWard.district_id,
      });

      setModalType('edit');
      setIsModalVisible(true);
      setLoading(false);
    } catch (error) {
      message.error('Failed to fetch ward details');
      setLoading(false);
    }
  };

  const showViewModal = async (wardId: number) => {
    try {
      setLoading(true);
      const ward = await getWardById(wardId);
      setViewWard(ward);
      setViewWardModalVisible(true);
      setLoading(false);
    } catch (error) {
      message.error('Failed to fetch ward details');
      setLoading(false);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      if (modalType === 'create') {
        await createWard(values);
        message.success('Ward created successfully');
      } else if (modalType === 'edit' && editingWard) {
        await updateWard(editingWard.id, values);
        message.success('Ward updated successfully');
      }
      setIsModalVisible(false);
      fetchWards();
    } catch (error) {
      console.error('Operation failed:', error);
      message.error('Operation failed');
    }
  };

  const handleDelete = async (wardId: number) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this ward?',
      content: 'This action cannot be undone and may affect related data.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await deleteWard(wardId);
          message.success('Ward deleted successfully');
          fetchWards();
        } catch (error) {
          message.error('Failed to delete ward');
        }
      },
    });
  };

  const getDistrict = (districtId: number) => {
    return districts.find(district => district.id === districtId);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a: Ward, b: Ward) => a.id - b.id,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Ward, b: Ward) => a.name.localeCompare(b.name),
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'District',
      dataIndex: 'district_id',
      key: 'district',
      render: (districtId: number) => {
        const district = getDistrict(districtId);
        return district ? <Tag color="green">{district.name}</Tag> : 'Unknown';
      },
      filters: districts.map(district => ({ text: district.name, value: district.id })),
      onFilter: (value: number, record: Ward) => record.district_id === value,
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
      onFilter: (value: number, record: Ward) => record.status === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Ward) => (
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

  const filteredWards = searchQuery
    ? wards.filter(
        ward =>
          ward.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ward.code.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : wards;

  return (
    <div className="ward-management-container">
      <Card>
        <div className="ward-management-header" style={{ marginBottom: 16 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={2}>Ward Management</Title>
            </Col>
            <Col>
              <Space>
                <Search
                  placeholder="Search wards..."
                  onSearch={handleSearch}
                  style={{ width: 250 }}
                  allowClear
                />
                <Select
                  placeholder="Filter by district"
                  style={{ width: 180 }}
                  allowClear
                  onChange={handleDistrictFilterChange}
                >
                  {districts.map(district => (
                    <Select.Option key={district.id} value={district.id}>{district.name}</Select.Option>
                  ))}
                </Select>
                <PermissionGuard requiredPermissions={[Permission.LOCATION_CREATE]}>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={showCreateModal}
                  >
                    Add Ward
                  </Button>
                </PermissionGuard>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => fetchWards()}
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
                Wards List
              </span>
            }
            key="table"
          >
            <Table
              columns={columns}
              dataSource={filteredWards}
              rowKey="id"
              loading={loading}
              pagination={pagination}
              onChange={handleTableChange}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* Create/Edit Ward Modal */}
      <Modal
        title={modalType === 'create' ? 'Create New Ward' : 'Edit Ward'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
        okText={modalType === 'create' ? 'Create' : 'Update'}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Ward Name"
                rules={[{ required: true, message: 'Please enter ward name' }]}
              >
                <Input prefix={<HomeOutlined />} placeholder="Ward Name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="code"
                label="Code"
                rules={[{ required: true, message: 'Please enter code' }]}
              >
                <Input placeholder="e.g. PX" />
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
                <Input placeholder="e.g. phuc_xa" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="district_id"
                label="District"
                rules={[{ required: true, message: 'Please select district' }]}
              >
                <Select placeholder="Select district">
                  {districts.map(district => (
                    <Select.Option key={district.id} value={district.id}>
                      {district.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

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

      {/* View Ward Modal */}
      <Modal
        title="Ward Details"
        open={viewWardModalVisible}
        onCancel={() => setViewWardModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setViewWardModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={600}
      >
        {loading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : viewWard ? (
          <div>
            <Card title="Basic Information">
              <p><strong>ID:</strong> {viewWard.id}</p>
              <p><strong>Name:</strong> {viewWard.name}</p>
              <p><strong>Code:</strong> <Tag color="blue">{viewWard.code}</Tag></p>
              <p><strong>Name Code:</strong> {viewWard.name_code}</p>
              <p>
                <strong>District:</strong> {
                  getDistrict(viewWard.district_id)?.name || 'Unknown'
                }
              </p>
              <p><strong>Status:</strong>
                <Tag color={viewWard.status === 1 ? 'green' : 'red'} style={{ marginLeft: 8 }}>
                  {viewWard.status === 1 ? 'Active' : 'Inactive'}
                </Tag>
              </p>
              <p><strong>Created At:</strong> {new Date(viewWard.created_at).toLocaleString()}</p>
              <p><strong>Updated At:</strong> {new Date(viewWard.updated_at).toLocaleString()}</p>
            </Card>
          </div>
        ) : (
          <p>No ward data available</p>
        )}
      </Modal>
    </div>
  );
};

export default WardManagement;
