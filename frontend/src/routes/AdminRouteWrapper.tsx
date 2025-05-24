import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

interface AdminRouteWrapperProps {
  children: React.ReactNode;
}

const AdminRouteWrapper: React.FC<AdminRouteWrapperProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  
  const isAdmin = isAuthenticated && user?.role === 'admin';

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default AdminRouteWrapper;
