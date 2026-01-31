import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

/* USER PAGES */
import Home from "./pages/Home";
import About from "./pages/About";
import Events from "./pages/Events";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import BookingPage from "./pages/BookingPage";

/* PROTECTED ROUTE */
import ProtectedRoute from "./components/ProtectedRoute";

/* VENDOR */
import VendorLayout from "./vendor/VendorLayout";
import VendorDashboard from "./vendor/VendorDashboard";
import VendorCalendar from "./vendor/VendorCalendar";
import VendorProfileSetup from "./vendor/VendorProfileSetup";
import VendorBookings from "./vendor/VendorBookings";

/* ADMIN */
import AdminLayout from "./admin/layout/AdminLayout";
import Dashboard from "./admin/pages/dashboard/Dashboard";
import VendorList from "./admin/pages/vendors/VendorList";
import BookingList from "./admin/pages/bookings/BookingList";
import Analytics from "./admin/pages/analytics/Analytics";
import AdminProfile from "./admin/pages/settings/AdminProfile";

import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <Header />

      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/events" element={<Events />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/book/:venueId" element={<BookingPage />} />

        {/* VENDOR */}
        <Route
          path="/vendor"
          element={
            <ProtectedRoute role="VENDOR">
              <VendorLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<VendorDashboard />} />
          <Route path="dashboard" element={<VendorDashboard />} />
          <Route path="calendar" element={<VendorCalendar />} />
          <Route path="profile" element={<VendorProfileSetup />} />
          <Route path="bookings" element={<VendorBookings />} />
        </Route>

        {/* ADMIN ✅ CORRECT & SAFE */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="vendors" element={<VendorList />} />
          <Route path="bookings" element={<BookingList />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<AdminProfile />} />
        </Route>
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
