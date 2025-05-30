import React, { useEffect, useState } from 'react';
import { Card, Typography, Row, Col, Statistic, Button, Spin, Alert, Divider, Space, Tag } from 'antd';
import { UserOutlined, TeamOutlined, EnvironmentOutlined, BookOutlined, LineChartOutlined, EyeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { getDashboardStats, getSystemStatus } from '@/services/api/dashboardService';
import type { DashboardStats, SystemStatus } from '@/services/api/dashboardService';
import { getAdminStats, getSystemHealth } from '@/services/api/adminService';
import type { AdminStats } from '@/services/api/adminService';

const AdminDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [systemHealth, setSystemHealth] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Custom style for system status items
  const systemStatusStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch data from both services in parallel
        const [dashStats, admStats, health] = await Promise.all([
          getDashboardStats(),
          getAdminStats(),
          getSystemHealth()
        ]);
        
        setDashboardStats(dashStats);
        setAdminStats(admStats);
        setSystemHealth(health);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);
    return (
    <div className="admin-dashboard">
      <Typography.Title level={2}>Admin Dashboard</Typography.Title>
      <Typography.Paragraph>
        Welcome back, {user?.full_name || user?.email || 'Admin'}! Here's an overview of your travel platform.
      </Typography.Paragraph>
        {error && (
        <Alert 
          message="Error" 
          description={error}
          type="error" 
          showIcon 
          style={{ marginBottom: 16 }}
        />
      )}
      
      {loading ? (
        <div className="text-center p-8">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Row gutter={[16, 16]} className="dashboard-stats">
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic 
                  title="Total Users" 
                  value={dashboardStats?.totalUsers || adminStats?.usersCount || 0} 
                  prefix={<UserOutlined />} 
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic 
                  title="Guides" 
                  value={dashboardStats?.totalGuides || 0} 
                  prefix={<TeamOutlined />} 
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic 
                  title="Locations" 
                  value={dashboardStats?.totalLocations || adminStats?.locationsCount || 0} 
                  prefix={<EnvironmentOutlined />} 
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic 
                  title="Content Items" 
                  value={dashboardStats?.totalContent || adminStats?.contentrCount || 0} 
                  prefix={<BookOutlined />} 
                />
              </Card>
            </Col>
          </Row>
          
          {/* System health status */}
          {systemHealth && (
            <div style={{ marginTop: 24 }}>
              <Typography.Title level={4}>System Health</Typography.Title>
              <Card>
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={8}>                    <div style={systemStatusStyle}>
                      <div>Overall Status:</div>
                      <div>
                        <Tag color={
                          systemHealth.status === 'healthy' ? 'green' : 
                          systemHealth.status === 'degraded' ? 'orange' : 'red'
                        }>
                          {systemHealth.status?.toUpperCase()}
                        </Tag>
                      </div>
                    </div>
                  </Col>
                  <Col xs={12} md={4}>                    <div style={systemStatusStyle}>
                      <div>API:</div>
                      <div>
                        <Tag color={systemHealth.api === 'up' ? 'green' : 'red'}>
                          {systemHealth.api === 'up' ? 'OPERATIONAL' : 'DOWN'}
                        </Tag>
                      </div>
                    </div>
                  </Col>
                  <Col xs={12} md={4}>                    <div style={systemStatusStyle}>
                      <div>Database:</div>
                      <div>
                        <Tag color={systemHealth.database === 'up' ? 'green' : 'red'}>
                          {systemHealth.database === 'up' ? 'OPERATIONAL' : 'DOWN'}
                        </Tag>
                      </div>
                    </div>
                  </Col>
                  <Col xs={12} md={4}>                    <div style={systemStatusStyle}>
                      <div>Cache:</div>
                      <div>
                        <Tag color={systemHealth.cache === 'up' ? 'green' : 'red'}>
                          {systemHealth.cache === 'up' ? 'OPERATIONAL' : 'DOWN'}
                        </Tag>
                      </div>
                    </div>
                  </Col>
                  <Col xs={12} md={4}>                    <div style={systemStatusStyle}>
                      <div>Storage:</div>
                      <div>
                        <Tag color={systemHealth.storage === 'up' ? 'green' : 'red'}>
                          {systemHealth.storage === 'up' ? 'OPERATIONAL' : 'DOWN'}
                        </Tag>
                      </div>
                    </div>
                  </Col>
                </Row>
                <Divider style={{ margin: '16px 0' }} />
                <Row gutter={[16, 16]}>
                  <Col xs={12} md={8}>
                    <Statistic title="Response Time" value={systemHealth.responseTime || 0} suffix="ms" />
                  </Col>
                  <Col xs={12} md={8}>
                    <Statistic title="Uptime" value={Math.floor((systemHealth.uptime || 0) / 3600)} suffix="hours" />
                  </Col>
                  <Col xs={24} md={8}>
                    <Statistic 
                      title="Last Restart" 
                      value={systemHealth.lastRestart ? new Date(systemHealth.lastRestart).toLocaleString() : 'Unknown'} 
                    />
                  </Col>
                </Row>
              </Card>
            </div>
          )}
        </>
      )}
      
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