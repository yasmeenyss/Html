require("dotenv").config();
const applicationRoutes = require("./routes/applicationRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const aiPlacementRoutes = require("./routes/aiPlacementRoutes");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const placementRoutes = require("./routes/placementRoutes");
const authRoutes = require("./routes/authRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const markRoutes = require("./routes/markRoutes");
const noticeRoutes = require("./routes/noticeRoutes");
const studentRoutes = require("./routes/studentRoutes");
const facultyRoutes = require("./routes/facultyRoutes");
const timetableRoutes = require("./routes/timetableRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/applications", applicationRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/ai-placement", aiPlacementRoutes);
app.get("/", (req, res) => {
  res.send("Smart College Management System API is running");
});

app.use("/api/marks", markRoutes);
app.use("/api/placements", placementRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/faculty", facultyRoutes);

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in .env");
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing in .env");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup error:", error.message);
    process.exit(1);
  }
}

startServer();
