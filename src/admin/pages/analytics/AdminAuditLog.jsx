export default function AdminAuditLog({ logs }) {
  return (
    <div>
      <h3>Admin Activity</h3>
      <ul>
        {logs.map(log => (
          <li key={log.id}>
            {log.action} – {log.target} – {new Date(log.time).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
