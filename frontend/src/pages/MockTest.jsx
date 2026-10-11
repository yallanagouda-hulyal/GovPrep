import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  FaChevronLeft,
  FaChevronRight,
  FaFlag,
  FaCheck,
  FaTimes,
  FaClock,
} from "react-icons/fa";

import "../styles/MockTest.css";

function MockTest() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [mockTest, setMockTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedQuestions, setMarkedQuestions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);

  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  /* =========================================
     CHECK MOCK TEST ID
  ========================================= */

  useEffect(() => {
    if (!id || id === "undefined") {
      console.error(
        "Mock Test ID is missing:",
        id
      );

      setError(
        "Mock Test ID is missing. Please open the test from the Mock Tests page."
      );

      setLoading(false);
      return;
    }

    const fetchMockTest = async () => {
      try {
        setLoading(true);
        setError("");

        console.log(
          "Fetching Mock Test ID:",
          id
        );

        const response = await fetch(
          `http://localhost:5000/api/mock-tests/${id}`
        );

        const data = await response.json();

        console.log(
          "Mock Test API Response:",
          data
        );

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load mock test."
          );
        }

        if (!data || !data._id) {
          throw new Error(
            "Invalid mock test data received."
          );
        }

        setMockTest(data);

        setTimeLeft(
          (data.duration || 30) * 60
        );
      } catch (error) {
        console.error(
          "Mock test error:",
          error
        );

        setError(
          error.message ||
            "Unable to load mock test."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMockTest();
  }, [id]);

  /* =========================================
     QUESTIONS
  ========================================= */

  const questions = useMemo(() => {
    return mockTest?.questions || [];
  }, [mockTest]);

  const question =
    questions[currentQuestion];

  /* =========================================
     TIMER
  ========================================= */

  useEffect(() => {
    if (
      loading ||
      !mockTest ||
      submitted ||
      timeLeft <= 0
    ) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((previousTime) => {
        if (previousTime <= 1) {
          return 0;
        }

        return previousTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [
    loading,
    mockTest,
    submitted,
    timeLeft,
  ]);

  /* =========================================
     AUTO SUBMIT
  ========================================= */

  useEffect(() => {
    if (
      mockTest &&
      questions.length > 0 &&
      timeLeft === 0 &&
      !submitted
    ) {
      handleSubmit();
    }
  }, [
    timeLeft,
    mockTest,
    questions.length,
    submitted,
  ]);

  /* =========================================
     FORMAT TIMER
  ========================================= */

  const formatTime = (seconds) => {
    const minutes = Math.floor(
      seconds / 60
    );

    const remainingSeconds =
      seconds % 60;

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  /* =========================================
     SELECT ANSWER
  ========================================= */

  const handleAnswer = (answer) => {
    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [currentQuestion]: answer,
    }));
  };

  /* =========================================
     CLEAR RESPONSE
  ========================================= */

  const handleClearResponse = () => {
    setAnswers((previousAnswers) => {
      const updatedAnswers = {
        ...previousAnswers,
      };

      delete updatedAnswers[currentQuestion];

      return updatedAnswers;
    });
  };

  /* =========================================
     MARK FOR REVIEW
  ========================================= */

  const handleMarkForReview = () => {
    setMarkedQuestions((previous) => {
      if (
        previous.includes(currentQuestion)
      ) {
        return previous.filter(
          (index) =>
            index !== currentQuestion
        );
      }

      return [
        ...previous,
        currentQuestion,
      ];
    });
  };

  /* =========================================
     NEXT
  ========================================= */

  const handleNext = () => {
    if (
      currentQuestion <
      questions.length - 1
    ) {
      setCurrentQuestion(
        currentQuestion + 1
      );
    }
  };

  /* =========================================
     PREVIOUS
  ========================================= */

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(
        currentQuestion - 1
      );
    }
  };

  /* =========================================
     SUBMIT
  ========================================= */
