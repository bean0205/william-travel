import React from 'react';

const AdminTest: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Routes Test</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Available Admin Routes:</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-medium text-gray-700">Main Admin Pages:</h3>
              <ul className="space-y-1 text-sm text-blue-600">
                <li><a href="/admin" className="hover:underline">/admin - Dashboard</a></li>
                <li><a href="/admin/users" className="hover:underline">/admin/users - User Management</a></li>
                <li><a href="/admin/roles" className="hover:underline">/admin/roles - Role Management</a></li>
                <li><a href="/admin/permissions" className="hover:underline">/admin/permissions - Permissions</a></li>
                <li><a href="/admin/content" className="hover:underline">/admin/content - Content Management</a></li>
                <li><a href="/admin/locations" className="hover:underline">/admin/locations - Location Management</a></li>
                <li><a href="/admin/media" className="hover:underline">/admin/media - Media Management</a></li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium text-gray-700">Content Management:</h3>
              <ul className="space-y-1 text-sm text-blue-600">
                <li><a href="/admin/articles" className="hover:underline">/admin/articles - Articles</a></li>
                <li><a href="/admin/events" className="hover:underline">/admin/events - Events</a></li>
                <li><a href="/admin/reviews" className="hover:underline">/admin/reviews - Reviews</a></li>
                <li><a href="/admin/guides" className="hover:underline">/admin/guides - Guides</a></li>
                <li><a href="/admin/reports" className="hover:underline">/admin/reports - Reports</a></li>
                <li><a href="/admin/settings" className="hover:underline">/admin/settings - Settings</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-green-50 rounded-md">
            <p className="text-green-800">
              ✅ Admin routes are now configured and should be accessible!
            </p>
            <p className="text-sm text-green-600 mt-1">
              Note: You need to be authenticated with admin role to access these routes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTest;
