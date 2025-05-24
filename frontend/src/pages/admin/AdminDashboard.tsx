import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { getDashboardStats, getSystemStatus } from '@/services/api/dashboardService';
import type { DashboardStats, SystemStatus } from '@/services/api/dashboardService';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [stats, status] = await Promise.all([
          getDashboardStats(),
          getSystemStatus()
        ]);
        setDashboardStats(stats);
        setSystemStatus(status);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const adminSections = [
    {
      id: 'content',
      title: 'Content Management',
      description: 'Manage all content types',
      subsections: [
        { name: 'Articles', path: '/admin/articles', icon: '📰', count: dashboardStats?.totalContent || 0 },
        { name: 'Events', path: '/admin/events', icon: '🗓️', count: 'N/A' },
        { name: 'Community Posts', path: '/admin/community-posts', icon: '💬', count: 'N/A' },
        { name: 'Media Files', path: '/admin/media', icon: '🖼️', count: 'N/A' },
      ]
    },
    {
      id: 'locations',
      title: 'Location & Places',
      description: 'Manage geographical data and places',
      subsections: [
        { name: 'Locations', path: '/admin/locations', icon: '📍', count: dashboardStats?.totalLocations || 0 },
        { name: 'Accommodations', path: '/admin/accommodations', icon: '🏨', count: 'N/A' },
        { name: 'Restaurants', path: '/admin/foods', icon: '🍽️', count: 'N/A' },
        { name: 'Continents', path: '/admin/locations/continents', icon: '🌍', count: '7' },
        { name: 'Countries', path: '/admin/locations/countries', icon: '🏳️', count: 'N/A' },
        { name: 'Regions', path: '/admin/locations/regions', icon: '🗺️', count: 'N/A' },
        { name: 'Districts', path: '/admin/locations/districts', icon: '🏘️', count: 'N/A' },
        { name: 'Wards', path: '/admin/locations/wards', icon: '🏠', count: 'N/A' },
      ]
    },
    {
      id: 'users',
      title: 'User Management',
      description: 'Manage users and access control',
      subsections: [
        { name: 'Users', path: '/admin/users', icon: '👥', count: dashboardStats?.totalUsers || 0 },
        { name: 'Roles', path: '/admin/roles', icon: '🔑', count: dashboardStats?.totalRoles || 0 },
        { name: 'Permissions', path: '/admin/permissions', icon: '🛡️', count: 'N/A' },
        { name: 'Guides', path: '/admin/guides', icon: '🧭', count: dashboardStats?.totalGuides || 0 },
      ]
    },
    {
      id: 'feedback',
      title: 'Reviews & Feedback',
      description: 'Monitor user feedback and ratings',
      subsections: [
        { name: 'Reviews', path: '/admin/reviews', icon: '⭐', count: 'N/A' },
        { name: 'Ratings', path: '/admin/ratings', icon: '📊', count: 'N/A' },
      ]
    },
    {
      id: 'system',
      title: 'System & Analytics',
      description: 'System management and reports',
      subsections: [
        { name: 'Reports & Analytics', path: '/admin/reports', icon: '📈', count: 'View' },
        { name: 'System Settings', path: '/admin/settings', icon: '⚙️', count: 'Config' },
      ]
    }
  ];

  const quickActions = [
    { label: 'Create Article', path: '/admin/articles/create', icon: '📝', color: 'bg-blue-500' },
    { label: 'Add Event', path: '/admin/events/create', icon: '➕', color: 'bg-green-500' },
    { label: 'Add Location', path: '/admin/locations/create', icon: '📍', color: 'bg-purple-500' },
    { label: 'Add Accommodation', path: '/admin/accommodations/create', icon: '🏨', color: 'bg-orange-500' },
    { label: 'Add Food Place', path: '/admin/foods/create', icon: '🍽️', color: 'bg-red-500' },
    { label: 'View Reports', path: '/admin/reports', icon: '📊', color: 'bg-indigo-500' },
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          Comprehensive management center for William Travel platform
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <DashboardCard
              title="Total Users"
              value={dashboardStats?.totalUsers?.toLocaleString() || '0'}
              description={dashboardStats?.userGrowth ? `+${dashboardStats.userGrowth}% from last month` : 'No growth data'}
              icon="👥"
              trend={dashboardStats?.userGrowth || 0}
              color="bg-blue-500"
            />
            <DashboardCard
              title="Content Items"
              value={dashboardStats?.totalContent?.toLocaleString() || '0'}
              description={dashboardStats?.contentGrowth ? `+${dashboardStats.contentGrowth}% from last month` : 'No growth data'}
              icon="📄"
              trend={dashboardStats?.contentGrowth || 0}
              color="bg-green-500"
            />
            <DashboardCard
              title="Active Locations"
              value={dashboardStats?.totalLocations?.toLocaleString() || '0'}
              description={dashboardStats?.locationGrowth ? `+${dashboardStats.locationGrowth}% from last month` : 'No growth data'}
              icon="🌍"
              trend={dashboardStats?.locationGrowth || 0}
              color="bg-purple-500"
            />
            <DashboardCard
              title="Monthly Views"
              value={dashboardStats?.monthlyViews ? `${(dashboardStats.monthlyViews / 1000).toFixed(1)}K` : '0'}
              description={dashboardStats?.viewsGrowth ? `+${dashboardStats.viewsGrowth}% from last month` : 'No growth data'}
              icon="📊"
              trend={dashboardStats?.viewsGrowth || 0}
              color="bg-orange-500"
            />
          </>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-6 h-auto p-1 bg-gray-100 rounded-lg">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
          >
            📊 Overview
          </TabsTrigger>
          <TabsTrigger 
            value="content" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
          >
            📝 Content
          </TabsTrigger>
          <TabsTrigger 
            value="locations" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
          >
            📍 Locations
          </TabsTrigger>
          <TabsTrigger 
            value="users" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
          >
            👥 Users
          </TabsTrigger>
          <TabsTrigger 
            value="feedback" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
          >
            ⭐ Feedback
          </TabsTrigger>
          <TabsTrigger 
            value="system" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
          >
            ⚙️ System
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Management Sections Overview */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xl font-semibold mb-4">Management Sections</h3>
              <div className="grid gap-4">
                {adminSections.map((section) => (
                  <Card key={section.id} className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg mb-2">{section.title}</h4>
                          <p className="text-gray-600 mb-4">{section.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {section.subsections.slice(0, 4).map((sub) => (
                              <Badge 
                                key={sub.path} 
                                variant="secondary" 
                                className="cursor-pointer hover:bg-gray-200 transition-colors"
                                onClick={() => navigate(sub.path)}
                              >
                                {sub.icon} {sub.name} ({sub.count})
                              </Badge>
                            ))}
                            {section.subsections.length > 4 && (
                              <Badge variant="outline" className="text-xs">
                                +{section.subsections.length - 4} more
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => setActiveTab(section.id)}
                          className="ml-4 bg-blue-500 hover:bg-blue-600"
                        >
                          Manage
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Right Column - System Status and Quick Actions */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Fast access to common tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {quickActions.map((action) => (
                      <Button
                        key={action.path}
                        variant="outline"
                        size="sm"
                        className="h-auto p-3 flex flex-col items-center space-y-1 hover:shadow-md transition-shadow"
                        onClick={() => navigate(action.path)}
                      >
                        <span className="text-lg">{action.icon}</span>
                        <span className="text-xs text-center">{action.label}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* System Status */}
              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                  <CardDescription>Real-time system health</CardDescription>
                </CardHeader>
                <CardContent>
                  {systemStatus ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>API Status</span>
                          <Badge variant={systemStatus.apiStatus === 'operational' ? 'default' : 'destructive'}>
                            {systemStatus.apiStatus}
                          </Badge>
                        </div>
                        <Progress value={systemStatus.apiStatus === 'operational' ? 100 : 50} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Database Status</span>
                          <Badge variant={systemStatus.databaseStatus === 'healthy' ? 'default' : 'secondary'}>
                            {systemStatus.databaseStatus}
                          </Badge>
                        </div>
                        <Progress value={systemStatus.databaseStatus === 'healthy' ? 85 : 60} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Storage Usage</span>
                          <span className="text-sm">{systemStatus.storageUsed}%</span>
                        </div>
                        <Progress value={systemStatus.storageUsed || 45} className="h-2" />
                      </div>
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                          Last backup: {systemStatus.lastBackup || 'No backup data'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                      <p className="text-sm text-gray-500">Loading system status...</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Key Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Key Metrics</CardTitle>
                  <CardDescription>Important platform statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Active Users</span>
                      <span className="font-bold">{dashboardStats?.activeUsers || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Pending Approvals</span>
                      <Badge variant={dashboardStats?.pendingApprovals ? 'destructive' : 'default'}>
                        {dashboardStats?.pendingApprovals || 0}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Monthly Views</span>
                      <span className="font-bold text-green-600">{dashboardStats?.monthlyViews?.toLocaleString() || 'N/A'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Content Management Tab */}
        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {adminSections.find(s => s.id === 'content')?.subsections.map((subsection) => (
              <Card key={subsection.path} className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate(subsection.path)}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">{subsection.icon}</div>
                      <div>
                        <h3 className="font-semibold text-lg">{subsection.name}</h3>
                        <p className="text-2xl font-bold text-blue-600">{subsection.count}</p>
                      </div>
                    </div>
                    <Button size="sm">Manage</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Content Overview</CardTitle>
              <CardDescription>Manage all content across the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button variant="outline" onClick={() => navigate('/admin/articles')}>
                  📰 Articles
                </Button>
                <Button variant="outline" onClick={() => navigate('/admin/events')}>
                  🗓️ Events
                </Button>
                <Button variant="outline" onClick={() => navigate('/admin/community-posts')}>
                  💬 Community Posts
                </Button>
                <Button variant="outline" onClick={() => navigate('/admin/media')}>
                  🖼️ Media Library
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Locations Management Tab */}
        <TabsContent value="locations" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {adminSections.find(s => s.id === 'locations')?.subsections.map((subsection) => (
              <Card key={subsection.path} className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate(subsection.path)}>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl mb-2">{subsection.icon}</div>
                    <h3 className="font-medium text-sm">{subsection.name}</h3>
                    <p className="text-lg font-bold text-purple-600">{subsection.count}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Location Management</CardTitle>
              <CardDescription>Manage all geographical data and places</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button variant="outline" onClick={() => navigate('/admin/locations')}>
                  📍 All Locations
                </Button>
                <Button variant="outline" onClick={() => navigate('/admin/accommodations')}>
                  🏨 Accommodations
                </Button>
                <Button variant="outline" onClick={() => navigate('/admin/foods')}>
                  🍽️ Restaurants
                </Button>
                <Button variant="outline" onClick={() => navigate('/admin/locations/countries')}>
                  🏳️ Countries
                </Button>
                <Button variant="outline" onClick={() => navigate('/admin/locations/regions')}>
                  🗺️ Regions
                </Button>
                <Button variant="outline" onClick={() => navigate('/admin/locations/districts')}>
                  🏘️ Districts
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Management Tab */}
        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {adminSections.find(s => s.id === 'users')?.subsections.map((subsection) => (
              <Card key={subsection.path} className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate(subsection.path)}>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl mb-2">{subsection.icon}</div>
                    <h3 className="font-medium text-sm">{subsection.name}</h3>
                    <p className="text-lg font-bold text-orange-600">{subsection.count}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage users, roles, and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button variant="outline" onClick={() => navigate('/admin/users')}>
                  👥 Users
                </Button>
                <Button variant="outline" onClick={() => navigate('/admin/roles')}>
                  🔑 Roles
                </Button>
                <Button variant="outline" onClick={() => navigate('/admin/permissions')}>
                  🛡️ Permissions
                </Button>
                <Button variant="outline" onClick={() => navigate('/admin/guides')}>
                  🧭 Guides
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Feedback Management Tab */}
        <TabsContent value="feedback" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {adminSections.find(s => s.id === 'feedback')?.subsections.map((subsection) => (
              <Card key={subsection.path} className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate(subsection.path)}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">{subsection.icon}</div>
                      <div>
                        <h3 className="font-semibold text-lg">{subsection.name}</h3>
                        <p className="text-2xl font-bold text-yellow-600">{subsection.count}</p>
                      </div>
                    </div>
                    <Button size="sm">Manage</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Reviews & Feedback Management</CardTitle>
              <CardDescription>Monitor and manage user feedback across the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button variant="outline" onClick={() => navigate('/admin/reviews')}>
                  ⭐ Reviews
                </Button>
                <Button variant="outline" onClick={() => navigate('/admin/ratings')}>
                  📊 Ratings
                </Button>
                <Button variant="outline" onClick={() => navigate('/admin/community-posts')}>
                  💬 Community Posts
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Management Tab */}
        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {adminSections.find(s => s.id === 'system')?.subsections.map((subsection) => (
              <Card key={subsection.path} className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate(subsection.path)}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">{subsection.icon}</div>
                      <div>
                        <h3 className="font-semibold text-lg">{subsection.name}</h3>
                        <p className="text-lg font-medium text-red-600">{subsection.count}</p>
                      </div>
                    </div>
                    <Button size="sm">Access</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Analytics</CardTitle>
                <CardDescription>Platform performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Active Users</span>
                    <span className="font-bold">{dashboardStats?.activeUsers || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Pending Approvals</span>
                    <Badge variant={dashboardStats?.pendingApprovals ? 'destructive' : 'default'}>
                      {dashboardStats?.pendingApprovals || 0}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Monthly Views</span>
                    <span className="font-bold text-green-600">{dashboardStats?.monthlyViews?.toLocaleString() || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Server Uptime</span>
                    <span className="font-bold text-green-600">99.9%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure platform settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/admin/settings')}>
                    ⚙️ General Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/admin/settings/notifications')}>
                    🔔 Notification Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/admin/settings/security')}>
                    🔒 Security Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/admin/settings/backup')}>
                    💾 Backup & Recovery
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/admin/reports')}>
                    📈 Analytics & Reports
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface DashboardCardProps {
  title: string;
  value: string;
  description: string;
  icon: string;
  trend?: number;
  color?: string;
}

const DashboardCard = ({ title, value, description, icon, trend, color = 'bg-blue-500' }: DashboardCardProps) => (
  <Card className="hover:shadow-lg transition-shadow duration-200">
    <CardContent className="p-6">
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-lg ${color} text-white text-2xl`}>
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-600 font-medium">{title}</p>
          <h2 className="text-3xl font-bold mb-1">{value}</h2>
          <div className="flex items-center space-x-2">
            <p className="text-xs text-gray-500">{description}</p>
            {trend !== undefined && trend !== 0 && (
              <Badge variant={trend > 0 ? 'default' : 'destructive'} className="text-xs">
                {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
              </Badge>
            )}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default AdminDashboard;
