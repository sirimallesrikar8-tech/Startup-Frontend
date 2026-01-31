export default function BookingTable({ bookings }) {
  return (
    <table width="100%">
      <thead>
        <tr>
          <th>User</th>
          <th>Vendor</th>
          <th>Date</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {bookings.map(b => (
          <tr key={b.id}>
            <td>{b.userName}</td>
            <td>{b.vendorName}</td>
            <td>{b.bookingDate}</td>
            <td>{b.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
