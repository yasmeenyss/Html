import { useEffect, useState } from "react";
import "./FacultyDashboard.css";

const API_URL =
  "https://smart-college-management-api-1870.onrender.com/api/faculty";

function FacultyDashboard() {
  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchFacultyDetails() {
      try {
        const token = localStorage.getItem("token");
        const savedUser = JSON.parse(localStorage.getItem("user") || "{}");

        const loggedInEmail = (
          savedUser.user?.email ||
          savedUser.email ||
          ""
        ).toLowerCase();

        const response = await fetch(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load faculty details.");
        }

        const records = Array.isArray(data) ? data : data.faculty || [];

        const currentFaculty = records.find(
          (item) => item.user?.email?.toLowerCase() === loggedInEmail,
        );

        if (!currentFaculty) {
          throw new Error("Faculty profile not found.");
        }

        setFaculty(currentFaculty);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    fetchFacultyDetails();
  }, []);

  if (loading) {
    return <div className="faculty-dashboard">Loading details...</div>;
  }

  if (error) {
    return <div className="faculty-dashboard faculty-error">{error}</div>;
  }

  return (
    <div className="faculty-dashboard">
      <h1>My Subjects</h1>
      <p className="faculty-dashboard-subtitle">
        Your faculty and academic details
      </p>

      <div className="faculty-profile-card">
        <div className="faculty-avatar">👩‍🏫</div>

        <h2>{faculty.user?.name || "Faculty"}</h2>
        <p>{faculty.user?.email}</p>

        <div className="faculty-detail-grid">
          <div>
            <span>Employee ID</span>
            <strong>{faculty.employeeId}</strong>
          </div>

          <div>
            <span>Department</span>
            <strong>{faculty.department}</strong>
          </div>

          <div>
            <span>Assigned Subject</span>
            <strong>{faculty.subject}</strong>
          </div>

          <div>
            <span>Phone</span>
            <strong>{faculty.phone || "Not provided"}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FacultyDashboard;
