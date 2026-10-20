import { useEffect, useState } from "react";
import "./Timetable.css";

function Timetable({ user, onBack }) {
  const [timetable, setTimetable] = useState([]);
  const [day, setDay] = useState("Monday");
  const [subject, setSubject] = useState("");
  const [facultyName, setFacultyName] = useState("");
  const [className, setClassName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [room, setRoom] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const isAdmin = user?.role === "admin";
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const fetchTimetable = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/timetable", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not load timetable");
      }

      setTimetable(data);
    } catch (err) {
      setError(err.message || "Could not load timetable");
    }
  };

  useEffect(() => {
    let isActive = true;

    const loadTimetable = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/timetable", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Could not load timetable");
        }

        if (isActive) {
          setTimetable(data);
        }
      } catch (err) {
        if (isActive) {
          setError(err.message || "Could not load timetable");
        }
      }
    };

    loadTimetable();

    return () => {
      isActive = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/timetable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          day,
          subject,
          facultyName,
          className,
          startTime,
          endTime,
          room,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error
            ? `${data.message}: ${data.error}`
            : data.message || "Could not add timetable entry",
        );
      }

      setSuccess("Timetable entry added successfully!");

      setSubject("");
      setFacultyName("");
      setClassName("");
      setStartTime("");
      setEndTime("");
      setRoom("");

      await fetchTimetable();
    } catch (err) {
      setError(err.message || "Could not add timetable entry");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/timetable/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not delete entry");
      }

      setSuccess("Timetable entry deleted successfully!");
      await fetchTimetable();
    } catch (err) {
      setError(err.message || "Could not delete entry");
    }
  };

  return (
    <div className="timetable-page">
      <header className="timetable-header">
        <div>
          <h1>Timetable Management</h1>
          <p>Manage and view your weekly class schedule.</p>
        </div>

        <button type="button" className="timetable-back-btn" onClick={onBack}>
          Back to Dashboard
        </button>
      </header>

      {error && <p className="timetable-error">{error}</p>}
      {success && <p className="timetable-success">{success}</p>}

      {isAdmin && (
        <form className="timetable-form" onSubmit={handleSubmit}>
          <h2>Add Class Schedule</h2>

          <label>Day</label>
          <select value={day} onChange={(e) => setDay(e.target.value)} required>
            {days.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <label>Subject</label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Data Structures"
            required
          />

          <label>Faculty Name</label>
          <input
            value={facultyName}
            onChange={(e) => setFacultyName(e.target.value)}
            placeholder="e.g. Prof. Sharma"
            required
          />

          <label>Class Name</label>
          <input
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            placeholder="e.g. CSE-A"
            required
          />

          <div className="timetable-time-fields">
            <div>
              <label>Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>

            <div>
              <label>End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          <label>Room Number</label>
          <input
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            placeholder="e.g. Lab 2 or Room 101"
          />

          <button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add to Timetable"}
          </button>
        </form>
      )}

      <section className="timetable-list">
        <h2>Weekly Class Schedule</h2>

        {timetable.length === 0 ? (
          <p className="timetable-empty">No timetable entries available yet.</p>
        ) : (
          days.map((currentDay) => {
            const entries = timetable
              .filter((item) => item.day === currentDay)
              .sort((a, b) => a.startTime.localeCompare(b.startTime));

            if (entries.length === 0) return null;

            return (
              <div className="timetable-day" key={currentDay}>
                <h3>{currentDay}</h3>

                <div className="timetable-table-wrapper">
                  <table className="timetable-table">
                    <thead>
                      <tr>
                        <th>Time</th>
                        <th>Subject</th>
                        <th>Faculty</th>
                        <th>Class</th>
                        <th>Room</th>
                        {isAdmin && <th>Action</th>}
                      </tr>
                    </thead>

                    <tbody>
                      {entries.map((item) => (
                        <tr key={item._id}>
                          <td>
                            {item.startTime} – {item.endTime}
                          </td>
                          <td>{item.subject}</td>
                          <td>{item.faculty || item.facultyName || "—"}</td>
                          <td>{item.className}</td>
                          <td>{item.room || "—"}</td>

                          {isAdmin && (
                            <td>
                              <button
                                type="button"
                                className="timetable-delete-btn"
                                onClick={() => handleDelete(item._id)}
                              >
                                Delete
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
}

export default Timetable;
