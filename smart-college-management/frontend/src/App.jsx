
import { useState } from "react";

import "./App.css";
import MyApplications from "./pages/MyApplications";
import ReviewApplications from "./pages/ReviewApplications";
import ManagePlacements from "./pages/ManagePlacements";
import Marks from "./pages/Marks";
import StudentProfile from "./pages/StudentProfile";
import Attendance from "./pages/Attendance";
import ManageStudents from "./pages/ManageStudents";
import ManageFaculty from "./pages/ManageFaculty";
import FacultyDashboard from "./pages/FacultyDashboard";
import FacultyStudents from "./pages/FacultyStudents";
import NoticeBoard from "./pages/NoticeBoard";
import Timetable from "./pages/Timetable";
import Placements from "./pages/Placements";

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [showProfile, setShowProfile] = useState(false);
  const [showAttendance, setShowAttendance] = useState(false);
  const [showFacultyAttendance, setShowFacultyAttendance] = useState(false);
  const [showManageStudents, setShowManageStudents] = useState(false);
  const [showManageFaculty, setShowManageFaculty] = useState(false);
  const [showManagePlacements, setShowManagePlacements] = useState(false);
  const [showReviewApplications, setShowReviewApplications] = useState(false);
  const [showMyApplications, setShowMyApplications] = useState(false);
  const [showFacultyProfile, setShowFacultyProfile] = useState(false);
  const [showFacultyStudents, setShowFacultyStudents] = useState(false);
  const [showMarks, setShowMarks] = useState(false);
  const [showNoticeBoard, setShowNoticeBoard] = useState(false);
  const [showTimetable, setShowTimetable] = useState(false);
  const [showPlacements, setShowPlacements] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dashboardRole = user?.role;

  function backToDashboard() {
    setShowProfile(false);
    setShowAttendance(false);
    setShowFacultyAttendance(false);
    setShowManageStudents(false);
    setShowManageFaculty(false);
    setShowManagePlacements(false);
    setShowReviewApplications(false);
    setShowMyApplications(false);
    setShowFacultyProfile(false);
    setShowFacultyStudents(false);
    setShowMarks(false);
    setShowNoticeBoard(false);
    setShowTimetable(false);
    setShowPlacements(false);
  }

  async function handleLogin(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      backToDashboard();
      setUser(data.user);
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.message || "Unable to login. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");

    setUser(null);
    setEmail("");
    setPassword("");
    setError("");

    backToDashboard();
  }

  // Notice Board
  if (user && showNoticeBoard) {
    return <NoticeBoard user={user} onBack={backToDashboard} />;
  }

  // Timetable
  if (user && showTimetable) {
    return <Timetable user={user} onBack={backToDashboard} />;
  }

  // Student: Placements
  if (user && showPlacements && dashboardRole === "student") {
    return (
      <div className="profile-screen">
        <button className="back-button" onClick={backToDashboard}>
          ← Back to Dashboard
        </button>
        <Placements />
      </div>
    );
  }

  // Student: My Applications
  if (user && showMyApplications && dashboardRole === "student") {
    return (
      <div className="profile-screen">
        <button className="back-button" onClick={backToDashboard}>
          ← Back to Dashboard
        </button>
        <MyApplications />
      </div>
    );
  }

  // Admin: Review Applications
  if (user && showReviewApplications && dashboardRole === "admin") {
    return (
      <div className="profile-screen">
        <button className="back-button" onClick={backToDashboard}>
          ← Back to Dashboard
        </button>
        <ReviewApplications />
      </div>
    );
  }

  // Admin: Manage Placements
  if (user && showManagePlacements && dashboardRole === "admin") {
    return (
      <div className="profile-screen">
        <button className="back-button" onClick={backToDashboard}>
          ← Back to Dashboard
        </button>
        <ManagePlacements />
      </div>
    );
  }

  // Marks and Results
  if (
    user &&
    showMarks &&
    ["admin", "faculty", "student"].includes(dashboardRole)
  ) {
    return (
      <div className="profile-screen">
        <button className="back-button" onClick={backToDashboard}>
          ← Back to Dashboard
        </button>
        <Marks />
      </div>
    );
  }

  // Student Profile
  if (user && showProfile && dashboardRole === "student") {
    return (
      <div className="profile-screen">
        <button className="back-button" onClick={backToDashboard}>
          ← Back to Dashboard
        </button>
        <StudentProfile />
      </div>
    );
  }

  // Student Attendance
  if (user && showAttendance && dashboardRole === "student") {
    return (
      <div className="profile-screen">
        <button className="back-button" onClick={backToDashboard}>
          ← Back to Dashboard
        </button>
        <Attendance />
      </div>
    );
  }

  // Faculty Attendance
  if (user && showFacultyAttendance && dashboardRole === "faculty") {
    return (
      <div className="profile-screen">
        <button className="back-button" onClick={backToDashboard}>
          ← Back to Dashboard
        </button>
        <Attendance />
      </div>
    );
  }

  // Admin: Manage Students
  if (user && showManageStudents && dashboardRole === "admin") {
    return (
      <div className="profile-screen">
        <button className="back-button" onClick={backToDashboard}>
          ← Back to Dashboard
        </button>
        <ManageStudents />
      </div>
    );
  }

  // Admin: Manage Faculty
  if (user && showManageFaculty && dashboardRole === "admin") {
    return (
      <div className="profile-screen">
        <button className="back-button" onClick={backToDashboard}>
          ← Back to Dashboard
        </button>
        <ManageFaculty />
      </div>
    );
  }

  // Faculty: My Subjects
  if (user && showFacultyProfile && dashboardRole === "faculty") {
    return (
      <div className="profile-screen">
        <button className="back-button" onClick={backToDashboard}>
          ← Back to Dashboard
        </button>
        <FacultyDashboard />
      </div>
    );
  }

  // Faculty: Students
  if (user && showFacultyStudents && dashboardRole === "faculty") {
    return (
      <div className="profile-screen">
        <button className="back-button" onClick={backToDashboard}>
          ← Back to Dashboard
        </button>
        <FacultyStudents />
      </div>
    );
  }

  // Login Page
  if (!user) {
    return (
      <div className="login-container">
        <form className="login-form" onSubmit={handleLogin}>
          <h1>Smart College Management</h1>
          <p>Login to your account</p>

          {error && <p className="login-error">{error}</p>}

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    );
  }

  // Student Dashboard
  if (dashboardRole === "student") {
    return (
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div>
            <h1>Student Dashboard</h1>
            <p>Welcome, {user.name}</p>
          </div>

          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </header>

        <div className="dashboard-grid">
          <button
            className="dashboard-card clickable-card"
            onClick={() => setShowProfile(true)}
          >
            <span className="card-icon">👤</span>
            <h3>My Profile</h3>
            <p>View your personal and academic details.</p>
            <span className="card-link">View Profile →</span>
          </button>

          <button
            className="dashboard-card clickable-card"
            onClick={() => setShowAttendance(true)}
          >
            <span className="card-icon">📊</span>
            <h3>Attendance</h3>
            <p>View your attendance information.</p>
            <span className="card-link">View Attendance →</span>
          </button>

          <button
            className="dashboard-card clickable-card"
            onClick={() => setShowMarks(true)}
          >
            <span className="card-icon">📈</span>
            <h3>Marks &amp; Results</h3>
            <p>View your examination results and marks.</p>
            <span className="card-link">View Results →</span>
          </button>

          <button
            className="dashboard-card clickable-card"
            onClick={() => setShowNoticeBoard(true)}
          >
            <span className="card-icon">📢</span>
            <h3>Notice Board</h3>
            <p>Read the latest college announcements.</p>
            <span className="card-link">View Notices →</span>
          </button>

          <button
            className="dashboard-card clickable-card"
            onClick={() => setShowTimetable(true)}
          >
            <span className="card-icon">🗓️</span>
            <h3>Timetable</h3>
            <p>View your weekly class schedule.</p>
            <span className="card-link">View Timetable →</span>
          </button>

          <button
            className="dashboard-card clickable-card"
            onClick={() => setShowPlacements(true)}
          >
            <span className="card-icon">💼</span>
            <h3>Placements</h3>
            <p>Explore job and internship opportunities.</p>
            <span className="card-link">View Placements →</span>
          </button>

          <button
            className="dashboard-card clickable-card"
            onClick={() => setShowMyApplications(true)}
          >
            <span className="card-icon">📋</span>
            <h3>My Applications</h3>
            <p>Track your job applications and selection status.</p>
            <span className="card-link">Track Applications →</span>
          </button>
        </div>
      </div>
    );
  }

  // Faculty Dashboard
  if (dashboardRole === "faculty") {
    return (
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div>
            <h1>Faculty Dashboard</h1>
            <p>Welcome, {user.name}</p>
          </div>

          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </header>

        <div className="dashboard-grid">
          <button
            className="dashboard-card clickable-card"
            onClick={() => setShowFacultyAttendance(true)}
          >
            <span className="card-icon">📊</span>
            <h3>Attendance</h3>
            <p>Access attendance information.</p>
            <span className="card-link">Open Attendance →</span>
          </button>

          <button
            className="dashboard-card clickable-card"
            onClick={() => setShowFacultyProfile(true)}
          >
            <span className="card-icon">📚</span>
            <h3>My Subjects</h3>
            <p>View your faculty and subject details.</p>
            <span className="card-link">View Subjects →</span>
          </button>

          <button
            className="dashboard-card clickable-card"
            onClick={() => setShowFacultyStudents(true)}
          >
            <span className="card-icon">👨‍🎓</span>
            <h3>Students</h3>
            <p>View student academic information.</p>
            <span className="card-link">View Students →</span>
          </button>

          <button
            className="dashboard-card clickable-card"
            onClick={() => setShowMarks(true)}
          >
            <span className="card-icon">📝</span>
            <h3>Marks &amp; Results</h3>
            <p>Enter marks and view examination results.</p>
            <span className="card-link">Manage Marks →</span>
          </button>

          <button
            className="dashboard-card clickable-card"
            onClick={() => setShowNoticeBoard(true)}
          >
            <span className="card-icon">📢</span>
            <h3>Notice Board</h3>
            <p>Read the latest college announcements.</p>
            <span className="card-link">View Notices →</span>
          </button>

          <button
            className="dashboard-card clickable-card"
            onClick={() => setShowTimetable(true)}
          >
            <span className="card-icon">🗓️</span>
            <h3>Timetable</h3>
            <p>View the weekly class schedule.</p>
            <span className="card-link">View Timetable →</span>
          </button>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  if (dashboardRole === "admin") {
    return (
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Welcome, {user.name}</p>
          </div>

          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </header>

        <div className="dashboard-grid">
          <button
            className="dashboard-card clickable-card"
            onClick={() => setShowManageStudents(true)}
          >
            <span className="card-icon">👨‍🎓</span>
            <h3>Manage Students</h3>
            <p>Add, view, edit and delete student records.</p>
            <span className="card-link">Manage Students →</span>
          </button>

          <button
            className="dashboard-card clickable-card"
            onClick={() => setShowManageFaculty(true)}
          >
            <span className="card-icon">👩‍🏫</span>
            <h3>Manage Faculty</h3>
            <p>Add, view, edit and delete faculty records.</p>
            <span className="card-link">Manage Faculty →</span>
          </button>

          <button
            className="dashboard-card clickable-card"
            onClick={() => setShowMarks(true)}
          >
            <span className="card-icon">📈</span>
            <h3>Marks &amp; Results</h3>
            <p>View examination marks and results.</p>
            <span className="card-link">View Marks →</span>
          </button>

          <button
            className="dashboard-card clickable-card"
            onClick={() => setShowNoticeBoard(true)}
          >
            <span className="card-icon">📢</span>
            <h3>Notice Board</h3>
            <p>Publish and manage college announcements.</p>
            <span className="card-link">Manage Notices →</span>
          </button>

          <button
            className="dashboard-card clickable-card"
            onClick={() => setShowTimetable(true)}
          >
            <span className="card-icon">🗓️</span>
            <h3>Timetable Management</h3>
            <p>Create and manage the weekly class schedule.</p>
            <span className="card-link">Manage Timetable →</span>
          </button>

          <button
            className="dashboard-card clickable-card"
            onClick={() => setShowManagePlacements(true)}
          >
            <span className="card-icon">💼</span>
            <h3>Manage Placements</h3>
            <p>Add and manage job and internship opportunities.</p>
            <span className="card-link">Manage Placements →</span>
          </button>

          <button
            className="dashboard-card clickable-card"
            onClick={() => setShowReviewApplications(true)}
          >
            <span className="card-icon">📋</span>
            <h3>Review Applications</h3>
            <p>
              View student applications, resumes and update application
              status.
            </p>
            <span className="card-link">Review Applications →</span>
          </button>
        </div>
      </div>
    );
  }

  // Unknown Role
  return (
    <div className="dashboard-container">
      <h1>Unknown user role</h1>
      <p>Please log out and sign in again with the correct account.</p>

      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default App;
