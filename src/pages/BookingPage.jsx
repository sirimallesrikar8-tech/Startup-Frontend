import React, { useState, useEffect, useCallback } from "react"
import { Helmet } from "react-helmet"
import { useParams, useNavigate, Navigate } from "react-router-dom"
import Header from "../components/Header";
import Footer from "../components/Footer";

import CalendarPicker from "../components/CalendarPicker"
import BookingSummary from "../components/BookingSummary"
import bookingService from "../services/BookingService"
import {
    Calendar as CalendarIcon,
    Clock,
    MapPin,
    Star,
    Users,
    Info,
    ChevronLeft,
    ChevronRight,
    ShieldCheck,
    Tag,
    CheckCircle2,
    X,
    User,
    Mail,
    Phone,
    CreditCard,
    Smartphone,
    Building2,
    Wallet,
    Lock,
    ArrowRight,
    ArrowLeft,
    Download,
    Share2,
    Heart,
    AlertCircle,
    Loader2
} from "lucide-react"

// Payment method options
const PAYMENT_METHODS = [
    { id: "card", name: "Credit / Debit Card", description: "Visa, Mastercard, RuPay", icon: CreditCard, color: "#1e40af" },
    { id: "upi", name: "UPI Payment", description: "GPay, PhonePe, Paytm, BHIM", icon: Smartphone, color: "#059669" },
    { id: "netbanking", name: "Net Banking", description: "All major Indian banks", icon: Building2, color: "#7c3aed" },
    { id: "wallet", name: "Wallets", description: "Paytm, Amazon Pay, MobiKwik", icon: Wallet, color: "#ea580c" },
]

