// src/components/ProtectedRoute.js

import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== 'Taquilla' && user.role !== 'Organizador') {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;
