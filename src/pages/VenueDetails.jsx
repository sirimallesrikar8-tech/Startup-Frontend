import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  MapPin,
  Star,
  Users,
  Clock,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  CheckCircle,
  Shield,
  Calendar,
  ArrowRight,
  Award,
  Sparkles,
  Camera,
  Utensils,
  Wifi,
  Car,
  Music,
  Zap,
  Lock,
  Building2,
  UserCheck
} from "lucide-react";
import bookingService from "../services/BookingService";

// Extended venue data with more details
const VENUE_DETAILS = {
  "grand-plaza-hall": {
    gallery: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80",
      "https://images.unsplash.com/photo-1478146059778-26028b07395a?w=1200&q=80",
      "https://images.unsplash.com/photo-1531058020387-3be344556be6?w=1200&q=80",
    ],
    reviews: [
      { name: "Priya Sharma", avatar: "PS", rating: 5, text: "Amazing venue! The staff was incredibly helpful and the hall was beautifully decorated. Our wedding was a dream come true!", date: "Jan 2026" },
      { name: "Rahul Mehta", avatar: "RM", rating: 5, text: "Perfect for our wedding reception. The ambiance was magical and guests couldn't stop complimenting the venue.", date: "Dec 2025" },
      { name: "Anita Kapoor", avatar: "AK", rating: 4, text: "Great location and spacious. Food was excellent. Would definitely recommend for large gatherings.", date: "Nov 2025" },
    ],
    contact: { phone: "+91 98765 43210", email: "bookings@grandplaza.com" },
    openHours: "9:00 AM - 11:00 PM",
    highlights: ["500+ Events Hosted", "4.8★ Average Rating", "AC & Non-AC Options", "In-house Catering"],
    stats: { events: "500+", rating: "4.8", years: "12+" }
  },
  "elegance-photography": {
    gallery: [
      "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=1200&q=80",
      "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1200&q=80",
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&q=80",
    ],
    reviews: [
      { name: "Sneha Roy", avatar: "SR", rating: 5, text: "Best photographers in town! Captured every moment beautifully.", date: "Jan 2026" },
      { name: "Vikram Thakur", avatar: "VT", rating: 5, text: "Professional team, amazing album quality.", date: "Dec 2025" },
    ],
    contact: { phone: "+91 87654 32109", email: "hello@elegancephoto.com" },
    openHours: "10:00 AM - 8:00 PM",
    highlights: ["1000+ Weddings Shot", "4.9★ Average Rating", "Drone Coverage", "Same-day Highlights"],
    stats: { events: "1000+", rating: "4.9", years: "8+" }
  }
};

// Default details for venues without specific data
const DEFAULT_DETAILS = {
  gallery: [
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80",
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80",
  ],
  reviews: [
    { name: "Happy Customer", avatar: "HC", rating: 5, text: "Great service and professional team!", date: "Jan 2026" },
  ],
  contact: { phone: "+91 98765 00000", email: "info@eventallinone.com" },
  openHours: "9:00 AM - 9:00 PM",
  highlights: ["Verified Vendor", "Premium Service", "Best Price Guarantee"],
  stats: { events: "100+", rating: "4.5", years: "5+" }
};

// Amenity icons mapping
const amenityIcons = {
  "AC": Zap,
  "Parking": Car,
  "Catering": Utensils,
  "WiFi": Wifi,
  "Stage": Sparkles,
  "Sound System": Music,
  "Decoration": Sparkles,
  "default": CheckCircle
};

