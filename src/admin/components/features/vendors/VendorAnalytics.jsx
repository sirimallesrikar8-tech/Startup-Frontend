import React from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const data = [
    { month: 'Jan', registered: 12, growth: 2400 },
    { month: 'Feb', registered: 19, growth: 1398 },
    { month: 'Mar', registered: 15, growth: 9800 },
    { month: 'Apr', registered: 22, growth: 3908 },
    { month: 'May', registered: 30, growth: 4800 },
    { month: 'Jun', registered: 26, growth: 3800 },
    { month: 'Jul', registered: 35, growth: 4300 },
];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                background: 'var(--bg-card)',
                padding: '12px 16px',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                boxShadow: 'var(--shadow-xl)',
                backdropFilter: 'blur(10px)'
            }}>
                <p style={{ margin: '0 0 8px', fontWeight: '800', color: 'var(--text-primary)', fontSize: '0.85rem' }}>{label}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {payload.map((item, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }}></div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.name}:</span>
                            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'white' }}>{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

const VendorAnalytics = () => {
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
                animationDelay: '100ms'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>Registration Trends</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>Vendor growth over the last 7 months</p>
                </div>
                <select
                    className="custom-select-dark"
                    style={{
                        padding: '6px 12px',
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        color: 'var(--text-secondary)',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        outline: 'none'
                    }}
                >
                    <option>Last 7 Months</option>
                    <option>Last Year</option>
                </select>
            </div>

            <div style={{ height: '300px', width: '100%', minHeight: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorRegistered" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                            dy={15}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--primary)', strokeWidth: 1 }} />
                        <Area
                            type="monotone"
                            dataKey="registered"
                            name="New Vendors"
                            stroke="var(--primary)"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorRegistered)"
                            animationDuration={2000}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default VendorAnalytics;
