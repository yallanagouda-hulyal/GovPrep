import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaCalendarAlt,
  FaLock,
  FaArrowRight,
} from "react-icons/fa";

import "../styles/MockTests.css";

function MockTests() {
  const navigate = useNavigate();

  const [mockTests, setMockTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("full");

  useEffect(() => {
    const fetchMockTests = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/mock-tests"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load mock tests."
          );
        }

        setMockTests(data);
      } catch (error) {
        console.error(
          "Mock tests error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMockTests();
  }, []);

  return (
    <main className="mock-tests-page">
      <div className="mock-tests-wrapper">

        {/* =====================================
            CONTENT TABS
        ===================================== */}

        <div className="mock-content-tabs">
          <span className="mock-content-label">
            CONTENT:
          </span>

          <button
            type="button"
            className={
              activeTab === "full"
                ? "mock-tab active"
                : "mock-tab"
            }
            onClick={() =>
              setActiveTab("full")
            }
          >
            FULL LENGTH TEST
          </button>

          <button
            type="button"
            className={
              activeTab === "short"
                ? "mock-tab active"
                : "mock-tab"
            }
            onClick={() =>
              setActiveTab("short")
            }
          >
            SHORT QUIZ
          </button>
        </div>

        <div className="mock-divider"></div>

        {/* =====================================
            FULL LENGTH TEST
        ===================================== */}

        {activeTab === "full" && (
          <section className="mock-test-list">

            {loading ? (
              <div className="mock-loading">
                Loading mock tests...
              </div>
            ) : mockTests.length === 0 ? (
              <div className="mock-empty">
                No mock tests available.
              </div>
            ) : (
              mockTests.map((mockTest) => (
                <div
                  className="mock-test-row"
                  key={mockTest._id}
                >

                  {/* TEST INFORMATION */}

                  <div className="mock-test-info">

                    <div className="mock-test-title">
                      <FaCalendarAlt />

                      <h2>
                        {mockTest.title}
                      </h2>
                    </div>

                    <div className="mock-test-meta">

                      <span>
                        {mockTest.totalQuestions} Q
                      </span>

                      <span>
                        {mockTest.totalMarks} Marks
                      </span>

                      <span>
                        {mockTest.duration} Mins
                      </span>

                      <span className="retake-text">
                        No Negative Marking
                      </span>

                    </div>

                  </div>

                  {/* ATTEMPT */}

                  <button
                    type="button"
                    className="attempt-button"
                    onClick={() =>
                      navigate(
                        `/mock-tests/${mockTest._id}`
                      )
                    }
                  >
                    <span>
                      Attempt
                    </span>

                    <FaLock />
                  </button>

                  <FaArrowRight className="attempt-arrow" />

                </div>
              ))
            )}

          </section>
        )}

        {/* =====================================
            SHORT QUIZ
        ===================================== */}

        {activeTab === "short" && (
          <section className="short-quiz-section">

            <div className="short-quiz-card">

              <div className="short-quiz-icon">
                ?
              </div>

              <div>
                <h2>
                  Short Quizzes
                </h2>

                <p>
                  Short topic-based quizzes
                  will be available here soon.
                </p>
              </div>

            </div>

          </section>
        )}

      </div>
    </main>
  );
}

export default MockTests;