import React, { useState, useEffect } from 'react';
import {
  Table, Button, Space, Typography, Input, Modal, Form, Card, message,
  Row, Col, Tabs, Skeleton, Image, Tag, Select
} from 'antd';
import {
  EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined,
  TableOutlined, ReloadOutlined, SearchOutlined, EnvironmentOutlined
} from '@ant-design/icons';
import { Permission } from '@/utils/permissions';
import { PermissionGuard } from '@/components/common/PermissionGuards';
import {
  Region, getRegions, getRegionById, createRegion, updateRegion, deleteRegion,
  getCountries, Country
} from '@/services/api/locationService';

const { Title, Text } = Typography;
const { Search } = Input;
const { TextArea } = Input;

const RegionManagement: React.FC = () => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingRegion, setEditingRegion] = useState<Region | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'create' | 'edit'>('create');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [form] = Form.useForm();
  const [viewRegionModalVisible, setViewRegionModalVisible] = useState<boolean>(false);
  const [viewRegion, setViewRegion] = useState<Region | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);

  useEffect(() => {
    fetchRegions();
    fetchCountries();
  }, [pagination.current, pagination.pageSize, selectedCountry, searchQuery]);

  const fetchRegions = async () => {
    try {
      setLoading(true);
      const response = await getRegions(
        pagination.current,
        pagination.pageSize,
        selectedCountry || undefined
      );

      // Xử lý kết quả phân trang
      if (response && 'items' in response) {
        // Nếu API đã trả về đúng định dạng phân trang
        setRegions(response.items);
        setPagination({
          ...pagination,
          total: response.total
        });
      } else if (Array.isArray(response)) {
        // Fallback nếu API trả về mảng đơn giản
        setRegions(response);
        setPagination({
          ...pagination,
          total: response.length
        });
      } else {
        // Đảm bảo regions luôn là một mảng hợp lệ
        setRegions([]);
        console.error('Unexpected regions data format:', response);
      }

      setLoading(false);
    } catch (error) {
      message.error('Failed to fetch regions');
      setRegions([]); // Đảm bảo regions luôn là mảng nếu có lỗi
      setLoading(false);
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await getCountries();

      // Xử lý kết quả phân trang từ API getCountries mới
      if (response && 'items' in response) {
        // Nếu API đã trả về đúng định dạng phân trang
        setCountries(response.items);
      } else if (Array.isArray(response)) {
        // Fallback nếu API trả về mảng đơn giản
        setCountries(response);
      } else {
        setCountries([]); // Đảm bảo countries luôn là một mảng
        console.error('Unexpected countries data format:', response);
      }
    } catch (error) {
      message.error('Failed to fetch countries');
      setCountries([]); // Đảm bảo countries luôn là một mảng nếu có lỗi
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
      fetchRegions();
    }
  };

  const handleCountryFilterChange = (countryId: number | null) => {
    setSelectedCountry(countryId);
    setPagination({ ...pagination, current: 1 });
  };

  const showCreateModal = () => {
    form.resetFields();
    setModalType('create');
    setIsModalVisible(true);
  };

  const showEditModal = async (region: Region) => {
    try {
      setLoading(true);
      const detailedRegion = await getRegionById(region.id);
      setEditingRegion(detailedRegion);

      form.setFieldsValue({
        name: detailedRegion.name,
        code: detailedRegion.code,
        name_code: detailedRegion.name_code,
        description: detailedRegion.description,
        description_code: detailedRegion.description_code,
        background_image: detailedRegion.background_image,
        logo: detailedRegion.logo,
        status: detailedRegion.status,
        country_id: detailedRegion.country_id,
      });

      setModalType('edit');
      setIsModalVisible(true);
      setLoading(false);
    } catch (error) {
      message.error('Failed to fetch region details');
      setLoading(false);
    }
  };

  const showViewModal = async (regionId: number) => {
    try {
      setLoading(true);
      const region = await getRegionById(regionId);
      setViewRegion(region);
      setViewRegionModalVisible(true);
      setLoading(false);
    } catch (error) {
      message.error('Failed to fetch region details');
      setLoading(false);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      if (modalType === 'create') {
        await createRegion(values);
        message.success('Region created successfully');
      } else if (modalType === 'edit' && editingRegion) {
        await updateRegion(editingRegion.id, values);
        message.success('Region updated successfully');
      }
      setIsModalVisible(false);
      fetchRegions();
    } catch (error) {
      console.error('Operation failed:', error);
      message.error('Operation failed');
    }
  };

  const handleDelete = async (regionId: number) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this region?',
      content: 'This action cannot be undone and may affect related data.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await deleteRegion(regionId);
          message.success('Region deleted successfully');
          fetchRegions();
        } catch (error) {
          message.error('Failed to delete region');
        }
      },
    });
  };

  const getCountry = (countryId: number) => {
    return countries.find(country => country.id === countryId);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a: Region, b: Region) => a.id - b.id,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Region, b: Region) => a.name.localeCompare(b.name),
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Country',
      dataIndex: 'country_id',
      key: 'country',
      render: (countryId: number) => {
        const country = getCountry(countryId);
        return country ? <Tag color="green">{country.name}</Tag> : 'Unknown';
      },
      filters: countries.map(country => ({ text: country.name, value: country.id })),
      onFilter: (value: number, record: Region) => record.country_id === value,
    },
    {
      title: 'Logo',
      dataIndex: 'logo',
      key: 'logo',
      render: (logo: string) => (
        logo ? <Image src={logo} alt="Logo" width={50} height={30} /> : <Text type="secondary">No logo</Text>
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
      filters: [
        { text: 'Active', value: 1 },
        { text: 'Inactive', value: 0 },
      ],
      onFilter: (value: number, record: Region) => record.status === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Region) => (
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

  const filteredRegions = searchQuery
    ? regions.filter(
        region =>
          region.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          region.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          region.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : regions;

  return (
    <div className="region-management-container">
      <Card>
        <div className="region-management-header" style={{ marginBottom: 16 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={2}>Region Management</Title>
            </Col>
            <Col>
              <Space>
                <Search
                  placeholder="Search regions..."
                  onSearch={handleSearch}
                  style={{ width: 250 }}
                  allowClear
                />
                <Select
                  placeholder="Filter by country"
                  style={{ width: 180 }}
                  allowClear
                  onChange={handleCountryFilterChange}
                >
                  {countries.map(country => (
                    <Select.Option key={country.id} value={country.id}>{country.name}</Select.Option>
                  ))}
                </Select>
                <PermissionGuard requiredPermissions={[Permission.LOCATION_CREATE]}>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={showCreateModal}
                  >
                    Add Region
                  </Button>
                </PermissionGuard>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => fetchRegions()}
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
                  Regions List
                </span>
              ),
              children: (
                <Table
                  columns={columns}
                  dataSource={filteredRegions}
                  rowKey="id"
                  loading={loading}
                  pagination={pagination}
                  onChange={handleTableChange}
                />
              )
            }
          ]}
        />
      </Card>

      {/* Create/Edit Region Modal */}
      <Modal
        title={modalType === 'create' ? 'Create New Region' : 'Edit Region'}
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
                label="Region Name"
                rules={[{ required: true, message: 'Please enter region name' }]}
              >
                <Input prefix={<EnvironmentOutlined />} placeholder="Region Name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="code"
                label="Code"
                rules={[{ required: true, message: 'Please enter code' }]}
              >
                <Input placeholder="e.g. HNI" />
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
                <Input placeholder="e.g. hanoi" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="country_id"
                label="Country"
                rules={[{ required: true, message: 'Please select country' }]}
              >
                <Select placeholder="Select country">
                  {countries.map(country => (
                    <Select.Option key={country.id} value={country.id}>
                      {country.name}
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
                <Input placeholder="e.g. hanoi_desc" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Description"
          >
            <TextArea rows={3} placeholder="Region description" />
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

      {/* View Region Modal */}
      <Modal
        title="Region Details"
        open={viewRegionModalVisible}
        onCancel={() => setViewRegionModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setViewRegionModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={700}
      >
        {loading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : viewRegion ? (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card title="Basic Information">
                  <p><strong>ID:</strong> {viewRegion.id}</p>
                  <p><strong>Name:</strong> {viewRegion.name}</p>
                  <p><strong>Code:</strong> <Tag color="blue">{viewRegion.code}</Tag></p>
                  <p><strong>Name Code:</strong> {viewRegion.name_code}</p>
                  <p>
                    <strong>Country:</strong> {
                      getCountry(viewRegion.country_id)?.name || 'Unknown'
                    }
                  </p>
                  <p><strong>Status:</strong>
                    <Tag color={viewRegion.status === 1 ? 'green' : 'red'} style={{ marginLeft: 8 }}>
                      {viewRegion.status === 1 ? 'Active' : 'Inactive'}
                    </Tag>
                  </p>
                  <p><strong>Created At:</strong> {new Date(viewRegion.created_at).toLocaleString()}</p>
                  <p><strong>Updated At:</strong> {new Date(viewRegion.updated_at).toLocaleString()}</p>
                </Card>
              </Col>
              <Col span={12}>
                <Card title="Media">
                  <div style={{ marginBottom: 16 }}>
                    <p><strong>Logo:</strong></p>
                    {viewRegion.logo ? (
                      <Image src={viewRegion.logo} alt="Logo" width={120} />
                    ) : (
                      <Text type="secondary">No logo available</Text>
                    )}
                  </div>
                  <div>
                    <p><strong>Background Image:</strong></p>
                    {viewRegion.background_image ? (
                      <Image src={viewRegion.background_image} alt="Background" width="100%" />
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
                  <p>{viewRegion.description || 'No description available'}</p>
                  <p><strong>Description Code:</strong> {viewRegion.description_code || 'N/A'}</p>
                </Card>
              </Col>
            </Row>
          </div>
        ) : (
          <p>No region data available</p>
        )}
      </Modal>
    </div>
  );
};

export default RegionManagement;
