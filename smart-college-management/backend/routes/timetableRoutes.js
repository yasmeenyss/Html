
const express = require("express");
const router = express.Router();

const Timetable = require("../models/Timetable");
const authMiddleware = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// GET: Fetch timetable entries
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { className, day } = req.query;
    const filter = {};

    if (className) {
      filter.className = className;
    }

    if (day) {
      if (!DAYS.includes(day)) {
        return res.status(400).json({
          message: "Invalid day",
        });
      }

      filter.day = day;
    }

    const timetable = await Timetable.find(filter).lean();

    timetable.sort((a, b) => {
      const dayDifference =
        DAYS.indexOf(a.day) - DAYS.indexOf(b.day);

      if (dayDifference !== 0) {
        return dayDifference;
      }

      return a.startTime.localeCompare(b.startTime);
    });

    return res.status(200).json(timetable);
  } catch (error) {
    console.error("Fetch timetable error:", error);

    return res.status(500).json({
      message: "Failed to fetch timetable",
      error: error.message,
    });
  }
});

// POST: Add timetable entry (Admin only)
router.post(
  "/",
  authMiddleware,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const {
        day,
        subject,
        faculty,
        facultyName,
        className,
        startTime,
        endTime,
        room,
      } = req.body;

      // Accept either faculty or facultyName from frontend
      const facultyValue =
        typeof faculty === "string" && faculty.trim()
          ? faculty.trim()
          : typeof facultyName === "string"
            ? facultyName.trim()
            : "";

      // Validate required fields
      if (
        typeof day !== "string" ||
        typeof subject !== "string" ||
        !subject.trim() ||
        !facultyValue ||
        typeof className !== "string" ||
        !className.trim() ||
        !startTime ||
        !endTime
      ) {
        return res.status(400).json({
          message: "Please fill all required fields",
        });
      }

      // Validate day
      if (!DAYS.includes(day)) {
        return res.status(400).json({
          message: "Invalid day selected",
        });
      }

      // Validate time format
      const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;

      if (
        !timePattern.test(startTime) ||
        !timePattern.test(endTime)
      ) {
        return res.status(400).json({
          message: "Please enter valid start and end times",
        });
      }

      // End time must be later than start time
      if (startTime >= endTime) {
        return res.status(400).json({
          message: "End time must be later than start time",
        });
      }

      // Create timetable entry
      const entry = await Timetable.create({
        day,
        subject: subject.trim(),
        faculty: facultyValue,
        className: className.trim(),
        startTime,
        endTime,
        room: typeof room === "string" ? room.trim() : "",
      });

      return res.status(201).json({
        message: "Timetable entry added successfully",
        entry,
      });
    } catch (error) {
      console.error("Add timetable entry error:", error);

      return res.status(500).json({
        message: "Failed to add timetable entry",
        error: error.message,
      });
    }
  }
);

// DELETE: Remove timetable entry (Admin only)
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!/^[a-f\d]{24}$/i.test(id)) {
        return res.status(400).json({
          message: "Invalid timetable entry ID",
        });
      }

      const entry = await Timetable.findByIdAndDelete(id);

      if (!entry) {
        return res.status(404).json({
          message: "Timetable entry not found",
        });
      }

      return res.status(200).json({
        message: "Timetable entry deleted successfully",
      });
    } catch (error) {
      console.error("Delete timetable entry error:", error);

      return res.status(500).json({
        message: "Failed to delete timetable entry",
        error: error.message,
      });
    }
  }
);

module.exports = router;
