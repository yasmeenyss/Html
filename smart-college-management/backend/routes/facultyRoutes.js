const express = require("express");
const Faculty = require("../models/Faculty");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// =====================================
// CREATE FACULTY
// Admin only
// =====================================
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const faculty = await Faculty.create(req.body);

      res.status(201).json({
        message: "Faculty created successfully",
        faculty,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to create faculty",
        error: error.message,
      });
    }
  }
);

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
      const faculty = await Faculty.find().sort({
        createdAt: -1,
      });

      res.status(200).json({
        count: faculty.length,
        faculty,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to fetch faculty",
        error: error.message,
      });
    }
  }
);

// =====================================
// GET SINGLE FACULTY
// Any logged-in user
// =====================================
router.get("/:id", protect, async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);

    if (!faculty) {
      return res.status(404).json({
        message: "Faculty not found",
      });
    }

    res.status(200).json({
      message: "Faculty fetched successfully",
      faculty,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch faculty",
      error: error.message,
    });
  }
});

// =====================================
// UPDATE FACULTY
// Admin only
// =====================================
router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const faculty = await Faculty.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!faculty) {
        return res.status(404).json({
          message: "Faculty not found",
        });
      }

      res.status(200).json({
        message: "Faculty updated successfully",
        faculty,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to update faculty",
        error: error.message,
      });
    }
  }
);

// =====================================
// DELETE FACULTY
// Admin only
// =====================================
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const faculty = await Faculty.findByIdAndDelete(
        req.params.id
      );

      if (!faculty) {
        return res.status(404).json({
          message: "Faculty not found",
        });
      }

      res.status(200).json({
        message: "Faculty deleted successfully",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to delete faculty",
        error: error.message,
      });
    }
  }
);

// =====================================
// EXPORT ROUTER
// =====================================
module.exports = router;