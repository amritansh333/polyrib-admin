import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import LoadingScreen from './LoadingScreen';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, initialized } = useAuth();
  // Do not make a routing decision until auth initialization has completed.
  if (!initialized || loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/" replace />; // redirect to login
  return <>{children}</>;
};

export default ProtectedRoute;
