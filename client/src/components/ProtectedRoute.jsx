import React from 'react';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ user, children, requiredRole = null }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};
