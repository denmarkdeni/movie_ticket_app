import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { fetchMovie } from "../api/client";

function formatDateTime(isoString) {
  return new Date(isoString).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovie(id)
      .then((res) => setMovie(res.data))
      .catch(() => setError("Failed to load movie details."))
      .finally(() => setLoading(false));
  }, [id]);

  const showtimesByTheater = useMemo(() => {
    if (!movie?.showtimes) return {};
    return movie.showtimes.reduce((acc, showtime) => {
      const key = showtime.theater_name;
      if (!acc[key]) acc[key] = [];
      acc[key].push(showtime);
      return acc;
    }, {});
  }, [movie]);

  if (loading) return <div className="container">Loading...</div>;
  if (error) return <div className="container error">{error}</div>;
  if (!movie) return <div className="container">Movie not found.</div>;

  return (
    <div className="container">
      <Link to="/">&larr; Back to movies</Link>
      <div style={{ display: "flex", gap: "2rem", marginTop: "1.5rem", flexWrap: "wrap" }}>
        <img
          src={movie.poster_url || "https://placehold.co/300x450?text=No+Poster"}
          alt={movie.title}
          style={{ width: "260px", borderRadius: "12px" }}
        />
        <div style={{ flex: 1, minWidth: "280px" }}>
          <h1>{movie.title}</h1>
          <p>{movie.duration_minutes} minutes</p>
          <p>{movie.synopsis}</p>
        </div>
      </div>

      <h2 style={{ marginTop: "2rem" }}>Showtimes</h2>
      {Object.keys(showtimesByTheater).length === 0 ? (
        <p>No upcoming showtimes.</p>
      ) : (
        Object.entries(showtimesByTheater).map(([theaterName, showtimes]) => (
          <div key={theaterName} style={{ marginBottom: "1.5rem" }}>
            <h3>{theaterName}</h3>
            <ul className="showtime-list">
              {showtimes.map((showtime) => (
                <li key={showtime.id}>
                  <span>
                    {formatDateTime(showtime.starts_at)} — {showtime.screen_name} — ${showtime.price}
                  </span>
                  <Link to={`/showtimes/${showtime.id}/seats`} className="btn">
                    Select Seats
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
