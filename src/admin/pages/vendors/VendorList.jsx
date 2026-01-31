import { useState, useEffect } from "react";
import useVendors from "../../hooks/useVendors";
import {
  approveVendor,
  rejectVendor
} from "../../services/vendor.api";
import StatusBadge from "../../components/common/StatusBadge";

const ITEMS_PER_PAGE = 5;

export default function VendorList() {
  const [status, setStatus] = useState("PENDING");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [refresh, setRefresh] = useState(false);

  const vendors = useVendors(status, refresh);

  useEffect(() => {
    setPage(1);
  }, [status, search]);

  const filteredVendors = vendors.filter(v =>
    v.businessName.toLowerCase().includes(search.toLowerCase())
  );

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedVendors = filteredVendors.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredVendors.length / ITEMS_PER_PAGE);

  const handleApprove = async (id) => {
    if (!window.confirm("Approve this vendor?")) return;
    await approveVendor(id);
    setRefresh(!refresh);
  };

  const handleReject = async (id) => {
    if (!window.confirm("Reject this vendor?")) return;
    await rejectVendor(id);
    setRefresh(!refresh);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: "5px" }}>Vendor Management</h1>

      <p style={{ color: "#555", marginBottom: "15px" }}>
        Showing {filteredVendors.length} vendors
      </p>

      {/* TABS */}
      <div style={{ marginBottom: "15px" }}>
        {["PENDING", "APPROVED", "REJECTED"].map(s => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            style={{
              marginRight: "10px",
              padding: "6px 14px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              background: status === s ? "#2563eb" : "#fff",
              color: status === s ? "#fff" : "#000",
              cursor: "pointer"
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* SEARCH */}
      <input
        placeholder="Search vendor..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          marginBottom: "15px",
          padding: "8px",
          width: "280px",
          borderRadius: "6px",
          border: "1px solid #ccc"
        }}
      />

      {/* TABLE HEADER */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr",
          padding: "10px",
          fontWeight: "bold",
          borderBottom: "2px solid #ddd",
          position: "sticky",
          top: 0,
          background: "#fff",
          zIndex: 10
        }}
      >
        <div>Business</div>
        <div>Status</div>
        <div>Actions</div>
      </div>

      {/* EMPTY STATE */}
      {paginatedVendors.length === 0 && (
        <p style={{ marginTop: "20px", color: "#777" }}>
          No vendors found for this status.
        </p>
      )}

      {/* TABLE ROWS */}
      {paginatedVendors.map(v => (
        <div
          key={v.id}
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr",
            alignItems: "center",
            padding: "12px 10px",
            borderBottom: "1px solid #eee"
          }}
        >
          <div>
            <strong>{v.businessName}</strong>
            <div style={{ fontSize: "12px", color: "#555" }}>
              {v.category} • {v.location}
            </div>
          </div>

          <StatusBadge status={v.status} />

          {status === "PENDING" ? (
            <div>
              <button
                onClick={() => handleApprove(v.id)}
                style={{
                  padding: "6px 10px",
                  background: "#16a34a",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer"
                }}
              >
                Approve
              </button>

              <button
                onClick={() => handleReject(v.id)}
                style={{
                  padding: "6px 10px",
                  background: "#dc2626",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginLeft: "8px"
                }}
              >
                Reject
              </button>
            </div>
          ) : (
            <div style={{ color: "#999" }}>—</div>
          )}
        </div>
      ))}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div style={{ marginTop: "15px" }}>
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>

          <span style={{ margin: "0 10px" }}>
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
