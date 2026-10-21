import { useEffect, useState } from "react";

const API = "http://localhost:5000/api/applications";

const STATUSES = [
  "Applied",
  "Under Review",
  "Shortlisted",
  "Selected",
  "Rejected",
];

export default function ReviewApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  const getToken = () =>
    localStorage.getItem("token") ||
    localStorage.getItem("authToken");

  const fetchApplications = async () => {
    setLoading(true);
    setError("");

    try {
      const token = getToken();

      if (!token) {
        setError("Please login as Admin first.");
        return;
      }

      const response = await fetch(API, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load applications");
      }

      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const updateStatus = async (applicationId, status) => {
    try {
      setUpdatingId(applicationId);
      setError("");

      const response = await fetch(`${API}/${applicationId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update status");
      }

      setApplications((previous) =>
        previous.map((application) =>
          application._id === applicationId
            ? { ...application, status: data.application.status }
            : application
        )
      );

      alert("Application status updated successfully!");
    } catch (err) {
      setError(err.message || "Could not update status");
    } finally {
      setUpdatingId("");
    }
  };

  const getStudentName = (student) => {
    if (!student) return "Student details unavailable";
    return (
      student.name ||
      student.fullName ||
      student.username ||
      student.email ||
      "Student"
    );
  };

  const getCompanyName = (placement) =>
    placement?.companyName || "Company unavailable";

  const getJobRole = (placement) =>
    placement?.jobRole || "Role unavailable";

  if (loading) {
    return <div style={styles.message}>Loading applications...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.heading}>Review Applications</h2>
          <p style={styles.subtitle}>
            View student applications and update their status.
          </p>
        </div>

        <button style={styles.refreshButton} onClick={fetchApplications}>
          Refresh
        </button>
      </div>

      <div style={styles.summary}>
        <strong>Total Applications: {applications.length}</strong>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {applications.length === 0 ? (
        <div style={styles.empty}>
          No applications found yet.
        </div>
      ) : (
        <div style={styles.list}>
          {applications.map((application) => {
            const placement = application.placement;
            const student = application.student;

            return (
              <div key={application._id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div>
                    <h3 style={styles.company}>
                      {getCompanyName(placement)}
                    </h3>
                    <p style={styles.role}>{getJobRole(placement)}</p>
                  </div>

                  <span style={styles.status}>
                    {application.status || "Applied"}
                  </span>
                </div>

                <div style={styles.details}>
                  <p>
                    <strong>Student:</strong> {getStudentName(student)}
                  </p>

                  <p>
                    <strong>Email:</strong> {student?.email || "Not available"}
                  </p>

                  <p>
                    <strong>Applied On:</strong>{" "}
                    {application.createdAt
                      ? new Date(application.createdAt).toLocaleDateString()
                      : "Not available"}
                  </p>

                  <p>
                    <strong>Resume:</strong>{" "}
                    {application.resumeUrl ? (
                      <a
                        href={application.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Resume
                      </a>
                    ) : (
                      "Not provided"
                    )}
                  </p>

                  <div style={styles.coverLetter}>
                    <strong>Cover Letter:</strong>
                    <p>
                      {application.coverLetter || "Not provided"}
                    </p>
                  </div>
                </div>

                <div style={styles.statusRow}>
                  <label htmlFor={`status-${application._id}`}>
                    Update Status:
                  </label>

                  <select
                    id={`status-${application._id}`}
                    value={application.status || "Applied"}
                    disabled={updatingId === application._id}
                    onChange={(event) =>
                      updateStatus(application._id, event.target.value)
                    }
                    style={styles.select}
                  >
                    {STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>

                  {updatingId === application._id && (
                    <span>Updating...</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "24px",
    color: "#1f2937",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "20px",
  },
  heading: {
    margin: "0 0 8px",
    fontSize: "28px",
  },
  subtitle: {
    margin: 0,
    color: "#6b7280",
  },
  refreshButton: {
    padding: "10px 18px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  summary: {
    background: "#eff6ff",
    padding: "16px",
    borderRadius: "8px",
    marginBottom: "20px",
  },
  list: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
    gap: "18px",
  },
  card: {
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "20px",
    background: "#ffffff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "10px",
    marginBottom: "16px",
  },
  company: {
    margin: "0 0 6px",
    fontSize: "20px",
  },
  role: {
    margin: 0,
    color: "#4b5563",
  },
  status: {
    padding: "6px 10px",
    borderRadius: "20px",
    background: "#f3f4f6",
    fontSize: "12px",
    fontWeight: "bold",
    whiteSpace: "nowrap",
  },
  details: {
    lineHeight: 1.6,
    overflowWrap: "anywhere",
  },
  coverLetter: {
    background: "#f9fafb",
    padding: "12px",
    borderRadius: "8px",
  },
  statusRow: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "10px",
    borderTop: "1px solid #e5e7eb",
    paddingTop: "16px",
    marginTop: "16px",
  },
  select: {
    padding: "9px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    maxWidth: "100%",
  },
  message: {
    padding: "24px",
  },
  empty: {
    padding: "30px",
    textAlign: "center",
    background: "#f9fafb",
    borderRadius: "10px",
  },
  error: {
    padding: "12px",
    color: "#b91c1c",
    background: "#fef2f2",
    borderRadius: "8px",
  },
};