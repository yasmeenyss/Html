import { useEffect, useState } from "react";
import "./Attendance.css";

function Attendance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login to view attendance.");
          return;
        }

        const response = await fetch("http://localhost:5000/api/attendance", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to fetch attendance records.",
          );
        }

        setRecords(data.attendance || []);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  if (loading) {
    return (
      <div className="attendance-page">
        <p className="attendance-message">Loading attendance...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="attendance-page">
        <h2>My Attendance</h2>
        <p className="attendance-error">{error}</p>
      </div>
    );
  }

  const presentCount = records.filter(
    (record) => record.status === "Present",
  ).length;

  const absentCount = records.filter(
    (record) => record.status === "Absent",
  ).length;

  const lateCount = records.filter((record) => record.status === "Late").length;

  const percentage =
    records.length > 0 ? Math.round((presentCount / records.length) * 100) : 0;

  return (
    <div className="attendance-page">
      <div className="attendance-heading">
        <div>
          <p className="attendance-eyebrow">STUDENT PORTAL</p>
          <h2>My Attendance</h2>
          <p>Check your subject-wise attendance records.</p>
        </div>
        <span className="attendance-icon">📅</span>
      </div>

      <div className="attendance-summary">
        <div className="attendance-stat">
          <span>Total Classes</span>
          <strong>{records.length}</strong>
        </div>

        <div className="attendance-stat">
          <span>Present</span>
          <strong>{presentCount}</strong>
        </div>

        <div className="attendance-stat">
          <span>Absent</span>
          <strong>{absentCount}</strong>
        </div>

        <div className="attendance-stat">
          <span>Late</span>
          <strong>{lateCount}</strong>
        </div>

        <div className="attendance-stat">
          <span>Attendance</span>
          <strong>{percentage}%</strong>
        </div>
      </div>

      <section className="attendance-records">
        <h3>Attendance History</h3>

        {records.length === 0 ? (
          <p className="attendance-message">No attendance records found yet.</p>
        ) : (
          <div className="attendance-table-wrapper">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Date</th>
                  <th>Faculty</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {records.map((record) => (
                  <tr key={record._id}>
                    <td>{record.subject}</td>
                    <td>
                      {record.date
                        ? new Date(record.date).toLocaleDateString("en-IN")
                        : "—"}
                    </td>
                    <td>{record.faculty?.user?.name || "Not available"}</td>
                    <td>
                      <span
                        className={`attendance-status ${record.status?.toLowerCase()}`}
                      >
                        {record.status}
                      </span>
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

export default Attendance;
