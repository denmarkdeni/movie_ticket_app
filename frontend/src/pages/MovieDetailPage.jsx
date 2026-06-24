import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getMovie } from "../api/movies";
import Navbar from "../components/Navbar";

export default function MovieDetailPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMovie(id)
      .then(setMovie)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container"><p>Loading...</p></div>
      </>
    );
  }

  if (error || !movie) {
    return (
      <>
        <Navbar />
        <div className="container"><p className="error">{error || "Movie not found"}</p></div>
      </>
    );
  }

  const grouped = {};
  for (const st of movie.showtimes || []) {
    const key = st.theater_name;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(st);
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>{movie.title}</h1>
        <p>{movie.duration_minutes} minutes</p>
        {movie.poster_url && (
          <img
            src={movie.poster_url}
            alt={movie.title}
            style={{ maxWidth: "200px", borderRadius: "8px", marginBottom: "1rem" }}
          />
        )}
        <p>{movie.synopsis}</p>

        <h2>Showtimes</h2>
        {Object.entries(grouped).map(([theater, showtimes]) => (
          <div key={theater}>
            <h3>{theater}</h3>
            <ul className="showtime-list">
              {showtimes.map((st) => (
                <li key={st.id} className="showtime-item">
                  <span>
                    {new Date(st.starts_at).toLocaleString()} — {st.screen_name}
                  </span>
                  <Link to={`/showtimes/${st.id}/seats`} className="btn btn-primary">
                    Select Seats (${st.price})
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {movie.showtimes?.length === 0 && <p>No upcoming showtimes.</p>}
      </div>
    </>
  );
}
