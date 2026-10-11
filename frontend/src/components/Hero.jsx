import { FaArrowRight, FaPlayCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/Hero.css";

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero">

      {/* LEFT CONTENT */}
      <div className="hero-content">

        <div className="hero-badge">
          <span>✓</span>
          India's Smart Government Exam Preparation Platform
        </div>

        <h1>
          Prepare Smart.
          <br />
          Practice Better.
          <br />
          <span>Achieve Your Goal.</span>
        </h1>

        <p>
          Prepare for SSC, Banking, Railway, UPSC, Defence and Police
          examinations with structured courses, mock tests and
          performance tracking.
        </p>

        <div className="hero-buttons">

          <button
            className="hero-primary"
            onClick={() => navigate("/exams")}
          >
            Explore Exams
            <FaArrowRight />
          </button>

          <button
            className="hero-secondary"
            onClick={() => navigate("/mock-tests")}
          >
            <FaPlayCircle />
            Take Free Mock Test
          </button>

        </div>

        <div className="hero-trust">

          <div>
            <strong>10K+</strong>
            <span>Aspirants</span>
          </div>

          <div>
            <strong>100+</strong>
            <span>Practice Topics</span>
          </div>

          <div>
            <strong>500+</strong>
            <span>Questions</span>
          </div>

        </div>

      </div>

      {/* RIGHT IMAGE */}
      <div className="hero-image-wrapper">

        <div className="hero-circle"></div>

        <img
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=85"
          alt="Students preparing for exams"
          className="hero-image"
        />

        <div className="hero-floating-card">
          <span className="floating-icon">📊</span>

          <div>
            <strong>Track Your Progress</strong>
            <small>Learn • Practice • Improve</small>
          </div>
        </div>

      </div>

    </section>
  );
}

export default Hero;