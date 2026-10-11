import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaArrowRight,
  FaBookOpen,
  FaClock,
  FaUsers,
  FaCheckCircle,
} from "react-icons/fa";

import "../styles/CourseDetails.css";

function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/courses/${id}`
        );

        if (!response.ok) {
          throw new Error("Course not found");
        }

        const data = await response.json();

        setCourse(data);
      } catch (error) {
        console.error(error);
        setError("Unable to load course.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

const handleEnroll = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/login");
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:5000/api/enrollments",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          courseId: course._id,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Enrollment failed.");
      return;
    }

    alert("🎉 You have successfully enrolled in this course!");

  } catch (error) {
    console.error("Enrollment error:", error);

    alert("Unable to enroll. Please try again.");
  }
};

  if (loading) {
    return (
      <section className="course-details-page">
        <div className="course-details-empty">
          <h2>Loading Course...</h2>
          <p>Please wait while we load the course details.</p>
        </div>
      </section>
    );
  }

  if (error || !course) {
    return (
      <section className="course-details-page">
        <div className="course-details-empty">
          <h2>Course Not Found</h2>

          <p>
            The course you are looking for could not be found.
          </p>

          <button
            type="button"
            onClick={() => navigate("/courses")}
          >
            <FaArrowLeft />
            Back to Courses
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="course-details-page">

      {/* BACK BUTTON */}
      <div className="course-details-container">

        <button
          type="button"
          className="course-back-button"
          onClick={() => navigate("/courses")}
        >
          <FaArrowLeft />
          Back to Courses
        </button>

        {/* HERO */}
        <div className="course-details-hero">

          <div className="course-details-image">
            <img
              src={course.image}
              alt={course.title}
            />
          </div>

          <div className="course-details-content">

            <span className="course-details-exam">
              {course.exam}
            </span>

            <span className="course-details-level">
              {course.level}
            </span>

            <h1>{course.title}</h1>

            <p className="course-details-description">
              {course.description}
            </p>

            {/* COURSE STATS */}
            <div className="course-details-stats">

              <div>
                <FaBookOpen />
                <span>
                  <strong>{course.lessons}</strong>
                  Lessons
                </span>
              </div>

              <div>
                <FaClock />
                <span>
                  <strong>{course.duration}</strong>
                  Duration
                </span>
              </div>

              <div>
                <FaUsers />
                <span>
                  <strong>{course.students}</strong>
                  Enrolled
                </span>
              </div>

            </div>

            {/* ENROLL */}
            <button
              type="button"
              className="course-enroll-button"
              onClick={handleEnroll}
            >
              Enroll Now
              <FaArrowRight />
            </button>

          </div>

        </div>

        {/* COURSE INFORMATION */}
        <div className="course-details-grid">

          {/* WHAT YOU WILL LEARN */}
          <div className="course-learning-section">

            <span className="course-section-label">
              COURSE OVERVIEW
            </span>

            <h2>What You'll Learn</h2>

            <p>
              This course is designed to help you build strong
              fundamentals and prepare systematically for your
              target examination.
            </p>

            <div className="learning-list">

              <div>
                <FaCheckCircle />
                <span>
                  Understand important concepts and fundamentals
                </span>
              </div>

              <div>
                <FaCheckCircle />
                <span>
                  Practice important examination topics
                </span>
              </div>

              <div>
                <FaCheckCircle />
                <span>
                  Improve your problem-solving skills
                </span>
              </div>

              <div>
                <FaCheckCircle />
                <span>
                  Prepare with structured learning
                </span>
              </div>

              <div>
                <FaCheckCircle />
                <span>
                  Build confidence through regular practice
                </span>
              </div>

            </div>

          </div>

          {/* COURSE CONTENT */}
          <div className="course-content-section">

            <span className="course-section-label">
              CURRICULUM
            </span>

            <h2>Course Content</h2>

            <div className="curriculum-list">

              <div className="curriculum-item">
                <span>01</span>
                <div>
                  <strong>General Awareness</strong>
                  <p>Important concepts and topics</p>
                </div>
              </div>

              <div className="curriculum-item">
                <span>02</span>
                <div>
                  <strong>Quantitative Aptitude</strong>
                  <p>Practice important numerical topics</p>
                </div>
              </div>

              <div className="curriculum-item">
                <span>03</span>
                <div>
                  <strong>Reasoning Ability</strong>
                  <p>Logical and analytical reasoning</p>
                </div>
              </div>

              <div className="curriculum-item">
                <span>04</span>
                <div>
                  <strong>English Language</strong>
                  <p>Grammar, vocabulary and comprehension</p>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default CourseDetails;