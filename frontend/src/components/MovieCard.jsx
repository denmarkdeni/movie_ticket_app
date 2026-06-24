import { Link } from "react-router-dom";

export default function MovieCard({ movie }) {
  return (
    <article className="card">
      <img src={movie.poster_url || "https://placehold.co/300x450?text=No+Poster"} alt={movie.title} />
      <div className="card-body">
        <h3>{movie.title}</h3>
        <p>{movie.duration_minutes} min</p>
        <Link to={`/movies/${movie.id}`} className="btn">
          View Showtimes
        </Link>
      </div>
    </article>
  );
}
