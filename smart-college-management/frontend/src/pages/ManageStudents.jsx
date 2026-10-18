import { useEffect, useState } from "react";
import "./ManageStudents.css";

const API_URL = "http://localhost:5000/api/students";

const emptyForm = {
  name: "",
  email: "",
  password: "",
  rollNumber: "",
  department: "CSE",
  semester: "7",
  phone: "",
};

function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resettingId, setResettingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function request(url, options = {}) {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Please log in as Admin again.");
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || "Request failed.");
    }

    return data;
  }

  async function loadStudents() {
    setLoading(true);
    setError("");

    try {
      const data = await request(API_URL);
      setStudents(data.students || []);
    } catch (err) {
      setError(err.message || "Students load nahi hue.");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    let cancelled = false;

    async function fetchStudents() {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data.message || "Failed to load students.");
        }

        if (!cancelled) {
          setStudents(data.students || []);
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Students load nahi hue.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchStudents();

    return () => {
      cancelled = true;
    };
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function openAddForm() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setMessage("");
    setShowForm(true);
  }

  function openEditForm(student) {
    setEditingId(student._id);

    setForm({
      name: student.user?.name || "",
      email: student.user?.email || "",
      password: "",
      rollNumber: student.rollNumber || "",
      department: student.department || "CSE",
      semester: String(student.semester || 1),
      phone: student.phone || "",
    });

    setError("");
    setMessage("");
    setShowForm(true);
  }

  function cancelForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        rollNumber: form.rollNumber.trim(),
        department: form.department.trim(),
        semester: Number(form.semester),
        phone: form.phone.trim(),
      };

      let url = API_URL;
      let method = "POST";

      if (editingId) {
        url = `${API_URL}/${editingId}`;
        method = "PUT";
      } else {
        payload.password = form.password;
      }

      const data = await request(url, {
        method,
        body: JSON.stringify(payload),
      });

      setMessage(data.message || "Student saved successfully.");
      cancelForm();
      await loadStudents();
    } catch (err) {
      setError(err.message || "Student save nahi hua.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(student) {
    const studentName = student.user?.name || student.rollNumber;

    const confirmed = window.confirm(
      `Delete ${studentName}? Their login account will also be deleted.`,
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      const data = await request(`${API_URL}/${student._id}`, {
        method: "DELETE",
      });

      setMessage(data.message || "Student deleted successfully.");
      await loadStudents();
    } catch (err) {
      setError(err.message || "Student delete nahi hua.");
    }
  }

  // Reset Password function
  async function handleResetPassword(student) {
    const studentName = student.user?.name || student.rollNumber;

    const newPassword = window.prompt(
      `Enter a new password for ${studentName} (minimum 8 characters):`,
    );

    if (newPassword === null) return;

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      setMessage("");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to reset the password for ${studentName}?`,
    );

    if (!confirmed) return;

    setError("");
    setMessage("");
    setResettingId(student._id);

    try {
      const data = await request(`${API_URL}/${student._id}/reset-password`, {
        method: "PATCH",
        body: JSON.stringify({ password: newPassword }),
      });

      setMessage(data.message || "Student password reset successfully.");
    } catch (err) {
      setError(err.message || "Password reset failed.");
    } finally {
      setResettingId(null);
    }
  }

  const filteredStudents = students.filter((student) => {
    const searchText = search.toLowerCase();

    return (
      (student.user?.name || "").toLowerCase().includes(searchText) ||
      (student.user?.email || "").toLowerCase().includes(searchText) ||
      (student.rollNumber || "").toLowerCase().includes(searchText) ||
      (student.department || "").toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="manage-students">
      <div className="students-heading">
        <div>
          <h1>Manage Students</h1>
          <p>Add, search, edit and manage student records.</p>
        </div>

        <button
          type="button"
          className="student-primary-button"
          onClick={openAddForm}
        >
          + Add Student
        </button>
      </div>

      <div className="students-summary">
        <div className="student-summary-card">
          <span>Total Students</span>
          <strong>{students.length}</strong>
        </div>

        <div className="student-summary-card">
          <span>Search Results</span>
          <strong>{filteredStudents.length}</strong>
        </div>
      </div>

      {message && <div className="student-success">{message}</div>}
      {error && <div className="student-error">{error}</div>}

      {showForm && (
        <form className="student-form" onSubmit={handleSubmit}>
          <h2>{editingId ? "Edit Student" : "Add New Student"}</h2>

          <div className="student-form-grid">
            <label>
              Full Name *
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Email *
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </label>

            {!editingId && (
              <label>
                Login Password *
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  minLength={8}
                  autoComplete="new-password"
                  required
                />
              </label>
            )}

            <label>
              USN / Roll Number *
              <input
                name="rollNumber"
                value={form.rollNumber}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Department *
              <select
                name="department"
                value={form.department}
                onChange={handleChange}
                required
              >
                <option value="CSE">CSE</option>
                <option value="ISE">ISE</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="ME">Mechanical</option>
                <option value="CIVIL">Civil</option>
              </select>
            </label>

            <label>
              Semester *
              <select
                name="semester"
                value={form.semester}
                onChange={handleChange}
                required
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((semester) => (
                  <option key={semester} value={semester}>
                    Semester {semester}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Phone Number
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
              />
            </label>
          </div>

          <div className="student-form-actions">
            <button
              type="submit"
              className="student-primary-button"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Student"
                  : "Save Student"}
            </button>

            <button
              type="button"
              className="student-secondary-button"
              onClick={cancelForm}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="students-table-card">
        <div className="students-search">
          <input
            type="search"
            placeholder="Search by name, USN, email or department..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {loading ? (
          <p className="students-info">Loading students...</p>
        ) : error && students.length === 0 ? (
          <p className="students-info">
            Students load nahi hue. Error message upar check karo.
          </p>
        ) : filteredStudents.length === 0 ? (
          <p className="students-info">No students found.</p>
        ) : (
          <div className="students-table-wrapper">
            <table className="students-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>USN</th>
                  <th>Department</th>
                  <th>Semester</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student._id}>
                    <td>
                      <strong>{student.user?.name || "Unknown"}</strong>
                      <small>{student.user?.email || "No email"}</small>
                    </td>

                    <td>{student.rollNumber}</td>
                    <td>{student.department}</td>
                    <td>{student.semester}</td>
                    <td>{student.phone || "—"}</td>

                    <td>
                      <div className="student-row-actions">
                        <button
                          type="button"
                          className="student-edit-button"
                          onClick={() => openEditForm(student)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="student-edit-button"
                          disabled={resettingId === student._id}
                          onClick={() => handleResetPassword(student)}
                        >
                          {resettingId === student._id
                            ? "Resetting..."
                            : "Reset Password"}
                        </button>

                        <button
                          type="button"
                          className="student-delete-button"
                          onClick={() => handleDelete(student)}
                        >
                          Delete
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
  );
}

export default ManageStudents;
