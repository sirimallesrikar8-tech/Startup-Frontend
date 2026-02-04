import React, { useState, useEffect } from 'react';
import {
    DollarSign, CreditCard, TrendingUp, Download, Search, X, ChevronDown,
    Eye, Mail, CheckCircle, XCircle
} from 'lucide-react';
import { paymentsData } from '../data/paymentsData';
// Components
import ActionMenu from '../components/ui/ActionMenu';
import Modal from '../components/ui/Modal';
// Hooks & Services
import { useToast } from '../context/ToastContext';

const escapeCSV = (val) => {
    if (val === null || val === undefined) return '';
    let result = val.toString();
    if (['=', '+', '-', '@'].includes(result[0])) result = "'" + result;
    if (result.includes(',') || result.includes('"') || result.includes('\n')) {
        result = `"${result.replace(/"/g, '""')}"`;
    }
    return result;
};

const Payments = () => {
    const { success } = useToast();
    const [payments, setPayments] = useState(paymentsData);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    const filteredPayments = React.useMemo(() => {
        let filtered = [...payments];
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(p =>
                p.clientName.toLowerCase().includes(query) ||
                p.bookingId.toLowerCase().includes(query)
            );
        }
        if (statusFilter !== 'all') {
            filtered = filtered.filter(p => p.status === statusFilter);
        }
        return filtered;
    }, [searchQuery, statusFilter, payments]);

    const stats = React.useMemo(() => ({
        total: payments.reduce((sum, p) => sum + parseFloat(p.amount.replace(/[^0-9.]/g, '')), 0),
        completed: payments.filter(p => p.status === 'completed').length,
        pending: payments.filter(p => p.status === 'pending').length,
        refunded: payments.filter(p => p.status === 'refunded').length
    }), [payments]);

    const exportToCSV = () => {
        const headers = ['Booking ID', 'Client', 'Amount', 'Method', 'Date', 'Status'];
        const rows = filteredPayments.map(p => [
            p.bookingId, p.clientName, p.amount, p.method, p.date, p.status
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(escapeCSV).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `payments-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        success('Payments exported successfully!');
    };

    return (
        <div className="animate-fade-in">

            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                    Payments & Transactions
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    Monitor and manage all payment transactions
                </p>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                {[
                    { icon: DollarSign, value: `$${stats.total.toLocaleString()}`, label: 'Total Revenue', color: 'var(--primary)' },
                    { icon: CheckCircle, value: stats.completed, label: 'Completed', color: '#10b981' },
                    { icon: CreditCard, value: stats.pending, label: 'Pending', color: '#f59e0b' },
                    { icon: XCircle, value: stats.refunded, label: 'Refunded', color: '#ef4444' }
                ].map((stat, i) => (
                    <div key={i} className="card" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{
                                width: '48px', height: '48px', borderRadius: '12px',
                                background: `linear-gradient(135deg, ${stat.color}, ${stat.color}dd)`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <stat.icon size={24} style={{ color: 'white' }} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.75rem', fontWeight: '700', margin: 0 }}>{stat.value}</h3>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>{stat.label}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', flex: 1 }}>
                        <div style={{ position: 'relative' }}>
                            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', width: '18px', height: '18px' }} />
                            <input type="text" placeholder="Search payments..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ width: '280px', padding: '8px 12px 8px 40px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.875rem', outline: 'none' }}
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                        <div style={{ position: 'relative' }}>
                            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                                style={{ padding: '8px 32px 8px 12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.875rem', cursor: 'pointer', outline: 'none', appearance: 'none' }}
                            >
                                <option value="all">All Status</option>
                                <option value="completed">Completed</option>
                                <option value="pending">Pending</option>
                                <option value="refunded">Refunded</option>
                            </select>
                            <ChevronDown size={16} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                        </div>
                    </div>
                    <button onClick={exportToCSV} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Download size={16} />
                        Export CSV
                    </button>
                </div>

                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    Showing {filteredPayments.length} of {payments.length} payments
                </p>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                {['Booking ID', 'Client', 'Amount', 'Method', 'Date', 'Status', 'Action'].map(h => (
                                    <th key={h} style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPayments.map((payment, idx) => (
                                <tr
                                    key={payment.id}
                                    style={{
                                        borderBottom: idx < filteredPayments.length - 1 ? '1px solid var(--border-color)' : 'none',
                                        cursor: 'pointer', transition: 'background 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                    onClick={() => { setSelectedPayment(payment); setIsViewModalOpen(true); }}
                                >
                                    <td style={{ padding: '1rem', fontFamily: 'monospace', fontWeight: '600', color: 'var(--primary-light)' }}>
                                        {payment.bookingId}
                                    </td>
                                    <td style={{ padding: '1rem', fontSize: '0.875rem' }}>{payment.clientName}</td>
                                    <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: '700', color: 'var(--success)' }}>
                                        {payment.amount}
                                    </td>
                                    <td style={{ padding: '1rem', fontSize: '0.875rem' }}>{payment.method}</td>
                                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>{payment.date}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            background: payment.status === 'completed' ? '#d1fae5' : payment.status === 'pending' ? '#fef3c7' : '#fee2e2',
                                            color: payment.status === 'completed' ? '#065f46' : payment.status === 'pending' ? '#92400e' : '#991b1b',
                                            border: `1px solid ${payment.status === 'completed' ? '#10b981' : payment.status === 'pending' ? '#f59e0b' : '#ef4444'}`,
                                            padding: '0.375rem 0.75rem', borderRadius: '9999px',
                                            fontSize: '0.75rem', fontWeight: '600', textTransform: 'capitalize'
                                        }}>
                                            {payment.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                                        <ActionMenu
                                            actions={[
                                                { label: 'View Details', icon: Eye, onClick: () => { setSelectedPayment(payment); setIsViewModalOpen(true); } },
                                                { label: 'Send Receipt', icon: Mail, onClick: () => success('Receipt sent!') },
                                                { label: 'Mark as Paid', icon: CheckCircle, onClick: () => success('Marked as paid!'), disabled: payment.status === 'completed' },
                                                { label: 'Refund', icon: XCircle, onClick: () => success('Refund processed'), danger: true, disabled: payment.status === 'refunded' }
                                            ]}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* View Modal */}
            <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Payment Details" size="md">
                {selectedPayment && (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {[
                            ['Booking ID', selectedPayment.bookingId],
                            ['Client Name', selectedPayment.clientName],
                            ['Amount', selectedPayment.amount],
                            ['Payment Method', selectedPayment.method],
                            ['Date', selectedPayment.date],
                            ['Status', selectedPayment.status]
                        ].map(([label, value], i) => (
                            <div key={i}>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{label}</p>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: label === 'Amount' ? '700' : 'normal' }}>{value}</p>
                            </div>
                        ))}
                    </div>
                )}
            </Modal>

            <style>{`@keyframes slideInRight { from { opacity: 0; transform: translateX(100%); } to { opacity: 1; transform: translateX(0); } }`}</style>
        </div>
    );
};

export default Payments;
