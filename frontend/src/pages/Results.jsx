import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaTrophy,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaClipboardList,
  FaChartLine,
  FaArrowRight,
} from "react-icons/fa";

import "../styles/Results.css";

function Results() {
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================
     FETCH RESULTS
  ========================================= */

  useEffect(() => {
    const fetchResults = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/results/mock-tests",
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
              "Failed to load results."
          );
        }

        setResults(
          Array.isArray(data) ? data : []
        );
      } catch (error) {
        console.error(
          "Results error:",
          error
        );

        setError(
          error.message ||
            "Unable to load results."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [navigate]);


  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <main className="results-page">

        <div className="results-wrapper">

          <div className="results-status">

            <FaClipboardList />

            <h2>
              Loading Results...
            </h2>

            <p>
              Please wait while we load your
              performance data.
            </p>

          </div>

        </div>

      </main>
    );
  }


  /* =========================================
     ERROR
  ========================================= */

  if (error) {
    return (
      <main className="results-page">

        <div className="results-wrapper">

          <div className="results-status">

            <FaTimesCircle />

            <h2>
              Unable to Load Results
            </h2>

            <p>
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
            >
              Try Again
            </button>

          </div>

        </div>

      </main>
    );
  }


  /* =========================================
     SUMMARY CALCULATIONS
  ========================================= */

  const testsAttempted =
    results.length;

  const totalCorrect =
    results.reduce(
      (sum, result) =>
        sum +
        (result.correctAnswers || 0),
      0
    );

  const totalWrong =
    results.reduce(
      (sum, result) =>
        sum +
        (result.wrongAnswers || 0),
      0
    );

  const averageScore =
    testsAttempted > 0
      ? Math.round(
          results.reduce(
            (sum, result) =>
              sum +
              (result.percentage || 0),
            0
          ) / testsAttempted
        )
      : 0;

  const bestScore =
    testsAttempted > 0
      ? Math.max(
          ...results.map(
            (result) =>
              result.percentage || 0
          )
        )
      : 0;


  /* =========================================
     PERFORMANCE MESSAGE
  ========================================= */

  const getPerformanceMessage = () => {
    if (averageScore >= 80) {
      return "Excellent performance! Keep maintaining this consistency.";
    }

    if (averageScore >= 60) {
      return "Good progress! Keep practicing to improve your score.";
    }

    if (averageScore >= 40) {
      return "You're making progress. Focus on your weak areas.";
    }

    return "Keep practicing regularly. Your performance will improve.";
  };


  /* =========================================
     RESULT
  ========================================= */

  return (
    <main className="results-page">

      <div className="results-wrapper">


        {/* =====================================
            HEADER
        ===================================== */}

        <section className="results-header">

          <div>

            <span className="results-label">
              PERFORMANCE
            </span>

            <h1>
              My Results
            </h1>

            <p>
              Track your mock test performance,
              identify weak areas and improve
              your preparation.
            </p>

          </div>

          <div className="results-trophy">
            <FaTrophy />
          </div>

        </section>


        {/* =====================================
            SUMMARY CARDS
        ===================================== */}

        {results.length > 0 && (

          <section className="results-summary">

            {/* TESTS */}

            <div className="summary-card">

              <div className="summary-icon blue">
                <FaClipboardList />
              </div>

              <div>

                <span>
                  Tests Attempted
                </span>

                <strong>
                  {testsAttempted}
                </strong>

              </div>

            </div>


            {/* AVERAGE */}

            <div className="summary-card">

              <div className="summary-icon green">
                <FaChartLine />
              </div>

              <div>

                <span>
                  Average Score
                </span>

                <strong>
                  {averageScore}%
                </strong>

              </div>

            </div>


            {/* CORRECT */}

            <div className="summary-card">

              <div className="summary-icon purple">
                <FaCheckCircle />
              </div>

              <div>

                <span>
                  Total Correct
                </span>

                <strong>
                  {totalCorrect}
                </strong>

              </div>

            </div>


            {/* BEST */}

            <div className="summary-card">

              <div className="summary-icon orange">
                <FaTrophy />
              </div>

              <div>

                <span>
                  Best Score
                </span>

                <strong>
                  {bestScore}%
                </strong>

              </div>

            </div>

          </section>
        )}


        {/* =====================================
            PERFORMANCE MESSAGE
        ===================================== */}

        {results.length > 0 && (

          <section className="performance-message">

            <div className="performance-message-icon">
              <FaTrophy />
            </div>

            <div>

              <h2>
                Your Performance
              </h2>

              <p>
                {getPerformanceMessage()}
              </p>

            </div>

          </section>
        )}


        {/* =====================================
            NO RESULTS
        ===================================== */}

        {results.length === 0 ? (

          <section className="results-empty">

            <div className="empty-icon">
              <FaClipboardList />
            </div>

            <h2>
              No Results Yet
            </h2>

            <p>
              You haven't attempted any mock
              tests yet. Start your first test
              and your performance will appear
              here.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/mock-tests")
              }
            >
              Explore Mock Tests
              <FaArrowRight />
            </button>

          </section>

        ) : (

          /* ===================================
             RESULT HISTORY
          =================================== */

          <section className="results-history">

            <div className="results-history-header">

              <div>

                <span>
                  TEST HISTORY
                </span>

                <h2>
                  Mock Test Attempts
                </h2>

              </div>

              <span className="attempt-count">
                {testsAttempted} Attempt
                {testsAttempted === 1
                  ? ""
                  : "s"}
              </span>

            </div>


            <div className="results-list">

              {results.map((attempt) => {

                const mockTest =
                  attempt.mockTest || {};

                const date =
                  attempt.createdAt
                    ? new Date(
                        attempt.createdAt
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )
                    : "N/A";


                let performanceClass =
                  "average";

                if (
                  attempt.percentage >=
                  80
                ) {
                  performanceClass =
                    "excellent";
                } else if (
                  attempt.percentage >=
                  60
                ) {
                  performanceClass =
                    "good";
                } else if (
                  attempt.percentage < 40
                ) {
                  performanceClass =
                    "low";
                }


                const timeTaken =
                  attempt.timeTaken || 0;

                const minutes =
                  Math.floor(
                    timeTaken / 60
                  );

                const seconds =
                  timeTaken % 60;


                return (

                  <article
                    className="result-card"
                    key={attempt._id}
                  >

                    {/* TEST */}

                    <div className="result-main">

                      <div className="result-icon">
                        <FaClipboardList />
                      </div>

                      <div className="result-info">

                        <h2>
                          {mockTest.title ||
                            "Mock Test"}
                        </h2>

                        <p>
                          {mockTest.exam ||
                            "General Competitive Exams"}
                        </p>

                        <span className="result-date">
                          Attempted on {date}
                        </span>

                      </div>

                    </div>


                    {/* SCORE */}

                    <div className="result-score">

                      <strong>
                        {attempt.score}

                        <span>
                          /
                          {attempt.totalQuestions}
                        </span>
                      </strong>

                      <small
                        className={
                          performanceClass
                        }
                      >
                        {attempt.percentage}%
                      </small>

                    </div>


                    {/* STATS */}

                    <div className="result-stat">

                      <div>

                        <FaCheckCircle />

                        <span>
                          Correct
                        </span>

                        <strong>
                          {attempt.correctAnswers}
                        </strong>

                      </div>


                      <div>

                        <FaTimesCircle />

                        <span>
                          Wrong
                        </span>

                        <strong>
                          {attempt.wrongAnswers}
                        </strong>

                      </div>


                      <div>

                        <FaClock />

                        <span>
                          Time
                        </span>

                        <strong>
                          {minutes}:
                          {String(
                            seconds
                          ).padStart(
                            2,
                            "0"
                          )}
                        </strong>

                      </div>

                    </div>


                    {/* ACCURACY */}

                    <div className="result-accuracy">

                      <span>
                        Accuracy
                      </span>

                      <strong>
                        {attempt.accuracy ||
                          0}
                        %
                      </strong>

                    </div>

                  </article>
                );
              })}

            </div>

          </section>
        )}


        {/* =====================================
            ACTION
        ===================================== */}

        {results.length > 0 && (

          <div className="results-action">

            <button
              type="button"
              onClick={() =>
                navigate("/mock-tests")
              }
            >
              Take Another Mock Test
              <FaArrowRight />
            </button>

          </div>

        )}

      </div>

    </main>
  );
}

export default Results;