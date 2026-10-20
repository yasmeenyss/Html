const express = require("express");
const mongoose = require("mongoose");

const Mark = require("../models/Mark");
const Student = require("../models/Student");
const Faculty = require("../models/Faculty");

const protect = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

// Add or update marks: Admin and Faculty
router.post(
  "/",
  protect,
  authorizeRoles("admin", "faculty"),
  async (req, res) => {
    try {
      const { studentId, subject, examType, maxMarks, marksObtained } =
        req.body;

      if (
        !mongoose.isValidObjectId(studentId) ||
        typeof subject !== "string" ||
        !subject.trim() ||
        !["Internal", "Midterm", "Final"].includes(examType) ||
        !Number.isFinite(maxMarks) ||
        !Number.isFinite(marksObtained) ||
        maxMarks < 1 ||
        marksObtained < 0 ||
        marksObtained > maxMarks
      ) {
        return res.status(400).json({
          message: "Please provide valid student, subject, exam type and marks",
        });
      }

      const student = await Student.findById(studentId);

      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      // Faculty can enter marks only for their assigned subject.
      // Admin can enter marks for any subject.
      if (req.user.role === "faculty") {
        const faculty = await Faculty.findOne({ user: req.user.id });

        if (!faculty) {
          return res.status(404).json({
            message: "Faculty profile not found for this account",
          });
        }

        if (
          !faculty.subject ||
          faculty.subject.trim().toLowerCase() !== subject.trim().toLowerCase()
        ) {
          return res.status(403).json({
            message: "You can enter marks only for your assigned subject",
          });
        }
      }

      const mark = await Mark.findOneAndUpdate(
        {
          student: student._id,
          subject: subject.trim(),
          examType,
        },
        {
          $set: {
            maxMarks,
            marksObtained,
            enteredBy: req.user.id,
          },
        },
        {
          new: true,
          upsert: true,
          runValidators: true,
          setDefaultsOnInsert: true,
        },
      );

      return res.status(200).json({
        message: "Marks saved successfully",
        mark,
      });
    } catch (error) {
      console.error("Save marks error:", error.message);
      return res.status(500).json({
        message: "Server error while saving marks",
      });
    }
  },
);

// Get marks: Admin, Faculty and Student
router.get(
  "/",
  protect,
  authorizeRoles("admin", "faculty", "student"),
  async (req, res) => {
    try {
      const filter = {};

      if (req.user.role === "student") {
        const student = await Student.findOne({ user: req.user.id });

        if (!student) {
          return res.status(404).json({
            message: "Student profile not found for this account",
          });
        }

        filter.student = student._id;
      }

      if (req.user.role !== "student" && req.query.studentId) {
        if (!mongoose.isValidObjectId(req.query.studentId)) {
          return res.status(400).json({ message: "Invalid studentId" });
        }

        filter.student = req.query.studentId;
      }

      if (req.query.subject) {
        filter.subject = req.query.subject;
      }

      if (req.query.examType) {
        if (!["Internal", "Midterm", "Final"].includes(req.query.examType)) {
          return res.status(400).json({ message: "Invalid exam type" });
        }

        filter.examType = req.query.examType;
      }

      const records = await Mark.find(filter)
        .populate({
          path: "student",
          populate: { path: "user", select: "name email" },
        })
        .populate("enteredBy", "name email")
        .sort({ subject: 1, examType: 1 });

      return res.status(200).json({
        count: records.length,
        marks: records,
      });
    } catch (error) {
      console.error("Get marks error:", error.message);
      return res.status(500).json({
        message: "Server error while fetching marks",
      });
    }
  },
);

module.exports = router;
