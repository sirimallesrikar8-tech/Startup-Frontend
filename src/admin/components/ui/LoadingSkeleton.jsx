import React from 'react';

export const SkeletonCard = () => (
    <div className="card" style={{ animation: 'pulse 1.5s ease-in-out infinite' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div style={{ flex: 1 }}>
                <div style={{
                    height: '1rem',
                    width: '60%',
                    background: 'var(--bg-tertiary)',
                    borderRadius: '4px',
                    marginBottom: '1rem'
                }} />
                <div style={{
                    height: '2rem',
                    width: '40%',
                    background: 'var(--bg-tertiary)',
                    borderRadius: '4px',
                    marginBottom: '0.5rem'
                }} />
                <div style={{
                    height: '0.875rem',
                    width: '50%',
                    background: 'var(--bg-tertiary)',
                    borderRadius: '4px'
                }} />
            </div>
            <div style={{
                width: '3.5rem',
                height: '3.5rem',
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--border-radius)'
            }} />
        </div>
    </div>
);

export const SkeletonTable = ({ rows = 5 }) => (
    <div className="card">
        <div style={{
            height: '2.5rem',
            background: 'var(--bg-tertiary)',
            borderRadius: 'var(--border-radius-sm)',
            marginBottom: '1.5rem'
        }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} style={{
                    height: '3rem',
                    background: 'var(--bg-tertiary)',
                    borderRadius: 'var(--border-radius-sm)',
                    animation: `pulse 1.5s ease-in-out infinite ${i * 0.1}s`
                }} />
            ))}
        </div>
    </div>
);

export const SkeletonChart = () => (
    <div className="card">
        <div style={{
            height: '1.5rem',
            width: '40%',
            background: 'var(--bg-tertiary)',
            borderRadius: '4px',
            marginBottom: '1.5rem'
        }} />
        <div style={{
            height: '300px',
            background: 'var(--bg-tertiary)',
            borderRadius: 'var(--border-radius-sm)',
            animation: 'pulse 1.5s ease-in-out infinite'
        }} />
    </div>
);

const LoadingSkeleton = ({ type = 'card', ...props }) => {
    switch (type) {
        case 'card':
            return <SkeletonCard {...props} />;
        case 'table':
            return <SkeletonTable {...props} />;
        case 'chart':
            return <SkeletonChart {...props} />;
        default:
            return <SkeletonCard {...props} />;
    }
};

export default LoadingSkeleton;
