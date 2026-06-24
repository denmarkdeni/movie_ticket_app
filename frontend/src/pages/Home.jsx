import { useEffect, useState } from "react";

import { fetchMovies } from "../api/client";
import MovieCard from "../components/MovieCard";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies()
      .then((res) => setMovies(res.data))
      .catch(() => setError("Failed to load movies."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container">Loading movies...</div>;
  if (error) return <div className="container error">{error}</div>;

  return (
    <div className="container">
      <h1>Now Showing</h1>
      <div className="grid">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
