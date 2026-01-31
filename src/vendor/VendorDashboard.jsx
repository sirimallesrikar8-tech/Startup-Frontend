import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useNavigate } from "react-router-dom";
import "./VendorDashboard.css";
import { getVendorById } from "../api/vendor.api";
import { getUserProfile } from "../api/auth";

import { getBookingsByVendor, updateBookingStatus } from "../api/booking.api";
import { getVendorMedia } from "../api/vendorMedia.api"; // ✅ correct import

const VendorDashboard = () => {
  const navigate = useNavigate();
  const [profilePicture, setProfilePicture] = useState(null);

  const [vendor, setVendor] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [vendorMedia, setVendorMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const vendorId = localStorage.getItem("vendorId");
  const userId = localStorage.getItem("userId");

  const loadDashboard = async () => {
    try {
      if (!vendorId || !userId) {
  setError("User not found. Please login again.");
  return;
}

      const [vendorRes, bookingRes, mediaRes, profileRes] = await Promise.all([
        getVendorById(vendorId),
        getBookingsByVendor(vendorId),
        getVendorMedia(vendorId),
        getUserProfile(userId),
      ]);

      const bookingsData = Array.isArray(bookingRes.data)
        ? bookingRes.data
        : [];
      setProfilePicture(profileRes.data.profilePicture);
      setVendor(vendorRes.data);
      setBookings(bookingsData);
      setVendorMedia(Array.isArray(mediaRes.data) ? mediaRes.data : []);
      setProfilePicture(profileRes.data.profilePicture);

      // 🔔 pending badge
      const pendingCount = bookingsData.filter(
        (b) => b.status === "PENDING"
      ).length;
      localStorage.setItem("pendingBookings", pendingCount);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);
  useEffect(() => {
  const handleProfilePictureUpdate = async () => {
    try {
      const res = await getUserProfile(userId);
      setProfilePicture(res.data.profilePicture);
    } catch (err) {
      console.error("Failed to refresh profile picture", err);
    }
  };

  window.addEventListener("profilePictureUpdated", handleProfilePictureUpdate);

  return () => {
    window.removeEventListener(
      "profilePictureUpdated",
      handleProfilePictureUpdate
    );
  };
}, [userId]);

useEffect(() => {
  const handleVendorMediaUpdate = async () => {
    try {
      const res = await getVendorMedia(vendorId);
      setVendorMedia(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to refresh vendor media", err);
    }
  };

  window.addEventListener("vendorMediaUpdated", handleVendorMediaUpdate);

  return () => {
    window.removeEventListener(
      "vendorMediaUpdated",
      handleVendorMediaUpdate
    );
  };
}, [vendorId]);





  const handleStatusChange = async (bookingId, status) => {
    try {
      await updateBookingStatus(bookingId, status);
      loadDashboard();
    } catch {
      alert("Failed to update booking status");
    }
  };

  if (loading) return <p style={{ padding: 24 }}>Loading dashboard...</p>;
  if (error) return <p style={{ padding: 24, color: "red" }}>{error}</p>;
  

  /* ---------- DERIVED VALUES ---------- */
  const totalBookings = bookings.length;

  const upcomingEvents = bookings.filter(
    (b) => b.eventDate && new Date(b.eventDate) > new Date()
  ).length;

  const totalEarnings = bookings
    .filter((b) => b.status === "CONFIRMED")
    .reduce((sum, b) => sum + Number(b.amount || 0), 0);

  const recentBookings = bookings.slice(0, 5);

  /* ---------- CHART DATA ---------- */
  const bookingStatusData = [
    { name: "Pending", value: bookings.filter(b => b.status === "PENDING").length },
    { name: "Confirmed", value: bookings.filter(b => b.status === "CONFIRMED").length },
    { name: "Rejected", value: bookings.filter(b => b.status === "REJECTED").length },
  ];


  const earningsData = [{ name: "Earnings", amount: totalEarnings || 0 }];
  const COLORS = ["#facc15", "#22c55e", "#ef4444"];
  console.log("vendorMedia:", vendorMedia);
console.log("profilePicture:", profilePicture);


  return (
    <div className="vendor-dashboard">
     <div className="dashboard-header">
  <div className="dashboard-header-flex">
    <div className="dashboard-profile-circle">
      {profilePicture ? (
  <img
    src={profilePicture}
    alt="Profile"
  />
      ) : (
        <span>👤</span>
      )}
    </div>

    <div>
      <h2>Dashboard</h2>
      <p className="subtitle">Welcome back 👋</p>
    </div>
  </div>
</div>


      {/* STATS */}
      <div className="dashboard-stats">
        <div className="stat-card bookings">
          <span>📅 Total Bookings</span>
          <h3>{totalBookings}</h3>
        </div>
        <div className="stat-card earnings">
          <span>💰 Total Earnings</span>
          <h3>₹ {totalEarnings.toLocaleString()}</h3>
        </div>
        <div className="stat-card availability">
          <span>📊 Availability</span>
          <h3>82%</h3>
        </div>
      </div>

      {/* ✅ VENDOR INFO + STATUS */}
      <div className="vendor-info-card">
        <h3>Vendor Information</h3>
        <p><b>Business:</b> {vendor?.businessName}</p>
        <p><b>Category:</b> {vendor?.category}</p>
        <p><b>Location:</b> {vendor?.location}</p>
        <p>
          <b>Status:</b>{" "}
          <span className={`vendor-status ${vendor?.status?.toLowerCase()}`}>
            {vendor?.status}
          </span>
        </p>
      </div>

      {/* ✅ VENDOR PHOTOS INSIDE DASHBOARD */}
      <div className="analytics-card">
        <h3>Business Photos</h3>

        {vendorMedia.length === 0 ? (
          <p className="muted">No photos uploaded yet</p>
        ) : (
          <div className="vendor-media-grid">
            {vendorMedia.map((media) => (
              <div key={media.id} className="vendor-media-item">
                <img src={media.imageUrl} alt="Vendor" />
                {media.caption && (
                  <small className="media-caption">{media.caption}</small>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ANALYTICS */}
      <div className="analytics-card">
        <h3>Analytics Overview</h3>

        <div className="analytics-grid">
          <div className="chart-box">
            <h4>Bookings Status</h4>
            {totalBookings === 0 ? (
              <p className="muted">No booking data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={bookingStatusData} dataKey="value" nameKey="name" outerRadius={80} label>
                    {bookingStatusData.map((item, index) => (
  <Cell key={item.name} fill={COLORS[index]} />
))}


                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="chart-box">
            <h4>Total Earnings</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={earningsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* RECENT BOOKINGS */}
      <div className="recent-bookings">
        <h3>Recent Bookings</h3>

        {recentBookings.length === 0 ? (
          <p>No bookings yet</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Slot Date & Time</th>
<th>Slot</th>

                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((b) => (
                <tr key={b.bookingId}>
  {/* Customer */}
  <td>{b.userName || "—"}</td>

  {/* Slot Date & Time */}
  <td>
    {b.slotDate || "—"} <br />
    <small className="muted">
      {b.slotStartTime && b.slotEndTime
        ? `${b.slotStartTime} - ${b.slotEndTime}`
        : "—"}
    </small>
  </td>

  {/* Event / Slot */}
  <td>Slot #{b.slotId ?? "—"}</td>

  {/* Status */}
  <td className={`status ${b.status?.toLowerCase()}`}>
    {b.status}
  </td>

  {/* Action */}
  <td>
    {b.status === "PENDING" ? (
      <>
        <button
          className="btn-accept"
          onClick={() =>
            handleStatusChange(b.bookingId, "ACCEPTED")
          }
        >
          Accept
        </button>
        <button
          className="btn-reject"
          onClick={() =>
            handleStatusChange(b.bookingId, "REJECTED")
          }
        >
          Reject
        </button>
      </>
    ) : "—"}
  </td>
</tr>

              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;
