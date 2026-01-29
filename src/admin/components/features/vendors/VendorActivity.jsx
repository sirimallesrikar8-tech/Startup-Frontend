import React from 'react';
import { UserCheck, UserX, AlertCircle, Clock, ShieldCheck } from 'lucide-react';

const activities = [
    {
        id: 1,
        type: 'registration',
        vendor: 'Luxury Bloom Decor',
        time: '2 hours ago',
        status: 'pending',
        icon: Clock,
        color: '#f59e0b'
    },
    {
        id: 2,
        type: 'verification',
        vendor: 'SoundWave Solutions',
        time: '5 hours ago',
        status: 'verified',
        icon: ShieldCheck,
        color: '#10b981'
    },
    {
        id: 3,
        type: 'update',
        vendor: 'Gourmet Gala',
        time: 'Yesterday',
        status: 'updated',
        icon: AlertCircle,
        color: '#6366f1'
    },
    {
        id: 4,
        type: 'deactivation',
        vendor: 'Old School Vibe',
        time: '2 days ago',
        status: 'inactive',
        icon: UserX,
        color: '#ef4444'
    }
];

const VendorActivity = () => {
    return (
        <div
            className="animate-slide-in-up"
            style={{
                background: 'var(--bg-card)',
                borderRadius: '24px',
                padding: '2rem',
                border: '1px solid var(--border-color)',
                height: '400px',
                display: 'flex',
                flexDirection: 'column',
                animationDelay: '200ms'
            }}
        >
            <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>Recent Activity</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>Latest updates from your network</p>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }} className="custom-scrollbar">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {activities.map((activity, index) => {
                        const Icon = activity.icon;
                        return (
                            <div
                                key={activity.id}
                                style={{
                                    display: 'flex',
                                    gap: '1rem',
                                    padding: '1rem',
                                    borderRadius: '16px',
                                    background: 'rgba(255,255,255,0.02)',
                                    border: '1px solid var(--border-color)',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                                    e.currentTarget.style.transform = 'translateX(5px)';
                                    e.currentTarget.style.borderColor = activity.color + '44';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                                    e.currentTarget.style.transform = 'translateX(0)';
                                    e.currentTarget.style.borderColor = 'var(--border-color)';
                                }}
                            >
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '10px',
                                    background: activity.color + '15',
                                    color: activity.color,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    <Icon size={20} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)' }}>{activity.vendor}</h4>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{activity.time}</span>
                                    </div>
                                    <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                        Type: <span style={{ textTransform: 'capitalize', fontWeight: '600' }}>{activity.type}</span> • Status: <span style={{ color: activity.color, fontWeight: '700' }}>{activity.status}</span>
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <button style={{
                marginTop: '1.5rem',
                padding: '0.75rem',
                borderRadius: '12px',
                background: 'rgba(99, 102, 241, 0.1)',
                color: 'var(--primary-light)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                fontSize: '0.85rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s',
                width: '100%'
            }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)'}
            >
                View All History
            </button>
        </div>
    );
};

export default VendorActivity;
