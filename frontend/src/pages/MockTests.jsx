import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaClock,
  FaQuestionCircle,
  FaAward,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";

import "../styles/MockTests.css";

function MockTests() {
  const navigate = useNavigate();

  const [mockTests, setMockTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("full");

  // ================================
  // FETCH MOCK TESTS
  // ================================

  useEffect(() => {
    const fetchMockTests = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:5000/api/mock-tests"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load mock tests."
          );
        }

        if (!Array.isArray(data)) {
          throw new Error(
            "Invalid mock test data received."
          );
        }

        setMockTests(data);
      } catch (err) {
        console.error("Mock tests error:", err);

        setError(
          err.message || "Unable to load mock tests."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMockTests();
  }, []);

  // ================================
  // START MOCK TEST
  // ================================

  const handleAttempt = (mockTest) => {
    const mockTestId =
      mockTest?._id || mockTest?.id;

    if (!mockTestId) {
      alert("Mock Test ID is missing.");
      return;
    }

    navigate(`/mock-tests/${mockTestId}`);
  };

  return (
    <section className="mock-tests-section">
      <div className="mock-tests-container">

        {/* ================================
            SECTION HEADING
        ================================= */}

        <div className="mock-heading">

          <span className="mock-eyebrow">
            MOCK TESTS
          </span>

          <h2>
            Practice Like the Real Exam
          </h2>

          <p>
            Test your preparation with realistic mock
            tests, improve your accuracy and build
            exam confidence.
          </p>

        </div>

        {/* ================================
            TABS
        ================================= */}

        <div className="mock-tabs-wrapper">

          <button
            type="button"
            className={
              activeTab === "full"
                ? "mock-tab active"
                : "mock-tab"
            }
            onClick={() => setActiveTab("full")}
          >
            Full Length Tests
          </button>

          <button
            type="button"
            className={
              activeTab === "short"
                ? "mock-tab active"
                : "mock-tab"
            }
            onClick={() => setActiveTab("short")}
          >
            Short Quizzes
          </button>

        </div>

        {/* ================================
            LOADING
        ================================= */}

        {loading && (
          <div className="mock-state">
            Loading mock tests...
          </div>
        )}

        {/* ================================
            ERROR
        ================================= */}

        {!loading && error && (
          <div className="mock-state mock-error">
            <h3>Unable to load mock tests</h3>
            <p>{error}</p>
          </div>
        )}

        {/* ================================
            FULL LENGTH TESTS
        ================================= */}

        {!loading &&
          !error &&
          activeTab === "full" && (

            <div className="mock-list">

              {mockTests.length === 0 ? (

                <div className="mock-state">
                  <h3>No Mock Tests Available</h3>
                  <p>
                    New mock tests will be added soon.
                  </p>
                </div>

              ) : (

                mockTests.map((mockTest) => {

                  const mockTestId =
                    mockTest?._id ||
                    mockTest?.id;

                  const questionCount =
                    mockTest.totalQuestions ??
                    mockTest.questions?.length ??
                    0;

                  const marks =
                    mockTest.totalMarks ??
                    questionCount;

                  const duration =
                    mockTest.duration ?? 30;

                  return (
                    <article
                      className="mock-card"
                      key={mockTestId}
                    >

                      {/* LEFT SIDE */}

                      <div className="mock-card-main">

                        <span className="mock-card-badge">
                          FULL LENGTH TEST
                        </span>

                        <h3>
                          {mockTest.title}
                        </h3>

                        <p className="mock-card-description">
                          Complete a full-length practice
                          test and evaluate your exam
                          preparation.
                        </p>

                        {/* TEST STATS */}

                        <div className="mock-stats">

                          <div className="mock-stat">

                            <FaQuestionCircle />

                            <div>
                              <strong>
                                {questionCount}
                              </strong>

                              <span>
                                Questions
                              </span>
                            </div>

                          </div>

                          <div className="mock-stat">

                            <FaAward />

                            <div>
                              <strong>
                                {marks}
                              </strong>

                              <span>
                                Marks
                              </span>
                            </div>

                          </div>

                          <div className="mock-stat">

                            <FaClock />

                            <div>
                              <strong>
                                {duration}
                              </strong>

                              <span>
                                Minutes
                              </span>
                            </div>

                          </div>

                        </div>

                      </div>

                      {/* RIGHT SIDE */}

                      <div className="mock-card-action">

                        {!mockTest.negativeMarking && (
                          <div className="mock-no-negative">
                            <FaCheckCircle />
                            No Negative Marking
                          </div>
                        )}

                        {mockTest.negativeMarking && (
                          <div className="mock-negative">
                            Negative Marking
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            handleAttempt(mockTest)
                          }
                        >
                          <span>
                            Start Test
                          </span>

                          <FaArrowRight />
                        </button>

                      </div>

                    </article>
                  );
                })
              )}

            </div>
          )}

        {/* ================================
            SHORT QUIZZES
        ================================= */}

        {!loading &&
          !error &&
          activeTab === "short" && (

            <div className="short-quiz-box">

              <div className="short-icon">
                ?
              </div>

              <div>
                <h3>
                  Short Quizzes Coming Soon
                </h3>

                <p>
                  Topic-based quizzes will help you
                  practice individual subjects quickly.
                </p>
              </div>

            </div>
          )}

      </div>
    </section>
  );
}

export default MockTests;