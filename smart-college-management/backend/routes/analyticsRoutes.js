
const express = require("express");
const router = express.Router();

const Student = require("../models/Student");
const Faculty = require("../models/Faculty");
const Placement = require("../models/Placement");
const Application = require("../models/Application");

const authMiddleware = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// Admin analytics
router.get("/", authMiddleware, authorizeRoles("admin"), async (req, res) => {
  try {
    const [
      totalStudents,
      totalFaculty,
      totalPlacements,
      totalApplications,
      shortlistedApplications,
      selectedApplications,
      appliedApplications,
      underReviewApplications,
      rejectedApplications,
    ] = await Promise.all([
      Student.countDocuments(),
      Faculty.countDocuments(),
      Placement.countDocuments(),
      Application.countDocuments(),
      Application.countDocuments({ status: "Shortlisted" }),
      Application.countDocuments({ status: "Selected" }),
      Application.countDocuments({ status: "Applied" }),
      Application.countDocuments({ status: "Under Review" }),
      Application.countDocuments({ status: "Rejected" }),
    ]);

    res.json({
      totalStudents,
      totalFaculty,
      totalPlacements,
      totalApplications,
      shortlistedApplications,
      selectedApplications,
      appliedApplications,
      underReviewApplications,
      rejectedApplications,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({
      message: "Failed to load analytics.",
    });
  }
});

module.exports = router;
