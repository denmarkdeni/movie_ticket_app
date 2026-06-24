import { useEffect, useState } from "react";
import { getMyBookings } from "../api/bookings";
import Navbar from "../components/Navbar";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyBookings()
      .then(setBookings)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>My Bookings</h1>
        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        {bookings.length === 0 && !loading && <p>No bookings yet.</p>}
        {bookings.map((b) => (
          <div key={b.id} className="booking-card">
            <h3>#{b.id} — {b.movie_title}</h3>
            <p>{b.theater_name}</p>
            <p>{new Date(b.starts_at).toLocaleString()}</p>
            <p>Status: {b.status}</p>
            <p>Seats: {b.seats?.map((s) => s.seat_label).join(", ")}</p>
            <p>Total: ${b.total_price}</p>
          </div>
        ))}
      </div>
    </>
  );
}
