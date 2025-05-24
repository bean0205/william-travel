import React from 'react';

interface TempAdminWrapperProps {
  children: React.ReactNode;
}

const TempAdminWrapper: React.FC<TempAdminWrapperProps> = ({ children }) => {
  // Temporary wrapper for testing admin routes without authentication
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              🚧 <strong>Development Mode:</strong> Admin authentication bypassed for testing
            </p>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};

export default TempAdminWrapper;
