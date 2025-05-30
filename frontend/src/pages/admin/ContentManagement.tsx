import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, Typography, Input, Tabs, Card, Spin, message } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  FileTextOutlined,
  BarChartOutlined,
  TableOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { Permission } from '@/utils/permissions';
import { PermissionGuard } from '@/components/common/PermissionGuards';
import ContentStatistics from '@/components/admin/ContentStatistics';
import ContentForm from '@/components/admin/ContentForm';
import {
  getContents,
  getArticles,
  createContent,
  createArticle,
  updateContent,
  updateArticle,
  deleteContent,
  deleteArticle,
  Content,
  getArticleCategories,
  getArticleTags
} from '@/services/api/contentService';

const { Search } = Input;
const { TabPane } = Tabs;

interface ContentStats {
  totalContent: number;
  publishedContent: number;
  draftContent: number;
  archivedContent: number;
  contentByType: Array<{ name: string; value: number }>;
  contentByMonth: Array<{ month: string; count: number }>;
  popularCategories: Array<{ name: string; value: number }>;
}

const ContentManagement: React.FC = () => {
  const [contents, setContents] = useState<Content[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('table');
  const [formLoading, setFormLoading] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [stats, setStats] = useState<ContentStats>({
    totalContent: 0,
    publishedContent: 0,
    draftContent: 0,
    archivedContent: 0,
    contentByType: [],
    contentByMonth: [],
    popularCategories: [],
  });

  useEffect(() => {
    fetchContents();
    fetchCategories();
    fetchTags();
  }, [currentPage, pageSize]);

  const fetchContents = async () => {
    try {
      setIsLoading(true);
      const data = await getArticles({
        page: currentPage,
        limit: pageSize,
        published: statusFilter === 'published' ? true : undefined
      });

      if (Array.isArray(data)) {
        setContents(data);
        setTotalItems(data.length);
      } else if (data && Array.isArray(data.items)) {
        setContents(data.items);
        setTotalItems(data.total || data.items.length);
      } else {
        setContents([]);
        setTotalItems(0);
      }

      calculateStatistics(Array.isArray(data) ? data : (data?.items || []));
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching contents:', error);
      message.error('Failed to fetch content');
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getArticleCategories();
      if (Array.isArray(data)) {
        setCategories(data);
      } else if (data && Array.isArray(data.items)) {
        setCategories(data.items);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchTags = async () => {
    try {
      const data = await getArticleTags();
      if (Array.isArray(data)) {
        setTags(data);
      } else if (data && Array.isArray(data.items)) {
        setTags(data.items);
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const calculateStatistics = (data: Content[]) => {
    const publishedCount = data.filter(content => content.status === 'published').length;
    const draftCount = data.filter(content => content.status === 'draft').length;
    const archivedCount = data.filter(content => content.status === 'archived').length;

    const typeMap = new Map();
    data.forEach(content => {
      const type = content.contentType || 'Unknown';
      typeMap.set(type, (typeMap.get(type) || 0) + 1);
    });

    const typeStats = Array.from(typeMap.entries()).map(([name, value]) => ({
      name,
      value,
    }));

    const categoryMap = new Map();
    data.forEach(content => {
      const category = content.categoryId || 'Uncategorized';
      let categoryName = 'Uncategorized';
      if (categories.length > 0) {
        const foundCategory = categories.find(c => c.id === content.categoryId);
        if (foundCategory) {
          categoryName = foundCategory.name;
        }
      } else {
        categoryName = category;
      }
      categoryMap.set(categoryName, (categoryMap.get(categoryName) || 0) + 1);
    });

    const categoryStats = Array.from(categoryMap.entries())
      .map(([name, value]) => ({
        name,
        value,
      }))
      .sort((a, b) => b.value as number - a.value as number);

    const monthMap = new Map();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    data.forEach(content => {
      if (content.createdAt) {
        const date = new Date(content.createdAt);
        const monthName = months[date.getMonth()];
        monthMap.set(monthName, (monthMap.get(monthName) || 0) + 1);
      }
    });

    const monthData = months.map(month => ({
      month,
      count: monthMap.get(month) || 0,
    }));

    setStats({
      totalContent: totalItems,
      publishedContent: publishedCount,
      draftContent: draftCount,
      archivedContent: archivedCount,
      contentByType: typeStats,
      contentByMonth: monthData,
      popularCategories: categoryStats.slice(0, 10),
    });
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
    const filtered = contents.filter(content =>
      content.title.toLowerCase().includes(value.toLowerCase()) ||
      (content.body && content.body.toLowerCase().includes(value.toLowerCase())) ||
      (content.slug && content.slug.toLowerCase().includes(value.toLowerCase()))
    );
    calculateStatistics(filtered);
  };

  const handleCreateContent = () => {
    setSelectedContent(null);
    setIsModalVisible(true);
  };

  const handleEditContent = (content: Content) => {
    setSelectedContent(content);
    setIsModalVisible(true);
  };

  const handleDeleteContent = async (id: string) => {
    try {
      await deleteArticle(Number(id));
      message.success('Content deleted successfully');
      fetchContents();
    } catch (error) {
      console.error(`Error deleting content with ID ${id}:`, error);
      message.error('Failed to delete content');
    }
  };

  const handleFormSubmit = async (contentData: Partial<Content>) => {
    try {
      setFormLoading(true);

      if (selectedContent) {
        await updateArticle(Number(selectedContent.id), contentData);
        message.success('Content updated successfully');
      } else {
        await createArticle(contentData);
        message.success('Content created successfully');
      }

      setIsModalVisible(false);
      setFormLoading(false);
      fetchContents();
    } catch (error) {
      console.error('Error saving content:', error);
      message.error('Failed to save content');
      setFormLoading(false);
    }
  };

  const handleTypeFilter = (type: string | null) => {
    setTypeFilter(type);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status: string | null) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: Content) => (
        <div className="max-w-md">
          <div className="font-medium">{text}</div>
          <div className="text-gray-500 text-sm truncate">/{record.slug}</div>
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'contentType',
      key: 'contentType',
      render: (type: string) => {
        let color = 'default';
        switch (type) {
          case 'page':
            color = 'purple';
            break;
          case 'article':
            color = 'blue';
            break;
          case 'blog':
            color = 'green';
            break;
          case 'news':
            color = 'orange';
            break;
          default:
            color = 'default';
        }
        return <Tag color={color}>{type || 'unknown'}</Tag>;
      },
      filters: [
        { text: 'Page', value: 'page' },
        { text: 'Article', value: 'article' },
        { text: 'Blog', value: 'blog' },
        { text: 'News', value: 'news' },
      ],
      onFilter: (value: string, record: Content) => record.contentType === value,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'default';
        switch (status) {
          case 'published':
            color = 'green';
            break;
          case 'draft':
            color = 'orange';
            break;
          case 'archived':
            color = 'red';
            break;
          default:
            color = 'default';
        }
        return <Tag color={color}>{status || 'unknown'}</Tag>;
      },
      filters: [
        { text: 'Published', value: 'published' },
        { text: 'Draft', value: 'draft' },
        { text: 'Archived', value: 'archived' },
      ],
      onFilter: (value: string, record: Content) => record.status === value,
    },
    {
      title: 'Category',
      key: 'category',
      render: (text: string, record: Content) => {
        if (categories.length > 0 && record.categoryId) {
          const category = categories.find(c => c.id === record.categoryId);
          if (category) {
            return category.name;
          }
        }
        return record.categoryId || 'Uncategorized';
      },
    },
    {
      title: 'Featured',
      dataIndex: 'featured',
      key: 'featured',
      render: (featured: boolean) => featured && <Tag color="gold">Featured</Tag>,
    },
    {
      title: 'Views',
      dataIndex: 'viewCount',
      key: 'viewCount',
      sorter: (a: Content, b: Content) => (a.viewCount || 0) - (b.viewCount || 0),
    },
    {
      title: 'Last Updated',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date: string) => date ? new Date(date).toLocaleDateString() : 'N/A',
      sorter: (a: Content, b: Content) =>
        new Date(a.updatedAt || '').getTime() - new Date(b.updatedAt || '').getTime(),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: string, record: Content) => (
        <Space size="middle">
          {record.slug && (
            <Button
              icon={<EyeOutlined />}
              type="link"
              title="View Content"
              onClick={() => window.open(`/${record.slug}`, '_blank')}
            />
          )}
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditContent(record)}
            type="link"
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteContent(record.id || '')}
            type="link"
            danger
          />
        </Space>
      ),
    },
  ];

  const filteredContents = contents.filter(content => {
    const matchesSearch =
      searchTerm
        ? content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (content.body && content.body.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (content.slug && content.slug.toLowerCase().includes(searchTerm.toLowerCase()))
        : true;

    const matchesType = typeFilter ? content.contentType === typeFilter : true;
    const matchesStatus = statusFilter ? content.status === statusFilter : true;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="p-6">
      <Typography.Title level={2}>
        <FileTextOutlined /> Content Management
      </Typography.Title>

      <Tabs activeKey={activeTab} onChange={setActiveTab} className="mb-6">
        <TabPane tab={<span><TableOutlined /> Content List</span>} key="table">
          <div className="mb-4 flex justify-between flex-wrap">
            <Search
              placeholder="Search content by title or body"
              onSearch={handleSearch}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: 300, marginBottom: 16 }}
            />

            <PermissionGuard permission={Permission.CreateContent}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreateContent}
              >
                Add Content
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
              dataSource={filteredContents}
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
                showTotal: (total) => `Total ${total} content items`,
              }}
            />
          )}
        </TabPane>
        <TabPane tab={<span><BarChartOutlined /> Statistics</span>} key="statistics">
          {isLoading ? (
            <div className="flex justify-center items-center h-60">
              <Spin size="large" />
            </div>
          ) : (
            <ContentStatistics stats={stats} />
          )}
        </TabPane>
      </Tabs>

      {isModalVisible && (
        <Card
          title={selectedContent ? "Edit Content" : "Create Content"}
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
          <ContentForm
            content={selectedContent || undefined}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsModalVisible(false)}
            loading={formLoading}
          />
        </Card>
      )}
    </div>
  );
};

export default ContentManagement;

