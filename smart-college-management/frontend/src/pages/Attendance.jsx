import { useEffect, useState } from "react";
import "./Attendance.css";

const API = "http://localhost:5000/api";

function Attendance() {
  const [records, setRecords] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [studentId, setStudentId] = useState("");
  const [subject, setSubject] = useState("");
  const [facultySubject, setFacultySubject] = useState("");
  const [date, setDate] = useState(() => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    return new Date(today.getTime() - offset * 60000)
      .toISOString()
      .slice(0, 10);
  });

  const [status, setStatus] = useState("Present");
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("token");

  // eslint-disable-next-line no-useless-assignment
  let storedUser = null;

  try {
    storedUser = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    storedUser = null;
  }

  const role = storedUser?.role?.toLowerCase() || "";
  const isStaff = role === "faculty" || role === "admin";

  async function fetchData() {
    const response = await fetch(`${API}/attendance`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to fetch attendance.");
    }

    setRecords(data.attendance || []);
  }

  useEffect(() => {
    let cancelled = false;

    async function loadPage() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Please login first.");
        }

        const attendanceResponse = await fetch(`${API}/attendance`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const attendanceData = await attendanceResponse.json();

        if (!attendanceResponse.ok) {
          throw new Error(
            attendanceData.message || "Unable to fetch attendance.",
          );
        }

        if (cancelled) return;

        setRecords(attendanceData.attendance || []);

        if (role === "faculty") {
          const profileResponse = await fetch(`${API}/faculty/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const profileData = await profileResponse.json();

          if (!profileResponse.ok) {
            throw new Error(
              profileData.message || "Unable to load faculty profile.",
            );
          }

          const assignedSubject = profileData.faculty?.subject || "";

          if (!cancelled) {
            setFacultySubject(assignedSubject);
            setSubject(assignedSubject);
          }
        }

        if (role === "faculty" || role === "admin") {
          const studentsResponse = await fetch(`${API}/students`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const studentsData = await studentsResponse.json();

          if (!studentsResponse.ok) {
            throw new Error(studentsData.message || "Unable to load students.");
          }

          const studentList = Array.isArray(studentsData)
            ? studentsData
            : studentsData.students || [];

          if (!cancelled) {
            setStudents(studentList);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Something went wrong.");
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
  }, [token, role]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!studentId || !subject.trim() || !date) {
      setError("Please select a student, subject and date.");
      return;
    }

    if (role === "faculty" && subject !== facultySubject) {
      setError("You can mark attendance only for your assigned subject.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(`${API}/attendance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          studentId,
          subject: subject.trim(),
          date,
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to mark attendance.");
      }

      setMessage(data.message || "Attendance marked successfully!");
      setStudentId("");

      await fetchData();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

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
          <p className="attendance-eyebrow">
            {isStaff ? "FACULTY PORTAL" : "STUDENT PORTAL"}
          </p>

          <h2>{isStaff ? "Attendance Management" : "My Attendance"}</h2>

          <p>
            {isStaff
              ? "Mark and review student attendance."
              : "Check your subject-wise attendance records."}
          </p>
        </div>

        <span className="attendance-icon">📅</span>
      </div>

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
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                placeholder="Subject"
                readOnly={role === "faculty"}
                required
              />
              {role === "faculty" && (
                <small>
                  Your assigned subject: {facultySubject || "Not assigned"}
                </small>
              )}
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
        </section>
      )}

      {error && <p className="attendance-error">{error}</p>}
      {message && <p className="attendance-success">{message}</p>}

      <div className="attendance-summary">
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
          <span>Present Rate</span>
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
                      <td>
                        {record.student?.user?.name ||
                          record.student?.name ||
                          "Student"}
                      </td>
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
