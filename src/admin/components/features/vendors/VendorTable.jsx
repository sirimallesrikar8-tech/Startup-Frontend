import React, { useState, useMemo } from 'react';
import {
    ChevronUp, ChevronDown, MoreVertical, Eye, Edit, Trash2,
    Star, ChevronLeft, ChevronRight, CheckCircle, Clock, XCircle,
    Square, CheckSquare, Trash
} from 'lucide-react';
import ActionMenu from '../../ui/ActionMenu';

const VendorTable = ({ vendors, onRowClick, onEdit, onDelete, onView, onBulkDelete, onBulkStatusChange }) => {
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedIds, setSelectedIds] = useState([]);
    const itemsPerPage = 5;

    // Reset page to 1 if vendors list changes (e.g. search/filter)
    React.useEffect(() => {
        setCurrentPage(1);
    }, [vendors]);

    // Clear stale selections
    React.useEffect(() => {
        setSelectedIds(prev => prev.filter(id => vendors.some(v => v.id === id)));
    }, [vendors]);

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedVendors = useMemo(() => {
        return [...vendors].sort((a, b) => {
            let valA = a[sortConfig.key] || (sortConfig.key === 'name' ? a.companyName : a.services) || '';
            let valB = b[sortConfig.key] || (sortConfig.key === 'name' ? b.companyName : b.services) || '';

            // Handle arrays (e.g. tags or services)
            if (Array.isArray(valA)) valA = valA.join(', ');
            if (Array.isArray(valB)) valB = valB.join(', ');

            // Numeric comparison for rating/totalEvents
            if (typeof valA === 'number' && typeof valB === 'number') {
                return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
            }

            // Case-insensitive string comparison
            valA = valA.toString().toLowerCase();
            valB = valB.toString().toLowerCase();

            if (valA === valB) return 0;
            const modifier = sortConfig.direction === 'asc' ? 1 : -1;
            return valA > valB ? modifier : -modifier;
        });
    }, [vendors, sortConfig]);

    const totalPages = Math.ceil(sortedVendors.length / itemsPerPage);
    const currentVendors = sortedVendors.slice(
        (currentPage - 1) * itemsPerPage,
        (currentPage - 1) * itemsPerPage + itemsPerPage
    );

    const toggleSelectAll = () => {
        if (selectedIds.length === currentVendors.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(currentVendors.map(v => v.id));
        }
    };

    const toggleSelect = (e, id) => {
        e.stopPropagation();
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const getStatusBadge = (status) => {
        const styles = {
            active: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981', icon: CheckCircle },
            pending: { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', icon: Clock },
            inactive: { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', icon: XCircle }
        };
        const style = styles[status] || styles.pending;
        const Icon = style.icon;

        return (
            <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '99px',
                background: style.bg,
                color: style.color,
                fontSize: '0.75rem',
                fontWeight: '800',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                border: `1px solid ${style.color}33`
            }}>
                <Icon size={14} />
                {status}
            </div>
        );
    };

    return (
        <div
            className="animate-fade-in"
            style={{
                background: 'var(--bg-card)',
                borderRadius: '24px',
                border: '1px solid var(--border-color)',
                overflow: 'hidden',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                position: 'relative'
            }}
        >
            {/* Bulk Actions Toolbar */}
            {selectedIds.length > 0 && (
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0,
                    height: '64px',
                    background: 'var(--primary)',
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 1.5rem',
                    animation: 'slideDown 0.3s ease-out'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button
                            onClick={() => setSelectedIds([])}
                            style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '8px', padding: '6px', color: 'white', cursor: 'pointer' }}
                        >
                            <XCircle size={18} />
                        </button>
                        <span style={{ color: 'white', fontWeight: '800', fontSize: '0.95rem' }}>{selectedIds.length} Vendors Selected</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button
                            onClick={async () => {
                                await onBulkStatusChange?.(selectedIds, 'active');
                                setSelectedIds([]);
                            }}
                            style={{ padding: '8px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}
                        >
                            Activate
                        </button>
                        <button
                            onClick={async () => {
                                await onBulkDelete?.(selectedIds);
                                setSelectedIds([]);
                            }}
                            style={{ padding: '8px 16px', borderRadius: '10px', background: '#ef4444', border: 'none', color: 'white', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            <Trash size={16} /> Delete Selected
                        </button>
                    </div>
                </div>
            )}

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-color)' }}>
                            <th style={{ padding: '1.25rem 1.5rem', width: '40px' }}>
                                <button
                                    onClick={toggleSelectAll}
                                    style={{ background: 'none', border: 'none', padding: 0, color: 'var(--text-muted)', cursor: 'pointer' }}
                                >
                                    {selectedIds.length === currentVendors.length && currentVendors.length > 0
                                        ? <CheckSquare size={20} color="var(--primary)" />
                                        : <Square size={20} />
                                    }
                                </button>
                            </th>
                            {[
                                { label: 'Vendor Name', key: 'name' },
                                { label: 'Category', key: 'category' },
                                { label: 'Rating', key: 'rating' },
                                { label: 'Bookings', key: 'totalEvents' },
                                { label: 'Status', key: 'status' },
                                { label: 'Actions', key: null }
                            ].map((column) => (
                                <th
                                    key={column.label}
                                    onClick={() => column.key && handleSort(column.key)}
                                    style={{
                                        padding: '1.25rem 1rem',
                                        fontSize: '0.75rem',
                                        fontWeight: '800',
                                        color: 'var(--text-muted)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        cursor: column.key ? 'pointer' : 'default',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {column.label}
                                        {column.key && (
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <ChevronUp size={12} style={{ color: sortConfig.key === column.key && sortConfig.direction === 'asc' ? 'var(--primary)' : 'var(--text-muted)', marginBottom: '-4px' }} />
                                                <ChevronDown size={12} style={{ color: sortConfig.key === column.key && sortConfig.direction === 'desc' ? 'var(--primary)' : 'var(--text-muted)' }} />
                                            </div>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {currentVendors.length > 0 ? (
                            currentVendors.map((vendor, idx) => (
                                <tr
                                    key={vendor.id}
                                    onClick={() => onRowClick(vendor)}
                                    style={{
                                        borderBottom: idx < currentVendors.length - 1 ? '1px solid var(--border-color)' : 'none',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        background: selectedIds.includes(vendor.id) ? 'rgba(99, 102, 241, 0.05)' : 'transparent'
                                    }}
                                    onMouseEnter={(e) => !selectedIds.includes(vendor.id) && (e.currentTarget.style.background = 'var(--bg-hover)')}
                                    onMouseLeave={(e) => !selectedIds.includes(vendor.id) && (e.currentTarget.style.background = 'transparent')}
                                >
                                    <td style={{ padding: '1.25rem 1.5rem' }} onClick={(e) => toggleSelect(e, vendor.id)}>
                                        {selectedIds.includes(vendor.id)
                                            ? <CheckSquare size={20} color="var(--primary)" />
                                            : <Square size={20} color="var(--text-muted)" />
                                        }
                                    </td>
                                    <td style={{ padding: '1.25rem 1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{
                                                width: '40px', height: '40px', borderRadius: '12px',
                                                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                                                fontWeight: '800', fontSize: '1rem', flexShrink: 0
                                            }}>
                                                {(vendor.name || vendor.companyName).charAt(0)}
                                            </div>
                                            <div>
                                                <p style={{ margin: 0, fontWeight: '700', color: 'var(--text-primary)', fontSize: '0.95rem' }}>{vendor.name || vendor.companyName}</p>
                                                <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{vendor.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1rem' }}>
                                        <span style={{
                                            padding: '4px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)',
                                            fontSize: '0.85rem', color: 'var(--text-secondary)', border: '1px solid var(--border-color)'
                                        }}>
                                            {vendor.category || vendor.services}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.25rem 1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Star size={16} fill="#f59e0b" stroke="#f59e0b" />
                                            <span style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-primary)' }}>{vendor.rating}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1rem', fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: '600' }}>
                                        {vendor.totalEvents} Events
                                    </td>
                                    <td style={{ padding: '1.25rem 1rem' }}>
                                        {getStatusBadge(vendor.status)}
                                    </td>
                                    <td style={{ padding: '1.25rem 1rem' }} onClick={(e) => e.stopPropagation()}>
                                        <ActionMenu
                                            actions={[
                                                { label: 'View Portfolio', icon: Eye, onClick: () => onView(vendor) },
                                                { label: 'Edit Profile', icon: Edit, onClick: () => onEdit(vendor) },
                                                { label: 'Remove Vendor', icon: Trash2, onClick: () => onDelete(vendor), danger: true },
                                            ]}
                                        />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                        <LayoutGrid size={48} strokeWidth={1} style={{ opacity: 0.3 }} />
                                        <p>No vendors found matching your criteria.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            <div style={{
                padding: '1.25rem 1.5rem',
                borderTop: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(255,255,255,0.01)'
            }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                    Showing <span style={{ color: 'var(--text-primary)', fontWeight: '700' }}>{Math.min(itemsPerPage, currentVendors.length)}</span> of <span style={{ color: 'var(--text-primary)', fontWeight: '700' }}>{vendors.length}</span> results
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        style={{
                            padding: '8px', borderRadius: '10px',
                            background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
                            color: currentPage === 1 ? 'var(--text-muted)' : 'var(--text-primary)',
                            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center'
                        }}
                    >
                        <ChevronLeft size={18} />
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            style={{
                                width: '36px', height: '36px', borderRadius: '10px',
                                background: currentPage === i + 1 ? 'var(--primary)' : 'var(--bg-secondary)',
                                color: currentPage === i + 1 ? 'white' : 'var(--text-primary)',
                                border: '1px solid',
                                borderColor: currentPage === i + 1 ? 'var(--primary)' : 'var(--border-color)',
                                fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s'
                            }}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        style={{
                            padding: '8px', borderRadius: '10px',
                            background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
                            color: currentPage === totalPages ? 'var(--text-muted)' : 'var(--text-primary)',
                            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center'
                        }}
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            <style jsx>{`
                @keyframes slideDown {
                    from { transform: translateY(-100%); }
                    to { transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default VendorTable;

