// =====================================================
// BOOKING SERVICE - Centralized data management
// =====================================================
// This service manages venue data, availability, and bookings
// In production, this would connect to your backend API

class BookingService {
    constructor() {
        // Simulated database of venues/services
        this.venues = new Map()
        this.bookings = new Map()
        this.listeners = new Set()

        // Initialize with sample data
        this.initializeSampleData()
    }

    // Initialize sample venues
    initializeSampleData() {
        const sampleVenues = [
            {
                id: "grand-plaza-hall",
                name: "Grand Plaza Hall",
                location: "hyderabad",
                fullAddress: "123 Event Street, Downtown City Center, Hyderabad 500001, Telangana, India",
                rating: 4.8,
                reviews: 245,
                capacity: "500 Guests",
                description: "A premium banquet hall perfect for weddings, corporate events, and large celebrations.",
                amenities: ["AC", "Parking", "Catering", "Stage", "Sound System", "Decoration"],
                category: "Venue",
                priceRange: { min: 25000, max: 75000 },
                minAdvanceBooking: 3,
                timeSlots: [
                    { id: "1", time: "09:00 AM - 12:00 PM", basePrice: 25000 },
                    { id: "2", time: "01:00 PM - 04:00 PM", basePrice: 28000 },
                    { id: "3", time: "06:00 PM - 10:00 PM", basePrice: 35000 },
                ]
            },
            {
                id: "elegance-photography",
                name: "Elegance Photography",
                location: "karimnagar",
                fullAddress: "789 Studio Street, Karimnagar 505001, Telangana, India",
                rating: 4.9,
                reviews: 312,
                capacity: "Any size",
                description: "Professional photography services for weddings, events, and portraits.",
                amenities: ["Studio", "Outdoor Shoots", "Editing", "Album"],
                category: "Photography",
                priceRange: { min: 15000, max: 50000 },
                minAdvanceBooking: 7,
                timeSlots: [
                    { id: "1", time: "Full Day (8 Hours)", basePrice: 50000 },
                    { id: "2", time: "Half Day (4 Hours)", basePrice: 30000 },
                ]
            },
            {
                id: "decorators",
                name: "Creative Decorators",
                location: "warangal",
                fullAddress: "456 Decor Lane, Warangal 506001, Telangana, India",
                rating: 4.7,
                reviews: 156,
                capacity: "N/A",
                description: "Stun your guests with our theme-based decorations and floral arrangements.",
                amenities: ["Theme Decor", "Floral", "Lighting", "Stage Design"],
                category: "Decoration",
                priceRange: { min: 10000, max: 40000 },
                minAdvanceBooking: 5,
                timeSlots: [
                    { id: "1", time: "Event Decoration Service", basePrice: 25000 },
                ]
            },
            {
                id: "caterers",
                name: "Royal Catering",
                location: "hyderabad",
                fullAddress: "789 Cuisine Road, Hyderabad 500033, Telangana, India",
                rating: 4.6,
                reviews: 420,
                capacity: "1000+ Guests",
                description: "Delicious multi-cuisine catering services for all types of events.",
                amenities: ["Veg", "Non-Veg", "Desserts", "Custom Menu"],
                category: "Catering",
                priceRange: { min: 500, max: 2000 },
                minAdvanceBooking: 10,
                timeSlots: [
                    { id: "1", time: "Dinner Service (7:00 PM - 11:00 PM)", basePrice: 45000 },
                    { id: "2", time: "Lunch Service (12:00 PM - 3:00 PM)", basePrice: 35000 },
                ]
            },
            {
                id: "djs",
                name: "Top Beat DJs",
                location: "nalgonda",
                fullAddress: "12 Music Square, Nalgonda 508001, Telangana, India",
                rating: 4.8,
                reviews: 95,
                capacity: "Any",
                description: "High-energy music and professional sound systems for parties.",
                amenities: ["Professional Audio", "Lighting", "MC Service"],
                category: "Entertainment",
                priceRange: { min: 8000, max: 25000 },
                minAdvanceBooking: 4,
                timeSlots: [
                    { id: "1", time: "Evening Party (7 PM - 12 AM)", basePrice: 15000 },
                ]
            },
            {
                id: "hotels",
                name: "Luxury Stay Hotel",
                location: "hyderabad",
                fullAddress: "100 Luxury Plaza, Hyderabad 500081, Telangana, India",
                rating: 4.5,
                reviews: 1200,
                capacity: "200 Rooms",
                description: "Premium accommodation and banquet services in the heart of the city.",
                amenities: ["AC", "WiFi", "Pool", "Meeting Rooms"],
                category: "Hotel",
                priceRange: { min: 3500, max: 12000 },
                minAdvanceBooking: 2,
                timeSlots: [
                    { id: "1", time: "Day Stay / Conference", basePrice: 35000 },
                    { id: "2", time: "Overnight Event", basePrice: 55000 },
                ]
            }
        ]

        sampleVenues.forEach(venue => {
            this.venues.set(venue.id, venue)
        })
    }

