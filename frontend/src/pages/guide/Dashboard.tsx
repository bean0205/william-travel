import React, { useState, useEffect } from 'react';
import { Card, Typography, Row, Col, Statistic, Button, Divider, List, Avatar, Spin, Empty, message } from 'antd';
import { TeamOutlined, StarOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { getToursByGuideId, getTourStatsByGuideId, Tour, TourStats } from '@/services/api/tourService';

const GuideDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [tours, setTours] = useState<Tour[]>([]);
  const [stats, setStats] = useState<TourStats>({
    totalTours: 0,
    totalBookings: 0,
    averageRating: 0,
    viewsByMonth: [],
    bookingsByMonth: []
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchTourData = async () => {
      if (!user?.id) {
        return;
      }
      
      try {
        setLoading(true);
        // Fetch tour data
        const [toursData, statsData] = await Promise.all([
          getToursByGuideId(user.id.toString()),
          getTourStatsByGuideId(user.id.toString())
        ]);
        
        setTours(Array.isArray(toursData) ? toursData : toursData.items || []);
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching guide data:', error);
        message.error('Failed to load tour data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTourData();
  }, [user]);
  
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <p>Loading dashboard data...</p>
      </div>
    );
  }
  
  return (
    <div className="guide-dashboard">
      <Typography.Title level={2}>Guide Dashboard</Typography.Title>
      <Typography.Paragraph>
        Welcome back, {user?.full_name || 'Guide'}! Here's how your tours are performing.
      </Typography.Paragraph>
      
      <Row gutter={[16, 16]} className="dashboard-stats">
        <Col xs={24} sm={8}>
          <Card>
            <Statistic 
              title="Total Tours" 
              value={stats.totalTours} 
              prefix={<TeamOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic 
              title="Total Bookings" 
              value={stats.totalBookings} 
              prefix={<StarOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic 
              title="Average Rating" 
              value={stats.averageRating} 
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
          {tours.length > 0 ? (
            <List
              itemLayout="horizontal"
              dataSource={tours}
              renderItem={(item: Tour) => (
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
                    description={`${item.views || 0} views • ${item.bookings || 0} bookings • ${item.rating?.toFixed(1) || 'No'} rating`}
                  />
                </List.Item>
              )}
            />
          ) : (
            <Empty description="No tours created yet" />
          )}
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