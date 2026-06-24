import { Link, useLocation } from "react-router-dom";

export default function BookingSuccess() {
  const location = useLocation();
  const booking = location.state?.booking;

  if (!booking) {
    return (
      <div className="container">
        <p>No booking information available.</p>
        <Link to="/my-bookings">View my bookings</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="success">Booking Confirmed!</h1>
      <div className="summary-box">
        <p><strong>Reference #:</strong> {booking.id}</p>
        <p><strong>Movie:</strong> {booking.movie_title}</p>
        <p><strong>Theater:</strong> {booking.theater_name}</p>
        <p><strong>Screen:</strong> {booking.screen_name}</p>
        <p><strong>Showtime:</strong> {new Date(booking.starts_at).toLocaleString()}</p>
        <p><strong>Seats:</strong> {booking.seats.map((s) => s.seat_label).join(", ")}</p>
        <p><strong>Total:</strong> ${Number(booking.total_price).toFixed(2)}</p>
      </div>
      <p style={{ marginTop: "1.5rem" }}>
        <Link to="/my-bookings" className="btn">My Bookings</Link>{" "}
        <Link to="/" className="btn btn-secondary">Browse More Movies</Link>
      </p>
    </div>
  );
}
