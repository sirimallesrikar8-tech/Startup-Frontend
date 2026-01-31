import React from "react"
import { Calendar, Clock, Timer, ShieldCheck, Tag } from "lucide-react"

const TAX_RATE = 0.09

export function BookingSummary({
    service,
    selectedDate,
    selectedSlot,
    couponCode,
    appliedDiscount,
    onCouponChange,
    onApplyCoupon,
    onProceedToBook,
    onChangeDate,
}) {
    const slotPrice = selectedSlot?.price || 0
    const discountAmount = (slotPrice * appliedDiscount) / 100
    const afterDiscount = slotPrice - discountAmount
    const taxes = afterDiscount * TAX_RATE
    const total = afterDiscount + taxes

    const styles = {
        card: {
            background: "white",
            borderRadius: "16px",
            padding: "1.5rem",
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
            border: "1px solid #f1f5f9",
        },
        title: {
            fontSize: "1.25rem",
            fontWeight: "700",
            color: "#1e293b",
            marginBottom: "1.5rem",
        },
        serviceInfo: {
            display: "flex",
            gap: "0.75rem",
            marginBottom: "1.5rem",
        },
        serviceIcon: {
            height: "64px",
            width: "64px",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            fontSize: "1.5rem",
        },
        serviceDetails: {
            flex: 1,
            minWidth: 0,
        },
        serviceName: {
            fontWeight: "600",
            color: "#1e293b",
            marginBottom: "0.25rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
        },
        serviceType: {
            fontSize: "0.875rem",
            color: "#64748b",
            marginBottom: "0.25rem",
        },
        serviceLocation: {
            fontSize: "0.75rem",
            color: "#94a3b8",
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
        },
        separator: {
            height: "1px",
            background: "#f1f5f9",
            margin: "1rem 0",
        },
        detailRow: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "0.875rem",
            marginBottom: "0.75rem",
        },
        detailLabel: {
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "#64748b",
        },
        detailValue: {
            fontWeight: "500",
            color: "#1e293b",
        },
        couponSection: {
            marginBottom: "1rem",
        },
        couponLabel: {
            fontSize: "0.875rem",
            fontWeight: "500",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.5rem",
            color: "#1e293b",
        },
        couponInputGroup: {
            display: "flex",
            gap: "0.5rem",
        },
        couponInput: {
            flex: 1,
            padding: "0.625rem 0.875rem",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            fontSize: "0.875rem",
            outline: "none",
            transition: "border-color 0.2s",
        },
        couponButton: {
            padding: "0.625rem 1rem",
            border: "1px solid #ffc107",
            borderRadius: "8px",
            background: "transparent",
            color: "#495057",
            fontWeight: "500",
            fontSize: "0.875rem",
            cursor: "pointer",
            transition: "all 0.2s",
        },
        discountApplied: {
            fontSize: "0.75rem",
            color: "#16a34a",
            marginTop: "0.5rem",
        },
        couponHint: {
            fontSize: "0.75rem",
            color: "#94a3b8",
            marginTop: "0.25rem",
        },
        priceRow: {
            display: "flex",
            justifyContent: "space-between",
            fontSize: "0.875rem",
            marginBottom: "0.5rem",
        },
        priceLabel: {
            color: "#64748b",
        },
        priceValue: {
            fontWeight: "500",
            color: "#1e293b",
        },
        discountRow: {
            display: "flex",
            justifyContent: "space-between",
            fontSize: "0.875rem",
            marginBottom: "0.5rem",
            color: "#16a34a",
        },
        totalRow: {
            display: "flex",
            justifyContent: "space-between",
            fontSize: "1.125rem",
            fontWeight: "700",
        },
        totalLabel: {
            color: "#1e293b",
        },
        totalValue: {
            color: "#ffc107",
        },
        primaryButton: {
            width: "100%",
            padding: "0.875rem 1.5rem",
            background: "#ffc107",
            color: "#212529",
            border: "none",
            borderRadius: "12px",
            fontWeight: "600",
            fontSize: "1rem",
            cursor: "pointer",
            transition: "all 0.2s",
            marginBottom: "0.5rem",
        },
        primaryButtonDisabled: {
            opacity: 0.5,
            cursor: "not-allowed",
        },
        secondaryButton: {
            width: "100%",
            padding: "0.75rem 1rem",
            background: "transparent",
            color: "#64748b",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            fontWeight: "500",
            fontSize: "0.875rem",
            cursor: "pointer",
            transition: "all 0.2s",
        },
        trustBadge: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            fontSize: "0.75rem",
            color: "#64748b",
            background: "#f8fafc",
            padding: "0.75rem",
            borderRadius: "8px",
            marginTop: "1rem",
        },
    }

    return (
        <div style={styles.card}>
            <h3 style={styles.title}>Booking Summary</h3>

            {/* Service Info */}
            <div style={styles.serviceInfo}>
                <div style={styles.serviceIcon}>
                    <span>🏛️</span>
                </div>
                <div style={styles.serviceDetails}>
                    <div style={styles.serviceName}>{service.name}</div>
                    <div style={styles.serviceType}>Venue Service</div>
                    <div style={styles.serviceLocation}>
                        <span>📍</span>
                        <span>{service.location}</span>
                    </div>
                </div>
            </div>

            <div style={styles.separator} />

            {/* Selected Details */}
            <div>
                <div style={styles.detailRow}>
                    <div style={styles.detailLabel}>
                        <Calendar size={16} />
                        <span>Date</span>
                    </div>
                    <span style={styles.detailValue}>
                        {selectedDate
                            ? selectedDate.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            })
                            : "Not selected"}
                    </span>
                </div>

                <div style={styles.detailRow}>
                    <div style={styles.detailLabel}>
                        <Clock size={16} />
                        <span>Time</span>
                    </div>
                    <span style={styles.detailValue}>{selectedSlot?.time || "Not selected"}</span>
                </div>

                <div style={styles.detailRow}>
                    <div style={styles.detailLabel}>
                        <Timer size={16} />
                        <span>Duration</span>
                    </div>
                    <span style={styles.detailValue}>{selectedSlot ? "4 Hours" : "-"}</span>
                </div>
            </div>

            <div style={styles.separator} />

            {/* Coupon Code */}
            <div style={styles.couponSection}>
                <label style={styles.couponLabel}>
                    <Tag size={16} />
                    Have a coupon code?
                </label>
                <div style={styles.couponInputGroup}>
                    <input
                        type="text"
                        placeholder="Enter code"
                        value={couponCode}
                        onChange={(e) => onCouponChange(e.target.value.toUpperCase())}
                        style={styles.couponInput}
                        onFocus={(e) => e.target.style.borderColor = "#ffc107"}
                        onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                    />
                    <button
                        style={styles.couponButton}
                        onClick={onApplyCoupon}
                        onMouseEnter={(e) => e.target.style.background = "#fffbeb"}
                        onMouseLeave={(e) => e.target.style.background = "transparent"}
                    >
                        Apply
                    </button>
                </div>
                {appliedDiscount > 0 && (
                    <p style={styles.discountApplied}>✓ {appliedDiscount}% discount applied!</p>
                )}
                <p style={styles.couponHint}>Try: SAVE10 or WELCOME20</p>
            </div>

            <div style={styles.separator} />

            {/* Price Breakdown */}
            <div>
                <div style={styles.priceRow}>
                    <span style={styles.priceLabel}>Slot Price</span>
                    <span style={styles.priceValue}>₹{slotPrice.toLocaleString()}</span>
                </div>
                {appliedDiscount > 0 && (
                    <div style={styles.discountRow}>
                        <span>Discount ({appliedDiscount}%)</span>
                        <span>-₹{discountAmount.toLocaleString()}</span>
                    </div>
                )}
                <div style={styles.priceRow}>
                    <span style={styles.priceLabel}>Taxes (9%)</span>
                    <span style={styles.priceValue}>₹{Math.round(taxes).toLocaleString()}</span>
                </div>

                <div style={styles.separator} />

                <div style={styles.totalRow}>
                    <span style={styles.totalLabel}>Total</span>
                    <span style={styles.totalValue}>₹{Math.round(total).toLocaleString()}</span>
                </div>
            </div>

            <div style={styles.separator} />

            {/* Action Buttons */}
            <div>
                <button
                    style={{
                        ...styles.primaryButton,
                        ...(!selectedDate || !selectedSlot ? styles.primaryButtonDisabled : {}),
                    }}
                    disabled={!selectedDate || !selectedSlot}
                    onClick={onProceedToBook}
                    onMouseEnter={(e) => {
                        if (selectedDate && selectedSlot) {
                            e.target.style.transform = "scale(1.02)"
                            e.target.style.boxShadow = "0 4px 12px rgba(255, 193, 7, 0.4)"
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = "scale(1)"
                        e.target.style.boxShadow = "none"
                    }}
                >
                    Proceed to Book →
                </button>

                {selectedDate && (
                    <button
                        style={styles.secondaryButton}
                        onClick={onChangeDate}
                        onMouseEnter={(e) => {
                            e.target.style.background = "#f8fafc"
                            e.target.style.borderColor = "#cbd5e1"
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = "transparent"
                            e.target.style.borderColor = "#e2e8f0"
                        }}
                    >
                        Change Date
                    </button>
                )}
            </div>

            {/* Trust Badge */}
            <div style={styles.trustBadge}>
                <ShieldCheck size={16} style={{ color: "#ffc107" }} />
                <span>Secure Booking with EventAllInOne Guarantee</span>
            </div>
        </div>
    )
}

export default BookingSummary
