import React, { useState } from 'react';
import {
    Save, Bell, Lock, Building, Globe, Shield, Database,
    RefreshCw, Settings as SettingsIcon, Mail, Phone, MapPin,
    Sparkles, Check, AlertCircle, Eye, EyeOff, Key, Terminal,
    History, Laptop, ShieldCheck, Download, Trash2, HardDrive,
    DollarSign, Percent, CreditCard, MessageSquare, Map as MapIcon,
    Cloud, Server, ShieldAlert, Cpu
} from 'lucide-react';

// --- Reusable Modern Components for Senior-Grade UI ---

const SettingCard = ({ children, title, subtitle, icon: Icon, gradient, onSave, isSaving, delay = '0ms' }) => (
    <div className="animate-slide-in-up" style={{ animationDelay: delay }}>
        <div style={{
            background: 'var(--bg-card)',
            borderRadius: '24px',
            border: '1px solid var(--border-color)',
            padding: '2.5rem',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            height: '100%',
            backdropFilter: 'blur(20px)',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}
            onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
                e.currentTarget.style.boxShadow = '0 20px 40px -12px rgba(0, 0, 0, 0.5)';
                e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                e.currentTarget.style.transform = 'translateY(0)';
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{
                        width: '56px',
                        height: '56px',
                        background: gradient || 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 12px 24px -8px rgba(99, 102, 241, 0.5)',
                        flexShrink: 0
                    }}>
                        <Icon size={28} style={{ color: 'white' }} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.025em' }}>{title}</h3>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: '0.25rem 0 0', lineHeight: '1.4' }}>{subtitle}</p>
                    </div>
                </div>
                {onSave && (
                    <button
                        onClick={onSave}
                        disabled={isSaving}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.6rem 1.25rem',
                            borderRadius: '12px',
                            background: isSaving ? 'var(--bg-tertiary)' : 'rgba(99, 102, 241, 0.1)',
                            color: isSaving ? 'var(--text-muted)' : 'var(--primary-light)',
                            border: `1px solid ${isSaving ? 'var(--border-color)' : 'rgba(99, 102, 241, 0.2)'}`,
                            fontSize: '0.85rem',
                            fontWeight: '700',
                            cursor: isSaving ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            if (!isSaving) {
                                e.currentTarget.style.background = 'var(--primary)';
                                e.currentTarget.style.color = 'white';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isSaving) {
                                e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
                                e.currentTarget.style.color = 'var(--primary-light)';
                            }
                        }}
                    >
                        {isSaving ? (
                            <RefreshCw size={16} className="animate-spin" />
                        ) : (
                            <Save size={16} />
                        )}
                        <span>{isSaving ? 'Saving...' : 'Save'}</span>
                    </button>
                )}
            </div>
            <div style={{ width: '100%', height: '1px', background: 'linear-gradient(90deg, var(--border-color), transparent)', marginBottom: '2rem' }}></div>
            {children}
        </div>
    </div>
);

const CustomInput = ({ label, icon: Icon, value, onChange, placeholder, type = 'text', suffix, error, required }) => (
    <div style={{ width: '100%', marginBottom: '1.5rem' }}>
        {label && (
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '0.6rem', letterSpacing: '0.025em' }}>
                {label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}
            </label>
        )}
        <div style={{ position: 'relative' }}>
            {Icon && (
                <Icon size={18} style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                    pointerEvents: 'none'
                }} />
            )}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                style={{
                    width: '100%',
                    padding: Icon ? '0.9rem 1rem 0.9rem 3rem' : '0.9rem 1rem',
                    paddingRight: suffix ? '3.5rem' : '1rem',
                    background: 'var(--bg-secondary)',
                    border: `1px solid ${error ? 'var(--danger)' : 'var(--border-color)'}`,
                    borderRadius: '14px',
                    color: 'var(--text-primary)',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                }}
                onFocus={(e) => {
                    e.target.style.borderColor = 'var(--primary)';
                    e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.15), inset 0 2px 4px rgba(0,0,0,0.1)';
                }}
                onBlur={(e) => {
                    e.target.style.borderColor = error ? 'var(--danger)' : 'var(--border-color)';
                    e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.1)';
                }}
            />
            {suffix && (
                <span style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    color: 'var(--text-muted)'
                }}>
                    {suffix}
                </span>
            )}
        </div>
    </div>
);

