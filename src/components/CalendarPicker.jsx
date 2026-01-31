import React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]

export function CalendarPicker({
    currentMonth,
    selectedDate,
    onDateSelect,
    onPrevMonth,
    onNextMonth,
    getDayAvailability,
}) {
    const getDaysInMonth = () => {
        const year = currentMonth.getFullYear()
        const month = currentMonth.getMonth()
        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)
        const daysInMonth = lastDay.getDate()
        const startingDayOfWeek = firstDay.getDay()

        const days = []

        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null)
        }

        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day))
        }

        return days
    }

    const days = getDaysInMonth()
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const styles = {
        container: {
            background: "white",
            borderRadius: "20px",
            padding: "1.5rem",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            border: "1px solid #f1f5f9",
        },
        header: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            marginBottom: "1.5rem",
            flexWrap: "wrap",
        },
        title: {
            fontSize: "1.25rem",
            fontWeight: "700",
            color: "#1e293b",
            margin: 0,
        },
        legend: {
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginTop: "0.5rem",
            fontSize: "0.75rem",
            flexWrap: "wrap",
        },
        legendItem: {
            display: "flex",
            alignItems: "center",
            gap: "0.375rem",
        },
        legendDot: {
            height: "0.75rem",
            width: "0.75rem",
            borderRadius: "50%",
        },
        legendText: {
            color: "#64748b",
        },
        navigation: {
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
        },
        monthYear: {
            fontWeight: "600",
            fontSize: "1rem",
            color: "#1e293b",
        },
        navButtons: {
            display: "flex",
            gap: "0.25rem",
        },
        navButton: {
            width: "2.5rem",
            height: "2.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid #e2e8f0",
            borderRadius: "0.5rem",
            background: "transparent",
            cursor: "pointer",
            transition: "all 0.2s",
        },
        calendarGrid: {
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "0.5rem",
        },
        weekdayHeader: {
            textAlign: "center",
            fontSize: "0.7rem",
            fontWeight: "600",
            color: "#94a3b8",
            padding: "0.5rem 0",
            textTransform: "uppercase",
        },
        dayButton: (isSelected, isPast, isToday, isFull, isClickable) => ({
            position: "relative",
            aspectRatio: "1",
            borderRadius: "0.75rem",
            border: isSelected
                ? "2px solid #ffc107"
                : isToday
                    ? "2px solid #fcd34d"
                    : "2px solid transparent",
            background: isSelected
                ? "#ffc107"
                : isFull
                    ? "#fee2e2"
                    : isToday
                        ? "#fefce8"
                        : "#f8fafc",
            color: isSelected
                ? "#1e293b"
                : isFull
                    ? "#f87171"
                    : "#1e293b",
            cursor: isClickable ? "pointer" : "not-allowed",
            opacity: isPast ? 0.4 : 1,
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: isSelected ? "scale(1.05)" : "scale(1)",
            boxShadow: isSelected ? "0 4px 12px rgba(255, 193, 7, 0.3)" : "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.95rem",
            fontWeight: isSelected ? "700" : "500",
        }),
        availabilityDot: (availability, isSelected) => ({
            position: "absolute",
            bottom: "0.25rem",
            height: "0.375rem",
            width: "0.375rem",
            borderRadius: "50%",
            background: isSelected
                ? "#1e293b"
                : availability === "available"
                    ? "#22c55e"
                    : availability === "fast-filling"
                        ? "#eab308"
                        : "#ef4444",
        }),
        badge: (type) => ({
            position: "absolute",
            top: "-0.25rem",
            right: "-0.25rem",
            fontSize: "0.55rem",
            background: type === "fast-filling" ? "#eab308" : "#ef4444",
            color: "white",
            padding: "0.125rem 0.25rem",
            borderRadius: "0.25rem",
            fontWeight: "600",
            whiteSpace: "nowrap",
        }),
        emptyDay: {
            aspectRatio: "1",
        },
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h3 style={styles.title}>Select Date</h3>
                    <div style={styles.legend}>
                        <div style={styles.legendItem}>
                            <div style={{ ...styles.legendDot, background: "#22c55e" }} />
                            <span style={styles.legendText}>Available</span>
                        </div>
                        <div style={styles.legendItem}>
                            <div style={{ ...styles.legendDot, background: "#eab308" }} />
                            <span style={styles.legendText}>Fast Filling</span>
                        </div>
                        <div style={styles.legendItem}>
                            <div style={{ ...styles.legendDot, background: "#ef4444" }} />
                            <span style={styles.legendText}>Full</span>
                        </div>
                    </div>
                </div>

                <div style={styles.navigation}>
                    <span style={styles.monthYear}>
                        {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </span>
                    <div style={styles.navButtons}>
                        <button
                            style={styles.navButton}
                            onClick={onPrevMonth}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = "#f8fafc"
                                e.currentTarget.style.borderColor = "#cbd5e1"
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = "transparent"
                                e.currentTarget.style.borderColor = "#e2e8f0"
                            }}
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            style={styles.navButton}
                            onClick={onNextMonth}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = "#f8fafc"
                                e.currentTarget.style.borderColor = "#cbd5e1"
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = "transparent"
                                e.currentTarget.style.borderColor = "#e2e8f0"
                            }}
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <div style={styles.calendarGrid}>
                {/* Weekday headers */}
                {WEEKDAYS.map((day) => (
                    <div key={day} style={styles.weekdayHeader}>
                        {day}
                    </div>
                ))}

                {/* Calendar days */}
                {days.map((date, index) => {
                    if (!date) {
                        return <div key={`empty-${index}`} style={styles.emptyDay} />
                    }

                    const availability = getDayAvailability(date)
                    const isSelected = selectedDate?.toDateString() === date.toDateString()
                    const isPast = date < today
                    const isToday = date.toDateString() === today.toDateString()
                    const isFull = availability === "full"
                    const isClickable = !isPast && availability && !isFull

                    return (
                        <button
                            key={date.toISOString()}
                            onClick={() => {
                                if (isClickable) {
                                    onDateSelect(date)
                                }
                            }}
                            disabled={!isClickable}
                            style={styles.dayButton(isSelected, isPast, isToday, isFull, isClickable)}
                            onMouseEnter={(e) => {
                                if (isClickable && !isSelected) {
                                    e.currentTarget.style.transform = "scale(1.05)"
                                    e.currentTarget.style.borderColor = "#fcd34d"
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isSelected) {
                                    e.currentTarget.style.transform = "scale(1)"
                                    e.currentTarget.style.borderColor = isToday ? "#fcd34d" : "transparent"
                                }
                            }}
                        >
                            <span>{date.getDate()}</span>
                            {availability && !isPast && (
                                <div style={styles.availabilityDot(availability, isSelected)} />
                            )}
                            {availability === "fast-filling" && !isSelected && !isPast && (
                                <span style={styles.badge("fast-filling")}>2 Left</span>
                            )}
                            {isFull && !isPast && (
                                <span style={styles.badge("full")}>Full</span>
                            )}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export default CalendarPicker
