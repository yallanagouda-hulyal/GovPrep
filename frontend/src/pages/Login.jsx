import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaGraduationCap,
  FaEnvelope,
  FaLock,
  FaTimes,
} from "react-icons/fa";

import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      // Save JWT token
      localStorage.setItem("token", data.token);

      // Save logged-in user
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      setMessage("Login successful! Redirecting...");

      setTimeout(() => {
        navigate("/");
      }, 1000);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-page">

      <div className="login-overlay">

        <div className="login-modal">

          {/* CLOSE BUTTON */}
          <button
            type="button"
            className="login-close"
            onClick={() => navigate("/")}
          >
            <FaTimes />
          </button>

          {/* LOGO / ICON */}
          <div className="login-icon">
            <FaGraduationCap />
          </div>

          {/* HEADER */}
          <div className="login-header">
            <h1>Welcome Back</h1>

            <p>
              Login to GovPrep and continue your preparation.
            </p>
          </div>

          {/* LOGIN FORM */}
          <form onSubmit={handleSubmit}>

            {/* EMAIL */}
            <div className="login-input-group">
              <label>Email Address</label>

              <div className="login-input">
                <FaEnvelope />

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="login-input-group">
              <label>Password</label>

              <div className="login-input">
                <FaLock />

                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            {/* SUCCESS */}
            {message && (
              <div className="login-success">
                {message}
              </div>
            )}

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          {/* DIVIDER */}
          <div className="login-divider">
            <span></span>
            <p>Or login with</p>
            <span></span>
          </div>

          {/* GOOGLE BUTTON */}
          <button
            type="button"
            className="google-button"
          >
            <span className="google-icon">G</span>
            Continue with Google
          </button>

          {/* REGISTER */}
          <div className="login-register">
            <span>Don't have an account?</span>

            <Link to="/register">
              Register
            </Link>
          </div>

        </div>

      </div>

    </section>
  );
}

export default Login;