import { useNavigate } from "react-router-dom";
import {
  FaBook,
  FaClipboardList,
  FaQuestionCircle,
  FaUsers,
} from "react-icons/fa";

import "../styles/AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const role = user?.role;

  if (role !== "admin" && role !== "instructor") {
    return (
      <main className="admin-page">
        <div className="admin-access-denied">
          <h2>Access Denied</h2>
          <p>
            You do not have permission to access this page.
          </p>

          <button onClick={() => navigate("/")}>
            Go Home
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-page">

      <div className="admin-container">

        {/* HEADER */}

        <div className="admin-header">
          <div>
            <span className="admin-eyebrow">
              {role === "admin"
                ? "ADMIN PANEL"
                : "INSTRUCTOR PANEL"}
            </span>

            <h1>
              Welcome, {user?.name || "User"} 👋
            </h1>

            <p>
              Manage courses, lessons and quizzes
              from your dashboard.
            </p>
          </div>
        </div>

        {/* STATS */}

        <div className="admin-stats">

          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <FaBook />
            </div>

            <div>
              <span>Courses</span>
              <strong>Manage</strong>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <FaClipboardList />
            </div>

            <div>
              <span>Lessons</span>
              <strong>Manage</strong>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <FaQuestionCircle />
            </div>

            <div>
              <span>Quizzes</span>
              <strong>Manage</strong>
            </div>
          </div>

          {role === "admin" && (
            <div className="admin-stat-card">
              <div className="admin-stat-icon">
                <FaUsers />
              </div>

              <div>
                <span>Users</span>
                <strong>Manage</strong>
              </div>
            </div>
          )}

        </div>

        {/* MANAGEMENT */}

        <section className="admin-management">

          <div className="admin-section-heading">
            <span>MANAGEMENT</span>

            <h2>
              Manage Your Platform
            </h2>

            <p>
              Create and manage the learning
              content available to students.
            </p>
          </div>

          <div className="admin-management-grid">

            {/* COURSES */}

            <div className="admin-management-card">

              <div className="admin-card-icon">
                <FaBook />
              </div>

              <h3>
                Course Management
              </h3>

              <p>
                Create, update and delete courses
                for competitive exam preparation.
              </p>

              <button
                onClick={() =>
                  navigate("/admin/courses")
                }
              >
                Manage Courses →
              </button>

            </div>

            {/* LESSONS */}

            <div className="admin-management-card">

              <div className="admin-card-icon">
                <FaClipboardList />
              </div>

              <h3>
                Lesson Management
              </h3>

              <p>
                Add lessons, descriptions, videos
                and organize course content.
              </p>

              <button
                onClick={() =>
                  navigate("/admin/lessons")
                }
              >
                Manage Lessons →
              </button>

            </div>

            {/* QUIZZES */}

            <div className="admin-management-card">

              <div className="admin-card-icon">
                <FaQuestionCircle />
              </div>

              <h3>
                Quiz Management
              </h3>

              <p>
                Create quizzes and questions
                for student assessments.
              </p>

              <button
                onClick={() =>
                  navigate("/admin/quizzes")
                }
              >
                Manage Quizzes →
              </button>

            </div>

            {/* USERS — ADMIN ONLY */}

            {role === "admin" && (
              <div className="admin-management-card">

                <div className="admin-card-icon">
                  <FaUsers />
                </div>

                <h3>
                  User Management
                </h3>

                <p>
                  Manage students and instructors
                  registered on GovPrep.
                </p>

                <button
                  onClick={() =>
                    navigate("/admin/users")
                  }
                >
                  Manage Users →
                </button>

              </div>
            )}

          </div>

        </section>

      </div>

    </main>
  );
}

export default AdminDashboard;