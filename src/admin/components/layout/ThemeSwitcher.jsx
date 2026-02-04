import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Palette, Check } from 'lucide-react';

const ThemeSwitcher = () => {
    const { currentTheme, switchTheme, themes } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const themeOptions = [
        { key: 'dark', label: 'Dark', icon: '🌙' },
        { key: 'light', label: 'Light', icon: '☀️' },
        { key: 'cloud', label: 'Cloud', icon: '☁️' }
    ];

    return (
        <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="btn btn-secondary"
                style={{ padding: '0.5rem' }}
                title="Switch Theme"
            >
                <Palette size={20} />
            </button>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 0.5rem)',
                    right: 0,
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--border-radius)',
                    boxShadow: 'var(--shadow-lg)',
                    minWidth: '200px',
                    zIndex: 1000,
                    animation: 'slideDown 0.2s ease-out'
                }}>
                    <div style={{ padding: '0.5rem' }}>
                        <div style={{
                            padding: '0.5rem 0.75rem',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: 'var(--text-muted)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            Select Theme
                        </div>
                        {themeOptions.map(option => (
                            <button
                                key={option.key}
                                onClick={() => {
                                    switchTheme(option.key);
                                    setIsOpen(false);
                                }}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    background: currentTheme === option.key ? 'var(--bg-hover)' : 'transparent',
                                    border: 'none',
                                    borderRadius: 'var(--border-radius-sm)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.875rem',
                                    transition: 'all var(--transition-base)',
                                    textAlign: 'left'
                                }}
                                onMouseEnter={(e) => {
                                    if (currentTheme !== option.key) {
                                        e.currentTarget.style.background = 'var(--bg-hover)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (currentTheme !== option.key) {
                                        e.currentTarget.style.background = 'transparent';
                                    }
                                }}
                            >
                                <span style={{ fontSize: '1.25rem' }}>{option.icon}</span>
                                <span style={{ flex: 1 }}>{option.label}</span>
                                {currentTheme === option.key && (
                                    <Check size={16} style={{ color: 'var(--primary)' }} />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ThemeSwitcher;
