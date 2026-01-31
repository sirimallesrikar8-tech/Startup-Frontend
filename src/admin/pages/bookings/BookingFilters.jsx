export default function BookingFilters({ status, setStatus }) {
  const filters = ["ALL", "PENDING", "APPROVED", "CANCELLED"];

  return (
    <div style={{ marginBottom: "15px", display: "flex", gap: "10px" }}>
      {filters.map(s => (
        <button
          key={s}
          onClick={() => setStatus(s)}
          style={{
            padding: "6px 14px",
            borderRadius: "20px",
            border: "none",
            cursor: "pointer",
            background: status === s ? "#2563eb" : "#e5e7eb",
            color: status === s ? "#fff" : "#111"
          }}
        >
          {s}
        </button>
      ))}
    </div>
  );
}
