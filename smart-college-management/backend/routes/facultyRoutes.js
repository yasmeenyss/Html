const express = require("express");
const bcrypt = require("bcrypt");

const Faculty = require("../models/Faculty");
const User = require("../models/User");

const protect = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

// =====================================
// GET LOGGED-IN FACULTY PROFILE
// IMPORTANT: Keep /me BEFORE /:id
// =====================================
router.get("/me", protect, authorizeRoles("faculty"), async (req, res) => {
  try {
    const faculty = await Faculty.findOne({
      user: req.user.id,
    }).populate("user", "name email role");

    if (!faculty) {
      return res.status(404).json({
        message: "Faculty profile not found.",
      });
    }

    return res.status(200).json({ faculty });
  } catch (error) {
    console.error("Fetch my faculty profile error:", error.message);

    return res.status(500).json({
      message: "Failed to fetch your faculty profile.",
    });
  }
});

// =====================================
// CREATE FACULTY ACCOUNT + PROFILE
// Admin only
// =====================================
router.post("/", protect, authorizeRoles("admin"), async (req, res) => {
  let createdUser = null;

  try {
    const { name, email, password, employeeId, department, subject, phone } =
      req.body;

    // Validate required fields
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      typeof employeeId !== "string" ||
      typeof department !== "string" ||
      typeof subject !== "string" ||
      !name.trim() ||
      !email.trim() ||
      password.length < 6 ||
      !employeeId.trim() ||
      !department.trim() ||
      !subject.trim()
    ) {
      return res.status(400).json({
        message:
          "Name, email, password (minimum 6 characters), employee ID, department and subject are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedEmployeeId = employeeId.trim();

    // Check whether email already exists
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    // Check whether employee ID already exists
    const existingFaculty = await Faculty.findOne({
      employeeId: normalizedEmployeeId,
    });

    if (existingFaculty) {
      return res.status(409).json({
        message: "This employee ID is already registered.",
      });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create login account
    createdUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "faculty",
    });

    // Create faculty profile linked to the User account
    const faculty = await Faculty.create({
      user: createdUser._id,
      employeeId: normalizedEmployeeId,
      department: department.trim(),
      subject: subject.trim(),
      ...(typeof phone === "string" && phone.trim()
        ? { phone: phone.trim() }
        : {}),
    });

    return res.status(201).json({
      message: "Faculty account and profile created successfully.",
      faculty: {
        id: faculty._id,
        name: createdUser.name,
        email: createdUser.email,
        role: createdUser.role,
        employeeId: faculty.employeeId,
        department: faculty.department,
        subject: faculty.subject,
        phone: faculty.phone,
      },
    });
  } catch (error) {
    // If profile creation fails, remove the newly created login account
    if (createdUser) {
      try {
        await User.findByIdAndDelete(createdUser._id);
      } catch (cleanupError) {
        console.error("Failed to clean up faculty user:", cleanupError.message);
        console.error("FULL ERROR:", error);
      }
    }

    if (error.code === 11000) {
      console.error("Duplicate key details:", error.keyPattern, error.keyValue);

      console.error("Full error:", error.message);
      return res.status(409).json({
        message: "Duplicate value detected.",
        field: error.keyPattern,
      });
    }

    console.error("Create faculty error:", error.message);

    return res.status(500).json({
      message: "Failed to create faculty account.",
    });
  }
});

// =====================================
// GET ALL FACULTY
// Admin and Faculty
// =====================================
router.get(
  "/",
  protect,
  authorizeRoles("admin", "faculty"),
  async (req, res) => {
    try {
      const faculty = await Faculty.find()
        .populate("user", "name email role")
        .sort({ createdAt: -1 });

      return res.status(200).json({
        count: faculty.length,
        faculty,
      });
    } catch (error) {
      console.error("Get all faculty error:", error.message);

      return res.status(500).json({
        message: "Failed to fetch faculty.",
      });
    }
  },
);

// =====================================
// GET SINGLE FACULTY BY ID
// Keep this AFTER /me
// =====================================
router.get("/:id", protect, async (req, res) => {
  try {
    if (!/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
      return res.status(400).json({
        message: "Invalid faculty ID.",
      });
    }

    const faculty = await Faculty.findById(req.params.id).populate(
      "user",
      "name email role",
    );

    if (!faculty) {
      return res.status(404).json({
        message: "Faculty not found.",
      });
    }

    return res.status(200).json({
      message: "Faculty fetched successfully.",
      faculty,
    });
  } catch (error) {
    console.error("Get faculty by ID error:", error.message);

    return res.status(500).json({
      message: "Failed to fetch faculty.",
    });
  }
});

// =====================================
// UPDATE FACULTY PROFILE
// Admin only
// =====================================
router.put("/:id", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const { employeeId, department, subject, phone } = req.body;

    // Do not allow changing the linked user through this route
    const updates = {};

    if (employeeId !== undefined) updates.employeeId = employeeId;
    if (department !== undefined) updates.department = department;
    if (subject !== undefined) updates.subject = subject;
    if (phone !== undefined) updates.phone = phone;

    const faculty = await Faculty.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).populate("user", "name email role");

    if (!faculty) {
      return res.status(404).json({
        message: "Faculty not found.",
      });
    }

    return res.status(200).json({
      message: "Faculty updated successfully.",
      faculty,
    });
  } catch (error) {
    console.error("Update faculty error:", error.message);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "This employee ID is already registered.",
      });
    }

    return res.status(500).json({
      message: "Failed to update faculty.",
    });
  }
});

// =====================================
// DELETE FACULTY
// Admin only
// =====================================
router.delete("/:id", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);

    if (!faculty) {
      return res.status(404).json({
        message: "Faculty not found.",
      });
    }

    // Remove the linked login account as well
    await User.findByIdAndDelete(faculty.user);
    await Faculty.findByIdAndDelete(faculty._id);

    return res.status(200).json({
      message: "Faculty account and profile deleted successfully.",
    });
  } catch (error) {
    console.error("Delete faculty error:", error.message);

    return res.status(500).json({
      message: "Failed to delete faculty.",
    });
  }
});

module.exports = router;
