import React, { useEffect, useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const Toast = ({ toast, onRemove }) => {
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        if (toast.duration > 0) {
            const interval = setInterval(() => {
                setProgress(prev => {
                    const newProgress = prev - (100 / (toast.duration / 50));
                    return newProgress < 0 ? 0 : newProgress;
                });
            }, 50);

            return () => clearInterval(interval);
        }
    }, [toast.duration]);

    const icons = {
        success: <CheckCircle size={20} />,
        error: <XCircle size={20} />,
        warning: <AlertTriangle size={20} />,
        info: <Info size={20} />
    };

    const colors = {
        success: { bg: 'rgba(16, 185, 129, 0.1)', border: 'var(--success)', text: 'var(--success)' },
        error: { bg: 'rgba(239, 68, 68, 0.1)', border: 'var(--danger)', text: 'var(--danger)' },
        warning: { bg: 'rgba(245, 158, 11, 0.1)', border: 'var(--warning)', text: 'var(--warning)' },
        info: { bg: 'rgba(59, 130, 246, 0.1)', border: 'var(--info)', text: 'var(--info)' }
    };

    const color = colors[toast.type] || colors.info;

    return (
        <div style={{
            background: 'var(--bg-card)',
            border: `1px solid ${color.border}`,
            borderRadius: 'var(--border-radius)',
            padding: '1rem',
            marginBottom: '0.75rem',
            minWidth: '300px',
            maxWidth: '400px',
            boxShadow: 'var(--shadow-lg)',
            animation: 'slideInRight 0.3s ease-out',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
                <div style={{ color: color.text, flexShrink: 0, marginTop: '0.125rem' }}>
                    {icons[toast.type]}
                </div>
                <div style={{ flex: 1, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                    {toast.message}
                </div>
                <button
                    onClick={() => onRemove(toast.id)}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        padding: '0.25rem',
                        cursor: 'pointer',
                        color: 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 'var(--border-radius-sm)',
                        transition: 'all var(--transition-base)',
                        flexShrink: 0
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'var(--text-primary)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--text-muted)';
                    }}
                >
                    <X size={16} />
                </button>
            </div>

            {toast.duration > 0 && (
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    height: '3px',
                    width: `${progress}%`,
                    background: color.border,
                    transition: 'width 50ms linear'
                }} />
            )}
        </div>
    );
};

const ToastContainer = () => {
    const { toasts, removeToast } = useToast();

    return (
        <div style={{
            position: 'fixed',
            top: '1rem',
            right: '1rem',
            zIndex: 9999
        }}>
            {toasts.map(toast => (
                <Toast key={toast.id} toast={toast} onRemove={removeToast} />
            ))}
        </div>
    );
};

export default ToastContainer;
