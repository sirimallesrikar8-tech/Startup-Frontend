import apiService, { clearTokenCache } from './apiService';
import { clearAuthState } from '../../utils/authValidator';

export const authService = {
    login: async (email, password) => {
        try {
            const response = await apiService.post('/auth/login', { email, password });
            return response;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    register: async (userData) => {
        try {
            const response = await apiService.post('/auth/register', userData);
            return response;
        } catch (error) {
            console.error('Register error:', error);
            throw error;
        }
    },

    logout: () => {
        clearAuthState();
        clearTokenCache();
        window.location.href = '/';
    },

    isAuthenticated: () => !!localStorage.getItem('token'),

    getUserRole: () => localStorage.getItem('role')
};

export default authService;
