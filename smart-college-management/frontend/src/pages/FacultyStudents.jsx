import { useEffect, useState } from "react";

function FacultyStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStudents() {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:5000/api/students", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Students load nahi ho paaye.");
        }

        const records = Array.isArray(data) ? data : data.students || [];

        setStudents(records);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    fetchStudents();
  }, []);

  return (
    <div className="manage-faculty">
      <h1>Students</h1>
      <p>View student academic information.</p>

      {loading && <p>Loading students...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && students.length === 0 && (
        <p>No student records found.</p>
      )}

      {!loading && students.length > 0 && (
        <div className="faculty-table-wrapper">
          <table className="faculty-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>USN / Roll Number</th>
                <th>Department</th>
                <th>Semester</th>
                <th>Email</th>
              </tr>
            </thead>

            <tbody>
              {students.map((student) => (
                <tr key={student._id}>
                  <td>{student.user?.name || student.name || "—"}</td>

                  <td>{student.rollNumber || student.usn || "—"}</td>

                  <td>{student.department || "—"}</td>
                  <td>{student.semester ?? "—"}</td>

                  <td>{student.user?.email || student.email || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default FacultyStudents;
