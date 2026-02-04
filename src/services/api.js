// ===================================
// API SERVICE - READY FOR BACKEND INTEGRATION
// ===================================

import axios from 'axios';

// Base API URL - Change this to your backend URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Add auth token to all requests
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response?.status === 401) {
            // Unauthorized - clear token and redirect to login
            localStorage.removeItem('authToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// ===================================
// USER ENDPOINTS
// ===================================

export const userAPI = {
    // Get user profile
    // GET /api/users/profile
    getProfile: async () => {
        return await apiClient.get('/users/profile');
    },

    // Update user profile
    // PUT /api/users/profile
    updateProfile: async (profileData) => {
        return await apiClient.put('/users/profile', profileData);
    },

    // Upload avatar
    // POST /api/users/avatar
    uploadAvatar: async (file) => {
        const formData = new FormData();
        formData.append('avatar', file);
        return await apiClient.post('/users/avatar', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    // Get user stats
    // GET /api/users/stats
    getStats: async () => {
        return await apiClient.get('/users/stats');
    },
};

// ===================================
// BOOKING ENDPOINTS
// ===================================

export const bookingAPI = {
    // Get all bookings for current user
    // GET /api/bookings?status=all&search=keyword
    getBookings: async (params = {}) => {
        return await apiClient.get('/bookings', { params });
    },

    // Get single booking by ID
    // GET /api/bookings/:id
    getBookingById: async (id) => {
        return await apiClient.get(`/bookings/${id}`);
    },

    // Create new booking
    // POST /api/bookings
    createBooking: async (bookingData) => {
        return await apiClient.post('/bookings', bookingData);
    },

    // Update booking
    // PUT /api/bookings/:id
    updateBooking: async (id, bookingData) => {
        return await apiClient.put(`/bookings/${id}`, bookingData);
    },

    // Cancel booking
    // DELETE /api/bookings/:id
    cancelBooking: async (id) => {
        return await apiClient.delete(`/bookings/${id}`);
    },
};

// ===================================
// VENDOR ENDPOINTS
// ===================================

export const vendorAPI = {
    // Get all vendors
    // GET /api/vendors?category=all&search=keyword
    getVendors: async (params = {}) => {
        return await apiClient.get('/vendors', { params });
    },

    // Get vendor by ID
    // GET /api/vendors/:id
    getVendorById: async (id) => {
        return await apiClient.get(`/vendors/${id}`);
    },

    // Get vendor services
    // GET /api/vendors/:id/services
    getVendorServices: async (id) => {
        return await apiClient.get(`/vendors/${id}/services`);
    },
};

// ===================================
// SERVICE ENDPOINTS
// ===================================

export const serviceAPI = {
    // Get all services
    // GET /api/services?category=all
    getServices: async (params = {}) => {
        return await apiClient.get('/services', { params });
    },

    // Get service by ID
    // GET /api/services/:id
    getServiceById: async (id) => {
        return await apiClient.get(`/services/${id}`);
    },
};

// ===================================
// PAYMENT ENDPOINTS
// ===================================

export const paymentAPI = {
    // Create payment intent
    // POST /api/payments/create-intent
    createPaymentIntent: async (bookingId, amount) => {
        return await apiClient.post('/payments/create-intent', { bookingId, amount });
    },

    // Confirm payment
    // POST /api/payments/confirm
    confirmPayment: async (paymentId, paymentMethodId) => {
        return await apiClient.post('/payments/confirm', { paymentId, paymentMethodId });
    },

    // Get payment history
    // GET /api/payments/history
    getPaymentHistory: async () => {
        return await apiClient.get('/payments/history');
    },
};

// ===================================
// ADMIN ENDPOINTS
// ===================================

export const adminAPI = {
    // Dashboard stats
    // GET /api/admin/stats
    getDashboardStats: async () => {
        return await apiClient.get('/admin/stats');
    },

    // Get all users
    // GET /api/admin/users
    getUsers: async (params = {}) => {
        return await apiClient.get('/admin/users', { params });
    },

    // Get all bookings (admin view)
    // GET /api/admin/bookings
    getAllBookings: async (params = {}) => {
        return await apiClient.get('/admin/bookings', { params });
    },

    // Update booking status
    // PUT /api/admin/bookings/:id/status
    updateBookingStatus: async (id, status) => {
        return await apiClient.put(`/admin/bookings/${id}/status`, { status });
    },

    // Vendor management
    // GET /api/admin/vendors
    getAllVendors: async (params = {}) => {
        return await apiClient.get('/admin/vendors', { params });
    },

    // Approve vendor
    // PUT /api/admin/vendors/:id/approve
    approveVendor: async (id) => {
        return await apiClient.put(`/admin/vendors/${id}/approve`);
    },

    // Revenue analytics
    // GET /api/admin/analytics/revenue
    getRevenueAnalytics: async (params = {}) => {
        return await apiClient.get('/admin/analytics/revenue', { params });
    },
};

// ===================================
// AUTHENTICATION ENDPOINTS
// ===================================

export const authAPI = {
    // Login
    // POST /api/auth/login
    login: async (email, password) => {
        const response = await apiClient.post('/auth/login', { email, password });
        if (response.token) {
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
        }
        return response;
    },

    // Signup
    // POST /api/auth/signup
    signup: async (userData) => {
        const response = await apiClient.post('/auth/signup', userData);
        if (response.token) {
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
        }
        return response;
    },

    // Logout
    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
    },

    // Verify token
    // GET /api/auth/verify
    verifyToken: async () => {
        return await apiClient.get('/auth/verify');
    },
};

// ===================================
// NOTIFICATION ENDPOINTS
// ===================================

export const notificationAPI = {
    // Get notifications
    // GET /api/notifications
    getNotifications: async () => {
        return await apiClient.get('/notifications');
    },

    // Mark as read
    // PUT /api/notifications/:id/read
    markAsRead: async (id) => {
        return await apiClient.put(`/notifications/${id}/read`);
    },

    // Mark all as read
    // PUT /api/notifications/read-all
    markAllAsRead: async () => {
        return await apiClient.put('/notifications/read-all');
    },
};

// Export default API object
export default {
    user: userAPI,
    booking: bookingAPI,
    vendor: vendorAPI,
    service: serviceAPI,
    payment: paymentAPI,
    admin: adminAPI,
    auth: authAPI,
    notification: notificationAPI,
};
