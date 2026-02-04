import React from 'react';
import { Store, CheckCircle, Clock, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, gradient, trend, trendValue, delay }) => (
    <div
        className="animate-slide-in-up"
        style={{
            background: 'var(--bg-card)',
            borderRadius: '20px',
            padding: '1.50rem',
            border: '1px solid var(--border-color)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            animationDelay: delay,
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.borderColor = color + '66';
            e.currentTarget.style.boxShadow = `0 12px 24px -10px ${color}33`;
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'var(--border-color)';
            e.currentTarget.style.boxShadow = 'none';
        }}
    >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                background: gradient || `linear-gradient(135deg, ${color}, ${color}dd)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                boxShadow: `0 8px 16px -4px ${color}44`
            }}>
                <Icon size={26} />
            </div>
            {trend && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    background: trend === 'up' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: trend === 'up' ? '#10b981' : '#ef4444',
                    fontSize: '0.75rem',
                    fontWeight: '700'
                }}>
                    {trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {trendValue}
                </div>
            )}
        </div>

        <div>
            <h3 style={{ fontSize: '1.875rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
                {value}
            </h3>
            <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                {title}
            </p>
        </div>

        {/* Subtle Background Icon */}
        <Icon size={80} style={{
            position: 'absolute',
            right: '-10px',
            bottom: '-10px',
            opacity: 0.03,
            transform: 'rotate(-15deg)',
            pointerEvents: 'none'
        }} />
    </div>
);

const VendorStatCards = ({ stats }) => {
    return (
        <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.5rem',
            marginBottom: '2rem',
            width: '100%'
        }}>
            {[
                { title: "Total Vendors", value: stats.total, icon: Store, color: "#6366f1", gradient: "linear-gradient(135deg, #6366f1, #4f46e5)", trend: "up", trendValue: "+12%", delay: "0ms" },
                { title: "Active Partners", value: stats.active, icon: CheckCircle, color: "#10b981", gradient: "linear-gradient(135deg, #10b981, #059669)", trend: "up", trendValue: "+8%", delay: "100ms" },
                { title: "Pending Approval", value: stats.pending, icon: Clock, color: "#f59e0b", gradient: "linear-gradient(135deg, #f59e0b, #d97706)", trend: "down", trendValue: "-2%", delay: "200ms" },
                { title: "Annual Revenue", value: stats.revenue, icon: DollarSign, color: "#ec4899", gradient: "linear-gradient(135deg, #ec4899, #db2777)", trend: "up", trendValue: "+24%", delay: "300ms" }
            ].map((stat, i) => (
                <div key={i} style={{ flex: '1 1 240px' }}>
                    <StatCard {...stat} />
                </div>
            ))}
        </div>
    );
};

export default VendorStatCards;
