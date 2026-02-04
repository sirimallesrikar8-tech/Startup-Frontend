import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import VendorService from '../services/VendorService';
import { useToast } from '../context/ToastContext';

export const useVendorManagement = () => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, active: 0, pending: 0, revenue: '$0' });
    const { success, error: toastError } = useToast();
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
        return () => { isMounted.current = false; };
    }, []);

    const escapeCSV = (val) => {
        if (val === null || val === undefined) return '';
        let result = val.toString();
        if (['=', '+', '-', '@'].includes(result[0])) result = "'" + result;
        if (result.includes(',') || result.includes('"') || result.includes('\n')) {
            result = `"${result.replace(/"/g, '""')}"`;
        }
        return result;
    };

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');

    // Debounce search query
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 300);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [vendorsRes, statsRes] = await Promise.all([
                VendorService.getVendors(),
                VendorService.getVendorStats()
            ]);

            if (!isMounted.current) return;

            if (vendorsRes.success) {
                setVendors(vendorsRes.data);
            }
            setStats(statsRes);
        } catch (err) {
            if (isMounted.current) {
                toastError('Failed to load vendor data. Please try again.');
                console.error(err);
            }
        } finally {
            if (isMounted.current) setLoading(false);
        }
    }, [toastError]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAdd = async (newVendor) => {
        try {
            const res = await VendorService.addVendor(newVendor);
            if (res.success) {
                setVendors(prev => [res.data, ...prev]);
                success(`Vendor "${res.data.name}" added successfully.`);
                // Refresh stats
                const newStats = await VendorService.getVendorStats();
                setStats(newStats);
                return true;
            }
        } catch (err) {
            toastError('Failed to add vendor.');
            return false;
        }
    };

    const handleUpdate = async (vendor) => {
        try {
            const res = await VendorService.updateVendor(vendor.id, vendor);
            if (res.success) {
                setVendors(prev => prev.map(v => v.id === vendor.id ? res.data : v));
                success(`Vendor profile updated.`);
                return true;
            }
        } catch (err) {
            toastError('Failed to update vendor.');
            return false;
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await VendorService.deleteVendor(id);
            if (res.success) {
                setVendors(prev => prev.filter(v => v.id !== id));
                success('Vendor removed from system.');
                const newStats = await VendorService.getVendorStats();
                setStats(newStats);
                return true;
            }
        } catch (err) {
            toastError('Failed to delete vendor.');
            return false;
        }
    };

    const handleBulkDelete = async (ids) => {
        try {
            const res = await VendorService.bulkDelete(ids);
            if (res.success) {
                setVendors(prev => prev.filter(v => !ids.includes(v.id)));
                success(`${ids.length} vendors deleted successfully.`);
                const newStats = await VendorService.getVendorStats();
                setStats(newStats);
                return true;
            }
        } catch (err) {
            toastError('Bulk deletion failed.');
            return false;
        }
    };

    const handleBulkStatusChange = async (ids, status) => {
        try {
            const res = await VendorService.bulkUpdate(ids, { status });
            if (res.success) {
                setVendors(prev => prev.map(v => ids.includes(v.id) ? { ...v, status } : v));
                success(`Status updated for ${ids.length} vendors.`);
                const newStats = await VendorService.getVendorStats();
                setStats(newStats);
                return true;
            }
        } catch (err) {
            toastError('Bulk status update failed.');
            return false;
        }
    };

    const exportToCSV = () => {
        const headers = ['ID', 'Name', 'Email', 'Phone', 'Category', 'Status', 'Rating', 'Joined Date'];
        const rows = filteredVendors.map(v => [
            v.id, v.name || v.companyName, v.email, v.phone, v.category || v.services, v.status, v.rating, v.joinedDate
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(escapeCSV).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vendors-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        success('Vendor data exported!');
    };

    const filteredVendors = useMemo(() => {
        return vendors.filter(vendor => {
            const name = (vendor.name || vendor.companyName || '').toLowerCase();
            const email = (vendor.email || '').toLowerCase();
            const query = debouncedSearch.toLowerCase();

            const matchesSearch = name.includes(query) || email.includes(query);
            const matchesStatus = statusFilter === 'all' || vendor.status === statusFilter;
            const matchesCategory = categoryFilter === 'all' || (vendor.category || vendor.services) === categoryFilter;

            return matchesSearch && matchesStatus && matchesCategory;
        });
    }, [vendors, debouncedSearch, statusFilter, categoryFilter]);

    const categories = useMemo(() => {
        const cats = vendors.map(v => v.category || v.services).filter(Boolean);
        return [...new Set(cats)];
    }, [vendors]);

    return {
        vendors: filteredVendors,
        allVendors: vendors,
        loading,
        stats,
        categories,
        filters: {
            searchQuery, setSearchQuery,
            statusFilter, setStatusFilter,
            categoryFilter, setCategoryFilter
        },
        actions: {
            handleAdd,
            handleUpdate,
            handleDelete,
            handleBulkDelete,
            handleBulkStatusChange,
            exportToCSV,
            refresh: fetchData
        }
    };
};
