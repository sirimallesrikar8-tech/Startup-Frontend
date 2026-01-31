export default function AdminProfileCard() {
  const name = localStorage.getItem("userEmail");
  const role = localStorage.getItem("role");

  return (
    <div style={{
      background: "#fff",
      borderRadius: "12px",
      padding: "20px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
    }}>
      <h3>Admin Profile</h3>

      <img
        src="https://res.cloudinary.com/demo/image/upload/w_150,c_fill/avatar.png"
        alt="Admin"
        style={{ borderRadius: "50%", margin: "15px 0" }}
      />

      <p><b>Email:</b> {name}</p>
      <p><b>Role:</b> {role}</p>
    </div>
  );
}
