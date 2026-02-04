import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./BookingModal.css";

const MAX_CAPACITY = 150;

/* ================= MOCK BOOKED DATES (NEXT 3 MONTHS) ================= */
const BOOKED_DATES = [
  "2025-01-10",
  "2025-01-15",
  "2025-02-05",
  "2025-02-14",
  "2025-03-03",
  "2025-03-18"
];

const formatDate = (date) =>
  new Date(date).toISOString().split("T")[0];

const BookingModal = ({ show, onClose, service }) => {
  if (!show) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [step, setStep] = useState(1);
  const [available, setAvailable] = useState(false);

  /* ================= USER INFO ================= */
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    people: ""
  });

  const isEmailValid = user.email.endsWith("@gmail.com");
  const isPhoneValid = /^\d{10}$/.test(user.phone);
  const isCapacityExceeded =
    (service?.type === "venue" || service?.type === "hotel") &&
    Number(user.people) > MAX_CAPACITY;

  const canProceedStep1 =
    user.name &&
    isEmailValid &&
    isPhoneValid &&
    user.people &&
    !isCapacityExceeded;

  /* ================= DATE RANGE ================= */
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const hasBookedDateInRange = () => {
    if (!startDate) return false;
    const from = new Date(startDate);
    const to = endDate ? new Date(endDate) : from;

    for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
      if (BOOKED_DATES.includes(formatDate(d))) return true;
    }
    return false;
  };

  /* ================= TIME ================= */
  const [startTime, setStartTime] = useState({ h: "", m: "", p: "AM" });
  const [endTime, setEndTime] = useState({ h: "", m: "", p: "AM" });

  /* ================= CHECK AVAILABILITY ================= */
  const handleCheckAvailability = () => {
    if (!startDate) {
      alert("Please select date");
      return;
    }

    if (!startTime.h || !startTime.m || !endTime.h || !endTime.m) {
      alert("Select start & end time");
      return;
    }

    if (hasBookedDateInRange()) {
      alert("Selected dates already booked");
      return;
    }

    setAvailable(true);
  };

  /* ================= CONFIRM ================= */
  const handleConfirm = () => {
    alert("Booking Confirmed!");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[1050] flex items-center justify-center p-4 font-display text-[#111418] dark:text-white">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-white dark:bg-[#1a202c] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200 border border-[#e5e7eb] dark:border-[#2a3441]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e7eb] dark:border-[#2a3441]">
          <div className="flex items-center gap-3">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400"
              >
                <span className="material-symbols-outlined text-xl">arrow_back</span>
              </button>
            )}
            <h3 className="text-xl font-bold leading-tight">
              Book {service?.title || 'Service'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">

          {/* ================= STEP 1 ================= */}
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Basic Information</label>
                <p className="text-xs text-gray-500">Please provide your details to proceed.</p>
              </div>

              <div className="space-y-3">
                <input
                  className="w-full h-12 px-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                  placeholder="Full Name"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                />

                <div>
                  <input
                    className={`w-full h-12 px-4 bg-gray-50 dark:bg-gray-800/50 border ${!isEmailValid && user.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm`}
                    placeholder="Email (@gmail.com)"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                  />
                  {!isEmailValid && user.email && (
                    <p className="text-xs text-red-500 mt-1 ml-1">Only Gmail allowed</p>
                  )}
                </div>

                <input
                  className="w-full h-12 px-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                  placeholder="Phone (10 digits)"
                  value={user.phone}
                  onChange={(e) => setUser({ ...user, phone: e.target.value })}
                />

                <div>
                  <input
                    type="number"
                    className="w-full h-12 px-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                    placeholder="Number of People"
                    value={user.people}
                    onChange={(e) => setUser({ ...user, people: e.target.value })}
                  />
                  {isCapacityExceeded && (
                    <p className="text-xs text-red-500 mt-1 ml-1">Capacity exceeded (Max 150)</p>
                  )}
                </div>
              </div>

              <button
                className="mt-2 w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={!canProceedStep1}
                onClick={() => setStep(2)}
              >
                Continue
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          )}

          {/* ================= STEP 2 ================= */}
          {step === 2 && (
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Select Date & Time</label>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/50 p-2 rounded-2xl border border-gray-100 dark:border-gray-700">
                <Calendar
                  selectRange
                  value={dateRange}
                  onChange={(val) => {
                    setDateRange(val);
                    setAvailable(false);
                  }}
                  tileDisabled={({ date }) =>
                    date < today ||
                    BOOKED_DATES.includes(formatDate(date))
                  }
                  className="w-full border-none bg-transparent font-medium"
                  tileClassName={({ date }) =>
                    BOOKED_DATES.includes(formatDate(date))
                      ? "text-gray-300 line-through cursor-not-allowed"
                      : "rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</label>
                  <TimePicker value={startTime} setValue={setStartTime} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">End Time</label>
                  <TimePicker value={endTime} setValue={setEndTime} />
                </div>
              </div>

              {!available ? (
                <button
                  className="w-full h-12 bg-white dark:bg-transparent border border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 font-bold rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                  onClick={handleCheckAvailability}
                >
                  Check Availability
                </button>
              ) : (
                <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-xl justify-center font-bold text-sm border border-green-100 dark:border-green-900/30">
                    <span className="material-symbols-outlined">check_circle</span>
                    Dates Available
                  </div>
                  <button
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                    onClick={() => setStep(3)}
                  >
                    Continue to Preview
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ================= STEP 3 ================= */}
          {step === 3 && (
            <div className="flex flex-col gap-5">
              <div className="text-center py-2">
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="material-symbols-outlined text-3xl">assignment</span>
                </div>
                <h4 className="text-lg font-bold">Booking Summary</h4>
                <p className="text-sm text-gray-500">Please review your booking details.</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700 flex flex-col gap-3">
                <SummaryRow icon="person" label="Name" value={user.name} />
                <SummaryRow icon="mail" label="Email" value={user.email} />
                <SummaryRow icon="call" label="Phone" value={user.phone} />
                <SummaryRow icon="group" label="Guests" value={user.people} />
                <SummaryRow icon="category" label="Service" value={service?.title || 'Unknown Service'} />
                <div className="h-px bg-gray-200 dark:bg-gray-700 my-1"></div>
                <SummaryRow
                  icon="calendar_month"
                  label="Date"
                  value={`${startDate?.toDateString()} - ${endDate?.toDateString() || startDate?.toDateString()}`}
                />
                <SummaryRow
                  icon="schedule"
                  label="Time"
                  value={`${startTime.h}:${startTime.m} ${startTime.p} - ${endTime.h}:${endTime.m} ${endTime.p}`}
                />
              </div>

              <button
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                onClick={handleConfirm}
              >
                Confirm Booking
                <span className="material-symbols-outlined text-sm">check</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

/* ================= HELPER COMPONENTS ================= */

const SummaryRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 text-sm">
    <span className="material-symbols-outlined text-gray-400 text-[18px]">{icon}</span>
    <span className="text-gray-500 min-w-[60px]">{label}:</span>
    <span className="font-semibold text-gray-900 dark:text-gray-100 truncate flex-1 text-right">{value}</span>
  </div>
);

const TimePicker = ({ value, setValue }) => (
  <div className="flex bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
    <select
      className="flex-1 bg-transparent py-2.5 text-center text-sm font-semibold focus:outline-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      value={value.h}
      onChange={(e) => setValue({ ...value, h: e.target.value })}
    >
      <option value="">HH</option>
      {[...Array(12)].map((_, i) => (
        <option key={i}>{i + 1}</option>
      ))}
    </select>

    <div className="w-px bg-gray-200 dark:bg-gray-700"></div>

    <select
      className="flex-1 bg-transparent py-2.5 text-center text-sm font-semibold focus:outline-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      value={value.m}
      onChange={(e) => setValue({ ...value, m: e.target.value })}
    >
      <option value="">MM</option>
      {["00", "15", "30", "45"].map((m) => (
        <option key={m}>{m}</option>
      ))}
    </select>

    <div className="w-px bg-gray-200 dark:bg-gray-700"></div>

    <select
      className="flex-1 bg-transparent py-2.5 text-center text-sm font-semibold focus:outline-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      value={value.p}
      onChange={(e) => setValue({ ...value, p: e.target.value })}
    >
      <option>AM</option>
      <option>PM</option>
    </select>
  </div>
);

export default BookingModal;
