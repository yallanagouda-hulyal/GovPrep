import { useState } from "react";
import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  FaGraduationCap,
  FaSearch,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";

import "../styles/Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);

    navigate("/");
  };

  return (
    <nav className="navbar">

      {/* LOGO */}
      <Link to="/" className="navbar-logo">
        <FaGraduationCap />

        <span>
          <strong>Gov</strong>Prep
        </span>
      </Link>

      {/* NAVIGATION */}
      <div className="navbar-links">

        {/* HOME */}
        <Link
          to="/"
          className={
            location.pathname === "/" ? "active" : ""
          }
        >
          Home
        </Link>

        {/* EXAMS */}
        <Link
          to="/exams"
          className={
            location.pathname === "/exams" ? "active" : ""
          }
        >
          Exams
        </Link>

        {/* COURSES */}
        <Link
          to="/courses"
          className={
            location.pathname.startsWith("/courses")
              ? "active"
              : ""
          }
        >
          Courses
        </Link>

        {/* MOCK TESTS */}
        <Link
          to="/mock-tests"
          className={
            location.pathname === "/mock-tests"
              ? "active"
              : ""
          }
        >
          Mock Tests
        </Link>


        {/* RESULTS */}
<Link
  to="/results"
  className={
    location.pathname === "/results"
      ? "active"
      : ""
  }
>
  Results
</Link>

{/* DASHBOARD */}
{user && (
  <Link
    to="/dashboard"
    className={
      location.pathname === "/dashboard"
        ? "active"
        : ""
    }
  >
    Dashboard
  </Link>
)}



      </div>

      {/* ACTIONS */}
      <div className="navbar-actions">

        {/* SEARCH */}
        <button
          type="button"
          className="navbar-search"
        >
          <FaSearch />
        </button>

        {!user ? (
          <>
            {/* LOGIN */}
            <Link
              to="/login"
              className="navbar-login"
            >
              Login
            </Link>

            {/* SIGN UP */}
            <Link
              to="/register"
              className="navbar-signup"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <>
            {/* USER */}
            <div className="navbar-user">
              <FaUserCircle />

              <span>
                {user.name}
              </span>
            </div>

            {/* LOGOUT */}
            <button
              type="button"
              className="navbar-logout"
              onClick={handleLogout}
            >
              <FaSignOutAlt />
              Logout
            </button>
          </>
        )}

      </div>

    </nav>
  );
}

export default Navbar;