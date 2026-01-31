import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");
  const profileCompleted =
    localStorage.getItem("vendorProfileCompleted") === "true";

  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role && userRole !== role) {
    return <Navigate to="/" replace />;
  }

  // 🔥 FORCE PROFILE COMPLETION
  if (
    userRole === "VENDOR" &&
    !profileCompleted &&
    location.pathname !== "/vendor/profile"
  ) {
    return <Navigate to="/vendor/profile" replace />;
  }

  return children;
};

export default ProtectedRoute;
