import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaGraduationCap,
  FaUser,
  FaEnvelope,
  FaLock,
  FaTimes,
} from "react-icons/fa";

import "../styles/Register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      setMessage("Registration successful! Redirecting...");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="register-page">

      <div className="register-overlay">

        <div className="register-modal">

          {/* CLOSE */}
          <button
            type="button"
            className="register-close"
            onClick={() => navigate("/")}
          >
            <FaTimes />
          </button>

          {/* LOGO / ICON */}
          <div className="register-icon">
            <FaGraduationCap />
          </div>

          {/* HEADER */}
          <div className="register-header">
            <h1>Create Your Account</h1>

            <p>
              Join GovPrep and start your preparation today.
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit}>

            {/* NAME */}
            <div className="register-input-group">
              <label>Full Name</label>

              <div className="register-input">
                <FaUser />

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* EMAIL */}
            <div className="register-input-group">
              <label>Email Address</label>

              <div className="register-input">
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
            <div className="register-input-group">
              <label>Password</label>

              <div className="register-input">
                <FaLock />

                <input
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="register-input-group">
              <label>Confirm Password</label>

              <div className="register-input">
                <FaLock />

                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <div className="register-error">
                {error}
              </div>
            )}

            {/* SUCCESS */}
            {message && (
              <div className="register-success">
                {message}
              </div>
            )}

            {/* REGISTER BUTTON */}
            <button
              type="submit"
              className="register-button"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

          </form>

          {/* DIVIDER */}
          <div className="register-divider">
            <span></span>

            <p>Or register with</p>

            <span></span>
          </div>

          {/* GOOGLE BUTTON */}
          <button
            type="button"
            className="google-button"
          >
            <span className="google-icon">G</span>

            Sign up with Google
          </button>

          {/* LOGIN */}
          <div className="register-login">
            <span>Already have an account?</span>

            <Link to="/login">
              Login
            </Link>
          </div>

        </div>

      </div>

    </section>
  );
}

export default Register;