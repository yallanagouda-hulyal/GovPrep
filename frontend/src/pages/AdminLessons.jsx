import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaBookOpen,
  FaArrowLeft,
  FaTimes,
} from "react-icons/fa";

import "../styles/AdminLessons.css";

function AdminLessons() {
  const [lessons, setLessons] = useState([]);
  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);

  const [formData, setFormData] = useState({
    course: "",
    title: "",
    description: "",
    videoUrl: "",
    content: "",
    duration: "",
    orderNo: "",
  });

  const token = localStorage.getItem("token");

  // =========================================
  // FETCH COURSES
  // =========================================

  const fetchCourses = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/courses"
      );

      const data = await response.json();

      if (response.ok) {
        setCourses(
          Array.isArray(data) ? data : []
        );
      }
    } catch (error) {
      console.error(
        "Fetch courses error:",
        error
      );
    }
  };

  // =========================================
  // FETCH LESSONS
  // =========================================

  const fetchLessons = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/lessons/admin/all",
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
            "Failed to fetch lessons."
        );
      }

      setLessons(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        "Fetch lessons error:",
        error
      );

      alert(
        error.message ||
          "Unable to load lessons."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // INITIAL LOAD
  // =========================================

  useEffect(() => {
    fetchCourses();
    fetchLessons();
  }, []);

  // =========================================
  // FORM INPUT
  // =========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================
  // OPEN ADD FORM
  // =========================================

  const handleAddLesson = () => {
    setEditingLesson(null);

    setFormData({
      course: "",
      title: "",
      description: "",
      videoUrl: "",
      content: "",
      duration: "",
      orderNo: "",
    });

    setShowForm(true);
  };

  // =========================================
  // OPEN EDIT FORM
  // =========================================

  const handleEditLesson = (lesson) => {
    setEditingLesson(lesson);

    setFormData({
      course:
        lesson.course?._id ||
        lesson.course ||
        "",
      title: lesson.title || "",
      description:
        lesson.description || "",
      videoUrl: lesson.videoUrl || "",
      content: lesson.content || "",
      duration: lesson.duration || "",
      orderNo:
        lesson.orderNo !== undefined
          ? lesson.orderNo
          : "",
    });

    setShowForm(true);
  };

  // =========================================
  // CLOSE FORM
  // =========================================

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingLesson(null);
  };

  // =========================================
  // SAVE LESSON
  // =========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!token) {
      alert(
        "Please login again."
      );
      return;
    }

    if (
      !formData.course ||
      !formData.title ||
      !formData.description ||
      !formData.duration ||
      formData.orderNo === ""
    ) {
      alert(
        "Please fill all required fields."
      );
      return;
    }

    try {
      setSaving(true);

      const url = editingLesson
        ? `http://localhost:5000/api/lessons/${editingLesson._id}`
        : "http://localhost:5000/api/lessons";

      const method = editingLesson
        ? "PUT"
        : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          course: formData.course,
          title: formData.title,
          description:
            formData.description,
          videoUrl: formData.videoUrl,
          content: formData.content,
          duration: formData.duration,
          orderNo: Number(
            formData.orderNo
          ),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to save lesson."
        );
      }

      alert(
        editingLesson
          ? "Lesson updated successfully."
          : "Lesson created successfully."
      );

      handleCloseForm();
      fetchLessons();
    } catch (error) {
      console.error(
        "Save lesson error:",
        error
      );

      alert(
        error.message ||
          "Unable to save lesson."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================
  // DELETE LESSON
  // =========================================

  const handleDeleteLesson = async (
    lessonId
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this lesson?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/lessons/${lessonId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete lesson."
        );
      }

      alert(
        "Lesson deleted successfully."
      );

      fetchLessons();
    } catch (error) {
      console.error(
        "Delete lesson error:",
        error
      );

      alert(
        error.message ||
          "Unable to delete lesson."
      );
    }
  };

  return (
    <section className="admin-lessons-page">
      <div className="admin-lessons-container">

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="admin-lessons-header">

          <div>

            <Link
              to="/admin"
              className="admin-back-link"
            >
              <FaArrowLeft />
              Back to Dashboard
            </Link>

            <span className="admin-lessons-label">
              CONTENT MANAGEMENT
            </span>

            <h1>
              Lesson Management
            </h1>

            <p>
              Create, edit and manage lessons
              for your courses.
            </p>

          </div>

          <button
            type="button"
            className="add-lesson-button"
            onClick={handleAddLesson}
          >
            <FaPlus />
            Add Lesson
          </button>

        </div>

        {/* =====================================
            FORM
        ===================================== */}

        {showForm && (
          <div className="lesson-form-card">

            <div className="lesson-form-header">

              <div>
                <span>
                  {editingLesson
                    ? "EDIT LESSON"
                    : "NEW LESSON"}
                </span>

                <h2>
                  {editingLesson
                    ? "Update Lesson"
                    : "Create New Lesson"}
                </h2>
              </div>

              <button
                type="button"
                className="close-form-button"
                onClick={handleCloseForm}
              >
                <FaTimes />
              </button>

            </div>

            <form
              className="lesson-form"
              onSubmit={handleSubmit}
            >

              {/* COURSE */}

              <div className="form-group">

                <label>
                  Course *
                </label>

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

              {/* TITLE */}

              <div className="form-group">

                <label>
                  Lesson Title *
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter lesson title"
                  required
                />

              </div>

              {/* DESCRIPTION */}

              <div className="form-group full-width">

                <label>
                  Description *
                </label>

                <textarea
                  name="description"
                  value={
                    formData.description
                  }
                  onChange={handleChange}
                  placeholder="Enter lesson description"
                  rows="4"
                  required
                />

              </div>

              {/* VIDEO URL */}

              <div className="form-group full-width">

                <label>
                  Video URL
                </label>

                <input
                  type="url"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleChange}
                  placeholder="https://youtube.com/..."
                />

              </div>

              {/* CONTENT */}

              <div className="form-group full-width">

                <label>
                  Lesson Content
                </label>

                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Enter lesson content..."
                  rows="7"
                />

              </div>

              {/* DURATION */}

              <div className="form-group">

                <label>
                  Duration *
                </label>

                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="Example: 30 Minutes"
                  required
                />

              </div>

              {/* ORDER */}

              <div className="form-group">

                <label>
                  Lesson Order *
                </label>

                <input
                  type="number"
                  name="orderNo"
                  value={formData.orderNo}
                  onChange={handleChange}
                  placeholder="Example: 1"
                  min="1"
                  required
                />

              </div>

              {/* BUTTONS */}

              <div className="lesson-form-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={handleCloseForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-lesson-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingLesson
                    ? "Update Lesson"
                    : "Create Lesson"}
                </button>

              </div>

            </form>

          </div>
        )}

        {/* =====================================
            LESSON LIST
        ===================================== */}

        <div className="lessons-section">

          <div className="lessons-section-header">

            <div>

              <span>
                ALL LESSONS
              </span>

              <h2>
                Course Lessons
              </h2>

            </div>

            <strong>
              {lessons.length} Lessons
            </strong>

          </div>

          {loading ? (
            <div className="lessons-empty">
              <FaBookOpen />

              <h3>
                Loading lessons...
              </h3>

              <p>
                Please wait while lessons
                are being loaded.
              </p>
            </div>
          ) : lessons.length === 0 ? (
            <div className="lessons-empty">
              <FaBookOpen />

              <h3>
                No lessons found
              </h3>

              <p>
                Start by creating your
                first lesson.
              </p>

              <button
                type="button"
                onClick={handleAddLesson}
              >
                <FaPlus />
                Create Lesson
              </button>
            </div>
          ) : (
            <div className="lessons-table-wrapper">

              <table className="lessons-table">

                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Lesson</th>
                    <th>Course</th>
                    <th>Duration</th>
                    <th>Video</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {lessons.map((lesson) => (

                    <tr key={lesson._id}>

                      <td>
                        <span className="lesson-order">
                          {lesson.orderNo}
                        </span>
                      </td>

                      <td>
                        <div className="lesson-title-cell">

                          <strong>
                            {lesson.title}
                          </strong>

                          <p>
                            {lesson.description}
                          </p>

                        </div>
                      </td>

                      <td>
                        <div className="lesson-course-cell">

                          <strong>
                            {lesson.course?.title ||
                              "Unknown Course"}
                          </strong>

                          <span>
                            {lesson.course?.exam ||
                              ""}
                          </span>

                        </div>
                      </td>

                      <td>
                        {lesson.duration}
                      </td>

                      <td>
                        {lesson.videoUrl ? (
                          <span className="video-status available">
                            Available
                          </span>
                        ) : (
                          <span className="video-status unavailable">
                            No Video
                          </span>
                        )}
                      </td>

                      <td>

                        <div className="lesson-actions">

                          <button
                            type="button"
                            className="edit-lesson-button"
                            onClick={() =>
                              handleEditLesson(
                                lesson
                              )
                            }
                          >
                            <FaEdit />
                          </button>

                          <button
                            type="button"
                            className="delete-lesson-button"
                            onClick={() =>
                              handleDeleteLesson(
                                lesson._id
                              )
                            }
                          >
                            <FaTrash />
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </div>
    </section>
  );
}

export default AdminLessons;