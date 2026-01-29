import React, { useEffect, useMemo, useState } from "react";
import { getBookingsByVendor, updateBookingStatus } from "../api/booking.api";
import "./VendorBookings.css";

const STATUS_TABS = [
  "ALL",
  "PENDING",
  "ACCEPTED",
  "COMPLETED",
  "CANCELLED",
  "REJECTED",
];

const VendorBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState("ALL");

  const vendorId = localStorage.getItem("vendorId");

  /* ---------------- HELPERS ---------------- */
  const formatBookedOn = (date) => {
    if (!date) return "—";
    const d = new Date(date);
    if (isNaN(d)) return "—";

    return (
      <>
        {d.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
        <br />
        <small className="muted">
          {d.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </small>
      </>
    );
  };

  /* ---------------- LOAD BOOKINGS ---------------- */
  const loadBookings = async () => {
    if (!vendorId) return;

    setLoading(true);
    try {
      const res = await getBookingsByVendor(vendorId);
      const data = Array.isArray(res.data) ? res.data : [];

      // 🔥 sort latest bookings first
      data.sort(
        (a, b) => new Date(b.bookingTime) - new Date(a.bookingTime)
      );

      setBookings(data);

      // 🔔 sync pending count
      const pendingCount = data.filter(
        (b) => b.status === "PENDING"
      ).length;
      localStorage.setItem("pendingBookings", pendingCount);
    } catch (err) {
      console.error("Failed to load bookings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  /* ---------------- ACTION HANDLER ---------------- */
  const handleAction = async (bookingId, status) => {
    try {
      await updateBookingStatus(bookingId, status);
      loadBookings();
    } catch {
      alert("Failed to update booking");
    }
  };

  /* ---------------- FILTER ---------------- */
  const filteredBookings = useMemo(() => {
    if (activeStatus === "ALL") return bookings;
    return bookings.filter((b) => b.status === activeStatus);
  }, [bookings, activeStatus]);

  /* ---------------- UI ---------------- */
  return (
    <div className="vendor-bookings">
      <h2>All Bookings</h2>

      {/* 🔥 STATUS TABS */}
      <div className="booking-tabs">
        {STATUS_TABS.map((status) => (
          <button
            key={status}
            className={`tab ${activeStatus === status ? "active" : ""}`}
            onClick={() => setActiveStatus(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading bookings...</p>
      ) : filteredBookings.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Slot Date & Time</th>
              <th>Booked On</th>
              <th>Slot</th>
              <th>Venue</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredBookings.map((b) => (
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

                {/* Booked On */}
                <td>{formatBookedOn(b.bookingTime)}</td>

                {/* Slot */}
                <td>Slot #{b.slotId ?? "—"}</td>

                {/* Venue */}
                <td>{b.vendorName || "—"}</td>

                {/* Status */}
                <td>
                  <span className={`status-badge ${b.status.toLowerCase()}`}>
                    {b.status}
                  </span>
                </td>

                {/* Actions */}
                <td>
                  {b.status === "PENDING" && (
                    <>
                      <button
                        className="btn-accept"
                        onClick={() =>
                          handleAction(b.bookingId, "ACCEPTED")
                        }
                      >
                        Accept
                      </button>
                      <button
                        className="btn-reject"
                        onClick={() =>
                          handleAction(b.bookingId, "REJECTED")
                        }
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {b.status === "ACCEPTED" && (
                    <>
                      <button
                        className="btn-complete"
                        onClick={() =>
                          handleAction(b.bookingId, "COMPLETED")
                        }
                      >
                        Complete
                      </button>
                      <button
                        className="btn-cancel"
                        onClick={() =>
                          handleAction(b.bookingId, "CANCELLED")
                        }
                      >
                        Cancel
                      </button>
                    </>
                  )}

                  {["COMPLETED", "REJECTED", "CANCELLED"].includes(
                    b.status
                  ) && "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default VendorBookings;
