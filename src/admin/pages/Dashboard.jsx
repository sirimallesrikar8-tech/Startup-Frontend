import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search, TrendingUp, TrendingDown, DollarSign, Calendar, AlertCircle, Star,
    ArrowRight, Eye, MoreVertical, Download, RefreshCw, Filter, X, Check,
    ArrowUpDown, Copy, ChevronDown, Trash2, CheckCircle
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { dashboardStats, recentActivity, revenueData } from '../data/dashboardData';
import { bookingsService } from '../services/bookingsService';
import ActionMenu from '../components/ui/ActionMenu';

// Static configurations moved outside to prevent re-creation on every render
const activityConfig = {
    booking: { icon: Calendar, color: '#3b82f6' },
    payment: { icon: DollarSign, color: '#10b981' },
    vendor: { icon: Star, color: '#f59e0b' },
    user: { icon: AlertCircle, color: '#8b5cf6' }
};

const statusStyles = {
    confirmed: { background: '#d1fae5', color: '#065f46', border: '1px solid #10b981' },
    pending: { background: '#fef3c7', color: '#92400e', border: '1px solid #f59e0b' },
    cancelled: { background: '#fee2e2', color: '#991b1b', border: '1px solid #ef4444' }
};

const iconMap = {
    DollarSign,
    Calendar,
    AlertCircle,
    Star
};

