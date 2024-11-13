import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Navigate } from 'react-router-dom';

interface RouteProps {
  element: React.ReactElement;
  adminOnly?: boolean;  
}

const ProtectedRoute: React.FC<RouteProps> = ({ element }) => {
  const { isLoggedIn, user } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace/>;
  }

  if (user?.userRole === 'admin') {
   // return <Navigate to='/users' replace/>;  
  }
  if (user?.userRole === 'customer') {
    //return <Navigate to={`users/${user?.userId}`} replace/>;  

  }

  return element;
};

export default ProtectedRoute;
