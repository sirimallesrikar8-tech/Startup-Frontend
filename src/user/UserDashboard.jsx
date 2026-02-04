import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Calendar, Clock, User, Mail, Phone, MapPin,
    DollarSign, Search, X, LogOut, CheckCircle,
    Bell, Shield, Plus, Menu, ChevronDown, Camera, Store, AlertCircle, RefreshCw, Check
} from 'lucide-react';
import authService from '../admin/services/authService';
import bookingsService from '../admin/services/bookingsService';
import apiService from '../admin/services/apiService';
import { updateUserProfile, uploadProfilePicture } from '../api/auth';
import logo from '../assets/event-logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import './UserDashboard.css';

const UserDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({ total: 0, upcoming: 0, completed: 0 });
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    // Profile states
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [activeTab, setActiveTab] = useState('personal');
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });

    // Profile form
    const [profileForm, setProfileForm] = useState({
        name: '', email: '', phone: '', location: '', bio: '', company: '', website: '',
        notifications: { email: true, sms: false, push: true },
        privacy: { showProfile: true, showBookings: false }
    });

    const [avatarPreview, setAvatarPreview] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);
    const fileInputRef = useRef(null);
    const dropdownRef = useRef(null);

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowProfileDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        fetchUserData();
    }, []);

    // Fetch user profile from API or localStorage
    const fetchUserData = async () => {
        try {
            const userId = localStorage.getItem('userId');

            // Try to get fresh profile from API
            if (userId) {
                try {
                    const profileData = await apiService.get(`/auth/profile/${userId}`);
                    if (profileData) {
                        const userData = {
                            id: profileData.userId,
                            name: profileData.name || localStorage.getItem('userName') || 'User',
                            email: profileData.email || localStorage.getItem('userEmail') || '',
                            phone: localStorage.getItem('userPhone') || '',
                            avatar: profileData.profilePicture || localStorage.getItem('userAvatar') || null,
                            location: localStorage.getItem('userLocation') || '',
                            bio: localStorage.getItem('userBio') || '',
                            company: localStorage.getItem('userCompany') || '',
                            website: localStorage.getItem('userWebsite') || '',
                        };
                        setUser(userData);
                        setProfileForm(prev => ({
                            ...prev,
                            name: userData.name,
                            email: userData.email,
                            phone: userData.phone,
                            location: userData.location,
                            bio: userData.bio,
                            company: userData.company,
                            website: userData.website,
                        }));
                        if (userData.avatar) setAvatarPreview(userData.avatar);

                        // Now fetch bookings
                        await fetchBookings(userId);
                        return;
                    }
                } catch (apiError) {
                    console.warn('Could not fetch profile from API, using localStorage:', apiError);
                }
            }

            // Fallback to localStorage data
            const userData = {
                id: userId || 'local_user',
                name: localStorage.getItem('userName') || 'User',
                email: localStorage.getItem('userEmail') || '',
                phone: localStorage.getItem('userPhone') || '',
                avatar: localStorage.getItem('userAvatar') || null,
                location: localStorage.getItem('userLocation') || '',
                bio: localStorage.getItem('userBio') || '',
                company: localStorage.getItem('userCompany') || '',
                website: localStorage.getItem('userWebsite') || '',
            };
            setUser(userData);
            setProfileForm(prev => ({
                ...prev,
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                location: userData.location,
                bio: userData.bio,
                company: userData.company,
                website: userData.website,
            }));
            if (userData.avatar) setAvatarPreview(userData.avatar);

            // Fetch bookings with userId
            if (userId) {
                await fetchBookings(userId);
            } else {
                setLoading(false);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            setLoading(false);
        }
    };

    // Fetch bookings from API
    const fetchBookings = async (userId) => {
        try {
            const bookingsData = await bookingsService.getByUserId(userId);

            if (Array.isArray(bookingsData) && bookingsData.length > 0) {
                // Map API response to our booking format
                const mappedBookings = bookingsData.map(booking => {
                    // Map status from API to UI status
                    const statusMap = {
                        'PENDING': { status: 'pending', label: 'Pending' },
                        'ACCEPTED': { status: 'confirmed', label: 'Confirmed' },
                        'REJECTED': { status: 'cancelled', label: 'Cancelled' },
                        'COMPLETED': { status: 'completed', label: 'Completed' },
                        'CANCELLED': { status: 'cancelled', label: 'Cancelled' }
                    };

                    const statusInfo = statusMap[booking.status] || { status: 'pending', label: 'Pending' };

                    // Format date
                    const slotDate = booking.slotDate ? new Date(booking.slotDate) : new Date();
                    const formattedDate = slotDate.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                    });

                    return {
                        id: `BK-${booking.bookingId}`,
                        title: `Booking with ${booking.vendorName || 'Vendor'}`,
                        vendor: booking.vendorName || 'Unknown Vendor',
                        vendorContact: { email: '', phone: '' },
                        date: formattedDate,
                        time: booking.slotStartTime || 'TBD',
                        status: statusInfo.status,
                        statusLabel: statusInfo.label,
                        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop',
                        location: 'TBD',
                        price: 'Contact Vendor',
                        bookingId: booking.bookingId,
                        slotId: booking.slotId
                    };
                });

                setBookings(mappedBookings);

                // Calculate stats from real data
                const total = mappedBookings.length;
                const completed = mappedBookings.filter(b => b.status === 'completed').length;
                const upcoming = mappedBookings.filter(b => ['pending', 'confirmed'].includes(b.status)).length;
                setStats({ total, upcoming, completed });
            } else {
                // No bookings found
                setBookings([]);
                setStats({ total: 0, upcoming: 0, completed: 0 });
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
            // Set empty state on error
            setBookings([]);
            setStats({ total: 0, upcoming: 0, completed: 0 });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        authService?.logout?.() || localStorage.clear();
        window.location.href = '/login';
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.size <= 5 * 1024 * 1024 && file.type.startsWith('image/')) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setAvatarPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleFormChange = (field, value) => {
        setProfileForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveProfile = async () => {
        try {
            setIsSaving(true);
            setSaveMessage({ type: '', text: '' });
            const userId = localStorage.getItem('userId');

            if (!userId) throw new Error("User ID not found");

            // 1. Upload Avatar if changed
            if (avatarFile) {
                try {
                    await uploadProfilePicture(userId, avatarFile);
                } catch (imgErr) {
                    console.error("Avatar upload failed", imgErr);
                }
            }

            // 2. Update Profile Data
            const updateData = {
                name: profileForm.name,
                phone: profileForm.phone,
                location: profileForm.location,
                bio: profileForm.bio,
                company: profileForm.company,
                website: profileForm.website,
                // Add privacy/notification settings if backend supports them
            };

            await updateUserProfile(userId, updateData);

            // Update local storage to reflect changes immediately
            localStorage.setItem('userName', profileForm.name);
            localStorage.setItem('userPhone', profileForm.phone);
            localStorage.setItem('userLocation', profileForm.location);
            if (avatarPreview) localStorage.setItem('userAvatar', avatarPreview);

            // Update user state
            setUser(prev => ({
                ...prev,
                ...profileForm,
                avatar: avatarPreview || prev?.avatar
            }));

            setSaveMessage({ type: 'success', text: 'Profile saved successfully!' });

            // Clear avatar file after successful save
            setAvatarFile(null);

            setTimeout(() => {
                setSaveMessage({ type: '', text: '' });
            }, 3000);
        } catch (error) {
            console.error('Error saving profile:', error);
            setSaveMessage({ type: 'error', text: 'Failed to save profile. Please try again.' });
        } finally {
            setIsSaving(false);
        }
    };

    const filteredBookings = bookings.filter(b => {
        const matchFilter = filter === 'all' || b.status === filter;
        const matchSearch = b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.vendor.toLowerCase().includes(searchTerm.toLowerCase());
        return matchFilter && matchSearch;
    });

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="d-flex flex-column align-items-center gap-4">
                    <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-primary fw-semibold">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="user-dashboard">
            {/* Profile Modal */}
            {showProfileModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowProfileModal(false)}>
                    <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
                        <div className="modal-content border-0 shadow-lg">
                            <div className="modal-header border-bottom py-3">
                                <h6 className="modal-title fw-bold mb-0">Profile Settings</h6>
                                <button type="button" className="btn-close" onClick={() => setShowProfileModal(false)}></button>
                            </div>
                            <div className="modal-body p-3">
                                {/* Avatar Upload */}
                                <div className="text-center mb-3">
                                    <div className="position-relative d-inline-block">
                                        <div className="avatar-large bg-primary text-white d-flex align-items-center justify-content-center rounded-circle mx-auto" style={{ width: '80px', height: '80px', fontSize: '1.5rem' }}>
                                            {avatarPreview ? (
                                                <img src={avatarPreview} alt="Avatar" className="w-100 h-100 rounded-circle object-fit-cover" />
                                            ) : (
                                                user?.name?.substring(0, 2).toUpperCase()
                                            )}
                                        </div>
                                        <button
                                            className="btn btn-primary btn-sm rounded-circle position-absolute bottom-0 end-0"
                                            style={{ width: '36px', height: '36px' }}
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <Camera size={16} />
                                        </button>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="d-none"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                </div>

                                {/* Tabs */}
                                <ul className="nav nav-pills mb-4 justify-content-center" role="tablist">
                                    <li className="nav-item" role="presentation">
                                        <button
                                            className={`nav-link ${activeTab === 'personal' ? 'active' : ''}`}
                                            onClick={() => setActiveTab('personal')}
                                        >
                                            <User size={16} className="me-2" />Personal
                                        </button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button
                                            className={`nav-link ${activeTab === 'notifications' ? 'active' : ''}`}
                                            onClick={() => setActiveTab('notifications')}
                                        >
                                            <Bell size={16} className="me-2" />Notifications
                                        </button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button
                                            className={`nav-link ${activeTab === 'privacy' ? 'active' : ''}`}
                                            onClick={() => setActiveTab('privacy')}
                                        >
                                            <Shield size={16} className="me-2" />Privacy
                                        </button>
                                    </li>
                                </ul>

                                {/* Tab Content */}
                                <div className="tab-content">
                                    {activeTab === 'personal' && (
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold">Full Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={profileForm.name}
                                                    onChange={e => handleFormChange('name', e.target.value)}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold">Email</label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    value={profileForm.email}
                                                    onChange={e => handleFormChange('email', e.target.value)}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold">Phone</label>
                                                <input
                                                    type="tel"
                                                    className="form-control"
                                                    value={profileForm.phone}
                                                    onChange={e => handleFormChange('phone', e.target.value)}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold">Location</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={profileForm.location}
                                                    onChange={e => handleFormChange('location', e.target.value)}
                                                />
                                            </div>
                                            <div className="col-12">
                                                <label className="form-label fw-semibold">Bio</label>
                                                <textarea
                                                    className="form-control"
                                                    rows="3"
                                                    value={profileForm.bio}
                                                    onChange={e => handleFormChange('bio', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'notifications' && (
                                        <div className="d-flex flex-column gap-3">
                                            <div className="form-check form-switch">
                                                <input className="form-check-input" type="checkbox" checked={profileForm.notifications.email} onChange={e => handleFormChange('notifications', { ...profileForm.notifications, email: e.target.checked })} />
                                                <label className="form-check-label fw-semibold">Email Notifications</label>
                                            </div>
                                            <div className="form-check form-switch">
                                                <input className="form-check-input" type="checkbox" checked={profileForm.notifications.sms} onChange={e => handleFormChange('notifications', { ...profileForm.notifications, sms: e.target.checked })} />
                                                <label className="form-check-label fw-semibold">SMS Notifications</label>
                                            </div>
                                            <div className="form-check form-switch">
                                                <input className="form-check-input" type="checkbox" checked={profileForm.notifications.push} onChange={e => handleFormChange('notifications', { ...profileForm.notifications, push: e.target.checked })} />
                                                <label className="form-check-label fw-semibold">Push Notifications</label>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'privacy' && (
                                        <div className="d-flex flex-column gap-3">
                                            <div className="form-check form-switch">
                                                <input className="form-check-input" type="checkbox" checked={profileForm.privacy.showProfile} onChange={e => handleFormChange('privacy', { ...profileForm.privacy, showProfile: e.target.checked })} />
                                                <label className="form-check-label fw-semibold">Show Profile Publicly</label>
                                            </div>
                                            <div className="form-check form-switch">
                                                <input className="form-check-input" type="checkbox" checked={profileForm.privacy.showBookings} onChange={e => handleFormChange('privacy', { ...profileForm.privacy, showBookings: e.target.checked })} />
                                                <label className="form-check-label fw-semibold">Show Booking History</label>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {saveMessage.text && (
                                    <div className={`alert alert-${saveMessage.type === 'success' ? 'success' : 'danger'} mt-3`}>
                                        {saveMessage.text}
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer border-top">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowProfileModal(false)}>Cancel</button>
                                <button type="button" className="btn btn-primary" onClick={handleSaveProfile} disabled={isSaving}>
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Header / Navbar - Same style as Home Page */}
            <nav className="navbar navbar-expand-lg navbar-light sticky-top user-dashboard-navbar">
                <div className="container">
                    <a className="navbar-brand d-flex align-items-center" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                        <img src={logo} alt="EventAllInOne Logo" className="logo-img me-2" />
                        <span className="fw-bold fs-4 brand-text">EventAllInOne</span>
                    </a>

                    <button
                        className="navbar-toggler"
                        type="button"
                        onClick={() => setShowMobileMenu(!showMobileMenu)}
                    >
                        <Menu size={24} />
                    </button>

                    <div className={`collapse navbar-collapse justify-content-end ${showMobileMenu ? 'show' : ''}`}>
                        <ul className="navbar-nav align-items-center">
                            <li className="nav-item">
                                <a className="nav-link px-3" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Home</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link px-3" onClick={() => navigate('/events')} style={{ cursor: 'pointer' }}>Events</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link px-3" onClick={() => navigate('/contact')} style={{ cursor: 'pointer' }}>Contact</a>
                            </li>
                            <li className="nav-item">
                                <span className="nav-link px-3 fw-bold text-primary">User Dashboard</span>
                            </li>
                            <li className="nav-item ms-2">
                                <button className="btn btn-outline-danger rounded-pill px-4" onClick={handleLogout}>
                                    <LogOut size={16} className="me-1" />
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="container-fluid px-4 py-4">
                <div className="row g-4">
                    <div className="col-12">
                        {/* Greeting Section */}
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
                            <div className="d-flex align-items-center gap-3">
                                {/* Avatar with Dropdown */}
                                <div className="position-relative" ref={dropdownRef}>
                                    <div
                                        className="avatar-circle bg-primary text-white d-flex align-items-center justify-content-center rounded-circle shadow-sm overflow-hidden"
                                        onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                                        style={{ cursor: 'pointer', width: '56px', height: '56px', fontSize: '1.15rem', border: '2px solid #fff' }}
                                    >
                                        {(user?.avatar || avatarPreview) ? (
                                            <img
                                                src={user?.avatar || avatarPreview}
                                                alt="Avatar"
                                                className="w-100 h-100 object-fit-cover"
                                            />
                                        ) : (
                                            user?.name?.substring(0, 2).toUpperCase()
                                        )}
                                    </div>

                                    {/* Dropdown Menu */}
                                    {showProfileDropdown && (
                                        <div className="dropdown-menu show position-absolute mt-2 shadow-lg border-0" style={{ minWidth: '240px' }}>
                                            <div className="px-3 py-2 bg-light border-bottom">
                                                <p className="mb-0 fw-bold small">{user?.name}</p>
                                                <p className="mb-0 text-muted" style={{ fontSize: '0.75rem' }}>{user?.email}</p>
                                            </div>
                                            <button
                                                className="dropdown-item py-2"
                                                onClick={() => { setShowProfileModal(true); setShowProfileDropdown(false); setActiveTab('personal'); }}
                                            >
                                                <User size={16} className="me-2" />Edit Profile
                                            </button>
                                            <button
                                                className="dropdown-item py-2"
                                                onClick={() => { setShowProfileModal(true); setShowProfileDropdown(false); setActiveTab('notifications'); }}
                                            >
                                                <Bell size={16} className="me-2" />Notifications
                                            </button>
                                            <button
                                                className="dropdown-item py-2"
                                                onClick={() => { setShowProfileModal(true); setShowProfileDropdown(false); setActiveTab('privacy'); }}
                                            >
                                                <Shield size={16} className="me-2" />Privacy
                                            </button>
                                            <div className="dropdown-divider"></div>
                                            <button
                                                className="dropdown-item py-2 text-danger"
                                                onClick={() => {
                                                    authService.logout();
                                                    navigate('/login');
                                                }}
                                            >
                                                <LogOut size={16} className="me-2" />Sign Out
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Greeting Text */}
                                <div>
                                    <h1 className="h4 mb-1 fw-bold" style={{ letterSpacing: '-0.01em' }}>Hello, {user?.name?.split(' ')[0]}!</h1>
                                    <p className="text-muted mb-0 small" style={{ fontSize: '0.85rem' }}>Manage your event details and upcoming schedules here.</p>
                                </div>
                            </div>

                            {/* Action Button */}
                            <button
                                className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2 rounded-pill shadow-sm"
                                onClick={() => navigate('/events')}
                            >
                                <Plus size={20} />
                                <span className="fw-semibold">Book New Event</span>
                            </button>
                        </div>

                        {/* Stats Cards */}
                        <div className="row g-4 mb-4">
                            <div className="col-12 col-md-4">
                                <div className="card stat-card h-100">
                                    <div className="card-body p-4 d-flex align-items-center gap-4">
                                        <div className="stat-icon bg-primary bg-opacity-10 text-primary rounded-4 d-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px' }}>
                                            <Clock size={24} />
                                        </div>
                                        <div>
                                            <p className="text-muted text-uppercase small fw-bold mb-1" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>Total Bookings</p>
                                            <h2 className="display-6 fw-bold mb-0" style={{ letterSpacing: '-0.02em' }}>{stats.total}</h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-md-4">
                                <div className="card stat-card h-100">
                                    <div className="card-body p-4 d-flex align-items-center gap-4">
                                        <div className="stat-icon bg-warning bg-opacity-10 text-warning rounded-4 d-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px' }}>
                                            <Calendar size={24} />
                                        </div>
                                        <div>
                                            <p className="text-muted text-uppercase small fw-bold mb-1" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>Upcoming</p>
                                            <h2 className="display-6 fw-bold mb-0" style={{ letterSpacing: '-0.02em' }}>{stats.upcoming}</h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-md-4">
                                <div className="card stat-card h-100">
                                    <div className="card-body p-4 d-flex align-items-center gap-4">
                                        <div className="stat-icon bg-success bg-opacity-10 text-success rounded-4 d-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px' }}>
                                            <CheckCircle size={24} />
                                        </div>
                                        <div>
                                            <p className="text-muted text-uppercase small fw-bold mb-1" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>Completed</p>
                                            <h2 className="display-6 fw-bold mb-0" style={{ letterSpacing: '-0.02em' }}>{stats.completed}</h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Filter & Search Bar */}
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center mb-4 gap-3">
                            <div className="search-container">
                                <Search className="search-icon" size={18} />
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search bookings..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="btn-group shadow-sm border-0" role="group">
                                {['all', 'confirmed', 'pending', 'rescheduled'].map(f => (
                                    <button
                                        key={f}
                                        type="button"
                                        className={`btn btn-sm ${filter === f ? 'active' : ''}`}
                                        onClick={() => setFilter(f)}
                                    >
                                        {f.charAt(0).toUpperCase() + f.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Bookings List */}
                        <div className="row g-4">
                            {filteredBookings.map(booking => (
                                <div key={booking.id} className="col-12">
                                    <div className="card border-0 shadow-sm booking-card">
                                        <div className="card-body p-0">
                                            <div className="row g-0">
                                                {/* Booking Image */}
                                                <div className="col-12 col-md-4 col-lg-3">
                                                    <div className="booking-image h-100" style={{ minHeight: '180px' }}>
                                                        <img src={booking.image} alt={booking.title} className="w-100 h-100 object-fit-cover" style={{ borderRadius: '12px 0 0 12px' }} />
                                                    </div>
                                                </div>

                                                {/* Booking Details */}
                                                <div className="col-12 col-md-8 col-lg-9">
                                                    <div className="p-3 p-md-4">
                                                        {/* Header: Status Badge and Booking ID */}
                                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                                            <span className={`badge ${booking.status === 'confirmed' ? 'bg-success-subtle text-success' :
                                                                booking.status === 'pending' ? 'bg-warning-subtle text-warning' :
                                                                    'bg-info-subtle text-info'
                                                                }`} style={{ fontSize: '0.7rem', fontWeight: '600', padding: '0.4rem 0.8rem', borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                                {booking.status === 'confirmed' && <Check size={12} className="me-1" />}
                                                                {booking.status === 'pending' && <Clock size={12} className="me-1" />}
                                                                {booking.status === 'rescheduled' && <RefreshCw size={12} className="me-1" />}
                                                                {booking.statusLabel}
                                                            </span>
                                                            <span className="text-muted small" style={{ fontSize: '0.85rem' }}>#{booking.id}</span>
                                                        </div>

                                                        {/* Title */}
                                                        <h5 className="fw-bold mb-2" style={{ fontSize: '1.1rem', color: '#1e293b' }}>
                                                            {booking.title}
                                                        </h5>

                                                        {/* Vendor */}
                                                        <div className="d-flex align-items-center gap-2 mb-3">
                                                            <Store size={16} className="text-muted" />
                                                            <span className="text-muted" style={{ fontSize: '0.9rem' }}>{booking.vendor}</span>
                                                        </div>

                                                        {/* Date and Time */}
                                                        <div className="d-flex flex-wrap gap-3 mb-3">
                                                            <div className="d-flex align-items-center gap-2">
                                                                <Calendar size={16} style={{ color: '#3b82f6' }} />
                                                                <span style={{ fontSize: '0.9rem', color: '#475569' }}>{booking.date}</span>
                                                            </div>
                                                            <div className="d-flex align-items-center gap-2">
                                                                <Clock size={16} style={{ color: '#3b82f6' }} />
                                                                <span style={{ fontSize: '0.9rem', color: '#475569' }}>{booking.time}</span>
                                                            </div>
                                                        </div>

                                                        {/* Action Buttons */}
                                                        <div className="d-flex flex-wrap gap-2">
                                                            <button className="btn btn-primary btn-sm" style={{ fontSize: '0.875rem', padding: '0.5rem 1.25rem', fontWeight: '500' }}>
                                                                View Details
                                                            </button>
                                                            {booking.status === 'confirmed' && (
                                                                <button className="btn btn-outline-secondary btn-sm" style={{ fontSize: '0.875rem', padding: '0.5rem 1.25rem', fontWeight: '500' }}>
                                                                    Contact Vendor
                                                                </button>
                                                            )}
                                                            {booking.status === 'pending' && (
                                                                <button
                                                                    className="btn btn-outline-secondary btn-sm"
                                                                    style={{ fontSize: '0.875rem', padding: '0.5rem 1.25rem', fontWeight: '500' }}
                                                                    onClick={() => navigate('/payments')}
                                                                >
                                                                    Pay Deposit
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredBookings.length === 0 && (
                            <div className="text-center py-5">
                                <div className="mb-4">
                                    <Calendar size={64} className="text-muted" style={{ opacity: 0.5 }} />
                                </div>
                                <h5 className="text-muted mb-2">No bookings yet</h5>
                                <p className="text-muted mb-4">
                                    {searchTerm || filter !== 'all'
                                        ? 'No bookings match your search or filter criteria.'
                                        : 'Start exploring vendors and book your first event!'}
                                </p>
                                {!searchTerm && filter === 'all' && (
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => navigate('/events')}
                                    >
                                        <Plus size={18} className="me-2" />
                                        Browse Events
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Footer - Same style as Home Page */}
            <footer className="user-dashboard-footer text-center py-4 mt-5">
                <div className="container">
                    <p className="mb-2 footer-text">
                        © {new Date().getFullYear()} <strong>EventAllInOne</strong> | All Rights Reserved
                    </p>
                    <div className="social-icons mt-2">
                        <a href="https://www.instagram.com/eventallinone_app/?igsh=bmd4YjcyNGlidG8w#" target="_blank" rel="noreferrer" className="me-3">Instagram</a>
                        <a href="https://www.facebook.com/people/Eventallinoneapp/61583371712946/?rdid=uE1dLaWcqnDc16Y8&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F19xgBwg2s3%2F" target="_blank" rel="noreferrer" className="me-3">Facebook</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default UserDashboard;