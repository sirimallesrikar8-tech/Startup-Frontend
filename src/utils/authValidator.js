// Auth state validator - ensures localStorage has complete and valid auth data
const AUTH_KEYS = ['userId', 'userName', 'userEmail', 'role', 'token'];

// Validates JWT format (header.payload.signature)
const isValidJWTFormat = (token) => {
    if (!token || typeof token !== 'string') return false;
    const parts = token.split('.');
    return parts.length === 3;
};

// Validates all required auth fields exist and JWT format is correct
export const validateAuthState = () => {
    try {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        const userName = localStorage.getItem('userName');
        const userEmail = localStorage.getItem('userEmail');

        if (!userId || !token || !role || !userName || !userEmail) {
            return false;
        }

        if (!isValidJWTFormat(token)) {
            return false;
        }

        return true;
    } catch (error) {
        console.error('Auth validation error:', error);
        return false;
    }
};

// Clears all auth data from localStorage
export const clearAuthState = () => {
    AUTH_KEYS.forEach(key => localStorage.removeItem(key));
    // Also clear any pending redirects to prevent stale booking redirects
    localStorage.removeItem('redirectAfterLogin');
};

// Main function - validates auth state and auto-clears if invalid
export const ensureValidAuthState = () => {
    const isValid = validateAuthState();
    if (!isValid) {
        clearAuthState();
    }
    return isValid;
};

export default {
    validateAuthState,
    clearAuthState,
    ensureValidAuthState
};
