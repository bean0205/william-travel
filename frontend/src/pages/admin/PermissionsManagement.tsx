// filepath: /Users/williamnguyen/Documents/william travel/frontend/src/pages/admin/PermissionsManagement.tsx
import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, Typography, Input, Tabs, Card, Spin, message } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SafetyOutlined,
  BarChartOutlined,
  TableOutlined,
  LockOutlined
} from '@ant-design/icons';
import { Permission } from '@/utils/permissions';
import { PermissionGuard } from '@/components/common/PermissionGuards';
import PermissionStatistics from '@/components/admin/PermissionStatistics';
import PermissionForm from '@/components/admin/PermissionForm';
import { getPermissions, createPermission, updatePermission, deletePermission } from '@/services/api/roleService';

const { Search } = Input;
const { TabPane } = Tabs;

// Mock permissions data
const mockPermissions = [
  {
    id: '1',
    name: 'Read Content',
    description: 'Can view all content',
    category: 'Content',
    code: 'content:read',
    isSystem: true,
    createdAt: '2025-01-01T10:00:00Z',
    updatedAt: '2025-01-01T10:00:00Z',
    roleCount: 5
  },
  {
    id: '2',
    name: 'Create Content',
    description: 'Can create new content',
    category: 'Content',
    code: 'content:create',
    isSystem: true,
    createdAt: '2025-01-01T10:00:00Z',
    updatedAt: '2025-01-01T10:00:00Z',
    roleCount: 3
  },
  {
    id: '3',
    name: 'Edit Content',
    description: 'Can edit existing content',
    category: 'Content',
    code: 'content:edit',
    isSystem: true,
    createdAt: '2025-01-01T10:00:00Z',
    updatedAt: '2025-01-01T10:00:00Z',
    roleCount: 3
  },
  {
    id: '4',
    name: 'Delete Content',
    description: 'Can delete content',
    category: 'Content',
    code: 'content:delete',
    isSystem: true,
    createdAt: '2025-01-01T10:00:00Z',
    updatedAt: '2025-01-01T10:00:00Z',
    roleCount: 1
  },
  {
    id: '5',
    name: 'Publish Content',
    description: 'Can publish or unpublish content',
    category: 'Content',
    code: 'content:publish',
    isSystem: true,
    createdAt: '2025-01-01T10:00:00Z',
    updatedAt: '2025-01-01T10:00:00Z',
    roleCount: 2
  },
  {
    id: '6',
    name: 'Manage Events',
    description: 'Can create, edit, and delete events',
    category: 'Events',
    code: 'event:manage',
    isSystem: true,
    createdAt: '2025-01-01T10:00:00Z',
    updatedAt: '2025-01-01T10:00:00Z',
    roleCount: 2
  },
  {
    id: '7',
    name: 'View Support Tickets',
    description: 'Can view support tickets',
    category: 'Support',
    code: 'support:read',
    isSystem: true,
    createdAt: '2025-01-01T10:00:00Z',
    updatedAt: '2025-01-01T10:00:00Z',
    roleCount: 2
  },
  {
    id: '8',
    name: 'Respond To Support',
    description: 'Can respond to support tickets',
    category: 'Support',
    code: 'support:respond',
    isSystem: true,
    createdAt: '2025-01-01T10:00:00Z',
    updatedAt: '2025-01-01T10:00:00Z',
    roleCount: 2
  },
  {
    id: '9',
    name: 'Export Support Data',
    description: 'Can export support ticket data',
    category: 'Support',
    code: 'support:export',
    isSystem: false,
    createdAt: '2025-02-15T14:30:00Z',
    updatedAt: '2025-02-15T14:30:00Z',
    roleCount: 1
  },
  {
    id: '10',
    name: 'Analytics View',
    description: 'Can view analytics data',
    category: 'Analytics',
    code: 'analytics:view',
    isSystem: false,
    createdAt: '2025-03-10T09:15:00Z',
    updatedAt: '2025-03-10T09:15:00Z',
    roleCount: 2
  },
  {
    id: '11',
    name: 'Analytics Export',
    description: 'Can export analytics data',
    category: 'Analytics',
    code: 'analytics:export',
    isSystem: false,
    createdAt: '2025-03-11T11:25:00Z',
    updatedAt: '2025-03-11T11:25:00Z',
    roleCount: 1
  },
  {
    id: '12',
    name: 'User Management',
    description: 'Can manage user accounts',
    category: 'Users',
    code: 'user:manage',
    isSystem: true,
    createdAt: '2025-01-01T10:00:00Z',
    updatedAt: '2025-01-01T10:00:00Z',
    roleCount: 1
  }
];