const Dashboard = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [bookings, setBookings] = useState([]); // Raw data
    const [filteredBookings, setFilteredBookings] = useState([]); // Display data
    const [statusFilter, setStatusFilter] = useState('all');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [toast, setToast] = useState(null);
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const [dateRange, setDateRange] = useState('all');

    // Dynamic Stats State
    const [stats, setStats] = useState({
        total: 0,
        revenue: 0,
        pending: 0,
        growth: 0 // Placeholder
    });

    // High-performance animated counter using requestAnimationFrame
    const useCounter = (end, duration = 2000) => {
        const [count, setCount] = useState(0);

        useEffect(() => {
            let startTimestamp = null;
            const endValue = typeof end === 'string' ? parseFloat(end.replace(/[^0-9.]/g, '')) : end;
            const startValue = 0;

            let animationFrameId;

            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                const current = Math.floor(progress * (endValue - startValue) + startValue);

                setCount(current);

                if (progress < 1) {
                    animationFrameId = window.requestAnimationFrame(step);
                }
            };

            animationFrameId = window.requestAnimationFrame(step);
            return () => window.cancelAnimationFrame(animationFrameId);
        }, [end, duration]);

        return count;
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const data = await bookingsService.getAll();
            if (Array.isArray(data)) {
                // Map API data to Dashboard format
                const mappedData = data.map(b => ({
                    id: b.bookingId,
                    client: b.userName || 'Unknown User',
                    clientEmail: b.userEmail || '', // Backend might need to send this
                    eventName: `Booking #${b.bookingId}`, // Placeholder
                    eventType: 'Service',
                    eventDate: b.slotDate,
                    totalAmount: '0.00', // Backend needs to send price
                    status: b.status ? b.status.toLowerCase() : 'pending',
                    // Add other fields if needed
                }));

                setBookings(mappedData);
                setFilteredBookings(mappedData);

                // Calculate Stats
                const total = mappedData.length;
                const pending = mappedData.filter(b => b.status === 'pending').length;
                // Revenue calculation would require price data

                setStats({
                    total,
                    revenue: 0, // Placeholder until price is available
                    pending,
                    growth: 12 // Mock growth
                });
            }
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
            showToast("Failed to load live data", "error");
        }
    };

    // Filter bookings based on search and status
    useEffect(() => {
        let filtered = [...bookings];

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(booking =>
                booking.client.toLowerCase().includes(query) ||
                booking.eventName.toLowerCase().includes(query) ||
                (booking.clientEmail && booking.clientEmail.toLowerCase().includes(query))
            );
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(booking => booking.status === statusFilter);
        }

        // Sort - Improved logic
        if (sortColumn) {
            filtered.sort((a, b) => {
                let aVal = a[sortColumn];
                let bVal = b[sortColumn];

                if (sortColumn === 'totalAmount') {
                    aVal = typeof aVal === 'string' ? parseFloat(aVal.replace(/[^0-9.]/g, '')) : aVal;
                    bVal = typeof bVal === 'string' ? parseFloat(bVal.replace(/[^0-9.]/g, '')) : bVal;
                }

                if (aVal === bVal) return 0;

                const modifier = sortDirection === 'asc' ? 1 : -1;
                return aVal > bVal ? modifier : -modifier;
            });
        }

        setFilteredBookings(filtered);
    }, [searchQuery, statusFilter, sortColumn, sortDirection, bookings]);

    // Show toast notification
    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    // Security: Escaping values for CSV to prevent formula injection and broken formatting
    const escapeCSV = (val) => {
        if (val === null || val === undefined) return '';
        let result = val.toString();
        // Prevent CSV Formula Injection
        if (['=', '+', '-', '@'].includes(result[0])) {
            result = "'" + result;
        }
        // Escape quotes and wrap in quotes if contains comma
        if (result.includes(',') || result.includes('"') || result.includes('\n')) {
            result = `"${result.replace(/"/g, '""')}"`;
        }
        return result;
    };

    const exportToCSV = () => {
        const headers = ['Customer', 'Email', 'Service', 'Event Type', 'Date', 'Amount', 'Status'];
        const rows = filteredBookings.map(b => [
            b.client,
            b.clientEmail,
            b.eventName,
            b.eventType,
            b.eventDate,
            b.totalAmount,
            b.status
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(escapeCSV).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `event-bookings-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);

        showToast('Bookings exported successfully!');
    };

    // Refresh data with animation
    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => {
            setIsRefreshing(false);
            showToast('Dashboard refreshed!');
        }, 1500);
    };

    // Copy to clipboard
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        showToast('Copied to clipboard!');
    };

    // Handle sort
    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    // Get relative time
    const getRelativeTime = (timestamp) => {
        const now = new Date();
        const diff = now - new Date(timestamp);
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    // Status badge styles
    const getStatusStyle = (status) => statusStyles[status] || statusStyles.pending;

    // Custom tooltip for chart
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{
                    background: 'var(--bg-card)',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    boxShadow: 'var(--shadow-lg)'
                }}>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>
                        ${payload[0].value}k Revenue
                    </p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                        {payload[0].payload.month}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="animate-fade-in">
            {/* Toast Notification */}
            {toast && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    background: toast.type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #ef4444, #dc2626)',
                    color: 'white',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    boxShadow: 'var(--shadow-xl)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    animation: 'slideInRight 0.3s ease-out'
                }}>
                    <Check size={18} />
                    <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{toast.message}</span>
                </div>
            )}

            {/* Header Section */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem',
                gap: '1rem',
                flexWrap: 'wrap'
            }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                        Dashboard
                        <span style={{
                            fontSize: '0.875rem',
                            color: 'var(--text-muted)',
                            marginLeft: '12px',
                            fontWeight: '400'
                        }}>
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        Welcome back! Here's what's happening with your events.
                    </p>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <button
                        onClick={handleRefresh}
                        className="btn btn-secondary"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '10px 16px'
                        }}
                    >
                        <RefreshCw size={16} style={{
                            animation: isRefreshing ? 'spin 1s linear infinite' : 'none'
                        }} />
                        Refresh
                    </button>

                    <div style={{ position: 'relative' }}>
                        <Search style={{
                            position: 'absolute',
                            left: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'var(--text-muted)',
                            width: '18px',
                            height: '18px'
                        }} />
                        <input
                            type="text"
                            placeholder="Search bookings..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '280px',
                                padding: '10px 12px 10px 40px',
                                background: 'var(--bg-tertiary)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '8px',
                                color: 'var(--text-primary)',
                                fontSize: '0.875rem',
                                outline: 'none',
                                transition: 'all 0.2s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                style={{
                                    position: 'absolute',
                                    right: '8px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--text-muted)',
                                    cursor: 'pointer',
                                    padding: '4px'
                                }}
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats Cards - With Animated Counters */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
            }}>
                {Object.values(dashboardStats).map((stat, index) => {
                    const Icon = iconMap[stat.icon] || DollarSign;
                    const isPositive = stat.trend === 'up';

                    // Override with dynamic values
                    let displayValue = stat.value;
                    let displayTrend = stat.trendValue;

                    if (stat.title === 'Total Revenue') {
                        displayValue = `$${stats.revenue}k`;
                    } else if (stat.title === 'Total Bookings') {
                        displayValue = stats.total.toString();
                    } else if (stat.title === 'Pending Requests') {
                        displayValue = stats.pending.toString();
                    }
                    // Add more mappings if needed

                    // Create a modified stat object
                    const dynamicStat = {
                        ...stat,
                        value: displayValue,
                        trendValue: displayTrend
                    };

                    return (
                        <StatCardAnimated
                            key={index}
                            stat={dynamicStat}
                            Icon={Icon}
                            isPositive={isPositive}
                            index={index}
                            useCounter={useCounter}
                        />
                    );
                })}
            </div>

            {/* Filter Chips */}
            {(statusFilter !== 'all' || dateRange !== 'all') && (
                <div style={{
                    display: 'flex',
                    gap: '0.75rem',
                    marginBottom: '1.5rem',
                    flexWrap: 'wrap',
                    alignItems: 'center'
                }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                        Active Filters:
                    </span>
                    {statusFilter !== 'all' && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '6px 12px',
                            background: 'var(--bg-tertiary)',
                            borderRadius: '20px',
                            fontSize: '0.875rem'
                        }}>
                            <span>Status: {statusFilter}</span>
                            <button
                                onClick={() => setStatusFilter('all')}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--text-muted)',
                                    cursor: 'pointer',
                                    padding: '2px',
                                    display: 'flex'
                                }}
                            >
                                <X size={14} />
                            </button>
                        </div>
                    )}
                    <button
                        onClick={() => {
                            setStatusFilter('all');
                            setDateRange('all');
                        }}
                        style={{
                            fontSize: '0.75rem',
                            color: 'var(--primary-light)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: '600',
                            textDecoration: 'underline'
                        }}
                    >
                        Clear All
                    </button>
                </div>
            )}

            {/* Charts and Activity Section */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr',
                gap: '1.5rem',
                marginBottom: '2rem'
            }}>
                {/* Revenue Chart */}
                <div className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>
                            Revenue Analytics
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary)' }}></div>
                                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Monthly Revenue</span>
                            </div>
                            <button
                                onClick={() => showToast('Chart data exported!')}
                                style={{
                                    padding: '6px 10px',
                                    fontSize: '0.75rem',
                                    background: 'var(--bg-tertiary)',
                                    border: 'none',
                                    borderRadius: '6px',
                                    color: 'var(--text-primary)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}
                            >
                                <Download size={14} />
                                Export
                            </button>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                            <XAxis
                                dataKey="month"
                                stroke="var(--text-muted)"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="var(--text-muted)"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `$${value}k`}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="var(--primary)"
                                strokeWidth={3}
                                fill="url(#colorRevenue)"
                                activeDot={{ r: 6, fill: 'var(--primary)' }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Recent Activity */}
                <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>
                            Recent Activity
                        </h3>
                        <button
                            onClick={() => navigate('/admin/bookings')}
                            style={{
                                fontSize: '0.75rem',
                                color: 'var(--primary-light)',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: '600'
                            }}
                        >
                            View All
                        </button>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', maxHeight: '350px' }}>
                        {recentActivity.slice(0, 6).map((activity) => {
                            const config = activityConfig[activity.type] || activityConfig.booking;
                            const ActivityIcon = config.icon;

                            return (
                                <div
                                    key={activity.id}
                                    onClick={() => activity.route && navigate(activity.route)}
                                    style={{
                                        display: 'flex',
                                        gap: '0.75rem',
                                        padding: '0.875rem',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        marginBottom: '0.5rem',
                                        transition: 'background 0.2s',
                                        position: 'relative'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: `${config.color}20`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        <ActivityIcon size={18} style={{ color: config.color }} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                                            {activity.title}
                                        </p>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                                            {activity.description}
                                        </p>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            {getRelativeTime(activity.timestamp)}
                                        </p>
                                    </div>
                                    <ActionMenu
                                        actions={[
                                            {
                                                label: 'View Details',
                                                icon: Eye,
                                                onClick: () => activity.route && navigate(activity.route)
                                            },
                                            {
                                                label: 'Mark as Read',
                                                icon: CheckCircle,
                                                onClick: () => showToast('Marked as read!')
                                            },
                                            {
                                                label: 'Delete',
                                                icon: Trash2,
                                                onClick: () => showToast('Activity deleted'),
                                                danger: true
                                            }
                                        ]}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Recent Booking Requests Table */}
            <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>
                            Recent Booking Requests
                        </h3>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                            Showing {filteredBookings.length} of {bookingsData.length} bookings
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        {/* Status Filter */}
                        <div style={{ position: 'relative' }}>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                style={{
                                    padding: '8px 32px 8px 12px',
                                    background: 'var(--bg-tertiary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '6px',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.875rem',
                                    cursor: 'pointer',
                                    outline: 'none',
                                    appearance: 'none'
                                }}
                            >
                                <option value="all">All Status</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="pending">Pending</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                            <ChevronDown size={16} style={{
                                position: 'absolute',
                                right: '10px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'var(--text-muted)',
                                pointerEvents: 'none'
                            }} />
                        </div>

                        <button
                            onClick={exportToCSV}
                            className="btn btn-primary"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '8px 16px',
                                fontSize: '0.875rem'
                            }}
                        >
                            <Download size={16} />
                            Export CSV
                        </button>
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <th style={{ padding: '0.875rem 1rem', textAlign: 'left' }}>
                                    <button
                                        onClick={() => handleSort('client')}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            background: 'none',
                                            border: 'none',
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                            color: 'var(--text-muted)',
                                            textTransform: 'uppercase',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Customer
                                        <ArrowUpDown size={14} />
                                    </button>
                                </th>
                                <th style={{ padding: '0.875rem 1rem', textAlign: 'left' }}>
                                    <button
                                        onClick={() => handleSort('eventName')}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            background: 'none',
                                            border: 'none',
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                            color: 'var(--text-muted)',
                                            textTransform: 'uppercase',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Service
                                        <ArrowUpDown size={14} />
                                    </button>
                                </th>
                                <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                                    Date
                                </th>
                                <th style={{ padding: '0.875rem 1rem', textAlign: 'left' }}>
                                    <button
                                        onClick={() => handleSort('totalAmount')}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            background: 'none',
                                            border: 'none',
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                            color: 'var(--text-muted)',
                                            textTransform: 'uppercase',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Amount
                                        <ArrowUpDown size={14} />
                                    </button>
                                </th>
                                <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                                    Status
                                </th>
                                <th style={{ padding: '0.875rem 1rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBookings.slice(0, 7).map((booking, index) => (
                                <tr
                                    key={booking.id}
                                    style={{
                                        borderBottom: index < 6 ? '1px solid var(--border-color)' : 'none',
                                        cursor: 'pointer',
                                        transition: 'background 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                    onClick={() => navigate(`/admin/bookings/${booking.id}`)}
                                >
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{
                                                width: '36px',
                                                height: '36px',
                                                borderRadius: '50%',
                                                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                fontSize: '0.875rem',
                                                fontWeight: '600'
                                            }}>
                                                {booking.client.charAt(0)}
                                            </div>
                                            <div>
                                                <p style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '0.125rem' }}>
                                                    {booking.client}
                                                </p>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                        {booking.clientEmail}
                                                    </p>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            copyToClipboard(booking.clientEmail);
                                                        }}
                                                        style={{
                                                            background: 'none',
                                                            border: 'none',
                                                            color: 'var(--text-muted)',
                                                            cursor: 'pointer',
                                                            padding: '2px',
                                                            display: 'flex'
                                                        }}
                                                    >
                                                        <Copy size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <p style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '0.125rem' }}>
                                            {booking.eventName}
                                        </p>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            {booking.eventType}
                                        </p>
                                    </td>
                                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                        {formatDate(booking.eventDate)}
                                    </td>
                                    <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                                        {booking.totalAmount}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            ...getStatusStyle(booking.status),
                                            padding: '0.375rem 0.75rem',
                                            borderRadius: '9999px',
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                            textTransform: 'capitalize',
                                            display: 'inline-block'
                                        }}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/admin/bookings/${booking.id}`);
                                                }}
                                                style={{
                                                    padding: '0.5rem',
                                                    borderRadius: '6px',
                                                    background: 'transparent',
                                                    border: 'none',
                                                    color: 'var(--text-muted)',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = 'var(--bg-tertiary)';
                                                    e.currentTarget.style.color = 'var(--text-primary)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = 'transparent';
                                                    e.currentTarget.style.color = 'var(--text-muted)';
                                                }}
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                onClick={(e) => e.stopPropagation()}
                                                style={{
                                                    padding: '0.5rem',
                                                    borderRadius: '6px',
                                                    background: 'transparent',
                                                    border: 'none',
                                                    color: 'var(--text-muted)',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = 'var(--bg-tertiary)';
                                                    e.currentTarget.style.color = 'var(--text-primary)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = 'transparent';
                                                    e.currentTarget.style.color = 'var(--text-muted)';
                                                }}
                                            >
                                                <MoreVertical size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredBookings.length === 0 && (
                    <div style={{
                        textAlign: 'center',
                        padding: '3rem',
                        color: 'var(--text-muted)'
                    }}>
                        <AlertCircle size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                        <p style={{ fontSize: '1rem', fontWeight: '500' }}>No bookings found</p>
                        <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Try adjusting your filters</p>
                    </div>
                )}
            </div>

            {/* Add animation for spin */}
            <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
        </div>
    );
};

