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
import { getVendorById, getVendorReviews } from "../api/vendor.api";
import { getUserProfile } from "../api/auth";
import { getVendorDetails } from "../api/vendorDetails.api";

import { getBookingsByVendor, updateBookingStatus } from "../api/booking.api";
import { getVendorMedia } from "../api/vendorMedia.api";


const VendorDashboard = () => {
  const navigate = useNavigate();
  const [profilePicture, setProfilePicture] = useState(null);

  const [vendor, setVendor] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [vendorMedia, setVendorMedia] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [vendorDetails, setVendorDetails] = useState(null);
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

      const [vendorRes, bookingRes, mediaRes, profileRes, reviewsRes] = await Promise.all([
        getVendorById(vendorId),
        getBookingsByVendor(vendorId),
        getVendorMedia(vendorId),
        getUserProfile(userId),
        getVendorReviews(vendorId),
      ]);

      const bookingsData = Array.isArray(bookingRes.data) ? bookingRes.data : [];

      setVendor(vendorRes.data);
      setBookings(bookingsData);
      setVendorMedia(Array.isArray(mediaRes.data) ? mediaRes.data : []);
      setProfilePicture(profileRes.data.profilePicture);
      setReviews(Array.isArray(reviewsRes.data) ? reviewsRes.data : []);

      // Fetch vendor details (GST, PAN/TAN, Aadhaar)
      try {
        const detailsRes = await getVendorDetails(userId);
        if (detailsRes.data) {
          setVendorDetails(detailsRes.data);
        }
      } catch (detailsErr) {
        console.log("No vendor details found");
      }

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
      window.removeEventListener("profilePictureUpdated", handleProfilePictureUpdate);
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
      window.removeEventListener("vendorMediaUpdated", handleVendorMediaUpdate);
    };
  }, [vendorId]);

  // Listen for vendor details updates so dashboard can refresh GST/PAN/Aadhaar
  useEffect(() => {
    const handleVendorDetailsUpdate = async () => {
      try {
        const detailsRes = await getVendorDetails(userId);
        if (detailsRes && detailsRes.data) {
          setVendorDetails(detailsRes.data);
        } else {
          setVendorDetails(null);
        }
      } catch (err) {
        console.error("Failed to refresh vendor details", err);
      }
    };

    window.addEventListener("vendorDetailsUpdated", handleVendorDetailsUpdate);

    return () => {
      window.removeEventListener("vendorDetailsUpdated", handleVendorDetailsUpdate);
    };
  }, [userId]);

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

  const totalEarnings = bookings
    .filter((b) => b.status === "CONFIRMED")
    .reduce((sum, b) => sum + Number(b.amount || 0), 0);

  const recentBookings = bookings.slice(0, 5);
  const recentReviews = reviews.slice(0, 3); // Top 3 recent reviews

  /* ---------- CHART DATA ---------- */
  const bookingStatusData = [
    { name: "Pending", value: bookings.filter(b => b.status === "PENDING").length },
    { name: "Confirmed", value: bookings.filter(b => b.status === "CONFIRMED").length },
    { name: "Rejected", value: bookings.filter(b => b.status === "REJECTED").length },
  ];

  const earningsData = [{ name: "Earnings", amount: totalEarnings || 0 }];
  const COLORS = ["#facc15", "#22c55e", "#ef4444"];

  const renderStars = (score) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} style={{ color: i < score ? "#ffc107" : "#ddd" }}>★</span>
    ));
  };

  return (
    <div className="vendor-dashboard">
      <div className="dashboard-header">
        <div className="dashboard-header-flex">
          <div className="dashboard-profile-circle">
            {profilePicture ? (
              <img src={profilePicture} alt="Profile" />
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

        {/* Vendor Details - GST, PAN/TAN, Aadhaar */}
        {vendorDetails && (
          <>
            <hr style={{ margin: '12px 0', borderColor: '#eee' }} />
            <p><b>GST Number:</b> {vendorDetails.gstNumber || '—'}</p>
            <p><b>PAN/TAN:</b> {vendorDetails.panOrTan || '—'}</p>
            <p><b>Aadhaar:</b> {vendorDetails.aadharNumber || '—'}</p>
          </>
        )}
      </div>

      {/* ✅ REVIEWS SECTION */}
      <div className="analytics-card">
        <h3>User Reviews & Feedback</h3>
        {recentReviews.length === 0 ? (
          <p className="muted">No reviews received yet.</p>
        ) : (
          <div className="review-list-dashboard">
            {recentReviews.map((review, i) => (
              <div key={review.id || i} className="dashboard-review-item" style={{
                padding: '12px',
                borderBottom: '1px solid #eee',
                marginBottom: '8px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 'bold' }}>User #{review.userId || 'Anonymous'}</span>
                  <span style={{ fontSize: '0.85rem', color: '#888' }}>
                    {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}
                  </span>
                </div>
                <div style={{ marginBottom: '6px' }}>{renderStars(review.rating || 0)}</div>
                <p style={{ margin: 0, color: '#555', fontSize: '0.95rem' }}>
                  {review.review || 'No comment provided'}
                </p>
              </div>
            ))}
            {reviews.length > 3 && (
              <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <small className="muted">+ {reviews.length - 3} more reviews</small>
              </div>
            )}
          </div>
        )}
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
                  <td>{b.userName || "—"}</td>
                  <td>
                    {b.slotDate || "—"} <br />
                    <small className="muted">
                      {b.slotStartTime && b.slotEndTime
                        ? `${b.slotStartTime} - ${b.slotEndTime}`
                        : "—"}
                    </small>
                  </td>
                  <td>Slot #{b.slotId ?? "—"}</td>
                  <td className={`status ${b.status?.toLowerCase()}`}>
                    {b.status}
                  </td>
                  <td>
                    {b.status === "PENDING" ? (
                      <>
                        <button
                          className="btn-accept"
                          onClick={() => handleStatusChange(b.bookingId, "ACCEPTED")}
                        >
                          Accept
                        </button>
                        <button
                          className="btn-reject"
                          onClick={() => handleStatusChange(b.bookingId, "REJECTED")}
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      "—"
                    )}
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
