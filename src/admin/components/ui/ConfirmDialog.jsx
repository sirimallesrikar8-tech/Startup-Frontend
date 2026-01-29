import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

/**
 * ConfirmDialog Component - Confirmation modal for destructive actions
 * Usage:
 * <ConfirmDialog
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   onConfirm={handleDelete}
 *   title="Delete User?"
 *   message="Are you sure you want to delete this user? This action cannot be undone."
 *   confirmText="Delete"
 *   variant="danger"
 * />
 */
const ConfirmDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'primary', // 'primary', 'danger', 'warning'
    isLoading = false
}) => {
    if (!isOpen) return null;

    const variantStyles = {
        primary: {
            button: {
                background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                color: 'white'
            },
            icon: { color: 'var(--primary)' }
        },
        danger: {
            button: {
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                color: 'white'
            },
            icon: { color: '#ef4444' }
        },
        warning: {
            button: {
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: 'white'
            },
            icon: { color: '#f59e0b' }
        }
    };

    const currentVariant = variantStyles[variant] || variantStyles.primary;

    const handleConfirm = () => {
        onConfirm();
        if (!isLoading) {
            onClose();
        }
    };

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 10000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem'
            }}
        >
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(4px)',
                    animation: 'fadeIn 0.2s ease-out'
                }}
            />

            {/* Dialog Content */}
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    position: 'relative',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    boxShadow: 'var(--shadow-xl)',
                    width: '100%',
                    maxWidth: '450px',
                    animation: 'scaleIn 0.2s ease-out'
                }}
            >
                {/* Header with Icon */}
                <div style={{ padding: '1.5rem 1.5rem 1rem' }}>
                    <div
                        style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            background: variant === 'danger' ? 'rgba(239, 68, 68, 0.1)' : variant === 'warning' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '1rem'
                        }}
                    >
                        <AlertTriangle size={24} style={currentVariant.icon} />
                    </div>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)', margin: '0 0 0.5rem' }}>
                        {title}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5' }}>
                        {message}
                    </p>
                </div>

                {/* Actions */}
                <div
                    style={{
                        padding: '1rem 1.5rem 1.5rem',
                        display: 'flex',
                        gap: '0.75rem',
                        justifyContent: 'flex-end'
                    }}
                >
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="btn btn-secondary"
                        style={{
                            padding: '0.625rem 1.25rem',
                            fontSize: '0.875rem'
                        }}
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isLoading}
                        style={{
                            ...currentVariant.button,
                            padding: '0.625rem 1.25rem',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: 'var(--shadow-md)',
                            opacity: isLoading ? 0.7 : 1
                        }}
                        onMouseEnter={(e) => {
                            if (!isLoading) {
                                e.currentTarget.style.transform = 'translateY(-1px)';
                                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                        }}
                    >
                        {isLoading ? 'Processing...' : confirmText}
                    </button>
                </div>
            </div>

            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
        </div>
    );
};

export default ConfirmDialog;
