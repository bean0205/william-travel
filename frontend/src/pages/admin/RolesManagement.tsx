// filepath: /Users/williamnguyen/Documents/william travel/frontend/src/pages/admin/RolesManagement.tsx
import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, Typography, Input, Tabs, Card, Spin, message } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  KeyOutlined,
  BarChartOutlined,
  TableOutlined,
  LockOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Permission } from '@/utils/permissions';
import { PermissionGuard } from '@/components/common/PermissionGuards';
import RoleStatistics from '@/components/admin/RoleStatistics';
import RoleForm from '@/components/admin/RoleForm';
import { getRoles, createRole, updateRole, deleteRole, getPermissions, Role } from '@/services/api/roleService';

const { Search } = Input;
const { TabPane } = Tabs;

// Mock roles data
const mockRoles = [
  {
    id: '1',
    name: 'Administrator',
    description: 'Full system access with all permissions',
    permissionIds: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    isSystem: true,
    createdAt: '2025-01-01T10:00:00Z',
    updatedAt: '2025-01-01T10:00:00Z',
    userCount: 3
  },
  {
    id: '2',
    name: 'Content Manager',
    description: 'Can create and manage all content',
    permissionIds: ['1', '2', '3', '4', '5'],
    isSystem: true,
    createdAt: '2025-01-01T10:00:00Z',
    updatedAt: '2025-01-01T10:00:00Z',
    userCount: 8
  },
  {
    id: '3',
    name: 'Guide',
    description: 'Can create and manage their own content and trips',
    permissionIds: ['1', '3', '5'],
    isSystem: true,
    createdAt: '2025-01-01T10:00:00Z',
    updatedAt: '2025-01-01T10:00:00Z',
    userCount: 25
  },
  {
    id: '4',
    name: 'Support Agent',
    description: 'Can view and respond to support tickets',
    permissionIds: ['7', '8'],
    isSystem: false,
    createdAt: '2025-02-15T14:30:00Z',
    updatedAt: '2025-02-15T14:30:00Z',
    userCount: 12
  },
  {
    id: '5',
    name: 'Event Manager',
    description: 'Can create and manage events',
    permissionIds: ['1', '6', '10'],
    isSystem: false,
    createdAt: '2025-03-10T09:15:00Z',
    updatedAt: '2025-03-10T09:15:00Z',
    userCount: 6
  }
];

// Mock permissions data
const mockPermissions = [
  {
    id: '1',
    name: 'Read Content',
    description: 'Can view all content',
    category: 'Content',
    code: 'content:read'
  },
  {
    id: '2',
    name: 'Create Content',
    description: 'Can create new content',
    category: 'Content',
    code: 'content:create'
  },
  {
    id: '3',
    name: 'Edit Content',
    description: 'Can edit existing content',
    category: 'Content',
    code: 'content:edit'
  },
  {
    id: '4',
    name: 'Delete Content',
    description: 'Can delete content',
    category: 'Content',
    code: 'content:delete'
  },
  {
    id: '5',
    name: 'Publish Content',
    description: 'Can publish or unpublish content',
    category: 'Content',
    code: 'content:publish'
  },
  {
    id: '6',
    name: 'Manage Events',
    description: 'Can create, edit, and delete events',
    category: 'Events',
    code: 'event:manage'
  },
  {
    id: '7',
    name: 'View Support Tickets',
    description: 'Can view support tickets',
    category: 'Support',
    code: 'support:read'
  },
  {
    id: '8',
    name: 'Respond To Support',
    description: 'Can respond to support tickets',
    category: 'Support',
    code: 'support:respond'
  },
  {
    id: '9',
    name: 'Manage Users',
    description: 'Can manage user accounts',
    category: 'User Management',
    code: 'user:manage'
  },
  {
    id: '10',
    name: 'Manage Media',
    description: 'Can upload and manage media files',
    category: 'Media',
    code: 'media:manage'
  },
  {
    id: '11',
    name: 'Manage Roles',
    description: 'Can create, edit, and delete roles',
    category: 'Access Control',
    code: 'role:manage'
  },
  {
    id: '12',
    name: 'View System Settings',
    description: 'Can view system settings',
    category: 'System',
    code: 'system:view'
  }
];

