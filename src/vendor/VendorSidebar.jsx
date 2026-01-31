import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./VendorSidebar.css";

const VendorSidebar = () => {
  const [pendingCount, setPendingCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  // 🔔 Update badge on every route change
  useEffect(() => {
    const count = Number(localStorage.getItem("pendingBookings")) || 0;
    setPendingCount(count);
  }, [location]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <aside className="vendor-sidebar">
      <h2 className="brand">EventAllInOne</h2>

      <nav>
        <NavLink
          to="/vendor/dashboard"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          🏠 Dashboard
        </NavLink>

        <NavLink
          to="/vendor/calendar"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          📅 My Calendar
        </NavLink>

        <NavLink
          to="/vendor/bookings"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          📦 Bookings
          {pendingCount > 0 && (
            <span className="badge">{pendingCount}</span>
          )}
        </NavLink>

        <NavLink
          to="/vendor/payments"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          💳 Payments
        </NavLink>

        <NavLink
          to="/vendor/profile"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          ⚙ Profile Settings
        </NavLink>
      </nav>

      <button className="logout-btn" onClick={handleLogout}>
        🚪 Logout
      </button>
    </aside>
  );
};

export default VendorSidebar;
