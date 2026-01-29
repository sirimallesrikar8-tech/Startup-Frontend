// Vendor Service - Mock data for vendor panel functionality

// Mock vendor bookings data
const MOCK_BOOKINGS = [
    {
        bookingId: 'BK001',
        userName: 'Rahul Sharma',
        userEmail: 'rahul@email.com',
        userPhone: '+91 98765 43210',
        slotDate: '2026-01-20',
        slotStartTime: '10:00 AM',
        slotEndTime: '02:00 PM',
        bookingTime: '2026-01-15T14:30:00',
        slotId: 1,
        vendorName: 'Grand Plaza Hall',
        status: 'PENDING',
        amount: 25000,
        eventType: 'Wedding Reception'
    },
    {
        bookingId: 'BK002',
        userName: 'Priya Patel',
        userEmail: 'priya@email.com',
        userPhone: '+91 87654 32109',
        slotDate: '2026-01-22',
        slotStartTime: '06:00 PM',
        slotEndTime: '10:00 PM',
        bookingTime: '2026-01-14T10:15:00',
        slotId: 2,
        vendorName: 'Grand Plaza Hall',
        status: 'ACCEPTED',
        amount: 35000,
        eventType: 'Birthday Party'
    },
    {
        bookingId: 'BK003',
        userName: 'Amit Kumar',
        userEmail: 'amit@email.com',
        userPhone: '+91 76543 21098',
        slotDate: '2026-01-18',
        slotStartTime: '02:00 PM',
        slotEndTime: '06:00 PM',
        bookingTime: '2026-01-10T09:00:00',
        slotId: 3,
        vendorName: 'Grand Plaza Hall',
        status: 'COMPLETED',
        amount: 20000,
        eventType: 'Corporate Event'
    },
    {
        bookingId: 'BK004',
        userName: 'Sneha Reddy',
        userEmail: 'sneha@email.com',
        userPhone: '+91 65432 10987',
        slotDate: '2026-01-25',
        slotStartTime: '10:00 AM',
        slotEndTime: '06:00 PM',
        bookingTime: '2026-01-16T16:45:00',
        slotId: 4,
        vendorName: 'Grand Plaza Hall',
        status: 'PENDING',
        amount: 45000,
        eventType: 'Engagement Ceremony'
    },
    {
        bookingId: 'BK005',
        userName: 'Vikram Singh',
        userEmail: 'vikram@email.com',
        userPhone: '+91 54321 09876',
        slotDate: '2026-01-12',
        slotStartTime: '04:00 PM',
        slotEndTime: '09:00 PM',
        bookingTime: '2026-01-05T11:30:00',
        slotId: 5,
        vendorName: 'Grand Plaza Hall',
        status: 'CANCELLED',
        amount: 30000,
        eventType: 'Anniversary'
    }
];

// Mock payments data
const MOCK_PAYMENTS = [
    {
        paymentId: 'PAY001',
        bookingId: 'BK003',
        userName: 'Amit Kumar',
        amount: 20000,
        platformFee: 2000,
        netAmount: 18000,
        status: 'COMPLETED',
        paymentDate: '2026-01-18T18:30:00',
        paymentMethod: 'UPI'
    },
    {
        paymentId: 'PAY002',
        bookingId: 'BK002',
        userName: 'Priya Patel',
        amount: 35000,
        platformFee: 3500,
        netAmount: 31500,
        status: 'PENDING',
        paymentDate: null,
        paymentMethod: 'Card'
    },
    {
        paymentId: 'PAY003',
        bookingId: 'BK006',
        userName: 'Neha Gupta',
        amount: 28000,
        platformFee: 2800,
        netAmount: 25200,
        status: 'COMPLETED',
        paymentDate: '2026-01-10T14:00:00',
        paymentMethod: 'Net Banking'
    }
];

// Calendar events (blocked dates and booked dates)
const MOCK_CALENDAR_EVENTS = [
    { date: '2026-01-20', type: 'booked', title: 'Wedding Reception', customer: 'Rahul Sharma' },
    { date: '2026-01-22', type: 'booked', title: 'Birthday Party', customer: 'Priya Patel' },
    { date: '2026-01-25', type: 'booked', title: 'Engagement Ceremony', customer: 'Sneha Reddy' },
    { date: '2026-01-28', type: 'blocked', title: 'Maintenance' },
    { date: '2026-01-30', type: 'blocked', title: 'Personal' },
    { date: '2026-02-05', type: 'booked', title: 'Corporate Event', customer: 'Tech Corp' },
    { date: '2026-02-14', type: 'booked', title: 'Valentine Special', customer: 'Rohan & Neha' }
];

class VendorService {
    constructor() {
        this.bookings = [...MOCK_BOOKINGS];
        this.payments = [...MOCK_PAYMENTS];
        this.calendarEvents = [...MOCK_CALENDAR_EVENTS];
        this.blockedDates = ['2026-01-28', '2026-01-30'];

        // Load any saved data from localStorage
        this.loadFromStorage();
    }

    loadFromStorage() {
        const savedBookings = localStorage.getItem('vendorBookings');
        if (savedBookings) {
            this.bookings = JSON.parse(savedBookings);
        }
        const savedBlocked = localStorage.getItem('vendorBlockedDates');
        if (savedBlocked) {
            this.blockedDates = JSON.parse(savedBlocked);
        }
    }

    saveToStorage() {
        localStorage.setItem('vendorBookings', JSON.stringify(this.bookings));
        localStorage.setItem('vendorBlockedDates', JSON.stringify(this.blockedDates));
    }

