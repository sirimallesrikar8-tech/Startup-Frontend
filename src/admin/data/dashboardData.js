// Recent Activity Data - Backend-friendly schema
export const recentActivity = [
    {
        id: 'act_001',
        type: 'booking',
        title: 'New booking created',
        description: 'Corporate Gala by Tech Corp',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 min ago
        relatedId: 'booking_123',
        route: '/admin/bookings'
    },
    {
        id: 'act_002',
        type: 'payment',
        title: 'Payment received',
        description: '$12,500 for Wedding Ceremony',
        timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 min ago
        relatedId: 'payment_456',
        route: '/admin/payments'
    },
    {
        id: 'act_003',
        type: 'vendor',
        title: 'Vendor registered',
        description: 'Elite Catering Services',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        relatedId: 'vendor_789',
        route: '/admin/vendors'
    },
    {
        id: 'act_004',
        type: 'booking',
        title: 'Booking confirmed',
        description: 'Birthday Party by Sarah Johnson',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        relatedId: 'booking_234',
        route: '/admin/bookings'
    },
    {
        id: 'act_005',
        type: 'user',
        title: 'New user registered',
        description: 'Michael Chen',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        relatedId: 'user_567',
        route: '/admin/users'
    },
    {
        id: 'act_006',
        type: 'payment',
        title: 'Payment pending',
        description: '$8,200 for Conference Event',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        relatedId: 'payment_890',
        route: '/admin/payments'
    },
    {
        id: 'act_007',
        type: 'booking',
        title: 'Booking cancelled',
        description: 'Product Launch by StartupXYZ',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
        relatedId: 'booking_345',
        route: '/admin/bookings'
    },
    {
        id: 'act_008',
        type: 'vendor',
        title: 'Vendor updated profile',
        description: 'Luxury Decor Studio',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        relatedId: 'vendor_678',
        route: '/admin/vendors'
    }
];

// Helper function to format relative time
export const getRelativeTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
};

// Dashboard Stats - Updated structure
export const dashboardStats = {
    totalSales: {
        label: 'Total Sales',
        value: '$124,500',
        change: '+12.5%',
        trend: 'up',
        icon: 'DollarSign'
    },
    bookings: {
        label: 'Bookings',
        value: '48',
        change: '+8.2%',
        trend: 'up',
        icon: 'Calendar'
    },
    pendingRequests: {
        label: 'Pending Requests',
        value: '12',
        change: '+4',
        trend: 'up',
        icon: 'AlertCircle'
    },
    avgRating: {
        label: 'Avg Rating',
        value: '4.8',
        change: '+0.3',
        trend: 'up',
        icon: 'Star'
    }
};

export const recentBookings = [
    { id: 1, event: 'Corporate Gala', client: 'Tech Corp', date: 'Dec 28, 2024', status: 'confirmed', amount: '$12,500' },
    { id: 2, event: 'Wedding Ceremony', client: 'Sarah & John', date: 'Jan 5, 2025', status: 'confirmed', amount: '$18,000' },
    { id: 3, event: 'Birthday Party', client: 'Emma Wilson', date: 'Dec 22, 2024', status: 'pending', amount: '$3,200' },
    { id: 4, event: 'Product Launch', client: 'StartupXYZ', date: 'Jan 15, 2025', status: 'cancelled', amount: '$8,500' },
    { id: 5, event: 'Conference Event', client: 'Business Inc', date: 'Feb 1, 2025', status: 'confirmed', amount: '$22,000' }
];

export const revenueData = [
    { month: 'Jan', revenue: 45, bookings: 12 },
    { month: 'Feb', revenue: 52, bookings: 15 },
    { month: 'Mar', revenue: 48, bookings: 13 },
    { month: 'Apr', revenue: 61, bookings: 18 },
    { month: 'May', revenue: 55, bookings: 16 },
    { month: 'Jun', revenue: 67, bookings: 20 },
    { month: 'Jul', revenue: 72, bookings: 22 },
    { month: 'Aug', revenue: 69, bookings: 21 },
    { month: 'Sep', revenue: 78, bookings: 24 },
    { month: 'Oct', revenue: 85, bookings: 26 },
    { month: 'Nov', revenue: 92, bookings: 28 },
    { month: 'Dec', revenue: 98, bookings: 30 }
];

export const eventTypeDistribution = [
    { name: 'Corporate', value: 35, color: '#6366f1' },
    { name: 'Wedding', value: 28, color: '#ec4899' },
    { name: 'Birthday', value: 18, color: '#f59e0b' },
    { name: 'Conference', value: 12, color: '#10b981' },
    { name: 'Other', value: 7, color: '#8b5cf6' }
];
