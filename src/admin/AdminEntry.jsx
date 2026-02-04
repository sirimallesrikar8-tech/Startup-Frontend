import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import ToastContainer from './components/ui/Toast';
import './admin-reset.css'; // Restore Tailwind-like resets for Admin

const AdminEntry = () => {
    return (
        <ThemeProvider>
            <ToastProvider>
                {/* Scoped container for Admin CSS isolation */}
                <div id="admin-scope" className="min-h-screen bg-background text-foreground font-sans">
                    <AppRoutes />
                    <ToastContainer />
                </div>
            </ToastProvider>
        </ThemeProvider>
    );
};

export default AdminEntry;
