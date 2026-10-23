import { useEffect, useState } from "react";
import "./MyApplications.css";
import ApplicationStats from "./ApplicationStats";

const API = "http://localhost:5000/api/applications/my-applications";

const STATUSES = [
  "All Statuses",
  "Applied",
  "Under Review",
  "Shortlisted",
  "Selected",
  "Rejected",
];

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  useEffect(() => {
    let cancelled = false;

    async function loadApplications() {
      try {
        const token =
          localStorage.getItem("token") ||
          localStorage.getItem("authToken");

        if (!token) {
          throw new Error("Please login again.");
        }

        const response = await fetch(API, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load applications.");
        }

        if (!cancelled) {
          setApplications(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Something went wrong.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadApplications();

    return () => {
      cancelled = true;
    };
  }, []);

  async function fetchApplications() {
    setRefreshing(true);
    setError("");

    try {
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("authToken");

      if (!token) throw new Error("Please login again.");

      const response = await fetch(API, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to refresh applications.");
      }

      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setRefreshing(false);
    }
  }

  function getStatusClass(status) {
    return `status-${(status || "Applied")
      .toLowerCase()
      .replace(/\s+/g, "-")}`;
  }

  const filteredApplications = applications.filter((application) => {
    const companyName = application.placement?.companyName || "";
    const jobRole = application.placement?.jobRole || "";
    const searchText = search.trim().toLowerCase();

    const matchesSearch =
      companyName.toLowerCase().includes(searchText) ||
      jobRole.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "All Statuses" ||
      (application.status || "Applied") === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="applications-loading">
        Loading your applications...
      </div>
    );
  }

  return (
    <div className="my-applications-page">
      <div className="applications-header">
        <div>
          <h2>My Applications</h2>
          <p>Track your job applications and selection status.</p>
        </div>

        <button
          className="applications-refresh-btn"
          onClick={fetchApplications}
          disabled={refreshing}
        >
          {refreshing ? "Refreshing..." : "Refresh Applications"}
        </button>
      </div>

      {error && (
        <div className="applications-error">{error}</div>
      )}

      {!error && (
        <>
          <ApplicationStats applications={applications} />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "14px",
              marginBottom: "24px",
            }}
          >
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search company or job role..."
              aria-label="Search company or job role"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px 14px",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                fontSize: "14px",
              }}
            />

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter by application status"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px 14px",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                fontSize: "14px",
                background: "#ffffff",
              }}
            >
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <p style={{ color: "#64748b", marginBottom: "16px" }}>
            Showing {filteredApplications.length} of {applications.length} applications
          </p>

          {applications.length === 0 ? (
            <div className="applications-empty">
              <h3>No Applications Yet</h3>
              <p>Explore placement opportunities and apply for your preferred jobs.</p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="applications-empty">
              <h3>No Matching Applications</h3>
              <p>Try another company name or choose a different status.</p>
              <button
                className="applications-refresh-btn"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All Statuses");
                }}
              >
                Clear Search & Filter
              </button>
            </div>
          ) : (
            <div className="applications-list">
              {filteredApplications.map((application) => {
                const placement = application.placement || {};
                const status = application.status || "Applied";

                return (
                  <div className="application-card" key={application._id}>
                    <h3>{placement.companyName || "Company unavailable"}</h3>

                    <p className="application-job-role">
                      {placement.jobRole || "Job role unavailable"}
                    </p>

                    <p className="application-detail">
                      <strong>Status: </strong>
                      <span className={`application-status ${getStatusClass(status)}`}>
                        {status}
                      </span>
                    </p>

                    <p className="application-detail">
                      <strong>Applied On: </strong>
                      {application.createdAt
                        ? new Date(application.createdAt).toLocaleDateString("en-IN")
                        : "Not available"}
                    </p>

                    <p className="application-detail">
                      <strong>Resume: </strong>
                      {application.resumeUrl ? (
                        <a
                          className="application-resume-link"
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

                    <p className="application-detail">
                      <strong>Cover Letter: </strong>
                      {application.coverLetter || "Not provided"}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}