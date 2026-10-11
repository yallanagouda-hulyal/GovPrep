import { useEffect, useState } from "react";
import {
  FaUsers,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaUserShield,
  FaTrash,
  FaEdit,
  FaSearch,
} from "react-icons/fa";

import "../styles/AdminUsers.css";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // =========================================
  // FETCH USERS
  // =========================================

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/auth/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch users."
        );
      }

      setUsers(data);
    } catch (error) {
      console.error("Fetch users error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // =========================================
  // CHANGE ROLE
  // =========================================

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/users/${userId}/role`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            role: newRole,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update role."
        );
      }

      setUsers((previousUsers) =>
        previousUsers.map((user) =>
          user._id === userId
            ? {
                ...user,
                role: newRole,
              }
            : user
        )
      );
    } catch (error) {
      console.error("Role update error:", error);
      alert(error.message);
    }
  };

  // =========================================
  // DELETE USER
  // =========================================

  const handleDelete = async (userId, userName) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${userName}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/users/${userId}`,
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
          data.message || "Failed to delete user."
        );
      }

      setUsers((previousUsers) =>
        previousUsers.filter(
          (user) => user._id !== userId
        )
      );
    } catch (error) {
      console.error("Delete user error:", error);
      alert(error.message);
    }
  };

  // =========================================
  // SEARCH
  // =========================================

  const filteredUsers = users.filter((user) => {
    const searchText = search.toLowerCase();

    return (
      user.name?.toLowerCase().includes(searchText) ||
      user.email?.toLowerCase().includes(searchText) ||
      user.role?.toLowerCase().includes(searchText)
    );
  });

  // =========================================
  // STATISTICS
  // =========================================

  const totalUsers = users.length;

  const totalStudents = users.filter(
    (user) => user.role === "student"
  ).length;

  const totalInstructors = users.filter(
    (user) => user.role === "instructor"
  ).length;

  const totalAdmins = users.filter(
    (user) => user.role === "admin"
  ).length;

  // =========================================
  // ROLE ICON
  // =========================================

  const getRoleIcon = (role) => {
    if (role === "admin") {
      return <FaUserShield />;
    }

    if (role === "instructor") {
      return <FaChalkboardTeacher />;
    }

    return <FaUserGraduate />;
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="admin-users-page">
        <div className="admin-users-container">
          <div className="admin-users-loading">
            <div className="users-spinner"></div>
            <p>Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  // =========================================
  // PAGE
  // =========================================

  return (
    <div className="admin-users-page">
      <div className="admin-users-container">

        {/* ================= HEADER ================= */}

        <div className="admin-users-header">

          <div>
            <span className="admin-users-label">
              ADMIN PANEL
            </span>

            <h1>User Management</h1>

            <p>
              Manage GovPrep users, roles and access.
            </p>
          </div>

        </div>

        {/* ================= ERROR ================= */}

        {error && (
          <div className="admin-users-error">
            {error}
          </div>
        )}

        {/* ================= STATISTICS ================= */}

        <div className="user-statistics">

          <div className="user-stat-card">

            <div className="user-stat-icon total">
              <FaUsers />
            </div>

            <div>
              <span>Total Users</span>
              <strong>{totalUsers}</strong>
            </div>

          </div>

          <div className="user-stat-card">

            <div className="user-stat-icon student">
              <FaUserGraduate />
            </div>

            <div>
              <span>Students</span>
              <strong>{totalStudents}</strong>
            </div>

          </div>

          <div className="user-stat-card">

            <div className="user-stat-icon instructor">
              <FaChalkboardTeacher />
            </div>

            <div>
              <span>Instructors</span>
              <strong>{totalInstructors}</strong>
            </div>

          </div>

          <div className="user-stat-card">

            <div className="user-stat-icon admin">
              <FaUserShield />
            </div>

            <div>
              <span>Admins</span>
              <strong>{totalAdmins}</strong>
            </div>

          </div>

        </div>

        {/* ================= USERS SECTION ================= */}

        <div className="users-management-section">

          <div className="users-section-header">

            <div>
              <h2>All Users</h2>

              <p>
                View and manage registered GovPrep users.
              </p>
            </div>

            <div className="users-count">
              {filteredUsers.length} Users
            </div>

          </div>

          {/* ================= SEARCH ================= */}

          <div className="users-search">

            <FaSearch />

            <input
              type="text"
              placeholder="Search by name, email or role..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          {/* ================= USER LIST ================= */}

          {filteredUsers.length === 0 ? (
            <div className="users-empty">

              <FaUsers />

              <h3>No users found</h3>

              <p>
                Try changing your search.
              </p>

            </div>
          ) : (
            <div className="users-table-wrapper">

              <table className="users-table">

                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredUsers.map((user) => (

                    <tr key={user._id}>

                      {/* USER */}

                      <td>
                        <div className="user-info">

                          <div className="user-avatar">
                            {user.name
                              ?.charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <strong>
                              {user.name}
                            </strong>

                            <span>
                              User ID:{" "}
                              {user._id.slice(-6)}
                            </span>
                          </div>

                        </div>
                      </td>

                      {/* EMAIL */}

                      <td>
                        <span className="user-email">
                          {user.email}
                        </span>
                      </td>

                      {/* ROLE */}

                      <td>

                        <div className="role-control">

                          <span
                            className={`role-icon ${user.role}`}
                          >
                            {getRoleIcon(user.role)}
                          </span>

                          <select
                            value={user.role}
                            onChange={(e) =>
                              handleRoleChange(
                                user._id,
                                e.target.value
                              )
                            }
                          >
                            <option value="student">
                              Student
                            </option>

                            <option value="instructor">
                              Instructor
                            </option>

                            <option value="admin">
                              Admin
                            </option>
                          </select>

                        </div>

                      </td>

                      {/* JOINED */}

                      <td>
                        <span className="joined-date">
                          {user.createdAt
                            ? new Date(
                                user.createdAt
                              ).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )
                            : "—"}
                        </span>
                      </td>

                      {/* ACTIONS */}

                      <td>

                        <div className="user-actions">

                          <button
                            className="edit-user-button"
                            title="Change Role"
                            onClick={() =>
                              handleRoleChange(
                                user._id,
                                user.role ===
                                  "student"
                                  ? "instructor"
                                  : "student"
                              )
                            }
                          >
                            <FaEdit />
                          </button>

                          <button
                            className="delete-user-button"
                            title="Delete User"
                            onClick={() =>
                              handleDelete(
                                user._id,
                                user.name
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
    </div>
  );
}

export default AdminUsers;