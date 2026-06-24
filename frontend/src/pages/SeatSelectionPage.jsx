import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getShowtimeSeats } from "../api/bookings";
import { isAuthenticated } from "../api/client";
import Navbar from "../components/Navbar";
import SeatMap from "../components/SeatMap";

export default function SeatSelectionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getShowtimeSeats(id)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  function toggleSeat(seatId) {
    setSelectedIds((prev) =>
      prev.includes(seatId) ? prev.filter((s) => s !== seatId) : [...prev, seatId]
    );
  }

  function handleContinue() {
    if (!isAuthenticated()) {
      navigate("/login", { state: { from: `/showtimes/${id}/seats` } });
      return;
    }
    navigate("/bookings/confirm", {
      state: { showtimeId: Number(id), seatIds: selectedIds, price: data.price },
    });
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container"><p>Loading seats...</p></div>
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        <Navbar />
        <div className="container"><p className="error">{error || "Not found"}</p></div>
      </>
    );
  }

  const total = (parseFloat(data.price) * selectedIds.length).toFixed(2);

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>Select Seats</h1>
        <SeatMap
          seats={data.seats}
          rows={data.rows}
          seatsPerRow={data.seats_per_row}
          selectedIds={selectedIds}
          onToggle={toggleSeat}
        />
        <p>
          Selected: {selectedIds.length} seat(s) — Total: ${total}
        </p>
        <button
          className="btn btn-primary"
          disabled={selectedIds.length === 0}
          onClick={handleContinue}
        >
          Continue
        </button>
      </div>
    </>
  );
}
