import { useCallback, useEffect, useState } from "react";
import "./Attendance.css";

const API = "https://smart-college-management-api-1870.onrender.com/api";

function getStoredRole() {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return user?.role?.toLowerCase() || "";
  } catch {
    return "";
  }
}

function Attendance() {
  const [records, setRecords] = useState([]);
  const [students, setStudents] = useState([]);
  const [facultySubject, setFacultySubject] = useState("");
  const [studentId, setStudentId] = useState("");
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState("Present");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");
  const role = getStoredRole();
  const isStaff = role === "faculty" || role === "admin";

  const apiRequest = useCallback(
    async (url, options = {}) => {
      const response = await fetch(`${API}${url}`, {
        ...options,
        headers: {
          Authorization: `Bearer ${token}`,
          ...(options.body ? { "Content-Type": "application/json" } : {}),
          ...options.headers,
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || `Request failed (${response.status})`);
      }

      return data;
    },
    [token],
  );

  const fetchAttendance = useCallback(async () => {
    const data = await apiRequest("/attendance");
    setRecords(data.attendance || []);
  }, [apiRequest]);

  useEffect(() => {
    let cancelled = false;

    async function loadPage() {
      try {
        setLoading(true);
        setError("");

        if (!token) {
          throw new Error("Please log in again.");
        }

        const attendanceData = await apiRequest("/attendance");

        if (cancelled) return;

        setRecords(attendanceData.attendance || []);

        if (isStaff) {
          const studentData = await apiRequest("/students");

          if (cancelled) return;

          const studentList = Array.isArray(studentData)
            ? studentData
            : studentData.students || [];

          setStudents(studentList);
        }

        if (role === "faculty") {
          const profileData = await apiRequest("/faculty/me");

          if (cancelled) return;

          const assignedSubject = profileData.faculty?.subject || "";

          setFacultySubject(assignedSubject);
          setSubject(assignedSubject);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load attendance.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPage();

    return () => {
      cancelled = true;
    };
  }, [token, role, isStaff, apiRequest]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    const selectedSubject =
      role === "faculty" ? facultySubject : subject.trim();

    if (!studentId || !selectedSubject || !date) {
      setError("Please select a student, subject and date.");
      return;
    }

    try {
      setSaving(true);

      await apiRequest("/attendance", {
        method: "POST",
        body: JSON.stringify({
          studentId,
          subject: selectedSubject,
          date,
          status,
        }),
      });

      setMessage("Attendance marked successfully!");
      setStudentId("");
      setStatus("Present");

      await fetchAttendance();
    } catch (err) {
      setError(err.message || "Unable to mark attendance.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="attendance-page">
        <p className="attendance-message">Loading attendance...</p>
      </main>
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
    <main className="attendance-page">
      <header className="attendance-heading">
        <div>
          <p className="attendance-eyebrow">
            {isStaff ? "FACULTY PORTAL" : "STUDENT PORTAL"}
          </p>

          <h2>{isStaff ? "Attendance Management" : "My Attendance"}</h2>

          <p>
            {isStaff
              ? "Mark and review student attendance."
              : "Check your attendance records."}
          </p>
        </div>

        <span className="attendance-icon">📅</span>
      </header>

      {error && (
        <p className="attendance-error" role="alert">
          {error}
        </p>
      )}

      {message && (
        <p className="attendance-success" role="status">
          {message}
        </p>
      )}

      {isStaff && (
        <section className="attendance-records">
          <h3>Mark Attendance</h3>

          <form className="attendance-form" onSubmit={handleSubmit}>
            <label>
              Select Student
              <select
                value={studentId}
                onChange={(event) => setStudentId(event.target.value)}
                required
              >
                <option value="">-- Choose student --</option>

                {students.map((student) => (
                  <option key={student._id} value={student._id}>
                    {student.user?.name || student.name || "Student"} -{" "}
                    {student.rollNumber || "No USN"}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Subject
              <input
                value={role === "faculty" ? facultySubject : subject}
                onChange={(event) => setSubject(event.target.value)}
                placeholder="Enter subject"
                readOnly={role === "faculty"}
                required
              />
            </label>

            <label>
              Date
              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                required
              />
            </label>

            <label>
              Status
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                required
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Late">Late</option>
              </select>
            </label>

            <button
              type="submit"
              disabled={
                saving ||
                students.length === 0 ||
                (role === "faculty" && !facultySubject)
              }
            >
              {saving ? "Saving..." : "Mark Attendance"}
            </button>
          </form>

          {students.length === 0 && (
            <p className="attendance-message">
              No students loaded. Please check the students API.
            </p>
          )}

          {role === "faculty" && !facultySubject && (
            <p className="attendance-error">
              No subject is assigned to your faculty profile. Ask the admin to
              update it.
            </p>
          )}
        </section>
      )}

      <section className="attendance-summary">
        <div className="attendance-stat">
          <span>Total Records</span>
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
      </section>

      <section className="attendance-records">
        <h3>Attendance History</h3>

        {records.length === 0 ? (
          <p className="attendance-message">No attendance records found yet.</p>
        ) : (
          <div className="attendance-table-wrapper">
            <table className="attendance-table">
              <thead>
                <tr>
                  {isStaff && <th>Student</th>}
                  <th>Subject</th>
                  <th>Date</th>
                  <th>Faculty</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {records.map((record) => (
                  <tr key={record._id}>
                    {isStaff && (
                      <td>{record.student?.user?.name || "Student"}</td>
                    )}

                    <td>{record.subject}</td>

                    <td>
                      {record.date
                        ? new Date(record.date).toLocaleDateString("en-IN")
                        : "—"}
                    </td>

                    <td>{record.faculty?.user?.name || "Not available"}</td>

                    <td>
                      <span
                        className={`attendance-status ${
                          record.status?.toLowerCase() || ""
                        }`}
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
    </main>
  );
}

export default Attendance;
