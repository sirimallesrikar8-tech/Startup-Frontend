import React, { useState, useEffect } from 'react';
import {
    Calendar, MapPin, Users as UsersIcon, DollarSign, Search, Download, Eye, Edit,
    Trash2, CheckCircle, XCircle, X, Mail, ChevronDown, Plus
} from 'lucide-react';
import { bookingsData } from '../data/bookingsData';
import Modal from '../components/ui/Modal';
import ActionMenu from '../components/ui/ActionMenu';
import ConfirmDialog from '../components/ui/ConfirmDialog';

// Hooks & Services
import { useToast } from '../context/ToastContext';

const escapeCSV = (val) => {
    if (val === null || val === undefined) return '';
    let result = val.toString();
    // Prevent CSV Formula Injection
    if (['=', '+', '-', '@'].includes(result[0])) {
        result = "'" + result;
    }
    // Escape quotes and wrap in quotes if contains comma or newline
    if (result.includes(',') || result.includes('"') || result.includes('\n')) {
        result = `"${result.replace(/"/g, '""')}"`;
    }
    return result;
};

const Bookings = () => {
    const { success, error: toastError } = useToast();
    const [bookings, setBookings] = useState(bookingsData);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');

    // Modal states
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
    const [bookingToCancel, setBookingToCancel] = useState(null);


    // Filter and sort bookings - Refactored to useMemo for performance
    const filteredBookings = React.useMemo(() => {
        let filtered = [...bookings];

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(booking =>
                booking.eventName.toLowerCase().includes(query) ||
                booking.client.toLowerCase().includes(query) ||
                booking.clientEmail.toLowerCase().includes(query)
            );
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(booking => booking.status === statusFilter);
        }

        // Sort - Fixed logic to handle equality and numeric strings
        if (sortColumn) {
            filtered.sort((a, b) => {
                let aVal = a[sortColumn];
                let bVal = b[sortColumn];

                if (sortColumn === 'totalAmount' || sortColumn === 'paidAmount') {
                    aVal = typeof aVal === 'string' ? parseFloat(aVal.replace(/[^0-9.]/g, '')) : aVal;
                    bVal = typeof bVal === 'string' ? parseFloat(bVal.replace(/[^0-9.]/g, '')) : bVal;
                }

                if (aVal === bVal) return 0;
                const modifier = sortDirection === 'asc' ? 1 : -1;
                return aVal > bVal ? modifier : -modifier;
            });
        }

        return filtered;
    }, [searchQuery, statusFilter, sortColumn, sortDirection, bookings]);

    // Export to CSV - Fixed with escaping and security protection
    const exportToCSV = () => {
        const headers = ['ID', 'Event Name', 'Client', 'Date', 'Venue', 'Type', 'Attendees', 'Amount', 'Status'];
        const rows = filteredBookings.map(b => [
            b.id, b.eventName, b.client, b.eventDate, b.venue, b.eventType, b.attendees, b.totalAmount, b.status
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(escapeCSV).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        success('Bookings exported successfully!');
    };

    // Open view modal
    const handleViewBooking = (booking) => {
        setSelectedBooking(booking);
        setIsViewModalOpen(true);
    };

    // Confirm booking
    const handleConfirmBooking = (booking) => {
        setBookings(bookings.map(b => b.id === booking.id ? { ...b, status: 'confirmed' } : b));
        success(`${booking.eventName} confirmed successfully!`);
    };

    // Cancel booking
    const handleCancelBooking = (booking) => {
        setBookingToCancel(booking);
        setIsCancelDialogOpen(true);
    };

    const confirmCancel = () => {
        setBookings(bookings.map(b => b.id === bookingToCancel.id ? { ...b, status: 'cancelled' } : b));
        success(`${bookingToCancel.eventName} cancelled`);
        setIsCancelDialogOpen(false);
        setBookingToCancel(null);
    };

    // Get status badge style
    const getStatusStyle = (status) => {
        const styles = {
            confirmed: { background: '#d1fae5', color: '#065f46', border: '1px solid #10b981' },
            pending: { background: '#fef3c7', color: '#92400e', border: '1px solid #f59e0b' },
            cancelled: { background: '#fee2e2', color: '#991b1b', border: '1px solid #ef4444' }
        };
        return styles[status] || styles.pending;
    };

    // Stats
    const stats = {
        total: bookings.length,
        confirmed: bookings.filter(b => b.status === 'confirmed').length,
        pending: bookings.filter(b => b.status === 'pending').length,
        cancelled: bookings.filter(b => b.status === 'cancelled').length
    };

    return (
        <div className="animate-fade-in">

            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                    Bookings Management
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    Track and manage all event bookings.
                </p>
            </div>

            {/* Stats Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
            }}>
                <div className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Calendar size={24} style={{ color: 'white' }} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                                {stats.total}
                            </h3>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>Total Bookings</p>
                        </div>
                    </div>
                </div>

                <div className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <CheckCircle size={24} style={{ color: 'white' }} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                                {stats.confirmed}
                            </h3>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>Confirmed</p>
                        </div>
                    </div>
                </div>

                <div className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Calendar size={24} style={{ color: 'white' }} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                                {stats.pending}
                            </h3>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>Pending</p>
                        </div>
                    </div>
                </div>

                <div className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <XCircle size={24} style={{ color: 'white' }} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                                {stats.cancelled}
                            </h3>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>Cancelled</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bookings Table */}
            <div className="card" style={{ padding: '1.5rem' }}>
                {/* Table Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', flex: 1 }}>
                        {/* Search */}
                        <div style={{ position: 'relative' }}>
                            <Search style={{
                                position: 'absolute',
                                left: '12px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'var(--text-muted)',
                                width: '18px',
                                height: '18px'
                            }} />
                            <input
                                type="text"
                                placeholder="Search bookings..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    width: '280px',
                                    padding: '8px 12px 8px 40px',
                                    background: 'var(--bg-tertiary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '6px',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.875rem',
                                    outline: 'none'
                                }}
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    style={{
                                        position: 'absolute',
                                        right: '8px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--text-muted)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        {/* Status Filter */}
                        <div style={{ position: 'relative' }}>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                style={{
                                    padding: '8px 32px 8px 12px',
                                    background: 'var(--bg-tertiary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '6px',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.875rem',
                                    cursor: 'pointer',
                                    outline: 'none',
                                    appearance: 'none'
                                }}
                            >
                                <option value="all">All Status</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="pending">Pending</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                            <ChevronDown size={16} style={{
                                position: 'absolute',
                                right: '10px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'var(--text-muted)',
                                pointerEvents: 'none'
                            }} />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button
                            onClick={exportToCSV}
                            className="btn btn-secondary"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '8px 16px', fontSize: '0.875rem' }}
                        >
                            <Download size={16} />
                            Export CSV
                        </button>
                        <button
                            onClick={() => success('Add booking modal would open here')}
                            className="btn btn-primary"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '8px 16px', fontSize: '0.875rem' }}
                        >
                            <Plus size={16} />
                            New Booking
                        </button>
                    </div>
                </div>

                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    Showing {filteredBookings.length} of {bookings.length} bookings
                </p>

                {/* Table */}
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                                    Event
                                </th>
                                <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                                    Date & Venue
                                </th>
                                <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                                    Type
                                </th>
                                <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                                    Guests
                                </th>
                                <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                                    Amount
                                </th>
                                <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                                    Status
                                </th>
                                <th style={{ padding: '0.875rem 1rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBookings.map((booking, index) => (
                                <tr
                                    key={booking.id}
                                    style={{
                                        borderBottom: index < filteredBookings.length - 1 ? '1px solid var(--border-color)' : 'none',
                                        cursor: 'pointer',
                                        transition: 'background 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                    onClick={() => handleViewBooking(booking)}
                                >
                                    <td style={{ padding: '1rem' }}>
                                        <div>
                                            <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.125rem' }}>
                                                {booking.eventName}
                                            </p>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                {booking.client}
                                            </p>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontSize: '0.875rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                                <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
                                                <span style={{ color: 'var(--text-secondary)' }}>{booking.eventDate}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <MapPin size={14} style={{ color: 'var(--text-muted)' }} />
                                                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{booking.venue}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            background: 'var(--bg-tertiary)',
                                            color: 'var(--primary)',
                                            padding: '0.375rem 0.75rem',
                                            borderRadius: '6px',
                                            fontSize: '0.75rem',
                                            fontWeight: '500',
                                            border: '1px solid var(--border-color)'
                                        }}>
                                            {booking.eventType}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <UsersIcon size={16} style={{ color: 'var(--text-muted)' }} />
                                            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                                                {booking.attendees}
                                            </span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div>
                                            <p style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--success)', marginBottom: '0.125rem' }}>
                                                {booking.totalAmount}
                                            </p>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                Paid: {booking.paidAmount}
                                            </p>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            ...getStatusStyle(booking.status),
                                            padding: '0.375rem 0.75rem',
                                            borderRadius: '9999px',
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                            textTransform: 'capitalize'
                                        }}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                                        <ActionMenu
                                            actions={[
                                                {
                                                    label: 'View Details',
                                                    icon: Eye,
                                                    onClick: () => handleViewBooking(booking)
                                                },
                                                {
                                                    label: 'Confirm Booking',
                                                    icon: CheckCircle,
                                                    onClick: () => handleConfirmBooking(booking),
                                                    disabled: booking.status === 'confirmed'
                                                },
                                                {
                                                    label: 'Send Confirmation',
                                                    icon: Mail,
                                                    onClick: () => success('Confirmation email sent!')
                                                },
                                                {
                                                    label: 'Cancel Booking',
                                                    icon: XCircle,
                                                    onClick: () => handleCancelBooking(booking),
                                                    danger: true,
                                                    disabled: booking.status === 'cancelled'
                                                }
                                            ]}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredBookings.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                        <Calendar size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                        <p style={{ fontSize: '1rem', fontWeight: '500' }}>No bookings found</p>
                        <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Try adjusting your filters</p>
                    </div>
                )}
            </div>

            {/* View Booking Modal */}
            <Modal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                title="Booking Details"
                size="lg"
            >
                {selectedBooking && (
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Event Name</p>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: '600' }}>{selectedBooking.eventName}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Client</p>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>{selectedBooking.client}</p>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Event Date</p>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>{selectedBooking.eventDate}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Venue</p>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>{selectedBooking.venue}</p>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Event Type</p>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>{selectedBooking.eventType}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Attendees</p>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: '600' }}>{selectedBooking.attendees}</p>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Client Email</p>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>{selectedBooking.clientEmail}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Status</p>
                                <span style={{
                                    ...getStatusStyle(selectedBooking.status),
                                    padding: '0.375rem 0.75rem',
                                    borderRadius: '9999px',
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    textTransform: 'capitalize'
                                }}>
                                    {selectedBooking.status}
                                </span>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Total Amount</p>
                                <p style={{ fontSize: '1.25rem', color: 'var(--success)', fontWeight: '700' }}>{selectedBooking.totalAmount}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Paid Amount</p>
                                <p style={{ fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: '700' }}>{selectedBooking.paidAmount}</p>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Cancel Confirmation Dialog */}
            <ConfirmDialog
                isOpen={isCancelDialogOpen}
                onClose={() => setIsCancelDialogOpen(false)}
                onConfirm={confirmCancel}
                title="Cancel Booking?"
                message={`Are you sure you want to cancel "${bookingToCancel?.eventName}"? This action may require refund processing.`}
                confirmText="Cancel Booking"
                variant="danger"
            />

            <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
        </div>
    );
};

export default Bookings;
