import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  FaBookOpen,
  FaClock,
  FaPlayCircle,
  FaCheckCircle,
  FaClipboardList,
} from "react-icons/fa";

import "../styles/Learning.css";

function Learning() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);

  const [completedLessonIds, setCompletedLessonIds] =
    useState([]);

  const [progressPercentage, setProgressPercentage] =
    useState(0);

  const [quiz, setQuiz] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [completing, setCompleting] = useState(false);

  /* =========================================
     FETCH LEARNING DATA
  ========================================= */

  useEffect(() => {
    const fetchLearningData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login to access this course.");
          setLoading(false);
          return;
        }

        /* =====================================
           FETCH COURSE
        ===================================== */

        const courseResponse = await fetch(
          `http://localhost:5000/api/courses/${id}`
        );

        const courseData = await courseResponse.json();

        if (!courseResponse.ok) {
          throw new Error(
            courseData.message ||
              "Failed to load course."
          );
        }

        setCourse(courseData);

        /* =====================================
           FETCH LESSONS
        ===================================== */

        const lessonResponse = await fetch(
          `http://localhost:5000/api/lessons/course/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const lessonData = await lessonResponse.json();

        if (!lessonResponse.ok) {
          throw new Error(
            lessonData.message ||
              "Failed to load lessons."
          );
        }

        setLessons(lessonData);

        /* =====================================
           FETCH COURSE PROGRESS
        ===================================== */

        const progressResponse = await fetch(
          `http://localhost:5000/api/progress/course/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const progressData =
          await progressResponse.json();

        if (!progressResponse.ok) {
          throw new Error(
            progressData.message ||
              "Failed to load course progress."
          );
        }

        setCompletedLessonIds(
          progressData.completedLessonIds || []
        );

        setProgressPercentage(
          progressData.percentage || 0
        );

        /* =====================================
           SELECT FIRST INCOMPLETE LESSON
        ===================================== */

        if (lessonData.length > 0) {
          const firstIncompleteLesson =
            lessonData.find(
              (lesson) =>
                !(
                  progressData.completedLessonIds || []
                ).includes(lesson._id)
            );

          setSelectedLesson(
            firstIncompleteLesson || lessonData[0]
          );
        }

        /* =====================================
           FETCH COURSE QUIZ
        ===================================== */

        const quizResponse = await fetch(
          `http://localhost:5000/api/quizzes/course/${id}`
        );

        const quizData = await quizResponse.json();

        if (quizResponse.ok && quizData.length > 0) {
          setQuiz(quizData[0]);
        }
      } catch (error) {
        console.error(
          "Learning page error:",
          error
        );

        setError(
          error.message ||
            "Unable to load learning content."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLearningData();
  }, [id]);

  /* =========================================
     MARK LESSON AS COMPLETE
  ========================================= */

  const handleMarkComplete = async () => {
    if (!selectedLesson) {
      return;
    }

    try {
      setCompleting(true);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login again.");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/progress/lesson/${selectedLesson._id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to mark lesson complete."
        );
      }

      /* =====================================
         UPDATE COMPLETED LESSONS
      ===================================== */

      setCompletedLessonIds((previousIds) => {
        if (previousIds.includes(selectedLesson._id)) {
          return previousIds;
        }

        return [
          ...previousIds,
          selectedLesson._id,
        ];
      });

      /* =====================================
         UPDATE PROGRESS
      ===================================== */

      const newCompletedCount =
        completedLessonIds.includes(
          selectedLesson._id
        )
          ? completedLessonIds.length
          : completedLessonIds.length + 1;

      const newPercentage =
        lessons.length === 0
          ? 0
          : Math.round(
              (newCompletedCount /
                lessons.length) *
                100
            );

      setProgressPercentage(newPercentage);
    } catch (error) {
      console.error(
        "Progress error:",
        error
      );

      alert(
        error.message ||
          "Unable to update lesson progress."
      );
    } finally {
      setCompleting(false);
    }
  };

  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <section className="learning-page">
        <div className="learning-container">
          <div className="learning-message">
            <FaBookOpen />

            <h2>Loading your course...</h2>

            <p>
              Please wait while we load your learning
              content.
            </p>
          </div>
        </div>
      </section>
    );
  }

  /* =========================================
     ERROR
  ========================================= */

  if (error) {
    return (
      <section className="learning-page">
        <div className="learning-container">
          <div className="learning-message error">
            <FaBookOpen />

            <h2>Unable to load course</h2>

            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  /* =========================================
     MAIN PAGE
  ========================================= */

  return (
    <section className="learning-page">
      <div className="learning-container">

        {/* HEADER */}

        <div className="learning-header">
          <div>
            <span className="learning-label">
              COURSE LEARNING
            </span>

            <h1>{course?.title}</h1>

            <p>
              Continue your preparation lesson by
              lesson.
            </p>
          </div>

          <div className="learning-course-info">
            <span>
              <FaBookOpen />

              {lessons.length} Lessons
            </span>

            <span>
              <FaClock />

              {course?.duration}
            </span>
          </div>
        </div>

        {/* PROGRESS */}

        <div className="learning-progress-card">
          <div className="learning-progress-top">
            <div>
              <span>YOUR PROGRESS</span>

              <strong>
                {progressPercentage}% Complete
              </strong>
            </div>

            <div className="learning-progress-count">
              {completedLessonIds.length} /{" "}
              {lessons.length} Lessons
            </div>
          </div>

          <div className="learning-progress-bar">
            <div
              className="learning-progress-fill"
              style={{
                width: `${progressPercentage}%`,
              }}
            ></div>
          </div>
        </div>

        {/* MAIN LEARNING LAYOUT */}

        <div className="learning-layout">

          {/* LESSON SIDEBAR */}

          <aside className="lesson-sidebar">

            <div className="lesson-sidebar-header">
              <span>COURSE CONTENT</span>

              <strong>
                {lessons.length} Lessons
              </strong>
            </div>

            <div className="lesson-list">

              {lessons.map((lesson, index) => {
                const isCompleted =
                  completedLessonIds.includes(
                    lesson._id
                  );

                return (
                  <button
                    key={lesson._id}
                    type="button"
                    className={`lesson-item ${
                      selectedLesson?._id ===
                      lesson._id
                        ? "active"
                        : ""
                    } ${
                      isCompleted
                        ? "completed"
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedLesson(lesson)
                    }
                  >
                    <div className="lesson-number">
                      {isCompleted ? (
                        <FaCheckCircle />
                      ) : (
                        index + 1
                      )}
                    </div>

                    <div className="lesson-item-content">
                      <h3>
                        {lesson.title}
                      </h3>

                      <span>
                        <FaClock />

                        {lesson.duration}
                      </span>
                    </div>

                    {isCompleted ? (
                      <FaCheckCircle className="lesson-complete-icon" />
                    ) : (
                      <FaPlayCircle
                        className="lesson-play-icon"
                      />
                    )}
                  </button>
                );
              })}

            </div>
          </aside>

          {/* LESSON CONTENT */}

          <main className="lesson-main">

            {selectedLesson && (
              <>
                {/* VIDEO AREA */}

                <div className="lesson-video-placeholder">
                  <FaPlayCircle />

                  <span>
                    Lesson Video
                  </span>
                </div>

                {/* LESSON DETAILS */}

                <div className="lesson-main-content">

                  <div className="lesson-main-top">
                    <div>
                      <span className="lesson-number-label">
                        LESSON{" "}
                        {selectedLesson.orderNo}
                      </span>

                      <h2>
                        {selectedLesson.title}
                      </h2>
                    </div>

                    <div className="lesson-duration">
                      <FaClock />

                      {selectedLesson.duration}
                    </div>
                  </div>

                  {/* DESCRIPTION */}

                  <p className="lesson-description">
                    {selectedLesson.description}
                  </p>

                  {/* CONTENT */}

                  <div className="lesson-content-box">
                    <h3>
                      About this lesson
                    </h3>

                    <p>
                      {selectedLesson.content}
                    </p>
                  </div>

                  {/* COMPLETE BUTTON */}

                  {completedLessonIds.includes(
                    selectedLesson._id
                  ) ? (
                    <button
                      type="button"
                      className="mark-complete-button completed-button"
                      disabled
                    >
                      <FaCheckCircle />

                      Completed
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="mark-complete-button"
                      onClick={
                        handleMarkComplete
                      }
                      disabled={completing}
                    >
                      <FaCheckCircle />

                      {completing
                        ? "Saving..."
                        : "Mark as Complete"}
                    </button>
                  )}

                  {/* COURSE QUIZ */}

                  {quiz && (
                    <div className="course-quiz-card">
                      <div className="course-quiz-icon">
                        <FaClipboardList />
                      </div>

                      <div className="course-quiz-content">
                        <span>
                          COURSE QUIZ
                        </span>

                        <h3>
                          {quiz.title}
                        </h3>

                        <p>
                          Test your knowledge and
                          check your preparation.
                        </p>
                      </div>

                      <button
                        type="button"
                        className="course-quiz-button"
                        onClick={() =>
                          navigate(
                            `/quiz/${quiz._id}`
                          )
                        }
                      >
                        Take Quiz
                      </button>
                    </div>
                  )}

                </div>
              </>
            )}

          </main>
        </div>
      </div>
    </section>
  );
}

export default Learning;