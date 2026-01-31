import { useNavigate } from "react-router-dom";

export default function QuickActionCard() {
  const navigate = useNavigate();

  return (
    <div style={{
      background: "#fff",
      borderRadius: "12px",
      padding: "20px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
    }}>
      <h3>Quick Actions</h3>

      <button onClick={() => navigate("/admin/vendors")} style={btn}>Manage Vendors</button>
      <button onClick={() => navigate("/admin/bookings")} style={btn}>View Bookings</button>
      <button onClick={() => navigate("/admin/settings")} style={btn}>Settings</button>
    </div>
  );
}

const btn = {
  display: "block",
  width: "100%",
  padding: "10px",
  marginTop: "10px",
  borderRadius: "8px",
  border: "none",
  background: "#2563eb",
  color: "#fff",
  cursor: "pointer"
};
