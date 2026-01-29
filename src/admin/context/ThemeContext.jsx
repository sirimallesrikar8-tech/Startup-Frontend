import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};

export const themes = {
    dark: {
        name: 'Dark',
        primary: '#6366F1',
        primaryDark: '#4F46E5',
        primaryLight: '#818CF8',
        secondary: '#8B5CF6',
        secondaryDark: '#7C3AED',
        accent: '#10B981',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        info: '#3B82F6',
        bgPrimary: '#0F172A',
        bgSecondary: '#1E293B',
        bgTertiary: '#334155',
        bgCard: '#1E293B',
        bgHover: 'rgba(99, 102, 241, 0.1)',
        textPrimary: '#F8FAFC',
        textSecondary: '#E2E8F0',
        textMuted: '#94A3B8',
        borderColor: '#334155'
    },
    light: {
        name: 'Light',
        primary: '#6366F1',
        primaryDark: '#4F46E5',
        primaryLight: '#818CF8',
        secondary: '#8B5CF6',
        secondaryDark: '#7C3AED',
        accent: '#10B981',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        info: '#3B82F6',
        bgPrimary: '#FFFFFF',
        bgSecondary: '#F8FAFC',
        bgTertiary: '#F1F5F9',
        bgCard: '#FFFFFF',
        bgHover: '#F1F5F9',
        textPrimary: '#0F172A',
        textSecondary: '#475569',
        textMuted: '#64748B',
        borderColor: '#E2E8F0'
    },
    cloud: {
        name: 'Cloud',
        primary: '#3B82F6',
        primaryDark: '#2563EB',
        primaryLight: '#60A5FA',
        secondary: '#06B6D4',
        secondaryDark: '#0891B2',
        accent: '#10B981',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        info: '#3B82F6',
        bgPrimary: '#F0F9FF',
        bgSecondary: '#E0F2FE',
        bgTertiary: '#BAE6FD',
        bgCard: '#FFFFFF',
        bgHover: '#E0F2FE',
        textPrimary: '#0C4A6E',
        textSecondary: '#075985',
        textMuted: '#0369A1',
        borderColor: '#BAE6FD'
    }
};

export const ThemeProvider = ({ children }) => {
    const [currentTheme, setCurrentTheme] = useState(() => {
        const saved = localStorage.getItem('eventpro-theme');
        return saved || 'dark';
    });

    useEffect(() => {
        const theme = themes[currentTheme];
        const root = document.documentElement;

        Object.keys(theme).forEach(key => {
            if (key !== 'name') {
                const cssVar = key.replace(/([A-Z])/g, '-$1').toLowerCase();
                root.style.setProperty(`--${cssVar}`, theme[key]);
            }
        });

        localStorage.setItem('eventpro-theme', currentTheme);
    }, [currentTheme]);

    const switchTheme = (themeName) => {
        setCurrentTheme(themeName);
    };

    return (
        <ThemeContext.Provider value={{ currentTheme, switchTheme, themes }}>
            {children}
        </ThemeContext.Provider>
    );
};
