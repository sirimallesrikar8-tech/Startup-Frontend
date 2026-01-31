import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export default function VendorBookingsChart({ bookings }) {
  const data = Object.values(
    bookings.reduce((acc, b) => {
      acc[b.vendorName] = acc[b.vendorName] || {
        vendor: b.vendorName,
        count: 0
      };
      acc[b.vendorName].count++;
      return acc;
    }, {})
  );

  return (
    <BarChart width={600} height={300} data={data}>
      <XAxis dataKey="vendor" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="count" fill="#2563eb" />
    </BarChart>
  );
}
