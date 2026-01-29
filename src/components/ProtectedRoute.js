import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  const location = useLocation();

  if (!token) {
    // Save the intended destination for redirect after login
    localStorage.setItem("redirectAfterLogin", location.pathname + location.search);
    return <Navigate to="/login" replace />;
  }

  // Role mismatch - redirect to appropriate dashboard
  if (role && userRole !== role) {
    // If vendor tries to access user-only routes, redirect to vendor dashboard
    if (userRole === "VENDOR") {
      return <Navigate to="/vendor/dashboard" replace />;
    }
    // If user tries to access vendor-only routes, redirect to user dashboard
    if (userRole === "USER") {
      return <Navigate to="/dashboard" replace />;
    }
    // Fallback to home
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
