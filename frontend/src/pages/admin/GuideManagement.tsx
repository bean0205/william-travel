import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, Typography, Input, Avatar, Rate, Tabs, Card, Spin, message } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  TeamOutlined,
  BarChartOutlined,
  TableOutlined,
  CheckCircleOutlined,
  GlobalOutlined
} from '@ant-design/icons';
import { Permission } from '@/utils/permissions';
import { PermissionGuard } from '@/components/common/PermissionGuards';
import GuideStatistics from '@/components/admin/GuideStatistics';
import GuideForm from '@/components/admin/GuideForm';
import { getGuides, createGuide, updateGuide, deleteGuide, Guide } from '@/services/api/guideService';

const { Search } = Input;
const { TabPane } = Tabs;

interface GuideStats {
  totalGuides: number;
  activeGuides: number;
  verifiedGuides: number;
  averageRating: number;
  guidesByLanguage: Array<{ name: string; value: number }>;
  guidesBySpecialty: Array<{ name: string; value: number }>;
  bookingsPerMonth: Array<{ month: string; count: number }>;
  ratingDistribution: Array<{ rating: string; count: number }>;
  topRatedGuides: Array<{ name: string; rating: number }>;
}

const GuideManagement: React.FC = () => {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('table');
  const [formLoading, setFormLoading] = useState(false);
  const [specialtyFilter, setSpecialtyFilter] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [stats, setStats] = useState<GuideStats>({
    totalGuides: 0,
    activeGuides: 0,
    verifiedGuides: 0,
    averageRating: 0,
    guidesByLanguage: [],
    guidesBySpecialty: [],
    bookingsPerMonth: [],
    ratingDistribution: [],
    topRatedGuides: [],
  });

  useEffect(() => {
    fetchGuides();
  }, [currentPage, pageSize]);

  const fetchGuides = async () => {
    try {
      setIsLoading(true);
      const data = await getGuides({
        skip: (currentPage - 1) * pageSize,
        limit: pageSize,
        role: 'guide'
      });

      if (Array.isArray(data)) {
        setGuides(data);
        setTotalItems(data.length);
      } else if (data && Array.isArray(data.items)) {
        setGuides(data.items);
        setTotalItems(data.total || data.items.length);
      } else {
        setGuides([]);
        setTotalItems(0);
      }

      calculateStatistics(Array.isArray(data) ? data : (data?.items || []));
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching guides:', error);
      message.error('Failed to fetch guides');
      setIsLoading(false);
    }
  };

  const calculateStatistics = (data: Guide[]) => {
    const activeCount = data.filter(guide => guide.isActive).length;
    const verifiedCount = data.filter(guide => guide.isVerified).length;

    let totalRating = 0;
    let ratedGuides = 0;
    data.forEach(guide => {
      if (guide.rating) {
        totalRating += guide.rating;
        ratedGuides++;
      }
    });
    const avgRating = ratedGuides > 0 ? totalRating / ratedGuides : 0;

    const languagesData: Record<string, number> = {};
    data.forEach(guide => {
      if (guide.languages) {
        const langs = guide.languages.split(',').map(lang => lang.trim());
        langs.forEach(lang => {
          if (lang) {
            languagesData[lang] = (languagesData[lang] || 0) + 1;
          }
        });
      }
    });
    const languageStats = Object.entries(languagesData)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const specialtiesData: Record<string, number> = {};
    data.forEach(guide => {
      if (guide.specialties) {
        const specs = guide.specialties.split(',').map(spec => spec.trim());
        specs.forEach(spec => {
          if (spec) {
            specialtiesData[spec] = (specialtiesData[spec] || 0) + 1;
          }
        });
      }
    });
    const specialtyStats = Object.entries(specialtiesData)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const bookingsData = [
      { month: 'Jan', count: Math.floor(Math.random() * 30) + 20 },
      { month: 'Feb', count: Math.floor(Math.random() * 30) + 20 },
      { month: 'Mar', count: Math.floor(Math.random() * 30) + 20 },
      { month: 'Apr', count: Math.floor(Math.random() * 30) + 20 },
      { month: 'May', count: Math.floor(Math.random() * 30) + 20 },
      { month: 'Jun', count: Math.floor(Math.random() * 30) + 20 },
    ];

    const ratingDist: Record<string, number> = { '1.0': 0, '2.0': 0, '3.0': 0, '4.0': 0, '5.0': 0 };
    data.forEach(guide => {
      if (guide.rating) {
        const roundedRating = Math.floor(guide.rating).toFixed(1);
        ratingDist[roundedRating] = (ratingDist[roundedRating] || 0) + 1;
      }
    });
    const ratingDistribution = Object.entries(ratingDist)
      .map(([rating, count]) => ({ rating, count }));

    const topRatedGuides = [...data]
      .filter(guide => guide.rating)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 5)
      .map(guide => ({
        name: guide.name,
        rating: guide.rating || 0
      }));

    setStats({
      totalGuides: totalItems,
      activeGuides: activeCount,
      verifiedGuides: verifiedCount,
      averageRating: avgRating,
      guidesByLanguage: languageStats,
      guidesBySpecialty: specialtyStats,
      bookingsPerMonth: bookingsData,
      ratingDistribution: ratingDistribution,
      topRatedGuides: topRatedGuides,
    });
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
    const filtered = guides.filter(guide =>
      guide.name.toLowerCase().includes(value.toLowerCase()) ||
      (guide.email && guide.email.toLowerCase().includes(value.toLowerCase())) ||
      (guide.phoneNumber && guide.phoneNumber.includes(value))
    );
    calculateStatistics(filtered);
  };

  const handleCreateGuide = () => {
    setSelectedGuide(null);
    setIsModalVisible(true);
  };

  const handleEditGuide = (guide: Guide) => {
    setSelectedGuide(guide);
    setIsModalVisible(true);
  };

  const handleDeleteGuide = async (id: string) => {
    try {
      await deleteGuide(id);
      message.success('Guide deleted successfully');
      fetchGuides();
    } catch (error) {
      console.error(`Error deleting guide with ID ${id}:`, error);
      message.error('Failed to delete guide');
    }
  };

  const handleFormSubmit = async (guideData: Partial<Guide>) => {
    try {
      setFormLoading(true);
      if (selectedGuide) {
        await updateGuide(selectedGuide.id || '', guideData);
        message.success('Guide updated successfully');
      } else {
        await createGuide(guideData);
        message.success('Guide created successfully');
      }
      setIsModalVisible(false);
      setFormLoading(false);
      fetchGuides();
    } catch (error) {
      console.error('Error saving guide:', error);
      message.error('Failed to save guide');
      setFormLoading(false);
    }
  };

  const columns = [
    {
      title: 'Guide',
      key: 'guide',
      render: (text: string, record: Guide) => (
        <div className="flex items-center">
          <Avatar
            src={record.profileImage}
            size={64}
            className="mr-3"
          />
          <div>
            <div className="font-medium text-base">{record.name}</div>
            <div className="text-gray-500">{record.email}</div>
            <div className="text-gray-500 text-sm">{record.phoneNumber}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Specialties',
      dataIndex: 'specialties',
      key: 'specialties',
      render: (specialties: string) => (
        <div>
          {specialties?.split(',').map((specialty, index) => (
            <Tag key={index} color="blue">{specialty.trim()}</Tag>
          ))}
        </div>
      ),
    },
    {
      title: 'Languages',
      dataIndex: 'languages',
      key: 'languages',
      render: (languages: string) => (
        <div>
          {languages?.split(',').map((language, index) => (
            <Tag key={index} color="green" icon={<GlobalOutlined />}>{language.trim()}</Tag>
          ))}
        </div>
      ),
    },
    {
      title: 'Experience',
      dataIndex: 'experience',
      key: 'experience',
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      sorter: (a: Guide, b: Guide) => (a.rating || 0) - (b.rating || 0),
      render: (rating: number) => (
        <div className="flex items-center">
          <Rate disabled defaultValue={rating} allowHalf style={{ fontSize: '16px' }} />
          <span className="ml-2">{rating?.toFixed(1)}</span>
        </div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (text: string, record: Guide) => (
        <div className="space-y-1">
          {record.isVerified && (
            <Tag color="blue" icon={<CheckCircleOutlined />}>Verified</Tag>
          )}
          <Tag color={record.isActive ? 'green' : 'orange'}>
            {record.isActive ? 'Active' : 'Inactive'}
          </Tag>
        </div>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: string, record: Guide) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditGuide(record)}
            type="link"
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteGuide(record.id || '')}
            type="link"
            danger
          />
        </Space>
      ),
    },
  ];

  const filteredGuides = guides.filter(guide => {
    const matchesSearch = searchTerm ?
      guide.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (guide.email && guide.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (guide.phoneNumber && guide.phoneNumber.includes(searchTerm)) :
      true;

    const matchesSpecialty = specialtyFilter ?
      guide.specialties && guide.specialties.toLowerCase().includes(specialtyFilter.toLowerCase()) :
      true;

    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="p-6">
      <Typography.Title level={2}>
        <TeamOutlined /> Guide Management
      </Typography.Title>

      <Tabs activeKey={activeTab} onChange={setActiveTab} className="mb-6">
        <TabPane
          tab={<span><TableOutlined /> Guides List</span>}
          key="table"
        >
          <div className="mb-4 flex justify-between flex-wrap">
            <Search
              placeholder="Search guides by name or contact"
              onSearch={handleSearch}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: 300, marginBottom: 16 }}
            />

            <PermissionGuard permission={Permission.CreateGuide}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreateGuide}
              >
                Add Guide
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
              dataSource={filteredGuides}
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
                showTotal: (total) => `Total ${total} guides`,
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
            <GuideStatistics stats={stats} />
          )}
        </TabPane>
      </Tabs>

      {isModalVisible && (
        <Card
          title={selectedGuide ? "Edit Guide" : "Create Guide"}
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
          <GuideForm
            guide={selectedGuide || undefined}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsModalVisible(false)}
            loading={formLoading}
          />
        </Card>
      )}
    </div>
  );
};

export default GuideManagement;
