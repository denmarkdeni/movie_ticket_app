import { Link } from "react-router-dom";

import { isAuthenticated } from "../api/authStorage";
import { logout } from "../api/client";

export default function Navbar() {
  const authed = isAuthenticated();

  function handleLogout() {
    logout();
    window.location.href = "/";
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        Movie Tickets
      </Link>
      <div>
        <Link to="/">Movies</Link>
        {authed ? (
          <>
            <Link to="/my-bookings">My Bookings</Link>
            <button type="button" className="btn btn-secondary" onClick={handleLogout} style={{ marginLeft: "1rem" }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
