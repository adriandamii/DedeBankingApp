import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Navigate } from 'react-router-dom';

interface RouteProps {
  element: React.ReactElement;
  adminOnly?: boolean;  
}

const ProtectedRoute: React.FC<RouteProps> = ({ element }) => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace/>;
  }

  return element;
};

export default ProtectedRoute;