    // Get all venues
    getAllVenues() {
        return Array.from(this.venues.values())
    }

    // Get venue by ID
    getVenueById(venueId) {
        return this.venues.get(venueId) || null
    }

    // Get venues by category
    getVenuesByCategory(category) {
        return this.getAllVenues().filter(v => v.category === category)
    }

    // Get availability for a specific date and venue
    getAvailability(venueId, date) {
        const venue = this.getVenueById(venueId)
        if (!venue) return null

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const minBookingDate = new Date(today)
        minBookingDate.setDate(minBookingDate.getDate() + (venue.minAdvanceBooking || 3))

        // Past dates or dates within minimum advance booking period
        if (date < minBookingDate) return null

        // Check existing bookings for this date
        const dateKey = this.formatDateKey(date)
        const existingBookings = this.getBookingsForDate(venueId, dateKey)

        // Calculate slot availability
        const slots = venue.timeSlots.map(slot => {
            const isBooked = existingBookings.some(b => b.slotId === slot.id)
            const bookingsForSlot = existingBookings.filter(b => b.slotId === slot.id).length
            const maxCapacity = 1 // Each slot can only be booked once per day

            let status = "available"
            let slotsLeft = maxCapacity - bookingsForSlot

            if (slotsLeft === 0 || isBooked) {
                status = "full"
                slotsLeft = 0
            } else if (this.isHighDemandDate(date)) {
                status = "fast-filling"
            }

            return {
                ...slot,
                price: this.calculatePrice(slot.basePrice, date),
                status,
                slotsLeft
            }
        })

        return slots
    }

    // Get day-level availability status
    getDayAvailability(venueId, date) {
        const slots = this.getAvailability(venueId, date)
        if (!slots) return null

        const availableSlots = slots.filter(s => s.status !== "full")
        if (availableSlots.length === 0) return "full"
        if (availableSlots.some(s => s.status === "fast-filling")) return "fast-filling"
        return "available"
    }

    // Check if date is high demand (weekends, holidays)
    isHighDemandDate(date) {
        const day = date.getDay()
        const dateNum = date.getDate()
        // Weekends and certain dates are high demand
        return day === 0 || day === 6 || dateNum % 5 === 0 || dateNum % 11 === 0
    }

    // Calculate dynamic pricing
    calculatePrice(basePrice, date) {
        let price = basePrice
        const day = date.getDay()

        // Weekend surcharge (20%)
        if (day === 0 || day === 6) {
            price = Math.round(price * 1.2)
        }

        // Holiday/peak season surcharge (15%)
        const month = date.getMonth()
        if (month === 11 || month === 0 || month === 10) { // Nov, Dec, Jan
            price = Math.round(price * 1.15)
        }

        return price
    }

    // Format date as key for storage
    formatDateKey(date) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    }

    // Get bookings for a specific date
    getBookingsForDate(venueId, dateKey) {
        const bookingKey = `${venueId}:${dateKey}`
        return this.bookings.get(bookingKey) || []
    }

    // Create a new booking
    createBooking(bookingData) {
        const {
            venueId,
            date,
            slotId,
            customerName,
            customerEmail,
            customerPhone,
            eventType,
            guestCount,
            specialRequests,
            paymentMethod,
            amount
        } = bookingData

        // Generate booking reference
        const bookingRef = `EVT${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`

        const booking = {
            id: bookingRef,
            venueId,
            date,
            slotId,
            customerName,
            customerEmail,
            customerPhone,
            eventType,
            guestCount,
            specialRequests,
            paymentMethod,
            amount,
            status: "confirmed",
            createdAt: new Date().toISOString()
        }

        // Store the booking
        const dateKey = this.formatDateKey(new Date(date))
        const bookingKey = `${venueId}:${dateKey}`
        const existingBookings = this.bookings.get(bookingKey) || []
        existingBookings.push(booking)
        this.bookings.set(bookingKey, existingBookings)

        // Notify listeners of the update
        this.notifyListeners()

        return booking
    }

    // Get all bookings for a venue
    getVenueBookings(venueId) {
        const allBookings = []
        this.bookings.forEach((bookings, key) => {
            if (key.startsWith(venueId)) {
                allBookings.push(...bookings)
            }
        })
        return allBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }

    // Subscribe to booking updates
    subscribe(callback) {
        this.listeners.add(callback)
        return () => this.listeners.delete(callback)
    }

    // Notify all listeners of changes
    notifyListeners() {
        this.listeners.forEach(callback => callback())
    }

    // Validate coupon code
    validateCoupon(code) {
        const coupons = {
            'SAVE10': { discount: 10, description: '10% off your booking' },
            'WELCOME20': { discount: 20, description: '20% off for new users' },
            'FIRST50': { discount: 50, description: '50% off first booking' },
            'WEEKEND15': { discount: 15, description: '15% off weekend bookings' },
        }

        return coupons[code.toUpperCase()] || null
    }
}

// Create singleton instance
const bookingService = new BookingService()

export default bookingService
