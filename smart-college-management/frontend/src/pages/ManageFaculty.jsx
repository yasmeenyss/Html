import { useEffect, useState } from "react";
import "./ManageFaculty.css";

const API_URL = "http://localhost:5000/api/faculty";

const emptyForm = {
  name: "",
  email: "",
  password: "",
  employeeId: "",
  department: "",
  subject: "",
  phone: "",
};

function ManageFaculty() {
  const [faculty, setFaculty] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function apiRequest(url, options = {}) {
    const token = localStorage.getItem("token");

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

  async function loadFaculty() {
    setLoading(true);
    setError("");

    try {
      const data = await apiRequest(API_URL);
      setFaculty(Array.isArray(data) ? data : data.faculty || []);
    } catch (err) {
      setError(err.message || "Faculty records load nahi hue.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadFaculty();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  function startEdit(member) {
    const memberUser = member.user || {};

    setEditingId(member._id);
    setForm({
      name: memberUser.name || "",
      email: memberUser.email || "",
      password: "",
      employeeId: member.employeeId || "",
      department: member.department || "",
      subject: member.subject || "",
      phone: member.phone || "",
    });

    setError("");
    setMessage("");
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setMessage("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const payload = { ...form };

      // Password is required only when creating a faculty account.
      if (editingId && !payload.password) {
        delete payload.password;
      }

      const url = editingId ? `${API_URL}/${editingId}` : API_URL;

      const data = await apiRequest(url, {
        method: editingId ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });

      setMessage(
        data.message ||
          (editingId
            ? "Faculty updated successfully."
            : "Faculty added successfully."),
      );

      setForm(emptyForm);
      setEditingId(null);
      await loadFaculty();
    } catch (err) {
      setError(err.message || "Faculty save nahi ho paya.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Kya aap is faculty record ko delete karna chahte hain?",
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      const data = await apiRequest(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      setMessage(data.message || "Faculty deleted successfully.");

      if (editingId === id) {
        cancelEdit();
      }

      await loadFaculty();
    } catch (err) {
      setError(err.message || "Faculty delete nahi ho paya.");
    }
  }

  return (
    <div className="manage-faculty">
      <div className="faculty-heading">
        <div>
          <h1>Manage Faculty</h1>
          <p>Add, update and manage faculty records.</p>
        </div>

        <button
          type="button"
          className="faculty-refresh"
          onClick={loadFaculty}
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {error && <div className="faculty-alert error">{error}</div>}
      {message && <div className="faculty-alert success">{message}</div>}

      <form className="faculty-form" onSubmit={handleSubmit}>
        <h2>{editingId ? "Edit Faculty" : "Add New Faculty"}</h2>

        <div className="faculty-form-grid">
          <label>
            Full Name
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter full name"
              required
            />
          </label>

          <label>
            Email Address
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email"
              required
            />
          </label>

          {!editingId && (
            <label>
              Password
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                minLength={6}
                required
              />
            </label>
          )}

          <label>
            Employee ID
            <input
              name="employeeId"
              value={form.employeeId}
              onChange={handleChange}
              placeholder="e.g. FAC001"
              required
            />
          </label>

          <label>
            Department
            <input
              name="department"
              value={form.department}
              onChange={handleChange}
              placeholder="e.g. CSE"
              required
            />
          </label>

          <label>
            Subject
            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="e.g. Database Management"
              required
            />
          </label>

          <label>
            Phone
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
          </label>
        </div>

        <div className="faculty-form-actions">
          <button type="submit" disabled={saving}>
            {saving
              ? "Saving..."
              : editingId
                ? "Update Faculty"
                : "Add Faculty"}
          </button>

          {editingId && (
            <button
              type="button"
              className="faculty-cancel"
              onClick={cancelEdit}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <section className="faculty-list">
        <h2>Faculty Records ({faculty.length})</h2>

        {loading && <p>Loading faculty records...</p>}

        {!loading && faculty.length === 0 && !error && (
          <p>No faculty records found.</p>
        )}

        {!loading && faculty.length > 0 && (
          <div className="faculty-table-wrapper">
            <table className="faculty-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Employee ID</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Subject</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {faculty.map((member) => (
                  <tr key={member._id}>
                    <td>{member.user?.name || "—"}</td>
                    <td>{member.employeeId}</td>
                    <td>{member.user?.email || "—"}</td>
                    <td>{member.department}</td>
                    <td>{member.subject}</td>
                    <td>{member.phone || "—"}</td>
                    <td>
                      <div className="faculty-actions">
                        <button
                          type="button"
                          className="faculty-edit"
                          onClick={() => startEdit(member)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="faculty-delete"
                          onClick={() => handleDelete(member._id)}
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
      </section>
    </div>
  );
}

export default ManageFaculty;
