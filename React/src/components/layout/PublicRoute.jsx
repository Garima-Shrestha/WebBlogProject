import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (token) {
    try {
      const decoded = jwtDecode(token);
      const role = decoded.role;
      switch (role) {
        case 'blogger':
          return <Navigate to="/home" replace />;
        case 'admin':
          return <Navigate to="/profileview" replace />;
        default:
          return <Navigate to="/login" replace />;
      }
    } catch (error) {
      localStorage.removeItem('token');
      return children;
    }
  }

  return children;
};

export default PublicRoute;