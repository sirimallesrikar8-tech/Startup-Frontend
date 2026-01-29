// Main app component - handles routing and auth state validation on mount
import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AdminProtectedRoute from './components/AdminProtectedRoute';
import ProtectedRoute from './components/ProtectedRoute';
import { ensureValidAuthState } from './utils/authValidator';

// Lazy-loaded components for code splitting
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Events = lazy(() => import("./pages/Events"));
const Contact = lazy(() => import("./pages/Contact"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Profile = lazy(() => import("./pages/Profile"));
const VenueDetails = lazy(() => import("./pages/VenueDetails"));
const BookingPage = lazy(() => import("./pages/BookingPage"));
const UserDashboard = lazy(() => import("./user/UserDashboard"));
const AdminEntry = lazy(() => import(/* webpackChunkName: "admin" */ './admin/AdminEntry'));

// Vendor Dashboard components
const VendorLayout = lazy(() => import("./vendor/VendorLayout"));
const VendorDashboard = lazy(() => import("./vendor/VendorDashboard"));
const VendorCalendar = lazy(() => import("./vendor/VendorCalendar"));
const VendorProfileSetup = lazy(() => import("./vendor/VendorProfileSetup.js"));
const VendorBookings = lazy(() => import("./vendor/VendorBookings"));
const VendorPayments = lazy(() => import("./vendor/VendorPayments"));
const VendorReviews = lazy(() => import("./vendor/VendorReviews"));

const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    fontSize: '1.2rem',
    color: '#666'
  }}>
    <div>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p style={{ marginTop: '1rem' }}>Loading...</p>
    </div>
  </div>
);

// Component to redirect vendors away from public pages
const VendorRedirect = ({ children }) => {
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');

  // If user is logged in as VENDOR, redirect to vendor dashboard
  if (token && role === 'VENDOR') {
    return <Navigate to="/vendor/dashboard" replace />;
  }

  return children;
};

// Component to conditionally render Header/Footer based on route
const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isDashboardRoute = location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/user/dashboard');

  // Hide Header/Footer for admin and user dashboard routes only
  // Vendor pages will show Header/Footer
  const hideLayout = isAdminRoute || isDashboardRoute;

  return (
    <div className="d-flex flex-column min-vh-100">
      {!hideLayout && <Header />}
      <main className="flex-fill">
        <Routes>
          {/* PUBLIC ROUTES - Vendors get redirected to their dashboard */}
          <Route path="/" element={<VendorRedirect><Home /></VendorRedirect>} />
          <Route path="/about" element={<VendorRedirect><About /></VendorRedirect>} />
          <Route path="/events" element={<VendorRedirect><Events /></VendorRedirect>} />
          <Route path="/contact" element={<VendorRedirect><Contact /></VendorRedirect>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />

          {/* Venue Details - Public (can view without login) */}
          <Route path="/venue/:venueId" element={<VendorRedirect><VenueDetails /></VendorRedirect>} />

          {/* Protected routes - Only logged in USERS can book */}
          <Route
            path="/book/:venueId"
            element={
              <ProtectedRoute role="USER">
                <BookingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role="USER">
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute role="USER">
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected admin routes */}
          <Route
            path="/admin/*"
            element={
              <AdminProtectedRoute>
                <AdminEntry />
              </AdminProtectedRoute>
            }
          />

          {/* Protected vendor routes */}
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
            <Route path="payments" element={<VendorPayments />} />
            <Route path="reviews" element={<VendorReviews />} />
          </Route>
        </Routes>
      </main>
      {!hideLayout && <Footer />}
    </div>
  );
};

function App() {
  // Validate and clear auth state immediately on initialization
  ensureValidAuthState();

  return (
    <Router>
      <Suspense fallback={<LoadingFallback />}>
        <AppContent />
      </Suspense>
    </Router>
  );
}

export default App;
