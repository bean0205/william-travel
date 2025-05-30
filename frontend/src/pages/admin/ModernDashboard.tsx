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
  Download,
  UserCog,
  Utensils,
  Building,
  MessageCircle,
  Briefcase,
  Globe,
  Map
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { getDashboardStats } from '@/services/api/dashboardService';
import type { DashboardStats } from '@/services/api/dashboardService';
import { APP_ROUTES } from '@/routes/routes';

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
                onClick={() => navigate(APP_ROUTES.HOME.path)}
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5" />
                    <span>Quick Management</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Button
                      variant="ghost"
                      onClick={() => navigate(APP_ROUTES.ADMIN_USERS.path)}
                      className="h-auto p-3 flex items-center space-x-3 hover:bg-blue-50 justify-start"
                    >
                      <div className="p-2 rounded-lg bg-blue-50">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">Users</p>
                        <p className="text-xs text-gray-600">Manage accounts</p>
                      </div>
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => navigate(APP_ROUTES.ADMIN_LOCATIONS.path)}
                      className="h-auto p-3 flex items-center space-x-3 hover:bg-purple-50 justify-start"
                    >
                      <div className="p-2 rounded-lg bg-purple-50">
                        <MapPin className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">Locations</p>
                        <p className="text-xs text-gray-600">Manage places</p>
                      </div>
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => navigate(APP_ROUTES.ADMIN_ARTICLES.path)}
                      className="h-auto p-3 flex items-center space-x-3 hover:bg-green-50 justify-start"
                    >
                      <div className="p-2 rounded-lg bg-green-50">
                        <FileText className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">Articles</p>
                        <p className="text-xs text-gray-600">Manage content</p>
                      </div>
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => navigate(APP_ROUTES.ADMIN_EVENTS.path)}
                      className="h-auto p-3 flex items-center space-x-3 hover:bg-orange-50 justify-start"
                    >
                      <div className="p-2 rounded-lg bg-orange-50">
                        <Calendar className="h-5 w-5 text-orange-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">Events</p>
                        <p className="text-xs text-gray-600">Manage activities</p>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Quick Create</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3">
                    <Button
                      variant="outline"
                      onClick={() => navigate(APP_ROUTES.ADMIN_ARTICLE_CREATE.path)}
                      className="h-auto p-3 flex items-center space-x-3 hover:bg-green-50 justify-start"
                    >
                      <div className="p-2 rounded-lg bg-green-50">
                        <FileText className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">New Article</p>
                        <p className="text-xs text-gray-600">Create travel article</p>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate(APP_ROUTES.ADMIN_EVENT_CREATE.path)}
                      className="h-auto p-3 flex items-center space-x-3 hover:bg-orange-50 justify-start"
                    >
                      <div className="p-2 rounded-lg bg-orange-50">
                        <Calendar className="h-5 w-5 text-orange-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">New Event</p>
                        <p className="text-xs text-gray-600">Create event</p>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate(APP_ROUTES.ADMIN_ACCOMMODATION_CREATE.path)}
                      className="h-auto p-3 flex items-center space-x-3 hover:bg-cyan-50 justify-start"
                    >
                      <div className="p-2 rounded-lg bg-cyan-50">
                        <Building className="h-5 w-5 text-cyan-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">New Accommodation</p>
                        <p className="text-xs text-gray-600">Add hotel/stay</p>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate(APP_ROUTES.ADMIN_FOOD_CREATE.path)}
                      className="h-auto p-3 flex items-center space-x-3 hover:bg-red-50 justify-start"
                    >
                      <div className="p-2 rounded-lg bg-red-50">
                        <Utensils className="h-5 w-5 text-red-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">New Restaurant</p>
                        <p className="text-xs text-gray-600">Add dining option</p>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

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
                  <Button className="mt-4" onClick={() => navigate(APP_ROUTES.ADMIN_REPORTS.path)}>
                    View Full Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="management" className="space-y-6">
            {/* User & Access Management */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>User & Access Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    variant="ghost"
                    onClick={() => navigate(APP_ROUTES.ADMIN_USERS.path)}
                    className="h-auto p-4 flex flex-col items-start space-y-2 hover:bg-blue-50"
                  >
                    <div className="p-2 rounded-lg bg-blue-50">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">User Management</p>
                      <p className="text-sm text-gray-600">Manage user accounts and profiles</p>
                    </div>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => navigate(APP_ROUTES.ADMIN_ROLES.path)}
                    className="h-auto p-4 flex flex-col items-start space-y-2 hover:bg-indigo-50"
                  >
                    <div className="p-2 rounded-lg bg-indigo-50">
                      <UserCog className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Roles & Permissions</p>
                      <p className="text-sm text-gray-600">Configure access control</p>
                    </div>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => navigate(APP_ROUTES.ADMIN_PERMISSIONS.path)}
                    className="h-auto p-4 flex flex-col items-start space-y-2 hover:bg-purple-50"
                  >
                    <div className="p-2 rounded-lg bg-purple-50">
                      <Shield className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Permissions</p>
                      <p className="text-sm text-gray-600">Manage system permissions</p>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Content Management */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Content Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button
                    variant="ghost"
                    onClick={() => navigate(APP_ROUTES.ADMIN_ARTICLES.path)}
                    className="h-auto p-4 flex flex-col items-start space-y-2 hover:bg-green-50"
                  >
                    <div className="p-2 rounded-lg bg-green-50">
                      <FileText className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Articles</p>
                      <p className="text-sm text-gray-600">Manage travel articles</p>
                    </div>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => navigate(APP_ROUTES.ADMIN_EVENTS.path)}
                    className="h-auto p-4 flex flex-col items-start space-y-2 hover:bg-orange-50"
                  >
                    <div className="p-2 rounded-lg bg-orange-50">
                      <Calendar className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Events</p>
                      <p className="text-sm text-gray-600">Manage events & activities</p>
                    </div>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => navigate(APP_ROUTES.ADMIN_GUIDES.path)}
                    className="h-auto p-4 flex flex-col items-start space-y-2 hover:bg-teal-50"
                  >
                    <div className="p-2 rounded-lg bg-teal-50">
                      <Briefcase className="h-6 w-6 text-teal-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Travel Guides</p>
                      <p className="text-sm text-gray-600">Manage travel guides</p>
                    </div>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => navigate(APP_ROUTES.ADMIN_MEDIA.path)}
                    className="h-auto p-4 flex flex-col items-start space-y-2 hover:bg-pink-50"
                  >
                    <div className="p-2 rounded-lg bg-pink-50">
                      <Image className="h-6 w-6 text-pink-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Media</p>
                      <p className="text-sm text-gray-600">Manage images & files</p>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Location & Services Management */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Location & Services Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button
                    variant="ghost"
                    onClick={() => navigate(APP_ROUTES.ADMIN_LOCATIONS.path)}
                    className="h-auto p-4 flex flex-col items-start space-y-2 hover:bg-purple-50"
                  >
                    <div className="p-2 rounded-lg bg-purple-50">
                      <MapPin className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Locations</p>
                      <p className="text-sm text-gray-600">Manage destinations</p>
                    </div>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => navigate(APP_ROUTES.ADMIN_ACCOMMODATIONS.path)}
                    className="h-auto p-4 flex flex-col items-start space-y-2 hover:bg-cyan-50"
                  >
                    <div className="p-2 rounded-lg bg-cyan-50">
                      <Building className="h-6 w-6 text-cyan-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Accommodations</p>
                      <p className="text-sm text-gray-600">Manage hotels & stays</p>
                    </div>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => navigate(APP_ROUTES.ADMIN_FOODS.path)}
                    className="h-auto p-4 flex flex-col items-start space-y-2 hover:bg-red-50"
                  >
                    <div className="p-2 rounded-lg bg-red-50">
                      <Utensils className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Food & Restaurants</p>
                      <p className="text-sm text-gray-600">Manage dining options</p>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Community & Analytics */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Community & Analytics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button
                    variant="ghost"
                    onClick={() => navigate(APP_ROUTES.ADMIN_COMMUNITY_POSTS.path)}
                    className="h-auto p-4 flex flex-col items-start space-y-2 hover:bg-violet-50"
                  >
                    <div className="p-2 rounded-lg bg-violet-50">
                      <MessageCircle className="h-6 w-6 text-violet-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Community Posts</p>
                      <p className="text-sm text-gray-600">Manage user posts</p>
                    </div>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => navigate(APP_ROUTES.ADMIN_REVIEWS.path)}
                    className="h-auto p-4 flex flex-col items-start space-y-2 hover:bg-yellow-50"
                  >
                    <div className="p-2 rounded-lg bg-yellow-50">
                      <Star className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Reviews</p>
                      <p className="text-sm text-gray-600">Monitor reviews</p>
                    </div>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => navigate(APP_ROUTES.ADMIN_RATINGS.path)}
                    className="h-auto p-4 flex flex-col items-start space-y-2 hover:bg-emerald-50"
                  >
                    <div className="p-2 rounded-lg bg-emerald-50">
                      <Star className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Ratings</p>
                      <p className="text-sm text-gray-600">Manage rating system</p>
                    </div>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => navigate(APP_ROUTES.ADMIN_REPORTS.path)}
                    className="h-auto p-4 flex flex-col items-start space-y-2 hover:bg-indigo-50"
                  >
                    <div className="p-2 rounded-lg bg-indigo-50">
                      <BarChart3 className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Reports & Analytics</p>
                      <p className="text-sm text-gray-600">View detailed analytics</p>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
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
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => navigate(APP_ROUTES.ADMIN_SYSTEM_SETTINGS.path)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Create Backup
                    </Button>
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => navigate(APP_ROUTES.ADMIN_SYSTEM_SETTINGS.path)}
                    >
                      <Activity className="h-4 w-4 mr-2" />
                      View System Logs
                    </Button>
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => navigate(APP_ROUTES.ADMIN_SYSTEM_SETTINGS.path)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      System Configuration
                    </Button>
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => navigate(APP_ROUTES.ADMIN_SYSTEM_SETTINGS.path)}
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Security Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Location Management Hierarchy */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-5 w-5" />
                  <span>Location Management Hierarchy</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button
                    variant="ghost"
                    onClick={() => navigate(APP_ROUTES.ADMIN_LOCATIONS_CONTINENTS.path)}
                    className="h-auto p-4 flex flex-col items-start space-y-2 hover:bg-blue-50"
                  >
                    <div className="p-2 rounded-lg bg-blue-50">
                      <Globe className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Continents</p>
                      <p className="text-sm text-gray-600">Manage continent data</p>
                    </div>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => navigate(APP_ROUTES.ADMIN_LOCATIONS_COUNTRIES.path)}
                    className="h-auto p-4 flex flex-col items-start space-y-2 hover:bg-green-50"
                  >
                    <div className="p-2 rounded-lg bg-green-50">
                      <Map className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Countries</p>
                      <p className="text-sm text-gray-600">Manage country information</p>
                    </div>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => navigate(APP_ROUTES.ADMIN_LOCATIONS_REGIONS.path)}
                    className="h-auto p-4 flex flex-col items-start space-y-2 hover:bg-purple-50"
                  >
                    <div className="p-2 rounded-lg bg-purple-50">
                      <MapPin className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Regions</p>
                      <p className="text-sm text-gray-600">Manage regional areas</p>
                    </div>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => navigate(APP_ROUTES.ADMIN_LOCATIONS_DISTRICTS.path)}
                    className="h-auto p-4 flex flex-col items-start space-y-2 hover:bg-orange-50"
                  >
                    <div className="p-2 rounded-lg bg-orange-50">
                      <MapPin className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Districts</p>
                      <p className="text-sm text-gray-600">Manage district divisions</p>
                    </div>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => navigate(APP_ROUTES.ADMIN_LOCATIONS_WARDS.path)}
                    className="h-auto p-4 flex flex-col items-start space-y-2 hover:bg-pink-50"
                  >
                    <div className="p-2 rounded-lg bg-pink-50">
                      <MapPin className="h-6 w-6 text-pink-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Wards</p>
                      <p className="text-sm text-gray-600">Manage ward subdivisions</p>
                    </div>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => navigate(APP_ROUTES.ADMIN_LOCATIONS_CATEGORIES.path)}
                    className="h-auto p-4 flex flex-col items-start space-y-2 hover:bg-indigo-50"
                  >
                    <div className="p-2 rounded-lg bg-indigo-50">
                      <Settings className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Location Categories</p>
                      <p className="text-sm text-gray-600">Manage location types</p>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Service Categories Management */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Service Categories Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    variant="ghost"
                    onClick={() => navigate(APP_ROUTES.ADMIN_ACCOMMODATION_CATEGORIES.path)}
                    className="h-auto p-4 flex flex-col items-start space-y-2 hover:bg-cyan-50"
                  >
                    <div className="p-2 rounded-lg bg-cyan-50">
                      <Building className="h-6 w-6 text-cyan-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Accommodation Categories</p>
                      <p className="text-sm text-gray-600">Manage hotel & stay types</p>
                    </div>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => navigate(APP_ROUTES.ADMIN_FOOD_CATEGORIES.path)}
                    className="h-auto p-4 flex flex-col items-start space-y-2 hover:bg-red-50"
                  >
                    <div className="p-2 rounded-lg bg-red-50">
                      <Utensils className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Food Categories</p>
                      <p className="text-sm text-gray-600">Manage cuisine & restaurant types</p>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ModernDashboard;
