import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, Typography, Input, Avatar, Tabs, Card, Spin, message } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  UserOutlined,
  BarChartOutlined,
  TableOutlined
} from '@ant-design/icons';
import { Permission } from '@/utils/permissions';
import { PermissionGuard } from '@/components/common/PermissionGuards';
import UserStatistics from '@/components/admin/UserStatistics';
import UserForm from '@/components/admin/UserForm';
import { getUsers, createUser, updateUser, deleteUser, User } from '@/services/api/userService';
import { getRoles } from '@/services/api/roleService';

const { Search } = Input;
const { TabPane } = Tabs;

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  verifiedUsers: number;
  usersByRole: Array<{ name: string; value: number }>;
  usersByStatus: Array<{ name: string; value: number }>;
  usersByCountry: Array<{ name: string; value: number }>;
  userRegistrations: Array<{ date: string; count: number }>;
  loginActivity: Array<{ date: string; count: number }>;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('table');
  const [formLoading, setFormLoading] = useState(false);
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    activeUsers: 0,
    newUsersThisMonth: 0,
    verifiedUsers: 0,
    usersByRole: [],
    usersByStatus: [],
    usersByCountry: [],
    userRegistrations: [],
    loginActivity: [],
  });

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, [currentPage, pageSize]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data = await getUsers({
        skip: (currentPage - 1) * pageSize,
        limit: pageSize
      });

      if (Array.isArray(data)) {
        setUsers(data);
        setTotalItems(data.length);
      } else if (data && Array.isArray(data.items)) {
        setUsers(data.items);
        setTotalItems(data.total || data.items.length);
      } else {
        setUsers([]);
        setTotalItems(0);
      }

      calculateStatistics(Array.isArray(data) ? data : (data?.items || []));
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Failed to fetch users');
      setIsLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const rolesData = await getRoles();
      if (Array.isArray(rolesData)) {
        setRoles(rolesData);
      } else if (rolesData && Array.isArray(rolesData.items)) {
        setRoles(rolesData.items);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const calculateStatistics = (data: User[]) => {
    const activeCount = data.filter(user => user.is_active).length;
    const verifiedCount = data.filter(user => user.is_active).length;

    const roleMap = new Map();
    data.forEach(user => {
      const role = user.role || 'unknown';
      roleMap.set(role, (roleMap.get(role) || 0) + 1);
    });

    const roleStats = Array.from(roleMap.entries()).map(([name, value]) => ({
      name,
      value,
    }));

    const statusMap = new Map([
      ['active', data.filter(user => user.is_active).length],
      ['inactive', data.filter(user => !user.is_active).length]
    ]);

    const statusStats = Array.from(statusMap.entries()).map(([name, value]) => ({
      name,
      value,
    }));

    const countryMap = new Map();
    data.forEach(user => {
      const country = 'Unknown';
      countryMap.set(country, (countryMap.get(country) || 0) + 1);
    });

    const countryStats = Array.from(countryMap.entries()).map(([name, value]) => ({
      name,
      value,
    }));

    const registrationMap = new Map();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    data.forEach(user => {
      if (user.created_at) {
        const date = new Date(user.created_at);
        const monthName = months[date.getMonth()];
        registrationMap.set(monthName, (registrationMap.get(monthName) || 0) + 1);
      }
    });

    const registrationData = months.map(month => ({
      date: month,
      count: registrationMap.get(month) || 0,
    }));

    const loginActivity = [
      { date: '05-01', count: 42 },
      { date: '05-02', count: 38 },
      { date: '05-03', count: 45 },
      { date: '05-04', count: 50 },
      { date: '05-05', count: 55 },
      { date: '05-06', count: 48 },
      { date: '05-07', count: 52 },
    ];

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const newUsersThisMonth = data.filter(user => {
      if (!user.created_at) return false;
      const creationDate = new Date(user.created_at);
      return creationDate.getMonth() === currentMonth && creationDate.getFullYear() === currentYear;
    }).length;

    setStats({
      totalUsers: totalItems,
      activeUsers: activeCount,
      newUsersThisMonth,
      verifiedUsers: verifiedCount,
      usersByRole: roleStats,
      usersByStatus: statusStats,
      usersByCountry: countryStats,
      userRegistrations: registrationData,
      loginActivity: loginActivity,
    });
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
    const filtered = users.filter(user =>
      user.full_name?.toLowerCase().includes(value.toLowerCase()) ||
      user.email?.toLowerCase().includes(value.toLowerCase())
    );
    calculateStatistics(filtered);
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsModalVisible(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  const handleDeleteUser = async (id: number) => {
    try {
      await deleteUser(id);
      message.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      console.error(`Error deleting user with ID ${id}:`, error);
      message.error('Failed to delete user');
    }
  };

  const handleFormSubmit = async (userData: Partial<User>) => {
    try {
      setFormLoading(true);

      if (selectedUser) {
        await updateUser(selectedUser.id, userData);
        message.success('User updated successfully');
      } else {
        await createUser(userData as any);
        message.success('User created successfully');
      }

      setIsModalVisible(false);
      setFormLoading(false);
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      message.error('Failed to save user');
      setFormLoading(false);
    }
  };

  const handleRoleFilter = (role: string | null) => {
    setRoleFilter(role);
    setCurrentPage(1);
  };

  const columns = [
    {
      title: 'User',
      key: 'user',
      render: (text: string, record: User) => (
        <div className="flex items-center">
          <Avatar
            icon={<UserOutlined />}
            src={record.avatar}
            className="mr-2"
          />
          <div>
            <div className="font-medium">{record.full_name}</div>
            <div className="text-gray-500 text-sm">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => {
        let color = 'default';
        switch (role) {
          case 'admin':
            color = 'red';
            break;
          case 'moderator':
            color = 'orange';
            break;
          case 'guide':
            color = 'green';
            break;
          case 'partner':
            color = 'purple';
            break;
          default:
            color = 'blue';
        }
        return <Tag color={color}>{role}</Tag>;
      },
      filters: roles.map(role => ({ text: role.name, value: role.name })),
      onFilter: (value: string, record: User) => record.role === value,
    },
    {
      title: 'Status',
      key: 'status',
      render: (text: string, record: User) => (
        <Tag color={record.is_active ? 'green' : 'red'}>
          {record.is_active ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Admin',
      key: 'is_superuser',
      render: (text: string, record: User) => (
        record.is_superuser && <Tag color="purple">Superuser</Tag>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: string, record: User) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditUser(record)}
            type="link"
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteUser(record.id)}
            type="link"
            danger
          />
        </Space>
      ),
    },
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm ?
      (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) :
      true;

    const matchesRole = roleFilter ? user.role === roleFilter : true;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="p-6">
      <Typography.Title level={2}>
        <UserOutlined /> User Management
      </Typography.Title>

      <Tabs activeKey={activeTab} onChange={setActiveTab} className="mb-6">
        <TabPane
          tab={<span><TableOutlined /> Users List</span>}
          key="table"
        >
          <div className="mb-4 flex justify-between flex-wrap">
            <Search
              placeholder="Search users by name or email"
              onSearch={handleSearch}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: 300, marginBottom: 16 }}
            />

            <PermissionGuard permission={Permission.CreateUser}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreateUser}
              >
                Add User
              </Button>
            </PermissionGuard>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-60">
              <Spin size="large" />
            </div>
          ) : (
            <Table
              columns={columns}
              dataSource={filteredUsers}
              rowKey="id"
              pagination={{
                current: currentPage,
                onChange: (page) => setCurrentPage(page),
                pageSize: pageSize,
                total: totalItems,
                showSizeChanger: true,
                onShowSizeChange: (current, size) => {
                  setCurrentPage(1);
                  setPageSize(size);
                },
                showTotal: (total) => `Total ${total} users`,
              }}
            />
          )}
        </TabPane>
        <TabPane
          tab={<span><BarChartOutlined /> Statistics</span>}
          key="statistics"
        >
          {isLoading ? (
            <div className="flex justify-center items-center h-60">
              <Spin size="large" />
            </div>
          ) : (
            <UserStatistics stats={stats} />
          )}
        </TabPane>
      </Tabs>

      {isModalVisible && (
        <Card
          title={selectedUser ? "Edit User" : "Create User"}
          className="fixed inset-0 z-50 w-full md:w-3/4 lg:w-2/3 xl:w-1/2 mx-auto my-16 overflow-auto"
          extra={
            <Button
              type="text"
              onClick={() => setIsModalVisible(false)}
            >
              Close
            </Button>
          }
        >
          <UserForm
            user={selectedUser || undefined}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsModalVisible(false)}
            loading={formLoading}
          />
        </Card>
      )}
    </div>
  );
};

export default UserManagement;

