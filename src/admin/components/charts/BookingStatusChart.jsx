import { PieChart, Pie, Tooltip, Cell } from "recharts";

const COLORS = {
  COMPLETED: "#16a34a",
  PENDING: "#f59e0b",
  ACCEPTED: "#2563eb",
  REJECTED: "#dc2626",
  CANCELLED: "#6b7280"
};

export default function BookingStatusChart({ data }) {
  const chartData = Object.entries(data).map(([key, value]) => ({
    name: key,
    value
  }));

  return (
    <PieChart width={400} height={300}>
      <Pie
        data={chartData}
        dataKey="value"
        nameKey="name"
        outerRadius={100}
        label
      >
        {chartData.map(entry => (
          <Cell key={entry.name} fill={COLORS[entry.name]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
}
