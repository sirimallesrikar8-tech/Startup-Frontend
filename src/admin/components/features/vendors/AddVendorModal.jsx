import React, { useState, useEffect } from 'react';
import Modal from '../../ui/Modal';
import { User, Mail, Phone, Store, Star, CheckCircle, XCircle } from 'lucide-react';

const AddVendorModal = ({ isOpen, onClose, onAdd, categories }) => {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        email: '',
        phone: '',
        rating: 4.5,
        status: 'active',
        contactPerson: '',
        joinedDate: new Date().toISOString().split('T')[0],
        totalEvents: 0,
        revenue: '$0'
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen) {
            setFormData({
                name: '',
                category: categories[0] || 'Catering',
                email: '',
                phone: '',
                rating: 4.5,
                status: 'active',
                contactPerson: '',
                joinedDate: new Date().toISOString().split('T')[0],
                totalEvents: 0,
                revenue: '$0'
            });
            setErrors({});
        }
    }, [isOpen, categories]);

    const validate = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Company name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
        if (!formData.phone) newErrors.phone = 'Phone is required';
        if (!formData.contactPerson) newErrors.contactPerson = 'Contact person is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onAdd({ ...formData, id: Date.now() });
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Register New Vendor" size="md">
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                    <div style={{ gridColumn: 'span 2' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>Company Name</label>
                        <div style={{ position: 'relative' }}>
                            <Store size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Elite Event Services"
                                style={{
                                    width: '100%',
                                    padding: '0.85rem 1rem 0.85rem 3rem',
                                    background: 'var(--bg-secondary)',
                                    border: `1px solid ${errors.name ? 'var(--danger)' : 'var(--border-color)'}`,
                                    borderRadius: '12px',
                                    color: 'var(--text-primary)',
                                    outline: 'none'
                                }}
                            />
                        </div>
                        {errors.name && <p style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.4rem' }}>{errors.name}</p>}
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>Service Category</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="custom-select-dark"
                            style={{
                                width: '100%',
                                padding: '0.85rem 1rem',
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '12px',
                                color: 'var(--text-primary)',
                                outline: 'none'
                            }}
                        >
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>Status</label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="custom-select-dark"
                            style={{
                                width: '100%',
                                padding: '0.85rem 1rem',
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '12px',
                                color: 'var(--text-primary)',
                                outline: 'none'
                            }}
                        >
                            <option value="active">Active</option>
                            <option value="pending">Pending</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>Contact Person</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="text"
                                value={formData.contactPerson}
                                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                                placeholder="John Doe"
                                style={{
                                    width: '100%',
                                    padding: '0.85rem 1rem 0.85rem 3rem',
                                    background: 'var(--bg-secondary)',
                                    border: `1px solid ${errors.contactPerson ? 'var(--danger)' : 'var(--border-color)'}`,
                                    borderRadius: '12px',
                                    color: 'var(--text-primary)',
                                    outline: 'none'
                                }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>Rating</label>
                        <div style={{ position: 'relative' }}>
                            <Star size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#f59e0b' }} />
                            <input
                                type="number"
                                step="0.1"
                                min="0"
                                max="5"
                                value={formData.rating}
                                onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                                style={{
                                    width: '100%',
                                    padding: '0.85rem 1rem 0.85rem 3rem',
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '12px',
                                    color: 'var(--text-primary)',
                                    outline: 'none'
                                }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="contact@company.com"
                                style={{
                                    width: '100%',
                                    padding: '0.85rem 1rem 0.85rem 3rem',
                                    background: 'var(--bg-secondary)',
                                    border: `1px solid ${errors.email ? 'var(--danger)' : 'var(--border-color)'}`,
                                    borderRadius: '12px',
                                    color: 'var(--text-primary)',
                                    outline: 'none'
                                }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>Phone Number</label>
                        <div style={{ position: 'relative' }}>
                            <Phone size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="+1 (555) 000-0000"
                                style={{
                                    width: '100%',
                                    padding: '0.85rem 1rem 0.85rem 3rem',
                                    background: 'var(--bg-secondary)',
                                    border: `1px solid ${errors.phone ? 'var(--danger)' : 'var(--border-color)'}`,
                                    borderRadius: '12px',
                                    color: 'var(--text-primary)',
                                    outline: 'none'
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            flex: 1,
                            padding: '0.85rem',
                            borderRadius: '12px',
                            background: 'rgba(255,255,255,0.05)',
                            color: 'white',
                            border: '1px solid var(--border-color)',
                            fontWeight: '700',
                            cursor: 'pointer'
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        style={{
                            flex: 2,
                            padding: '0.85rem',
                            borderRadius: '12px',
                            background: 'var(--primary)',
                            color: 'white',
                            border: 'none',
                            fontWeight: '800',
                            cursor: 'pointer',
                            boxShadow: '0 8px 16px -4px rgba(99, 102, 241, 0.4)'
                        }}
                    >
                        Create Vendor
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default AddVendorModal;
