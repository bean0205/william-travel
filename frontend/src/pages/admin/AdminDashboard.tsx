import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { getDashboardStats, getSystemStatus, getRecentActivity } from '@/services/api/dashboardService';
import type { DashboardStats, SystemStatus, RecentActivity } from '@/services/api/dashboardService';
import UsersManagement from './components/UsersManagement';
import RolesManagement from './components/RolesManagement';
import PermissionsManagement from './components/PermissionsManagement';
import ContentManagement from './components/ContentManagement';
import LocationsManagement from './components/LocationsManagement';
import MediaManagement from './components/MediaManagement';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [stats, status, activity] = await Promise.all([
          getDashboardStats(),
          getSystemStatus(),
          getRecentActivity()
        ]);
        setDashboardStats(stats);
        setSystemStatus(status);
        setRecentActivity(activity);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button onClick={() => navigate('/')}>Return to Website</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="flex p-6">
                <div className="mr-4">
                  <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded animate-pulse mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <DashboardCard
              title="Total Users"
              value={dashboardStats?.totalUsers?.toLocaleString() || '0'}
              description={dashboardStats?.userGrowth ? `+${dashboardStats.userGrowth}% from last month` : 'No data'}
              icon="👥"
            />
            <DashboardCard
              title="Content Items"
              value={dashboardStats?.totalContent?.toLocaleString() || '0'}
              description={dashboardStats?.contentGrowth ? `+${dashboardStats.contentGrowth}% from last month` : 'No data'}
              icon="📄"
            />
            <DashboardCard
              title="Active Locations"
              value={dashboardStats?.totalLocations?.toLocaleString() || '0'}
              description={dashboardStats?.locationGrowth ? `+${dashboardStats.locationGrowth}% from last month` : 'No data'}
              icon="🌍"
            />
            <DashboardCard
              title="Monthly Views"
              value={dashboardStats?.monthlyViews ? `${(dashboardStats.monthlyViews / 1000).toFixed(1)}K` : '0'}
              description={dashboardStats?.viewsGrowth ? `+${dashboardStats.viewsGrowth}% from last month` : 'No data'}
              icon="📊"
            />
          </>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-6 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Welcome to Admin Dashboard</CardTitle>
              <CardDescription>
                Manage all aspects of the William Travel application from this central dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Quick actions:</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <Button onClick={() => setActiveTab('users')}>Manage Users</Button>
                <Button onClick={() => setActiveTab('content')}>Manage Content</Button>
                <Button onClick={() => setActiveTab('locations')}>Manage Locations</Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <div key={index} className="p-2 rounded bg-gray-200 animate-pulse h-8"></div>
                    ))}
                  </div>
                ) : recentActivity.length > 0 ? (
                  <ul className="space-y-2">
                    {recentActivity.map((activity) => (
                      <li key={activity.id} className="p-2 rounded bg-muted text-sm">
                        {activity.description}
                        {activity.user && (
                          <span className="text-xs text-muted-foreground ml-2">by {activity.user}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No recent activity</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4"></div>
                      </div>
                    ))}
                  </div>
                ) : systemStatus ? (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>API Status</span>
                      <span className={`${
                        systemStatus.apiStatus === 'operational' ? 'text-green-500' : 
                        systemStatus.apiStatus === 'warning' ? 'text-amber-500' : 'text-red-500'
                      }`}>
                        {systemStatus.apiStatus === 'operational' ? 'Operational' : 
                         systemStatus.apiStatus === 'warning' ? 'Warning' : 'Error'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Database</span>
                      <span className={`${
                        systemStatus.databaseStatus === 'healthy' ? 'text-green-500' : 
                        systemStatus.databaseStatus === 'warning' ? 'text-amber-500' : 'text-red-500'
                      }`}>
                        {systemStatus.databaseStatus === 'healthy' ? 'Healthy' : 
                         systemStatus.databaseStatus === 'warning' ? 'Warning' : 'Error'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Storage</span>
                      <span className={`${systemStatus.storageUsed > 80 ? 'text-red-500' : systemStatus.storageUsed > 60 ? 'text-amber-500' : 'text-green-500'}`}>
                        {systemStatus.storageUsed}% Used
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Last Backup</span>
                      <span>{systemStatus.lastBackup}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Unable to load system status</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <UsersManagement />
        </TabsContent>

        <TabsContent value="roles">
          <RolesManagement />
        </TabsContent>

        <TabsContent value="content">
          <ContentManagement />
        </TabsContent>

        <TabsContent value="locations">
          <LocationsManagement />
        </TabsContent>

        <TabsContent value="media">
          <MediaManagement />
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
}

const DashboardCard = ({ title, value, description, icon }: DashboardCardProps) => (
  <Card>
    <CardContent className="flex p-6">
      <div className="mr-4 text-2xl">
        {icon}
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <h2 className="text-3xl font-bold">{value}</h2>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </div>
    </CardContent>
  </Card>
);

export default AdminDashboard;
