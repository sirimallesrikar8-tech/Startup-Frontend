import React from "react";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Header.css';
import logo from '../assets/logo.png'; // Make sure your logo image is in src/assets folder

const Header = () => {
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
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link px-3" to="/">Home</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link px-3" to="/about">About</Link>
            </li>

            {/* 
            <li className="nav-item">
              <Link className="nav-link px-3" to="/events">Events</Link>
            </li>
            */}

            <li className="nav-item">
              <Link className="nav-link px-3" to="/contact">Contact</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link px-3 btn btn-outline-warning rounded-pill ms-2" to="/login">Login</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link px-3 btn btn-warning text-dark rounded-pill ms-2" to="/signup">Signup</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