function VenueDetails() {
  const { venueId } = useParams();
  const navigate = useNavigate();

  // Auth state
  const isLoggedIn = !!localStorage.getItem("token");
  const userName = localStorage.getItem("userName") || "";

  // Component state
  const [venue, setVenue] = useState(null);
  const [details, setDetails] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Load venue data - ready for API integration
  useEffect(() => {
    const loadVenueData = async () => {
      setLoading(true);
      try {
        // This can be replaced with API call: const response = await venueService.getById(venueId);
        const venueData = bookingService.getVenueById(venueId);
        if (venueData) {
          setVenue(venueData);
          setDetails(VENUE_DETAILS[venueId] || DEFAULT_DETAILS);
        }
      } catch (error) {
        console.error("Failed to load venue:", error);
      } finally {
        setLoading(false);
      }
    };

    loadVenueData();
  }, [venueId]);

  // Check wishlist status from localStorage
  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setIsWishlisted(wishlist.includes(venueId));
  }, [venueId]);

  // Auto-slide gallery
  useEffect(() => {
    if (details?.gallery && details.gallery.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % details.gallery.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [details]);

  const nextImage = () => {
    if (details?.gallery) {
      setCurrentImageIndex((prev) => (prev + 1) % details.gallery.length);
    }
  };

  const prevImage = () => {
    if (details?.gallery) {
      setCurrentImageIndex((prev) => (prev - 1 + details.gallery.length) % details.gallery.length);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${venue?.name} - EventAllInOne`,
          text: `Check out ${venue?.name} for your next event!`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    }
  };

  const getAmenityIcon = (amenity) => {
    const IconComponent = Object.entries(amenityIcons).find(([key]) =>
      amenity.toLowerCase().includes(key.toLowerCase())
    )?.[1] || amenityIcons.default;
    return IconComponent;
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p style={styles.loadingText}>Loading venue details...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!venue) {
    return (
      <div style={styles.notFoundContainer}>
        <div style={styles.notFoundCard}>
          <div style={styles.notFoundIcon}><Building2 size={48} color="#ec4899" /></div>
          <h2 style={styles.notFoundTitle}>Venue Not Found</h2>
          <p style={styles.notFoundText}>The venue you're looking for doesn't exist or has been removed.</p>
          <Link to="/events" style={styles.backButton}>
            <ArrowRight size={18} style={{ transform: 'rotate(180deg)' }} />
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{venue.name} - EventAllInOne | Premium Venue Booking</title>
        <meta name="description" content={`Book ${venue.name} in ${venue.location}. ${venue.description} Rated ${venue.rating}/5 stars.`} />
      </Helmet>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        
        .venue-page { min-height: 100vh; background: #fff; }
        
        .hero-section {
          position: relative;
          height: 70vh;
          min-height: 500px;
          max-height: 700px;
          overflow: hidden;
        }
        
        @media (max-width: 768px) {
          .hero-section { height: 50vh; min-height: 350px; }
        }
        
        .hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.7s ease-out, opacity 0.5s ease;
        }
        
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, 
            rgba(0,0,0,0.85) 0%, 
            rgba(0,0,0,0.4) 40%, 
            rgba(0,0,0,0.1) 70%,
            transparent 100%
          );
        }
        
        .nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 56px;
          height: 56px;
          border-radius: 50%;
          border: none;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 8px 32px rgba(0,0,0,0.15);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 10;
        }
        
        .nav-btn:hover {
          transform: translateY(-50%) scale(1.1);
          box-shadow: 0 12px 40px rgba(0,0,0,0.2);
        }
        
        .nav-btn.prev { left: 24px; }
        .nav-btn.next { right: 24px; }
        
        @media (max-width: 768px) {
          .nav-btn { width: 44px; height: 44px; }
          .nav-btn.prev { left: 12px; }
          .nav-btn.next { right: 12px; }
        }
        
        .action-btns {
          position: absolute;
          top: 24px;
          right: 24px;
          display: flex;
          gap: 12px;
          z-index: 10;
        }
        
        .action-btn {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: none;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(0,0,0,0.12);
          transition: all 0.3s;
        }
        
        .action-btn:hover { transform: scale(1.1); }
        .action-btn.active { background: linear-gradient(135deg, #ec4899, #f43f5e); color: white; }
        
        .gallery-dots {
          position: absolute;
          bottom: 140px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 10px;
          z-index: 10;
        }
        
        @media (max-width: 768px) { .gallery-dots { bottom: 120px; } }
        
        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(255,255,255,0.4);
          cursor: pointer;
          transition: all 0.3s;
          border: 2px solid transparent;
        }
        
        .dot.active {
          background: white;
          transform: scale(1.2);
          border-color: rgba(255,255,255,0.5);
        }
        
        .hero-content {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 40px;
          color: white;
          animation: slideUp 0.6s ease-out;
        }
        
        @media (max-width: 768px) { .hero-content { padding: 24px 20px; } }
        
        .venue-title {
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 800;
          margin: 0 0 16px 0;
          letter-spacing: -0.02em;
          text-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }
        
        .venue-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          font-size: clamp(0.875rem, 2vw, 1rem);
        }
        
        .meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(10px);
          padding: 8px 16px;
          border-radius: 100px;
          border: 1px solid rgba(255,255,255,0.2);
        }
        
        .content-wrapper {
          max-width: 1400px;
          margin: 0 auto;
          padding: 48px 24px;
        }
        
        @media (max-width: 768px) { .content-wrapper { padding: 24px 16px; } }
        
        .content-grid {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 48px;
          align-items: start;
        }
        
        @media (max-width: 1024px) {
          .content-grid { grid-template-columns: 1fr; gap: 32px; }
        }
        
        .section-card {
          background: white;
          border-radius: 24px;
          padding: 32px;
          margin-bottom: 24px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06);
          border: 1px solid rgba(0,0,0,0.04);
          animation: fadeIn 0.5s ease-out;
        }
        
        @media (max-width: 768px) { .section-card { padding: 20px; border-radius: 16px; } }
        
        .section-title {
          font-size: 1.125rem;
          font-weight: 600;
          margin: 0 0 20px 0;
          color: #1f2937;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .section-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #FFF7ED;
          color: #F59E0B;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }
        
        @media (max-width: 480px) { .stats-grid { gap: 8px; } }
        
        .stat-card {
          text-align: center;
          padding: 20px 12px;
          background: #FFFBEB;
          border-radius: 12px;
          border: 1px solid #FEF3C7;
        }
        
        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #D97706;
        }
        
        .stat-label {
          font-size: 0.75rem;
          color: #92400E;
          margin-top: 4px;
        }
        
        .amenities-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
          gap: 10px;
        }
        
        .amenity-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 14px;
          background: #f9fafb;
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 500;
          color: #374151;
          border: 1px solid #e5e7eb;
        }
        
        .amenity-item:hover {
          background: #FFF7ED;
          border-color: #FDE68A;
        }
        
        .amenity-icon {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: #D1FAE5;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #059669;
          flex-shrink: 0;
        }
        
        .review-card {
          padding: 20px;
          background: #fafafa;
          border-radius: 12px;
          margin-bottom: 12px;
          border: 1px solid #e5e7eb;
        }
        
        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }
        
        .reviewer-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .reviewer-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #F59E0B;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 0.875rem;
        }
        
        .reviewer-name {
          font-weight: 600;
          color: #1f2937;
          font-size: 0.9rem;
        }
        
        .review-date {
          font-size: 0.75rem;
          color: #9ca3af;
        }
        
        .review-stars {
          display: flex;
          gap: 2px;
        }
        
        .star-filled { color: #F59E0B; }
        .star-empty { color: #e5e7eb; }
        
        .review-text {
          color: #4b5563;
          line-height: 1.6;
          font-size: 0.875rem;
        }
        
        .booking-sidebar {
          position: sticky;
          top: 100px;
        }
        
        @media (max-width: 1024px) { .booking-sidebar { position: static; } }
        
        .booking-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          border: 1px solid #e5e7eb;
        }
        
        .price-container {
          text-align: center;
          padding-bottom: 20px;
          border-bottom: 1px solid #e5e7eb;
          margin-bottom: 20px;
        }
        
        .price-label {
          font-size: 0.8rem;
          color: #6b7280;
          margin-bottom: 4px;
        }
        
        .price-amount {
          font-size: 2rem;
          font-weight: 700;
          color: #F59E0B;
        }
        
        .price-unit {
          font-size: 1rem;
          color: #64748b;
          font-weight: 500;
        }
        
        .book-now-btn {
          width: 100%;
          padding: 16px 24px;
          background: #F59E0B;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.2s ease;
        }
        
        .book-now-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(245, 158, 11, 0.3);
        }
        
        .contact-section {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
        }
        
        .contact-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 0;
          color: #4b5563;
          font-size: 0.875rem;
        }
        
        .contact-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: #FFF7ED;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #F59E0B;
          flex-shrink: 0;
        }
        
        .trust-section {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          flex-wrap: wrap;
        }
        
        .trust-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          color: #6b7280;
          font-weight: 500;
        }
        
        .description-text {
          color: #4b5563;
          line-height: 1.7;
          font-size: 0.95rem;
        }
        
        .highlights-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        
        @media (max-width: 480px) { .highlights-grid { grid-template-columns: 1fr; } }
        
        .highlight-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px;
          background: #FFFBEB;
          border-radius: 10px;
          border: 1px solid #FEF3C7;
        }
        
        .highlight-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: #F59E0B;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }
        
        .highlight-text {
          font-weight: 500;
          color: #92400E;
          font-size: 0.95rem;
        }
        
        .back-link {
          position: fixed;
          top: 24px;
          left: 24px;
          z-index: 100;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(10px);
          border-radius: 100px;
          color: #1a1a2e;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.9rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          transition: all 0.3s;
        }
        
        .back-link:hover {
          transform: translateX(-4px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.15);
        }
        
        @media (max-width: 768px) {
          .back-link { padding: 10px 16px; font-size: 0.85rem; top: 16px; left: 16px; }
        }
      `}</style>

      <div className="venue-page">
        {/* Back Button */}
        <Link to="/events" className="back-link">
          <ChevronLeft size={18} />
          Back
        </Link>

        {/* Hero Section */}
        <section className="hero-section">
          <img
            src={details?.gallery[currentImageIndex]}
            alt={venue.name}
            className="hero-image"
            style={{ opacity: imageLoaded ? 1 : 0 }}
            onLoad={() => setImageLoaded(true)}
          />
          <div className="hero-overlay"></div>

          {/* Navigation */}
          <button className="nav-btn prev" onClick={prevImage} aria-label="Previous image">
            <ChevronLeft size={24} color="#1a1a2e" />
          </button>
          <button className="nav-btn next" onClick={nextImage} aria-label="Next image">
            <ChevronRight size={24} color="#1a1a2e" />
          </button>

          {/* Action Buttons */}
          <div className="action-btns">
            <button
              className={`action-btn ${isWishlisted ? 'active' : ''}`}
              onClick={() => setIsWishlisted(!isWishlisted)}
              aria-label="Add to wishlist"
            >
              <Heart size={22} fill={isWishlisted ? "white" : "none"} />
            </button>
            <button className="action-btn" onClick={handleShare} aria-label="Share venue">
              <Share2 size={22} />
            </button>
          </div>

          {/* Gallery Dots */}
          <div className="gallery-dots">
            {details?.gallery.map((_, idx) => (
              <div
                key={idx}
                className={`dot ${idx === currentImageIndex ? 'active' : ''}`}
                onClick={() => setCurrentImageIndex(idx)}
              />
            ))}
          </div>

          {/* Hero Content */}
          <div className="hero-content">
            <h1 className="venue-title">{venue.name}</h1>
            <div className="venue-meta">
              <div className="meta-item">
                <MapPin size={18} />
                <span>{venue.location}</span>
              </div>
              <div className="meta-item">
                <Star size={18} fill="#fbbf24" color="#fbbf24" />
                <span><strong>{venue.rating}</strong> ({venue.reviews} reviews)</span>
              </div>
              <div className="meta-item">
                <Users size={18} />
                <span>{venue.capacity}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <div className="content-wrapper">
          <div className="content-grid">
            {/* Main Content */}
            <div>
              {/* Stats */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">{details?.stats?.events || "100+"}</div>
                  <div className="stat-label">Events Hosted</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{details?.stats?.rating || "4.5"}</div>
                  <div className="stat-label">Avg. Rating</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{details?.stats?.years || "5+"}</div>
                  <div className="stat-label">Years Experience</div>
                </div>
              </div>

              {/* About */}
              <div className="section-card">
                <h2 className="section-title">
                  <div className="section-icon">
                    <Sparkles size={18} />
                  </div>
                  About This Venue
                </h2>
                <p className="description-text">{venue.description}</p>
              </div>

              {/* Highlights */}
              <div className="section-card">
                <h2 className="section-title">
                  <div className="section-icon">
                    <Award size={18} />
                  </div>
                  Highlights
                </h2>
                <div className="highlights-grid">
                  {details?.highlights.map((highlight, idx) => (
                    <div key={idx} className="highlight-item">
                      <div className="highlight-icon">
                        <CheckCircle size={18} />
                      </div>
                      <span className="highlight-text">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div className="section-card">
                <h2 className="section-title">
                  <div className="section-icon">
                    <CheckCircle size={18} />
                  </div>
                  Amenities
                </h2>
                <div className="amenities-grid">
                  {venue.amenities?.map((amenity, idx) => {
                    const IconComponent = getAmenityIcon(amenity);
                    return (
                      <div key={idx} className="amenity-item">
                        <div className="amenity-icon">
                          <IconComponent size={16} />
                        </div>
                        <span>{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reviews */}
              <div className="section-card">
                <h2 className="section-title">
                  <div className="section-icon">
                    <Star size={18} />
                  </div>
                  Reviews
                </h2>
                {details?.reviews.map((review, idx) => (
                  <div key={idx} className="review-card">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <div className="reviewer-avatar">{review.avatar}</div>
                        <div>
                          <div className="reviewer-name">{review.name}</div>
                          <div className="review-date">{review.date}</div>
                        </div>
                      </div>
                      <div className="review-stars">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            fill={i < review.rating ? "#fbbf24" : "none"}
                            className={i < review.rating ? "star-filled" : "star-empty"}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="review-text">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Booking Sidebar */}
            <div className="booking-sidebar">
              <div className="booking-card">
                {/* User Status */}
                {isLoggedIn ? (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px',
                    background: '#ECFDF5',
                    borderRadius: '12px',
                    marginBottom: '16px',
                    border: '1px solid #D1FAE5'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: '#10B981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '0.9rem'
                    }}>
                      {userName.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#059669' }}>Welcome back</div>
                      <div style={{ fontWeight: '600', color: '#065F46', fontSize: '0.9rem' }}>{userName || 'User'}</div>
                    </div>
                  </div>
                ) : (
                  <div style={{
                    padding: '14px',
                    background: '#FEF2F2',
                    borderRadius: '12px',
                    marginBottom: '16px',
                    border: '1px solid #FECACA',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.85rem', color: '#DC2626', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                      <Lock size={14} />
                      <span>Login to book</span>
                    </div>
                  </div>
                )}

                <div className="price-container">
                  <div className="price-label">Starting from</div>
                  <div>
                    <span className="price-amount">₹{(venue.priceRange?.min || 15000).toLocaleString()}</span>
                    <span className="price-unit"> / session</span>
                  </div>
                </div>

                {isLoggedIn ? (
                  <button
                    className="book-now-btn"
                    onClick={() => navigate(`/book/${venueId}`)}
                    style={{ background: '#F59E0B' }}
                  >
                    <Calendar size={20} />
                    Book Now
                    <ArrowRight size={20} />
                  </button>
                ) : (
                  <button
                    className="book-now-btn"
                    onClick={() => {
                      localStorage.setItem("redirectAfterLogin", `/book/${venueId}`);
                      navigate("/login");
                    }}
                    style={{ background: '#6B7280' }}
                  >
                    Login to Book
                    <ArrowRight size={20} />
                  </button>
                )}

                {/* Quick Info */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '12px',
                  marginTop: '20px',
                  padding: '16px',
                  background: '#f8fafc',
                  borderRadius: '14px'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Response Time</div>
                    <div style={{ fontWeight: '700', color: '#1e293b' }}>2-4 Hours</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Advance Booking</div>
                    <div style={{ fontWeight: '700', color: '#1e293b' }}>7 Days</div>
                  </div>
                </div>

                <div className="contact-section">
                  <div className="contact-item">
                    <div className="contact-icon">
                      <Clock size={18} />
                    </div>
                    <span>{details?.openHours}</span>
                  </div>
                  <div className="contact-item">
                    <div className="contact-icon">
                      <Phone size={18} />
                    </div>
                    <span>{details?.contact?.phone}</span>
                  </div>
                  <div className="contact-item">
                    <div className="contact-icon">
                      <Mail size={18} />
                    </div>
                    <span>{details?.contact?.email}</span>
                  </div>
                </div>

                <div className="trust-section">
                  <div className="trust-badge">
                    <Shield size={18} color="#10b981" />
                    Verified Vendor
                  </div>
                  <div className="trust-badge">
                    <CheckCircle size={18} color="#10b981" />
                    Secure Booking
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >
    </>
  );
}

// Inline styles for loading and not found states
const styles = {
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: '#fff',
  },
  loadingSpinner: {
    width: 48,
    height: 48,
    border: '4px solid #e5e7eb',
    borderTop: '4px solid #F59E0B',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: 16,
  },
  loadingText: {
    color: '#6b7280',
    fontSize: '0.9rem',
    fontWeight: 500,
  },
  notFoundContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: '#f9fafb',
    padding: 24,
  },
  notFoundCard: {
    textAlign: 'center',
    background: 'white',
    padding: 40,
    borderRadius: 16,
    maxWidth: 380,
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid #e5e7eb',
  },
  notFoundIcon: {
    fontSize: 48,
    marginBottom: 20,
  },
  notFoundTitle: {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: '#1f2937',
    margin: '0 0 10px 0',
  },
  notFoundText: {
    color: '#6b7280',
    fontSize: '0.9rem',
    margin: '0 0 20px 0',
    lineHeight: 1.6,
  },
  backButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '12px 24px',
    background: '#F59E0B',
    color: 'white',
    textDecoration: 'none',
    borderRadius: 10,
    fontWeight: 600,
    fontSize: '0.9rem',
  },
};

export default VenueDetails;
