import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/placements";

function ManagePlacements() {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    companyName: "",
    jobRole: "",
    description: "",
    package: "",
    eligibility: "",
    deadline: "",
    location: "",
    jobType: "Full-time",
  });

  const token =
    localStorage.getItem("token") || localStorage.getItem("authToken") || "";

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    async function loadPlacements() {
      try {
        const response = await fetch(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Could not load placements.");
        }

        if (!cancelled) {
          setPlacements(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        if (!cancelled) setMessage(error.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadPlacements();

    return () => {
      cancelled = true;
    };
  }, [token]);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          package: Number(form.package),
          deadline: form.deadline,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add placement.");
      }

      setPlacements((previous) => [data, ...previous]);
      setForm({
        companyName: "",
        jobRole: "",
        description: "",
        package: "",
        eligibility: "",
        deadline: "",
        location: "",
        jobType: "Full-time",
      });
      setMessage("Placement added successfully!");
    } catch (error) {
      setMessage(error.message || "Something went wrong.");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this placement?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete placement.");
      }

      setPlacements((previous) => previous.filter((item) => item._id !== id));
      setMessage("Placement deleted successfully!");
    } catch (error) {
      setMessage(error.message || "Could not delete placement.");
    }
  }

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "11px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    fontSize: "14px",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "6px",
    fontWeight: 600,
    fontSize: "14px",
  };

  if (!token) {
    return <p>Please log in to manage placements.</p>;
  }

  return (
    <div style={{ padding: "24px", color: "#1e293b" }}>
      <h1>Manage Placements</h1>
      <p>Add and manage job and internship opportunities for students.</p>

      {message && (
        <p
          style={{
            padding: "12px",
            borderRadius: "8px",
            background: message.toLowerCase().includes("success")
              ? "#dcfce7"
              : "#fee2e2",
            color: message.toLowerCase().includes("success")
              ? "#166534"
              : "#991b1b",
          }}
        >
          {message}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          padding: "22px",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          margin: "20px 0 30px",
        }}
      >
        <div>
          <label style={labelStyle}>Company Name *</label>
          <input
            name="companyName"
            value={form.companyName}
            onChange={handleChange}
            style={inputStyle}
            placeholder="e.g. Infosys"
            required
          />
        </div>

        <div>
          <label style={labelStyle}>Job Role *</label>
          <input
            name="jobRole"
            value={form.jobRole}
            onChange={handleChange}
            style={inputStyle}
            placeholder="e.g. Software Developer"
            required
          />
        </div>

        <div>
          <label style={labelStyle}>Package (LPA) *</label>
          <input
            type="number"
            name="package"
            value={form.package}
            onChange={handleChange}
            style={inputStyle}
            min="0"
            step="0.1"
            placeholder="e.g. 4.5"
            required
          />
        </div>

        <div>
          <label style={labelStyle}>Application Deadline *</label>
          <input
            type="date"
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
            style={inputStyle}
            required
          />
        </div>

        <div>
          <label style={labelStyle}>Location</label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            style={inputStyle}
            placeholder="e.g. Bengaluru"
          />
        </div>

        <div>
          <label style={labelStyle}>Job Type</label>
          <select
            name="jobType"
            value={form.jobType}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="Full-time">Full-time</option>
            <option value="Internship">Internship</option>
          </select>
        </div>

        <div>
          <label style={labelStyle}>Eligibility</label>
          <input
            name="eligibility"
            value={form.eligibility}
            onChange={handleChange}
            style={inputStyle}
            placeholder="e.g. BE/BTech CSE"
          />
        </div>

        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>Job Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            style={{ ...inputStyle, minHeight: "90px" }}
            placeholder="Describe the job opportunity..."
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "12px 18px",
            background: "#4f46e5",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Add Placement
        </button>
      </form>

      <h2>Existing Placements ({placements.length})</h2>

      {loading ? (
        <p>Loading placements...</p>
      ) : placements.length === 0 ? (
        <p>No placements added yet. Use the form above to add one.</p>
      ) : (
        <div style={{ display: "grid", gap: "12px" }}>
          {placements.map((placement) => (
            <div
              key={placement._id}
              style={{
                padding: "16px",
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <div>
                <strong>{placement.companyName}</strong>
                <p style={{ margin: "6px 0" }}>{placement.jobRole}</p>
                <small>
                  {placement.package} LPA ·{" "}
                  {placement.location || "Location not specified"}
                </small>
              </div>

              <button
                type="button"
                onClick={() => handleDelete(placement._id)}
                style={{
                  padding: "9px 14px",
                  background: "#dc2626",
                  color: "white",
                  border: "none",
                  borderRadius: "7px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManagePlacements;
