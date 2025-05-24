import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, Typography, Card, Tabs, Statistic, Row, Col, Spin, Empty, message } from 'antd';
import { EditOutlined, EyeOutlined, CalendarOutlined, TeamOutlined, DollarOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { getToursByGuideId, getTourStatsByGuideId, Tour } from '@/services/api/tourService';
import { getBookingsByGuideId, Booking } from '@/services/api/bookingService';

const { TabPane } = Tabs;

const MyGuidesPage: React.FC = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('1');
  const [tours, setTours] = useState<Tour[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Tours table columns
  const toursColumns = [
    {
      title: 'Tour Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: any) => <Link to={`/guides/${record.id}`}>{text}</Link>,
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${price}`,
    },
    {
      title: 'Categories',
      dataIndex: 'categories',
      key: 'categories',
      render: (categories: string[]) => (
        <>
          {categories.map(category => (
            <Tag color="blue" key={category}>
              {category.toUpperCase()}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: 'Bookings',
      dataIndex: 'bookings',
      key: 'bookings',
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
          <Button icon={<EyeOutlined />}>
            <Link to={`/guides/${record.id}`}>View</Link>
          </Button>
          <Button icon={<EditOutlined />}>
            <Link to={`/guides/edit/${record.id}`}>Edit</Link>
          </Button>
        </Space>
      ),
    },
  ];
  
  // Bookings table columns
  const bookingsColumns = [
    {
      title: 'Booking ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tour',
      dataIndex: 'tourName',
      key: 'tourName',
    },
    {
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Date',
      dataIndex: 'bookingDate',
      key: 'bookingDate',
    },
    {
      title: 'Participants',
      dataIndex: 'participants',
      key: 'participants',
    },
    {
      title: 'Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => `$${amount}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'confirmed' ? 'green' : 'gold';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
  ];
    useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) {
        return;
      }
      
      try {
        setLoading(true);
        const [toursData, bookingsData] = await Promise.all([
          getToursByGuideId(user.id.toString()),
          getBookingsByGuideId(user.id.toString())
        ]);
        
        setTours(Array.isArray(toursData) ? toursData : toursData.items || []);
        setBookings(Array.isArray(bookingsData) ? bookingsData : bookingsData.items || []);
      } catch (error) {
        console.error('Error fetching guide data:', error);
        setError('Failed to load tour and booking data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);
  
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <p>Loading your tours and bookings...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Empty description={error} />
        <Button type="primary" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="my-guides-page">
      <Typography.Title level={2}>My Tours & Bookings</Typography.Title>
      <Typography.Paragraph>
        Welcome, {user?.full_name || 'Guide'}! Manage your tours and bookings here.
      </Typography.Paragraph>
      
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={16}>
          <Col span={8}>
            <Statistic
              title="Active Tours"
              value={tours.filter(g => g.status === 'active').length}
              prefix={<TeamOutlined />}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Upcoming Bookings"
              value={bookings.filter(b => b.status === 'confirmed').length}
              prefix={<CalendarOutlined />}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Total Earnings"
              value={bookings.reduce((sum, b) => sum + b.totalAmount, 0)}
              prefix={<DollarOutlined />}
              precision={2}
              prefix="$"
            />
          </Col>
        </Row>
      </Card>
      
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="My Tours" key="1">
            <div style={{ marginBottom: '16px', textAlign: 'right' }}>
              <Button type="primary">
                <Link to="/guides/create">Create New Tour</Link>
              </Button>
            </div>
            <Table 
              columns={toursColumns} 
              dataSource={tours} 
              rowKey="id"
              pagination={{ pageSize: 10 }}
              loading={loading}
            />
          </TabPane>
          <TabPane tab="Bookings" key="2">
            <Table 
              columns={bookingsColumns} 
              dataSource={bookings} 
              rowKey="id"
              pagination={{ pageSize: 10 }}
              loading={loading}
            />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default MyGuidesPage;
