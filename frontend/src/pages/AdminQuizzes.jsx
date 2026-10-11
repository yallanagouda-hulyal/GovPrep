import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaQuestionCircle } from "react-icons/fa";
import "../styles/AdminQuizzes.css";

function AdminQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [courses, setCourses] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    course: "",
    title: "",
    description: "",
    passingScore: 40,
    questions: [
      {
        question: "",
        options: ["", "", "", ""],
        correctAnswer: "",
      },
    ],
  });

  const token = localStorage.getItem("token");

  // =========================
  // FETCH COURSES
  // =========================
  const fetchCourses = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/courses");

      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }

      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error("Course fetch error:", error);
      setError("Failed to load courses.");
    }
  };

  // =========================
  // FETCH QUIZZES
  // =========================
  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/quizzes/admin/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch quizzes");
      }

      setQuizzes(data);
    } catch (error) {
      console.error("Quiz fetch error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchQuizzes();
  }, []);

  // =========================
  // INPUT HANDLERS
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // QUESTION HANDLERS
  // =========================
  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...formData.questions];

    updatedQuestions[index].question = value;

    setFormData((prev) => ({
      ...prev,
      questions: updatedQuestions,
    }));
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...formData.questions];

    updatedQuestions[questionIndex].options[optionIndex] = value;

    setFormData((prev) => ({
      ...prev,
      questions: updatedQuestions,
    }));
  };

  const handleCorrectAnswerChange = (questionIndex, value) => {
    const updatedQuestions = [...formData.questions];

    updatedQuestions[questionIndex].correctAnswer = value;

    setFormData((prev) => ({
      ...prev,
      questions: updatedQuestions,
    }));
  };

  // =========================
  // ADD QUESTION
  // =========================
  const addQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          question: "",
          options: ["", "", "", ""],
          correctAnswer: "",
        },
      ],
    }));
  };

  // =========================
  // REMOVE QUESTION
  // =========================
  const removeQuestion = (index) => {
    if (formData.questions.length === 1) {
      alert("Quiz must have at least one question.");
      return;
    }

    const updatedQuestions = formData.questions.filter(
      (_, questionIndex) => questionIndex !== index
    );

    setFormData((prev) => ({
      ...prev,
      questions: updatedQuestions,
    }));
  };

  // =========================
  // RESET FORM
  // =========================
  const resetForm = () => {
    setFormData({
      course: "",
      title: "",
      description: "",
      passingScore: 40,
      questions: [
        {
          question: "",
          options: ["", "", "", ""],
          correctAnswer: "",
        },
      ],
    });

    setEditingQuiz(null);
    setShowForm(false);
  };

  // =========================
  // EDIT QUIZ
  // =========================
  const handleEdit = (quiz) => {
    setEditingQuiz(quiz);

    setFormData({
      course: quiz.course?._id || quiz.course,
      title: quiz.title || "",
      description: quiz.description || "",
      passingScore: quiz.passingScore || 40,
      questions:
        quiz.questions?.length > 0
          ? quiz.questions.map((question) => ({
              question: question.question || "",
              options: question.options || ["", "", "", ""],
              correctAnswer: question.correctAnswer || "",
            }))
          : [
              {
                question: "",
                options: ["", "", "", ""],
                correctAnswer: "",
              },
            ],
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // VALIDATE FORM
  // =========================
  const validateForm = () => {
    if (!formData.course) {
      alert("Please select a course.");
      return false;
    }

    if (!formData.title.trim()) {
      alert("Please enter quiz title.");
      return false;
    }

    if (formData.questions.length === 0) {
      alert("Please add at least one question.");
      return false;
    }

    for (let i = 0; i < formData.questions.length; i++) {
      const question = formData.questions[i];

      if (!question.question.trim()) {
        alert(`Please enter Question ${i + 1}.`);
        return false;
      }

      if (question.options.some((option) => !option.trim())) {
        alert(`Please fill all options for Question ${i + 1}.`);
        return false;
      }

      if (!question.correctAnswer.trim()) {
        alert(`Please select correct answer for Question ${i + 1}.`);
        return false;
      }
    }

    return true;
  };

  // =========================
  // SAVE QUIZ
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      const url = editingQuiz
        ? `http://localhost:5000/api/quizzes/${editingQuiz._id}`
        : "http://localhost:5000/api/quizzes";

      const method = editingQuiz ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          course: formData.course,
          title: formData.title.trim(),
          description: formData.description.trim(),
          passingScore: Number(formData.passingScore),
          questions: formData.questions,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save quiz");
      }

      alert(
        editingQuiz
          ? "Quiz updated successfully."
          : "Quiz created successfully."
      );

      resetForm();
      fetchQuizzes();
    } catch (error) {
      console.error("Save quiz error:", error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // DELETE QUIZ
  // =========================
  const handleDelete = async (quizId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this quiz?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/quizzes/${quizId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete quiz");
      }

      alert("Quiz deleted successfully.");

      fetchQuizzes();
    } catch (error) {
      console.error("Delete quiz error:", error);
      setError(error.message);
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="admin-quizzes-page">
        <div className="admin-quizzes-container">
          <div className="admin-loading">
            <div className="loading-spinner"></div>
            <p>Loading quizzes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-quizzes-page">
      <div className="admin-quizzes-container">

        {/* ================= HEADER ================= */}
        <div className="admin-quizzes-header">
          <div>
            <span className="admin-quizzes-label">
              ADMIN / INSTRUCTOR PANEL
            </span>

            <h1>Quiz Management</h1>

            <p>
              Create, update and manage quizzes for your courses.
            </p>
          </div>

          {!showForm && (
            <button
              className="add-quiz-button"
              onClick={() => {
                setEditingQuiz(null);
                setShowForm(true);
              }}
            >
              <FaPlus />
              Add Quiz
            </button>
          )}
        </div>

        {/* ================= ERROR ================= */}
        {error && (
          <div className="admin-error">
            {error}
          </div>
        )}

        {/* ================= FORM ================= */}
        {showForm && (
          <div className="quiz-form-card">

            <div className="quiz-form-header">
              <div>
                <h2>
                  {editingQuiz ? "Edit Quiz" : "Create New Quiz"}
                </h2>

                <p>
                  Add quiz details and questions.
                </p>
              </div>

              <FaQuestionCircle className="quiz-form-icon" />
            </div>

            <form onSubmit={handleSubmit} className="quiz-form">

              {/* BASIC DETAILS */}
              <div className="quiz-basic-grid">

                <div className="quiz-form-group">
                  <label>Course</label>

                  <select
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select Course
                    </option>

                    {courses.map((course) => (
                      <option
                        key={course._id}
                        value={course._id}
                      >
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="quiz-form-group">
                  <label>Quiz Title</label>

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Example: SSC CGL General Awareness Quiz"
                    required
                  />
                </div>

                <div className="quiz-form-group full-width">
                  <label>Description</label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter quiz description"
                    rows="3"
                  />
                </div>

                <div className="quiz-form-group">
                  <label>Passing Score (%)</label>

                  <input
                    type="number"
                    name="passingScore"
                    value={formData.passingScore}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    required
                  />
                </div>

              </div>

              {/* QUESTIONS */}
              <div className="questions-header">
                <div>
                  <h3>Quiz Questions</h3>
                  <p>
                    Add questions, options and select the correct answer.
                  </p>
                </div>

                <button
                  type="button"
                  className="add-question-button"
                  onClick={addQuestion}
                >
                  <FaPlus />
                  Add Question
                </button>
              </div>

              {formData.questions.map((question, questionIndex) => (
                <div
                  className="question-card"
                  key={questionIndex}
                >
                  <div className="question-card-header">

                    <span className="question-number">
                      Question {questionIndex + 1}
                    </span>

                    {formData.questions.length > 1 && (
                      <button
                        type="button"
                        className="remove-question-button"
                        onClick={() =>
                          removeQuestion(questionIndex)
                        }
                      >
                        <FaTrash />
                        Remove
                      </button>
                    )}

                  </div>

                  {/* QUESTION */}
                  <div className="quiz-form-group">
                    <label>Question</label>

                    <textarea
                      className="question-input"
                      value={question.question}
                      onChange={(e) =>
                        handleQuestionChange(
                          questionIndex,
                          e.target.value
                        )
                      }
                      placeholder="Enter your question"
                      rows="3"
                      required
                    />
                  </div>

                  {/* OPTIONS */}
                  <div className="options-grid">

                    {question.options.map(
                      (option, optionIndex) => (
                        <div
                          className="option-group"
                          key={optionIndex}
                        >
                          <label>
                            Option{" "}
                            {String.fromCharCode(
                              65 + optionIndex
                            )}
                          </label>

                          <div className="option-row">

                            <input
                              type="text"
                              value={option}
                              onChange={(e) =>
                                handleOptionChange(
                                  questionIndex,
                                  optionIndex,
                                  e.target.value
                                )
                              }
                              placeholder={`Option ${
                                String.fromCharCode(
                                  65 + optionIndex
                                )
                              }`}
                              required
                            />

                            <input
                              type="radio"
                              name={`correct-${questionIndex}`}
                              checked={
                                question.correctAnswer ===
                                option
                              }
                              onChange={() =>
                                handleCorrectAnswerChange(
                                  questionIndex,
                                  option
                                )
                              }
                            />

                            <span className="correct-label">
                              Correct
                            </span>

                          </div>
                        </div>
                      )
                    )}

                  </div>
                </div>
              ))}

              {/* FORM ACTIONS */}
              <div className="quiz-form-actions">

                <button
                  type="button"
                  className="cancel-quiz-button"
                  onClick={resetForm}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-quiz-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingQuiz
                    ? "Update Quiz"
                    : "Create Quiz"}
                </button>

              </div>

            </form>
          </div>
        )}

        {/* ================= QUIZ LIST ================= */}
        <div className="quizzes-section">

          <div className="quizzes-section-header">
            <div>
              <h2>All Quizzes</h2>
              <p>
                Manage all quizzes available on GovPrep.
              </p>
            </div>

            <span className="quiz-count">
              {quizzes.length}{" "}
              {quizzes.length === 1 ? "Quiz" : "Quizzes"}
            </span>
          </div>

          {quizzes.length === 0 ? (
            <div className="quizzes-empty">
              <FaQuestionCircle />

              <h3>No quizzes found</h3>

              <p>
                Create your first quiz to get started.
              </p>

              {!showForm && (
                <button
                  className="add-quiz-button"
                  onClick={() => setShowForm(true)}
                >
                  <FaPlus />
                  Create First Quiz
                </button>
              )}
            </div>
          ) : (
            <div className="quiz-list">

              {quizzes.map((quiz) => (
                <div
                  className="quiz-management-card"
                  key={quiz._id}
                >

                  <div className="quiz-card-top">

                    <div className="quiz-card-icon">
                      <FaQuestionCircle />
                    </div>

                    <div>
                      <h3>{quiz.title}</h3>

                      <p>
                        {quiz.description ||
                          "No description available."}
                      </p>
                    </div>

                  </div>

                  <div className="quiz-card-stats">

                    <div>
                      <span>Course</span>

                      <strong>
                        {quiz.course?.title ||
                          "Course"}
                      </strong>
                    </div>

                    <div>
                      <span>Questions</span>

                      <strong>
                        {quiz.questions?.length || 0}
                      </strong>
                    </div>

                    <div>
                      <span>Passing Score</span>

                      <strong>
                        {quiz.passingScore || 40}%
                      </strong>
                    </div>

                  </div>

                  <div className="quiz-card-actions">

                    <button
                      className="edit-quiz-button"
                      onClick={() =>
                        handleEdit(quiz)
                      }
                    >
                      <FaEdit />
                      Edit
                    </button>

                    <button
                      className="delete-quiz-button"
                      onClick={() =>
                        handleDelete(quiz._id)
                      }
                    >
                      <FaTrash />
                      Delete
                    </button>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default AdminQuizzes;