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
    const student = await Student.findOne({
      user: req.user.id,
    }).populate("user", "name email");

    if (!student) {
      return res.status(404).json({
        message: "Student profile not found for this account",
      });
    }

    return res.status(200).json({ student });
  } catch (error) {
    console.error("GET MY PROFILE ERROR:", error);
    return res.status(500).json({ message: "Failed to fetch profile" });
  }
});

// CREATE STUDENT - Admin only
router.post("/", protect, authorizeRoles("admin"), async (req, res) => {
  let createdUser;

  try {
    const {
      name,
      email,
      password,
      rollNumber,
      usn,
      department,
      semester,
      phone,
    } = req.body;

    const studentUSN = (rollNumber || usn || "").trim();

    if (
      !name?.trim() ||
      !email?.trim() ||
      !password ||
      !studentUSN ||
      !department?.trim() ||
      semester === undefined ||
      semester === ""
    ) {
      return res.status(400).json({
        message:
          "Name, email, password, USN, department and semester are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long.",
      });
    }

    const semesterNumber = Number(semester);

    if (
      !Number.isInteger(semesterNumber) ||
      semesterNumber < 1 ||
      semesterNumber > 12
    ) {
      return res.status(400).json({
        message: "Semester must be a number between 1 and 12.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });
    const existingStudent = await Student.findOne({
      rollNumber: studentUSN,
    });

    if (existingUser) {
      return res.status(409).json({ message: "Email already exists." });
    }

    if (existingStudent) {
      return res.status(409).json({ message: "USN already exists." });
    }

    createdUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: await bcrypt.hash(password, 10),
      role: "student",
    });

    const student = await Student.create({
      user: createdUser._id,
      rollNumber: studentUSN,
      department: department.trim(),
      semester: semesterNumber,
      phone: phone?.trim() || "",
    });

    await student.populate("user", "name email");

    return res.status(201).json({
      message: "Student created successfully.",
      student,
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
    return res.status(500).json({
      message: "Failed to create student.",
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
      console.error("GET STUDENTS ERROR:", error);
      return res.status(500).json({
        message: "Failed to fetch students.",
      });
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
      return res.status(400).json({ message: "Invalid student ID." });
    }
  },
);

// UPDATE STUDENT - Admin only
router.put("/:id", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const { name, email, rollNumber, usn, department, semester, phone } =
      req.body;

    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    const newUSN = (rollNumber || usn || student.rollNumber).trim();
    const semesterNumber =
      semester === undefined || semester === ""
        ? student.semester
        : Number(semester);

    if (
      !Number.isInteger(semesterNumber) ||
      semesterNumber < 1 ||
      semesterNumber > 12
    ) {
      return res.status(400).json({
        message: "Semester must be a number between 1 and 12.",
      });
    }

    const duplicateUSN = await Student.findOne({
      rollNumber: newUSN,
      _id: { $ne: student._id },
    });

    if (duplicateUSN) {
      return res.status(409).json({ message: "USN already exists." });
    }

    const userUpdates = {};

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({ message: "Name cannot be empty." });
      }
      userUpdates.name = name.trim();
    }

    if (email !== undefined) {
      if (!email.trim()) {
        return res.status(400).json({ message: "Email cannot be empty." });
      }

      const normalizedEmail = email.trim().toLowerCase();
      const duplicateEmail = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: student.user },
      });

      if (duplicateEmail) {
        return res.status(409).json({ message: "Email already exists." });
      }

      userUpdates.email = normalizedEmail;
    }

    if (Object.keys(userUpdates).length > 0) {
      await User.findByIdAndUpdate(student.user, userUpdates, {
        runValidators: true,
      });
    }

    student.rollNumber = newUSN;

    if (department !== undefined) {
      if (!department.trim()) {
        return res.status(400).json({
          message: "Department cannot be empty.",
        });
      }
      student.department = department.trim();
    }

    student.semester = semesterNumber;

    if (phone !== undefined) {
      student.phone = phone.trim();
    }

    await student.save();
    await student.populate("user", "name email");

    return res.status(200).json({
      message: "Student updated successfully.",
      student,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email or USN already exists.",
      });
    }

    console.error("UPDATE STUDENT ERROR:", error);
    return res.status(500).json({
      message: "Failed to update student.",
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
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    await Student.findByIdAndDelete(student._id);
    await User.findByIdAndDelete(student.user);

    return res.status(200).json({
      message: "Student and associated account deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE STUDENT ERROR:", error);

    return res.status(500).json({
      message: "Failed to delete student.",
    });
  }
});

module.exports = router;
