import React, { useState } from 'react';
import { LogOut } from 'lucide-react';
import Modal from '../ui/Modal';
import { useToast } from '../../context/ToastContext';
import authService from '../../services/authService';

const LogoutButton = () => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { success } = useToast();

    const handleLogout = async () => {
        setIsLoading(true);

        try {
            // Show success message
            success('Logged out successfully!');

            // Small delay for UX
            await new Promise(resolve => setTimeout(resolve, 100));

            // Clear auth state and redirect to homepage
            authService.logout();
        } catch (error) {
            console.error('Logout error:', error);
            authService.logout();
        }
    };

    return (
        <>
            <button
                className="btn btn-danger"
                onClick={() => setShowConfirm(true)}
                style={{ width: '100%' }}
            >
                <LogOut size={18} />
                Logout
            </button>

            <Modal
                isOpen={showConfirm}
                onClose={() => !isLoading && setShowConfirm(false)}
                title="Confirm Logout"
                size="small"
            >
                <div>
                    <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                        Are you sure you want to logout? You will need to login again to access the dashboard.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <button
                            className="btn btn-secondary"
                            onClick={() => setShowConfirm(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            className="btn btn-danger"
                            onClick={handleLogout}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Logging out...' : 'Logout'}
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default LogoutButton;
