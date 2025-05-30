// filepath: /Users/williamnguyen/Documents/william travel/frontend/src/pages/admin/PermissionsManagement.tsx
import React, { useState, useEffect } from 'react';
import {
  Table, Button, Space, Typography, Input, Modal, Form, Card,
  message, Row, Col, Tag, Tabs, Skeleton, Tooltip, Descriptions
} from 'antd';
import {
  EditOutlined, DeleteOutlined, PlusOutlined, SafetyCertificateOutlined, EyeOutlined,
  TableOutlined, ReloadOutlined, SearchOutlined, KeyOutlined
} from '@ant-design/icons';
import { Permission as PermissionEnum } from '@/utils/permissions';
import { PermissionGuard } from '@/components/common/PermissionGuards';
import {
  Permission,
  getPermissions,
  getPermissionById,
  createPermission,
  updatePermission,
  deletePermission
} from '@/services/api/permissionService';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Search } = Input;

const PermissionsManagement: React.FC = () => {
  // State
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'create' | 'edit'>('create');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [form] = Form.useForm();
  const [viewPermissionModalVisible, setViewPermissionModalVisible] = useState<boolean>(false);
  const [viewPermission, setViewPermission] = useState<Permission | null>(null);

  // Fetch permissions
  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const data = await getPermissions();
      setPermissions(data);
      setLoading(false);
    } catch (error) {
      message.error('Failed to fetch permissions');
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    // In a real app, you would call fetchPermissions with the search parameter
    // For now, we'll just filter locally
    if (value.trim() === '') {
      fetchPermissions();
    }
  };

  const showCreateModal = () => {
    form.resetFields();
    setModalType('create');
    setIsModalVisible(true);
  };

  const showEditModal = async (permission: Permission) => {
    try {
      setLoading(true);
      const detailedPermission = await getPermissionById(permission.id);
      setEditingPermission(detailedPermission);

      form.setFieldsValue({
        name: detailedPermission.name,
        code: detailedPermission.code,
        description: detailedPermission.description,
      });

      setModalType('edit');
      setIsModalVisible(true);
      setLoading(false);
    } catch (error) {
      message.error('Failed to fetch permission details');
      setLoading(false);
    }
  };

  const showViewModal = async (permissionId: number) => {
    try {
      setLoading(true);
      const permission = await getPermissionById(permissionId);
      setViewPermission(permission);
      setViewPermissionModalVisible(true);
      setLoading(false);
    } catch (error) {
      message.error('Failed to fetch permission details');
      setLoading(false);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      if (modalType === 'create') {
        await createPermission(values);
        message.success('Permission created successfully');
      } else if (modalType === 'edit' && editingPermission) {
        await updatePermission(editingPermission.id, values);
        message.success('Permission updated successfully');
      }
      setIsModalVisible(false);
      fetchPermissions();
    } catch (error) {
      message.error('Operation failed');
    }
  };

  const handleDelete = async (permissionId: number) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this permission?',
      content: 'This action cannot be undone. This may affect roles that use this permission.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await deletePermission(permissionId);
          message.success('Permission deleted successfully');
          fetchPermissions();
        } catch (error) {
          message.error('Failed to delete permission');
        }
      },
    });
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a: Permission, b: Permission) => a.id - b.id,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Permission, b: Permission) => a.name.localeCompare(b.name),
      render: (text: string) => (
        <Tag icon={<SafetyCertificateOutlined />} color="blue">{text}</Tag>
      ),
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      render: (text: string) => <code>{text}</code>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: (a: Permission, b: Permission) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Permission) => (
        <PermissionGuard requiredPermissions={[PermissionEnum.PERMISSION_MANAGE]}>
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

  const filteredPermissions = searchQuery
    ? permissions.filter(
        permission =>
          permission.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          permission.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          permission.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : permissions;

  return (
    <div className="permissions-management-container">
      <Card>
        <div className="permissions-management-header" style={{ marginBottom: 16 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={2}>Permission Management</Title>
            </Col>
            <Col>
              <Space>
                <Search
                  placeholder="Search permissions..."
                  onSearch={handleSearch}
                  style={{ width: 250 }}
                  allowClear
                />
                <PermissionGuard requiredPermissions={[PermissionEnum.PERMISSION_CREATE]}>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={showCreateModal}
                  >
                    Add Permission
                  </Button>
                </PermissionGuard>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => fetchPermissions()}
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
                Permission List
              </span>
            }
            key="table"
          >
            <Table
              columns={columns}
              dataSource={filteredPermissions}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* Create/Edit Permission Modal */}
      <Modal
        title={modalType === 'create' ? 'Create New Permission' : 'Edit Permission'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Permission Name"
            rules={[{ required: true, message: 'Please enter permission name' }]}
          >
            <Input prefix={<SafetyCertificateOutlined />} placeholder="Permission Name" />
          </Form.Item>

          <Form.Item
            name="code"
            label="Permission Code"
            rules={[
              { required: true, message: 'Please enter permission code' },
              {
                pattern: /^[a-z]+:[a-z]+$/,
                message: 'Code should be in format "resource:action" (e.g., user:create)'
              }
            ]}
            tooltip="Format should be resource:action, e.g., user:create"
          >
            <Input prefix={<KeyOutlined />} placeholder="Permission Code (e.g., user:create)" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea rows={3} placeholder="Permission description" />
          </Form.Item>
        </Form>
      </Modal>

      {/* View Permission Modal */}
      <Modal
        title="Permission Details"
        open={viewPermissionModalVisible}
        onCancel={() => setViewPermissionModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setViewPermissionModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={600}
      >
        {loading ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : viewPermission ? (
          <div>
            <Card>
              <Descriptions bordered column={1}>
                <Descriptions.Item label="ID">{viewPermission.id}</Descriptions.Item>
                <Descriptions.Item label="Name">{viewPermission.name}</Descriptions.Item>
                <Descriptions.Item label="Code">
                  <code>{viewPermission.code}</code>
                </Descriptions.Item>
                <Descriptions.Item label="Description">{viewPermission.description}</Descriptions.Item>
                <Descriptions.Item label="Created At">
                  {new Date(viewPermission.created_at).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="Updated At">
                  {new Date(viewPermission.updated_at).toLocaleString()}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </div>
        ) : (
          <p>No permission data available</p>
        )}
      </Modal>
    </div>
  );
};

export default PermissionsManagement;
