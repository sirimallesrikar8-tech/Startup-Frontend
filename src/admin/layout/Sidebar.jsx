import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAdminProfile } from "../services/admin.api";
import useVendors from "../hooks/useVendors";

export default function Sidebar() {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);

  // 🔔 pending vendors count
  const pendingVendors = useVendors("PENDING");

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    getAdminProfile(userId)
      .then(res => setAdmin(res.data))
      .catch(err => console.error("Sidebar admin error", err));
  }, []);

  // 🚪 LOGOUT HANDLER
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div
      style={{
        width: "240px",
        background: "#fff",
        minHeight: "100vh",
        padding: "20px",
        borderRight: "1px solid #eee",
        display: "flex",
        flexDirection: "column"
      }}
    >
      {/* 👤 PROFILE */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <img
          src={
            admin?.profilePicture ||
            "https://res.cloudinary.com/demo/image/upload/v1690000000/avatar.png"
          }
          alt="Admin"
          style={{
            width: "90px",
            height: "90px",
            borderRadius: "50%",
            objectFit: "cover",
            marginBottom: "10px",
            border: "2px solid #e5e7eb"
          }}
        />
        <h4 style={{ margin: "5px 0" }}>{admin?.name || "Admin"}</h4>
        <p style={{ fontSize: "13px", color: "#666" }}>
          {admin?.role || "ADMIN"}
        </p>
      </div>

      {/* 📂 NAV LINKS */}
      <div style={{ flex: 1 }}>
        <NavLink
          to="/admin/dashboard"
          style={({ isActive }) => navStyle(isActive)}
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/vendors"
          style={({ isActive }) => navStyle(isActive)}
        >
          Vendors
          {pendingVendors.length > 0 && (
            <span style={badgeStyle}>
              {pendingVendors.length}
            </span>
          )}
        </NavLink>

        <NavLink
          to="/admin/bookings"
          style={({ isActive }) => navStyle(isActive)}
        >
          Bookings
        </NavLink>

        <NavLink
          to="/admin/analytics"
          style={({ isActive }) => navStyle(isActive)}
        >
          Analytics
        </NavLink>

        <NavLink
          to="/admin/settings"
          style={({ isActive }) => navStyle(isActive)}
        >
          Settings
        </NavLink>
      </div>

      {/* 🚪 LOGOUT */}
      <button
        onClick={handleLogout}
        style={{
          marginTop: "20px",
          padding: "10px",
          borderRadius: "8px",
          border: "none",
          background: "#ef4444",
          color: "#fff",
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        Logout
      </button>
    </div>
  );
}

/* 🎨 STYLES */
const navStyle = (isActive) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 15px",
  marginBottom: "8px",
  borderRadius: "8px",
  textDecoration: "none",
  background: isActive ? "#2563eb" : "transparent",
  color: isActive ? "#fff" : "#111"
});

const badgeStyle = {
  background: "#f59e0b",
  color: "#fff",
  fontSize: "12px",
  padding: "2px 8px",
  borderRadius: "999px",
  fontWeight: "bold"
};
