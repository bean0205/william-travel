import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { APP_ROUTES } from '@/routes/routes';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { 
      path: APP_ROUTES.ADMIN_DASHBOARD.path, 
      label: 'Dashboard',
      icon: '📊'
    },
    { 
      path: APP_ROUTES.ADMIN_USERS.path, 
      label: 'Users',
      icon: '👥'
    },
    { 
      path: APP_ROUTES.ADMIN_ROLES.path, 
      label: 'Roles',
      icon: '🔑'
    },
    { 
      path: APP_ROUTES.ADMIN_PERMISSIONS.path, 
      label: 'Permissions',
      icon: '🛡️'
    },
    { 
      path: APP_ROUTES.ADMIN_CONTENT.path, 
      label: 'Content',
      icon: '📝'
    },
    { 
      path: APP_ROUTES.ADMIN_LOCATIONS.path, 
      label: 'Locations',
      icon: '📍'
    },
    { 
      path: APP_ROUTES.ADMIN_ARTICLES.path, 
      label: 'Articles',
      icon: '📰'
    },
    { 
      path: APP_ROUTES.ADMIN_EVENTS.path, 
      label: 'Events',
      icon: '🗓️'
    },
    { 
      path: APP_ROUTES.ADMIN_REVIEWS.path, 
      label: 'Reviews',
      icon: '⭐'
    },
    { 
      path: APP_ROUTES.ADMIN_COMMUNITY_POSTS.path, 
      label: 'Community Posts',
      icon: '💬'
    },
    { 
      path: APP_ROUTES.ADMIN_RATINGS.path, 
      label: 'Ratings',
      icon: '📊'
    },
    { 
      path: APP_ROUTES.ADMIN_GUIDES.path, 
      label: 'Guides',
      icon: '🧭'
    },
    { 
      path: APP_ROUTES.ADMIN_MEDIA.path, 
      label: 'Media',
      icon: '🖼️'
    },
    { 
      path: APP_ROUTES.ADMIN_REPORTS.path, 
      label: 'Reports',
      icon: '📊'
    },
    { 
      path: APP_ROUTES.ADMIN_SYSTEM_SETTINGS.path, 
      label: 'Settings',
      icon: '⚙️'
    },
  ];

  const isActive = (path: string) => {
    if (path === APP_ROUTES.ADMIN_DASHBOARD.path) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - desktop */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r shadow-sm">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">William Travel Admin</h2>
        </div>
        <nav className="flex-1 overflow-y-auto p-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-2 my-1 rounded-md text-sm ${
                isActive(item.path)
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'hover:bg-gray-100'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t mt-auto">
          <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/')}>
            <span className="mr-2">🏠</span>
            Return to Website
          </Button>
        </div>
      </div>

      {/* Mobile menu button and overlay */}
      <div className="md:hidden">
        <Button
          variant="ghost"
          className="fixed top-4 left-4 z-20"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? '✖' : '☰'}
        </Button>

        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-10" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="w-64 h-full bg-white" onClick={(e) => e.stopPropagation()}>
              <div className="p-4 border-b">
                <h2 className="text-xl font-bold">William Travel Admin</h2>
              </div>
              <nav className="p-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-4 py-2 my-1 rounded-md text-sm ${
                      isActive(item.path)
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="p-4 border-t">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={() => {
                    navigate('/');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <span className="mr-2">🏠</span>
                  Return to Website
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm h-16 flex items-center px-6">
          <h1 className="text-xl font-semibold">Admin Panel</h1>
          <div className="ml-auto flex items-center space-x-2">
            <span className="text-sm text-gray-500">Welcome, Admin</span>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
