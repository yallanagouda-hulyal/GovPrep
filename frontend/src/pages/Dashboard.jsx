import { useEffect, useState } from "react";

import {
  FaBookOpen,
  FaChartLine,
  FaClipboardCheck,
  FaArrowRight,
  FaPlay,
  FaTrophy,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";

import { Link, useNavigate } from "react-router-dom";

import "../styles/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  // =========================================
  // USER
  // =========================================

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const userName = user?.name || "Student";

  // =========================================
  // COURSE STATE
  // =========================================

  const [myCourses, setMyCourses] = useState([]);
  const [courseProgress, setCourseProgress] = useState({});
  const [overallProgress, setOverallProgress] = useState(0);

  // =========================================
  // RESULT STATE
  // =========================================

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resultsLoading, setResultsLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================
  // REDIRECT ADMIN / INSTRUCTOR
  // =========================================

  useEffect(() => {
    if (
      user?.role === "admin" ||
      user?.role === "instructor"
    ) {
      navigate("/admin", { replace: true });
    }
  }, [user, navigate]);

  // =========================================
  // FETCH DASHBOARD DATA
  // =========================================

  useEffect(() => {
    // Do not fetch student dashboard data
    // for Admin or Instructor
    if (
      user?.role === "admin" ||
      user?.role === "instructor"
    ) {
      setLoading(false);
      setResultsLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        setResultsLoading(false);
        return;
      }

      // =====================================
      // FETCH COURSES
      // =====================================

      try {
        const response = await fetch(
          "http://localhost:5000/api/enrollments/my-courses",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load courses."
          );
        }

        setMyCourses(
          Array.isArray(data) ? data : []
        );

        // =================================
        // FETCH COURSE PROGRESS
        // =================================

        const progressResults =
          await Promise.all(
            data.map(async (item) => {
              try {
                const progressResponse =
                  await fetch(
                    `http://localhost:5000/api/progress/course/${item.course._id}`,
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );

                const progressData =
                  await progressResponse.json();

                if (!progressResponse.ok) {
                  return {
                    courseId: item.course._id,
                    percentage: 0,
                  };
                }

                return {
                  courseId: item.course._id,
                  percentage:
                    progressData.percentage || 0,
                };
              } catch (error) {
                console.error(
                  "Course progress error:",
                  error
                );

                return {
                  courseId: item.course._id,
                  percentage: 0,
                };
              }
            })
          );

        // =================================
        // CREATE PROGRESS MAP
        // =================================

        const progressMap = {};

        progressResults.forEach((item) => {
          progressMap[item.courseId] =
            item.percentage;
        });

        setCourseProgress(progressMap);

        // =================================
        // OVERALL PROGRESS
        // =================================

        if (progressResults.length > 0) {
          const totalProgress =
            progressResults.reduce(
              (sum, item) =>
                sum + item.percentage,
              0
            );

          const averageProgress =
            Math.round(
              totalProgress /
                progressResults.length
            );

          setOverallProgress(
            averageProgress
          );
        } else {
          setOverallProgress(0);
        }
      } catch (error) {
        console.error(
          "Dashboard course error:",
          error
        );

        setError(
          "Unable to load your courses."
        );
      } finally {
        setLoading(false);
      }

      // =====================================
      // FETCH MOCK TEST RESULTS
      // =====================================

      try {
        const resultsResponse =
          await fetch(
            "http://localhost:5000/api/results/mock-tests",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        const resultsData =
          await resultsResponse.json();

        if (!resultsResponse.ok) {
          throw new Error(
            resultsData.message ||
              "Failed to load results."
          );
        }

        setResults(
          Array.isArray(resultsData)
            ? resultsData
            : []
        );
      } catch (error) {
        console.error(
          "Dashboard results error:",
          error
        );

        setResults([]);
      } finally {
        setResultsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // =========================================
  // DASHBOARD STATS
  // =========================================

  const enrolledCoursesCount =
    myCourses.length;

  const mockTestsCount =
    results.length;

  const averageScore =
    results.length > 0
      ? Math.round(
          results.reduce(
            (sum, result) =>
              sum +
              (result.percentage || 0),
            0
          ) / results.length
        )
      : 0;

  const latestResult =
    results.length > 0
      ? results[0]
      : null;

  // =========================================
  // RETURN
  // =========================================

  return (
    <section className="dashboard-page">
      <div className="dashboard-container">

        {/* =====================================
            DASHBOARD HEADER
        ===================================== */}

        <div className="dashboard-header">

          <div>

            <span className="dashboard-label">
              STUDENT DASHBOARD
            </span>

            <h1>
              Welcome back, {userName}! 👋
            </h1>

            <p>
              Continue your preparation and keep
              moving towards your government exam goal.
            </p>

          </div>

          <div className="dashboard-header-action">

            <Link to="/courses">
              Explore Courses
              <FaArrowRight />
            </Link>

          </div>

        </div>

        {/* =====================================
            STAT CARDS
        ===================================== */}

        <div className="dashboard-stats">

          {/* ENROLLED COURSES */}

          <div className="dashboard-stat-card">

            <div className="dashboard-stat-icon blue">
              <FaBookOpen />
            </div>

            <div>

              <span>
                Enrolled Courses
              </span>

              <strong>
                {enrolledCoursesCount}
              </strong>

              <small>
                Active learning
              </small>

            </div>

          </div>

          {/* PROGRESS */}

          <div className="dashboard-stat-card">

            <div className="dashboard-stat-icon green">
              <FaChartLine />
            </div>

            <div>

              <span>
                Overall Progress
              </span>

              <strong>
                {overallProgress}%
              </strong>

              <small>
                Course progress
              </small>

            </div>

          </div>

          {/* MOCK TESTS */}

          <div className="dashboard-stat-card">

            <div className="dashboard-stat-icon purple">
              <FaClipboardCheck />
            </div>

            <div>

              <span>
                Mock Tests
              </span>

              <strong>
                {resultsLoading
                  ? "..."
                  : mockTestsCount}
              </strong>

              <small>
                Tests attempted
              </small>

            </div>

          </div>

          {/* SCORE */}

          <div className="dashboard-stat-card">

            <div className="dashboard-stat-icon orange">
              <FaTrophy />
            </div>

            <div>

              <span>
                Average Score
              </span>

              <strong>
                {resultsLoading
                  ? "..."
                  : `${averageScore}%`}
              </strong>

              <small>
                Across mock tests
              </small>

            </div>

          </div>

        </div>

        {/* =====================================
            MAIN GRID
        ===================================== */}

        <div className="dashboard-grid">

          {/* ===================================
              MY LEARNING
          =================================== */}

          <div className="dashboard-section">

            <div className="dashboard-section-header">

              <div>

                <span className="dashboard-section-label">
                  MY LEARNING
                </span>

                <h2>
                  Continue Learning
                </h2>

              </div>

              <Link to="/courses">
                View Courses
                <FaArrowRight />
              </Link>

            </div>

            {/* LOADING */}

            {loading && (
              <div className="dashboard-empty">

                <div className="dashboard-empty-icon">
                  <FaBookOpen />
                </div>

                <h3>
                  Loading your courses...
                </h3>

                <p>
                  Please wait while we load
                  your enrolled courses.
                </p>

              </div>
            )}

            {/* ERROR */}

            {!loading && error && (
              <div className="dashboard-empty">

                <div className="dashboard-empty-icon">
                  <FaBookOpen />
                </div>

                <h3>
                  Something went wrong
                </h3>

                <p>
                  {error}
                </p>

              </div>
            )}

            {/* NO COURSES */}

            {!loading &&
              !error &&
              myCourses.length === 0 && (

                <div className="dashboard-empty">

                  <div className="dashboard-empty-icon">
                    <FaBookOpen />
                  </div>

                  <h3>
                    No courses enrolled yet
                  </h3>

                  <p>
                    Enroll in a course and start
                    building your preparation step
                    by step.
                  </p>

                  <Link
                    to="/courses"
                    className="dashboard-primary-button"
                  >
                    Browse Courses
                    <FaArrowRight />
                  </Link>

                </div>
              )}

            {/* ENROLLED COURSES */}

            {!loading &&
              !error &&
              myCourses.length > 0 && (

                <div className="my-courses-list">

                  {myCourses.map((item) => {

                    const course =
                      item.course;

                    const progress =
                      courseProgress[
                        course._id
                      ] || 0;

                    return (
                      <div
                        className="my-course-card"
                        key={
                          item.enrollmentId
                        }
                      >

                        {/* IMAGE */}

                        <div className="my-course-image">

                          <img
                            src={
                              course.image
                            }
                            alt={
                              course.title
                            }
                          />

                        </div>

                        {/* CONTENT */}

                        <div className="my-course-content">

                          <span className="my-course-exam">
                            {course.exam}
                          </span>

                          <h3>
                            {course.title}
                          </h3>

                          <p>
                            {course.description}
                          </p>

                          {/* COURSE INFO */}

                          <div className="my-course-info">

                            <span>
                              <FaBookOpen />
                              {course.lessons}
                            </span>

                            <span>
                              <FaClock />
                              {course.duration}
                            </span>

                            <span>
                              <FaCheckCircle />
                              Enrolled
                            </span>

                          </div>

                          {/* PROGRESS */}

                          <div className="my-course-progress">

                            <div className="progress-header">

                              <span>
                                Course Progress
                              </span>

                              <strong>
                                {progress}%
                              </strong>

                            </div>

                            <div className="progress-bar">

                              <div
                                className="progress-fill"
                                style={{
                                  width: `${progress}%`,
                                }}
                              />

                            </div>

                          </div>

                          {/* CONTINUE BUTTON */}

                          <Link
                            to={`/learning/${course._id}`}
                            className="continue-learning-button"
                          >

                            <FaPlay />

                            {progress > 0
                              ? "Continue Learning"
                              : "Start Learning"}

                          </Link>

                        </div>

                      </div>
                    );
                  })}

                </div>
              )}

          </div>

          {/* ===================================
              ASSESSMENT
          =================================== */}

          <div className="dashboard-section">

            <div className="dashboard-section-header">

              <div>

                <span className="dashboard-section-label">
                  ASSESSMENT
                </span>

                <h2>
                  Practice & Test
                </h2>

              </div>

              <Link to="/mock-tests">
                View Tests
                <FaArrowRight />
              </Link>

            </div>

            <div className="assessment-list">

              {/* MOCK TEST */}

              <div className="assessment-card">

                <div className="assessment-icon blue">
                  <FaClipboardCheck />
                </div>

                <div className="assessment-content">

                  <h3>
                    Mock Tests
                  </h3>

                  <p>
                    Test your preparation with
                    exam-style questions.
                  </p>

                  <span>
                    <FaClock />
                    25 questions · 30 minutes
                  </span>

                </div>

                <Link
                  to="/mock-tests"
                  className="assessment-button"
                >
                  Start
                </Link>

              </div>

              {/* COURSE QUIZ */}

              <div className="assessment-card">

                <div className="assessment-icon green">
                  <FaCheckCircle />
                </div>

                <div className="assessment-content">

                  <h3>
                    Course Quiz
                  </h3>

                  <p>
                    Check your understanding after
                    completing lessons.
                  </p>

                  <span>
                    <FaClock />
                    MCQ based assessment
                  </span>

                </div>

                <Link
                  to={
                    myCourses.length > 0
                      ? `/learning/${myCourses[0].course._id}`
                      : "/courses"
                  }
                  className="assessment-button"
                >
                  Start
                </Link>

              </div>

              {/* PERFORMANCE */}

              <div className="assessment-card">

                <div className="assessment-icon purple">
                  <FaChartLine />
                </div>

                <div className="assessment-content">

                  <h3>
                    My Performance
                  </h3>

                  <p>
                    Track your scores and improve
                    your preparation.
                  </p>

                  <span>
                    <FaTrophy />
                    {mockTestsCount} test
                    {mockTestsCount === 1
                      ? ""
                      : "s"} completed
                  </span>

                </div>

                <Link
                  to="/results"
                  className="assessment-button"
                >
                  View
                </Link>

              </div>

            </div>

          </div>

        </div>

        {/* =====================================
            RECENT RESULT
        ===================================== */}

        {latestResult && (
          <div className="dashboard-section recent-result-section">

            <div className="dashboard-section-header">

              <div>

                <span className="dashboard-section-label">
                  LATEST PERFORMANCE
                </span>

                <h2>
                  Recent Mock Test
                </h2>

              </div>

              <Link to="/results">
                View All Results
                <FaArrowRight />
              </Link>

            </div>

            <div className="assessment-card">

              <div className="assessment-icon purple">
                <FaTrophy />
              </div>

              <div className="assessment-content">

                <h3>
                  {latestResult.mockTest?.title ||
                    "Mock Test"}
                </h3>

                <p>
                  Score:{" "}
                  <strong>
                    {latestResult.score}/
                    {latestResult.totalQuestions}
                  </strong>
                </p>

                <span>
                  <FaCheckCircle />
                  {latestResult.correctAnswers} correct
                  {" · "}
                  {latestResult.wrongAnswers} wrong
                </span>

              </div>

              <Link
                to="/results"
                className="assessment-button"
              >
                View Result
              </Link>

            </div>

          </div>
        )}

        {/* =====================================
            QUICK ACTIONS
        ===================================== */}

        <div className="dashboard-quick-section">

          <div className="dashboard-section-header">

            <div>

              <span className="dashboard-section-label">
                QUICK ACTIONS
              </span>

              <h2>
                Start Your Preparation
              </h2>

            </div>

          </div>

          <div className="quick-actions">

            {/* EXPLORE COURSES */}

            <Link
              to="/courses"
              className="quick-action"
            >

              <div className="quick-action-icon">
                <FaBookOpen />
              </div>

              <div>

                <h3>
                  Explore Courses
                </h3>

                <p>
                  Find a course for your target exam.
                </p>

              </div>

              <FaArrowRight />

            </Link>

            {/* MOCK TESTS */}

            <Link
              to="/mock-tests"
              className="quick-action"
            >

              <div className="quick-action-icon">
                <FaPlay />
              </div>

              <div>

                <h3>
                  Take Mock Test
                </h3>

                <p>
                  Practice with exam-style questions.
                </p>

              </div>

              <FaArrowRight />

            </Link>

            {/* PERFORMANCE */}

            <Link
              to="/results"
              className="quick-action"
            >

              <div className="quick-action-icon">
                <FaTrophy />
              </div>

              <div>

                <h3>
                  View Performance
                </h3>

                <p>
                  Track your preparation performance.
                </p>

              </div>

              <FaArrowRight />

            </Link>

          </div>

        </div>

        {/* =====================================
            BOTTOM MESSAGE
        ===================================== */}

        <div className="dashboard-bottom-card">

          <div>

            <span>
              KEEP GOING
            </span>

            <h2>
              Prepare Smart. Practice Daily.
            </h2>

            <p>
              Consistent preparation is the key
              to improving your performance.
            </p>

          </div>

          <FaTrophy />

        </div>

      </div>
    </section>
  );
}

export default Dashboard;