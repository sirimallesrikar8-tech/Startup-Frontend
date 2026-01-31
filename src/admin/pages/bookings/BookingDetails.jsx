export default function BookingDetails({ booking, onClose }) {
  return (
    <div style={overlay}>
      <div style={modal}>
        <h3>Booking Details</h3>

        <p><b>User:</b> {booking.userName}</p>
        <p><b>Vendor:</b> {booking.vendorName}</p>
        <p><b>Date:</b> {booking.bookingDate}</p>
        <p><b>Status:</b> {booking.status}</p>

        <button onClick={onClose} style={{ marginTop: "10px" }}>
          Close
        </button>
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.3)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const modal = {
  background: "#fff",
  padding: "20px",
  borderRadius: "10px",
  width: "350px"
};
