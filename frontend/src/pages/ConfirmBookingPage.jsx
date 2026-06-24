import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createBooking } from "../api/bookings";
import Navbar from "../components/Navbar";

export default function ConfirmBookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showtimeId, seatIds, price } = location.state || {};
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!showtimeId || !seatIds?.length) {
    return (
      <>
        <Navbar />
        <div className="container">
          <p className="error">No booking details. Please select seats first.</p>
        </div>
      </>
    );
  }

  const total = (parseFloat(price) * seatIds.length).toFixed(2);

  async function handleConfirm() {
    setLoading(true);
    setError("");
    try {
      const booking = await createBooking(showtimeId, seatIds);
      navigate("/bookings/success", { state: { booking } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>Confirm Booking</h1>
        <div className="booking-card">
          <p>Showtime ID: {showtimeId}</p>
          <p>Seats: {seatIds.length}</p>
          <p>Total: ${total}</p>
        </div>
        {error && <p className="error">{error}</p>}
        <button className="btn btn-primary" onClick={handleConfirm} disabled={loading}>
          {loading ? "Booking..." : "Confirm Booking"}
        </button>
      </div>
    </>
  );
}
