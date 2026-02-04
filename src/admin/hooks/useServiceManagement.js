import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import servicesService from '../services/servicesService';
import { useToast } from '../context/ToastContext';

export const useServiceManagement = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalServices: 0,
        totalVendors: 0,
        totalBookings: 0,
        avgRating: 0,
        trendingServices: 0
    });

    const { success, error: toastError } = useToast();
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
        return () => { isMounted.current = false; };
    }, []);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [servicesRes, statsRes] = await Promise.all([
                servicesService.getAll(),
                servicesService.getStats()
            ]);

            if (!isMounted.current) return;

            // Use only backend data, no mock fallback
            const finalServices = servicesRes.data || [];

            setServices(finalServices);

            if (statsRes.data) {
                setStats(statsRes.data);
            } else {
                setStats(calculateStats(finalServices));
            }
        } catch (err) {
            if (isMounted.current) {
                toastError('Failed to fetch services. Please try again.');
                console.error(err);
                // Set empty array on error instead of mock data
                setServices([]);
            }
        } finally {
            if (isMounted.current) setLoading(false);
        }
    }, [toastError]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAdd = async (newService) => {
        try {
            const res = await servicesService.create(newService);
            if (res) {
                setServices(prev => [res.data || newService, ...prev]);
                success('Service added successfully');
                return true;
            }
        } catch (err) {
            toastError('Failed to add service');
            return false;
        }
    };

    const handleUpdate = async (id, updatedData) => {
        try {
            const res = await servicesService.update(id, updatedData);
            if (res) {
                setServices(prev => prev.map(s => s.id === id ? { ...s, ...updatedData } : s));
                success('Service updated successfully');
                return true;
            }
        } catch (err) {
            toastError('Failed to update service');
            return false;
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await servicesService.delete(id);
            if (res) {
                setServices(prev => prev.filter(s => s.id !== id));
                success('Service deleted successfully');
                return true;
            }
        } catch (err) {
            toastError('Failed to delete service');
            return false;
        }
    };

    return {
        services,
        loading,
        stats,
        actions: {
            handleAdd,
            handleUpdate,
            handleDelete,
            refresh: fetchData
        }
    };
};

const calculateStats = (data) => ({
    totalServices: data.length,
    totalVendors: data.reduce((acc, s) => acc + s.vendors, 0),
    totalBookings: data.reduce((acc, s) => acc + s.bookings, 0),
    avgRating: data.length > 0 ? (data.reduce((acc, s) => acc + s.rating, 0) / data.length).toFixed(1) : 0,
    trendingServices: data.filter(s => s.trending).length
});
