import { useEffect, useState } from "react";
import useVendors from "../../hooks/useVendors";
import useBookings from "../../hooks/useBookings";
import { getAdminProfile } from "../../services/admin.api";

// 📊 chart imports
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const pending = useVendors("PENDING");
  const approved = useVendors("APPROVED");
  const rejected = useVendors("REJECTED");

  const { bookings = [], loading } = useBookings();


  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    getAdminProfile(userId)
      .then(res => setAdmin(res.data))
      .catch(err => console.error("Admin fetch error", err));
  }, []);

  // ✅ booking counts
  const pendingBookings = bookings.filter(b => b.status === "PENDING").length;
  const completedBookings = bookings.filter(b => b.status === "COMPLETED").length;
  const cancelledBookings = bookings.filter(b => b.status === "CANCELLED").length;

  // 🎯 donut chart data
  const bookingChartData = {
    labels: ["Pending", "Completed", "Cancelled"],
    datasets: [
      {
        data: [
          pendingBookings,
          completedBookings,
          cancelledBookings
        ],
        backgroundColor: ["#f59e0b", "#16a34a", "#dc2626"],
        borderWidth: 1
      }
    ]
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <p>
        Welcome back, <b>{admin?.email}</b> ({admin?.role})
      </p>

      {/* TOP STATS */}
      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        {[
          { label: "Pending Vendors", count: pending.length, color: "#f59e0b" },
          { label: "Approved Vendors", count: approved.length, color: "#16a34a" },
          { label: "Rejected Vendors", count: rejected.length, color: "#dc2626" }
        ].map(c => (
          <div
            key={c.label}
            style={{
              padding: "20px",
              minWidth: "180px",
              borderRadius: "12px",
              background: c.color,
              color: "#fff"
            }}
          >
            <h4>{c.label}</h4>
            <h1>{c.count}</h1>
          </div>
        ))}
      </div>

      {/* LOWER SECTION */}
      <div style={{ display: "flex", gap: "20px", marginTop: "30px" }}>
        
        {/* RECENT ACTIVITY + MINI CHART */}
        <div
          style={{
            flex: 2,
            background: "#fff",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
          }}
        >
          <h3>Recent Activity</h3>

          <ul>
            <li>{pending.length} vendor(s) awaiting approval</li>
            <li>{approved.length} vendors live on platform</li>
            <li>{rejected.length} vendor applications rejected</li>
            <li>{bookings.length} total bookings</li>
          </ul>

          {/* 🔥 MINI DONUT CHART */}
          <div style={{ maxWidth: "260px", marginTop: "20px" }}>
            <Doughnut
              data={bookingChartData}
              options={{
                plugins: {
                  legend: {
                    position: "bottom"
                  }
                }
              }}
            />
          </div>
        </div>

        {/* QUICK STATS */}
        <div
          style={{
            flex: 1,
            background: "#fff",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
          }}
        >
          <h3>Quick Stats</h3>
          <p>⏳ Pending Bookings: <b>{pendingBookings}</b></p>
          <p>✅ Completed Bookings: <b>{completedBookings}</b></p>
          <p>❌ Cancelled Bookings: <b>{cancelledBookings}</b></p>
        </div>
      </div>
    </div>
  );
}
