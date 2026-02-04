import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Users, CreditCard } from 'lucide-react';

const iconMap = {
    DollarSign,
    Calendar,
    Users,
    CreditCard
};

const routeMap = {
    'Total Revenue': '/payments',
    'Total Bookings': '/bookings',
    'Active Vendors': '/vendors',
    'Pending Payments': '/payments'
};

const StatCard = ({ stat }) => {
    const navigate = useNavigate();
    const Icon = iconMap[stat.icon] || DollarSign;
    const isPositive = stat.trend === 'up';
    const route = routeMap[stat.label];

    const handleClick = () => {
        if (route) {
            navigate(route);
        }
    };

    return (
        <div
            className="card animate-fade-in"
            onClick={handleClick}
            style={{
                cursor: route ? 'pointer' : 'default',
                transition: 'all var(--transition-base)'
            }}
            onMouseEnter={(e) => {
                if (route) {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
                }
            }}
            onMouseLeave={(e) => {
                if (route) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }
            }}
        >
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                        {stat.label}
                    </p>
                    <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                        {stat.value}
                    </h2>
                    <div className="flex items-center gap-2">
                        {isPositive ? (
                            <TrendingUp size={16} style={{ color: 'var(--success)' }} />
                        ) : (
                            <TrendingDown size={16} style={{ color: 'var(--danger)' }} />
                        )}
                        <span style={{
                            color: isPositive ? 'var(--success)' : 'var(--danger)',
                            fontSize: '0.875rem',
                            fontWeight: '600'
                        }}>
                            {stat.change}
                        </span>
                        <span className="text-muted" style={{ fontSize: '0.875rem' }}>
                            vs last month
                        </span>
                    </div>
                </div>
                <div style={{
                    width: '3.5rem',
                    height: '3.5rem',
                    borderRadius: 'var(--border-radius)',
                    background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-glow)'
                }}>
                    <Icon size={24} style={{ color: 'white' }} />
                </div>
            </div>
            {route && (
                <div style={{
                    marginTop: '1rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid var(--border-color)',
                    fontSize: '0.75rem',
                    color: 'var(--primary-light)',
                    fontWeight: '600',
                    textAlign: 'center'
                }}>
                    Click to view details →
                </div>
            )}
        </div>
    );
};

export default StatCard;