function BookingPage() {
    // Get venue ID from URL params (or use default)
    const { venueId } = useParams()
    const navigate = useNavigate()
    const currentVenueId = venueId || "grand-plaza-hall"

    // Check if user is logged in
    const token = localStorage.getItem("token")
    const isLoggedIn = !!token

    // If not logged in, redirect to login with return URL
    if (!isLoggedIn) {
        // Store the intended booking URL to redirect back after login
        localStorage.setItem("redirectAfterLogin", `/book/${currentVenueId}`)
        return <Navigate to="/login" replace />
    }

    // Venue data state
    const [venue, setVenue] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [availableSlots, setAvailableSlots] = useState([])

    // Booking state
    const [selectedDate, setSelectedDate] = useState(null)
    const [selectedSlot, setSelectedSlot] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [modalStep, setModalStep] = useState(1)
    const [couponCode, setCouponCode] = useState("")
    const [appliedDiscount, setAppliedDiscount] = useState(0)
    const [couponError, setCouponError] = useState("")
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [bookingStatus, setBookingStatus] = useState("idle")
    const [paymentMethod, setPaymentMethod] = useState("card")
    const [isWishlisted, setIsWishlisted] = useState(false)
    const [bookingRef, setBookingRef] = useState("")

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        eventType: "",
        guestCount: "",
        specialRequests: ""
    })
    const [formErrors, setFormErrors] = useState({})

    // Ref for booking summary section (to detect when it's visible)
    const bookingSummaryRef = React.useRef(null)
    const [hideMobileBar, setHideMobileBar] = useState(false)
    const [showPriceBreakup, setShowPriceBreakup] = useState(false)

    // Detect when user scrolls past Important Information section
    useEffect(() => {
        const handleScroll = () => {
            if (bookingSummaryRef.current) {
                const rect = bookingSummaryRef.current.getBoundingClientRect()
                // Hide mobile bar when booking summary is visible in viewport
                setHideMobileBar(rect.top < window.innerHeight && rect.bottom > 0)
            }
        }

        window.addEventListener('scroll', handleScroll)
        handleScroll() // Check initial position

        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Load venue data
    useEffect(() => {
        const loadVenue = () => {
            setIsLoading(true)
            // Simulate API call delay
            setTimeout(() => {
                const venueData = bookingService.getVenueById(currentVenueId)
                setVenue(venueData)
                setIsLoading(false)
            }, 300)
        }

        loadVenue()

        // Subscribe to booking updates
        const unsubscribe = bookingService.subscribe(() => {
            // Refresh availability when bookings change
            if (selectedDate) {
                const slots = bookingService.getAvailability(currentVenueId, selectedDate)
                setAvailableSlots(slots || [])
            }
        })

        return () => unsubscribe()
    }, [currentVenueId])

    // Load available slots when date changes
    useEffect(() => {
        if (selectedDate && venue) {
            const slots = bookingService.getAvailability(currentVenueId, selectedDate)
            setAvailableSlots(slots || [])
            setSelectedSlot(null) // Reset slot selection
        } else {
            setAvailableSlots([])
            setSelectedSlot(null)
        }
    }, [selectedDate, currentVenueId, venue])

    // Calendar navigation
    const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
    const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))

    // Get day availability for calendar
    const getDayAvailability = useCallback((date) => {
        return bookingService.getDayAvailability(currentVenueId, date)
    }, [currentVenueId])

    // Price calculations
    const TAX_RATE = 0.18
    const CONVENIENCE_FEE = 99
    const slotPrice = selectedSlot?.price || 0
    const discountAmount = (slotPrice * appliedDiscount) / 100
    const subtotal = slotPrice - discountAmount
    const taxes = subtotal * TAX_RATE
    const total = subtotal + taxes + (slotPrice > 0 ? CONVENIENCE_FEE : 0)

    // Coupon validation
    const handleApplyCoupon = () => {
        setCouponError("")
        const coupon = bookingService.validateCoupon(couponCode)

        if (!couponCode) {
            setCouponError("Please enter a coupon code")
            return
        }

        if (coupon) {
            setAppliedDiscount(coupon.discount)
        } else {
            setCouponError("Invalid coupon code")
            setAppliedDiscount(0)
        }
    }

    // Form validation
    const validateForm = () => {
        const errors = {}
        if (!formData.name.trim()) errors.name = "Name is required"
        if (!formData.email.trim()) errors.email = "Email is required"
        else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Invalid email format"
        if (!formData.phone.trim()) errors.phone = "Phone is required"
        else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\s/g, ''))) errors.phone = "Invalid phone number"
        if (!formData.eventType) errors.eventType = "Please select event type"
        if (!formData.guestCount) errors.guestCount = "Please enter guest count"

        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: "" }))
        }
    }

    // Navigation handlers
    const handleNextToPayment = () => {
        if (validateForm()) {
            setModalStep(2)
        }
    }

    // Payment processing
    const handleConfirmBooking = () => {
        setBookingStatus("processing")

        // Create the booking through the service
        setTimeout(() => {
            const booking = bookingService.createBooking({
                venueId: currentVenueId,
                date: selectedDate.toISOString(),
                slotId: selectedSlot.id,
                customerName: formData.name,
                customerEmail: formData.email,
                customerPhone: formData.phone,
                eventType: formData.eventType,
                guestCount: formData.guestCount,
                specialRequests: formData.specialRequests,
                paymentMethod,
                amount: total
            })

            setBookingRef(booking.id)
            setBookingStatus("success")
            setModalStep(3)
        }, 2500)
    }

    // Share functionality
    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: `Book ${venue?.name} - EventAllInOne`,
                text: `Check out this venue: ${venue?.name} in ${venue?.location}`,
                url: window.location.href
            })
        }
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="container py-5 text-center">
                <Loader2 size={48} className="animate-spin text-muted mb-3" style={{ animation: 'spin 1s linear infinite' }} />
                <p className="text-muted">Loading venue details...</p>
            </div>
        )
    }

    // Venue not found
    if (!venue) {
        return (
            <div className="container py-5 text-center">
                <AlertCircle size={48} className="text-danger mb-3" />
                <h3>Venue Not Found</h3>
                <p className="text-muted">The venue you're looking for doesn't exist or has been removed.</p>
                <a href="/" className="btn btn-primary">Go to Home</a>
            </div>
        )
    }

    return (
        <>
            {/* SEO Meta Tags */}
            <Helmet>
                <title>{`Book ${venue.name} - EventAllInOne | Venue Booking`}</title>
                <meta name="description" content={`Book ${venue.name} in ${venue.location}. ${venue.description} Rated ${venue.rating}/5 by ${venue.reviews} customers.`} />
                <meta name="keywords" content={`${venue.name}, venue booking, event venue, ${venue.location}, wedding venue, party hall, banquet hall`} />
                <meta property="og:title" content={`Book ${venue.name} - EventAllInOne`} />
                <meta property="og:description" content={venue.description} />
                <meta property="og:type" content="website" />
                <link rel="canonical" href={`https://eventallinone.com/booking/${venue.id}`} />
            </Helmet>

            <style>{`
                .slot-card {
                    border: 2px solid #f1f5f9;
                    border-radius: 16px;
                    padding: 1.25rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    background: white;
                }
                .slot-card:hover:not(.full) {
                    border-color: #c33764;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(195, 55, 100, 0.1);
                }
                .slot-card.selected {
                    border-color: #c33764;
                    background: linear-gradient(135deg, #fcefee, #ffe6e6);
                    box-shadow: 0 4px 12px rgba(195, 55, 100, 0.15);
                }
                .slot-card.full {
                    opacity: 0.5;
                    cursor: not-allowed;
                    background-color: #f8fafc;
                }
                .payment-option {
                    border: 2px solid #f1f5f9;
                    border-radius: 12px;
                    padding: 1rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    transition: all 0.2s;
                    background: white;
                }
                .payment-option:hover {
                    border-color: #c33764;
                    background: #fcefee;
                }
                .payment-option.active {
                    border-color: #c33764;
                    background: linear-gradient(135deg, #fcefee, #ffe6e6);
                }
                .modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(29, 38, 113, 0.6);
                    backdrop-filter: blur(8px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 5000;
                    padding: 1rem;
                }
                .modal-content-premium {
                    background: white;
                    width: 100%;
                    max-width: 550px;
                    max-height: 90vh;
                    overflow-y: auto;
                    border-radius: 24px;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                    animation: modalSlideUp 0.3s ease-out;
                }
                @keyframes modalSlideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeInUp {
                    animation: fadeInUp 0.4s ease-out forwards;
                }
                .form-input {
                    border: 2px solid #e2e8f0;
                    border-radius: 12px;
                    padding: 0.75rem 1rem;
                    width: 100%;
                    font-size: 0.95rem;
                    transition: all 0.2s;
                }
                .form-input:focus {
                    outline: none;
                    border-color: #c33764;
                    box-shadow: 0 0 0 3px rgba(195, 55, 100, 0.1);
                }
                .form-input.error {
                    border-color: #ef4444;
                }
                .btn-primary-custom {
                    background: linear-gradient(135deg, #c33764, #1d2671);
                    color: white;
                    border: none;
                    padding: 0.875rem 1.5rem;
                    border-radius: 12px;
                    font-weight: 600;
                    transition: all 0.3s;
                    cursor: pointer;
                }
                .btn-primary-custom:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(195, 55, 100, 0.3);
                }
                .btn-primary-custom:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                }
                .progress-step {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                    font-size: 0.875rem;
                }
                .progress-step.active {
                    background: linear-gradient(135deg, #c33764, #1d2671);
                    color: white;
                }
                .progress-step.completed {
                    background: #10b981;
                    color: white;
                }
                .progress-step.pending {
                    background: #e2e8f0;
                    color: #64748b;
                }
                .wishlist-btn {
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    border: 2px solid #f1f5f9;
                    background: white;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .wishlist-btn:hover {
                    border-color: #c33764;
                    background: #fcefee;
                }
                .wishlist-btn.active {
                    background: #c33764;
                    border-color: #c33764;
                    color: white;
                }
                .select-date-prompt {
                    background: linear-gradient(135deg, #fcefee, #ffe6e6);
                    border-radius: 20px;
                    border: 2px dashed #f9d5d3;
                    padding: 3rem 2rem;
                    text-align: center;
                }
                
                /* Mobile Sticky Booking Bar */
                .mobile-booking-bar {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: white;
                    border-top: 1px solid #e2e8f0;
                    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
                    padding: 0.75rem 1rem;
                    z-index: 1000;
                    display: none;
                    animation: slideUp 0.3s ease-out;
                }
                @keyframes slideUp {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                @media (max-width: 991.98px) {
                    .mobile-booking-bar {
                        display: block;
                    }
                    .mobile-booking-bar.hidden {
                        display: none;
                    }
                    /* Add padding to main content so it doesn't hide behind the bar */
                    main {
                        padding-bottom: 100px !important;
                    }
                }
                .mobile-price-tag {
                    font-size: 1.25rem;
                    font-weight: 800;
                    color: #c33764;
                }
                .mobile-slot-info {
                    font-size: 0.75rem;
                    color: #64748b;
                    line-height: 1.3;
                }
                .mobile-book-btn {
                    background: linear-gradient(135deg, #c33764, #1d2671);
                    color: white;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 12px;
                    font-weight: 600;
                    font-size: 0.95rem;
                    white-space: nowrap;
                    transition: all 0.2s;
                }
                .mobile-book-btn:hover {
                    transform: scale(1.02);
                    box-shadow: 0 4px 12px rgba(195, 55, 100, 0.3);
                }
                .mobile-book-btn:disabled {
                    opacity: 0.6;
                    transform: none;
                }
            `}</style>

            <main className="container py-4 py-lg-5">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="btn btn-link text-decoration-none p-0 mb-3 d-flex align-items-center gap-2"
                    style={{ color: '#64748b' }}
                >
                    <ArrowLeft size={20} /> Back
                </button>

                {/* Breadcrumb */}
                <nav aria-label="breadcrumb" className="mb-4">
                    <ol className="breadcrumb small">
                        <li className="breadcrumb-item"><a href="/" className="text-decoration-none" style={{ color: '#c33764' }}>Home</a></li>
                        <li className="breadcrumb-item"><a href="/services" className="text-decoration-none" style={{ color: '#c33764' }}>Venues</a></li>
                        <li className="breadcrumb-item active" aria-current="page">{venue.name}</li>
                    </ol>
                </nav>

                <div className="row g-4">
                    <div className="col-lg-8">
                        {/* Venue Header */}
                        <div className="mb-4">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                                <div>
                                    <h1 className="fw-bold fs-2 mb-2" style={{ color: '#1d2671' }}>{venue.name}</h1>
                                    <div className="d-flex flex-wrap gap-3 align-items-center text-secondary small fw-medium">
                                        <span className="d-flex align-items-center gap-1">
                                            <MapPin size={16} style={{ color: '#c33764' }} /> {venue.location}
                                        </span>
                                        <span className="d-flex align-items-center gap-1">
                                            <Star size={16} className="text-warning" style={{ fill: '#ffc107' }} />
                                            <strong>{venue.rating}</strong> ({venue.reviews} Reviews)
                                        </span>
                                        <span className="d-flex align-items-center gap-1">
                                            <Users size={16} /> {venue.capacity}
                                        </span>
                                    </div>
                                </div>
                                <div className="d-flex gap-2">
                                    <button
                                        className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
                                        onClick={() => setIsWishlisted(!isWishlisted)}
                                        title="Add to wishlist"
                                    >
                                        <Heart size={20} fill={isWishlisted ? "white" : "none"} />
                                    </button>
                                    <button className="wishlist-btn" onClick={handleShare} title="Share">
                                        <Share2 size={20} />
                                    </button>
                                </div>
                            </div>
                            <p className="text-muted mb-3">{venue.description}</p>

                            {/* Amenities */}
                            <div className="d-flex flex-wrap gap-2">
                                {venue.amenities.map((amenity, i) => (
                                    <span key={i} className="badge rounded-pill px-3 py-2"
                                        style={{ background: '#fcefee', color: '#c33764', fontWeight: 500 }}>
                                        {amenity}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Calendar */}
                        <div className="mb-4">
                            <CalendarPicker
                                currentMonth={currentMonth}
                                selectedDate={selectedDate}
                                onDateSelect={setSelectedDate}
                                onPrevMonth={prevMonth}
                                onNextMonth={nextMonth}
                                getDayAvailability={getDayAvailability}
                            />
                        </div>

                        {/* Available Sessions - ONLY show after date selection */}
                        {selectedDate !== null && availableSlots.length > 0 && (
                            <div className="mb-4 animate-fadeInUp">
                                <h5 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: '#1d2671' }}>
                                    <Clock size={20} /> Available Sessions
                                    <span className="badge rounded-pill ms-2" style={{ background: '#fcefee', color: '#c33764', fontSize: '0.75rem', fontWeight: 500 }}>
                                        {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                    </span>
                                </h5>
                                <div className="row g-3">
                                    {availableSlots.map(slot => (
                                        <div key={slot.id} className="col-md-6">
                                            <div
                                                className={`slot-card ${selectedSlot?.id === slot.id ? 'selected' : ''} ${slot.status === 'full' ? 'full' : ''}`}
                                                onClick={() => slot.status !== 'full' && setSelectedSlot(slot)}
                                            >
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <p className="fw-bold mb-1" style={{ color: '#1d2671' }}>{slot.time}</p>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <span className={`small fw-bold text-uppercase ${slot.status === 'available' ? 'text-success' :
                                                                slot.status === 'fast-filling' ? 'text-warning' : 'text-danger'
                                                                }`}>
                                                                {slot.status === 'fast-filling' ? 'FAST FILLING' : slot.status.toUpperCase()}
                                                            </span>
                                                            {slot.slotsLeft > 0 && slot.slotsLeft <= 3 && (
                                                                <span className="badge bg-warning text-dark" style={{ fontSize: '0.65rem' }}>
                                                                    Only {slot.slotsLeft} left
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="text-end">
                                                        <h6 className="fw-bold mb-0" style={{ color: '#c33764' }}>₹{slot.price.toLocaleString()}</h6>
                                                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>per session</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Prompt to select date - ONLY show when no date is selected */}
                        {selectedDate === null && (
                            <div className="select-date-prompt mb-4">
                                <CalendarIcon size={48} style={{ color: '#c33764' }} className="mb-3" />
                                <h5 className="fw-bold" style={{ color: '#1d2671' }}>Select a Date</h5>
                                <p className="text-muted small mb-0">Choose a date from the calendar above to view available time slots</p>
                            </div>
                        )}

                        {/* Important Info */}
                        <div className="bg-light rounded-4 p-4 mt-4">
                            <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                                <Info size={18} style={{ color: '#c33764' }} /> Important Information
                            </h6>
                            <ul className="mb-0 small text-muted ps-3">
                                <li className="mb-2">Booking requires a minimum of {venue.minAdvanceBooking} days advance notice</li>
                                <li className="mb-2">{venue.cancellationPolicy}</li>
                                <li className="mb-2">A 50% advance payment is required to confirm the booking</li>
                                <li>Final guest count must be confirmed 24 hours before the event</li>
                            </ul>
                        </div>
                    </div>

                    {/* Booking Summary Sidebar */}
                    <div className="col-lg-4" ref={bookingSummaryRef}>
                        <div className="sticky-top" style={{ top: "120px" }}>
                            <BookingSummary
                                service={venue}
                                selectedDate={selectedDate}
                                selectedSlot={selectedSlot}
                                couponCode={couponCode}
                                appliedDiscount={appliedDiscount}
                                onCouponChange={setCouponCode}
                                onApplyCoupon={handleApplyCoupon}
                                onProceedToBook={() => { setShowModal(true); setModalStep(1); }}
                                onChangeDate={() => setSelectedDate(null)}
                            />
                        </div>
                    </div>
                </div>
            </main>

            {/* Booking Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
                    <div className="modal-content-premium">
                        {/* Progress Header */}
                        <div className="p-4 border-bottom" style={{ background: 'linear-gradient(135deg, #fcefee, #ffe6e6)' }}>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="fw-bold mb-0" style={{ color: '#1d2671' }}>
                                    {modalStep === 1 ? "Booking Details" : modalStep === 2 ? "Payment" : "Confirmation"}
                                </h5>
                                <button className="btn btn-light rounded-circle p-2" onClick={() => setShowModal(false)}>
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Progress Steps */}
                            <div className="d-flex align-items-center justify-content-center gap-3">
                                <div className={`progress-step ${modalStep >= 1 ? (modalStep > 1 ? 'completed' : 'active') : 'pending'}`}>
                                    {modalStep > 1 ? <CheckCircle2 size={16} /> : '1'}
                                </div>
                                <div className="flex-grow-1" style={{ height: 2, background: modalStep > 1 ? '#10b981' : '#e2e8f0', maxWidth: 60 }}></div>
                                <div className={`progress-step ${modalStep >= 2 ? (modalStep > 2 ? 'completed' : 'active') : 'pending'}`}>
                                    {modalStep > 2 ? <CheckCircle2 size={16} /> : '2'}
                                </div>
                                <div className="flex-grow-1" style={{ height: 2, background: modalStep > 2 ? '#10b981' : '#e2e8f0', maxWidth: 60 }}></div>
                                <div className={`progress-step ${modalStep === 3 ? 'completed' : 'pending'}`}>
                                    {modalStep === 3 ? <CheckCircle2 size={16} /> : '3'}
                                </div>
                            </div>
                        </div>

                        <div className="p-4">
                            {/* Step 1: Details Form */}
                            {modalStep === 1 && (
                                <div>
                                    <div className="mb-4">
                                        <label className="form-label small fw-bold text-muted mb-2">Full Name *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            className={`form-input ${formErrors.name ? 'error' : ''}`}
                                            placeholder="Enter your full name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                        />
                                        {formErrors.name && <span className="text-danger small mt-1 d-block">{formErrors.name}</span>}
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label small fw-bold text-muted mb-2">Email Address *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            className={`form-input ${formErrors.email ? 'error' : ''}`}
                                            placeholder="your@email.com"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                        />
                                        {formErrors.email && <span className="text-danger small mt-1 d-block">{formErrors.email}</span>}
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label small fw-bold text-muted mb-2">Phone Number *</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            className={`form-input ${formErrors.phone ? 'error' : ''}`}
                                            placeholder="10-digit mobile number"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                        />
                                        {formErrors.phone && <span className="text-danger small mt-1 d-block">{formErrors.phone}</span>}
                                    </div>

                                    <div className="row mb-4">
                                        <div className="col-6">
                                            <label className="form-label small fw-bold text-muted mb-2">Event Type *</label>
                                            <select
                                                name="eventType"
                                                className={`form-input ${formErrors.eventType ? 'error' : ''}`}
                                                value={formData.eventType}
                                                onChange={handleInputChange}
                                            >
                                                <option value="">Select...</option>
                                                <option value="wedding">Wedding</option>
                                                <option value="reception">Reception</option>
                                                <option value="corporate">Corporate Event</option>
                                                <option value="birthday">Birthday Party</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label small fw-bold text-muted mb-2">Guest Count *</label>
                                            <input
                                                type="number"
                                                name="guestCount"
                                                className={`form-input ${formErrors.guestCount ? 'error' : ''}`}
                                                placeholder="Expected guests"
                                                value={formData.guestCount}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label small fw-bold text-muted mb-2">Special Requests (Optional)</label>
                                        <textarea
                                            name="specialRequests"
                                            className="form-input"
                                            rows={3}
                                            placeholder="Any specific requirements..."
                                            value={formData.specialRequests}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    {/* Booking Summary */}
                                    <div className="rounded-3 p-3 mb-4" style={{ background: '#f8fafc' }}>
                                        <div className="d-flex justify-content-between small mb-2">
                                            <span className="text-muted">Venue</span>
                                            <span className="fw-bold">{venue.name}</span>
                                        </div>
                                        <div className="d-flex justify-content-between small mb-2">
                                            <span className="text-muted">Date</span>
                                            <span className="fw-bold">{selectedDate?.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                        </div>
                                        <div className="d-flex justify-content-between small">
                                            <span className="text-muted">Time Slot</span>
                                            <span className="fw-bold">{selectedSlot?.time}</span>
                                        </div>
                                    </div>

                                    <button className="btn-primary-custom w-100 d-flex align-items-center justify-content-center gap-2" onClick={handleNextToPayment}>
                                        Continue to Payment <ArrowRight size={18} />
                                    </button>
                                </div>
                            )}

                            {/* Step 2: Payment */}
                            {modalStep === 2 && (
                                <div>
                                    <div className="mb-4">
                                        <h6 className="fw-bold mb-3">Select Payment Method</h6>
                                        <div className="d-flex flex-column gap-2">
                                            {PAYMENT_METHODS.map(method => (
                                                <div
                                                    key={method.id}
                                                    className={`payment-option ${paymentMethod === method.id ? 'active' : ''}`}
                                                    onClick={() => setPaymentMethod(method.id)}
                                                >
                                                    <div className="rounded-3 p-2" style={{ background: `${method.color}15`, color: method.color }}>
                                                        <method.icon size={20} />
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <span className="fw-bold d-block">{method.name}</span>
                                                        <span className="small text-muted">{method.description}</span>
                                                    </div>
                                                    {paymentMethod === method.id && <CheckCircle2 size={20} style={{ color: '#c33764' }} />}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Price Breakdown */}
                                    <div className="rounded-3 p-3 mb-4" style={{ background: '#f8fafc' }}>
                                        <div className="d-flex justify-content-between small mb-2">
                                            <span className="text-muted">Slot Price</span>
                                            <span>₹{slotPrice.toLocaleString()}</span>
                                        </div>
                                        {appliedDiscount > 0 && (
                                            <div className="d-flex justify-content-between small mb-2 text-success">
                                                <span>Discount ({appliedDiscount}%)</span>
                                                <span>-₹{discountAmount.toLocaleString()}</span>
                                            </div>
                                        )}
                                        <div className="d-flex justify-content-between small mb-2">
                                            <span className="text-muted">Taxes (18%)</span>
                                            <span>₹{Math.round(taxes).toLocaleString()}</span>
                                        </div>
                                        <div className="d-flex justify-content-between small mb-2">
                                            <span className="text-muted">Convenience Fee</span>
                                            <span>₹{CONVENIENCE_FEE}</span>
                                        </div>
                                        <hr className="my-2" />
                                        <div className="d-flex justify-content-between fw-bold">
                                            <span>Total</span>
                                            <span style={{ color: '#c33764' }}>₹{Math.round(total).toLocaleString()}</span>
                                        </div>
                                    </div>

                                    {/* Security Badge */}
                                    <div className="d-flex align-items-center gap-2 p-3 rounded-3 mb-4" style={{ background: '#f0fdf4' }}>
                                        <Lock size={18} className="text-success" />
                                        <span className="small fw-medium text-success">256-bit SSL Encrypted | 100% Secure Payment</span>
                                    </div>

                                    <button
                                        className="btn-primary-custom w-100 d-flex align-items-center justify-content-center gap-2"
                                        onClick={handleConfirmBooking}
                                        disabled={bookingStatus === 'processing'}
                                    >
                                        {bookingStatus === 'processing' ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm"></span>
                                                Processing Payment...
                                            </>
                                        ) : (
                                            <>Pay ₹{Math.round(total).toLocaleString()}</>
                                        )}
                                    </button>
                                </div>
                            )}

                            {/* Step 3: Confirmation */}
                            {modalStep === 3 && (
                                <div className="text-center py-4">
                                    <div className="mb-4">
                                        <div className="d-inline-flex p-4 rounded-circle" style={{ background: '#f0fdf4' }}>
                                            <CheckCircle2 size={56} className="text-success" />
                                        </div>
                                    </div>
                                    <h3 className="fw-bold mb-2" style={{ color: '#1d2671' }}>Booking Confirmed!</h3>
                                    <p className="text-muted mb-4">Your venue has been successfully booked. Confirmation details have been sent to your email.</p>

                                    <div className="rounded-3 p-4 mb-4 text-start" style={{ background: '#f8fafc' }}>
                                        <div className="d-flex justify-content-between mb-2">
                                            <span className="text-muted small">Booking Reference</span>
                                            <span className="fw-bold font-monospace" style={{ color: '#c33764' }}>{bookingRef}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-2">
                                            <span className="text-muted small">Venue</span>
                                            <span className="fw-bold">{venue.name}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-2">
                                            <span className="text-muted small">Date & Time</span>
                                            <span className="fw-bold">{selectedDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} | {selectedSlot?.time}</span>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <span className="text-muted small">Amount Paid</span>
                                            <span className="fw-bold text-success">₹{Math.round(total).toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="d-flex gap-2">
                                        <button className="btn btn-outline-secondary flex-grow-1 py-2 rounded-3" onClick={() => window.print()}>
                                            <Download size={18} className="me-2" /> Download
                                        </button>
                                        <button
                                            className="btn-primary-custom flex-grow-1"
                                            onClick={() => setShowModal(false)}
                                        >
                                            Done
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Sticky Booking Bar - Only visible on mobile when slot is selected and BookingSummary not visible */}
            {selectedSlot && !hideMobileBar && (
                <div className="mobile-booking-bar">
                    {/* Price Breakup Dropdown */}
                    {showPriceBreakup && (
                        <div className="price-breakup-dropdown mb-3 p-3 rounded-3" style={{ background: '#f8fafc', animation: 'fadeIn 0.2s ease-out' }}>
                            <div className="d-flex justify-content-between small mb-2">
                                <span className="text-muted">Slot Price</span>
                                <span>₹{slotPrice.toLocaleString()}</span>
                            </div>
                            {appliedDiscount > 0 && (
                                <div className="d-flex justify-content-between small mb-2 text-success">
                                    <span>Discount ({appliedDiscount}%)</span>
                                    <span>-₹{Math.round(discountAmount).toLocaleString()}</span>
                                </div>
                            )}
                            <div className="d-flex justify-content-between small mb-2">
                                <span className="text-muted">Taxes (18%)</span>
                                <span>₹{Math.round(taxes).toLocaleString()}</span>
                            </div>
                            <div className="d-flex justify-content-between small">
                                <span className="text-muted">Convenience Fee</span>
                                <span>₹{CONVENIENCE_FEE}</span>
                            </div>
                        </div>
                    )}
                    <div className="d-flex align-items-center justify-content-between gap-3">
                        <div className="flex-grow-1">
                            <div className="d-flex align-items-center gap-2">
                                <div className="mobile-price-tag">₹{Math.round(total).toLocaleString()}</div>
                                <button
                                    className="btn btn-link p-0 text-decoration-none small"
                                    style={{ color: '#c33764', fontSize: '0.75rem' }}
                                    onClick={() => setShowPriceBreakup(!showPriceBreakup)}
                                >
                                    {showPriceBreakup ? 'Hide' : 'View'} Breakup {showPriceBreakup ? '▲' : '▼'}
                                </button>
                            </div>
                            <div className="mobile-slot-info">
                                {selectedDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {selectedSlot.time.split(' - ')[0]}
                            </div>
                        </div>
                        <button
                            className="mobile-book-btn d-flex align-items-center gap-2"
                            onClick={() => { setShowModal(true); setModalStep(1); }}
                        >
                            Book Now <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            )}

        </>
    )
}

export default BookingPage
