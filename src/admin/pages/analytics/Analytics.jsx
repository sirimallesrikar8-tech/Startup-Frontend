import { useEffect, useState } from "react";
import { getBookingStats } from "../../services/analytics.api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function Analytics() {
  const [vendorStats, setVendorStats] = useState([]);

  useEffect(() => {
    loadVendorAnalytics();
  }, []);

  const loadVendorAnalytics = async () => {
  const bookings = await getBookingStats();

  const map = {};

  bookings.forEach(b => {
    const vendorName =
      b.vendor?.vendorName ||
      b.vendorName ||
      b.vendor?.name ||
      "Unknown";

    map[vendorName] = (map[vendorName] || 0) + 1;
  });

  const result = Object.keys(map).map(vendor => ({
    vendor,
    bookings: map[vendor]
  }));

  setVendorStats(result);
};


  return (
    <div style={{ padding: "20px" }}>
      <h1>Analytics</h1>

      {/* 📊 BAR CHART */}
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "12px",
          height: "350px",
          marginBottom: "30px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
        }}
      >
        <h3>Vendor-wise Bookings</h3>

        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={vendorStats}>
            <XAxis dataKey="vendor" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="bookings" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 📋 TABLE */}
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
        }}
      >
        <h3>Vendor Booking Summary</h3>

        <table width="100%" style={{ marginTop: "15px" }}>
          <thead>
            <tr style={{ textAlign: "left" }}>
              <th>Vendor</th>
              <th>Total Bookings</th>
            </tr>
          </thead>
          <tbody>
            {vendorStats.map(v => (
              <tr key={v.vendor}>
                <td>{v.vendor}</td>
                <td>{v.bookings}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
