import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  MapPin, 
  FileText, 
  Calendar, 
  Star, 
  Settings, 
  BarChart3, 
  Shield, 
  Image,
  TrendingUp,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  MessageSquare,
  Download
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { getDashboardStats } from '@/services/api/dashboardService';
import type { DashboardStats } from '@/services/api/dashboardService';

interface QuickAction {
  title: string;
  description: string;
  icon: React.ElementType;
  path: string;
  color: string;
  bgColor: string;
}

interface SystemMetric {
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  color: string;
}

const ModernDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const stats = await getDashboardStats();
        setDashboardStats(stats);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const quickActions: QuickAction[] = [
    {
      title: 'User Management',
      description: 'Manage users and permissions',
      icon: Users,
      path: '/admin/users',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Content Management',
      description: 'Manage articles and content',
      icon: FileText,
      path: '/admin/content',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Location Management',
      description: 'Manage destinations and places',
      icon: MapPin,
      path: '/admin/locations',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Event Management',
      description: 'Manage events and activities',
      icon: Calendar,
      path: '/admin/events',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Review Management',
      description: 'Monitor and manage reviews',
      icon: Star,
      path: '/admin/reviews',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Media Management',
      description: 'Manage images and media files',
      icon: Image,
      path: '/admin/media',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50'
    },
    {
      title: 'Reports & Analytics',
      description: 'View detailed reports',
      icon: BarChart3,
      path: '/admin/reports',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      title: 'System Settings',
      description: 'Configure system settings',
      icon: Settings,
      path: '/admin/settings',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50'
    }
  ];

  const systemMetrics: SystemMetric[] = [
    {
      title: 'Total Users',
      value: dashboardStats?.totalUsers || 0,
      change: '+12.5%',
      trend: 'up',
      color: 'text-blue-600'
    },
    {
      title: 'Active Sessions',
      value: dashboardStats?.activeUsers || 0,
      change: '+8.2%',
      trend: 'up',
      color: 'text-green-600'
    },
    {
      title: 'Content Items',
      value: dashboardStats?.totalContent || 0,
      change: '+15.3%',
      trend: 'up',
      color: 'text-purple-600'
    },
    {
      title: 'System Load',
      value: '68%',
      change: '-5.1%',
      trend: 'down',
      color: 'text-orange-600'
    }
  ];

  const recentActivities = [
    {
      user: 'John Doe',
      action: 'Created new article',
      target: 'Hanoi Travel Guide',
      time: '2 minutes ago',
      type: 'create'
    },
    {
      user: 'Jane Smith',
      action: 'Updated location',
      target: 'Ha Long Bay',
      time: '15 minutes ago',
      type: 'update'
    },
    {
      user: 'Admin',
      action: 'Approved review',
      target: 'Hotel Review #1234',
      time: '30 minutes ago',
      type: 'approve'
    },
    {
      user: 'System',
      action: 'Backup completed',
      target: 'Database backup',
      time: '1 hour ago',
      type: 'system'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'create': return <FileText className="h-4 w-4 text-green-600" />;
      case 'update': return <Eye className="h-4 w-4 text-blue-600" />;
      case 'approve': return <CheckCircle className="h-4 w-4 text-purple-600" />;
      case 'system': return <Activity className="h-4 w-4 text-gray-600" />;
      default: return <AlertCircle className="h-4 w-4 text-orange-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {user?.full_name || user?.email || 'Administrator'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Current Time</p>
                <p className="font-semibold">
                  {currentTime.toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="flex items-center space-x-2"
              >
                <Eye className="h-4 w-4" />
                <span>View Website</span>
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="management">Management</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* System Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {systemMetrics.map((metric, index) => (
                <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          {metric.title}
                        </p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                          {metric.value}
                        </p>
                      </div>
                      <div className={`flex items-center space-x-1 ${metric.color}`}>
                        <TrendingUp className={`h-4 w-4 ${
                          metric.trend === 'down' ? 'rotate-180' : ''
                        }`} />
                        <span className="text-sm font-medium">{metric.change}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      onClick={() => navigate(action.path)}
                      className="h-auto p-4 flex flex-col items-start space-y-2 hover:bg-gray-50"
                    >
                      <div className={`p-2 rounded-lg ${action.bgColor}`}>
                        <action.icon className={`h-6 w-6 ${action.color}`} />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">{action.title}</p>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>Recent Activities</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                        <div className="mt-1">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium">{activity.user}</span>
                            {' '}{activity.action}{' '}
                            <span className="font-medium">{activity.target}</span>
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* System Status */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>System Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Server Status</span>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Online
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Database</span>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Connected
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Storage</span>
                      <Badge variant="default" className="bg-yellow-100 text-yellow-800">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        78% Used
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Memory Usage</span>
                        <span className="text-sm text-gray-600">4.2GB / 8GB</span>
                      </div>
                      <Progress value={52} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">CPU Usage</span>
                        <span className="text-sm text-gray-600">68%</span>
                      </div>
                      <Progress value={68} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Analytics Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Eye className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-600">45,234</p>
                    <p className="text-sm text-gray-600">Page Views Today</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">2,847</p>
                    <p className="text-sm text-gray-600">Active Users</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <MessageSquare className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-600">1,423</p>
                    <p className="text-sm text-gray-600">User Interactions</p>
                  </div>
                </div>
                <div className="text-center py-12 text-gray-500">
                  <BarChart3 className="h-16 w-16 mx-auto mb-4" />
                  <p>Detailed analytics charts will be displayed here</p>
                  <Button className="mt-4" onClick={() => navigate('/admin/reports')}>
                    View Full Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="management" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quickActions.map((action, index) => (
                <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => navigate(action.path)}>
                  <CardContent className="p-6">
                    <div className={`p-3 rounded-lg ${action.bgColor} w-fit mb-4`}>
                      <action.icon className={`h-8 w-8 ${action.color}`} />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{action.title}</h3>
                    <p className="text-gray-600 text-sm">{action.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle>System Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Version</span>
                      <Badge variant="outline">v2.1.0</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Last Backup</span>
                      <span className="text-sm text-gray-600">2 hours ago</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Uptime</span>
                      <span className="text-sm text-gray-600">15 days, 7 hours</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Environment</span>
                      <Badge variant="default" className="bg-green-100 text-green-800">Production</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle>Quick System Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full justify-start" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Create Backup
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Activity className="h-4 w-4 mr-2" />
                      View System Logs
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      System Configuration
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Shield className="h-4 w-4 mr-2" />
                      Security Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ModernDashboard;
