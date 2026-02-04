import React, { useState, useEffect } from "react";
import "./VendorCalendar.css";
import {
  getVendorSlots,
  saveVendorSlot,
  deleteVendorSlot,
} from "../api/slot.api";

const VendorCalendar = () => {
  const vendorId = Number(localStorage.getItem("vendorId"));

  /* ================= DATE HELPERS ================= */
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isPastDate = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d < today;
  };

  const formatDate = (d) => {
    const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return local.toISOString().split("T")[0];
  };

  /* ================= STATE ================= */
  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const [selectedDate, setSelectedDate] = useState(formatDate(today));
  const [slotsByDate, setSlotsByDate] = useState({});

  // 12-hour time picker
  const [sh, setSh] = useState("09");
  const [sm, setSm] = useState("00");
  const [sp, setSp] = useState("AM");
  const [eh, setEh] = useState("10");
  const [em, setEm] = useState("00");
  const [ep, setEp] = useState("AM");

  if (!vendorId) {
    return <p style={{ padding: 20 }}>Vendor not logged in</p>;
  }

  /* ================= AUTO LOAD TODAY ================= */
  useEffect(() => {
    loadSlots(formatDate(today));
  }, []);

  /* ================= AUTO LOAD MONTH ================= */
  useEffect(() => {
    preloadMonthSlots();
  }, [currentMonth]);

  /* ================= MONTH NAV ================= */
  const goToPrevMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );

  const goToNextMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );

  /* ================= LOAD SLOTS ================= */
  const loadSlots = async (dateStr) => {
    try {
      const res = await getVendorSlots(vendorId, dateStr);
      setSlotsByDate((prev) => ({
        ...prev,
        [dateStr]: res.data || [],
      }));
    } catch {
      setSlotsByDate((prev) => ({
        ...prev,
        [dateStr]: [],
      }));
    }
  };

  /* ================= PRELOAD MONTH ================= */
  const preloadMonthSlots = async () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let d = 1; d <= daysInMonth; d++) {
      const key = formatDate(new Date(year, month, d));
      loadSlots(key);
    }
  };

  /* ================= DATE CLICK ================= */
  const onDateClick = async (date) => {
    if (isPastDate(date)) return;
    const key = formatDate(date);
    setSelectedDate(key);
    await loadSlots(key);
  };

  /* ================= TIME CONVERSION ================= */
  const to24 = (h, m, p) => {
    let hour = parseInt(h, 10);
    if (p === "PM" && hour !== 12) hour += 12;
    if (p === "AM" && hour === 12) hour = 0;
    return `${String(hour).padStart(2, "0")}:${m}:00`;
  };

  /* ================= SAVE SLOT ================= */
  const handleSave = async () => {
    const startISO = `${selectedDate}T${to24(sh, sm, sp)}`;
    const endISO = `${selectedDate}T${to24(eh, em, ep)}`;

    if (startISO >= endISO) {
      alert("End time must be after start time");
      return;
    }

    const existing = slotsByDate[selectedDate] || [];
    if (
      existing.some(
        (s) => !(endISO <= s.startTime || startISO >= s.endTime)
      )
    ) {
      alert("Overlapping slot not allowed");
      return;
    }

    await saveVendorSlot({
      vendorId,
      date: selectedDate,
      startTime: startISO,
      endTime: endISO,
    });

    await loadSlots(selectedDate);
  };

  /* ================= DELETE SLOT ================= */
  const handleDeleteSlot = async (slotId) => {
    if (!window.confirm("Delete this slot?")) return;
    await deleteVendorSlot(slotId);
    await loadSlots(selectedDate);
  };

  /* ================= CALENDAR BUILD ================= */
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const days = [];
  for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(year, month, d));

  return (
    <div className="calendar-layout">
      {/* ===== CALENDAR ===== */}
      <div className="calendar-main">
        <div className="calendar-header">
          <button className="month-btn" onClick={goToPrevMonth}>‹</button>
          <h2>{currentMonth.toLocaleString("default", { month: "long" })} {year}</h2>
          <button className="month-btn" onClick={goToNextMonth}>›</button>
        </div>

        <div className="calendar-grid">
          {days.map((d, i) =>
            !d ? (
              <div key={i} />
            ) : (
              <div
                key={i}
                className={`calendar-cell
                  ${slotsByDate[formatDate(d)]?.length ? "open" : ""}
                  ${isPastDate(d) ? "past-date" : ""}
                  ${selectedDate === formatDate(d) ? "selected" : ""}`}
                onClick={() => onDateClick(d)}
              >
                <b>{d.getDate()}</b>
              </div>
            )
          )}
        </div>

        {/* ===== SLOT CARDS ===== */}
        {selectedDate && (
          <div className="slot-cards-section">
            <h4>Slots for {selectedDate}</h4>

            <div className="slot-cards">
              {(slotsByDate[selectedDate] || []).map((s) => (
                <div key={s.id} className="slot-card">
                  <span className="slot-time">
                    {s.startTime.slice(11, 16)} – {s.endTime.slice(11, 16)}
                  </span>
                  <button
                    className="slot-delete"
                    onClick={() => handleDeleteSlot(s.id)}
                  >
                    ✕
                  </button>
                </div>
              ))}

              {(slotsByDate[selectedDate] || []).length === 0 && (
                <p className="muted">No slots added for this day</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ===== SIDE PANEL ===== */}
      <div className="calendar-side">
        {selectedDate && !isPastDate(new Date(selectedDate)) && (
          <>
            <h3>{selectedDate}</h3>

            <label>Start Time</label>
            <div className="time-row">
              <select value={sh} onChange={(e) => setSh(e.target.value)}>
                {[...Array(12)].map((_, i) => (
                  <option key={i}>{String(i + 1).padStart(2, "0")}</option>
                ))}
              </select>
              <select value={sm} onChange={(e) => setSm(e.target.value)}>
                {["00", "15", "30", "45"].map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
              <select value={sp} onChange={(e) => setSp(e.target.value)}>
                <option>AM</option>
                <option>PM</option>
              </select>
            </div>

            <label>End Time</label>
            <div className="time-row">
              <select value={eh} onChange={(e) => setEh(e.target.value)}>
                {[...Array(12)].map((_, i) => (
                  <option key={i}>{String(i + 1).padStart(2, "0")}</option>
                ))}
              </select>
              <select value={em} onChange={(e) => setEm(e.target.value)}>
                {["00", "15", "30", "45"].map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
              <select value={ep} onChange={(e) => setEp(e.target.value)}>
                <option>AM</option>
                <option>PM</option>
              </select>
            </div>

            <button onClick={handleSave}>Add Slot</button>
          </>
        )}
      </div>
    </div>
  );
};

export default VendorCalendar;
