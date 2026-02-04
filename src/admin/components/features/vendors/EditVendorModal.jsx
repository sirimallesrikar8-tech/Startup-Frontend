import React, { useState, useEffect } from 'react';
import Modal from '../../ui/Modal';
import { User, Mail, Phone, Store, Star } from 'lucide-react';

const EditVendorModal = ({ isOpen, onClose, onUpdate, vendor, categories }) => {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        email: '',
        phone: '',
        rating: 0,
        status: 'active',
        contactPerson: '',
        joinedDate: '',
        totalEvents: 0,
        revenue: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen && vendor) {
            setFormData({
                ...vendor,
                // Ensure keys match form even if data uses different names
                name: vendor.name || vendor.companyName,
                category: vendor.category || vendor.services
            });
            setErrors({});
        }
    }, [isOpen, vendor]);

    const validate = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Company name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.phone) newErrors.phone = 'Phone is required';
        if (!formData.contactPerson) newErrors.contactPerson = 'Contact person is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onUpdate(formData);
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Vendor Profile" size="md">
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
                        Save Changes
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default EditVendorModal;