interface RoleStats {
  totalRoles: number;
  systemRoles: number;
  customRoles: number;
  totalPermissions: number;
  usersCountByRole: Array<{ name: string; value: number }>;
  permissionsByCategory: Array<{ name: string; value: number }>;
  permissionsUsage: Array<{ name: string; value: number }>;
  mostPowerfulRoles: Array<{ name: string; permissionCount: number }>;
}

const RolesManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('table');
  const [formLoading, setFormLoading] = useState(false);

  // Statistics state
  const [stats, setStats] = useState<RoleStats>({
    totalRoles: 0,
    systemRoles: 0,
    customRoles: 0,
    totalPermissions: 0,
    usersCountByRole: [],
    permissionsByCategory: [],
    permissionsUsage: [],
    mostPowerfulRoles: [],
  });

  useEffect(() => {
    fetchRolesAndPermissions();
  }, []);

  const fetchRolesAndPermissions = async () => {
    try {
      setIsLoading(true);
      // In a real app, replace this with API calls:
      // const rolesData = await getRoles();
      // const permissionsData = await getPermissions();
      const rolesData = mockRoles as Role[];
      const permissionsData = mockPermissions as Permission[];

      setRoles(rolesData);
      setPermissions(permissionsData);

      // Calculate statistics
      calculateStatistics(rolesData, permissionsData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching roles and permissions:', error);
      message.error('Failed to fetch roles and permissions');
      setIsLoading(false);
    }
  };

  const calculateStatistics = (rolesData: Role[], permissionsData: Permission[]) => {
    // Count system and custom roles
    const systemRolesCount = rolesData.filter(role => role.isSystem).length;
    const customRolesCount = rolesData.filter(role => !role.isSystem).length;

    // Users by role
    const usersCountByRole = rolesData.map(role => ({
      name: role.name,
      value: role.userCount || 0
    }));

    // Permissions by category
    const categoryMap = new Map();
    permissionsData.forEach(permission => {
      const category = permission.category || 'Uncategorized';
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    });

    const permissionsByCategory = Array.from(categoryMap.entries()).map(([name, value]) => ({
      name,
      value,
    }));

    // Permission usage count
    const permissionUsageCount = new Map();
    permissionsData.forEach(permission => {
      let count = 0;
      rolesData.forEach(role => {
        if (role.permissionIds?.includes(permission.id)) {
          count += 1;
        }
      });
      permissionUsageCount.set(permission.name, count);
    });

    const permissionsUsage = Array.from(permissionUsageCount.entries())
      .sort((a, b) => b[1] as number - (a[1] as number))
      .map(([name, value]) => ({
        name,
        value,
      }));

    // Most powerful roles (by permission count)
    const mostPowerfulRoles = rolesData
      .map(role => ({
        name: role.name,
        permissionCount: role.permissionIds?.length || 0
      }))
      .sort((a, b) => b.permissionCount - a.permissionCount);

    setStats({
      totalRoles: rolesData.length,
      systemRoles: systemRolesCount,
      customRoles: customRolesCount,
      totalPermissions: permissionsData.length,
      usersCountByRole,
      permissionsByCategory,
      permissionsUsage,
      mostPowerfulRoles,
    });
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleCreateRole = () => {
    setSelectedRole(null);
    setIsModalVisible(true);
  };

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setIsModalVisible(true);
  };

  const handleDeleteRole = async (id: string) => {
    const roleToDelete = roles.find(role => role.id === id);

    if (roleToDelete?.isSystem) {
      message.error('System roles cannot be deleted');
      return;
    }

    try {
      // In a real app: await deleteRole(id);
      setRoles(roles.filter(role => role.id !== id));
      message.success('Role deleted successfully');

      // Recalculate stats
      calculateStatistics(roles.filter(role => role.id !== id), permissions);
    } catch (error) {
      console.error('Error deleting role:', error);
      message.error('Failed to delete role');
    }
  };

  const handleFormSubmit = async (roleData: Partial<Role>) => {
    try {
      setFormLoading(true);

      if (selectedRole) {
        // Update existing role
        // In a real app: await updateRole(selectedRole.id, roleData);
        const updatedRoles = roles.map(role =>
          role.id === selectedRole.id ? { ...role, ...roleData } : role
        );
        setRoles(updatedRoles);
        message.success('Role updated successfully');

        // Recalculate stats
        calculateStatistics(updatedRoles, permissions);
      } else {
        // Create new role
        // In a real app: const newRole = await createRole(roleData);
        const newRole = {
          id: String(roles.length + 1),
          ...roleData,
          isSystem: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userCount: 0
        } as Role;

        const updatedRoles = [...roles, newRole];
        setRoles(updatedRoles);
        message.success('Role created successfully');

        // Recalculate stats
        calculateStatistics(updatedRoles, permissions);
      }

      setIsModalVisible(false);
      setFormLoading(false);
    } catch (error) {
      console.error('Error saving role:', error);
      message.error('Failed to save role');
      setFormLoading(false);
    }
  };

  const getPermissionNames = (permissionIds: string[] = []) => {
    return permissions
      .filter(p => permissionIds.includes(p.id))
      .slice(0, 3)
      .map(p => p.name)
      .join(', ') + (permissionIds.length > 3 ? ` +${permissionIds.length - 3} more` : '');
  };

  const columns = [
    {
      title: 'Role Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Role) => (
        <div>
          <div className="font-medium flex items-center">
            {name}
            {record.isSystem && <Tag color="blue" className="ml-2">System</Tag>}
          </div>
          <div className="text-gray-500 text-sm">{record.description}</div>
        </div>
      ),
    },
    {
      title: 'Permissions',
      key: 'permissions',
      render: (text: string, record: Role) => (
        <div>
          <span>{getPermissionNames(record.permissionIds)}</span>
          <div className="text-gray-500 text-sm">
            {record.permissionIds?.length || 0} permission(s)
          </div>
        </div>
      ),
    },
    {
      title: 'Users',
      dataIndex: 'userCount',
      key: 'userCount',
      render: (count: number) => (
        <div className="flex items-center">
          <UserOutlined className="mr-2" />
          {count}
        </div>
      ),
      sorter: (a: Role, b: Role) => (a.userCount || 0) - (b.userCount || 0),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: string, record: Role) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditRole(record)}
            type="link"
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteRole(record.id || '')}
            type="link"
            danger
            disabled={record.isSystem}
            title={record.isSystem ? 'System roles cannot be deleted' : ''}
          />
        </Space>
      ),
    },
  ];

  const filteredRoles = roles.filter(role => {
    const matchesSearch =
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  return (
    <div className="p-6">
      <Typography.Title level={2}>
        <LockOutlined /> Role & Permission Management
      </Typography.Title>

      <Tabs activeKey={activeTab} onChange={setActiveTab} className="mb-6">
        <TabPane
          tab={<span><TableOutlined /> Roles List</span>}
          key="table"
        >
          <div className="mb-4 flex justify-between flex-wrap">
            <Search
              placeholder="Search roles by name"
              onSearch={handleSearch}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: 300, marginBottom: 16 }}
            />

            <PermissionGuard permission={Permission.ManageRoles}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreateRole}
              >
                Add Role
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
              dataSource={filteredRoles}
              rowKey="id"
              pagination={{
                current: currentPage,
                onChange: (page) => setCurrentPage(page),
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} roles`,
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
            <RoleStatistics stats={stats} />
          )}
        </TabPane>
      </Tabs>

      {/* Role Form Modal */}
      {isModalVisible && (
        <Card
          title={selectedRole ? `Edit Role: ${selectedRole.name}` : "Create Role"}
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
          <RoleForm
            role={selectedRole || undefined}
            permissions={permissions}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsModalVisible(false)}
            loading={formLoading}
          />
        </Card>
      )}
    </div>
  );
};

export default RolesManagement;
