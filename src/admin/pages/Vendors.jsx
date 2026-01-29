import React, { useState, useEffect } from 'react';
import { Store, MapPin, Star, Mail, Phone, Calendar, LayoutGrid, RefreshCw } from 'lucide-react';

// Hooks & Services
import { useVendorManagement } from '../hooks/useVendorManagement';
import { useToast } from '../context/ToastContext';

// Modular Components
import VendorStatCards from '../components/features/vendors/VendorStatCards';
import VendorToolbar from '../components/features/vendors/VendorToolbar';
import VendorAnalytics from '../components/features/vendors/VendorAnalytics';
import VendorActivity from '../components/features/vendors/VendorActivity';
import VendorTable from '../components/features/vendors/VendorTable';
import AddVendorModal from '../components/features/vendors/AddVendorModal';
import EditVendorModal from '../components/features/vendors/EditVendorModal';
import ConfirmDeleteModal from '../components/features/vendors/ConfirmDeleteModal';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';

const Vendors = () => {
    const {
        vendors,
        loading,
        stats,
        categories,
        filters,
        actions
    } = useVendorManagement();

    const { info } = useToast();

    // Modal States
    const [activeModal, setActiveModal] = useState(null); // 'add', 'edit', 'delete', 'view', 'bulkDelete'
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [bulkSelectedIds, setBulkSelectedIds] = useState([]);

    const openModal = (type, vendor = null) => {
        setSelectedVendor(vendor);
        setActiveModal(type);
    };

    const closeModal = () => {
        setActiveModal(null);
        setSelectedVendor(null);
    };

    const handleAdd = async (data) => {
        const success = await actions.handleAdd(data);
        if (success) closeModal();
    };

    const handleUpdate = async (data) => {
        const success = await actions.handleUpdate(data);
        if (success) closeModal();
    };

    const handleDelete = async () => {
        const success = await actions.handleDelete(selectedVendor.id);
        if (success) closeModal();
    };

    const handleBulkDelete = async () => {
        const success = await actions.handleBulkDelete(bulkSelectedIds);
        if (success) {
            setBulkSelectedIds([]);
            closeModal();
        }
    };

    return (
        <div className="animate-fade-in" style={{ padding: '0 1rem' }}>
            {/* Header Section */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{
                        width: '64px', height: '64px', borderRadius: '18px',
                        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 12px 24px -10px rgba(99, 102, 241, 0.6)'
                    }}>
                        <Store size={32} color="white" />
                    </div>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-primary)', letterSpacing: '-0.04em' }}>Vendor Network</h1>
                        <p style={{ margin: '0.4rem 0 0', color: 'var(--text-muted)', fontSize: '1rem', fontWeight: '500' }}>Manage service partners, analyze performance, and scale your event supply chain.</p>
                    </div>
                </div>

                <button
                    onClick={() => { actions.refresh(); info('Refreshing data pipeline...'); }}
                    style={{
                        padding: '0.75rem',
                        borderRadius: '12px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                >
                    <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    <span style={{ fontWeight: '700', fontSize: '0.85rem' }}>Sync Pipeline</span>
                </button>
            </div>

            {/* Statistics Section */}
            <div style={{ width: '100%', marginBottom: '2rem' }}>
                {loading ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                        <LoadingSkeleton type="card" />
                        <LoadingSkeleton type="card" />
                        <LoadingSkeleton type="card" />
                        <LoadingSkeleton type="card" />
                    </div>
                ) : (
                    <VendorStatCards stats={stats} />
                )}
            </div>

            {/* Analytics & Activity Grid */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '2rem',
                marginBottom: '2.5rem',
                width: '100%'
            }}>
                <div style={{ flex: '1 1 500px', minHeight: '400px' }}>
                    {loading ? <LoadingSkeleton type="chart" /> : <VendorAnalytics />}
                </div>
                <div style={{ flex: '0 1 400px', minHeight: '400px' }}>
                    {loading ? <LoadingSkeleton type="table" rows={6} /> : <VendorActivity />}
                </div>
            </div>

            {/* Action Toolbar */}
            <VendorToolbar
                searchQuery={filters.searchQuery}
                setSearchQuery={filters.setSearchQuery}
                statusFilter={filters.statusFilter}
                setStatusFilter={filters.setStatusFilter}
                categoryFilter={filters.categoryFilter}
                setCategoryFilter={filters.setCategoryFilter}
                categories={categories}
                onAddVendor={() => openModal('add')}
                onExport={actions.exportToCSV}
            />

            {/* Data Table */}
            {loading ? (
                <LoadingSkeleton type="table" rows={5} />
            ) : (
                <VendorTable
                    vendors={vendors}
                    onRowClick={(v) => openModal('view', v)}
                    onView={(v) => openModal('view', v)}
                    onEdit={(v) => openModal('edit', v)}
                    onDelete={(v) => openModal('delete', v)}
                    onBulkDelete={async (ids) => {
                        setBulkSelectedIds(ids);
                        setActiveModal('bulkDelete');
                    }}
                    onBulkStatusChange={async (ids, status) => {
                        await actions.handleBulkStatusChange(ids, status);
                    }}
                />
            )}

            {/* Modals */}
            <AddVendorModal
                isOpen={activeModal === 'add'}
                onClose={closeModal}
                onAdd={handleAdd}
                categories={categories}
            />

            <EditVendorModal
                isOpen={activeModal === 'edit'}
                onClose={closeModal}
                onUpdate={handleUpdate}
                vendor={selectedVendor}
                categories={categories}
            />

            <ConfirmDeleteModal
                isOpen={activeModal === 'delete'}
                onClose={closeModal}
                onConfirm={handleDelete}
                vendorName={selectedVendor?.name || selectedVendor?.companyName}
            />

            <ConfirmDialog
                isOpen={activeModal === 'bulkDelete'}
                onClose={closeModal}
                onConfirm={handleBulkDelete}
                title="Bulk Delete Vendors?"
                message={`Are you sure you want to delete ${bulkSelectedIds.length} vendors? This action is permanent and cannot be undone.`}
                confirmText={`Delete ${bulkSelectedIds.length} Vendors`}
                variant="danger"
            />

            {/* Detail View Modal */}
            <Modal isOpen={activeModal === 'view'} onClose={closeModal} title="Vendor Profile" size="md">
                {selectedVendor && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                            <div style={{
                                width: '80px', height: '80px', borderRadius: '24px',
                                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'white', fontSize: '2rem', fontWeight: '900',
                                boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                            }}>
                                {(selectedVendor.name || selectedVendor.companyName).charAt(0)}
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)' }}>{selectedVendor.name || selectedVendor.companyName}</h3>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                        <MapPin size={16} /> Regional Hub
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#f59e0b' }}>
                                        <Star size={16} fill="currentColor" /> {selectedVendor.rating} Rating
                                    </div>
                                </div>
                            </div>
                            <div style={{
                                padding: '8px 16px', borderRadius: '12px',
                                background: selectedVendor.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                color: selectedVendor.status === 'active' ? '#10b981' : '#f59e0b',
                                fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase',
                                border: `1px solid ${selectedVendor.status === 'active' ? '#10b981' : '#f59e0b'}33`
                            }}>
                                {selectedVendor.status}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                            <div style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                                <p style={{ margin: '0 0 1rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contact Information</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Mail size={16} color="var(--primary)" />
                                        </div>
                                        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{selectedVendor.email}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Phone size={16} color="var(--primary)" />
                                        </div>
                                        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{selectedVendor.phone}</span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                                <p style={{ margin: '0 0 1rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Partnership Details</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Calendar size={16} color="var(--primary)" />
                                        </div>
                                        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Partner since {selectedVendor.joinedDate}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <LayoutGrid size={16} color="var(--primary)" />
                                        </div>
                                        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{selectedVendor.category || selectedVendor.services} Category</span>
                                    </div>
                                </div>
                            </div>

                            <div style={{
                                gridColumn: '1 / -1',
                                padding: '1.5rem',
                                background: 'linear-gradient(to right, rgba(99, 102, 241, 0.05), rgba(168, 85, 247, 0.05))',
                                borderRadius: '16px',
                                border: '1px solid var(--border-color)',
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: '1rem',
                                textAlign: 'center'
                            }}>
                                <div>
                                    <p style={{ margin: '0 0 0.25rem', fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>TOTAL EVENTS</p>
                                    <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-primary)' }}>{selectedVendor.totalEvents}</p>
                                </div>
                                <div>
                                    <p style={{ margin: '0 0 0.25rem', fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>TOTAL REVENUE</p>
                                    <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: '900', color: '#10b981' }}>{selectedVendor.revenue}</p>
                                </div>
                                <div>
                                    <p style={{ margin: '0 0 0.25rem', fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>YIELDS</p>
                                    <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-primary)' }}>12.5%</p>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={() => openModal('edit', selectedVendor)}
                                style={{
                                    flex: 1, padding: '1rem', borderRadius: '12px', background: 'var(--primary)',
                                    color: 'white', border: 'none', fontWeight: '800', cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                Edit Profile
                            </button>
                            <button
                                onClick={closeModal}
                                style={{
                                    flex: 1, padding: '1rem', borderRadius: '12px', background: 'var(--bg-tertiary)',
                                    color: 'var(--text-primary)', border: '1px solid var(--border-color)', fontWeight: '800', cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                Close Profile
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            <style jsx>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default Vendors;

