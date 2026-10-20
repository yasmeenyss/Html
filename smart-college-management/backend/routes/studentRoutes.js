const express = require("express");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Student = require("../models/Student");
const protect = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

// GET MY PROFILE - Student only
router.get("/me", protect, authorizeRoles("student"), async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id }).populate(
      "user",
      "name email role",
    );

    if (!student) {
      return res.status(404).json({ message: "Student profile not found." });
    }

    return res.status(200).json({ student });
  } catch (error) {
    console.error("GET MY PROFILE ERROR:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch student profile." });
  }
});

// CREATE STUDENT - Admin only
router.post("/", protect, authorizeRoles("admin"), async (req, res) => {
  let createdUser;

  try {
    const { name, email, password, rollNumber, department, semester, phone } =
      req.body;

    if (!name || !email || !password || !rollNumber) {
      return res.status(400).json({
        message: "Name, email, password, and roll number are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists." });
    }

    const existingStudent = await Student.findOne({ rollNumber });
    if (existingStudent) {
      return res.status(409).json({ message: "Roll number already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "student",
    });

    const student = await Student.create({
      user: user._id,
      rollNumber,
      department,
      semester,
      phone,
    });

    await student.populate("user", "name email");

    return res.status(201).json({
      message: "Student created successfully.",
      student: {
        _id: student._id,
        rollNumber: student.rollNumber,
        department: student.department,
        semester: student.semester,
        phone: student.phone,
        user: { _id: user._id, name: user.name, email: user.email },
      },
    });
  } catch (error) {
    if (createdUser) {
      await User.findByIdAndDelete(createdUser._id).catch(() => {});
    }

    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email or USN already exists.",
      });
    }

    console.error("CREATE STUDENT ERROR:", error);
    return res.status(500).json({ message: "Failed to create student." });
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

      return res.status(200).json({ count: students.length, students });
    } catch (error) {
      console.error("GET STUDENTS ERROR:", error);
      return res.status(500).json({ message: "Failed to fetch students." });
    }
  },
);

// GET SINGLE STUDENT - Admin and Faculty
router.get(
  "/:id",
  protect,
  authorizeRoles("admin", "faculty"),
  async (req, res) => {
    try {
      const student = await Student.findById(req.params.id).populate(
        "user",
        "name email",
      );

      if (!student) {
        return res.status(404).json({ message: "Student not found." });
      }

      return res.status(200).json({ student });
    } catch (error) {
      console.error("GET SINGLE STUDENT ERROR:", error);
      return res.status(500).json({ message: "Failed to fetch student." });
    }
  },
);

// UPDATE STUDENT - Admin only
router.put("/:id", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const { name, email, rollNumber, department, semester, phone } = req.body;

    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    if (email) {
      const existingUser = await User.findOne({
        email,
        _id: { $ne: student.user },
      });

      if (existingUser) {
        return res.status(409).json({ message: "Email already exists." });
      }

      userUpdates.email = normalizedEmail;
    }

    if (rollNumber) {
      const existingStudent = await Student.findOne({
        rollNumber,
        _id: { $ne: student._id },
      });

      if (existingStudent) {
        return res.status(409).json({ message: "Roll number already exists." });
      }
    }

    await User.findByIdAndUpdate(student.user, {
      ...(name !== undefined && { name }),
      ...(email !== undefined && { email }),
    });

    Object.assign(student, {
      ...(rollNumber !== undefined && { rollNumber }),
      ...(department !== undefined && { department }),
      ...(semester !== undefined && { semester }),
      ...(phone !== undefined && { phone }),
    });

    await student.save();

    const updatedStudent = await Student.findById(student._id).populate(
      "user",
      "name email",
    );

    return res.status(200).json({
      message: "Student updated successfully.",
      student: updatedStudent,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email or USN already exists.",
      });
    }

    console.error("UPDATE STUDENT ERROR:", error);
    return res.status(500).json({ message: "Failed to update student." });
  }
});

// RESET ONE STUDENT PASSWORD - Admin only
router.patch(
  "/:id/reset-password",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const { password } = req.body;

      if (typeof password !== "string" || password.length < 8) {
        return res.status(400).json({
          message: "Password must be at least 8 characters long.",
        });
      }

      const student = await Student.findById(req.params.id);

      if (!student) {
        return res.status(404).json({ message: "Student not found." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.findByIdAndUpdate(
        student.user,
        { password: hashedPassword },
        { new: true },
      );

      if (!user) {
        return res
          .status(404)
          .json({ message: "Student user account not found." });
      }

      return res.status(200).json({
        message: "Student password reset successfully.",
      });
    } catch (error) {
      console.error("RESET STUDENT PASSWORD ERROR:", error);
      return res
        .status(500)
        .json({ message: "Failed to reset student password." });
    }
  },
);

// DELETE STUDENT - Admin only
router.delete("/:id", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    await Student.findByIdAndDelete(student._id);
    await User.findByIdAndDelete(student.user);

    return res.status(200).json({ message: "Student deleted successfully." });
  } catch (error) {
    console.error("DELETE STUDENT ERROR:", error);
    return res.status(500).json({ message: "Failed to delete student." });
  }
});

module.exports = router;
