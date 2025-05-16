import React from 'react';
import { Card, Typography, Row, Col, Statistic, Button } from 'antd';
import { UserOutlined, TeamOutlined, EnvironmentOutlined, BookOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

const AdminDashboard: React.FC = () => {
  const { user } = useAuthStore();
  
  return (
    <div className="admin-dashboard">
      <Typography.Title level={2}>Admin Dashboard</Typography.Title>
      <Typography.Paragraph>
        Welcome back, {user?.name || 'Admin'}! Here's an overview of your travel platform.
      </Typography.Paragraph>
      
      <Row gutter={[16, 16]} className="dashboard-stats">
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="Total Users" 
              value={1205} 
              prefix={<UserOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="Guides" 
              value={48} 
              prefix={<TeamOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="Locations" 
              value={120} 
              prefix={<EnvironmentOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="Bookings" 
              value={356} 
              prefix={<BookOutlined />} 
            />
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]} className="dashboard-actions" style={{ marginTop: '24px' }}>
        <Col xs={24} sm={12} md={8}>
          <Card title="User Management" style={{ height: '100%' }}>
            <p>Manage user accounts, roles and permissions</p>
            <Button type="primary">
              <Link to="/admin/users">Manage Users</Link>
            </Button>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card title="Location Management" style={{ height: '100%' }}>
            <p>Add, edit or remove travel destinations</p>
            <Button type="primary">
              <Link to="/admin/locations/manage">Manage Locations</Link>
            </Button>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card title="Guide Management" style={{ height: '100%' }}>
            <p>Review and manage guide profiles and content</p>
            <Button type="primary">
              <Link to="/admin/guides/manage">Manage Guides</Link>
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;