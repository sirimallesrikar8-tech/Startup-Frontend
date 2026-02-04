import React, { useState, useRef, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Store,
    Briefcase,
    Calendar,
    CreditCard,
    Settings,
    Menu,
    X,
    Bell,
    User,
    Check,
    LogOut,
    ChevronDown
} from 'lucide-react';
import LogoutButton from '../components/layout/LogoutButton';
import ThemeSwitcher from '../components/layout/ThemeSwitcher';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminLayout.css';

const AdminLayout = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, message: 'New booking received for Corporate Gala', time: '5 min ago', read: false },
        { id: 2, message: 'Payment confirmed for Wedding Ceremony', time: '1 hour ago', read: false },
        { id: 3, message: 'New vendor registration pending approval', time: '2 hours ago', read: true },
        { id: 4, message: 'Monthly revenue report is ready', time: '1 day ago', read: true }
    ]);
    const notificationRef = useRef(null);
    const profileRef = useRef(null);
    const sidebarRef = useRef(null);

    // Handle responsive sidebar
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Handle click outside for dropdowns
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (window.innerWidth <= 768 && sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                const toggleButton = event.target.closest('[data-sidebar-toggle]');
                if (!toggleButton) {
                    setSidebarOpen(false);
                }
            }

            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setNotificationsOpen(false);
            }

            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [sidebarOpen]);

    const markAsRead = (id) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        navigate('/login');
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    const menuItems = [
        { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/users', icon: Users, label: 'Users' },
        { path: '/admin/vendors', icon: Store, label: 'Vendors' },
        { path: '/admin/services', icon: Briefcase, label: 'Services' },
        { path: '/admin/bookings', icon: Calendar, label: 'Bookings' },
        { path: '/admin/payments', icon: CreditCard, label: 'Payments' },
        { path: '/admin/settings', icon: Settings, label: 'Settings' }
    ];

    return (
        <div className="admin-layout">
            {/* Mobile Overlay */}
            {sidebarOpen && window.innerWidth <= 768 && (
                <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside ref={sidebarRef} className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-content">
                    {/* Logo */}
                    <div className="sidebar-header">
                        <h1 className="sidebar-title gradient-text">
                            EventAllInOne
                        </h1>
                        <p className="sidebar-subtitle text-muted">
                            Admin Dashboard
                        </p>
                    </div>

                    {/* Navigation */}
                    <nav className="sidebar-nav">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    end={item.path === '/admin'}
                                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                                    onClick={() => window.innerWidth <= 768 && setSidebarOpen(false)}
                                >
                                    <Icon size={20} />
                                    <span>{item.label}</span>
                                </NavLink>
                            );
                        })}
                    </nav>

                    {/* Logout Button */}
                    <div className="sidebar-footer">
                        <LogoutButton />
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className={`admin-main ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                {/* Header */}
                <header className="admin-header">
                    <div className="header-left">
                        <button
                            data-sidebar-toggle
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="btn btn-light btn-sm d-flex align-items-center justify-content-center"
                            style={{ width: '40px', height: '40px' }}
                        >
                            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>

                    <div className="header-right">
                        {/* Theme Switcher */}
                        <ThemeSwitcher />

                        {/* Notifications */}
                        <div ref={notificationRef} className="position-relative">
                            <button
                                onClick={() => setNotificationsOpen(!notificationsOpen)}
                                className="btn btn-light btn-sm position-relative d-flex align-items-center justify-content-center"
                                style={{ width: '40px', height: '40px' }}
                            >
                                <Bell size={20} />
                                {unreadCount > 0 && (
                                    <span className="notification-badge">{unreadCount}</span>
                                )}
                            </button>

                            {notificationsOpen && (
                                <div className="notification-dropdown">
                                    <div className="notification-header">
                                        <h6 className="mb-0">Notifications</h6>
                                        {unreadCount > 0 && (
                                            <span className="badge bg-primary">{unreadCount} new</span>
                                        )}
                                    </div>

                                    {notifications.length > 0 ? (
                                        <div className="notification-list">
                                            {notifications.map(notification => (
                                                <div
                                                    key={notification.id}
                                                    onClick={() => markAsRead(notification.id)}
                                                    className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                                                >
                                                    {!notification.read && (
                                                        <div className="notification-dot" />
                                                    )}
                                                    <div className="notification-content">
                                                        <p className="notification-message">
                                                            {notification.message}
                                                        </p>
                                                        <p className="notification-time text-muted">
                                                            {notification.time}
                                                        </p>
                                                    </div>
                                                    {notification.read && (
                                                        <Check size={16} className="text-success" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="notification-empty">
                                            <p className="text-muted mb-0">No notifications</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* User Profile - Clickable with Dropdown */}
                        <div ref={profileRef} className="position-relative">
                            <button
                                onClick={() => setProfileOpen(!profileOpen)}
                                className="user-profile d-none d-md-flex"
                                style={{
                                    cursor: 'pointer',
                                    background: 'rgba(36, 48, 68, 0.8)',
                                    border: profileOpen ? '1px solid rgba(99, 102, 241, 0.5)' : '1px solid rgba(255, 255, 255, 0.06)',
                                    boxShadow: profileOpen ? '0 0 20px rgba(99, 102, 241, 0.2)' : 'none'
                                }}
                            >
                                <div className="user-avatar">
                                    <User size={16} />
                                </div>
                                <div className="user-info">
                                    <p className="user-name">Admin User</p>
                                    <p className="user-email text-muted">admin@eventallinone.com</p>
                                </div>
                                <ChevronDown
                                    size={16}
                                    style={{
                                        marginLeft: '8px',
                                        color: '#9CA3AF',
                                        transition: 'transform 0.2s',
                                        transform: profileOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                                    }}
                                />
                            </button>

                            {/* Profile Dropdown Menu */}
                            {profileOpen && (
                                <div className="profile-dropdown">
                                    <div className="profile-dropdown-header">
                                        <div className="profile-avatar-large">
                                            <User size={24} />
                                        </div>
                                        <div className="profile-details">
                                            <h6 className="mb-0">Admin User</h6>
                                            <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>Super Administrator</p>
                                        </div>
                                    </div>
                                    <div className="profile-dropdown-divider" />
                                    <div className="profile-dropdown-menu">
                                        <button
                                            className="profile-dropdown-item"
                                            onClick={() => {
                                                navigate('/admin/settings');
                                                setProfileOpen(false);
                                            }}
                                        >
                                            <Settings size={16} />
                                            <span>Settings</span>
                                        </button>
                                        <button
                                            className="profile-dropdown-item"
                                            onClick={() => {
                                                navigate('/admin/users');
                                                setProfileOpen(false);
                                            }}
                                        >
                                            <User size={16} />
                                            <span>My Profile</span>
                                        </button>
                                        <div className="profile-dropdown-divider" />
                                        <button
                                            className="profile-dropdown-item danger"
                                            onClick={handleLogout}
                                        >
                                            <LogOut size={16} />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="admin-content">
                    <Outlet />
                </main>

                {/* Admin Footer - Homepage Style */}
                <footer className="admin-footer text-center py-4 mt-auto border-top border-secondary-subtle">
                    <div className="container-fluid">
                        <p className="mb-2 text-body-secondary">
                            © {new Date().getFullYear()} <strong>EventAllInOne</strong> | All Rights Reserved
                        </p>
                        <div className="social-icons mt-2 d-flex justify-content-center gap-3">
                            <a
                                href="https://www.instagram.com/eventallinone_app/?igsh=bmd4YjcyNGlidG8w#"
                                target="_blank"
                                rel="noreferrer"
                                className="text-decoration-none footer-social-link"
                            >
                                Instagram
                            </a>
                            <a
                                href="https://www.facebook.com/people/Eventallinoneapp/61583371712946/?rdid=uE1dLaWcqnDc16Y8&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F19xgBwg2s3%2F"
                                target="_blank"
                                rel="noreferrer"
                                className="text-decoration-none footer-social-link"
                            >
                                Facebook
                            </a>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default AdminLayout;
