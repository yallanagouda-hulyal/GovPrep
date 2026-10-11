import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";

import "../styles/AdminCourses.css";

const emptyForm = {
  exam: "",
  title: "",
  description: "",
  image: "",
  lessons: "",
  students: "0 Students",
  duration: "",
  level: "",
};

function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // ==========================================
  // FETCH COURSES
  // ==========================================

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/courses"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch courses."
        );
      }

      setCourses(data);
    } catch (error) {
      console.error("Fetch courses error:", error);

      setError(
        error.message || "Unable to load courses."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // OPEN ADD FORM
  // ==========================================

  const handleAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
    setError("");
  };

  // ==========================================
  // OPEN EDIT FORM
  // ==========================================

  const handleEdit = (course) => {
    setEditingId(course._id);

    setForm({
      exam: course.exam || "",
      title: course.title || "",
      description: course.description || "",
      image: course.image || "",
      lessons: course.lessons || "",
      students: course.students || "0 Students",
      duration: course.duration || "",
      level: course.level || "",
    });

    setShowForm(true);
    setError("");
  };

  // ==========================================
  // CLOSE FORM
  // ==========================================

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  };

  // ==========================================
  // SAVE COURSE
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!token) {
      setError("Please login again.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const url = editingId
        ? `http://localhost:5000/api/courses/${editingId}`
        : "http://localhost:5000/api/courses";

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to save course."
        );
      }

      alert(
        editingId
          ? "Course updated successfully."
          : "Course created successfully."
      );

      handleCancel();
      fetchCourses();
    } catch (error) {
      console.error("Save course error:", error);

      setError(
        error.message || "Unable to save course."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE COURSE
  // ==========================================

  const handleDelete = async (courseId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/courses/${courseId}`,
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
          data.message || "Failed to delete course."
        );
      }

      alert("Course deleted successfully.");

      fetchCourses();
    } catch (error) {
      console.error("Delete course error:", error);

      setError(
        error.message || "Unable to delete course."
      );
    }
  };

  return (
    <main className="admin-courses-page">

      <div className="admin-courses-container">

        {/* ==================================
            HEADER
        ================================== */}

        <div className="admin-courses-header">

          <div>
            <span className="admin-courses-eyebrow">
              COURSE MANAGEMENT
            </span>

            <h1>Manage Courses</h1>

            <p>
              Create, update and manage courses
              available on GovPrep.
            </p>
          </div>

          <button
            type="button"
            className="add-course-button"
            onClick={handleAdd}
          >
            <FaPlus />
            Add Course
          </button>

        </div>

        {/* ==================================
            ERROR
        ================================== */}

        {error && (
          <div className="admin-course-error">
            {error}
          </div>
        )}

        {/* ==================================
            FORM
        ================================== */}

        {showForm && (
          <section className="course-form-card">

            <div className="course-form-header">

              <div>
                <h2>
                  {editingId
                    ? "Edit Course"
                    : "Create New Course"}
                </h2>

                <p>
                  Enter the course information below.
                </p>
              </div>

              <button
                type="button"
                className="close-form-button"
                onClick={handleCancel}
              >
                <FaTimes />
              </button>

            </div>

            <form onSubmit={handleSubmit}>

              <div className="course-form-grid">

                {/* EXAM */}

                <div className="form-group">
                  <label>Exam</label>

                  <input
                    type="text"
                    name="exam"
                    value={form.exam}
                    onChange={handleChange}
                    placeholder="Example: SSC"
                    required
                  />
                </div>

                {/* TITLE */}

                <div className="form-group">
                  <label>Course Title</label>

                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Example: SSC CGL Complete Preparation"
                    required
                  />
                </div>

                {/* LESSONS */}

                <div className="form-group">
                  <label>Lessons</label>

                  <input
                    type="text"
                    name="lessons"
                    value={form.lessons}
                    onChange={handleChange}
                    placeholder="Example: 120 Lessons"
                    required
                  />
                </div>

                {/* DURATION */}

                <div className="form-group">
                  <label>Duration</label>

                  <input
                    type="text"
                    name="duration"
                    value={form.duration}
                    onChange={handleChange}
                    placeholder="Example: 8 Weeks"
                    required
                  />
                </div>

                {/* LEVEL */}

                <div className="form-group">
                  <label>Level</label>

                  <select
                    name="level"
                    value={form.level}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select Level
                    </option>

                    <option value="Beginner">
                      Beginner
                    </option>

                    <option value="Intermediate">
                      Intermediate
                    </option>

                    <option value="Advanced">
                      Advanced
                    </option>
                  </select>
                </div>

                {/* STUDENTS */}

                <div className="form-group">
                  <label>Students</label>

                  <input
                    type="text"
                    name="students"
                    value={form.students}
                    onChange={handleChange}
                    placeholder="Example: 0 Students"
                  />
                </div>

                {/* IMAGE */}

                <div className="form-group form-group-full">
                  <label>Image URL</label>

                  <input
                    type="url"
                    name="image"
                    value={form.image}
                    onChange={handleChange}
                    placeholder="https://example.com/course-image.jpg"
                    required
                  />
                </div>

                {/* DESCRIPTION */}

                <div className="form-group form-group-full">
                  <label>Description</label>

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Write a short description of the course..."
                    rows="5"
                    required
                  />
                </div>

              </div>

              {/* FORM ACTIONS */}

              <div className="course-form-actions">

                <button
                  type="button"
                  className="cancel-course-button"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-course-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Course"
                    : "Create Course"}
                </button>

              </div>

            </form>

          </section>
        )}

        {/* ==================================
            COURSE LIST
        ================================== */}

        <section className="course-list-section">

          <div className="course-list-heading">

            <div>
              <h2>All Courses</h2>

              <p>
                {courses.length} course
                {courses.length !== 1 ? "s" : ""}{" "}
                available
              </p>
            </div>

          </div>

          {loading ? (

            <div className="course-loading">
              Loading courses...
            </div>

          ) : courses.length === 0 ? (

            <div className="course-empty">
              <h3>No courses found</h3>

              <p>
                Click "Add Course" to create
                your first course.
              </p>
            </div>

          ) : (

            <div className="admin-course-grid">

              {courses.map((course) => (

                <article
                  className="admin-course-card"
                  key={course._id}
                >

                  {/* IMAGE */}

                  <div className="admin-course-image">

                    <img
                      src={course.image}
                      alt={course.title}
                    />

                    <span>
                      {course.exam}
                    </span>

                  </div>

                  {/* CONTENT */}

                  <div className="admin-course-content">

                    <h3>
                      {course.title}
                    </h3>

                    <p>
                      {course.description}
                    </p>

                    <div className="admin-course-meta">

                      <span>
                        {course.lessons}
                      </span>

                      <span>
                        {course.duration}
                      </span>

                      <span>
                        {course.level}
                      </span>

                    </div>

                    {/* ACTIONS */}

                    <div className="admin-course-actions">

                      <button
                        type="button"
                        className="edit-course-button"
                        onClick={() =>
                          handleEdit(course)
                        }
                      >
                        <FaEdit />
                        Edit
                      </button>

                      <button
                        type="button"
                        className="delete-course-button"
                        onClick={() =>
                          handleDelete(course._id)
                        }
                      >
                        <FaTrash />
                        Delete
                      </button>

                    </div>

                  </div>

                </article>

              ))}

            </div>

          )}

        </section>

      </div>

    </main>
  );
}

export default AdminCourses;