// Route guard - restricts admin routes to users with ADMIN role
import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminProtectedRoute = ({ children }) => {
    const role = localStorage.getItem('role')?.toUpperCase();
    const token = localStorage.getItem('token');

    if (!token || !role?.includes('ADMIN')) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default AdminProtectedRoute;
