import React, { useState } from 'react';
import { Table, Button, Space, Tag, Typography, Input, Modal, Form, Select, Upload, message } from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  PlusOutlined, 
  UploadOutlined,
  EnvironmentOutlined 
} from '@ant-design/icons';
import { Permission } from '@/utils/permissions';
import { PermissionGuard } from '@/components/common/PermissionGuards';

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

// Mock location data
const mockLocations = [
  {
    id: '1',
    name: 'Paris, France',
    type: 'city',
    featured: true,
    continent: 'Europe',
    description: 'The City of Light and Love, known for the Eiffel Tower and fine cuisine.',
  },
  {
    id: '2',
    name: 'Bali, Indonesia',
    type: 'island',
    featured: true,
    continent: 'Asia',
    description: 'Tropical paradise with beautiful beaches, rice terraces, and unique culture.',
  },
  {
    id: '3',
    name: 'Grand Canyon, USA',
    type: 'natural',
    featured: false,
    continent: 'North America',
    description: 'A massive canyon carved by the Colorado River, showcasing billions of years of geological history.',
  },
  {
    id: '4',
    name: 'Cape Town, South Africa',
    type: 'city',
    featured: false,
    continent: 'Africa',
    description: 'Coastal city known for Table Mountain, vibrant culture, and beautiful landscapes.',
  },
];

const LocationManagement: React.FC = () => {
  const [locations, setLocations] = useState(mockLocations);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingLocation, setEditingLocation] = useState<any>(null);

  const showModal = (location?: any) => {
    setEditingLocation(location);
    if (location) {
      form.setFieldsValue(location);
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = (values: any) => {
    if (editingLocation) {
      // Update existing location
      setLocations(locations.map(loc => 
        loc.id === editingLocation.id ? { ...loc, ...values } : loc
      ));
    } else {
      // Add new location
      setLocations([...locations, { id: Date.now().toString(), ...values }]);
    }
    setIsModalVisible(false);
    message.success(`Location ${editingLocation ? 'updated' : 'added'} successfully!`);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this location?',
      content: 'This action cannot be undone.',
      onOk: () => {
        setLocations(locations.filter(loc => loc.id !== id));
        message.success('Location deleted successfully!');
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
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        let color = 'blue';
        if (type === 'city') color = 'green';
        if (type === 'natural') color = 'volcano';
        if (type === 'island') color = 'cyan';
        return <Tag color={color}>{type.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Continent',
      dataIndex: 'continent',
      key: 'continent',
    },
    {
      title: 'Featured',
      dataIndex: 'featured',
      key: 'featured',
      render: (featured: boolean) => {
        return featured ? <Tag color="gold">FEATURED</Tag> : <Tag color="default">REGULAR</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space size="middle">
          <PermissionGuard permission={Permission.EDIT_LOCATION}>
            <Button icon={<EditOutlined />} onClick={() => showModal(record)}>
              Edit
            </Button>
          </PermissionGuard>
          
          <PermissionGuard permission={Permission.DELETE_LOCATION}>
            <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>
              Delete
            </Button>
          </PermissionGuard>
        </Space>
      ),
    },
  ];

  return (
    <div className="location-management">
      <Typography.Title level={2}>Location Management</Typography.Title>
      
      <div className="table-actions" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <Search
          placeholder="Search locations"
          allowClear
          style={{ width: 300 }}
          onSearch={(value) => console.log(value)}
        />
        
        <PermissionGuard permission={Permission.ADD_LOCATION}>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
            Add Location
          </Button>
        </PermissionGuard>
      </div>
      
      <Table 
        columns={columns} 
        dataSource={locations} 
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
      
      <Modal
        title={editingLocation ? "Edit Location" : "Add Location"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={700}
      >
        <Form 
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ featured: false, type: 'city' }}
        >
          <Form.Item
            name="name"
            label="Location Name"
            rules={[{ required: true, message: 'Please enter a location name' }]}
          >
            <Input prefix={<EnvironmentOutlined />} placeholder="e.g., Paris, France" />
          </Form.Item>
          
          <Form.Item
            name="type"
            label="Location Type"
            rules={[{ required: true, message: 'Please select a location type' }]}
          >
            <Select placeholder="Select location type">
              <Option value="city">City</Option>
              <Option value="natural">Natural Wonder</Option>
              <Option value="island">Island</Option>
              <Option value="mountain">Mountain</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="continent"
            label="Continent"
            rules={[{ required: true, message: 'Please select a continent' }]}
          >
            <Select placeholder="Select continent">
              <Option value="Africa">Africa</Option>
              <Option value="Asia">Asia</Option>
              <Option value="Europe">Europe</Option>
              <Option value="North America">North America</Option>
              <Option value="South America">South America</Option>
              <Option value="Oceania">Oceania</Option>
              <Option value="Antarctica">Antarctica</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter a description' }]}
          >
            <TextArea rows={4} placeholder="Describe this location..." />
          </Form.Item>
          
          <Form.Item name="featured" valuePropName="checked" label="Featured Location">
            <Select>
              <Option value={true}>Yes - Featured</Option>
              <Option value={false}>No - Regular</Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="images" label="Location Images">
            <Upload 
              name="images" 
              listType="picture" 
              multiple 
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingLocation ? 'Update Location' : 'Create Location'}
              </Button>
              <Button onClick={handleCancel}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LocationManagement;