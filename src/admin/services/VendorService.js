import { vendorsData } from '../data/vendorsData';

/**
 * Service to handle all Vendor related API calls.
 * Integrated with mock data for now, ready for REST API replacement.
 */
class VendorService {
    constructor() {
        this.vendors = [...vendorsData];
    }

    async getVendors() {
        // Simulate API latency
        await new Promise(resolve => setTimeout(resolve, 800));
        return {
            success: true,
            data: this.vendors,
            timestamp: new Date().toISOString()
        };
    }

    async addVendor(vendor) {
        await new Promise(resolve => setTimeout(resolve, 600));
        const newVendor = {
            ...vendor,
            id: Date.now(),
            joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            totalEvents: 0,
            rating: 5.0,
            status: 'active'
        };
        this.vendors = [newVendor, ...this.vendors];
        return { success: true, data: newVendor };
    }

    async updateVendor(id, updates) {
        await new Promise(resolve => setTimeout(resolve, 600));
        this.vendors = this.vendors.map(v => v.id === id ? { ...v, ...updates } : v);
        return { success: true, data: this.vendors.find(v => v.id === id) };
    }

    async deleteVendor(id) {
        await new Promise(resolve => setTimeout(resolve, 600));
        this.vendors = this.vendors.filter(v => v.id !== id);
        return { success: true, message: 'Vendor deleted successfully' };
    }

    async bulkDelete(ids) {
        await new Promise(resolve => setTimeout(resolve, 800));
        this.vendors = this.vendors.filter(v => !ids.includes(v.id));
        return { success: true, message: `${ids.length} vendors deleted` };
    }

    async bulkUpdate(ids, updates) {
        await new Promise(resolve => setTimeout(resolve, 800));
        this.vendors = this.vendors.map(v =>
            ids.includes(v.id) ? { ...v, ...updates } : v
        );
        return { success: true, message: `${ids.length} vendors updated` };
    }

    async getVendorStats() {
        await new Promise(resolve => setTimeout(resolve, 400));
        const active = this.vendors.filter(v => v.status === 'active').length;
        const pending = this.vendors.filter(v => v.status === 'pending').length;
        const total = this.vendors.length;
        const revenue = this.vendors.reduce((sum, v) => sum + parseInt((v.revenue || '$0').replace(/[^0-9]/g, '')), 0);

        return {
            total,
            active,
            pending,
            revenue: '$' + revenue.toLocaleString()
        };
    }
}

export default new VendorService();
