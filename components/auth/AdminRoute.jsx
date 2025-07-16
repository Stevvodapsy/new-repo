import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// Only allow access if user is authenticated and is admin
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  // You can use a specific field, e.g. user.role === 'admin' or user.email === 'admin@yourdomain.com'
  const isAdmin = user && user.profileType === "admin";
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
};

export default AdminRoute;
