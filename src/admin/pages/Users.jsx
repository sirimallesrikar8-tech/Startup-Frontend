import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users as UsersIcon, UserPlus, Search, Download, Edit, Trash2, Eye,
    X, Mail, Phone, Calendar, DollarSign, TrendingUp, Filter, ChevronDown
} from 'lucide-react';
import { usersData } from '../data/usersData';
import Modal from '../components/ui/Modal';
import ActionMenu from '../components/ui/ActionMenu';
import ConfirmDialog from '../components/ui/ConfirmDialog';

// Static styles and configs moved outside
const statusStyles = {
    active: { background: '#d1fae5', color: '#065f46', border: '1px solid #10b981' },
    inactive: { background: '#fef3c7', color: '#92400e', border: '1px solid #f59e0b' },
    suspended: { background: '#fee2e2', color: '#991b1b', border: '1px solid #ef4444' }
};

const escapeCSV = (val) => {
    if (val === null || val === undefined) return '';
    let result = val.toString();
    if (['=', '+', '-', '@'].includes(result[0])) result = "'" + result;
    if (result.includes(',') || result.includes('"') || result.includes('\n')) {
        result = `"${result.replace(/"/g, '""')}"`;
    }
    return result;
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const Users = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState(usersData);
    const [filteredUsers, setFilteredUsers] = useState(usersData);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [roleFilter, setRoleFilter] = useState('all');
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');

    // Modal states
    const [selectedUser, setSelectedUser] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    // Toast state
    const [toast, setToast] = useState(null);

    // Show toast
    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    // Filter and search users
    useEffect(() => {
        let filtered = [...users];

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(user =>
                user.name.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query) ||
                user.phone.includes(searchQuery)
            );
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(user => user.status === statusFilter);
        }

        // Role filter
        if (roleFilter !== 'all') {
            filtered = filtered.filter(user => user.role === roleFilter);
        }

        // Sort - Fixed logic
        if (sortColumn) {
            filtered.sort((a, b) => {
                let aVal = a[sortColumn];
                let bVal = b[sortColumn];

                if (sortColumn === 'totalSpent') {
                    aVal = typeof aVal === 'string' ? parseFloat(aVal.replace(/[^0-9.]/g, '')) : aVal;
                    bVal = typeof bVal === 'string' ? parseFloat(bVal.replace(/[^0-9.]/g, '')) : bVal;
                }

                if (aVal === bVal) return 0;
                const modifier = sortDirection === 'asc' ? 1 : -1;
                return aVal > bVal ? modifier : -modifier;
            });
        }

        setFilteredUsers(filtered);
    }, [searchQuery, statusFilter, roleFilter, sortColumn, sortDirection, users]);

    // Export to CSV - Fixed formatting and security
    const exportToCSV = () => {
        const headers = ['Name', 'Email', 'Phone', 'Role', 'Status', 'Bookings', 'Total Spent', 'Joined Date'];
        const rows = filteredUsers.map(u => [
            u.name,
            u.email,
            u.phone,
            u.role,
            u.status,
            u.totalBookings,
            u.totalSpent,
            u.joinedDate
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(escapeCSV).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);

        showToast('Users exported successfully!');
    };

    // Open view modal
    const handleViewUser = (user) => {
        setSelectedUser(user);
        setIsViewModalOpen(true);
    };

    // Open edit modal
    const handleEditUser = (user) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    // Delete user
    const handleDeleteUser = (user) => {
        setUserToDelete(user);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        setUsers(users.filter(u => u.id !== userToDelete.id));
        showToast(`${userToDelete.name} deleted successfully`);
        setIsDeleteDialogOpen(false);
        setUserToDelete(null);
    };

    // Get status badge style
    const getStatusStyle = (status) => statusStyles[status] || statusStyles.active;

    // Stats
    const stats = {
        total: users.length,
        active: users.filter(u => u.status === 'active').length,
        corporate: users.filter(u => u.role === 'Corporate Client').length
    };

    return (
        <div className="animate-fade-in">
            {/* Toast */}
            {toast && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    background: toast.type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #ef4444, #dc2626)',
                    color: 'white',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    boxShadow: 'var(--shadow-xl)',
                    zIndex: 10001,
                    animation: 'slideInRight 0.3s ease-out'
                }}>
                    {toast.message}
                </div>
            )}

            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                    Users Management
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    Manage and monitor all registered users and clients.
                </p>
            </div>

            {/* Stats Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
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
                            <UsersIcon size={24} style={{ color: 'white' }} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                                {stats.total}
                            </h3>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>Total Users</p>
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
                            <TrendingUp size={24} style={{ color: 'white' }} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                                {stats.active}
                            </h3>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>Active Users</p>
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
                            <DollarSign size={24} style={{ color: 'white' }} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                                {stats.corporate}
                            </h3>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>Corporate Clients</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Users Table */}
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
                                placeholder="Search users..."
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
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="suspended">Suspended</option>
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

                        {/* Role Filter */}
                        <div style={{ position: 'relative' }}>
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
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
                                <option value="all">All Roles</option>
                                <option value="Client">Client</option>
                                <option value="Corporate Client">Corporate Client</option>
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
                            onClick={() => showToast('Add user modal would open here')}
                            className="btn btn-primary"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '8px 16px', fontSize: '0.875rem' }}
                        >
                            <UserPlus size={16} />
                            Add User
                        </button>
                    </div>
                </div>

                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    Showing {filteredUsers.length} of {users.length} users
                </p>

                {/* Table */}
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                                    Name
                                </th>
                                <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                                    Contact
                                </th>
                                <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                                    Status
                                </th>
                                <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                                    Bookings
                                </th>
                                <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                                    Total Spent
                                </th>
                                <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                                    Joined
                                </th>
                                <th style={{ padding: '0.875rem 1rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user, index) => (
                                <tr
                                    key={user.id}
                                    style={{
                                        borderBottom: index < filteredUsers.length - 1 ? '1px solid var(--border-color)' : 'none',
                                        cursor: 'pointer',
                                        transition: 'background 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                    onClick={() => handleViewUser(user)}
                                >
                                    <td style={{ padding: '1rem' }}>
                                        <div>
                                            <p style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '0.125rem' }}>
                                                {user.name}
                                            </p>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                {user.role}
                                            </p>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontSize: '0.875rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                                <Mail size={14} style={{ color: 'var(--text-muted)' }} />
                                                <span style={{ color: 'var(--text-secondary)' }}>{user.email}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <Phone size={14} style={{ color: 'var(--text-muted)' }} />
                                                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{user.phone}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            ...getStatusStyle(user.status),
                                            padding: '0.375rem 0.75rem',
                                            borderRadius: '9999px',
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                            textTransform: 'capitalize',
                                            display: 'inline-block'
                                        }}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--primary-light)' }}>
                                        {user.totalBookings}
                                    </td>
                                    <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--success)' }}>
                                        {user.totalSpent}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                                            <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{formatDate(user.joinedDate)}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                                        <ActionMenu
                                            actions={[
                                                {
                                                    label: 'View Details',
                                                    icon: Eye,
                                                    onClick: () => handleViewUser(user)
                                                },
                                                {
                                                    label: 'Edit User',
                                                    icon: Edit,
                                                    onClick: () => handleEditUser(user)
                                                },
                                                {
                                                    label: 'Delete User',
                                                    icon: Trash2,
                                                    onClick: () => handleDeleteUser(user),
                                                    danger: true
                                                }
                                            ]}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredUsers.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                        <UsersIcon size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                        <p style={{ fontSize: '1rem', fontWeight: '500' }}>No users found</p>
                        <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Try adjusting your filters</p>
                    </div>
                )}
            </div>

            {/* View User Modal */}
            <Modal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                title="User Details"
                size="md"
            >
                {selectedUser && (
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '1.5rem',
                                fontWeight: '600'
                            }}>
                                {selectedUser.name.charAt(0)}
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>
                                    {selectedUser.name}
                                </h3>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>
                                    {selectedUser.role}
                                </p>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Email</p>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>{selectedUser.email}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Phone</p>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>{selectedUser.phone}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Status</p>
                                <span style={{
                                    ...getStatusStyle(selectedUser.status),
                                    padding: '0.375rem 0.75rem',
                                    borderRadius: '9999px',
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    textTransform: 'capitalize'
                                }}>
                                    {selectedUser.status}
                                </span>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Total Bookings</p>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: '600' }}>{selectedUser.totalBookings}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Total Spent</p>
                                <p style={{ fontSize: '0.875rem', color: 'var(--success)', fontWeight: '600' }}>{selectedUser.totalSpent}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Member Since</p>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>{formatDate(selectedUser.joinedDate)}</p>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Edit User Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit User"
                size="md"
                footer={
                    <>
                        <button onClick={() => setIsEditModalOpen(false)} className="btn btn-secondary">
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                showToast('User updated successfully!');
                                setIsEditModalOpen(false);
                            }}
                            className="btn btn-primary"
                        >
                            Save Changes
                        </button>
                    </>
                }
            >
                {selectedUser && (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <div>
                            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-primary)', display: 'block', marginBottom: '0.5rem' }}>
                                Name
                            </label>
                            <input
                                type="text"
                                defaultValue={selectedUser.name}
                                style={{
                                    width: '100%',
                                    padding: '0.625rem',
                                    background: 'var(--bg-tertiary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '6px',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.875rem',
                                    outline: 'none'
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-primary)', display: 'block', marginBottom: '0.5rem' }}>
                                Email
                            </label>
                            <input
                                type="email"
                                defaultValue={selectedUser.email}
                                style={{
                                    width: '100%',
                                    padding: '0.625rem',
                                    background: 'var(--bg-tertiary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '6px',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.875rem',
                                    outline: 'none'
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-primary)', display: 'block', marginBottom: '0.5rem' }}>
                                Phone
                            </label>
                            <input
                                type="tel"
                                defaultValue={selectedUser.phone}
                                style={{
                                    width: '100%',
                                    padding: '0.625rem',
                                    background: 'var(--bg-tertiary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '6px',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.875rem',
                                    outline: 'none'
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-primary)', display: 'block', marginBottom: '0.5rem' }}>
                                Status
                            </label>
                            <select
                                defaultValue={selectedUser.status}
                                style={{
                                    width: '100%',
                                    padding: '0.625rem',
                                    background: 'var(--bg-tertiary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '6px',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.875rem',
                                    outline: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="suspended">Suspended</option>
                            </select>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={confirmDelete}
                title="Delete User?"
                message={`Are you sure you want to delete ${userToDelete?.name}? This action cannot be undone.`}
                confirmText="Delete"
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

export default Users;
