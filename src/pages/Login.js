// Login component - handles authentication and role-based routing
import React, { useState } from "react";
import "animate.css";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import authService from "../admin/services/authService";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await authService.login(email.trim(), password.trim());

      if (response?.token) {
        setMessage("Login successful!");

        // Store user data from API response
        localStorage.setItem("userId", response.userId);
        localStorage.setItem("userName", response.name);
        localStorage.setItem("userEmail", response.email);
        localStorage.setItem("role", response.role);
        localStorage.setItem("token", response.token);

        // Store vendorId if user is a vendor
        if (response.vendorId) {
          localStorage.setItem("vendorId", response.vendorId);
        }

        // Store avatar URL if present, otherwise generate default
        const avatarUrl = response.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(response.name)}&background=137fec&color=fff`;
        localStorage.setItem("userAvatar", avatarUrl);

        const userRole = response.role?.toUpperCase() || "";

        // Check for pending redirect (e.g., user tried to book without login)
        const redirectUrl = localStorage.getItem("redirectAfterLogin");
        if (redirectUrl) {
          localStorage.removeItem("redirectAfterLogin");
          navigate(redirectUrl, { replace: true });
          return;
        }

        // Role-based routing
        if (userRole.includes("ADMIN")) {
          navigate("/admin", { replace: true });
        } else if (userRole.includes("VENDOR")) {
          navigate("/vendor", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      console.error("Login error:", err);

      // User-friendly error messages
      const isServerError = !err.response || err.response?.status >= 500 || err.message?.includes('Network Error') || err.message?.includes('Failed to fetch');

      let errorMessage;

      if (isServerError) {
        errorMessage = "Server is currently unreachable. Please try again later.";
      } else if (err.response?.status === 401 || err.response?.status === 403) {
        errorMessage = "Invalid email or password. Please try again.";
      } else {
        errorMessage = err.message || "An error occurred during login.";
      }

      setMessage(`Error: ${errorMessage}`);
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div
        className="card shadow-lg p-5 rounded-4 animate__animated animate__fadeInUp"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h2 className="fw-bold text-center mb-4">Login</h2>

        {message && (
          <div
            className={`alert ${message.includes("successful") ? "alert-success" : "alert-danger"
              } text-center`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
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
              type="password"
              className="form-control form-control-lg rounded-pill"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-warning btn-lg w-100 rounded-pill shadow-sm"
            disabled={loading}
          >
            {loading ? "Processing..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-3">
          Don't have an account? <a href="/signup">Sign Up</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
