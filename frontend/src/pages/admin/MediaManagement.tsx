// filepath: /Users/williamnguyen/Documents/william travel/frontend/src/pages/admin/MediaManagement.tsx
import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, Typography, Input, Tabs, Card, Spin, Image, message, Select, Upload, Modal, Form } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  FileImageOutlined,
  BarChartOutlined,
  TableOutlined,
  EyeOutlined,
  UploadOutlined
} from '@ant-design/icons';
import { PermissionGuard } from '@/components/common/PermissionGuards';
import { getMedia, getMediaById, uploadMedia, deleteMedia, getMediaTypes, createMediaType, getMediaCategories, createMediaCategory, MediaType, MediaCategory } from '@/services/api/mediaService';

const { Search } = Input;
const { TabPane } = Tabs;
const { Option } = Select;
const { Title, Text } = Typography;

// Interface for MediaFile (updated to match API response)
interface MediaFile {
  id: number;
  file_name: string;
  file_path: string;
  file_url: string;
  mime_type: string;
  file_size: number;
  type_id: number;
  category_id: number;
  entity_type?: string;
  entity_id?: number;
  title?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

// Component quản lý Media Types
const MediaTypeManagement: React.FC = () => {
  const [mediaTypes, setMediaTypes] = useState<MediaType[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingType, setEditingType] = useState<MediaType | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchMediaTypes();
  }, []);

  const fetchMediaTypes = async () => {
    setLoading(true);
    try {
      const data = await getMediaTypes();
      setMediaTypes(data);
    } catch (error) {
      message.error('Failed to fetch media types');
      console.error('Error fetching media types:', error);
    } finally {
      setLoading(false);
    }
  };

  const showModal = (type?: MediaType) => {
    setEditingType(type || null);
    form.setFieldsValue(type || {name: '', code: '', status: 1});
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingType) {
        // Update logic would go here
        // To be implemented
        message.success('Media type updated successfully');
      } else {
        await createMediaType(values);
        message.success('Media type created successfully');
      }
      setIsModalVisible(false);
      fetchMediaTypes();
    } catch (error) {
      message.error('Operation failed');
      console.error('Error creating/updating media type:', error);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
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
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
    },
    {
      title: 'Updated At',
      dataIndex: 'updated_at',
      key: 'updated_at',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: MediaType) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => showModal(record)}>
            Edit
          </Button>
          <Button danger icon={<DeleteOutlined />}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Title level={4}>Media Types</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
          Add Media Type
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={mediaTypes}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingType ? 'Edit Media Type' : 'Add Media Type'}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter the name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="code"
            label="Code"
            rules={[{ required: true, message: 'Please enter the code' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select>
              <Option value={1}>Active</Option>
              <Option value={0}>Inactive</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingType ? 'Update' : 'Create'}
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={handleCancel}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

// Component quản lý Media Categories
const MediaCategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<MediaCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MediaCategory | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getMediaCategories();
      setCategories(data);
    } catch (error) {
      message.error('Failed to fetch media categories');
      console.error('Error fetching media categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const showModal = (category?: MediaCategory) => {
    setEditingCategory(category || null);
    form.setFieldsValue(category || {name: '', code: '', status: 1});
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingCategory) {
        // Update logic would go here
        // To be implemented
        message.success('Media category updated successfully');
      } else {
        await createMediaCategory(values);
        message.success('Media category created successfully');
      }
      setIsModalVisible(false);
      fetchCategories();
    } catch (error) {
      message.error('Operation failed');
      console.error('Error creating/updating media category:', error);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
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
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
    },
    {
      title: 'Updated At',
      dataIndex: 'updated_at',
      key: 'updated_at',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: MediaCategory) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => showModal(record)}>
            Edit
          </Button>
          <Button danger icon={<DeleteOutlined />}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Title level={4}>Media Categories</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
          Add Media Category
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={categories}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingCategory ? 'Edit Media Category' : 'Add Media Category'}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter the name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="code"
            label="Code"
            rules={[{ required: true, message: 'Please enter the code' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select>
              <Option value={1}>Active</Option>
              <Option value={0}>Inactive</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingCategory ? 'Update' : 'Create'}
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={handleCancel}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

// Component quản lý Media Files
const MediaFileManagement: React.FC = () => {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [mediaTypes, setMediaTypes] = useState<MediaType[]>([]);
  const [mediaCategories, setMediaCategories] = useState<MediaCategory[]>([]);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [uploadForm] = Form.useForm();
  const [pagination, setPagination] = useState({
    skip: 0,
    limit: 20,
  });

  useEffect(() => {
    fetchMediaFiles();
    fetchMediaTypes();
    fetchMediaCategories();
  }, [pagination]);

  const fetchMediaFiles = async () => {
    setLoading(true);
    try {
      const data = await getMedia(pagination);
      setMediaFiles(data);
    } catch (error) {
      message.error('Failed to fetch media files');
      console.error('Error fetching media files:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMediaTypes = async () => {
    try {
      const data = await getMediaTypes();
      setMediaTypes(data);
    } catch (error) {
      message.error('Failed to fetch media types');
      console.error('Error fetching media types:', error);
    }
  };

  const fetchMediaCategories = async () => {
    try {
      const data = await getMediaCategories();
      setMediaCategories(data);
    } catch (error) {
      message.error('Failed to fetch media categories');
      console.error('Error fetching media categories:', error);
    }
  };

  const showUploadModal = () => {
    uploadForm.resetFields();
    setIsUploadModalVisible(true);
  };

  const showViewModal = async (id: number) => {
    try {
      const fileData = await getMediaById(id.toString());
      setSelectedFile(fileData);
      setIsViewModalVisible(true);
    } catch (error) {
      message.error('Failed to fetch media file details');
      console.error('Error fetching media file details:', error);
    }
  };

  const handleUploadCancel = () => {
    setIsUploadModalVisible(false);
  };

  const handleViewCancel = () => {
    setIsViewModalVisible(false);
  };

  const handleUploadSubmit = async (values: any) => {
    try {
      const formData = new FormData();

      // Add file to FormData
      if (values.file && values.file.length > 0) {
        formData.append('file', values.file[0].originFileObj);
      }

      // Add other form fields
      formData.append('type_id', values.type_id.toString());
      formData.append('category_id', values.category_id.toString());

      if (values.title) {
        formData.append('title', values.title);
      }

      if (values.description) {
        formData.append('description', values.description);
      }

      if (values.entity_type) {
        formData.append('entity_type', values.entity_type);
      }

      if (values.entity_id) {
        formData.append('entity_id', values.entity_id.toString());
      }

      await uploadMedia(formData);
      message.success('Media file uploaded successfully');
      setIsUploadModalVisible(false);
      fetchMediaFiles();
    } catch (error) {
      message.error('Upload failed');
      console.error('Error uploading media:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMedia(id.toString());
      message.success('Media file deleted successfully');
      fetchMediaFiles();
    } catch (error) {
      message.error('Delete failed');
      console.error('Error deleting media:', error);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Preview',
      dataIndex: 'file_url',
      key: 'preview',
      render: (url: string, record: MediaFile) => {
        if (record.mime_type?.startsWith('image/')) {
          return <Image src={url} alt={record.file_name} width={50} height={50} />;
        }
        return <FileImageOutlined style={{ fontSize: 32 }} />;
      },
    },
    {
      title: 'File Name',
      dataIndex: 'file_name',
      key: 'file_name',
    },
    {
      title: 'Type',
      dataIndex: 'type_id',
      key: 'type_id',
      render: (typeId: number) => {
        const type = mediaTypes.find(t => t.id === typeId);
        return type ? type.name : typeId;
      },
    },
    {
      title: 'Category',
      dataIndex: 'category_id',
      key: 'category_id',
      render: (categoryId: number) => {
        const category = mediaCategories.find(c => c.id === categoryId);
        return category ? category.name : categoryId;
      },
    },
    {
      title: 'Size',
      dataIndex: 'file_size',
      key: 'file_size',
      render: (size: number) => {
        const kb = size / 1024;
        if (kb < 1024) {
          return `${kb.toFixed(2)} KB`;
        }
        return `${(kb / 1024).toFixed(2)} MB`;
      },
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: MediaFile) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => showViewModal(record.id)}>
            View
          </Button>
          <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  // Tùy chọn tải lên cho form
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Title level={4}>Media Files</Title>
        <Button type="primary" icon={<UploadOutlined />} onClick={showUploadModal}>
          Upload Media
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={mediaFiles}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: pagination.limit,
          onChange: (page) => {
            setPagination({
              ...pagination,
              skip: (page - 1) * pagination.limit
            });
          }
        }}
      />

      {/* Upload Modal */}
      <Modal
        title="Upload Media File"
        visible={isUploadModalVisible}
        onCancel={handleUploadCancel}
        footer={null}
        width={700}
      >
        <Form
          form={uploadForm}
          layout="vertical"
          onFinish={handleUploadSubmit}
        >
          <Form.Item
            name="file"
            label="File"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: 'Please select a file to upload' }]}
          >
            <Upload.Dragger name="files" beforeUpload={() => false}>
              <p className="ant-upload-drag-icon">
                <UploadOutlined />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
            </Upload.Dragger>
          </Form.Item>

          <Form.Item
            name="type_id"
            label="Media Type"
            rules={[{ required: true, message: 'Please select media type' }]}
          >
            <Select>
              {mediaTypes.map(type => (
                <Option key={type.id} value={type.id}>{type.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="category_id"
            label="Category"
            rules={[{ required: true, message: 'Please select category' }]}
          >
            <Select>
              {mediaCategories.map(category => (
                <Option key={category.id} value={category.id}>{category.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="title" label="Title">
            <Input />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item name="entity_type" label="Entity Type">
            <Select allowClear>
              <Option value="accommodation">Accommodation</Option>
              <Option value="food">Food</Option>
              <Option value="article">Article</Option>
              <Option value="location">Location</Option>
            </Select>
          </Form.Item>

          <Form.Item name="entity_id" label="Entity ID">
            <Input type="number" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Upload
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={handleUploadCancel}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Modal */}
      {selectedFile && (
        <Modal
          title="Media File Details"
          visible={isViewModalVisible}
          onCancel={handleViewCancel}
          footer={[
            <Button key="close" onClick={handleViewCancel}>
              Close
            </Button>
          ]}
          width={700}
        >
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            {selectedFile.mime_type?.startsWith('image/') ? (
              <Image
                src={selectedFile.file_url}
                alt={selectedFile.file_name}
                style={{ maxWidth: '100%', maxHeight: 400 }}
              />
            ) : (
              <div style={{ padding: 40, background: '#f0f0f0', borderRadius: 4 }}>
                <FileImageOutlined style={{ fontSize: 64 }} />
                <div>{selectedFile.file_name}</div>
              </div>
            )}
          </div>

          <div style={{ marginTop: 16 }}>
            <p><strong>File Name:</strong> {selectedFile.file_name}</p>
            <p><strong>File Path:</strong> {selectedFile.file_path}</p>
            <p><strong>MIME Type:</strong> {selectedFile.mime_type}</p>
            <p><strong>File Size:</strong> {(selectedFile.file_size / 1024 / 1024).toFixed(2)} MB</p>
            <p><strong>Title:</strong> {selectedFile.title || 'N/A'}</p>
            <p><strong>Description:</strong> {selectedFile.description || 'N/A'}</p>
            <p><strong>Created At:</strong> {selectedFile.created_at}</p>
            <p><strong>Updated At:</strong> {selectedFile.updated_at}</p>

            {selectedFile.entity_type && (
              <p><strong>Entity Type:</strong> {selectedFile.entity_type}</p>
            )}

            {selectedFile.entity_id && (
              <p><strong>Entity ID:</strong> {selectedFile.entity_id}</p>
            )}

            <p>
              <a href={selectedFile.file_url} target="_blank" rel="noopener noreferrer">
                <Button type="primary">Open Original File</Button>
              </a>
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};

// Component chính quản lý Media
const MediaManagement: React.FC = () => {
  return (
    <div className="media-management">
      <Typography.Title level={2}>Media Management</Typography.Title>
      <Tabs defaultActiveKey="1">
        <TabPane
          tab={
            <span>
              <FileImageOutlined />
              Media Files
            </span>
          }
          key="1"
        >
          <MediaFileManagement />
        </TabPane>
        <TabPane
          tab={
            <span>
              <TableOutlined />
              Media Types
            </span>
          }
          key="2"
        >
          <MediaTypeManagement />
        </TabPane>
        <TabPane
          tab={
            <span>
              <TableOutlined />
              Media Categories
            </span>
          }
          key="3"
        >
          <MediaCategoryManagement />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default MediaManagement;

