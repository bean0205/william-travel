import React, { useState, useEffect } from 'react';
import {
  Table, Button, Space, Typography, Input, Modal, Form, Card, Switch, message, Row, Col, Tag, Tabs, Skeleton, Tooltip,
  Badge, Descriptions, Transfer
} from 'antd';
import {
  EditOutlined, DeleteOutlined, PlusOutlined, TeamOutlined, EyeOutlined,
  TableOutlined, ReloadOutlined, SafetyCertificateOutlined
} from '@ant-design/icons';
import { Permission } from '@/utils/permissions';
import { PermissionGuard } from '@/components/common/PermissionGuards';
import { Role, getRoles, getRoleById, createRole, updateRole, deleteRole } from '@/services/api/roleService';
import { Permission as PermissionType, getPermissions } from '@/services/api/permissionService';
import type { TableProps } from 'antd/lib/table';
import type { Key } from 'react';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Search } = Input;

// Define interfaces for the component
interface RoleTransferItem {
  key: string;
  title: string;
  description: string;
}

// Define API error interface
interface ApiError {
  response?: {
    data?: {
      detail?: string;
    };
    status?: number;
  };
  message?: string;
}

const RolesManagement: React.FC = () => {
  // State
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<PermissionType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'create' | 'edit'>('create');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [form] = Form.useForm();
  const [viewRoleModalVisible, setViewRoleModalVisible] = useState<boolean>(false);
  const [viewRole, setViewRole] = useState<Role | null>(null);
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  // Fetch roles and permissions
  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const fetchRoles = async (skipVal: number = 0, limitVal: number = 100) => {
    try {
      setLoading(true);
      const data = await getRoles(skipVal, limitVal);
      setRoles(data);
      setLoading(false);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : ((error as ApiError)?.response?.data?.detail || 'Failed to fetch roles');
      message.error(errorMessage);
      console.error('Error fetching roles:', error);
      setLoading(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      const data = await getPermissions();
      setPermissions(data);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : ((error as ApiError)?.response?.data?.detail || 'Failed to fetch permissions');
      message.error(errorMessage);
      console.error('Error fetching permissions:', error);
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    // In a real app, you would call fetchRoles with the search parameter
    // For now, we'll just filter locally
    if (value.trim() === '') {
      fetchRoles();
    }
  };

  const showCreateModal = () => {
    form.resetFields();
    setTargetKeys([]);
    setModalType('create');
    setIsModalVisible(true);
  };

  const showEditModal = async (role: Role) => {
    try {
      setLoading(true);
      const detailedRole = await getRoleById(role.id);
      setEditingRole(detailedRole);

      form.setFieldsValue({
        name: detailedRole.name,
        description: detailedRole.description,
        is_default: detailedRole.is_default,
      });

      // Set selected permissions for Transfer component
      const selectedPermissionIds = detailedRole.permissions.map(p => p.id.toString());
      setTargetKeys(selectedPermissionIds);

      setModalType('edit');
      setIsModalVisible(true);
      setLoading(false);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to fetch role details';
      message.error(errorMessage);
      setLoading(false);
    }
  };

  const showViewModal = async (roleId: number) => {
    try {
      setLoading(true);
      const role = await getRoleById(roleId);
      setViewRole(role);
      setViewRoleModalVisible(true);
      setLoading(false);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to fetch role details';
      message.error(errorMessage);
      setLoading(false);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      // Convert targetKeys (strings) back to numbers for the API
      const permissionIds = targetKeys.map(key => parseInt(key));

      if (modalType === 'create') {
        await createRole({
          ...values,
          permission_ids: permissionIds
        });
        message.success('Role created successfully');
      } else if (modalType === 'edit' && editingRole) {
        await updateRole(editingRole.id, {
          ...values,
          permission_ids: permissionIds
        });
        message.success('Role updated successfully');
      }
      setIsModalVisible(false);
      fetchRoles();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : ((error as ApiError)?.response?.data?.detail || 'Operation failed');
      console.error('Operation failed:', error);
      message.error(errorMessage);
    }
  };

  const handleDelete = async (roleId: number) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this role?',
      content: 'This action cannot be undone. If users are currently assigned to this role, deletion will fail.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await deleteRole(roleId);
          message.success('Role deleted successfully');
          fetchRoles();
        } catch (error: unknown) {
          const apiError = error as ApiError;
          if (apiError?.response?.status === 400) {
            message.error('Cannot delete: role is assigned to users');
          } else {
            const errorMessage = error instanceof Error 
              ? error.message 
              : 'Failed to delete role';
            message.error(errorMessage);
          }
        }
      },
    });
  };

  // Correctly typed Transfer component handlers
  const handleTransferChange = (
    nextTargetKeys: Key[], 
    direction: TransferDirection, 
    moveKeys: Key[]
  ) => {
    setTargetKeys(nextTargetKeys.map(key => key.toString()));
  };

  const handleTransferSelectChange = (
    sourceSelectedKeys: Key[], 
    targetSelectedKeys: Key[]
  ) => {
    const stringSourceKeys = sourceSelectedKeys.map(key => key.toString());
    const stringTargetKeys = targetSelectedKeys.map(key => key.toString());
    setSelectedKeys([...stringSourceKeys, ...stringTargetKeys]);
  };

  const columns: TableProps<Role>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a: Role, b: Role) => a.id - b.id,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Role, b: Role) => a.name.localeCompare(b.name),
      render: (_: string, record: Role) => (
        <Space>
          {record.name}
          {record.is_default && <Badge status="processing" text="Default" />}
        </Space>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Permissions',
      key: 'permissions',
      render: (_: unknown, record: Role) => (
        <>
          {record.permissions?.length > 0 ? (
            <Tooltip title={record.permissions.map(p => p.name).join(', ')}>
              <div>{record.permissions.length} permission(s)</div>
            </Tooltip>
          ) : (
            <Text type="secondary">No permissions</Text>
          )}
        </>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: (a: Role, b: Role) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Role) => (
        <PermissionGuard permission={Permission.ROLE_MANAGE}>
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
        </PermissionGuard>
      ),
    },
  ];

  const filteredRoles = searchQuery
    ? roles.filter(
        role =>
          role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          role.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : roles;

  return (
    <div className="roles-management-container">
      <Card>
        <div className="roles-management-header" style={{ marginBottom: 16 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={2}>Role Management</Title>
            </Col>
            <Col>
              <Space>
                <Search
                  placeholder="Search roles..."
                  onSearch={handleSearch}
                  style={{ width: 250 }}
                  allowClear
                />
                <PermissionGuard permission={Permission.ROLE_CREATE}>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={showCreateModal}
                  >
                    Add Role
                  </Button>
                </PermissionGuard>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => fetchRoles()}
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
                Role List
              </span>
            }
            key="table"
          >
            <Table
              columns={columns}
              dataSource={filteredRoles}
              rowKey="id"
              loading={loading}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* Create/Edit Role Modal */}
      <Modal
        title={modalType === 'create' ? 'Create New Role' : 'Edit Role'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Role Name"
            rules={[{ required: true, message: 'Please enter role name' }]}
          >
            <Input prefix={<TeamOutlined />} placeholder="Role Name" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea rows={3} placeholder="Role description" />
          </Form.Item>

          <Form.Item
            name="is_default"
            label="Default Role"
            valuePropName="checked"
            tooltip="This will be the default role assigned to new users"
          >
            <Switch />
          </Form.Item>

          <Form.Item label="Permissions">
            <Transfer<RoleTransferItem>
              dataSource={permissions.map(permission => ({
                key: permission.id.toString(),
                title: permission.name,
                description: permission.description,
              }))}
              titles={['Available', 'Assigned']}
              targetKeys={targetKeys}
              selectedKeys={selectedKeys}
              onChange={handleTransferChange}
              onSelectChange={handleTransferSelectChange}
              render={item => (
                <Tooltip title={item.description}>
                  {item.title}
                </Tooltip>
              )}
              listStyle={{ width: 350, height: 300 }}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* View Role Modal */}
      <Modal
        title="Role Details"
        open={viewRoleModalVisible}
        onCancel={() => setViewRoleModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setViewRoleModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={700}
      >
        {loading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : viewRole ? (
          <div>
            <Card title="Basic Information" style={{ marginBottom: 16 }}>
              <Descriptions bordered column={1}>
                <Descriptions.Item label="ID">{viewRole.id}</Descriptions.Item>
                <Descriptions.Item label="Name">{viewRole.name}</Descriptions.Item>
                <Descriptions.Item label="Description">{viewRole.description}</Descriptions.Item>
                <Descriptions.Item label="Default Role">
                  {viewRole.is_default ? (
                    <Badge status="processing" text="Yes" />
                  ) : (
                    'No'
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Created At">
                  {new Date(viewRole.created_at).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="Updated At">
                  {new Date(viewRole.updated_at).toLocaleString()}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Card title="Permissions">
              {viewRole.permissions && viewRole.permissions.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {viewRole.permissions.map(permission => (
                    <Tag
                      icon={<SafetyCertificateOutlined />}
                      color="blue"
                      key={permission.id}
                    >
                      {permission.name}
                    </Tag>
                  ))}
                </div>
              ) : (
                <Text type="secondary">No permissions assigned</Text>
              )}
            </Card>
          </div>
        ) : (
          <p>No role data available</p>
        )}
      </Modal>
    </div>
  );
};

export default RolesManagement;
