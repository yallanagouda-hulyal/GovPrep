import {
  FaBookOpen,
  FaClipboardCheck,
  FaChartLine,
  FaBullseye,
  FaArrowRight,
} from "react-icons/fa";

import { Link } from "react-router-dom";
import "../styles/WhyChoose.css";

const features = [
  {
    number: "01",
    icon: <FaBookOpen />,
    title: "Structured Learning",
    label: "Learn",
    description:
      "Follow organized courses and topic-wise lessons designed around your target examination.",
  },
  {
    number: "02",
    icon: <FaClipboardCheck />,
    title: "Smart Mock Tests",
    label: "Practice",
    description:
      "Practice with exam-style questions and mock tests to improve speed, accuracy and confidence.",
  },
  {
    number: "03",
    icon: <FaChartLine />,
    title: "Track Your Progress",
    label: "Improve",
    description:
      "Monitor your scores, accuracy and performance to understand where you need to improve.",
  },
  {
    number: "04",
    icon: <FaBullseye />,
    title: "Exam-Focused Preparation",
    label: "Achieve",
    description:
      "Focus on important subjects, topics and practice areas for your selected government exam.",
  },
];

function WhyChoose() {
  return (
    <section className="why-choose">

      {/* HEADING */}
      <div className="why-choose-heading">

        <span className="why-label">
          WHY GOVPREP
        </span>

        <h2>
          Everything You Need to
          <span> Prepare Better</span>
        </h2>

        <p>
          One platform to learn, practice, track your performance
          and move closer to your government job goal.
        </p>

      </div>

      {/* FEATURE CARDS */}
      <div className="features-grid">

        {features.map((feature) => (
          <div className="feature-card" key={feature.number}>

            <div className="feature-top">

              <span className="feature-number">
                {feature.number}
              </span>

              <div className="feature-icon">
                {feature.icon}
              </div>

            </div>

            <span className="feature-label">
              {feature.label}
            </span>

            <h3>
              {feature.title}
            </h3>

            <p>
              {feature.description}
            </p>

            <div className="feature-line">
              <span></span>
            </div>

          </div>
        ))}

      </div>

      {/* BOTTOM STRIP */}
      <div className="why-bottom">

        <div className="why-bottom-content">

          <div>
            <strong>
              Your preparation. Your progress. Your goal.
            </strong>

            <p>
              Start preparing today with GovPrep.
            </p>
          </div>

          <Link to="/courses" className="cta-button">
          Start Preparing
          <FaArrowRight />
        </Link>

         

        </div>

      </div>

    </section>
  );
}

export default WhyChoose;