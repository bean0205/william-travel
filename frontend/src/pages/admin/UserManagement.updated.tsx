import React, { useState, useEffect } from 'react';
import {
  Table, Button, Space, Tag, Typography, Input, Modal, Form,
  Select, Switch, message, Card, Tabs, Row, Col, Skeleton
} from 'antd';
import {
  EditOutlined, DeleteOutlined, PlusOutlined, UserOutlined, EyeOutlined,
  BarChartOutlined, TableOutlined, SearchOutlined, ReloadOutlined
} from '@ant-design/icons';
import { User, getUsers, getUserById, createUser, updateUser, deleteUser } from '@/services/api/userService';
import { Role, getRoles } from '@/services/api/roleService';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Search } = Input;

const UserManagement: React.FC = () => {
  // State
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'create' | 'edit'>('create');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [viewUserModalVisible, setViewUserModalVisible] = useState<boolean>(false);
  const [viewUser, setViewUser] = useState<User | null>(null);

  // Fetch users and roles
  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const skip = (pagination.current - 1) * pagination.pageSize;
      const data = await getUsers(skip, pagination.pageSize);
      setUsers(data);
      setPagination({ ...pagination, total: data.length * 10 }); // Just a placeholder, actual backend should return total count
      setLoading(false);
    } catch (error) {
      message.error('Failed to fetch users');
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const data = await getRoles();
      setRoles(data);
    } catch (error) {
      message.error('Failed to fetch roles');
    }
  };

  const handleTableChange = (newPagination: any) => {
    setPagination({
      ...pagination,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
    fetchUsers();
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    // In a real app, you would call fetchUsers with the search parameter
    // For now, we'll just filter locally
    if (value.trim() === '') {
      fetchUsers();
    }
  };

  const showCreateModal = () => {
    form.resetFields();
    setModalType('create');
    setIsModalVisible(true);
  };

  const showEditModal = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue({
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      is_active: user.is_active,
      is_superuser: user.is_superuser,
    });
    setModalType('edit');
    setIsModalVisible(true);
  };

  const showViewModal = async (userId: number) => {
    try {
      setLoading(true);
      const user = await getUserById(userId);
      setViewUser(user);
      setViewUserModalVisible(true);
      setLoading(false);
    } catch (error) {
      message.error('Failed to fetch user details');
      setLoading(false);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (modalType === 'create') {
        await createUser({
          ...values,
          password: values.password || 'defaultPassword123', // In real app, you might want to generate a random password
        });
        message.success('User created successfully');
      } else if (modalType === 'edit' && editingUser) {
        await updateUser(editingUser.id, values);
        message.success('User updated successfully');
      }
      setIsModalVisible(false);
      fetchUsers();
    } catch (error) {
      message.error('Operation failed');
    }
  };

  const handleDelete = async (userId: number) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this user?',
      content: 'This action cannot be undone',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await deleteUser(userId);
          message.success('User deleted successfully');
          fetchUsers();
        } catch (error) {
          message.error('Failed to delete user');
        }
      },
    });
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a: User, b: User) => a.id - b.id,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a: User, b: User) => a.email.localeCompare(b.email),
    },
    {
      title: 'Name',
      dataIndex: 'full_name',
      key: 'full_name',
      sorter: (a: User, b: User) => a.full_name.localeCompare(b.full_name),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={role === 'admin' ? 'red' : role === 'moderator' ? 'blue' : 'green'}>
          {role.toUpperCase()}
        </Tag>
      ),
      filters: roles.map(role => ({ text: role.name, value: role.name })),
      onFilter: (value: string, record: User) => record.role === value,
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'status',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'ACTIVE' : 'INACTIVE'}
        </Tag>
      ),
      filters: [
        { text: 'Active', value: true },
        { text: 'Inactive', value: false },
      ],
      onFilter: (value: boolean, record: User) => record.is_active === value,
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: (a: User, b: User) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: User) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => showViewModal(record.id)}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  const filteredUsers = searchQuery
    ? users.filter(
        user =>
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.full_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : users;

  return (
    <div className="user-management-container">
      <Card>
        <div className="user-management-header" style={{ marginBottom: 16 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={2}>User Management</Title>
            </Col>
            <Col>
              <Space>
                <Search
                  placeholder="Search users..."
                  onSearch={handleSearch}
                  style={{ width: 250 }}
                  allowClear
                />
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={showCreateModal}
                >
                  Add User
                </Button>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => fetchUsers()}
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
                User List
              </span>
            }
            key="table"
          >
            <Table
              columns={columns}
              dataSource={filteredUsers}
              rowKey="id"
              loading={loading}
              pagination={pagination}
              onChange={handleTableChange}
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
            <div className="statistics-content">
              <Row gutter={[16, 16]}>
                <Col span={6}>
                  <Card>
                    <Skeleton loading={loading} active>
                      <Title level={4}>Total Users</Title>
                      <Title level={2}>{users.length}</Title>
                    </Skeleton>
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Skeleton loading={loading} active>
                      <Title level={4}>Active Users</Title>
                      <Title level={2}>{users.filter(u => u.is_active).length}</Title>
                    </Skeleton>
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Skeleton loading={loading} active>
                      <Title level={4}>Admins</Title>
                      <Title level={2}>{users.filter(u => u.role === 'admin').length}</Title>
                    </Skeleton>
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Skeleton loading={loading} active>
                      <Title level={4}>Regular Users</Title>
                      <Title level={2}>{users.filter(u => u.role === 'user').length}</Title>
                    </Skeleton>
                  </Card>
                </Col>
              </Row>
              {/* Add more statistics components here if needed */}
            </div>
          </TabPane>
        </Tabs>
      </Card>

      {/* Create/Edit User Modal */}
      <Modal
        title={modalType === 'create' ? 'Create New User' : 'Edit User'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>

          {modalType === 'create' && (
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Please enter password' }]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>
          )}

          <Form.Item
            name="full_name"
            label="Full Name"
            rules={[{ required: true, message: 'Please enter full name' }]}
          >
            <Input placeholder="Full Name" />
          </Form.Item>

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please select role' }]}
          >
            <Select placeholder="Select role">
              {roles.map(role => (
                <Select.Option key={role.id} value={role.name}>{role.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="is_active"
            label="Active"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name="is_superuser"
            label="Superuser"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>

      {/* View User Modal */}
      <Modal
        title="User Details"
        open={viewUserModalVisible}
        onCancel={() => setViewUserModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setViewUserModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={600}
      >
        {loading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : viewUser ? (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card title="Basic Information">
                  <p><strong>ID:</strong> {viewUser.id}</p>
                  <p><strong>Email:</strong> {viewUser.email}</p>
                  <p><strong>Full Name:</strong> {viewUser.full_name}</p>
                  <p><strong>Role:</strong> {viewUser.role}</p>
                  <p>
                    <strong>Status:</strong>
                    <Tag color={viewUser.is_active ? 'green' : 'red'} style={{ marginLeft: 8 }}>
                      {viewUser.is_active ? 'ACTIVE' : 'INACTIVE'}
                    </Tag>
                  </p>
                  <p>
                    <strong>Superuser:</strong>
                    <Tag color={viewUser.is_superuser ? 'red' : 'default'} style={{ marginLeft: 8 }}>
                      {viewUser.is_superuser ? 'YES' : 'NO'}
                    </Tag>
                  </p>
                  <p><strong>Created At:</strong> {new Date(viewUser.created_at).toLocaleString()}</p>
                  <p><strong>Updated At:</strong> {new Date(viewUser.updated_at).toLocaleString()}</p>
                </Card>
              </Col>
            </Row>
          </div>
        ) : (
          <p>No user data available</p>
        )}
      </Modal>
    </div>
  );
};

export default UserManagement;
