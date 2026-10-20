const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Faculty = require("../models/Faculty");
const protect = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

// GET: List all faculty
router.get("/", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const faculty = await Faculty.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ count: faculty.length, faculty });
  } catch (error) {
    console.error("Fetch faculty error:", error.message);
    res.status(500).json({ message: "Failed to fetch faculty" });
  }
});

// GET: Current logged-in faculty profile
router.get("/me", protect, authorizeRoles("faculty"), async (req, res) => {
  try {
    const faculty = await Faculty.findOne({
      user: req.user.id,
    }).populate("user", "name email");

    if (!faculty) {
      return res.status(404).json({
        message: "Faculty profile not found",
      });
    }

    return res.status(200).json({ faculty });
  } catch (error) {
    console.error("Fetch my faculty profile error:", error.message);

    return res.status(500).json({
      message: "Failed to fetch faculty profile",
    });
  }
});

// POST: Add faculty
router.post("/", protect, authorizeRoles("admin"), async (req, res) => {
  let createdUser;

  try {
    const { name, email, password, employeeId, department, subject, phone } =
      req.body;

    if (
      !name?.trim() ||
      !email?.trim() ||
      !password ||
      password.length < 6 ||
      !employeeId?.trim() ||
      !department?.trim() ||
      !subject?.trim()
    ) {
      return res.status(400).json({
        message:
          "Name, email, password (minimum 6 characters), employee ID, department and subject are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedEmployeeId = employeeId.trim();

    if (await User.findOne({ email: normalizedEmail })) {
      return res.status(409).json({ message: "Email already exists" });
    }

    if (await Faculty.findOne({ employeeId: normalizedEmployeeId })) {
      return res.status(409).json({ message: "Employee ID already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    createdUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "faculty",
    });

    const faculty = await Faculty.create({
      user: createdUser._id,
      employeeId: normalizedEmployeeId,
      department: department.trim(),
      subject: subject.trim(),
      phone: phone?.trim() || "",
    });

    res.status(201).json({
      message: "Faculty added successfully",
      faculty: await faculty.populate("user", "name email"),
    });
  } catch (error) {
    if (createdUser) {
      await User.findByIdAndDelete(createdUser._id).catch(() => {});
    }

    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email or employee ID already exists",
      });
    }

    console.error("Add faculty error:", error.message);
    res.status(500).json({ message: "Failed to add faculty" });
  }
});

// PUT: Update faculty
router.put("/:id", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const { name, email, employeeId, department, subject, phone } = req.body;

    const faculty = await Faculty.findById(req.params.id);

    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    const user = await User.findById(faculty.user);

    if (!user) {
      return res
        .status(404)
        .json({ message: "Faculty login account not found" });
    }

    if (email !== undefined) {
      if (typeof email !== "string" || !email.trim()) {
        return res.status(400).json({ message: "Valid email is required" });
      }

      const normalizedEmail = email.trim().toLowerCase();
      const duplicateEmail = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: user._id },
      });

      if (duplicateEmail) {
        return res.status(409).json({ message: "Email already exists" });
      }

      user.email = normalizedEmail;
    }

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({ message: "Valid name is required" });
      }
      user.name = name.trim();
    }

    if (employeeId !== undefined) {
      if (typeof employeeId !== "string" || !employeeId.trim()) {
        return res
          .status(400)
          .json({ message: "Valid employee ID is required" });
      }

      const normalizedId = employeeId.trim();
      const duplicateId = await Faculty.findOne({
        employeeId: normalizedId,
        _id: { $ne: faculty._id },
      });

      if (duplicateId) {
        return res.status(409).json({ message: "Employee ID already exists" });
      }

      faculty.employeeId = normalizedId;
    }

    if (department !== undefined) {
      if (typeof department !== "string" || !department.trim()) {
        return res
          .status(400)
          .json({ message: "Valid department is required" });
      }
      faculty.department = department.trim();
    }

    if (subject !== undefined) {
      if (typeof subject !== "string" || !subject.trim()) {
        return res.status(400).json({ message: "Valid subject is required" });
      }
      faculty.subject = subject.trim();
    }

    if (phone !== undefined) {
      faculty.phone = typeof phone === "string" ? phone.trim() : "";
    }

    await user.save();
    await faculty.save();

    res.status(200).json({
      message: "Faculty updated successfully",
      faculty: await faculty.populate("user", "name email"),
    });
  } catch (error) {
    console.error("Update faculty error:", error.message);
    res.status(500).json({ message: "Failed to update faculty" });
  }
});

// DELETE: Remove faculty and associated login account
router.delete("/:id", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);

    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    await Faculty.findByIdAndDelete(faculty._id);
    await User.findByIdAndDelete(faculty.user);

    res.status(200).json({ message: "Faculty deleted successfully" });
  } catch (error) {
    console.error("Delete faculty error:", error.message);
    res.status(500).json({ message: "Failed to delete faculty" });
  }
});

module.exports = router;
