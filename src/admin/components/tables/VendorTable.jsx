import StatusBadge from "../common/StatusBadge";

export default function VendorTable({ data }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {data.map(v => (
          <tr key={v.id}>
            <td>{v.name}</td>
            <td><StatusBadge status={v.status} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