const handleSubmit = async () => {
  if (
    !mockTest ||
    submitted ||
    questions.length === 0
  ) {
    return;
  }

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login before submitting the mock test.");
    navigate("/login");
    return;
  }

  try {
    const startDuration =
      (mockTest.duration || 30) * 60;

    const timeTaken = Math.max(
      0,
      startDuration - timeLeft
    );

    const response = await fetch(
      `http://localhost:5000/api/mock-tests/${mockTest._id}/submit`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          answers,
          timeTaken,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to submit mock test."
      );
    }

    console.log(
      "Mock test submitted successfully:",
      data
    );

    setResult(data.result);
    setSubmitted(true);

  } catch (error) {
    console.error(
      "Mock test submission error:",
      error
    );

    alert(
      error.message ||
        "Unable to submit mock test."
    );
  }
};
  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <main className="mock-test-page">
        <div className="mock-test-status">
          <FaClock />

          <h2>
            Loading Mock Test...
          </h2>

          <p>
            Please wait while we load
            your test.
          </p>
        </div>
      </main>
    );
  }

  /* =========================================
     ERROR
  ========================================= */

  if (error || !mockTest) {
    return (
      <main className="mock-test-page">
        <div className="mock-test-status mock-test-error">

          <FaTimes />

          <h2>
            Unable to load mock test
          </h2>

          <p>
            {error ||
              "Mock test not found."}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/mock-tests")
            }
          >
            Back to Mock Tests
          </button>

        </div>
      </main>
    );
  }

  /* =========================================
     NO QUESTIONS
  ========================================= */

  if (questions.length === 0) {
    return (
      <main className="mock-test-page">
        <div className="mock-test-status">

          <FaTimes />

          <h2>
            No questions available
          </h2>

          <p>
            This mock test does not contain
            any questions yet.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/mock-tests")
            }
          >
            Back to Mock Tests
          </button>

        </div>
      </main>
    );
  }

  /* =========================================
     RESULT SCREEN
  ========================================= */

  if (submitted && result) {
    return (
      <main className="mock-test-page">

        <div className="mock-result-card">

          <div className="mock-result-icon">
            <FaCheck />
          </div>

          <span className="mock-result-label">
            MOCK TEST COMPLETED
          </span>

          <h1>
            {mockTest.title}
          </h1>

          <div className="mock-result-score">
            {result.score}

            <span>
              / {questions.length}
            </span>
          </div>

          <p className="mock-result-percentage">
            {result.percentage}% Score
          </p>

          <div className="mock-result-grid">

            <div>
              <span>
                Correct
              </span>

              <strong>
                {result.correctAnswers}
              </strong>
            </div>

            <div>
              <span>
                Wrong
              </span>

              <strong>
                {result.wrongAnswers}
              </strong>
            </div>

            <div>
              <span>
                Not Answered
              </span>

              <strong>
                {result.unansweredQuestions}
              </strong>
            </div>

          </div>

          <button
            type="button"
            className="mock-result-button"
            onClick={() =>
              navigate("/mock-tests")
            }
          >
            Back to Mock Tests
          </button>

        </div>

      </main>
    );
  }

  /* =========================================
     CBT SCREEN
  ========================================= */

  return (
    <main className="mock-test-page">

      {/* HEADER */}

      <header className="mock-test-header">

        <div className="mock-test-header-left">

          <h1>
            {mockTest.title}
          </h1>

          <span>
            General Competitive Exams
          </span>

        </div>

        <div className="mock-test-header-right">

          <div className="mock-test-timer">
            <FaClock />

            <span>
              {formatTime(timeLeft)}
            </span>
          </div>

          <button
            type="button"
            className="mock-submit-top"
            onClick={handleSubmit}
          >
            Submit Test
          </button>

        </div>

      </header>


      {/* SUBJECT BAR */}

      <div className="mock-subject-bar">

        {[
          "Mathematics",
          "General Knowledge",
          "English",
          "Reasoning",
        ].map((subject) => (
          <button
            key={subject}
            type="button"
            className={
              question.subject === subject
                ? "subject-tab active"
                : "subject-tab"
            }
          >
            {subject}
          </button>
        ))}

      </div>


      {/* EXAM AREA */}

      <div className="mock-exam-layout">

        {/* QUESTION */}

        <section className="mock-question-section">

          <div className="mock-question-top">

            <span>
              Question{" "}
              {currentQuestion + 1} of{" "}
              {questions.length}
            </span>

            <span>
              +1 Mark
            </span>

          </div>


          <div className="mock-question-card">

            <h2>
              {question.question}
            </h2>

            <div className="mock-options">

              {question.options.map(
                (option, index) => {

                  const isSelected =
                    answers[
                      currentQuestion
                    ] === option;

                  return (
                    <label
                      key={index}
                      className={
                        isSelected
                          ? "mock-option selected"
                          : "mock-option"
                      }
                    >

                      <input
                        type="radio"
                        name={`question-${currentQuestion}`}
                        value={option}
                        checked={
                          isSelected
                        }
                        onChange={() =>
                          handleAnswer(
                            option
                          )
                        }
                      />

                      <span className="mock-option-letter">
                        {String.fromCharCode(
                          65 + index
                        )}
                      </span>

                      <span className="mock-option-text">
                        {option}
                      </span>

                    </label>
                  );
                }
              )}

            </div>

          </div>


          {/* ACTIONS */}

          <div className="mock-question-actions">

            <button
              type="button"
              className="mark-review-button"
              onClick={
                handleMarkForReview
              }
            >
              <FaFlag />

              {markedQuestions.includes(
                currentQuestion
              )
                ? "Unmark Review"
                : "Mark for Review"}
            </button>

            <button
              type="button"
              className="clear-response-button"
              onClick={
                handleClearResponse
              }
            >
              <FaTimes />

              Clear Response
            </button>

          </div>


          {/* NAVIGATION */}

          <div className="mock-navigation">

            <button
              type="button"
              className="previous-button"
              onClick={
                handlePrevious
              }
              disabled={
                currentQuestion === 0
              }
            >
              <FaChevronLeft />

              Previous
            </button>

            <button
              type="button"
              className="next-button"
              onClick={handleNext}
              disabled={
                currentQuestion ===
                questions.length - 1
              }
            >
              Save & Next

              <FaChevronRight />
            </button>

          </div>

        </section>


        {/* QUESTION PALETTE */}

        <aside className="mock-question-palette">

          <div className="palette-header">

            <h3>
              Question Palette
            </h3>

            <p>
              Navigate to any question
            </p>

          </div>


          <div className="palette-status">

            <div>
              <span className="status-dot answered"></span>

              <span>
                Answered
              </span>
            </div>

            <div>
              <span className="status-dot marked"></span>

              <span>
                Review
              </span>
            </div>

            <div>
              <span className="status-dot not-answered"></span>

              <span>
                Not Answered
              </span>
            </div>

          </div>


          <div className="question-grid">

            {questions.map(
              (_, index) => {

                const answered =
                  answers[index] !==
                  undefined;

                const marked =
                  markedQuestions.includes(
                    index
                  );

                let className =
                  "palette-number";

                if (
                  currentQuestion ===
                  index
                ) {
                  className +=
                    " current";
                } else if (marked) {
                  className +=
                    " marked";
                } else if (answered) {
                  className +=
                    " answered";
                }

                return (
                  <button
                    type="button"
                    key={index}
                    className={
                      className
                    }
                    onClick={() =>
                      setCurrentQuestion(
                        index
                      )
                    }
                  >
                    {index + 1}
                  </button>
                );
              }
            )}

          </div>


          {/* SUMMARY */}

          <div className="palette-summary">

            <div>
              <span>
                Total Questions
              </span>

              <strong>
                {questions.length}
              </strong>
            </div>

            <div>
              <span>
                Answered
              </span>

              <strong>
                {
                  Object.keys(
                    answers
                  ).length
                }
              </strong>
            </div>

            <div>
              <span>
                Marked
              </span>

              <strong>
                {
                  markedQuestions.length
                }
              </strong>
            </div>

          </div>


          <button
            type="button"
            className="palette-submit-button"
            onClick={handleSubmit}
          >
            Submit Test
          </button>

        </aside>

      </div>

    </main>
  );
}

export default MockTest;