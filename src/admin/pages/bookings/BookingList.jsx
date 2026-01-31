import useBookings from "../../hooks/useBookings";
import BookingFilters from "./BookingFilters";
import BookingDetails from "./BookingDetails";
import { useState } from "react";

export default function BookingList() {
  const { bookings, loading, status, setStatus } = useBookings();
  const [selected, setSelected] = useState(null);

  if (loading) return <p>Loading bookings...</p>;

  return (
    <div>
      <h1>Bookings</h1>

      <BookingFilters status={status} setStatus={setStatus} />

      <table width="100%">
        <thead>
          <tr>
            <th>User</th>
            <th>Vendor</th>
            <th>Date</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {bookings.map(b => (
            <tr key={b.id}>
              <td>{b.userName}</td>
              <td>{b.vendorName}</td>
              <td>{b.bookingDate}</td>
              <td>{b.status}</td>
              <td>
                <button onClick={() => setSelected(b)}>
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selected && (
        <BookingDetails
          booking={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
