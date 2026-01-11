import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

const mockUsers = [
  { email: "fbala@example.com", password: "password123", name: "Demo User" },
];

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.target);

    const email = form.get("email")?.trim().toLowerCase();
    const password = form.get("password");

    const matched = mockUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (!matched) {
      setError("Incorrect email or password.");
      return;
    }

    // Mock session
    localStorage.setItem("shespace_logged_in", "true");
    localStorage.setItem("shespace_user_email", matched.email);
    localStorage.setItem("shespace_user_name", matched.name);

    navigate("/");
  }

  return (
    <main className="login-page">
      <section className="login-hero">
        <h1>
          Welcome back to <span className="brand">SheSpace</span>
        </h1>
        <p className="hero-copy">
          Find and share the safest study and gathering spaces around you.
        </p>
        <ul className="hero-points">
          <li>🌱 Curated by community</li>
          <li>🛡️ Safety insights at a glance</li>
          <li>✨ Built for students & allies</li>
        </ul>
      </section>

      <section className="login-card">
        <header>
          <p className="eyebrow">Sign in</p>
          <h2>Access your spaces</h2>
          <p className="subtle">
            Continue to save favorites, add ratings, and get tailored alerts.
          </p>
        </header>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="input-field">
            <span>Email</span>
            <input type="email" name="email" required />
          </label>

          <label className="input-field">
            <span>Password</span>
            <input type="password" name="password" required />
          </label>

          <button className="primary-btn full">Sign in</button>

          {error && <p className="form-error">{error}</p>}

          <p className="subtle center">
            No account? <span className="link">Create one</span>
          </p>
        </form>
      </section>
    </main>
  );
}
