const STATUSES = [
  { label: "Applied", color: "#2563eb", background: "#dbeafe" },
  { label: "Under Review", color: "#b45309", background: "#fef3c7" },
  { label: "Shortlisted", color: "#7c3aed", background: "#ede9fe" },
  { label: "Selected", color: "#15803d", background: "#dcfce7" },
  { label: "Rejected", color: "#b91c1c", background: "#fee2e2" },
  
];

export default function ApplicationStats({ applications = [] }) {
  const getCount = (status) =>
    applications.filter((application) => application.status === status).length;

  const cardStyle = {
    padding: "18px",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    background: "#ffffff",
    boxShadow: "0 3px 10px rgba(15, 23, 42, 0.05)",
  };

  return (
    <section
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        gap: "16px",
        marginBottom: "25px",
      }}
    >
      <div style={cardStyle}>
        <p style={{ margin: "0 0 10px", color: "#64748b" }}>
          Total Applications
        </p>
        <strong style={{ fontSize: "30px", color: "#0f172a" }}>
          {applications.length}
        </strong>
      </div>

      {STATUSES.map((status) => (
        <div
          key={status.label}
          style={{
            ...cardStyle,
            background: status.background,
            borderColor: status.background,
          }}
        >
          <p style={{ margin: "0 0 10px", color: status.color }}>
            {status.label}
          </p>
          <strong style={{ fontSize: "30px", color: status.color }}>
            {getCount(status.label)}
          </strong>
        </div>
      ))}
    </section>
  );
}


