import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";
import "./Login.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const MAX_USER_ID = 10;

  // Redirect to profile if already logged in
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      navigate("/profile");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      let userFound = null;

      for (let id = 1; id <= MAX_USER_ID; id++) {
        const response = await fetch(`http://localhost:8080/api/users/${id}`);

        if (!response.ok) continue;

        const user = await response.json();

        if (user.email === email.trim()) {
          userFound = user;
          break;
        }
      }

      if (!userFound) {
        setMessage("❌ User not found with this email.");
      } else if (userFound.password !== password.trim()) {
        setMessage("❌ Incorrect password.");
      } else {
        setMessage("✅ Login successful!");

        localStorage.setItem("userId", userFound.id);
        localStorage.setItem("userName", userFound.name);
        localStorage.setItem("userEmail", userFound.email);

        setEmail("");
        setPassword("");

        setTimeout(() => navigate("/profile"), 1000);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setMessage("⚠️ Server error. Try again later.");
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
              message.includes("✅") ? "alert-success" : "alert-info"
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
