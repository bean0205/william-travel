import React, { useState } from 'react';
import { Table, Button, Space, Tag, Typography, Input, Select, Modal, Form } from 'antd';
import { UserOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { UserRole } from '@/store/authStore';

const { Search } = Input;
const { Option } = Select;

// Mock data
const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'user@example.com',
    role: UserRole.USER,
    status: 'active',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'guide@example.com',
    role: UserRole.GUIDE,
    status: 'active',
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@example.com',
    role: UserRole.ADMIN,
    status: 'active',
  },
  {
    id: '4',
    name: 'Suspended User',
    email: 'suspended@example.com',
    role: UserRole.USER,
    status: 'suspended',
  },
];

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState(mockUsers);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingUser, setEditingUser] = useState<any>(null);

  const showModal = (user?: any) => {
    setEditingUser(user);
    if (user) {
      form.setFieldsValue(user);
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = (values: any) => {
    if (editingUser) {
      // Update existing user
      setUsers(users.map(user => 
        user.id === editingUser.id ? { ...user, ...values } : user
      ));
    } else {
      // Add new user
      setUsers([...users, { id: Date.now().toString(), ...values }]);
    }
    setIsModalVisible(false);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this user?',
      content: 'This action cannot be undone.',
      onOk: () => {
        setUsers(users.filter(user => user.id !== id));
      },
    });
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: UserRole) => {
        let color = 'blue';
        if (role === UserRole.ADMIN) color = 'red';
        if (role === UserRole.GUIDE) color = 'green';
        return <Tag color={color}>{role.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'active' ? 'green' : 'volcano';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => showModal(record)}>
            Edit
          </Button>
          <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="user-management">
      <Typography.Title level={2}>User Management</Typography.Title>
      
      <div className="table-actions" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <Search
          placeholder="Search users"
          allowClear
          style={{ width: 300 }}
          onSearch={(value) => console.log(value)}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
          Add User
        </Button>
      </div>
      
      <Table 
        columns={columns} 
        dataSource={users} 
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
      
      <Modal
        title={editingUser ? "Edit User" : "Add User"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form 
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ status: 'active', role: UserRole.USER }}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter a name' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Name" />
          </Form.Item>
          
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter an email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please select a role' }]}
          >
            <Select placeholder="Select role">
              <Option value={UserRole.USER}>User</Option>
              <Option value={UserRole.GUIDE}>Guide</Option>
              <Option value={UserRole.ADMIN}>Admin</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select a status' }]}
          >
            <Select placeholder="Select status">
              <Option value="active">Active</Option>
              <Option value="suspended">Suspended</Option>
            </Select>
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingUser ? 'Update' : 'Create'}
              </Button>
              <Button onClick={handleCancel}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;