    // Dashboard Stats
    getDashboardStats() {
        const pending = this.bookings.filter(b => b.status === 'PENDING').length;
        const accepted = this.bookings.filter(b => b.status === 'ACCEPTED').length;
        const completed = this.bookings.filter(b => b.status === 'COMPLETED').length;
        const totalRevenue = this.bookings
            .filter(b => b.status === 'COMPLETED')
            .reduce((sum, b) => sum + b.amount, 0);
        const pendingRevenue = this.bookings
            .filter(b => ['PENDING', 'ACCEPTED'].includes(b.status))
            .reduce((sum, b) => sum + b.amount, 0);

        return {
            totalBookings: this.bookings.length,
            pendingBookings: pending,
            acceptedBookings: accepted,
            completedBookings: completed,
            cancelledBookings: this.bookings.filter(b => b.status === 'CANCELLED').length,
            totalRevenue,
            pendingRevenue,
            thisMonthBookings: this.bookings.filter(b => {
                const date = new Date(b.slotDate);
                const now = new Date();
                return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
            }).length,
            averageRating: 4.7,
            totalReviews: 156
        };
    }

    // Get recent bookings for dashboard
    getRecentBookings(limit = 5) {
        return [...this.bookings]
            .sort((a, b) => new Date(b.bookingTime) - new Date(a.bookingTime))
            .slice(0, limit);
    }

    // Bookings
    getAllBookings() {
        return [...this.bookings].sort((a, b) =>
            new Date(b.bookingTime) - new Date(a.bookingTime)
        );
    }

    getBookingsByStatus(status) {
        if (status === 'ALL') return this.getAllBookings();
        return this.bookings.filter(b => b.status === status);
    }

    updateBookingStatus(bookingId, newStatus) {
        const booking = this.bookings.find(b => b.bookingId === bookingId);
        if (booking) {
            booking.status = newStatus;
            this.saveToStorage();

            // Update pending count in localStorage
            const pendingCount = this.bookings.filter(b => b.status === 'PENDING').length;
            localStorage.setItem('pendingBookings', pendingCount);

            return { success: true, booking };
        }
        return { success: false, error: 'Booking not found' };
    }

    // Payments
    getAllPayments() {
        return [...this.payments].sort((a, b) =>
            new Date(b.paymentDate || 0) - new Date(a.paymentDate || 0)
        );
    }

    getPaymentStats() {
        const completed = this.payments.filter(p => p.status === 'COMPLETED');
        const pending = this.payments.filter(p => p.status === 'PENDING');

        return {
            totalEarnings: completed.reduce((sum, p) => sum + p.netAmount, 0),
            pendingPayouts: pending.reduce((sum, p) => sum + p.netAmount, 0),
            platformFees: this.payments.reduce((sum, p) => sum + p.platformFee, 0),
            completedTransactions: completed.length,
            pendingTransactions: pending.length
        };
    }

    // Calendar
    getCalendarEvents(month, year) {
        const events = [];

        // Add booked events from bookings
        this.bookings.forEach(booking => {
            if (booking.status !== 'CANCELLED' && booking.status !== 'REJECTED') {
                events.push({
                    date: booking.slotDate,
                    type: 'booked',
                    title: booking.eventType,
                    customer: booking.userName,
                    time: `${booking.slotStartTime} - ${booking.slotEndTime}`,
                    status: booking.status
                });
            }
        });

        // Add blocked dates
        this.blockedDates.forEach(date => {
            events.push({
                date,
                type: 'blocked',
                title: 'Blocked',
                customer: null
            });
        });

        return events;
    }

    blockDate(date, reason = 'Blocked') {
        if (!this.blockedDates.includes(date)) {
            this.blockedDates.push(date);
            this.saveToStorage();
            return { success: true };
        }
        return { success: false, error: 'Date already blocked' };
    }

    unblockDate(date) {
        const index = this.blockedDates.indexOf(date);
        if (index > -1) {
            this.blockedDates.splice(index, 1);
            this.saveToStorage();
            return { success: true };
        }
        return { success: false, error: 'Date not blocked' };
    }

    isDateBlocked(date) {
        return this.blockedDates.includes(date);
    }

    isDateBooked(date) {
        return this.bookings.some(b =>
            b.slotDate === date &&
            !['CANCELLED', 'REJECTED'].includes(b.status)
        );
    }

    // Vendor Profile
    getVendorProfile() {
        const saved = localStorage.getItem('vendorProfileData');
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            businessName: '',
            category: '',
            location: '',
            phone: '',
            email: '',
            gstNumber: '',
            panNumber: '',
            tanNumber: '',
            aadhaarNumber: ''
        };
    }

    saveVendorProfile(profileData) {
        localStorage.setItem('vendorProfileData', JSON.stringify(profileData));
        localStorage.setItem('vendorProfileCompleted', 'true');
        return { success: true };
    }

    // Chart data for dashboard
    getBookingChartData() {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        return months.map(month => ({
            month,
            bookings: Math.floor(Math.random() * 20) + 5,
            revenue: Math.floor(Math.random() * 100000) + 50000
        }));
    }

    getStatusDistribution() {
        return [
            { name: 'Completed', value: this.bookings.filter(b => b.status === 'COMPLETED').length, color: '#10B981' },
            { name: 'Accepted', value: this.bookings.filter(b => b.status === 'ACCEPTED').length, color: '#3B82F6' },
            { name: 'Pending', value: this.bookings.filter(b => b.status === 'PENDING').length, color: '#F59E0B' },
            { name: 'Cancelled', value: this.bookings.filter(b => b.status === 'CANCELLED').length, color: '#EF4444' }
        ].filter(item => item.value > 0);
    }
}

// Export singleton instance
const vendorService = new VendorService();
export default vendorService;
