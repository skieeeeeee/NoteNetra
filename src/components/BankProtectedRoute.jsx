
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const BankProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/bank-login" />;
  }

  if (currentUser.role !== 'bank') {
    return <Navigate to="/access-denied" />;
  }

  return children;
};

export default BankProtectedRoute;
