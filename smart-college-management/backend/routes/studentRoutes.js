const express = require("express");
const Student = require("../models/Student");
const protect = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

// GET MY PROFILE - Student only
router.get("/me", protect, authorizeRoles("student"), async (req, res) => {
  try {
    const student = await Student.findOne({
      user: req.user.id,
    }).populate("user", "name email");

    if (!student) {
      return res.status(404).json({
        message: "Student profile not found for this account",
      });
    }

    return res.status(200).json({
      message: "Student profile fetched successfully",
      student,
    });
  } catch (error) {
    console.error("GET MY STUDENT PROFILE ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch student profile",
      error: error.message,
    });
  }
});

// CREATE STUDENT - Admin and Faculty
router.post(
  "/",
  protect,
  authorizeRoles("admin", "faculty"),
  async (req, res) => {
    try {
      const student = await Student.create(req.body);

      return res.status(201).json({
        message: "Student created successfully",
        student,
      });
    } catch (error) {
      console.error("CREATE STUDENT ERROR:", error);

      return res.status(500).json({
        message: "Failed to create student",
        error: error.message,
      });
    }
  },
);

// GET ALL STUDENTS - Admin and Faculty
router.get(
  "/",
  protect,
  authorizeRoles("admin", "faculty"),
  async (req, res) => {
    try {
      const students = await Student.find()
        .populate("user", "name email")
        .sort({ createdAt: -1 });

      return res.status(200).json({
        count: students.length,
        students,
      });
    } catch (error) {
      console.error("GET ALL STUDENTS ERROR:", error);

      return res.status(500).json({
        message: "Failed to fetch students",
        error: error.message,
      });
    }
  },
);

// GET SINGLE STUDENT
router.get("/:id", protect, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate(
      "user",
      "name email",
    );

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    return res.status(200).json({
      message: "Student fetched successfully",
      student,
    });
  } catch (error) {
    console.error("GET SINGLE STUDENT ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch student",
      error: error.message,
    });
  }
});

// UPDATE STUDENT - Admin and Faculty
router.put(
  "/:id",
  protect,
  authorizeRoles("admin", "faculty"),
  async (req, res) => {
    try {
      const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      }).populate("user", "name email");

      if (!student) {
        return res.status(404).json({
          message: "Student not found",
        });
      }

      return res.status(200).json({
        message: "Student updated successfully",
        student,
      });
    } catch (error) {
      console.error("UPDATE STUDENT ERROR:", error);

      return res.status(500).json({
        message: "Failed to update student",
        error: error.message,
      });
    }
  },
);

// DELETE STUDENT - Admin only
router.delete("/:id", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    return res.status(200).json({
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.error("DELETE STUDENT ERROR:", error);

    return res.status(500).json({
      message: "Failed to delete student",
      error: error.message,
    });
  }
});

module.exports = router;
