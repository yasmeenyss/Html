import { useState } from "react";
import "./App.css";
import StudentProfile from "./pages/StudentProfile";
import Attendance from "./pages/Attendance";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "null"),
  );
  const [error, setError] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [showAttendance, setShowAttendance] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
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
        setError(data.message || "Invalid email or password.");
        return;
      }

      if (!data.token) {
        setError("Login response mein token nahi mila.");
        return;
      }

      const actualRole = data.role || data.user?.role || data.profile?.role;

      const loggedInUser = {
        ...data,
        role: actualRole,
      };

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(loggedInUser));

      setUser(loggedInUser);
      setShowProfile(false);
      setShowAttendance(false);
    } catch (err) {
      console.error("Login error:", err);
      setError(
        "Backend se connection nahi ho raha. Backend server check karo.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setEmail("");
    setPassword("");
    setShowProfile(false);
    setShowAttendance(false);
    setError("");
  };

  if (user) {
    const dashboardRole = user.role;

    if (showProfile && dashboardRole === "student") {
      return (
        <div className="profile-screen">
          <button
            type="button"
            className="back-button"
            onClick={() => setShowProfile(false)}
          >
            ← Back to Dashboard
          </button>

          <StudentProfile />
        </div>
      );
    }

    if (showAttendance && dashboardRole === "student") {
      return (
        <div className="profile-screen">
          <button
            type="button"
            className="back-button"
            onClick={() => setShowAttendance(false)}
          >
            ← Back to Dashboard
          </button>

          <Attendance />
        </div>
      );
    }

    return (
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div className="brand">
            <div className="brand-icon">🎓</div>
            <div>
              <h1>Smart College</h1>
              <p>Management System</p>
            </div>
          </div>

          <div className="header-actions">
            <span className="role-badge">{dashboardRole || "User"}</span>

            <button
              type="button"
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </header>

        <main className="dashboard-content">
          <section className="welcome-section">
            <div>
              <p className="welcome-label">SMART COLLEGE PORTAL</p>

              <h2>
                {dashboardRole === "admin"
                  ? "Admin Dashboard"
                  : dashboardRole === "faculty"
                    ? "Welcome, Faculty!"
                    : dashboardRole === "student"
                      ? "Welcome, Student!"
                      : "Dashboard"}
              </h2>

              <p className="dashboard-description">
                Manage your college activities from one place.
              </p>
            </div>

            <div className="welcome-icon">✨</div>
          </section>

          <section className="dashboard-grid">
            {dashboardRole === "student" && (
              <>
                <button
                  type="button"
                  className="dashboard-card clickable-card"
                  onClick={() => setShowProfile(true)}
                >
                  <span className="card-icon">👤</span>
                  <h3>My Profile</h3>
                  <p>View your personal and academic information.</p>
                  <span className="card-link">View Profile →</span>
                </button>

                <button
                  type="button"
                  className="dashboard-card clickable-card"
                  onClick={() => setShowAttendance(true)}
                >
                  <span className="card-icon">📅</span>
                  <h3>My Attendance</h3>
                  <p>Check your attendance records and status.</p>
                  <span className="card-link">View Attendance →</span>
                </button>

                <div className="dashboard-card">
                  <span className="card-icon">📚</span>
                  <h3>Academic Overview</h3>
                  <p>View your semester and department information.</p>
                  <span className="card-link">Student services</span>
                </div>
              </>
            )}

            {dashboardRole === "faculty" && (
              <>
                <div className="dashboard-card">
                  <span className="card-icon">👨‍🏫</span>
                  <h3>Faculty Profile</h3>
                  <p>Manage your teaching and faculty information.</p>
                  <span className="card-link">Faculty services</span>
                </div>

                <div className="dashboard-card">
                  <span className="card-icon">📅</span>
                  <h3>Attendance</h3>
                  <p>Mark and review student attendance.</p>
                  <span className="card-link">Coming next</span>
                </div>

                <div className="dashboard-card">
                  <span className="card-icon">👥</span>
                  <h3>Students</h3>
                  <p>Access student information.</p>
                  <span className="card-link">Student services</span>
                </div>
              </>
            )}

            {dashboardRole === "admin" && (
              <>
                <div className="dashboard-card">
                  <span className="card-icon">👥</span>
                  <h3>Manage Students</h3>
                  <p>Access and manage student records.</p>
                  <span className="card-link">Coming next</span>
                </div>

                <div className="dashboard-card">
                  <span className="card-icon">👨‍🏫</span>
                  <h3>Manage Faculty</h3>
                  <p>View faculty information and records.</p>
                  <span className="card-link">Coming next</span>
                </div>

                <div className="dashboard-card">
                  <span className="card-icon">📊</span>
                  <h3>College Overview</h3>
                  <p>Monitor college activities and attendance.</p>
                  <span className="card-link">Admin services</span>
                </div>
              </>
            )}

            {!["admin", "faculty", "student"].includes(dashboardRole) && (
              <div className="dashboard-card">
                <span className="card-icon">⚠️</span>
                <h3>Role not recognized</h3>
                <p>
                  Your account role could not be identified. Please log out and
                  log in again.
                </p>
              </div>
            )}
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">🎓</div>

        <h1>Smart College</h1>
        <p className="login-subtitle">Management System</p>

        <h2>Welcome Back!</h2>
        <p className="login-description">
          Sign in to access your college portal.
        </p>

        <form onSubmit={handleLogin}>
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Signing in..." : "Login →"}
          </button>
        </form>

        <p className="login-footer">Smart College Management System</p>
      </div>
    </div>
  );
}

export default App;
