import { useEffect, useState } from "react";
import {
  getAdminProfile,
  uploadProfilePicture
} from "../../services/admin.api";

export default function AdminProfile() {
  const userId = localStorage.getItem("userId");

  const [admin, setAdmin] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        const res = await getAdminProfile(userId);
        setAdmin(res.data);
      } catch (err) {
        console.error("Profile fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleUpload = async () => {
    if (!file) return alert("Please select an image");

    try {
      setUploading(true);

      // ✅ upload once
      await uploadProfilePicture(userId, file);

      // ✅ re-fetch profile to get updated image URL
      const res = await getAdminProfile(userId);
      setAdmin(res.data);

      setFile(null);
      alert("✅ Profile picture updated");
    } catch (err) {
      console.error("Upload error", err);
      alert("❌ Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!admin) return <p>No admin data</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "600px" }}>
      <h1>Admin Profile</h1>

      {/* PROFILE IMAGE */}
      <img
        src={
          admin.profilePicture ||
          "https://res.cloudinary.com/demo/image/upload/v1690000000/avatar.png"

        }
        alt="Admin"
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          objectFit: "cover",
          marginBottom: "15px",
          border: "2px solid #ddd"
        }}
      />

      <p><b>Name:</b> {admin.name}</p>
      <p><b>Email:</b> {admin.email}</p>
      <p><b>Role:</b> {admin.role}</p>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
        style={{ marginTop: "10px" }}
      />

      <br />

      <button
        onClick={handleUpload}
        disabled={uploading}
        style={{
          marginTop: "10px",
          padding: "8px 14px",
          cursor: uploading ? "not-allowed" : "pointer"
        }}
      >
        {uploading ? "Uploading..." : "Upload Image"}
      </button>
    </div>
  );
}
