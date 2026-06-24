import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { login, register } from "../api/client";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await register(form);
      await login({ email: form.email, password: form.password });
      navigate("/");
    } catch (err) {
      const data = err.response?.data;
      const message =
        data?.email?.[0] ||
        data?.password?.[0] ||
        "Registration failed. Please check your details.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{ maxWidth: "420px" }}>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="first_name">First name</label>
          <input id="first_name" value={form.first_name} onChange={updateField("first_name")} />
        </div>
        <div className="form-group">
          <label htmlFor="last_name">Last name</label>
          <input id="last_name" value={form.last_name} onChange={updateField("last_name")} />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={form.email} onChange={updateField("email")} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={form.password} onChange={updateField("password")} minLength={8} required />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>
      <p style={{ marginTop: "1rem" }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
