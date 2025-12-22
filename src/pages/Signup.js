import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";
import "./Signup.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER"); // Default role
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim() || !role.trim()) {
      setMessage("⚠ Please fill all fields properly");
      return;
    }

    // New API expects: id, name, email, phone, password, role
    const userData = {
      id: 0,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password: password.trim(),
      role: role.trim().toUpperCase() // Send as uppercase to match enum
    };

    console.log("Sending data:", userData);

    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        "http://localhost:8080/api/users",
        userData
      );

      console.log("Response:", response.data);

      setMessage("🎉 Registration Successful! Redirecting to login...");
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setRole("USER");

      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error("Error during signup:", error);

      if (error.response) {
        setMessage("❌ " + error.response.data);
      } else {
        setMessage("⚠️ Unable to connect to the server. Try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div
        className="card shadow-lg p-5 rounded-4 animate__animated animate__fadeInUp"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h2 className="fw-bold text-center mb-4">Signup</h2>

        {message && (
          <div
            className={`alert ${
              message.includes("🎉") ? "alert-success" : "alert-danger"
            } text-center`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control form-control-lg rounded-pill"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="email"
              className="form-control form-control-lg rounded-pill"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="text"
              className="form-control form-control-lg rounded-pill"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              className="form-control form-control-lg rounded-pill"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Role Dropdown */}
          <div className="mb-3">
            <select
              className="form-select form-control-lg rounded-pill"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
              <option value="VENDOR">Vendor</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-warning btn-lg w-100 rounded-pill shadow-sm"
            disabled={loading}
          >
            {loading ? "Processing..." : "Signup"}
          </button>
        </form>

        <p className="text-center mt-3">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}

export default Signup;
