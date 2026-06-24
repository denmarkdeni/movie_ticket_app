import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function BookingSuccessPage() {
  const location = useLocation();
  const booking = location.state?.booking;

  if (!booking) {
    return (
      <>
        <Navbar />
        <div className="container">
          <p>No booking information available.</p>
          <Link to="/">Back to movies</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container success-box">
        <h2>Booking Confirmed!</h2>
        <p>Reference: #{booking.id}</p>
        <p>{booking.movie_title} at {booking.theater_name}</p>
        <p>{new Date(booking.starts_at).toLocaleString()}</p>
        <p>
          Seats: {booking.seats?.map((s) => s.seat_label).join(", ")}
        </p>
        <p>Total: ${booking.total_price}</p>
        <Link to="/my-bookings" className="btn btn-primary">View My Bookings</Link>
        <Link to="/" className="btn btn-secondary" style={{ marginLeft: "0.5rem" }}>
          Browse More
        </Link>
      </div>
    </>
  );
}
