const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// =====================================
// REGISTER USER
// =====================================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "student",
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// =====================================
// LOGIN USER
// =====================================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isPasswordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// =====================================
// GET LOGGED-IN USER PROFILE
// =====================================
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Profile fetched successfully",
      user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// =====================================
// ADMIN ONLY ROUTE
// =====================================
router.get(
  "/admin",
  protect,
  authorizeRoles("admin"),
  (req, res) => {
    res.status(200).json({
      message: "Welcome Admin! You have access to this route.",
      user: req.user,
    });
  }
);

// =====================================
// FACULTY ONLY ROUTE
// =====================================
router.get(
  "/faculty",
  protect,
  authorizeRoles("faculty"),
  (req, res) => {
    res.status(200).json({
      message: "Welcome Faculty! You have access to this route.",
      user: req.user,
    });
  }
);

// =====================================
// STUDENT ONLY ROUTE
// =====================================
router.get(
  "/student",
  protect,
  authorizeRoles("student"),
  (req, res) => {
    res.status(200).json({
      message: "Welcome Student! You have access to this route.",
      user: req.user,
    });
  }
);

// =====================================
// EXPORT ROUTER
// =====================================
module.exports = router;