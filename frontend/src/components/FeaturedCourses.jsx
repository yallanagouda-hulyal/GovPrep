import { useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaBookOpen,
  FaClock,
  FaUsers,
} from "react-icons/fa";

import "../styles/FeaturedCourses.css";

const courses = [
  {
    category: "SSC",
    title: "SSC CGL Complete Preparation",
    description:
      "Complete preparation covering Quantitative Aptitude, Reasoning, English and General Awareness.",
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=85",
    lessons: "48 Lessons",
    students: "2.5K Students",
    duration: "12 Weeks",
  },
  {
    category: "BANKING",
    title: "Banking Exam Foundation",
    description:
      "Build a strong foundation for IBPS, SBI and other banking examinations.",
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=85",
    lessons: "42 Lessons",
    students: "1.8K Students",
    duration: "10 Weeks",
  },
  {
    category: "UPSC",
    title: "UPSC Civil Services Foundation",
    description:
      "Develop your fundamentals across important subjects for civil services preparation.",
    image:
      "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=900&q=85",
    lessons: "60 Lessons",
    students: "3.2K Students",
    duration: "16 Weeks",
  },
];

function FeaturedCourses() {
  const navigate = useNavigate();

  return (
    <section className="featured-courses">

      {/* HEADING */}
      <div className="featured-courses-heading">

        <div>
          <span>FEATURED COURSES</span>

          <h2>
            Learn From Structured Courses
          </h2>

          <p>
            Start with carefully organized courses designed to
            help you prepare for your target government examination.
          </p>
        </div>

        <button
          className="view-all-courses"
          onClick={() => navigate("/courses")}
        >
          View All Courses
          <FaArrowRight />
        </button>

      </div>

      {/* COURSES */}
      <div className="courses-grid">

        {courses.map((course) => (
          <div className="course-card" key={course.title}>

            {/* IMAGE */}
            <div className="course-image">

              <img
                src={course.image}
                alt={course.title}
              />

              <span className="course-category">
                {course.category}
              </span>

            </div>

            {/* CONTENT */}
            <div className="course-content">

              <h3>
                {course.title}
              </h3>

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
                className="course-button"
                onClick={() => navigate("/courses")}
              >
                View Course
                <FaArrowRight />
              </button>

            </div>

          </div>
        ))}

      </div>

    </section>
  );
}

export default FeaturedCourses;