import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "../styles/Quiz.css";

function Quiz() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  /* =========================================
     FETCH QUIZ
  ========================================= */

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/quizzes/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load quiz."
          );
        }

        setQuiz(data);
      } catch (error) {
        console.error("Quiz fetch error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  /* =========================================
     SELECT ANSWER
  ========================================= */

  const handleAnswerChange = (
    questionIndex,
    answer
  ) => {
    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [questionIndex]: answer,
    }));
  };

  /* =========================================
     SUBMIT QUIZ
  ========================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!quiz) {
      return;
    }

    const formattedAnswers = quiz.questions.map(
      (_, index) => answers[index] || ""
    );

    const unansweredQuestions =
      formattedAnswers.filter(
        (answer) => answer === ""
      ).length;

    if (unansweredQuestions > 0) {
      alert(
        `Please answer all ${quiz.questions.length} questions before submitting.`
      );
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(
        `http://localhost:5000/api/quizzes/${id}/submit`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            answers: formattedAnswers,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to submit quiz."
        );
      }

      setResult(data.result);
    } catch (error) {
      console.error(
        "Quiz submission error:",
        error
      );

      alert(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <div className="quiz-status">
        <h2>Loading quiz...</h2>
        <p>Please wait.</p>
      </div>
    );
  }

  /* =========================================
     ERROR
  ========================================= */

  if (error) {
    return (
      <div className="quiz-status quiz-error">
        <h2>Unable to load quiz</h2>
        <p>{error}</p>

        <button
          onClick={() => navigate(-1)}
          className="quiz-back-button"
        >
          Go Back
        </button>
      </div>
    );
  }

  /* =========================================
     RESULT
  ========================================= */

  if (result) {
    return (
      <main className="quiz-page">
        <section className="quiz-result-card">
          <div className="quiz-result-icon">
            {result.passed ? "✓" : "!"}
          </div>

          <h1>
            {result.passed
              ? "Quiz Passed!"
              : "Quiz Completed"}
          </h1>

          <p className="quiz-result-message">
            You have completed the quiz successfully.
          </p>

          <div className="quiz-result-score">
            <strong>
              {result.percentage}%
            </strong>

            <span>
              {result.correctAnswers} /{" "}
              {result.totalQuestions} correct
            </span>
          </div>

          <div className="quiz-result-details">
            <div>
              <span>Score</span>
              <strong>
                {result.score}/
                {result.totalQuestions}
              </strong>
            </div>

            <div>
              <span>Percentage</span>
              <strong>
                {result.percentage}%
              </strong>
            </div>

            <div>
              <span>Status</span>
              <strong>
                {result.passed
                  ? "Passed"
                  : "Failed"}
              </strong>
            </div>
          </div>

          <button
            type="button"
            className="quiz-dashboard-button"
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
          </button>
        </section>
      </main>
    );
  }

  /* =========================================
     QUIZ
  ========================================= */

  return (
    <main className="quiz-page">
      <section className="quiz-container">
        <div className="quiz-header">
          <span className="quiz-label">
            Government Exam Practice
          </span>

          <h1>{quiz.title}</h1>

          {quiz.description && (
            <p>{quiz.description}</p>
          )}

          <div className="quiz-info">
            <span>
              Questions:{" "}
              <strong>
                {quiz.questions.length}
              </strong>
            </span>

            <span>
              Passing Score:{" "}
              <strong>
                {quiz.passingScore}%
              </strong>
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {quiz.questions.map(
            (question, questionIndex) => (
              <div
                className="quiz-question-card"
                key={question._id || questionIndex}
              >
                <div className="question-number">
                  Question {questionIndex + 1}
                </div>

                <h2>{question.question}</h2>

                <div className="quiz-options">
                  {question.options.map(
                    (option, optionIndex) => (
                      <label
                        className={`quiz-option ${
                          answers[
                            questionIndex
                          ] === option
                            ? "selected"
                            : ""
                        }`}
                        key={optionIndex}
                      >
                        <input
                          type="radio"
                          name={`question-${questionIndex}`}
                          value={option}
                          checked={
                            answers[
                              questionIndex
                            ] === option
                          }
                          onChange={() =>
                            handleAnswerChange(
                              questionIndex,
                              option
                            )
                          }
                        />

                        <span className="option-circle">
                          {String.fromCharCode(
                            65 + optionIndex
                          )}
                        </span>

                        <span className="option-text">
                          {option}
                        </span>
                      </label>
                    )
                  )}
                </div>
              </div>
            )
          )}

          <div className="quiz-submit-section">
            <button
              type="submit"
              className="quiz-submit-button"
              disabled={submitting}
            >
              {submitting
                ? "Submitting..."
                : "Submit Quiz"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default Quiz;