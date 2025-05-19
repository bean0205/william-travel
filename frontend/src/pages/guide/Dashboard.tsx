import React from 'react';
import { Card, Typography, Row, Col, Statistic, Button, Divider, List, Avatar } from 'antd';
import { TeamOutlined, StarOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

// Mock data for guide's tours
const mockTours = [
  {
    id: '1',
    title: 'Historic City Walking Tour',
    views: 245,
    bookings: 12,
    rating: 4.8,
  },
  {
    id: '2',
    title: 'Mountain Hiking Adventure',
    views: 187,
    bookings: 8,
    rating: 4.7,
  },
  {
    id: '3',
    title: 'Local Food Experience',
    views: 302,
    bookings: 15,
    rating: 4.9,
  },
];

const GuideDashboard: React.FC = () => {
  const { user } = useAuthStore();
  
  return (
    <div className="guide-dashboard">
      <Typography.Title level={2}>Guide Dashboard</Typography.Title>
      <Typography.Paragraph>
        Welcome back, {user?.name || 'Guide'}! Here's how your tours are performing.
      </Typography.Paragraph>
      
      <Row gutter={[16, 16]} className="dashboard-stats">
        <Col xs={24} sm={8}>
          <Card>
            <Statistic 
              title="Total Tours" 
              value={3} 
              prefix={<TeamOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic 
              title="Total Bookings" 
              value={35} 
              prefix={<StarOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic 
              title="Average Rating" 
              value={4.8} 
              prefix={<EyeOutlined />} 
              precision={1}
              suffix="/5"
            />
          </Card>
        </Col>
      </Row>
      
      <Divider orientation="left">Your Tours</Divider>
      
      <Row>
        <Col span={24}>
          <List
            itemLayout="horizontal"
            dataSource={mockTours}
            renderItem={item => (
              <List.Item
                actions={[
                  <Button key="edit">
                    <Link to={`/guides/edit/${item.id}`}>Edit</Link>
                  </Button>
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar icon={<TeamOutlined />} />}
                  title={<Link to={`/guides/${item.id}`}>{item.title}</Link>}
                  description={`${item.views} views • ${item.bookings} bookings • ${item.rating} rating`}
                />
              </List.Item>
            )}
          />
        </Col>
      </Row>
      
      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        <Button type="primary" icon={<PlusOutlined />}>
          <Link to="/guides/create">Create New Tour</Link>
        </Button>
      </div>
    </div>
  );
};

export default GuideDashboard;