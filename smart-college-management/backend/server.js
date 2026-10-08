
const express = require("express");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const facultyRoutes = require("./routes/facultyRoutes");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// =====================================
// CONNECT DATABASE
// =====================================
connectDB();

// =====================================
// MIDDLEWARE
// =====================================
app.use(express.json());

// =====================================
// AUTH ROUTES
// =====================================
app.use("/api/auth", authRoutes);

// =====================================
// STUDENT ROUTES
// =====================================
app.use("/api/students", studentRoutes);

// =====================================
// FACULTY ROUTES
// =====================================
app.use("/api/faculty", facultyRoutes);

// =====================================
// HOME / TEST ROUTE
// =====================================
app.get("/", (req, res) => {
  res.send("Smart College Management System API is running");
});

// =====================================
// START SERVER
// =====================================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});