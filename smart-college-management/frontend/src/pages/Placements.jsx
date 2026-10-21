import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/placements";
const APPLICATION_API = "http://localhost:5000/api/applications";

function Placements() {
  const [placements, setPlacements] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPlacement, setSelectedPlacement] = useState(null);
  const [resumeUrl, setResumeUrl] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState("");
  const [appliedIds, setAppliedIds] = useState([]);

  const token =
    localStorage.getItem("token") || localStorage.getItem("authToken") || "";

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    async function fetchPlacements() {
      try {
        const response = await fetch(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load placements.");
        }

        if (!cancelled) {
          setPlacements(Array.isArray(data) ? data : []);
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load placements.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchPlacements();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const filteredPlacements = placements.filter((placement) => {
    const searchText = search.toLowerCase().trim();

    return (
      placement.companyName?.toLowerCase().includes(searchText) ||
      placement.jobRole?.toLowerCase().includes(searchText) ||
      placement.location?.toLowerCase().includes(searchText)
    );
  });

  function formatPackage(value) {
    const amount = Number(value);

    if (
      value === "" ||
      value === null ||
      value === undefined ||
      !Number.isFinite(amount)
    ) {
      return "Not specified";
    }

    return `${amount.toLocaleString("en-IN")} LPA`;
  }

  function formatDeadline(value) {
    if (!value) return "Not specified";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "Not specified";
    }

    return date.toLocaleDateString("en-IN");
  }

  function isPlacementOpen(placement) {
    if (placement.status !== "Open" || !placement.deadline) {
      return false;
    }

    const deadline = new Date(placement.deadline);

    if (Number.isNaN(deadline.getTime())) {
      return false;
    }

    // Deadline ke poore din tak apply kar sakte hain.
    deadline.setHours(23, 59, 59, 999);

    return deadline >= new Date();
  }

  function openApplicationForm(placement) {
    setSelectedPlacement(placement);
    setResumeUrl("");
    setCoverLetter("");
    setMessage("");
  }

  async function handleApply(event) {
    event.preventDefault();

    if (!selectedPlacement || applying) return;

    setApplying(true);
    setMessage("");

    try {
      const response = await fetch(APPLICATION_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          placementId: selectedPlacement._id,
          resumeUrl: resumeUrl.trim(),
          coverLetter: coverLetter.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Application submission failed.");
      }

      setAppliedIds((previous) => [...previous, selectedPlacement._id]);

      setMessage(data.message || "Application submitted successfully!");

      setSelectedPlacement(null);
      setResumeUrl("");
      setCoverLetter("");
    } catch (err) {
      setMessage(err.message || "Unable to submit application.");
    } finally {
      setApplying(false);
    }
  }

  if (!token) {
    return (
      <div style={styles.page}>
        <h2>Please log in to view placements.</h2>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Placement Opportunities</h1>
          <p style={styles.subtitle}>
            Explore job opportunities and take the next step in your career.
          </p>
        </div>

        <div style={styles.count}>{placements.length} Opportunities</div>
      </div>

      {message && (
        <div style={styles.message}>
          {message}
          <button
            type="button"
            onClick={() => setMessage("")}
            style={styles.dismissButton}
          >
            Dismiss
          </button>
        </div>
      )}

      <input
        type="text"
        placeholder="Search company, job role or location..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        style={styles.search}
      />

      {loading && <p>Loading placements...</p>}

      {!loading && error && (
        <div style={styles.error}>
          <p>{error}</p>
          <p>Check that the backend server is running and log in again.</p>
        </div>
      )}

      {!loading && !error && filteredPlacements.length === 0 && (
        <div style={styles.empty}>
          <h3>No placements found</h3>
          <p>
            {search
              ? "Try searching with another keyword."
              : "New placement opportunities will appear here."}
          </p>
        </div>
      )}

      {!loading && !error && filteredPlacements.length > 0 && (
        <div style={styles.grid}>
          {filteredPlacements.map((placement) => {
            const isOpen = isPlacementOpen(placement);
            const alreadyApplied = appliedIds.includes(placement._id);
            const formIsOpen = selectedPlacement?._id === placement._id;

            return (
              <article key={placement._id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div style={styles.companyIcon}>
                    {placement.companyName?.charAt(0)?.toUpperCase() || "C"}
                  </div>

                  <span
                    style={{
                      ...styles.badge,
                      ...(isOpen ? styles.openBadge : styles.closedBadge),
                    }}
                  >
                    {isOpen ? "Open" : "Closed"}
                  </span>
                </div>

                <h2 style={styles.company}>{placement.companyName}</h2>
                <h3 style={styles.role}>{placement.jobRole}</h3>
                <p style={styles.package}>{formatPackage(placement.package)}</p>

                <div style={styles.details}>
                  <p>
                    <strong>Location:</strong>{" "}
                    {placement.location || "Not specified"}
                  </p>
                  <p>
                    <strong>Job type:</strong>{" "}
                    {placement.jobType || "Full-time"}
                  </p>
                  <p>
                    <strong>Eligibility:</strong>{" "}
                    {placement.eligibility || "Check with placement cell"}
                  </p>
                  <p>
                    <strong>Deadline:</strong>{" "}
                    {formatDeadline(placement.deadline)}
                  </p>
                </div>

                {placement.description && (
                  <p style={styles.description}>{placement.description}</p>
                )}

                {alreadyApplied ? (
                  <button
                    type="button"
                    disabled
                    style={{ ...styles.button, ...styles.disabledButton }}
                  >
                    Applied Successfully
                  </button>
                ) : isOpen ? (
                  <button
                    type="button"
                    onClick={() => openApplicationForm(placement)}
                    style={styles.button}
                  >
                    Apply Now
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    style={{ ...styles.button, ...styles.disabledButton }}
                  >
                    Applications Closed
                  </button>
                )}

                {formIsOpen && (
                  <form onSubmit={handleApply} style={styles.form}>
                    <h3 style={styles.formTitle}>Apply for this Job</h3>

                    <label style={styles.label} htmlFor="resumeUrl">
                      Resume Link
                    </label>
                    <input
                      id="resumeUrl"
                      type="url"
                      value={resumeUrl}
                      onChange={(event) => setResumeUrl(event.target.value)}
                      placeholder="Paste your Google Drive or resume URL"
                      style={styles.formInput}
                    />

                    <p style={styles.hint}>
                      Share a link that the recruiter can access.
                    </p>

                    <label style={styles.label} htmlFor="coverLetter">
                      Cover Letter
                    </label>
                    <textarea
                      id="coverLetter"
                      value={coverLetter}
                      onChange={(event) => setCoverLetter(event.target.value)}
                      placeholder="Why are you interested in this role?"
                      rows={5}
                      style={styles.formInput}
                    />

                    <button
                      type="submit"
                      disabled={applying}
                      style={{
                        ...styles.button,
                        ...(applying ? styles.disabledButton : {}),
                      }}
                    >
                      {applying ? "Submitting..." : "Submit Application"}
                    </button>

                    <button
                      type="button"
                      disabled={applying}
                      onClick={() => {
                        setSelectedPlacement(null);
                        setMessage("");
                      }}
                      style={styles.cancelButton}
                    >
                      Cancel
                    </button>
                  </form>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    padding: "28px",
    color: "#1e293b",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "16px",
    marginBottom: "24px",
  },
  title: {
    fontSize: "28px",
    margin: "0 0 8px",
  },
  subtitle: {
    color: "#64748b",
    margin: 0,
    lineHeight: 1.5,
  },
  count: {
    background: "#e0e7ff",
    color: "#3730a3",
    borderRadius: "20px",
    padding: "10px 16px",
    fontWeight: 600,
  },
  search: {
    width: "100%",
    maxWidth: "480px",
    boxSizing: "border-box",
    padding: "13px 15px",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    marginBottom: "24px",
    fontSize: "14px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "22px",
    boxShadow: "0 4px 14px rgba(15, 23, 42, 0.05)",
    minWidth: 0,
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "18px",
  },
  companyIcon: {
    width: "48px",
    height: "48px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "12px",
    background: "#eef2ff",
    color: "#4338ca",
    fontSize: "23px",
    fontWeight: 700,
  },
  badge: {
    padding: "6px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: 600,
  },
  openBadge: {
    background: "#dcfce7",
    color: "#166534",
  },
  closedBadge: {
    background: "#fee2e2",
    color: "#991b1b",
  },
  company: {
    margin: "0 0 6px",
    fontSize: "21px",
  },
  role: {
    margin: "0 0 12px",
    fontSize: "16px",
    color: "#475569",
  },
  package: {
    color: "#047857",
    fontWeight: 700,
    fontSize: "18px",
    marginBottom: "18px",
  },
  details: {
    borderTop: "1px solid #e2e8f0",
    paddingTop: "12px",
    fontSize: "14px",
    lineHeight: 1.6,
    overflowWrap: "anywhere",
  },
  description: {
    color: "#64748b",
    fontSize: "14px",
    lineHeight: 1.6,
  },
  button: {
    width: "100%",
    border: "none",
    borderRadius: "9px",
    padding: "12px",
    marginTop: "12px",
    background: "#4f46e5",
    color: "#ffffff",
    fontWeight: 600,
    cursor: "pointer",
  },
  disabledButton: {
    background: "#94a3b8",
    cursor: "not-allowed",
  },
  form: {
    marginTop: "18px",
    paddingTop: "16px",
    borderTop: "1px solid #e2e8f0",
  },
  formTitle: {
    fontSize: "18px",
    marginTop: 0,
  },
  label: {
    display: "block",
    marginTop: "12px",
    marginBottom: "6px",
    fontSize: "14px",
    fontWeight: 600,
  },
  formInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "11px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    fontSize: "14px",
    fontFamily: "Arial, sans-serif",
  },
  hint: {
    color: "#64748b",
    fontSize: "12px",
    overflowWrap: "anywhere",
  },
  cancelButton: {
    width: "100%",
    padding: "10px",
    marginTop: "8px",
    background: "#ffffff",
    color: "#475569",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    cursor: "pointer",
  },
  message: {
    padding: "12px",
    marginBottom: "16px",
    background: "#f1f5f9",
    borderRadius: "8px",
    overflowWrap: "anywhere",
  },
  dismissButton: {
    marginLeft: "12px",
    border: "none",
    background: "transparent",
    color: "#4338ca",
    cursor: "pointer",
  },
  error: {
    padding: "16px",
    color: "#b91c1c",
    background: "#fee2e2",
    borderRadius: "10px",
  },
  empty: {
    textAlign: "center",
    padding: "40px 20px",
    background: "#f8fafc",
    borderRadius: "12px",
    color: "#64748b",
  },
};

export default Placements;
