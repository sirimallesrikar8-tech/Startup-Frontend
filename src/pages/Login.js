import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";

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
      const res = await loginUser({
        email: email.trim(),
        password: password.trim(),
      });

      console.log("LOGIN RESPONSE:", res.data);

      // ✅ SAVE AUTH DATA
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("userEmail", res.data.email);

      // ✅ CRITICAL FIX — SAVE vendorId
      if (res.data.vendorId) {
        localStorage.setItem("vendorId", res.data.vendorId);
      }

      setMessage("✅ Login successful!");

      setTimeout(() => {
        if (res.data.role === "ADMIN") {
          navigate("/admin");
        } else if (res.data.role === "VENDOR") {
          navigate("/vendor"); // ✅ correct route
        } else {
          navigate("/profile");
        }
      }, 500);

    } catch (err) {
      console.error("Login failed", err);
      setMessage(
        err.response?.data?.message || "❌ Invalid email or password"
      );
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
        <h2 className="fw-bold text-center mb-4">Login</h2>

        {message && (
          <div
            className={`alert ${
              message.includes("✅") ? "alert-success" : "alert-danger"
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
