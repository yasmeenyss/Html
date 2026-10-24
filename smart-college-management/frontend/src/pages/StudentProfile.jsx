import { useEffect, useState } from "react";
import "./StudentProfile.css";

function StudentProfile() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please log in again.");
          return;
        }

        const response = await fetch(
          "https://smart-college-management-api-1870.onrender.com/api/students/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load student profile.");
        }

        setStudent(data.student);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentProfile();
  }, []);

  if (loading) {
    return <div className="student-profile">Loading profile...</div>;
  }

  if (error) {
    return (
      <div className="student-profile">
        <h2>Unable to Load Profile</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!student) {
    return <div className="student-profile">Student profile not found.</div>;
  }

  const user = student.user || {};

  return (
    <div className="student-profile">
      <div className="profile-banner">
        <div className="profile-avatar">🎓</div>
        <h2>{user.name || "Student"}</h2>
        <p>{user.email || "Email not available"}</p>
        <span className="profile-role">STUDENT</span>
      </div>

      <div className="profile-details">
        <h3>Personal & Academic Details</h3>

        <div className="profile-info-grid">
          <div className="profile-info-item">
            <span>Roll Number</span>
            <strong>{student.rollNumber || "Not added"}</strong>
          </div>

          <div className="profile-info-item">
            <span>Department</span>
            <strong>{student.department || "Not added"}</strong>
          </div>

          <div className="profile-info-item">
            <span>Semester</span>
            <strong>{student.semester ?? "Not added"}</strong>
          </div>

          <div className="profile-info-item">
            <span>Phone</span>
            <strong>{student.phone || "Not added"}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;
