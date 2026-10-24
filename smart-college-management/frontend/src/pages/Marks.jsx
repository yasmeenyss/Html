import { useCallback, useEffect, useState } from "react";
import "./Marks.css";

const API_URL = "https://smart-college-management-api-1870.onrender.com/api";

function Marks() {
  const [marks, setMarks] = useState([]);
  const [students, setStudents] = useState([]);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    studentId: "",
    subject: "",
    examType: "Internal",
    maxMarks: "100",
    marksObtained: "",
  });

  const token = localStorage.getItem("token");
  console.log("Token length:", token?.length);
  console.log("Token available:", Boolean(token));
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const currentRole = storedUser.role || "";

      setRole(currentRole);

      if (!token) {
        throw new Error("Please log in again.");
      }

      const response = await fetch(`${API_URL}/marks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load marks.");
      }

      setMarks(data.marks || []);

      if (currentRole === "faculty" || currentRole === "admin") {
        const studentResponse = await fetch(`${API_URL}/students`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const studentData = await studentResponse.json();

        if (!studentResponse.ok) {
          throw new Error(studentData.message || "Failed to load students.");
        }

        const studentList = Array.isArray(studentData)
          ? studentData
          : studentData.students || [];

        setStudents(studentList);
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 0);

    return () => clearTimeout(timer);
  }, [fetchData]);
  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const maxMarks = Number(form.maxMarks);
    const marksObtained = Number(form.marksObtained);

    if (!form.studentId || !form.subject.trim()) {
      setError("Please select a student and enter a subject.");
      return;
    }

    if (
      form.marksObtained === "" ||
      !Number.isFinite(maxMarks) ||
      !Number.isFinite(marksObtained) ||
      maxMarks < 1 ||
      marksObtained < 0 ||
      marksObtained > maxMarks
    ) {
      setError("Enter valid marks between 0 and maximum marks.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`${API_URL}/marks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          studentId: form.studentId,
          subject: form.subject.trim(),
          examType: form.examType,
          maxMarks,
          marksObtained,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save marks.");
      }

      setMessage(data.message || "Marks saved successfully.");

      setForm((previousForm) => ({
        ...previousForm,
        marksObtained: "",
      }));

      await fetchData();
    } catch (err) {
      setError(err.message || "Failed to save marks.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="marks-page">Loading marks...</div>;
  }

  return (
    <div className="marks-page">
      <header className="marks-header">
        <span className="marks-label">ACADEMIC RESULTS</span>
        <h1>Marks &amp; Results</h1>
        <p>Enter, manage and review examination results.</p>
      </header>

      {error && (
        <div className="marks-alert marks-error" role="alert">
          {error}
        </div>
      )}

      {message && (
        <div className="marks-alert marks-success" role="status">
          {message}
        </div>
      )}

      {(role === "faculty" || role === "admin") && (
        <section className="marks-card">
          <h2>Enter Student Marks</h2>

          <form onSubmit={handleSubmit} className="marks-form">
            <label>
              Student
              <select
                name="studentId"
                value={form.studentId}
                onChange={handleChange}
                required
              >
                <option value="">Select student</option>

                {students.map((student) => (
                  <option key={student._id} value={student._id}>
                    {student.rollNumber || student._id} —{" "}
                    {student.user?.name || student.name || "Student"}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Subject
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="Enter assigned subject"
                required
              />
            </label>

            <label>
              Exam Type
              <select
                name="examType"
                value={form.examType}
                onChange={handleChange}
              >
                <option value="Internal">Internal</option>
                <option value="Midterm">Midterm</option>
                <option value="Final">Final</option>
              </select>
            </label>

            <label>
              Maximum Marks
              <input
                type="number"
                name="maxMarks"
                min="1"
                value={form.maxMarks}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Marks Obtained
              <input
                type="number"
                name="marksObtained"
                min="0"
                max={form.maxMarks}
                value={form.marksObtained}
                onChange={handleChange}
                required
              />
            </label>

            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Marks"}
            </button>
          </form>
        </section>
      )}

      <section className="marks-card">
        <h2>{role === "student" ? "My Results" : "Results Records"}</h2>

        {marks.length === 0 ? (
          <p className="marks-empty">No marks records found yet.</p>
        ) : (
          <div className="marks-table-wrapper">
            <table className="marks-table">
              <thead>
                <tr>
                  {role !== "student" && <th>Student</th>}
                  <th>Subject</th>
                  <th>Exam</th>
                  <th>Marks</th>
                  <th>Percentage</th>
                </tr>
              </thead>

              <tbody>
                {marks.map((mark) => {
                  const percentage =
                    mark.maxMarks > 0
                      ? (mark.marksObtained / mark.maxMarks) * 100
                      : 0;

                  return (
                    <tr key={mark._id}>
                      {role !== "student" && (
                        <td>
                          {mark.student?.user?.name ||
                            mark.student?.name ||
                            mark.student?.rollNumber ||
                            "Student"}
                        </td>
                      )}

                      <td>{mark.subject}</td>
                      <td>{mark.examType}</td>
                      <td>
                        {mark.marksObtained} / {mark.maxMarks}
                      </td>
                      <td>{percentage.toFixed(1)}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default Marks;
