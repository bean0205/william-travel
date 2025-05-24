import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { getDashboardStats, getSystemStatus } from '@/services/api/dashboardService';
import type { DashboardStats, SystemStatus } from '@/services/api/dashboardService';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
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

  // Comprehensive admin management sections with ALL available pages
  const adminSections = [
    {
      id: 'content',
      title: 'Quản lý Nội dung',
      description: 'Quản lý tất cả các loại nội dung trên nền tảng',
      color: 'from-blue-500 to-cyan-500',
      icon: '📝',
      subsections: [
        { name: 'Bài viết', path: '/admin/articles', icon: '📰', count: dashboardStats?.totalContent || 0, description: 'Quản lý bài viết du lịch' },
        { name: 'Sự kiện', path: '/admin/events', icon: '🗓️', count: 'N/A', description: 'Quản lý sự kiện và hoạt động' },
        { name: 'Bài đăng cộng đồng', path: '/admin/community-posts', icon: '💬', count: 'N/A', description: 'Quản lý bài đăng từ cộng đồng' },
        { name: 'Thư viện Media', path: '/admin/media', icon: '🖼️', count: 'N/A', description: 'Quản lý ảnh và video' },
        { name: 'Nội dung tổng hợp', path: '/admin/content', icon: '📋', count: 'N/A', description: 'Quản lý nội dung tổng hợp' },
      ]
    },
    {
      id: 'locations',
      title: 'Quản lý Địa điểm',
      description: 'Quản lý dữ liệu địa lý và điểm đến',
      color: 'from-purple-500 to-pink-500',
      icon: '📍',
      subsections: [
        { name: 'Địa điểm', path: '/admin/locations', icon: '📍', count: dashboardStats?.totalLocations || 0, description: 'Quản lý tất cả địa điểm' },
        { name: 'Lưu trú', path: '/admin/accommodations', icon: '🏨', count: 'N/A', description: 'Quản lý khách sạn, homestay' },
        { name: 'Nhà hàng', path: '/admin/foods', icon: '🍽️', count: 'N/A', description: 'Quản lý nhà hàng, món ăn' },
        { name: 'Châu lục', path: '/admin/locations/continents', icon: '🌍', count: '7', description: 'Quản lý các châu lục' },
        { name: 'Quốc gia', path: '/admin/locations/countries', icon: '🏳️', count: 'N/A', description: 'Quản lý các quốc gia' },
        { name: 'Vùng miền', path: '/admin/locations/regions', icon: '🗺️', count: 'N/A', description: 'Quản lý vùng miền' },
        { name: 'Quận/Huyện', path: '/admin/locations/districts', icon: '🏘️', count: 'N/A', description: 'Quản lý quận, huyện' },
        { name: 'Phường/Xã', path: '/admin/locations/wards', icon: '🏠', count: 'N/A', description: 'Quản lý phường, xã' },
        { name: 'Danh mục địa điểm', path: '/admin/locations/categories', icon: '🏷️', count: 'N/A', description: 'Phân loại địa điểm' },
        { name: 'Danh mục lưu trú', path: '/admin/accommodations/categories', icon: '🏨', count: 'N/A', description: 'Phân loại lưu trú' },
        { name: 'Danh mục ẩm thực', path: '/admin/foods/categories', icon: '🍴', count: 'N/A', description: 'Phân loại ẩm thực' },
      ]
    },
    {
      id: 'users',
      title: 'Quản lý Người dùng',
      description: 'Quản lý người dùng và phân quyền',
      color: 'from-orange-500 to-red-500',
      icon: '👥',
      subsections: [
        { name: 'Người dùng', path: '/admin/users', icon: '👥', count: dashboardStats?.totalUsers || 0, description: 'Quản lý tài khoản người dùng' },
        { name: 'Vai trò', path: '/admin/roles', icon: '🔑', count: dashboardStats?.totalRoles || 0, description: 'Quản lý vai trò và quyền hạn' },
        { name: 'Quyền hạn', path: '/admin/permissions', icon: '🛡️', count: 'N/A', description: 'Quản lý quyền truy cập' },
        { name: 'Hướng dẫn viên', path: '/admin/guides', icon: '🧭', count: dashboardStats?.totalGuides || 0, description: 'Quản lý hướng dẫn viên' },
      ]
    },
    {
      id: 'feedback',
      title: 'Phản hồi & Đánh giá',
      description: 'Theo dõi phản hồi và đánh giá người dùng',
      color: 'from-yellow-500 to-orange-500',
      icon: '⭐',
      subsections: [
        { name: 'Đánh giá', path: '/admin/reviews', icon: '⭐', count: 'N/A', description: 'Quản lý đánh giá từ người dùng' },
        { name: 'Xếp hạng', path: '/admin/ratings', icon: '📊', count: 'N/A', description: 'Quản lý hệ thống xếp hạng' },
      ]
    },
    {
      id: 'system',
      title: 'Hệ thống & Báo cáo',
      description: 'Quản lý hệ thống và thống kê',
      color: 'from-gray-500 to-slate-600',
      icon: '⚙️',
      subsections: [
        { name: 'Báo cáo & Thống kê', path: '/admin/reports', icon: '📈', count: 'View', description: 'Xem báo cáo và phân tích' },
        { name: 'Cài đặt hệ thống', path: '/admin/settings', icon: '⚙️', count: 'Config', description: 'Cấu hình hệ thống' },
      ]
    }
  ];

  // Quick actions for common tasks
  const quickActions = [
    { label: 'Tạo bài viết', path: '/admin/articles/create', icon: '📝', color: 'bg-blue-500' },
    { label: 'Thêm sự kiện', path: '/admin/events/create', icon: '➕', color: 'bg-green-500' },
    { label: 'Thêm địa điểm', path: '/admin/locations/create', icon: '📍', color: 'bg-purple-500' },
    { label: 'Thêm lưu trú', path: '/admin/accommodations/create', icon: '🏨', color: 'bg-orange-500' },
    { label: 'Thêm nhà hàng', path: '/admin/foods/create', icon: '🍽️', color: 'bg-red-500' },
    { label: 'Xem báo cáo', path: '/admin/reports', icon: '📊', color: 'bg-indigo-500' },
    { label: 'Thêm người dùng', path: '/admin/users/create', icon: '👤', color: 'bg-cyan-500' },
    { label: 'Quản lý media', path: '/admin/media', icon: '🖼️', color: 'bg-pink-500' },
  ];

  // Filter sections based on search term
  const filteredSections = adminSections.map(section => ({
    ...section,
    subsections: section.subsections.filter(sub =>
      sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(section => section.subsections.length > 0 || searchTerm === '');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto p-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                Bảng Điều Khiển Quản Trị
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                Trung tâm quản lý toàn diện cho nền tảng William Travel
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Input
                type="text"
                placeholder="Tìm kiếm chức năng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-80"
              />
            </div>
          </div>
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
                title="Tổng người dùng"
                value={dashboardStats?.totalUsers?.toLocaleString() || '0'}
                description={dashboardStats?.userGrowth ? `+${dashboardStats.userGrowth}% so với tháng trước` : 'Chưa có dữ liệu tăng trưởng'}
                icon="👥"
                trend={dashboardStats?.userGrowth || 0}
                color="bg-gradient-to-br from-blue-500 to-blue-600"
              />
              <DashboardCard
                title="Nội dung"
                value={dashboardStats?.totalContent?.toLocaleString() || '0'}
                description={dashboardStats?.contentGrowth ? `+${dashboardStats.contentGrowth}% so với tháng trước` : 'Chưa có dữ liệu tăng trưởng'}
                icon="📄"
                trend={dashboardStats?.contentGrowth || 0}
                color="bg-gradient-to-br from-green-500 to-green-600"
              />
              <DashboardCard
                title="Địa điểm hoạt động"
                value={dashboardStats?.totalLocations?.toLocaleString() || '0'}
                description={dashboardStats?.locationGrowth ? `+${dashboardStats.locationGrowth}% so với tháng trước` : 'Chưa có dữ liệu tăng trưởng'}
                icon="🌍"
                trend={dashboardStats?.locationGrowth || 0}
                color="bg-gradient-to-br from-purple-500 to-purple-600"
              />
              <DashboardCard
                title="Lượt xem hàng tháng"
                value={dashboardStats?.monthlyViews ? `${(dashboardStats.monthlyViews / 1000).toFixed(1)}K` : '0'}
                description={dashboardStats?.viewsGrowth ? `+${dashboardStats.viewsGrowth}% so với tháng trước` : 'Chưa có dữ liệu tăng trưởng'}
                icon="📊"
                trend={dashboardStats?.viewsGrowth || 0}
                color="bg-gradient-to-br from-orange-500 to-orange-600"
              />
            </>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-6 h-auto p-1 bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 rounded-lg"
            >
              📊 Tổng quan
            </TabsTrigger>
            <TabsTrigger 
              value="content" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 rounded-lg"
            >
              📝 Nội dung
            </TabsTrigger>
            <TabsTrigger 
              value="locations" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 rounded-lg"
            >
              📍 Địa điểm
            </TabsTrigger>
            <TabsTrigger 
              value="users" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 rounded-lg"
            >
              👥 Người dùng
            </TabsTrigger>
            <TabsTrigger 
              value="feedback" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 rounded-lg"
            >
              ⭐ Phản hồi
            </TabsTrigger>
            <TabsTrigger 
              value="system" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-500 data-[state=active]:to-slate-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 rounded-lg"
            >
              ⚙️ Hệ thống
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Management Sections Overview */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-xl font-semibold mb-4">Các phần quản lý</h3>
                <div className="grid gap-4">
                  {filteredSections.map((section) => (
                    <Card key={section.id} className="hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center mb-3">
                              <div className={`p-3 rounded-xl bg-gradient-to-br ${section.color} text-white text-2xl mr-4 shadow-lg`}>
                                {section.icon}
                              </div>
                              <div>
                                <h4 className="font-semibold text-lg">{section.title}</h4>
                                <p className="text-gray-600 text-sm">{section.description}</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {section.subsections.slice(0, 6).map((sub) => (
                                <Card 
                                  key={sub.path} 
                                  className="cursor-pointer hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-blue-300 bg-gray-50/50"
                                  onClick={() => navigate(sub.path)}
                                >
                                  <CardContent className="p-3">
                                    <div className="flex items-center space-x-2">
                                      <span className="text-lg">{sub.icon}</span>
                                      <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm truncate">{sub.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{sub.description}</p>
                                        <Badge variant="outline" className="text-xs mt-1">
                                          {sub.count}
                                        </Badge>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                              {section.subsections.length > 6 && (
                                <Card className="border-dashed border-2 border-gray-300 bg-gray-50/30">
                                  <CardContent className="p-3 flex items-center justify-center">
                                    <Badge variant="outline" className="text-xs">
                                      +{section.subsections.length - 6} khác
                                    </Badge>
                                  </CardContent>
                                </Card>
                              )}
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => setActiveTab(section.id)}
                            className={`ml-4 bg-gradient-to-r ${section.color} hover:opacity-90 text-white shadow-lg`}
                          >
                            Quản lý
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
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <span className="mr-2">⚡</span>
                      Thao tác nhanh
                    </CardTitle>
                    <CardDescription>Truy cập nhanh các tác vụ thường dùng</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      {quickActions.map((action) => (
                        <Button
                          key={action.path}
                          variant="outline"
                          size="sm"
                          className="h-auto p-3 flex flex-col items-center space-y-1 hover:shadow-md transition-all duration-200 border-0 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200"
                          onClick={() => navigate(action.path)}
                        >
                          <div className={`p-2 rounded-lg ${action.color} text-white text-lg shadow-sm`}>
                            {action.icon}
                          </div>
                          <span className="text-xs text-center font-medium">{action.label}</span>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* System Status */}
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <span className="mr-2">🏥</span>
                      Trạng thái hệ thống
                    </CardTitle>
                    <CardDescription>Tình trạng hoạt động thời gian thực</CardDescription>
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
                        <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                          <p className="text-sm text-blue-800">
                            Sao lưu gần nhất: {systemStatus.lastBackup || 'Chưa có dữ liệu sao lưu'}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                        <p className="text-sm text-gray-500">Đang tải trạng thái hệ thống...</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Key Metrics */}
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <span className="mr-2">📈</span>
                      Chỉ số quan trọng
                    </CardTitle>
                    <CardDescription>Thống kê quan trọng của nền tảng</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                        <span className="text-sm font-medium">Người dùng hoạt động</span>
                        <span className="font-bold text-blue-600">{dashboardStats?.activeUsers || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gradient-to-r from-red-50 to-red-100 rounded-lg">
                        <span className="text-sm font-medium">Chờ duyệt</span>
                        <Badge variant={dashboardStats?.pendingApprovals ? 'destructive' : 'default'}>
                          {dashboardStats?.pendingApprovals || 0}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                        <span className="text-sm font-medium">Lượt xem tháng</span>
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
