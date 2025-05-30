import React, { useState, useEffect } from 'react';
import {
  Table, Button, Space, Typography, Input, Modal, Form, Card, message,
  Row, Col, Tabs, Skeleton, Upload, Image, Tag, Select
} from 'antd';
import {
  EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined, GlobalOutlined,
  TableOutlined, ReloadOutlined, SearchOutlined, UploadOutlined, FlagOutlined
} from '@ant-design/icons';
import { Permission } from '@/utils/permissions';
import { PermissionGuard } from '@/components/common/PermissionGuards';
import {
  Country, getCountries, getCountryById, createCountry,
  updateCountry, deleteCountry, getContinents, Continent
} from '@/services/api/locationService';

const { Title, Text } = Typography;
const { Search } = Input;
const { TextArea } = Input;

const CountryManagement: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [continents, setContinents] = useState<Continent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'create' | 'edit'>('create');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [form] = Form.useForm();
  const [viewCountryModalVisible, setViewCountryModalVisible] = useState<boolean>(false);
  const [viewCountry, setViewCountry] = useState<Country | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [selectedContinent, setSelectedContinent] = useState<number | null>(null);

  useEffect(() => {
    fetchCountries();
    fetchContinents();
  }, [pagination.current, pagination.pageSize, selectedContinent, searchQuery]);

  const fetchCountries = async () => {
    try {
      setLoading(true);
      const response = await getCountries(
        pagination.current,
        pagination.pageSize,
        searchQuery || undefined,
        selectedContinent || undefined
      );

      // Xử lý kết quả phân trang
      if (response && 'items' in response) {
        // Nếu API đã trả về đúng định dạng phân trang
        setCountries(response.items);
        setPagination({
          ...pagination,
          total: response.total
        });
      } else if (Array.isArray(response)) {
        // Fallback nếu API trả về mảng đơn giản
        setCountries(response);
        setPagination({
          ...pagination,
          total: response.length
        });
      }

      setLoading(false);
    } catch (error) {
      message.error('Failed to fetch countries');
      setLoading(false);
    }
  };

  const fetchContinents = async () => {
    try {
      const response = await getContinents();

      // Xử lý kết quả phân trang từ API getContinents() mới
      if (response && 'items' in response) {
        // Nếu API đã trả về đúng định dạng phân trang
        setContinents(response.items);
      } else if (Array.isArray(response)) {
        // Fallback nếu API trả về mảng đơn giản
        setContinents(response);
      } else {
        setContinents([]); // Đảm bảo continents luôn là một mảng
        console.error('Unexpected continents data format:', response);
      }
    } catch (error) {
      message.error('Failed to fetch continents');
      setContinents([]); // Đảm bảo continents luôn là một mảng nếu có lỗi
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
      fetchCountries();
    }
  };

  const handleContinentFilterChange = (continentId: number | null) => {
    setSelectedContinent(continentId);
    setPagination({ ...pagination, current: 1 });
  };

  const showCreateModal = () => {
    form.resetFields();
    setModalType('create');
    setIsModalVisible(true);
  };

  const showEditModal = async (country: Country) => {
    try {
      setLoading(true);
      const detailedCountry = await getCountryById(country.id);
      setEditingCountry(detailedCountry);

      form.setFieldsValue({
        name: detailedCountry.name,
        code: detailedCountry.code,
        name_code: detailedCountry.name_code,
        description: detailedCountry.description,
        description_code: detailedCountry.description_code,
        background_image: detailedCountry.background_image,
        logo: detailedCountry.logo,
        status: detailedCountry.status,
        continent_id: detailedCountry.continent_id,
      });

      setModalType('edit');
      setIsModalVisible(true);
      setLoading(false);
    } catch (error) {
      message.error('Failed to fetch country details');
      setLoading(false);
    }
  };

  const showViewModal = async (countryId: number) => {
    try {
      setLoading(true);
      const country = await getCountryById(countryId);
      setViewCountry(country);
      setViewCountryModalVisible(true);
      setLoading(false);
    } catch (error) {
      message.error('Failed to fetch country details');
      setLoading(false);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      if (modalType === 'create') {
        await createCountry(values);
        message.success('Country created successfully');
      } else if (modalType === 'edit' && editingCountry) {
        await updateCountry(editingCountry.id, values);
        message.success('Country updated successfully');
      }
      setIsModalVisible(false);
      fetchCountries();
    } catch (error) {
      console.error('Operation failed:', error);
      message.error('Operation failed');
    }
  };

  const handleDelete = async (countryId: number) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this country?',
      content: 'This action cannot be undone and may affect related data.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await deleteCountry(countryId);
          message.success('Country deleted successfully');
          fetchCountries();
        } catch (error) {
          message.error('Failed to delete country');
        }
      },
    });
  };

  const getContinent = (continentId: number) => {
    return continents.find(continent => continent.id === continentId);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a: Country, b: Country) => a.id - b.id,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Country, b: Country) => a.name.localeCompare(b.name),
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Continent',
      dataIndex: 'continent_id',
      key: 'continent',
      render: (continentId: number) => {
        const continent = getContinent(continentId);
        return continent ? <Tag color="green">{continent.name}</Tag> : 'Unknown';
      },
      filters: continents.map(continent => ({ text: continent.name, value: continent.id })),
      onFilter: (value: number, record: Country) => record.continent_id === value,
    },
    {
      title: 'Flag',
      dataIndex: 'logo',
      key: 'logo',
      render: (logo: string) => (
        logo ? <Image src={logo} alt="Flag" width={50} height={30} /> : <Text type="secondary">No flag</Text>
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
      onFilter: (value: number, record: Country) => record.status === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Country) => (
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

  const filteredCountries = searchQuery
    ? countries.filter(
        country =>
          country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          country.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          country.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : countries;

  return (
    <div className="country-management-container">
      <Card>
        <div className="country-management-header" style={{ marginBottom: 16 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={2}>Country Management</Title>
            </Col>
            <Col>
              <Space>
                <Search
                  placeholder="Search countries..."
                  onSearch={handleSearch}
                  style={{ width: 250 }}
                  allowClear
                />
                <Select
                  placeholder="Filter by continent"
                  style={{ width: 180 }}
                  allowClear
                  onChange={handleContinentFilterChange}
                >
                  {continents.map(continent => (
                    <Select.Option key={continent.id} value={continent.id}>{continent.name}</Select.Option>
                  ))}
                </Select>
                <PermissionGuard requiredPermissions={[Permission.LOCATION_CREATE]}>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={showCreateModal}
                  >
                    Add Country
                  </Button>
                </PermissionGuard>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => fetchCountries()}
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
                  Countries List
                </span>
              ),
              children: (
                <Table
                  columns={columns}
                  dataSource={filteredCountries}
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

      {/* Create/Edit Country Modal */}
      <Modal
        title={modalType === 'create' ? 'Create New Country' : 'Edit Country'}
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
                label="Country Name"
                rules={[{ required: true, message: 'Please enter country name' }]}
              >
                <Input prefix={<FlagOutlined />} placeholder="Country Name" />
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
                <Input placeholder="e.g. VN" style={{ textTransform: 'uppercase' }} />
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
                <Input placeholder="e.g. vietnam" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="continent_id"
                label="Continent"
                rules={[{ required: true, message: 'Please select continent' }]}
              >
                <Select placeholder="Select continent">
                  {continents.map(continent => (
                    <Select.Option key={continent.id} value={continent.id}>
                      {continent.name}
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
                <Input placeholder="e.g. vietnam_desc" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Description"
          >
            <TextArea rows={3} placeholder="Country description" />
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
                label="Flag URL"
              >
                <Input placeholder="https://example.com/flag.png" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* View Country Modal */}
      <Modal
        title="Country Details"
        open={viewCountryModalVisible}
        onCancel={() => setViewCountryModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setViewCountryModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={700}
      >
        {loading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : viewCountry ? (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card title="Basic Information">
                  <p><strong>ID:</strong> {viewCountry.id}</p>
                  <p><strong>Name:</strong> {viewCountry.name}</p>
                  <p><strong>Code:</strong> <Tag color="blue">{viewCountry.code}</Tag></p>
                  <p><strong>Name Code:</strong> {viewCountry.name_code}</p>
                  <p>
                    <strong>Continent:</strong> {
                      getContinent(viewCountry.continent_id)?.name || 'Unknown'
                    }
                  </p>
                  <p><strong>Status:</strong>
                    <Tag color={viewCountry.status === 1 ? 'green' : 'red'} style={{ marginLeft: 8 }}>
                      {viewCountry.status === 1 ? 'Active' : 'Inactive'}
                    </Tag>
                  </p>
                  <p><strong>Created At:</strong> {new Date(viewCountry.created_at).toLocaleString()}</p>
                  <p><strong>Updated At:</strong> {new Date(viewCountry.updated_at).toLocaleString()}</p>
                </Card>
              </Col>
              <Col span={12}>
                <Card title="Media">
                  <div style={{ marginBottom: 16 }}>
                    <p><strong>Flag:</strong></p>
                    {viewCountry.logo ? (
                      <Image src={viewCountry.logo} alt="Flag" width={120} />
                    ) : (
                      <Text type="secondary">No flag available</Text>
                    )}
                  </div>
                  <div>
                    <p><strong>Background Image:</strong></p>
                    {viewCountry.background_image ? (
                      <Image src={viewCountry.background_image} alt="Background" width="100%" />
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
                  <p>{viewCountry.description || 'No description available'}</p>
                  <p><strong>Description Code:</strong> {viewCountry.description_code || 'N/A'}</p>
                </Card>
              </Col>
            </Row>
          </div>
        ) : (
          <p>No country data available</p>
        )}
      </Modal>
    </div>
  );
};

export default CountryManagement;