interface PermissionStats {
  totalPermissions: number;
  systemPermissions: number;
  customPermissions: number;
  unusedPermissions: number;
  permissionsByCategory: Array<{ name: string; value: number }>;
  mostAssignedPermissions: Array<{ name: string; value: number }>;
  permissionsByRole: Array<{ name: string; value: number }>;
  permissionsCreatedByMonth: Array<{ month: string; count: number }>;
}

const PermissionsManagement: React.FC = () => {
  const [permissions, setPermissions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPermission, setSelectedPermission] = useState<any | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('table');
  const [formLoading, setFormLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  // Statistics state
  const [stats, setStats] = useState<PermissionStats>({
    totalPermissions: 0,
    systemPermissions: 0,
    customPermissions: 0,
    unusedPermissions: 0,
    permissionsByCategory: [],
    mostAssignedPermissions: [],
    permissionsByRole: [],
    permissionsCreatedByMonth: [],
  });

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      setIsLoading(true);
      // In a real app, replace this with API call: const data = await getPermissions();
      const data = mockPermissions;
      setPermissions(data);

      // Calculate statistics
      calculateStatistics(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching permissions:', error);
      message.error('Failed to fetch permissions');
      setIsLoading(false);
    }
  };

  const calculateStatistics = (data: any[]) => {
    // Count system and custom permissions
    const systemPermissionsCount = data.filter(permission => permission.isSystem).length;
    const customPermissionsCount = data.filter(permission => !permission.isSystem).length;
    const unusedPermissionsCount = data.filter(permission => permission.roleCount === 0).length;

    // Permissions by category
    const categoryMap = new Map();
    data.forEach(permission => {
      const category = permission.category || 'Uncategorized';
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    });

    const permissionsByCategory = Array.from(categoryMap.entries()).map(([name, value]) => ({
      name,
      value,
    }));

    // Most assigned permissions
    const mostAssignedPermissions = [...data]
      .sort((a, b) => (b.roleCount || 0) - (a.roleCount || 0))
      .map(permission => ({
        name: permission.name,
        value: permission.roleCount || 0
      }))
      .slice(0, 10);

    // Mock data for permissions by role
    const permissionsByRole = [
      { name: 'Administrator', value: 12 },
      { name: 'Content Manager', value: 5 },
      { name: 'Guide', value: 3 },
      { name: 'Support Agent', value: 2 },
      { name: 'Event Manager', value: 3 },
    ];

    // Permissions created by month
    const monthMap = new Map();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    data.forEach(permission => {
      if (permission.createdAt) {
        const date = new Date(permission.createdAt);
        const monthName = months[date.getMonth()];
        monthMap.set(monthName, (monthMap.get(monthName) || 0) + 1);
      }
    });

    const permissionsCreatedByMonth = months.map(month => ({
      month,
      count: monthMap.get(month) || 0,
    }));

    setStats({
      totalPermissions: data.length,
      systemPermissions: systemPermissionsCount,
      customPermissions: customPermissionsCount,
      unusedPermissions: unusedPermissionsCount,
      permissionsByCategory,
      mostAssignedPermissions,
      permissionsByRole,
      permissionsCreatedByMonth,
    });
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleCreatePermission = () => {
    setSelectedPermission(null);
    setIsModalVisible(true);
  };

  const handleEditPermission = (permission: any) => {
    setSelectedPermission(permission);
    setIsModalVisible(true);
  };

  const handleDeletePermission = async (id: string) => {
    const permissionToDelete = permissions.find(permission => permission.id === id);

    if (permissionToDelete?.isSystem) {
      message.error('System permissions cannot be deleted');
      return;
    }

    try {
      // In a real app: await deletePermission(id);
      setPermissions(permissions.filter(permission => permission.id !== id));
      message.success('Permission deleted successfully');

      // Recalculate stats
      calculateStatistics(permissions.filter(permission => permission.id !== id));
    } catch (error) {
      console.error('Error deleting permission:', error);
      message.error('Failed to delete permission');
    }
  };

  const handleFormSubmit = async (permissionData: any) => {
    try {
      setFormLoading(true);

      if (selectedPermission) {
        // Update existing permission
        // In a real app: await updatePermission(selectedPermission.id, permissionData);
        const updatedPermissions = permissions.map(permission =>
          permission.id === selectedPermission.id ? { ...permission, ...permissionData } : permission
        );
        setPermissions(updatedPermissions);
        message.success('Permission updated successfully');

        // Recalculate stats
        calculateStatistics(updatedPermissions);
      } else {
        // Create new permission
        // In a real app: const newPermission = await createPermission(permissionData);
        const newPermission = {
          id: String(permissions.length + 1),
          ...permissionData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          roleCount: 0
        };

        const updatedPermissions = [...permissions, newPermission];
        setPermissions(updatedPermissions);
        message.success('Permission created successfully');

        // Recalculate stats
        calculateStatistics(updatedPermissions);
      }

      setIsModalVisible(false);
      setFormLoading(false);
    } catch (error) {
      console.error('Error saving permission:', error);
      message.error('Failed to save permission');
      setFormLoading(false);
    }
  };

  const getCategories = () => {
    const categories = new Set<string>();
    permissions.forEach(permission => {
      if (permission.category) {
        categories.add(permission.category);
      }
    });
    return Array.from(categories);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: any) => (
        <div>
          <div className="font-medium">{name}</div>
          <div className="text-gray-500 text-sm">{record.code}</div>
        </div>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => (
        <Tag color="blue">{category}</Tag>
      ),
      filters: getCategories().map(category => ({ text: category, value: category })),
      onFilter: (value: string, record: any) => record.category === value,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (description: string) => (
        <div className="truncate max-w-md">{description}</div>
      ),
    },
    {
      title: 'Type',
      key: 'type',
      render: (text: string, record: any) => (
        <Tag color={record.isSystem ? 'purple' : 'green'}>
          {record.isSystem ? 'System' : 'Custom'}
        </Tag>
      ),
      filters: [
        { text: 'System', value: true },
        { text: 'Custom', value: false },
      ],
      onFilter: (value: boolean, record: any) => record.isSystem === value,
    },
    {
      title: 'Used In',
      dataIndex: 'roleCount',
      key: 'roleCount',
      render: (roleCount: number) => (
        <div>{roleCount} role(s)</div>
      ),
      sorter: (a: any, b: any) => (a.roleCount || 0) - (b.roleCount || 0),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: string, record: any) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditPermission(record)}
            type="link"
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDeletePermission(record.id || '')}
            type="link"
            danger
            disabled={record.isSystem}
            title={record.isSystem ? 'System permissions cannot be deleted' : ''}
          />
        </Space>
      ),
    },
  ];

  const filteredPermissions = permissions.filter(permission => {
    const matchesSearch =
      permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (permission.description && permission.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = categoryFilter ? permission.category === categoryFilter : true;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6">
      <Typography.Title level={2}>
        <SafetyOutlined /> Permission Management
      </Typography.Title>

      <Tabs activeKey={activeTab} onChange={setActiveTab} className="mb-6">
        <TabPane
          tab={<span><TableOutlined /> Permissions List</span>}
          key="table"
        >
          <div className="mb-4 flex justify-between flex-wrap">
            <div className="flex items-center">
              <Search
                placeholder="Search permissions"
                onSearch={handleSearch}
                onChange={(e) => handleSearch(e.target.value)}
                style={{ width: 300, marginBottom: 16 }}
              />
            </div>

            <PermissionGuard permission={Permission.ManageRoles}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreatePermission}
              >
                Add Permission
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
              dataSource={filteredPermissions}
              rowKey="id"
              pagination={{
                current: currentPage,
                onChange: (page) => setCurrentPage(page),
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} permissions`,
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
            <PermissionStatistics stats={stats} />
          )}
        </TabPane>
      </Tabs>

      {/* Permission Form Modal */}
      {isModalVisible && (
        <Card
          title={selectedPermission ? `Edit Permission: ${selectedPermission.name}` : "Create Permission"}
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
          <PermissionForm
            permission={selectedPermission || undefined}
            categories={getCategories()}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsModalVisible(false)}
            loading={formLoading}
          />
        </Card>
      )}
    </div>
  );
};

export default PermissionsManagement;