// Separate component for animated stat card
const StatCardAnimated = ({ stat, Icon, isPositive, index }) => {
    const navigate = useNavigate();
    const [count, setCount] = useState(0);

    useEffect(() => {
        const endValue = typeof stat.value === 'string' ? parseFloat(stat.value.replace(/[^0-9.]/g, '')) : stat.value;
        const startTime = Date.now();
        const duration = 1500 + (index * 200); // Stagger animation

        const timer = setInterval(() => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);
            const current = progress * endValue;
            setCount(current);

            if (progress === 1) {
                clearInterval(timer);
            }
        }, 16);

        return () => clearInterval(timer);
    }, [stat.value, index]);

    const formatValue = (val) => {
        if (stat.label === 'Total Sales') {
            return `$${Math.floor(val).toLocaleString()}`;
        } else if (stat.label === 'Avg Rating') {
            return val.toFixed(1);
        }
        return Math.floor(val);
    };

    return (
        <div
            className="card"
            style={{
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                animationDelay: `${index * 0.1}s`
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                        {stat.label}
                    </p>
                    <h2 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                        {formatValue(count)}
                    </h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {isPositive ? (
                            <TrendingUp size={16} style={{ color: 'var(--success)' }} />
                        ) : (
                            <TrendingDown size={16} style={{ color: 'var(--danger)' }} />
                        )}
                        <span style={{
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            color: isPositive ? 'var(--success)' : 'var(--danger)'
                        }}>
                            {stat.change}
                        </span>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                            vs last month
                        </span>
                    </div>
                </div>
                <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 16px rgba(99, 102, 241, 0.3)'
                }}>
                    <Icon size={28} style={{ color: 'white' }} />
                </div>
            </div>

            {/* Progress bar */}
            <div style={{
                marginTop: '1rem',
                height: '4px',
                background: 'var(--bg-tertiary)',
                borderRadius: '2px',
                overflow: 'hidden'
            }}>
                <div style={{
                    height: '100%',
                    width: isPositive ? '75%' : '45%',
                    background: 'linear-gradient(90deg, var(--primary), var(--primary-light))',
                    borderRadius: '2px',
                    transition: 'width 1s ease-out'
                }} />
            </div>
        </div>
    );
};

export default Dashboard;
