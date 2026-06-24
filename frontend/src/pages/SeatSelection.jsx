import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { fetchShowtimeSeats } from "../api/client";
import { isAuthenticated } from "../api/authStorage";
import SeatMap from "../components/SeatMap";

export default function SeatSelection() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showtime, setShowtime] = useState(null);
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShowtimeSeats(id)
      .then((res) => setShowtime(res.data))
      .catch(() => setError("Failed to load seat map."))
      .finally(() => setLoading(false));
  }, [id]);

  const rows = useMemo(() => {
    if (!showtime?.seats) return [];
    return [...new Set(showtime.seats.map((s) => s.row))].sort((a, b) => a - b);
  }, [showtime]);

  const totalPrice = useMemo(() => {
    if (!showtime) return 0;
    return Number(showtime.price) * selectedSeatIds.length;
  }, [showtime, selectedSeatIds]);

  function toggleSeat(seatId) {
    setSelectedSeatIds((prev) =>
      prev.includes(seatId) ? prev.filter((id) => id !== seatId) : [...prev, seatId]
    );
  }

  function handleContinue() {
    if (selectedSeatIds.length === 0) {
      setError("Please select at least one seat.");
      return;
    }
    if (!isAuthenticated()) {
      navigate("/login", { state: { from: `/showtimes/${id}/seats` } });
      return;
    }
    navigate("/bookings/confirm", {
      state: {
        showtimeId: Number(id),
        seatIds: selectedSeatIds,
        showtime,
      },
    });
  }

  if (loading) return <div className="container">Loading seats...</div>;
  if (error && !showtime) return <div className="container error">{error}</div>;
  if (!showtime) return <div className="container">Showtime not found.</div>;

  return (
    <div className="container">
      <Link to="#" onClick={(e) => { e.preventDefault(); window.history.back(); }}>
        &larr; Back
      </Link>
      <h1>{showtime.movie_title}</h1>
      <p>
        {showtime.theater_name} — {showtime.screen_name} —{" "}
        {new Date(showtime.starts_at).toLocaleString()} — ${showtime.price} per seat
      </p>

      <SeatMap
        seats={showtime.seats}
        selectedSeatIds={selectedSeatIds}
        onToggleSeat={toggleSeat}
        rows={rows}
      />

      <p>
        <strong>Selected:</strong> {selectedSeatIds.length} seat(s) — <strong>Total:</strong> ${totalPrice.toFixed(2)}
      </p>
      {error && <p className="error">{error}</p>}
      <button type="button" className="btn" onClick={handleContinue} disabled={selectedSeatIds.length === 0}>
        Continue to Confirm
      </button>
    </div>
  );
}
