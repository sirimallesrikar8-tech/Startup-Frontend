import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";
import "./Signup.css";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";

function Signup() {
  // Common fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");

  // Vendor-only fields
  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!name || !email || !phone || !password || !role) {
      setMessage("⚠ Please fill all required fields");
      return;
    }

    // Vendor validation
    if (
      role === "VENDOR" &&
      (!businessName || !category || !location)
    ) {
      setMessage("⚠ Please fill all vendor details");
      return;
    }

    setLoading(true);
    setMessage("");

    // Build payload dynamically
    const payload =
      role === "VENDOR"
        ? {
            name,
            email,
            phone,
            password,
            role,
            businessName,
            category,
            location,
          }
        : {
            name,
            email,
            phone,
            password,
            role,
          };

    try {
      await registerUser(payload);

      // 🚫 VERY IMPORTANT: prevent auto-login
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setMessage("🎉 Signup successful! Please login.");

      setTimeout(() => {
        navigate("/login");
      }, 800);

    } catch (err) {
      setMessage(
        err.response?.data?.message || "❌ Signup failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div
        className="card shadow-lg p-5 rounded-4 animate__animated animate__fadeInUp"
        style={{ maxWidth: "420px", width: "100%" }}
      >
        <h2 className="fw-bold text-center mb-4">Signup</h2>

        {message && (
          <div className="alert alert-info text-center">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            className="form-control form-control-lg rounded-pill mb-3"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            className="form-control form-control-lg rounded-pill mb-3"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="form-control form-control-lg rounded-pill mb-3"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <input
            type="password"
            className="form-control form-control-lg rounded-pill mb-3"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <select
            className="form-select form-control-lg rounded-pill mb-3"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="USER">User</option>
            <option value="VENDOR">Vendor</option>
            <option value="ADMIN">Admin</option>
          </select>

          {/* Vendor-only fields */}
          {role === "VENDOR" && (
            <>
              <input
                className="form-control form-control-lg rounded-pill mb-3"
                placeholder="Business Name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />

              <input
                className="form-control form-control-lg rounded-pill mb-3"
                placeholder="Category (Eg: Electronics)"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />

              <input
                className="form-control form-control-lg rounded-pill mb-3"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </>
          )}

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
