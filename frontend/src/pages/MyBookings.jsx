import { useEffect, useState } from "react";

import { fetchMyBookings } from "../api/client";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyBookings()
      .then((res) => setBookings(res.data))
      .catch(() => setError("Failed to load your bookings."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container">Loading bookings...</div>;
  if (error) return <div className="container error">{error}</div>;

  return (
    <div className="container">
      <h1>My Bookings</h1>
      {bookings.length === 0 ? (
        <p>You have no bookings yet.</p>
      ) : (
        <div className="booking-list">
          {bookings.map((booking) => (
            <article key={booking.id} className="booking-item">
              <h3>Booking #{booking.id} — {booking.movie_title}</h3>
              <p>{booking.theater_name} — {booking.screen_name}</p>
              <p>{new Date(booking.starts_at).toLocaleString()}</p>
              <p>Seats: {booking.seats.map((s) => s.seat_label).join(", ")}</p>
              <p>Total: ${Number(booking.total_price).toFixed(2)}</p>
              <p>Status: {booking.status}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
