import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  // Fetch logged-in user details
  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) {
        setLoadingUser(false);
        return;
      }
      try {
        const res = await fetch(`http://localhost:8080/api/users/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch user data");

        const data = await res.json();
        setUser(data);
        setFormData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          password: "",
        });
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update user");

      const updatedUser = await res.json();
      setUser(updatedUser);
      setEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile");
    }
  };

  return (
    <div className="app-container d-flex flex-column min-vh-100">
      <div className="profile-container flex-grow-1 animate__animated animate__fadeIn container py-4">
        {loadingUser ? (
          <p className="text-center text-muted fs-5 mt-4">Loading user data...</p>
        ) : user ? (
          <>
            <h2 className="mb-3 text-center title">
              Welcome back, <span className="highlight">{user.name}</span>!
            </h2>

            <div className="user-info mb-4">
              {editing ? (
                <>
                  <div className="mb-2">
                    <label>Name:</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                  <div className="mb-2">
                    <label>Email:</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                  <div className="mb-2">
                    <label>Phone:</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                  <div className="mb-2">
                    <label>Password:</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Enter new password"
                    />
                  </div>

                  <button className="btn btn-success mt-2" onClick={handleSave}>
                    Save
                  </button>
                  <button
                    className="btn btn-secondary mt-2 ms-2"
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Phone:</strong> {user.phone || "N/A"}</p>
                  <p className="text-muted fst-italic info-text">
                    Here's your profile information.
                  </p>
                  <button
                    className="btn btn-outline-pink mt-2"
                    onClick={() => setEditing(true)}
                  >
                    Edit Profile
                  </button>
                </>
              )}
            </div>

            <div className="text-center mb-5 d-flex justify-content-center gap-3 flex-wrap">
              <button
                className="btn btn-pink btn-lg shadow-sm"
                onClick={() => navigate("/events")}
              >
                Book a New Event
              </button>
              <button
                className="btn btn-outline-pink btn-lg shadow-sm"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-danger mt-4">
            User data not found. Please login again.
          </p>
        )}
      </div>
    </div>
  );
}

export default Profile;
