import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';

/**
 * ActionMenu Component - Dropdown menu for row actions
 * Usage:
 * <ActionMenu
 *   actions={[
 *     { label: 'Edit', icon: Edit, onClick: handleEdit },
 *     { label: 'Delete', icon: Trash, onClick: handleDelete, danger: true }
 *   ]}
 * />
 */
const ActionMenu = ({ actions, icon: Icon = MoreVertical, buttonStyle = {} }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // Close on ESC key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen]);

    const handleActionClick = (action) => {
        action.onClick();
        setIsOpen(false);
    };

    return (
        <div ref={menuRef} style={{ position: 'relative', display: 'inline-block' }}>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                style={{
                    padding: '0.5rem',
                    borderRadius: '6px',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    ...buttonStyle
                }}
                onMouseEnter={(e) => {
                    if (!isOpen) {
                        e.currentTarget.style.background = 'var(--bg-tertiary)';
                        e.currentTarget.style.color = 'var(--text-primary)';
                    }
                }}
                onMouseLeave={(e) => {
                    if (!isOpen) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'var(--text-muted)';
                    }
                }}
            >
                <Icon size={16} />
            </button>

            {isOpen && (
                <div
                    style={{
                        position: 'absolute',
                        right: 0,
                        top: '100%',
                        marginTop: '0.25rem',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        boxShadow: 'var(--shadow-xl)',
                        minWidth: '160px',
                        zIndex: 1000,
                        animation: 'dropdownSlide 0.2s ease-out',
                        overflow: 'hidden'
                    }}
                >
                    {actions.map((action, index) => {
                        const ActionIcon = action.icon;
                        return (
                            <button
                                key={index}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleActionClick(action);
                                }}
                                disabled={action.disabled}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    background: 'transparent',
                                    border: 'none',
                                    borderBottom: index < actions.length - 1 ? '1px solid var(--border-color)' : 'none',
                                    color: action.danger ? 'var(--danger)' : 'var(--text-primary)',
                                    fontSize: '0.875rem',
                                    cursor: action.disabled ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    textAlign: 'left',
                                    transition: 'background 0.2s',
                                    opacity: action.disabled ? 0.5 : 1
                                }}
                                onMouseEnter={(e) => {
                                    if (!action.disabled) {
                                        e.currentTarget.style.background = action.danger ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-hover)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                }}
                            >
                                {ActionIcon && <ActionIcon size={16} />}
                                <span>{action.label}</span>
                            </button>
                        );
                    })}
                </div>
            )}

            <style>{`
        @keyframes dropdownSlide {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
        </div>
    );
};

export default ActionMenu;
