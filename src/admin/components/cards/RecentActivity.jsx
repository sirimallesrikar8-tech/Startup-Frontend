export default function RecentActivity() {
  return (
    <div style={{
      background: "#fff",
      borderRadius: "12px",
      padding: "20px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
    }}>
      <h3>Recent Activity</h3>

      <ul style={{ marginTop: "10px" }}>
        <li>Vendor “nandu” applied</li>
        <li>Vendor approved</li>
        <li>New booking created</li>
        <li>Booking cancelled</li>
      </ul>
    </div>
  );
}
