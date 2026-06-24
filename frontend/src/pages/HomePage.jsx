import { useEffect, useState } from "react";
import { getMovies } from "../api/movies";
import MovieCard from "../components/MovieCard";
import Navbar from "../components/Navbar";

export default function HomePage() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMovies()
      .then(setMovies)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>Now Showing</h1>
        {loading && <p>Loading movies...</p>}
        {error && <p className="error">{error}</p>}
        <div className="movie-grid">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </>
  );
}
