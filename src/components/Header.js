import React from "react";
import { Link, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Header.css';
import logo from '../assets/logo.png';

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('vendorId');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userAvatar');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light custom-navbar shadow-sm py-3">
      <div className="container">
        {/* Logo Section */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src={logo} alt="EventAllInOne Logo" className="logo-img me-2" />
          <span className="fw-bold fs-4 text-dark">EventAllInOne</span>
        </Link>

        {/* Toggle button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav links */}
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav align-items-center">
            <li className="nav-item">
              <Link className="nav-link px-3" to="/">Home</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link px-3" to="/about">About</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link px-3" to="/contact">Contact</Link>
            </li>

            {token ? (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link px-3 fw-bold text-primary"
                    to={role === 'VENDOR' ? '/vendor/dashboard' : '/dashboard'}
                  >
                    {role === 'VENDOR' ? 'Vendor Panel' : 'User Dashboard'}
                  </Link>
                </li>
                <li className="nav-item ms-2">
                  <button onClick={handleLogout} className="btn btn-outline-danger rounded-pill px-4">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link px-3" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link px-3 btn btn-warning text-dark rounded-pill ms-2" to="/signup">Signup</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
