import React, { useState } from 'react';
import { Table, Button, Space, Tag, Typography, Input, Modal, Form, Select, Rate, Switch } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Permission } from '@/utils/permissions';
import { PermissionGuard } from '@/components/common/PermissionGuards';

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

// Mock guide data
const mockGuides = [
  {
    id: '1',
    name: 'Sarah Johnson',
    specialties: ['city tours', 'history'],
    languages: ['English', 'French'],
    locations: ['Paris, France', 'London, UK'],
    rating: 4.8,
    verified: true,
    featured: true,
  },
  {
    id: '2',
    name: 'Miguel Rodriguez',
    specialties: ['adventure', 'hiking'],
    languages: ['Spanish', 'English'],
    locations: ['Barcelona, Spain', 'Madrid, Spain'],
    rating: 4.6,
    verified: true,
    featured: false,
  },
  {
    id: '3',
    name: 'Akiko Tanaka',
    specialties: ['cultural', 'food'],
    languages: ['Japanese', 'English'],
    locations: ['Tokyo, Japan', 'Kyoto, Japan'],
    rating: 4.9,
    verified: true,
    featured: true,
  },
  {
    id: '4',
    name: 'David Chen',
    specialties: ['photography', 'nature'],
    languages: ['Mandarin', 'English'],
    locations: ['Shanghai, China', 'Beijing, China'],
    rating: 4.5,
    verified: false,
    featured: false,
  },
];

const GuideManagement: React.FC = () => {
  const [guides, setGuides] = useState(mockGuides);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingGuide, setEditingGuide] = useState<any>(null);

  const showModal = (guide?: any) => {
    setEditingGuide(guide);
    if (guide) {
      form.setFieldsValue(guide);
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = (values: any) => {
    if (editingGuide) {
      // Update existing guide
      setGuides(guides.map(guide => 
        guide.id === editingGuide.id ? { ...guide, ...values } : guide
      ));
    } else {
      // Add new guide
      setGuides([...guides, { id: Date.now().toString(), ...values }]);
    }
    setIsModalVisible(false);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this guide?',
      content: 'This action cannot be undone.',
      onOk: () => {
        setGuides(guides.filter(guide => guide.id !== id));
      },
    });
  };

  const handleToggleVerification = (id: string, currentStatus: boolean) => {
    setGuides(guides.map(guide => 
      guide.id === id ? { ...guide, verified: !currentStatus } : guide
    ));
  };

  const handleToggleFeatured = (id: string, currentStatus: boolean) => {
    setGuides(guides.map(guide => 
      guide.id === id ? { ...guide, featured: !currentStatus } : guide
    ));
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Specialties',
      dataIndex: 'specialties',
      key: 'specialties',
      render: (specialties: string[]) => (
        <>
          {specialties.map(specialty => (
            <Tag color="blue" key={specialty}>
              {specialty.toUpperCase()}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: 'Languages',
      dataIndex: 'languages',
      key: 'languages',
      render: (languages: string[]) => (
        <>
          {languages.map(language => (
            <Tag color="volcano" key={language}>
              {language}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => <Rate disabled defaultValue={rating} allowHalf />,
    },
    {
      title: 'Verified',
      dataIndex: 'verified',
      key: 'verified',
      render: (verified: boolean, record: any) => (
        <PermissionGuard 
          permission={Permission.EDIT_ANY_GUIDE}
          fallback={<Tag color={verified ? 'green' : 'red'}>{verified ? 'VERIFIED' : 'UNVERIFIED'}</Tag>}
        >
          <Switch
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            checked={verified}
            onChange={() => handleToggleVerification(record.id, verified)}
          />
        </PermissionGuard>
      ),
    },
    {
      title: 'Featured',
      dataIndex: 'featured',
      key: 'featured',
      render: (featured: boolean, record: any) => (
        <PermissionGuard 
          permission={Permission.EDIT_ANY_GUIDE}
          fallback={<Tag color={featured ? 'gold' : 'default'}>{featured ? 'FEATURED' : 'REGULAR'}</Tag>}
        >
          <Switch
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            checked={featured}
            onChange={() => handleToggleFeatured(record.id, featured)}
          />
        </PermissionGuard>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space size="middle">
          <PermissionGuard permission={Permission.EDIT_ANY_GUIDE}>
            <Button icon={<EditOutlined />} onClick={() => showModal(record)}>
              Edit
            </Button>
          </PermissionGuard>
          
          <PermissionGuard permission={Permission.EDIT_ANY_GUIDE}>
            <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>
              Delete
            </Button>
          </PermissionGuard>
        </Space>
      ),
    },
  ];

  return (
    <div className="guide-management">
      <Typography.Title level={2}>Guide Management</Typography.Title>
      
      <div className="table-actions" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <Search
          placeholder="Search guides"
          allowClear
          style={{ width: 300 }}
          onSearch={(value) => console.log(value)}
        />
        
        <PermissionGuard permission={Permission.EDIT_ANY_GUIDE}>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
            Add Guide
          </Button>
        </PermissionGuard>
      </div>
      
      <Table 
        columns={columns} 
        dataSource={guides} 
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
      
      <Modal
        title={editingGuide ? "Edit Guide" : "Add Guide"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={700}
      >
        <Form 
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ verified: false, featured: false, rating: 4.0 }}
        >
          <Form.Item
            name="name"
            label="Guide Name"
            rules={[{ required: true, message: 'Please enter a name' }]}
          >
            <Input placeholder="Full name" />
          </Form.Item>
          
          <Form.Item
            name="specialties"
            label="Specialties"
            rules={[{ required: true, message: 'Please select at least one specialty' }]}
          >
            <Select mode="tags" placeholder="Select or add specialties">
              <Option value="city tours">City Tours</Option>
              <Option value="history">History</Option>
              <Option value="adventure">Adventure</Option>
              <Option value="hiking">Hiking</Option>
              <Option value="cultural">Cultural</Option>
              <Option value="food">Food</Option>
              <Option value="photography">Photography</Option>
              <Option value="nature">Nature</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="languages"
            label="Languages"
            rules={[{ required: true, message: 'Please select at least one language' }]}
          >
            <Select mode="tags" placeholder="Select or add languages">
              <Option value="English">English</Option>
              <Option value="Spanish">Spanish</Option>
              <Option value="French">French</Option>
              <Option value="German">German</Option>
              <Option value="Italian">Italian</Option>
              <Option value="Japanese">Japanese</Option>
              <Option value="Mandarin">Mandarin</Option>
              <Option value="Arabic">Arabic</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="locations"
            label="Locations"
            rules={[{ required: true, message: 'Please select at least one location' }]}
          >
            <Select mode="tags" placeholder="Select or add locations">
              <Option value="Paris, France">Paris, France</Option>
              <Option value="London, UK">London, UK</Option>
              <Option value="Barcelona, Spain">Barcelona, Spain</Option>
              <Option value="Tokyo, Japan">Tokyo, Japan</Option>
              <Option value="New York, USA">New York, USA</Option>
              <Option value="Rome, Italy">Rome, Italy</Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="rating" label="Rating">
            <Rate allowHalf defaultValue={4.0} />
          </Form.Item>
          
          <Form.Item name="verified" valuePropName="checked" label="Verified">
            <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} />
          </Form.Item>
          
          <Form.Item name="featured" valuePropName="checked" label="Featured">
            <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} />
          </Form.Item>
          
          <Form.Item
            name="bio"
            label="Biography"
          >
            <TextArea rows={4} placeholder="Guide biography..." />
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingGuide ? 'Update Guide' : 'Create Guide'}
              </Button>
              <Button onClick={handleCancel}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default GuideManagement;