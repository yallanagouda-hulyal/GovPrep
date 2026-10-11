import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  FaArrowRight,
  FaBookOpen,
  FaClock,
  FaUsers,
  FaSearch,
} from "react-icons/fa";

import "../styles/Courses.css";

function Courses() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const selectedExam = searchParams.get("exam") || "all";

  // Fetch courses from MongoDB
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/courses"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }

        const data = await response.json();

        setCourses(data);
      } catch (error) {
        console.error(error);
        setError("Unable to load courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Filter courses
  const filteredCourses = courses.filter((course) => {
    const matchesExam =
      selectedExam === "all" ||
      course.exam.toLowerCase() === selectedExam.toLowerCase();

    const matchesSearch =
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.description.toLowerCase().includes(search.toLowerCase());

    return matchesExam && matchesSearch;
  });

  // Open course details
  const openCourse = (course) => {
    navigate(`/courses/${course._id}`);
  };

  // Loading state
  if (loading) {
    return (
      <section className="courses-page">
        <div className="courses-empty">
          <h2>Loading Courses...</h2>
          <p>Please wait while we load the courses.</p>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="courses-page">
        <div className="courses-empty">
          <h2>Something went wrong</h2>
          <p>{error}</p>

          <button onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="courses-page">

      {/* HEADER */}

      <div className="courses-header">

        <span className="courses-label">
          📚 &nbsp; LEARN WITH GOVPREP
        </span>

        <h1>
          Find the Right <span>Course</span>
        </h1>

        <p>
          Choose a structured preparation course and build the
          knowledge, skills and confidence you need for your target exam.
        </p>

      </div>


      {/* SEARCH + FILTER */}

      <div className="courses-toolbar">

        <div className="course-search">

          <FaSearch />

          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

        </div>


        <div className="course-filter">

          <button
            className={selectedExam === "all" ? "active" : ""}
            onClick={() => navigate("/courses")}
          >
            All Courses
          </button>

          <button
            className={selectedExam === "ssc" ? "active" : ""}
            onClick={() => navigate("/courses?exam=ssc")}
          >
            SSC
          </button>

          <button
            className={selectedExam === "banking" ? "active" : ""}
            onClick={() => navigate("/courses?exam=banking")}
          >
            Banking
          </button>

          <button
            className={selectedExam === "railway" ? "active" : ""}
            onClick={() => navigate("/courses?exam=railway")}
          >
            Railway
          </button>

          <button
            className={selectedExam === "upsc" ? "active" : ""}
            onClick={() => navigate("/courses?exam=upsc")}
          >
            UPSC
          </button>

          <button
            className={selectedExam === "defence" ? "active" : ""}
            onClick={() => navigate("/courses?exam=defence")}
          >
            Defence
          </button>

          <button
            className={selectedExam === "police" ? "active" : ""}
            onClick={() => navigate("/courses?exam=police")}
          >
            Police
          </button>

        </div>

      </div>


      {/* RESULT INFO */}

      <div className="courses-result">

        <div>

          <strong>
            {selectedExam === "all"
              ? "All Courses"
              : `${selectedExam.toUpperCase()} Courses`}
          </strong>

          <span>
            {filteredCourses.length} courses available
          </span>

        </div>

      </div>


      {/* COURSE GRID */}

      <div className="courses-grid">

        {filteredCourses.map((course) => (

          <article
            className="course-card"
            key={course._id}
          >

            {/* IMAGE */}

            <div className="course-card-image">

              <img
                src={course.image}
                alt={course.title}
              />

              <span className="course-exam-badge">
                {course.exam}
              </span>

            </div>


            {/* CONTENT */}

            <div className="course-card-content">

              <div className="course-level">
                {course.level}
              </div>

              <h2>
                {course.title}
              </h2>

              <p>
                {course.description}
              </p>


              {/* COURSE INFO */}

              <div className="course-info">

                <span>
                  <FaBookOpen />
                  {course.lessons}
                </span>

                <span>
                  <FaUsers />
                  {course.students}
                </span>

                <span>
                  <FaClock />
                  {course.duration}
                </span>

              </div>


              {/* BUTTON */}

              <button
                type="button"
                className="course-view-button"
                onClick={() => openCourse(course)}
              >
                View Course
                <FaArrowRight />
              </button>

            </div>

          </article>

        ))}

      </div>


      {/* EMPTY STATE */}

      {filteredCourses.length === 0 && (

        <div className="courses-empty">

          <h2>
            No courses found
          </h2>

          <p>
            Try another search or examination category.
          </p>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              navigate("/courses");
            }}
          >
            View All Courses
          </button>

        </div>

      )}

    </section>
  );
}

export default Courses;