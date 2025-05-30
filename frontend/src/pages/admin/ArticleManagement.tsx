import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Input, Tabs, Card, Tag, Typography, Spin, Modal, Form, Select, message } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  FileOutlined,
  AppstoreOutlined,
  TagOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { getArticles, getArticleById, createArticle, updateArticle, deleteArticle, Article } from '@/services/api/articleService';
import { PermissionGuard } from '@/components/common/PermissionGuards';

const { Search } = Input;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Title } = Typography;

// Interfaces for article categories and tags based on API documentation
interface ArticleCategory {
  id: number;
  name: string;
  description: string;
  status: number;
  created_at: string;
  updated_at: string;
}

interface ArticleTag {
  id: number;
  name: string;
  status: number;
  created_at: string;
  updated_at: string;
}

// Article Categories Management Component
const ArticleCategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ArticleCategory | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      // This will be replaced with actual API call when available
      // Call should be: const data = await getArticleCategories();
      const mockCategories: ArticleCategory[] = [
        {
          id: 1,
          name: "Travel Guide",
          description: "Comprehensive travel guides for destinations",
          status: 1,
          created_at: "2025-05-01T00:00:00",
          updated_at: "2025-05-01T00:00:00"
        },
        {
          id: 2,
          name: "Travel Tips",
          description: "Useful tips and tricks for travelers",
          status: 1,
          created_at: "2025-05-01T00:00:00",
          updated_at: "2025-05-01T00:00:00"
        }
      ];
      setCategories(mockCategories);
    } catch (error) {
      message.error('Failed to fetch article categories');
      console.error('Error fetching article categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const showModal = (category?: ArticleCategory) => {
    setEditingCategory(category || null);
    form.setFieldsValue(category || { name: '', description: '', status: 1 });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingCategory) {
        // Update logic will go here when API is available
        message.success('Article category updated successfully');
      } else {
        // Create logic will go here when API is available
        // await createArticleCategory(values);
        message.success('Article category created successfully');
      }
      setIsModalVisible(false);
      fetchCategories();
    } catch (error) {
      message.error('Operation failed');
      console.error('Error creating/updating article category:', error);
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
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
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
      title: 'Actions',
      key: 'actions',
      render: (_, record: ArticleCategory) => (
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
        <Title level={4}>Article Categories</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
          Add Category
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={categories}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingCategory ? 'Edit Article Category' : 'Add Article Category'}
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
            name="description"
            label="Description"
          >
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select>
              <Select.Option value={1}>Active</Select.Option>
              <Select.Option value={0}>Inactive</Select.Option>
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

// Article Tags Management Component
const ArticleTagManagement: React.FC = () => {
  const [tags, setTags] = useState<ArticleTag[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingTag, setEditingTag] = useState<ArticleTag | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    setLoading(true);
    try {
      // This will be replaced with actual API call when available
      // Call should be: const data = await getArticleTags();
      const mockTags: ArticleTag[] = [
        {
          id: 1,
          name: "Vietnam",
          status: 1,
          created_at: "2025-05-01T00:00:00",
          updated_at: "2025-05-01T00:00:00"
        },
        {
          id: 2,
          name: "Budget Travel",
          status: 1,
          created_at: "2025-05-01T00:00:00",
          updated_at: "2025-05-01T00:00:00"
        }
      ];
      setTags(mockTags);
    } catch (error) {
      message.error('Failed to fetch article tags');
      console.error('Error fetching article tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const showModal = (tag?: ArticleTag) => {
    setEditingTag(tag || null);
    form.setFieldsValue(tag || { name: '', status: 1 });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingTag) {
        // Update logic will go here when API is available
        message.success('Article tag updated successfully');
      } else {
        // Create logic will go here when API is available
        // await createArticleTag(values);
        message.success('Article tag created successfully');
      }
      setIsModalVisible(false);
      fetchTags();
    } catch (error) {
      message.error('Operation failed');
      console.error('Error creating/updating article tag:', error);
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
      title: 'Actions',
      key: 'actions',
      render: (_, record: ArticleTag) => (
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
        <Title level={4}>Article Tags</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
          Add Tag
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={tags}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingTag ? 'Edit Article Tag' : 'Add Article Tag'}
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
            rules={[{ required: true, message: 'Please enter the tag name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select>
              <Select.Option value={1}>Active</Select.Option>
              <Select.Option value={0}>Inactive</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingTag ? 'Update' : 'Create'}
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

// Articles List Management Component
const ArticleListManagement: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchArticles();
  }, [currentPage, pageSize, searchTerm, filter]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const filters: Record<string, unknown> = {
        page: currentPage,
        limit: pageSize
      };

      if (searchTerm) {
        filters.search = searchTerm;
      }

      if (filter !== 'all') {
        filters.status = filter;
      }

      const data = await getArticles(filters);
      if (data.items) {
        setArticles(data.items);
        setTotalItems(data.total || 0);
      } else {
        // If API doesn't return paginated response yet
        setArticles(data);
      }
    } catch (error) {
      message.error('Failed to fetch articles');
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (value: 'all' | 'published' | 'draft' | 'archived') => {
    setFilter(value);
    setCurrentPage(1);
  };

  const showModal = (article?: Article) => {
    setEditingArticle(article || null);
    if (article) {
      form.setFieldsValue({
        title: article.title,
        content: article.content,
        status: article.status,
        // Other fields would be set here
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingArticle?.id) {
        await updateArticle(editingArticle.id, values);
        message.success('Article updated successfully');
      } else {
        await createArticle(values);
        message.success('Article created successfully');
      }
      setIsModalVisible(false);
      fetchArticles();
    } catch (error) {
      message.error('Operation failed');
      console.error('Error creating/updating article:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteArticle(id);
      message.success('Article deleted successfully');
      fetchArticles();
    } catch (error) {
      message.error('Delete failed');
      console.error('Error deleting article:', error);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'green';
        if (status === 'draft') color = 'gold';
        if (status === 'archived') color = 'red';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: 'Views',
      dataIndex: 'views',
      key: 'views',
      sorter: (a: Article, b: Article) => (a.views || 0) - (b.views || 0),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: Article) => (
        <Space>
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
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Search
            placeholder="Search articles"
            onSearch={handleSearch}
            style={{ width: 250, marginRight: 16 }}
          />
          <Select
            defaultValue="all"
            style={{ width: 120 }}
            onChange={handleFilterChange}
            value={filter}
          >
            <Select.Option value="all">All</Select.Option>
            <Select.Option value="published">Published</Select.Option>
            <Select.Option value="draft">Draft</Select.Option>
            <Select.Option value="archived">Archived</Select.Option>
          </Select>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
          Create Article
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={articles}
        rowKey="id"
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalItems,
          onChange: (page) => setCurrentPage(page),
          onShowSizeChange: (_, size) => {
            setPageSize(size);
            setCurrentPage(1);
          },
          showSizeChanger: true,
        }}
      />

      <Modal
        title={editingArticle ? 'Edit Article' : 'Create Article'}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={editingArticle ? {
            status: editingArticle.status
          } : { status: 'draft' }}
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please enter the article title' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="content"
            label="Content"
            rules={[{ required: true, message: 'Please enter article content' }]}
          >
            <TextArea rows={10} />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select article status' }]}
          >
            <Select>
              <Select.Option value="published">Published</Select.Option>
              <Select.Option value="draft">Draft</Select.Option>
              <Select.Option value="archived">Archived</Select.Option>
            </Select>
          </Form.Item>

          {/* Additional fields like category, tags, etc. would go here */}

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingArticle ? 'Update' : 'Create'}
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

// Article Statistics Component (mockup)
const ArticleStatistics: React.FC = () => {
  return (
    <div>
      <Typography.Title level={4}>Article Statistics</Typography.Title>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        <Card title="Total Articles" style={{ width: 200 }}>
          <Typography.Title level={2}>42</Typography.Title>
        </Card>
        <Card title="Published" style={{ width: 200 }}>
          <Typography.Title level={2}>28</Typography.Title>
        </Card>
        <Card title="Draft" style={{ width: 200 }}>
          <Typography.Title level={2}>10</Typography.Title>
        </Card>
        <Card title="Archived" style={{ width: 200 }}>
          <Typography.Title level={2}>4</Typography.Title>
        </Card>
      </div>
      <div style={{ marginTop: 16 }}>
        <Card title="Most Viewed Articles">
          <p>To be implemented with actual data</p>
        </Card>
      </div>
    </div>
  );
};

// Main Article Management Component
const ArticleManagement: React.FC = () => {
  return (
    <div className="article-management">
      <Typography.Title level={2}>Article Management</Typography.Title>

      <Tabs defaultActiveKey="1">
        <TabPane
          tab={
            <span>
              <FileOutlined />
              Articles
            </span>
          }
          key="1"
        >
          <ArticleListManagement />
        </TabPane>
        <TabPane
          tab={
            <span>
              <AppstoreOutlined />
              Categories
            </span>
          }
          key="2"
        >
          <ArticleCategoryManagement />
        </TabPane>
        <TabPane
          tab={
            <span>
              <TagOutlined />
              Tags
            </span>
          }
          key="3"
        >
          <ArticleTagManagement />
        </TabPane>
        <TabPane
          tab={
            <span>
              <BarChartOutlined />
              Statistics
            </span>
          }
          key="4"
        >
          <ArticleStatistics />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ArticleManagement;
