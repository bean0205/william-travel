import React, { useState } from 'react';
import { Table, Button, Space, Tag, Typography, Card, Tabs, Statistic, Row, Col } from 'antd';
import { EditOutlined, EyeOutlined, CalendarOutlined, TeamOutlined, DollarOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

const { TabPane } = Tabs;

// Mock data
const mockMyGuides = [
  {
    id: '1',
    title: 'Historic City Walking Tour',
    location: 'Paris, France',
    duration: '3 hours',
    price: 35,
    categories: ['historical', 'cultural'],
    bookings: 12,
    rating: 4.8,
    status: 'active',
  },
  {
    id: '2',
    title: 'Local Food Experience',
    location: 'Paris, France',
    duration: '4 hours',
    price: 45,
    categories: ['food', 'cultural'],
    bookings: 8,
    rating: 4.9,
    status: 'active',
  },
  {
    id: '3',
    title: 'Secret Gardens Tour',
    location: 'Paris, France',
    duration: '2 hours',
    price: 25,
    categories: ['nature', 'historical'],
    bookings: 3,
    rating: 4.6,
    status: 'inactive',
  },
];

const mockBookings = [
  {
    id: '1',
    tourId: '1',
    tourName: 'Historic City Walking Tour',
    customerName: 'John Smith',
    bookingDate: '2025-05-20',
    participants: 2,
    status: 'confirmed',
    totalAmount: 70,
  },
  {
    id: '2',
    tourId: '1',
    tourName: 'Historic City Walking Tour',
    customerName: 'Alice Brown',
    bookingDate: '2025-05-23',
    participants: 4,
    status: 'confirmed',
    totalAmount: 140,
  },
  {
    id: '3',
    tourId: '2',
    tourName: 'Local Food Experience',
    customerName: 'David Wilson',
    bookingDate: '2025-05-21',
    participants: 2,
    status: 'pending',
    totalAmount: 90,
  },
];

const MyGuidesPage: React.FC = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('1');
  
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
  
  return (
    <div className="my-guides-page">
      <Typography.Title level={2}>My Tours & Bookings</Typography.Title>
      <Typography.Paragraph>
        Welcome, {user?.name}! Manage your tours and bookings here.
      </Typography.Paragraph>
      
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={16}>
          <Col span={8}>
            <Statistic
              title="Active Tours"
              value={mockMyGuides.filter(g => g.status === 'active').length}
              prefix={<TeamOutlined />}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Upcoming Bookings"
              value={mockBookings.filter(b => b.status === 'confirmed').length}
              prefix={<CalendarOutlined />}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Total Earnings"
              value={mockBookings.reduce((sum, b) => sum + b.totalAmount, 0)}
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
              dataSource={mockMyGuides} 
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </TabPane>
          <TabPane tab="Bookings" key="2">
            <Table 
              columns={bookingsColumns} 
              dataSource={mockBookings} 
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default MyGuidesPage;
