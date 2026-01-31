import { useEffect, useState } from "react";
import { getAllBookings } from "../services/booking.api";

export default function useBookings() {
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllBookings()
      .then(res => setBookings(res.data))
      .catch(err => console.error("Bookings error", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredBookings =
    status === "ALL"
      ? bookings
      : bookings.filter(b => b.status === status);

  return {
    bookings: filteredBookings,
    loading,
    status,
    setStatus
  };
}
