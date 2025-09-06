import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';

/**
 * A component that protects routes from unauthenticated access.
 * It can also restrict routes to admins only.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The component to render if the user is authorized.
 * @param {boolean} [props.adminOnly=false] - Whether the route is accessible only by admins.
 */
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Show a loading spinner while checking auth status
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // If not authenticated, redirect to the login page
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If the route is for admins only and the user is not an admin, redirect
  if (adminOnly && user?.type !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // If authorized, render the child components
  return children;
};

export default ProtectedRoute;