const CustomToggle = ({ checked, onChange, label, description }) => (
    <div
        onClick={() => onChange(!checked)}
        style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem',
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-color)',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
            e.currentTarget.style.borderColor = 'var(--border-color)';
        }}
    >
        <div style={{ flex: 1, paddingRight: '1.5rem' }}>
            <p style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>{label}</p>
            {description && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.4rem 0 0', lineHeight: '1.5' }}>{description}</p>}
        </div>
        <div
            style={{
                width: '48px',
                height: '26px',
                borderRadius: '99px',
                background: checked ? 'var(--primary)' : 'var(--bg-tertiary)',
                position: 'relative',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                flexShrink: 0,
                boxShadow: checked ? '0 0 20px rgba(99, 102, 241, 0.3)' : 'none'
            }}
        >
            <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: 'white',
                position: 'absolute',
                top: '3px',
                left: checked ? '25px' : '3px',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>
                {checked && <Check size={12} style={{ color: 'var(--primary)' }} />}
            </div>
        </div>
    </div>
);

// --- Senior-Grade Admin Settings Page ---

const Settings = () => {
    const [activeTab, setActiveTab] = useState('platform');
    const [toast, setToast] = useState(null);
    const [savingSections, setSavingSections] = useState({});

    // Platform & Revenue State
    const [config, setConfig] = useState({
        // Platform Info
        platformName: 'EventAllInOne',
        supportEmail: 'support@eventallinone.com',
        adminPhone: '+1 (555) 001-9922',

        // Revenue (Expert Level)
        vendorCommission: '12.5',
        platformFee: '5.00',
        taxRate: '8.0',
        minPayout: '100.00',
        payoutCycle: 'Weekly',

        // Integrations
        stripePublicKey: 'pk_test_51Mz...',
        stripeSecretKey: 'sk_test_51Mz...',
        googleMapsKey: 'AIzaSyA...',
        twilioSid: 'AC...',
        twilioAuth: '• • • • • • • • •',

        // Policies
        cancelBufferHours: '48',
        refundPercentage: '85',
        autoApproveVendors: false,
        verifyUserEmail: true
    });

    const showNotification = (message) => {
        setToast(message);
        setTimeout(() => setToast(null), 3500);
    };

    const handleSaveSection = async (sectionId) => {
        setSavingSections(prev => ({ ...prev, [sectionId]: true }));
        // Simulate Backend API Latency
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSavingSections(prev => ({ ...prev, [sectionId]: false }));
        showNotification(`${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)} settings synced with production.`);
    };

    const handleFieldChange = (field, value) => {
        setConfig(prev => ({ ...prev, [field]: value }));
    };

    const tabs = [
        { id: 'platform', label: 'Platform Info', icon: Cpu, gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)' },
        { id: 'revenue', label: 'Finance & Fees', icon: DollarSign, gradient: 'linear-gradient(135deg, #10b981, #059669)' },
        { id: 'integrations', label: 'API & Integrations', icon: Key, gradient: 'linear-gradient(135deg, #f59e0b, #d97706)' },
        { id: 'security', label: 'Auth & Logging', icon: ShieldCheck, gradient: 'linear-gradient(135deg, #ef4444, #b91c1c)' }
    ];

    return (
        <div style={{ position: 'relative', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>

            {/* Premium Toast */}
            {toast && (
                <div style={{
                    position: 'fixed',
                    bottom: '32px',
                    right: '32px',
                    zIndex: 1000,
                    background: 'var(--bg-card)',
                    borderRadius: '20px',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    padding: '1.25rem 2rem',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                    backdropFilter: 'blur(30px)',
                    animation: 'slideInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 16px rgba(16, 185, 129, 0.4)'
                    }}>
                        <Check size={20} color="white" />
                    </div>
                    <div>
                        <p style={{ margin: 0, fontWeight: '800', color: 'var(--text-primary)', fontSize: '0.95rem' }}>Cloud Sync Active</p>
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>{toast}</p>
                    </div>
                </div>
            )}

            {/* Global Header */}
            <div style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                marginBottom: '3.5rem',
                animation: 'slideInLeft 0.5s ease-out'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 12px 24px -10px rgba(99, 102, 241, 0.6)'
                    }}>
                        <SettingsIcon size={28} color="white" />
                    </div>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '2.25rem', fontWeight: '900', color: 'var(--text-primary)', letterSpacing: '-0.04em' }}>Settings</h1>
                        <p style={{ margin: '0.4rem 0 0', color: 'var(--text-muted)', fontSize: '1rem', fontWeight: '500' }}>Platform architecture and global business logic.</p>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }}></div>
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Production Mode</span>
                </div>
            </div>

            {/* Main Segmented Layout */}
            <div className="settings-grid" style={{
                display: 'grid',
                gap: '3rem',
                flex: 1,
                animation: 'fadeIn 0.7s ease-out'
            }}>

                {/* Vertical Navigation */}
                <aside style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1.15rem',
                                    padding: '1.25rem 1.75rem',
                                    borderRadius: '18px',
                                    border: '1px solid',
                                    borderColor: isActive ? 'rgba(99, 102, 241, 0.4)' : 'transparent',
                                    background: isActive ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-secondary)',
                                    color: isActive ? 'white' : 'var(--text-secondary)',
                                    fontWeight: isActive ? '800' : '600',
                                    textAlign: 'left',
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = 'var(--bg-hover)';
                                        e.currentTarget.style.color = 'var(--text-primary)';
                                        e.currentTarget.style.transform = 'translateX(6px)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = 'var(--bg-secondary)';
                                        e.currentTarget.style.color = 'var(--text-secondary)';
                                        e.currentTarget.style.transform = 'translateX(0)';
                                    }
                                }}
                            >
                                {isActive && (
                                    <div style={{
                                        position: 'absolute',
                                        left: 0,
                                        top: '20%',
                                        bottom: '20%',
                                        width: '5px',
                                        background: 'var(--primary)',
                                        borderRadius: '0 10px 10px 0',
                                        boxShadow: '0 0 15px var(--primary)'
                                    }}></div>
                                )}
                                <div style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '12px',
                                    background: isActive ? tab.gradient : 'var(--bg-tertiary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.3s ease',
                                    boxShadow: isActive ? '0 8px 16px -4px rgba(99, 102, 241, 0.4)' : 'none'
                                }}>
                                    <Icon size={20} style={{ color: isActive ? 'white' : 'var(--text-muted)' }} />
                                </div>
                                <span style={{ fontSize: '0.95rem' }}>{tab.label}</span>
                            </button>
                        );
                    })}

                    <div style={{ marginTop: 'auto', padding: '2rem', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '24px', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
                        <div style={{ display: 'flex', items: 'center', gap: '0.85rem', marginBottom: '1rem' }}>
                            <Server size={20} style={{ color: 'var(--primary)' }} />
                            <span style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-secondary)' }}>Infrastructure</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Core Node</span>
                                <span style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}>US-EAST-1</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>API Health</span>
                                <span style={{ color: '#10b981', fontWeight: '800' }}>99.98%</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>License</span>
                                <span style={{ color: 'var(--primary-light)', fontWeight: '700' }}>Enterprise</span>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Dynamic Content Views */}
                <main style={{ minHeight: '700px' }}>

                    {activeTab === 'platform' && (
                        <div className="animate-tab-content" style={{ display: 'grid', gap: '2.5rem' }}>
                            <SettingCard
                                title="Platform Identity"
                                subtitle="Core branding and primary contact channels for the event platform."
                                icon={Building}
                                onSave={() => handleSaveSection('branding')}
                                isSaving={savingSections.branding}
                                delay="100ms"
                            >
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <CustomInput label="Global Platform Name" value={config.platformName} onChange={(e) => handleFieldChange('platformName', e.target.value)} icon={Sparkles} required />
                                    </div>
                                    <CustomInput label="Public Support Email" type="email" value={config.supportEmail} onChange={(e) => handleFieldChange('supportEmail', e.target.value)} icon={Mail} required />
                                    <CustomInput label="Emergency Admin Phone" type="tel" value={config.adminPhone} onChange={(e) => handleFieldChange('adminPhone', e.target.value)} icon={Phone} />
                                </div>
                            </SettingCard>

                            <SettingCard
                                title="Global Localization"
                                subtitle="Standardize how time and value are handled across all regions."
                                icon={Globe}
                                gradient="linear-gradient(135deg, #3b82f6, #2563eb)"
                                onSave={() => handleSaveSection('localization')}
                                isSaving={savingSections.localization}
                                delay="200ms"
                            >
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>Master Timezone</label>
                                        <select className="custom-select-dark">
                                            <option>UTC-5 (New York)</option>
                                            <option>UTC+0 (London)</option>
                                            <option>UTC+5:30 (Mumbai)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>Settlement Currency</label>
                                        <select className="custom-select-dark">
                                            <option>USD ($)</option>
                                            <option>EUR (€)</option>
                                            <option>GBP (£)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>Locale Language</label>
                                        <select className="custom-select-dark">
                                            <option>English (US)</option>
                                            <option>International</option>
                                        </select>
                                    </div>
                                </div>
                            </SettingCard>
                        </div>
                    )}

                    {activeTab === 'revenue' && (
                        <div className="animate-tab-content" style={{ display: 'grid', gap: '2.5rem' }}>
                            <SettingCard
                                title="Platform Revenue Logic"
                                subtitle="Define the commission structure and fees applied to vendor transactions."
                                icon={DollarSign}
                                gradient="linear-gradient(135deg, #10b981, #059669)"
                                onSave={() => handleSaveSection('revenue')}
                                isSaving={savingSections.revenue}
                                delay="100ms"
                            >
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <CustomInput label="Vendor Commission Rate" value={config.vendorCommission} onChange={(e) => handleFieldChange('vendorCommission', e.target.value)} icon={Percent} suffix="%" />
                                    <CustomInput label="Fixed Service Fee" value={config.platformFee} onChange={(e) => handleFieldChange('platformFee', e.target.value)} icon={DollarSign} suffix="USD" />
                                    <CustomInput label="Global Tax Estimate" value={config.taxRate} onChange={(e) => handleFieldChange('taxRate', e.target.value)} icon={ShieldAlert} suffix="%" />
                                    <CustomInput label="Minimum Payout Threshold" value={config.minPayout} onChange={(e) => handleFieldChange('minPayout', e.target.value)} icon={CreditCard} suffix="USD" />
                                </div>
                            </SettingCard>

                            <SettingCard
                                title="Platform Policies"
                                subtitle="Automation rules for cancellations, refunds, and verifications."
                                icon={ShieldAlert}
                                gradient="linear-gradient(135deg, #8b5cf6, #6d28d9)"
                                onSave={() => handleSaveSection('policies')}
                                isSaving={savingSections.policies}
                                delay="200ms"
                            >
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <CustomToggle label="Instant Vendor Approval" description="Bypass manual admin review for new vendor registrations (High Risk)" checked={config.autoApproveVendors} onChange={(val) => handleFieldChange('autoApproveVendors', val)} />
                                    <CustomToggle label="Mandatory Email Verification" description="Require users to verify email before placing any bookings" checked={config.verifyUserEmail} onChange={(val) => handleFieldChange('verifyUserEmail', val)} />
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '0.5rem' }}>
                                        <CustomInput label="Cancellation Window" value={config.cancelBufferHours} onChange={(e) => handleFieldChange('cancelBufferHours', e.target.value)} icon={History} suffix="HOURS" />
                                        <CustomInput label="Base Refund Percentage" value={config.refundPercentage} onChange={(e) => handleFieldChange('refundPercentage', e.target.value)} icon={RefreshCw} suffix="%" />
                                    </div>
                                </div>
                            </SettingCard>
                        </div>
                    )}

                    {activeTab === 'integrations' && (
                        <div className="animate-tab-content" style={{ display: 'grid', gap: '2.5rem' }}>
                            <SettingCard
                                title="External APIs & Keys"
                                subtitle="Securely manage production keys for third-party infrastructure."
                                icon={Key}
                                gradient="linear-gradient(135deg, #f59e0b, #d97706)"
                                onSave={() => handleSaveSection('api')}
                                isSaving={savingSections.api}
                                delay="100ms"
                            >
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                                        <div style={{ display: 'flex', items: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                            <CreditCard size={20} style={{ color: '#6366f1' }} />
                                            <span style={{ fontSize: '1rem', fontWeight: '800', color: 'white' }}>Stripe Gateway</span>
                                        </div>
                                        <CustomInput label="Public API Key" value={config.stripePublicKey} onChange={(e) => handleFieldChange('stripePublicKey', e.target.value)} placeholder="pk_live_..." />
                                        <CustomInput label="Secret API Key" value={config.stripeSecretKey} onChange={(e) => handleFieldChange('stripeSecretKey', e.target.value)} type="password" placeholder="sk_live_..." />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                        <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                                            <div style={{ display: 'flex', items: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                                <MapIcon size={18} style={{ color: '#10b981' }} />
                                                <span style={{ fontSize: '0.9rem', fontWeight: '800' }}>Google Maps</span>
                                            </div>
                                            <CustomInput value={config.googleMapsKey} onChange={(e) => handleFieldChange('googleMapsKey', e.target.value)} placeholder="API Key" />
                                        </div>
                                        <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                                            <div style={{ display: 'flex', items: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                                <MessageSquare size={18} style={{ color: '#f59e0b' }} />
                                                <span style={{ fontSize: '0.9rem', fontWeight: '800' }}>Twilio SMS</span>
                                            </div>
                                            <CustomInput value={config.twilioSid} onChange={(e) => handleFieldChange('twilioSid', e.target.value)} placeholder="Account SID" />
                                        </div>
                                    </div>
                                </div>
                            </SettingCard>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="animate-tab-content" style={{ display: 'grid', gap: '2.5rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2.5rem' }}>
                                <SettingCard
                                    title="Access Control"
                                    subtitle="Define universal security standards for all administrative users."
                                    icon={ShieldCheck}
                                    onSave={() => handleSaveSection('security')}
                                    isSaving={savingSections.security}
                                >
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                        <CustomToggle label="Enforce 2FA" description="Force all admin-level users to configure TOTP or SMS verification" checked={true} onChange={() => { }} />
                                        <CustomToggle label="IP Whitelisting" description="Restrict dashboard access to recognized corporate IP addresses" checked={false} onChange={() => { }} />
                                        <div style={{ marginTop: '0.5rem' }}>
                                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>Session Absolute Timeout</label>
                                            <select className="custom-select-dark">
                                                <option>12 Hours</option>
                                                <option>24 Hours</option>
                                                <option>7 Days</option>
                                            </select>
                                        </div>
                                    </div>
                                </SettingCard>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                    <div className="system-utility-card">
                                        <div className="icon"><Terminal size={20} /></div>
                                        <div className="text">
                                            <h4>Audit Logs</h4>
                                            <p>Access full immutable ledger of system changes.</p>
                                        </div>
                                        <button className="util-btn">View logs</button>
                                    </div>
                                    <div className="system-utility-card">
                                        <div className="icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}><Trash2 size={20} /></div>
                                        <div className="text">
                                            <h4>Flush Cache</h4>
                                            <p>Instantly clear Redis and CDN object caches.</p>
                                        </div>
                                        <button className="util-btn danger">Flush now</button>
                                    </div>
                                    <div className="system-utility-card">
                                        <div className="icon" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}><Download size={20} /></div>
                                        <div className="text">
                                            <h4>Data Export</h4>
                                            <p>JSON/CSV dump of platform configuration.</p>
                                        </div>
                                        <button className="util-btn">Export</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </main>
            </div>

            <style jsx>{`
                .settings-grid {
                    grid-template-columns: 300px 1fr;
                }

                @media (max-width: 1200px) {
                    .settings-grid {
                        grid-template-columns: 1fr;
                        gap: 2rem;
                    }
                }

                .custom-select-dark {
                    width: 100%;
                    padding: 0.9rem 1rem;
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-color);
                    border-radius: 14px;
                    color: var(--text-primary);
                    font-size: 0.95rem;
                    font-weight: 600;
                    cursor: pointer;
                    outline: none;
                    transition: all 0.2s ease;
                    appearance: none;
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'%3E%3C/path%3E%3C/svg%3E");
                    background-repeat: no-repeat;
                    background-position: right 14px center;
                }

                .custom-select-dark:focus {
                    border-color: var(--primary);
                    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.15);
                }

                .system-utility-card {
                    background: var(--bg-card);
                    padding: 1.5rem;
                    border-radius: 20px;
                    border: 1px solid var(--border-color);
                    display: flex;
                    align-items: center;
                    gap: 1.25rem;
                    transition: all 0.3s ease;
                }

                .system-utility-card:hover {
                    border-color: rgba(99, 102, 241, 0.3);
                    transform: translateX(8px);
                }

                .system-utility-card .icon {
                    width: 44px;
                    height: 44px;
                    borderRadius: 12px;
                    background: rgba(99, 102, 241, 0.1);
                    color: var(--primary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .system-utility-card .text { flex: 1; }
                .system-utility-card h4 { margin: 0 0 0.2rem; fontSize: '1rem'; fontWeight: '800'; color: 'var(--text-primary)' }
                .system-utility-card p { margin: 0; fontSize: '0.8rem'; color: 'var(--text-muted)' }

                .util-btn {
                    padding: 0.5rem 1rem;
                    border-radius: 10px;
                    background: var(--bg-tertiary);
                    border: 1px solid var(--border-color);
                    color: var(--text-primary);
                    font-size: 0.75rem;
                    font-weight: 800;
                    cursor: pointer;
                    transition: all 0.2s;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .util-btn:hover { background: var(--primary); color: white; border-color: var(--primary); }
                .util-btn.danger:hover { background: var(--danger); border-color: var(--danger); }

                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes slideInLeft { from { transform: translateX(-40px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
                @keyframes slideInUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                .animate-spin { animation: spin 1.2s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .animate-tab-content { animation: fadeInScale 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
                @keyframes fadeInScale { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
            `}</style>
        </div>
    );
};

export default Settings;
