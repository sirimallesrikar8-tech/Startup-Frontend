// Signup component - handles user registration with validation
// Includes vendor-specific fields (businessName, category, location)
import React, { useState } from "react";
import "animate.css";
import "./Signup.css";
import { useNavigate } from "react-router-dom";
import authService from "../admin/services/authService";

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
    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      setMessage("Please fill all required fields");
      return;
    }

    // Email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      setMessage("Please enter a valid email address");
      return;
    }

    // Vendor-specific validation
    if (role === "VENDOR" && (!businessName.trim() || !category.trim() || !location.trim())) {
      setMessage("Please fill all vendor details");
      return;
    }

    // Build payload dynamically based on role
    const userData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      password: password.trim(),
      role: role.trim().toUpperCase(),
      businessName: role === "VENDOR" ? businessName.trim() : "",
      category: role === "VENDOR" ? category.trim() : "",
      location: role === "VENDOR" ? location.trim() : ""
    };

    setLoading(true);
    setMessage("");

    try {
      await authService.register(userData);

      // Prevent auto-login - clear any tokens
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setMessage("Registration Successful! Redirecting to login...");

      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setRole("USER");
      setBusinessName("");
      setCategory("");
      setLocation("");

      setTimeout(() => {
        navigate("/login", { replace: false });
      }, 800);
    } catch (error) {
      console.error("Signup error:", error);
      const errorMsg = error.message || "Unable to connect to the server. Try again later.";
      setMessage(`Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page d-flex align-items-center justify-content-center min-vh-100">
      <div
        className="card shadow-lg p-5 rounded-4 animate__animated animate__fadeInUp"
        style={{ maxWidth: "420px", width: "100%" }}
      >
        <h2 className="fw-bold text-center mb-4">Signup</h2>

        {message && (
          <div
            className={`alert ${message.includes("Successful")
              ? "alert-success"
              : message.includes("Error") ? "alert-danger" : "alert-warning"
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
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </div>

          <div className="mb-3">
            <input
              type="tel"
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
              autoComplete="new-password"
            />
          </div>

          <div className="mb-3">
            <select
              className="form-select form-select-lg rounded-pill"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="USER">User</option>
              <option value="VENDOR">Vendor</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {/* Vendor-only fields - appear when VENDOR is selected */}
          {role === "VENDOR" && (
            <div className="vendor-fields animate__animated animate__fadeIn">
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control form-control-lg rounded-pill"
                  placeholder="Business Name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <select
                  className="form-select form-select-lg rounded-pill"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="hall">Venues & Halls</option>
                  <option value="hotel">Hotels</option>
                  <option value="photo">Photography</option>
                  <option value="decor">Decorators</option>
                  <option value="food">Catering</option>
                  <option value="dj">DJ & Music</option>
                </select>
              </div>

              <div className="mb-3">
                <input
                  type="text"
                  className="form-control form-control-lg rounded-pill"
                  placeholder="Location (e.g., Hyderabad)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
            </div>
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
