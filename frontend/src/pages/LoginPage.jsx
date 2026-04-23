import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/onboarding.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const email = formData.email.trim();
    const password = formData.password.trim();

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    localStorage.setItem("aarogya_is_logged_in", "true");
    localStorage.setItem("aarogya_user_email", email);
    setError("");
    navigate("/home");
  };

  return (
    <div className="onboarding-shell">
      <div className="onboarding-card">
        <p className="onboarding-eyebrow">Welcome to Aarogya AI</p>
        <h1>Login</h1>
        <p className="onboarding-subtitle">
          Sign in to access your Aarogya AI home experience.
        </p>

        <form className="onboarding-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </label>
          {error ? <p className="onboarding-error">{error}</p> : null}
          <button type="submit" className="onboarding-btn">
            Login and Continue
          </button>
        </form>
      </div>
    </div>
  );
}
