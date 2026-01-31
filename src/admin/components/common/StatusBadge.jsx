export default function StatusBadge({ status }) {
  const map = {
    PENDING: "#f59e0b",
    APPROVED: "#16a34a",
    REJECTED: "#dc2626"
  };

  return (
    <span
      style={{
        display: "inline-block",
        padding: "4px 10px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: "600",
        color: "#fff",
        background: map[status],
        width: "fit-content"
      }}
    >
      {status}
    </span>
  );
}
