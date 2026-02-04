import React, { useState, useMemo } from 'react';
import {
    Plus, Search, Filter, RefreshCw, BarChart3,
    Package, Zap, Award, Users, Activity,
    LayoutGrid, List, SlidersHorizontal, ChevronRight,
    Star, Edit, Trash2, Eye
} from 'lucide-react';

// Hooks & Services
import { useServiceManagement } from '../hooks/useServiceManagement';
import { useToast } from '../context/ToastContext';

// Components
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import Modal from '../components/ui/Modal';
import ActionMenu from '../components/ui/ActionMenu';
import ConfirmDialog from '../components/ui/ConfirmDialog';

const Services = () => {
    const { services, loading, stats, actions } = useServiceManagement();
    const { info } = useToast();

    // UI States
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [sortBy, setSortBy] = useState('popularity');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

    // Modal States
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

    // Derived Data
    const filteredServices = useMemo(() => {
        let result = services.filter(service => {
            const matchesSearch = !searchQuery ||
                service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                service.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesCategory = categoryFilter === 'all' || service.category === categoryFilter;

            return matchesSearch && matchesCategory;
        });

        result.sort((a, b) => {
            switch (sortBy) {
                case 'popularity': return b.bookings - a.bookings;
                case 'rating': return b.rating - a.rating;
                case 'name': return a.name.localeCompare(b.name);
                case 'vendors': return b.vendors - a.vendors;
                default: return 0;
            }
        });

        return result;
    }, [services, searchQuery, categoryFilter, sortBy]);

    const categories = useMemo(() => {
        const cats = Array.from(new Set(services.map(s => s.category).filter(Boolean)));
        return ['all', ...cats];
    }, [services]);

    // Handlers
    const openModal = (type, service = null) => {
        setSelectedService(service);
        if (type === 'view') setIsViewModalOpen(true);
        if (type === 'edit') setIsEditModalOpen(true);
        if (type === 'add') setIsAddModalOpen(true);
    };

    const handleDelete = (service) => {
        setSelectedService(service);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (selectedService) {
            await actions.handleDelete(selectedService.id);
            setIsDeleteDialogOpen(false);
            setSelectedService(null);
        }
    };

    const handleSync = async () => {
        info('Synchronizing services catalog...');
        await actions.refresh();
    };

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
            {/* Header Section */}
            <div style={{
                marginBottom: '2.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '1.5rem'
            }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <div style={{
                            padding: '10px',
                            background: 'rgba(99, 102, 241, 0.1)',
                            borderRadius: '12px',
                            color: 'var(--primary)'
                        }}>
                            <Package size={28} />
                        </div>
                        <h1 style={{ fontSize: '2.25rem', fontWeight: '800', margin: 0, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                            Services Catalog
                        </h1>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem', margin: 0, fontWeight: '500' }}>
                        Manage and scale your service ecosystem
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                        onClick={handleSync}
                        className="btn-glass"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '0.75rem 1.25rem',
                            borderRadius: '12px',
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-card)',
                            color: 'var(--text-primary)',
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        <RefreshCw size={18} /> Sync Pipeline
                    </button>
                    <button
                        onClick={() => openModal('add')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '12px',
                            background: 'var(--primary)',
                            color: 'white',
                            border: 'none',
                            fontWeight: '800',
                            fontSize: '0.95rem',
                            cursor: 'pointer',
                            boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.4)',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <Plus size={20} strokeWidth={3} /> Add New Service
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2.5rem'
            }}>
                {loading ? (
                    [...Array(4)].map((_, i) => <LoadingSkeleton key={i} type="card" />)
                ) : (
                    <>
                        {[
                            { label: 'Market Categories', value: stats.totalServices, icon: Package, color: '#6366f1', trend: '+2' },
                            { label: 'Active Vendors', value: stats.totalVendors, icon: Users, color: '#10b981', trend: '+14' },
                            { label: 'Total Volume', value: stats.totalBookings, icon: Activity, color: '#f59e0b', trend: '+28%' },
                            { label: 'Customer Rating', value: stats.avgRating, icon: Award, color: '#ec4899', trend: '+0.2' }
                        ].map((stat, i) => (
                            <div key={i} className="card-glass" style={{
                                padding: '1.5rem',
                                borderRadius: '20px',
                                background: 'var(--bg-card)',
                                border: '1px solid var(--border-color)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1.25rem',
                                transition: 'all 0.3s ease'
                            }}>
                                <div style={{
                                    padding: '14px',
                                    background: `${stat.color}15`,
                                    borderRadius: '16px',
                                    color: stat.color,
                                    boxShadow: `0 8px 20px -6px ${stat.color}20`
                                }}>
                                    {React.createElement(stat.icon, { size: 28 })}
                                </div>
                                <div>
                                    <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        {stat.label}
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                        <h3 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)' }}>{stat.value}</h3>
                                        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#10b981' }}>{stat.trend}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>

            {/* Toolbar Section */}
            <div className="card-glass" style={{
                padding: '1.25rem',
                marginBottom: '2rem',
                borderRadius: '20px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1.5rem'
            }}>
                <div style={{ display: 'flex', gap: '1rem', flex: 1, minWidth: '300px' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Search catalog by name, tag or description..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.85rem 1rem 0.85rem 3rem',
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '14px',
                                color: 'var(--text-primary)',
                                fontWeight: '500',
                                outline: 'none',
                                transition: 'all 0.2s'
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            style={{
                                padding: '0.85rem 1.25rem',
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '14px',
                                color: 'var(--text-primary)',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                            ))}
                        </select>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            style={{
                                padding: '0.85rem 1.25rem',
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '14px',
                                color: 'var(--text-primary)',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="popularity">Popularity</option>
                            <option value="rating">Rating</option>
                            <option value="name">Name</option>
                            <option value="vendors">Vendors</option>
                        </select>
                    </div>
                </div>

                <div style={{ display: 'flex', background: 'var(--bg-secondary)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <button
                        onClick={() => setViewMode('grid')}
                        style={{
                            padding: '8px',
                            borderRadius: '8px',
                            background: viewMode === 'grid' ? 'var(--primary)' : 'transparent',
                            color: viewMode === 'grid' ? 'white' : 'var(--text-muted)',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        <LayoutGrid size={20} />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        style={{
                            padding: '8px',
                            borderRadius: '8px',
                            background: viewMode === 'list' ? 'var(--primary)' : 'transparent',
                            color: viewMode === 'list' ? 'white' : 'var(--text-muted)',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        <List size={20} />
                    </button>
                </div>
            </div>

            {/* Content Grid */}
            {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                    {[...Array(6)].map((_, i) => <LoadingSkeleton key={i} type="card" />)}
                </div>
            ) : filteredServices.length > 0 ? (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(350px, 1fr))' : '1fr',
                    gap: '1.5rem'
                }}>
                    {filteredServices.map((service, index) => (
                        <div
                            key={service.id}
                            className="service-card"
                            style={{
                                background: 'var(--bg-card)',
                                borderRadius: '24px',
                                border: '1px solid var(--border-color)',
                                padding: '1.75rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                position: 'relative',
                                display: 'flex',
                                gap: '1.5rem',
                                animation: `slideInUp 0.4s ease-out ${index * 0.05}s backwards`
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.borderColor = (service.color || '#6366f1') + '66';
                                e.currentTarget.style.boxShadow = `0 20px 25px -5px ${service.color}20`;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.borderColor = 'var(--border-color)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                            onClick={() => openModal('view', service)}
                        >
                            {/* Visual Indicator */}
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '20px',
                                background: `linear-gradient(135deg, ${service.color || '#6366f1'}, ${service.color || '#6366f1'}dd)`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                boxShadow: `0 10px 15px -3px ${(service.color || '#6366f1')}40`,
                                flexShrink: 0
                            }}>
                                <Package size={36} />
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                            <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-primary)' }}>{service.name}</h3>
                                            {service.trending && (
                                                <span style={{
                                                    padding: '2px 8px',
                                                    background: 'rgba(239, 68, 68, 0.1)',
                                                    color: '#ef4444',
                                                    fontSize: '0.65rem',
                                                    fontWeight: '800',
                                                    borderRadius: '6px',
                                                    textTransform: 'uppercase'
                                                }}>
                                                    <Zap size={10} style={{ display: 'inline', marginRight: '2px' }} /> Trending
                                                </span>
                                            )}
                                        </div>
                                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5', WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {service.description}
                                        </p>
                                    </div>
                                    <div onClick={(e) => e.stopPropagation()}>
                                        <ActionMenu actions={[
                                            { label: 'Edit Service', icon: Edit, onClick: () => openModal('edit', service) },
                                            { label: 'View Analytics', icon: BarChart3, onClick: () => openModal('view', service) },
                                            { label: 'Delete Category', icon: Trash2, onClick: () => handleDelete(service), danger: true }
                                        ]} />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Users size={16} style={{ color: 'var(--text-muted)' }} />
                                        <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)' }}>{service.vendors} Vendors</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Star size={16} fill="#f59e0b" stroke="#f59e0b" />
                                        <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)' }}>{service.rating}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}>
                                        <Activity size={16} style={{ color: '#6366f1' }} />
                                        <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#6366f1' }}>{service.bookings} k Bookings</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{
                    textAlign: 'center',
                    padding: '5rem 2rem',
                    background: 'var(--bg-card)',
                    borderRadius: '24px',
                    border: '1px dashed var(--border-color)'
                }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'rgba(99, 102, 241, 0.05)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem',
                        color: 'var(--text-muted)'
                    }}>
                        <Search size={40} />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>No Services Found</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Try refining your search terms or filters.</p>
                    <button
                        onClick={() => { setSearchQuery(''); setCategoryFilter('all'); }}
                        className="btn btn-secondary"
                    >
                        Clear All Filters
                    </button>
                </div>
            )}

            {/* View Details Modal */}
            <Modal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                title="Service Category Insights"
                size="lg"
            >
                {selectedService && (
                    <div style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', gap: '2rem', marginBottom: '2.5rem' }}>
                            <div style={{
                                width: '120px',
                                height: '120px',
                                borderRadius: '24px',
                                background: `linear-gradient(135deg, ${selectedService.color}, ${selectedService.color}dd)`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                boxShadow: `0 20px 30px -10px ${selectedService.color}50`
                            }}>
                                <Package size={60} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                    <h2 style={{ fontSize: '2rem', fontWeight: '800', margin: 0 }}>{selectedService.name}</h2>
                                    <span style={{
                                        padding: '4px 12px',
                                        background: 'rgba(16, 185, 129, 0.1)',
                                        color: '#10b981',
                                        borderRadius: '99px',
                                        fontSize: '0.75rem',
                                        fontWeight: '800'
                                    }}>ACTIVE CATEGORY</span>
                                </div>
                                <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{selectedService.description}</p>
                                <div style={{ display: 'flex', gap: '1.5rem' }}>
                                    <div>
                                        <p style={{ margin: '0 0 4px', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Average Rating</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Star size={20} fill="#f59e0b" stroke="#f59e0b" />
                                            <span style={{ fontSize: '1.25rem', fontWeight: '800' }}>{selectedService.rating} / 5.0</span>
                                        </div>
                                    </div>
                                    <div style={{ width: '1px', background: 'var(--border-color)' }}></div>
                                    <div>
                                        <p style={{ margin: '0 0 4px', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Market Share</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Users size={20} style={{ color: 'var(--primary)' }} />
                                            <span style={{ fontSize: '1.25rem', fontWeight: '800' }}>{selectedService.vendors} Vendors</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{
                            background: 'var(--bg-secondary)',
                            borderRadius: '20px',
                            padding: '1.5rem',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '1.5rem',
                            marginBottom: '2rem'
                        }}>
                            <div>
                                <p style={{ margin: '0 0 4px', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Revenue</p>
                                <h4 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800' }}>$1.4M</h4>
                            </div>
                            <div>
                                <p style={{ margin: '0 0 4px', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Bookings Growth</p>
                                <h4 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800', color: '#10b981' }}>+24%</h4>
                            </div>
                            <div>
                                <p style={{ margin: '0 0 4px', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Avg Task Val</p>
                                <h4 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800' }}>$1,250</h4>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                            <button className="btn btn-secondary" onClick={() => setIsViewModalOpen(false)}>Close Insights</button>
                            <button className="btn btn-primary" onClick={() => { setIsViewModalOpen(false); setIsEditModalOpen(true); }}>
                                Edit Configuration
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Service Category?"
                message={`Are you sure you want to delete the "${selectedService?.name}" category? This will remove it from the catalog and may affect existing listings.`}
                confirmText="Delete Category"
                variant="danger"
            />

            <style>{`
                .btn-glass:hover {
                    background: var(--bg-hover) !important;
                    border-color: var(--primary) !important;
                    color: var(--primary) !important;
                }
                @keyframes slideInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default Services;





