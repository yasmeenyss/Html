const express = require("express");
const router = express.Router();

const Notice = require("../models/Notice");
const authMiddleware = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// Get notices
router.get("/", authMiddleware, async (req, res) => {
  try {
    const notices = await Notice.find({
      $or: [
        { audience: "all" },
        { audience: req.user.role === "student" ? "student" : "faculty" },
      ],
    }).sort({ createdAt: -1 });

    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notices" });
  }
});

// Create notice - Admin only
router.post("/", authMiddleware, authorizeRoles("admin"), async (req, res) => {
  try {
    const { title, message, audience } = req.body;

    if (!title?.trim() || !message?.trim()) {
      return res.status(400).json({
        message: "Title and message are required",
      });
    }

    const notice = await Notice.create({
      title: title.trim(),
      message: message.trim(),
      audience: audience || "all",
      createdBy: "Admin",
    });

    res.status(201).json({
      message: "Notice created successfully",
      notice,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create notice" });
  }
});

// Delete notice - Admin only
router.delete("/:id", authMiddleware, authorizeRoles("admin"), async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);

    if (!notice) {
      return res.status(404).json({ message: "Notice not found" });
    }

    res.json({ message: "Notice deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete notice" });
  }
});

module.exports = router;