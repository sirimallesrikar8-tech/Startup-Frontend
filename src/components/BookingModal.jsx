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
      alert("❌ Selected dates already booked");
      return;
    }

    setAvailable(true);
  };

  /* ================= CONFIRM ================= */
  const handleConfirm = () => {
    alert("🎉 Booking Confirmed!");
    onClose();
  };

  return (
    <>
      <div className="booking-blur-backdrop" onClick={onClose}></div>

      <div className="modal show booking-modal-wrapper">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content booking-modal">

            {/* HEADER */}
            <div className="modal-header">
              {step > 1 && (
                <button
                  className="btn btn-light me-2"
                  onClick={() => setStep(step - 1)}
                >
                  ←
                </button>
              )}
              <h5 className="modal-title">Book {service?.title}</h5>
              <button className="btn-close" onClick={onClose}></button>
            </div>

            <div className="modal-body">

              {/* ================= STEP 1 ================= */}
              {step === 1 && (
                <>
                  <h6>Basic Information</h6>

                  <input
                    className="form-control mb-2"
                    placeholder="Full Name"
                    value={user.name}
                    onChange={(e) =>
                      setUser({ ...user, name: e.target.value })
                    }
                  />

                  <input
                    className="form-control mb-2"
                    placeholder="Email (@gmail.com)"
                    value={user.email}
                    onChange={(e) =>
                      setUser({ ...user, email: e.target.value })
                    }
                  />
                  {!isEmailValid && user.email && (
                    <small className="text-danger">Only Gmail allowed</small>
                  )}

                  <input
                    className="form-control mb-2"
                    placeholder="Phone (10 digits)"
                    value={user.phone}
                    onChange={(e) =>
                      setUser({ ...user, phone: e.target.value })
                    }
                  />

                  <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="Number of People"
                    value={user.people}
                    onChange={(e) =>
                      setUser({ ...user, people: e.target.value })
                    }
                  />

                  {isCapacityExceeded && (
                    <small className="text-danger">
                      ❌ Capacity exceeded (Max 150)
                    </small>
                  )}

                  <button
                    className="btn btn-warning w-100 mt-3"
                    disabled={!canProceedStep1}
                    onClick={() => setStep(2)}
                  >
                    Continue
                  </button>
                </>
              )}

              {/* ================= STEP 2 ================= */}
              {step === 2 && (
                <>
                  <h6>Select Date & Time</h6>

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
                    tileClassName={({ date }) =>
                      BOOKED_DATES.includes(formatDate(date))
                        ? "calendar-booked"
                        : null
                    }
                  />

                  <h6 className="mt-3">Start Time</h6>
                  <TimePicker value={startTime} setValue={setStartTime} />

                  <h6 className="mt-3">End Time</h6>
                  <TimePicker value={endTime} setValue={setEndTime} />

                  {!available ? (
                    <button
                      className="btn btn-outline-warning w-100 mt-3"
                      onClick={handleCheckAvailability}
                    >
                      Check Availability
                    </button>
                  ) : (
                    <>
                      <div className="text-success mt-3 text-center">
                        ✅ Available
                      </div>
                      <button
                        className="btn btn-warning w-100 mt-3"
                        onClick={() => setStep(3)}
                      >
                        Continue to Preview
                      </button>
                    </>
                  )}
                </>
              )}

              {/* ================= STEP 3 ================= */}
              {step === 3 && (
                <>
                  <h6>Preview Booking</h6>

                  <ul className="list-group mb-3">
                    <li className="list-group-item">Name: {user.name}</li>
                    <li className="list-group-item">Email: {user.email}</li>
                    <li className="list-group-item">Phone: {user.phone}</li>
                    <li className="list-group-item">People: {user.people}</li>
                    <li className="list-group-item">Service: {service.title}</li>
                    <li className="list-group-item">
                      Date: {startDate?.toDateString()} →{" "}
                      {endDate?.toDateString() || startDate?.toDateString()}
                    </li>
                    <li className="list-group-item">
                      Time: {startTime.h}:{startTime.m} {startTime.p} →{" "}
                      {endTime.h}:{endTime.m} {endTime.p}
                    </li>
                  </ul>

                  <button
                    className="btn btn-warning w-100"
                    onClick={handleConfirm}
                  >
                    Confirm Booking
                  </button>
                </>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

/* ================= TIME PICKER ================= */
const TimePicker = ({ value, setValue }) => (
  <div className="d-flex gap-2">
    <select
      className="form-select"
      value={value.h}
      onChange={(e) => setValue({ ...value, h: e.target.value })}
    >
      <option value="">HH</option>
      {[...Array(12)].map((_, i) => (
        <option key={i}>{i + 1}</option>
      ))}
    </select>

    <select
      className="form-select"
      value={value.m}
      onChange={(e) => setValue({ ...value, m: e.target.value })}
    >
      <option value="">MM</option>
      {["00", "15", "30", "45"].map((m) => (
        <option key={m}>{m}</option>
      ))}
    </select>

    <select
      className="form-select"
      value={value.p}
      onChange={(e) => setValue({ ...value, p: e.target.value })}
    >
      <option>AM</option>
      <option>PM</option>
    </select>
  </div>
);

export default BookingModal;
