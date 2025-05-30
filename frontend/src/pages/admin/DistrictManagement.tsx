import React, { useState, useEffect } from 'react';
import {
  Table, Button, Space, Typography, Input, Modal, Form, Card, message,
  Row, Col, Tabs, Skeleton, Tag, Select
} from 'antd';
import {
  EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined,
  TableOutlined, ReloadOutlined, SearchOutlined, PartitionOutlined
} from '@ant-design/icons';
import { Permission } from '@/utils/permissions';
import { PermissionGuard } from '@/components/common/PermissionGuards';
import {
  District, getDistricts, getDistrictById, createDistrict, updateDistrict, deleteDistrict,
  getRegions, Region
} from '@/services/api/locationService';

const { Title, Text } = Typography;
const { Search } = Input;
const { TextArea } = Input;

const DistrictManagement: React.FC = () => {
  const [districts, setDistricts] = useState<District[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingDistrict, setEditingDistrict] = useState<District | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'create' | 'edit'>('create');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [form] = Form.useForm();
  const [viewDistrictModalVisible, setViewDistrictModalVisible] = useState<boolean>(false);
  const [viewDistrict, setViewDistrict] = useState<District | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);

  useEffect(() => {
    fetchDistricts();
    fetchRegions();
  }, [pagination.current, pagination.pageSize, selectedRegion]);

  const fetchDistricts = async () => {
    try {
      setLoading(true);
      const skip = (pagination.current - 1) * pagination.pageSize;
      const data = await getDistricts(skip, pagination.pageSize, selectedRegion || undefined);
      // Ensure districts is always an array
      setDistricts(Array.isArray(data) ? data : []);
      setPagination({ ...pagination, total: Array.isArray(data) ? data.length * 10 : 0 }); // Just a placeholder, actual backend should return total count
      setLoading(false);
    } catch (error) {
      message.error('Failed to fetch districts');
      setDistricts([]); // Ensure districts is always an array even on error
      setLoading(false);
    }
  };

  const fetchRegions = async () => {
    try {
      const data = await getRegions();
      // Handle both paginated response format and direct array format
      if (data && typeof data === 'object' && 'items' in data) {
        setRegions(Array.isArray(data.items) ? data.items : []);
      } else {
        setRegions(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      message.error('Failed to fetch regions');
      setRegions([]); // Ensure regions is always an array even if there's an error
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
      fetchDistricts();
    }
  };

  const handleRegionFilterChange = (regionId: number | null) => {
    setSelectedRegion(regionId);
    setPagination({ ...pagination, current: 1 });
  };

  const showCreateModal = () => {
    form.resetFields();
    setModalType('create');
    setIsModalVisible(true);
  };

  const showEditModal = async (district: District) => {
    try {
      setLoading(true);
      const detailedDistrict = await getDistrictById(district.id);
      setEditingDistrict(detailedDistrict);

      form.setFieldsValue({
        name: detailedDistrict.name,
        code: detailedDistrict.code,
        name_code: detailedDistrict.name_code,
        description: detailedDistrict.description,
        description_code: detailedDistrict.description_code,
        status: detailedDistrict.status,
        region_id: detailedDistrict.region_id,
      });

      setModalType('edit');
      setIsModalVisible(true);
      setLoading(false);
    } catch (error) {
      message.error('Failed to fetch district details');
      setLoading(false);
    }
  };

  const showViewModal = async (districtId: number) => {
    try {
      setLoading(true);
      const district = await getDistrictById(districtId);
      setViewDistrict(district);
      setViewDistrictModalVisible(true);
      setLoading(false);
    } catch (error) {
      message.error('Failed to fetch district details');
      setLoading(false);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      if (modalType === 'create') {
        await createDistrict(values);
        message.success('District created successfully');
      } else if (modalType === 'edit' && editingDistrict) {
        await updateDistrict(editingDistrict.id, values);
        message.success('District updated successfully');
      }
      setIsModalVisible(false);
      fetchDistricts();
    } catch (error) {
      console.error('Operation failed:', error);
      message.error('Operation failed');
    }
  };

  const handleDelete = async (districtId: number) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this district?',
      content: 'This action cannot be undone and may affect related data.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await deleteDistrict(districtId);
          message.success('District deleted successfully');
          fetchDistricts();
        } catch (error) {
          message.error('Failed to delete district');
        }
      },
    });
  };

  const getRegion = (regionId: number) => {
    return regions.find(region => region.id === regionId);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a: District, b: District) => a.id - b.id,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: District, b: District) => a.name.localeCompare(b.name),
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Region',
      dataIndex: 'region_id',
      key: 'region',
      render: (regionId: number) => {
        const region = getRegion(regionId);
        return region ? <Tag color="green">{region.name}</Tag> : 'Unknown';
      },
      filters: regions.map(region => ({ text: region.name, value: region.id })),
      onFilter: (value: number, record: District) => record.region_id === value,
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
      onFilter: (value: number, record: District) => record.status === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: District) => (
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

  const filteredDistricts = searchQuery
    ? districts.filter(
        district =>
          district.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          district.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          district.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : districts;

  return (
    <div className="district-management-container">
      <Card>
        <div className="district-management-header" style={{ marginBottom: 16 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={2}>District Management</Title>
            </Col>
            <Col>
              <Space>
                <Search
                  placeholder="Search districts..."
                  onSearch={handleSearch}
                  style={{ width: 250 }}
                  allowClear
                />
                <Select
                  placeholder="Filter by region"
                  style={{ width: 180 }}
                  allowClear
                  onChange={handleRegionFilterChange}
                >
                  {regions.map(region => (
                    <Select.Option key={region.id} value={region.id}>{region.name}</Select.Option>
                  ))}
                </Select>
                <PermissionGuard requiredPermissions={[Permission.LOCATION_CREATE]}>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={showCreateModal}
                  >
                    Add District
                  </Button>
                </PermissionGuard>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => fetchDistricts()}
                >
                  Refresh
                </Button>
              </Space>
            </Col>
          </Row>
        </div>

        <Tabs
          defaultActiveKey="table"
          items={[
            {
              key: 'table',
              label: (
                <span>
                  <TableOutlined />
                  Districts List
                </span>
              ),
              children: (
                <Table
                  columns={columns}
                  dataSource={filteredDistricts}
                  rowKey="id"
                  loading={loading}
                  pagination={pagination}
                  onChange={handleTableChange}
                />
              ),
            },
          ]}
        />
      </Card>

      {/* Create/Edit District Modal */}
      <Modal
        title={modalType === 'create' ? 'Create New District' : 'Edit District'}
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
                label="District Name"
                rules={[{ required: true, message: 'Please enter district name' }]}
              >
                <Input prefix={<PartitionOutlined />} placeholder="District Name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="code"
                label="Code"
                rules={[{ required: true, message: 'Please enter code' }]}
              >
                <Input placeholder="e.g. BD" />
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
                <Input placeholder="e.g. ba_dinh" />
              </Form.Item>
            </Col>
            <Col span={12}>
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
            <Col span={12}>
              <Form.Item
                name="description_code"
                label="Description Code"
              >
                <Input placeholder="e.g. ba_dinh_desc" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Description"
          >
            <TextArea rows={3} placeholder="District description" />
          </Form.Item>
        </Form>
      </Modal>

      {/* View District Modal */}
      <Modal
        title="District Details"
        open={viewDistrictModalVisible}
        onCancel={() => setViewDistrictModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setViewDistrictModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={700}
      >
        {loading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : viewDistrict ? (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card title="Basic Information">
                  <p><strong>ID:</strong> {viewDistrict.id}</p>
                  <p><strong>Name:</strong> {viewDistrict.name}</p>
                  <p><strong>Code:</strong> <Tag color="blue">{viewDistrict.code}</Tag></p>
                  <p><strong>Name Code:</strong> {viewDistrict.name_code}</p>
                  <p>
                    <strong>Region:</strong> {
                      getRegion(viewDistrict.region_id)?.name || 'Unknown'
                    }
                  </p>
                  <p><strong>Status:</strong>
                    <Tag color={viewDistrict.status === 1 ? 'green' : 'red'} style={{ marginLeft: 8 }}>
                      {viewDistrict.status === 1 ? 'Active' : 'Inactive'}
                    </Tag>
                  </p>
                  <p><strong>Created At:</strong> {new Date(viewDistrict.created_at).toLocaleString()}</p>
                  <p><strong>Updated At:</strong> {new Date(viewDistrict.updated_at).toLocaleString()}</p>
                </Card>
              </Col>
            </Row>
            <Row style={{ marginTop: 16 }}>
              <Col span={24}>
                <Card title="Description">
                  <p>{viewDistrict.description || 'No description available'}</p>
                  <p><strong>Description Code:</strong> {viewDistrict.description_code || 'N/A'}</p>
                </Card>
              </Col>
            </Row>
          </div>
        ) : (
          <p>No district data available</p>
        )}
      </Modal>
    </div>
  );
};

export default DistrictManagement;
