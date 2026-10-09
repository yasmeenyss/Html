
const express = require("express");
const mongoose = require("mongoose");

const Attendance = require("../models/Attendance");
const Student = require("../models/Student");
const Faculty = require("../models/Faculty");

const protect = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

// Mark attendance: faculty only
router.post(
  "/",
  protect,
  authorizeRoles("faculty"),
  async (req, res) => {
    try {
      const { studentId, subject, date, status } = req.body;

      if (
        !mongoose.isValidObjectId(studentId) ||
        typeof subject !== "string" ||
        !subject.trim() ||
        !date ||
        !["Present", "Absent", "Late"].includes(status)
      ) {
        return res.status(400).json({
          message: "Provide a valid studentId, subject, date and status",
        });
      }

      const attendanceDate = new Date(date);

      if (Number.isNaN(attendanceDate.getTime())) {
        return res.status(400).json({ message: "Invalid date" });
      }

      // Normalize to start of day for duplicate checks
      attendanceDate.setUTCHours(0, 0, 0, 0);

      const student = await Student.findById(studentId);

      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      const faculty = await Faculty.findOne({ user: req.user.id });

      if (!faculty) {
        return res.status(404).json({
          message: "Faculty profile not found for this account",
        });
      }

      const attendance = await Attendance.create({
        student: student._id,
        faculty: faculty._id,
        subject: subject.trim(),
        date: attendanceDate,
        status,
      });

      return res.status(201).json({
        message: "Attendance marked successfully",
        attendance,
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({
          message: "Attendance already exists for this student, subject and date",
        });
      }

      console.error("Mark attendance error:", error.message);
      return res.status(500).json({
        message: "Server error while marking attendance",
      });
    }
  }
);

// Get attendance records
router.get(
  "/",
  protect,
  authorizeRoles("admin", "faculty", "student"),
  async (req, res) => {
    try {
      let filter = {};

      if (req.user.role === "student") {
        const student = await Student.findOne({ user: req.user.id });

        if (!student) {
          return res.status(404).json({
            message: "Student profile not found for this account",
          });
        }

        filter.student = student._id;
      }

      // Optional filters for admin/faculty
      if (
        req.user.role !== "student" &&
        req.query.studentId &&
        mongoose.isValidObjectId(req.query.studentId)
      ) {
        filter.student = req.query.studentId;
      }

      if (req.query.subject) {
        filter.subject = req.query.subject;
      }

      const records = await Attendance.find(filter)
        .populate({
          path: "student",
          populate: { path: "user", select: "name email" },
        })
        .populate({
          path: "faculty",
          populate: { path: "user", select: "name email" },
        })
        .sort({ date: -1 });

      return res.status(200).json({
        count: records.length,
        attendance: records,
      });
    } catch (error) {
      console.error("Get attendance error:", error.message);
      return res.status(500).json({
        message: "Server error while fetching attendance",
      });
    }
  }
);

module.exports = router;