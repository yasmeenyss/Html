import { useEffect, useState } from "react";
import "./NoticeBoard.css";

function NoticeBoard({ user, onBack }) {
  const [notices, setNotices] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("all");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isAdmin = user?.role === "admin";
  const token = localStorage.getItem("token");

  const fetchNotices = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/notices", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not load notices");
      }

      setNotices(data);
    } catch (err) {
      setError(err.message || "Could not load notices");
    }
  };

  useEffect(() => {
    const loadNotices = async () => {
      await fetchNotices();
    };

    loadNotices();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:5000/api/notices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, message, audience }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not publish notice");
      }

      setTitle("");
      setMessage("");
      setAudience("all");
      setSuccess("Notice published successfully!");
      await fetchNotices();
    } catch (err) {
      setError(err.message || "Could not publish notice");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notice?")) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      const response = await fetch(`http://localhost:5000/api/notices/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not delete notice");
      }

      setSuccess("Notice deleted successfully!");
      await fetchNotices();
    } catch (err) {
      setError(err.message || "Could not delete notice");
    }
  };

  return (
    <div className="notice-page">
      <div className="notice-header">
        <div>
          <h1>Notice Board</h1>
          <p>Stay updated with the latest college announcements.</p>
        </div>
        <button className="notice-back-btn" onClick={onBack}>
          Back to Dashboard
        </button>
      </div>

      {error && <p className="notice-error">{error}</p>}
      {success && <p className="notice-success">{success}</p>}

      {isAdmin && (
        <form className="notice-form" onSubmit={handleSubmit}>
          <h2>Publish a Notice</h2>

          <input
            type="text"
            placeholder="Notice title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            placeholder="Write your announcement here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="4"
            required
          />

          <select
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
          >
            <option value="all">Everyone</option>
            <option value="student">Students only</option>
            <option value="faculty">Faculty only</option>
          </select>

          <button type="submit">Publish Notice</button>
        </form>
      )}

      <div className="notice-list">
        <h2>Latest Announcements</h2>

        {notices.length === 0 ? (
          <p className="notice-empty">No notices available yet.</p>
        ) : (
          notices.map((notice) => (
            <article className="notice-card" key={notice._id}>
              <div className="notice-card-top">
                <h3>{notice.title}</h3>
                {isAdmin && (
                  <button
                    className="notice-delete-btn"
                    onClick={() => handleDelete(notice._id)}
                  >
                    Delete
                  </button>
                )}
              </div>

              <p className="notice-message">{notice.message}</p>

              <div className="notice-meta">
                <span>
                  For:{" "}
                  {notice.audience === "all"
                    ? "Everyone"
                    : notice.audience === "student"
                      ? "Students"
                      : "Faculty"}
                </span>
                <span>
                  {notice.createdAt
                    ? new Date(notice.createdAt).toLocaleDateString()
                    : ""}
                </span>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

export default NoticeBoard;
