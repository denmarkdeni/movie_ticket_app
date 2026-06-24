import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { createBooking } from "../api/client";

export default function BookingConfirm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showtimeId, seatIds, showtime } = location.state || {};
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!showtimeId || !seatIds?.length || !showtime) {
    return (
      <div className="container">
        <p className="error">No booking details found.</p>
        <Link to="/">Browse movies</Link>
      </div>
    );
  }

  const selectedSeats = showtime.seats.filter((seat) => seatIds.includes(seat.id));
  const total = Number(showtime.price) * seatIds.length;

  async function handleConfirm() {
    setSubmitting(true);
    setError("");
    try {
      const res = await createBooking({ showtime_id: showtimeId, seat_ids: seatIds });
      navigate("/bookings/success", { state: { booking: res.data } });
    } catch (err) {
      const message =
        err.response?.data?.seat_ids?.[0] ||
        err.response?.data?.detail ||
        "Booking failed. Please try again.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container">
      <h1>Confirm Booking</h1>
      <div className="summary-box">
        <p><strong>Movie:</strong> {showtime.movie_title}</p>
        <p><strong>Theater:</strong> {showtime.theater_name}</p>
        <p><strong>Screen:</strong> {showtime.screen_name}</p>
        <p><strong>Showtime:</strong> {new Date(showtime.starts_at).toLocaleString()}</p>
        <p><strong>Seats:</strong> {selectedSeats.map((s) => s.label).join(", ")}</p>
        <p><strong>Total:</strong> ${total.toFixed(2)}</p>
        {error && <p className="error">{error}</p>}
        <button type="button" className="btn" onClick={handleConfirm} disabled={submitting}>
          {submitting ? "Booking..." : "Confirm Booking"}
        </button>
      </div>
    </div>
  );
}
