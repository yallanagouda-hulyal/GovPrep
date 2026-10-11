import {
  FaGraduationCap,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaArrowRight,
} from "react-icons/fa";

import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer">

      {/* TOP FOOTER */}
      <div className="footer-main">

        {/* BRAND */}
        <div className="footer-brand">

          <div className="footer-logo">
            <FaGraduationCap />

            <span>
              <strong>Gov</strong>Prep
            </span>
          </div>

          <p>
            A smart government exam preparation platform
            designed to help aspirants learn, practice and
            achieve their career goals.
          </p>

          {/* SOCIAL ICONS */}
          <div className="footer-socials">

            <a href="#" aria-label="Facebook">
              <FaFacebookF />
            </a>

            <a href="#" aria-label="Instagram">
              <FaInstagram />
            </a>

            <a href="#" aria-label="LinkedIn">
              <FaLinkedinIn />
            </a>

            <a href="#" aria-label="YouTube">
              <FaYoutube />
            </a>

          </div>

        </div>

        {/* QUICK LINKS */}
        <div className="footer-column">

          <h3>Quick Links</h3>

          <a href="/">Home</a>
          <a href="/exams">Exams</a>
          <a href="/courses">Courses</a>
          <a href="/mock-tests">Mock Tests</a>
          <a href="/results">Results</a>

        </div>

        {/* EXAMS */}
        <div className="footer-column">

          <h3>Popular Exams</h3>

          <a href="/courses?exam=ssc">
            SSC
          </a>

          <a href="/courses?exam=banking">
            Banking
          </a>

          <a href="/courses?exam=railway">
            Railway
          </a>

          <a href="/courses?exam=upsc">
            UPSC
          </a>

          <a href="/courses?exam=defence">
            Defence
          </a>

        </div>

        {/* SUPPORT */}
        <div className="footer-column">

          <h3>Support</h3>

          <a href="/about">
            About Us
          </a>

          <a href="/contact">
            Contact Us
          </a>

          <a href="/privacy">
            Privacy Policy
          </a>

          <a href="/terms">
            Terms & Conditions
          </a>

          <a href="/help">
            Help Center
          </a>

        </div>

      </div>

      {/* NEWSLETTER / CTA */}
      <div className="footer-cta">

        <div>

          <strong>
            Ready to start your preparation?
          </strong>

          <p>
            Join GovPrep and take the next step toward your
            government job goal.
          </p>

        </div>

        <button>
          Start Preparing
          <FaArrowRight />
        </button>

      </div>

      {/* BOTTOM FOOTER */}
      <div className="footer-bottom">

        <p>
          © 2026 GovPrep. All rights reserved.
        </p>

        <p>
          Learn • Practice • Improve • Achieve
        </p>

      </div>

    </footer>
  );
}

export default Footer;