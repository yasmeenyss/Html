const express = require("express");
const router = express.Router();

const Application = require("../models/Application");
const Placement = require("../models/Placement");
const authMiddleware = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// POST: Student applies for a placement
router.post(
  "/",
  authMiddleware,
  authorizeRoles("student"),
  async (req, res) => {
    try {
      const { placementId, resumeUrl, coverLetter } = req.body;

      if (!placementId || !/^[a-f\d]{24}$/i.test(placementId)) {
        return res.status(400).json({
          message: "Please provide a valid placement ID",
        });
      }

      const placement = await Placement.findById(placementId);

      if (!placement) {
        return res.status(404).json({
          message: "Placement not found",
        });
      }

      if (
        placement.status !== "Open" ||
        new Date(placement.deadline) < new Date()
      ) {
        return res.status(400).json({
          message: "This placement is no longer accepting applications",
        });
      }

      const studentId = req.user?._id || req.user?.id;

      if (!studentId) {
        return res.status(401).json({
          message: "Student information not found in login session",
        });
      }

      const application = await Application.create({
        placement: placementId,
        student: studentId,
        resumeUrl: typeof resumeUrl === "string" ? resumeUrl.trim() : "",
        coverLetter: typeof coverLetter === "string" ? coverLetter.trim() : "",
      });

      return res.status(201).json({
        message: "Application submitted successfully",
        application,
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({
          message: "You have already applied for this placement",
        });
      }

      console.error("Apply for placement error:", error);

      return res.status(500).json({
        message: "Failed to submit application",
        error: error.message,
      });
    }
  },
);

// GET: Student views their own applications
router.get(
  "/my-applications",
  authMiddleware,
  authorizeRoles("student"),
  async (req, res) => {
    try {
      const studentId = req.user?._id || req.user?.id;

      if (!studentId) {
        return res.status(401).json({
          message: "Student information not found in login session",
        });
      }

      const applications = await Application.find({
        student: studentId,
      })
        .populate("placement")
        .sort({ createdAt: -1 });

      return res.status(200).json(applications);
    } catch (error) {
      console.error("Fetch student applications error:", error);

      return res.status(500).json({
        message: "Failed to fetch applications",
        error: error.message,
      });
    }
  },
);

// GET: Admin views all applications
router.get("/", authMiddleware, authorizeRoles("admin"), async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("placement")
      .populate("student")
      .sort({ createdAt: -1 });

    return res.status(200).json(applications);
  } catch (error) {
    console.error("Fetch all applications error:", error);

    return res.status(500).json({
      message: "Failed to fetch applications",
      error: error.message,
    });
  }
});

// PATCH: Admin updates an application status
router.patch(
  "/:id/status",
  authMiddleware,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!/^[a-f\d]{24}$/i.test(id)) {
        return res.status(400).json({
          message: "Invalid application ID",
        });
      }

      const allowedStatuses = [
        "Applied",
        "Under Review",
        "Shortlisted",
        "Selected",
        "Rejected",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid application status",
        });
      }

      const application = await Application.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true },
      );

      if (!application) {
        return res.status(404).json({
          message: "Application not found",
        });
      }

      return res.status(200).json({
        message: "Application status updated successfully",
        application,
      });
    } catch (error) {
      console.error("Update application status error:", error);

      return res.status(500).json({
        message: "Failed to update application status",
        error: error.message,
      });
    }
  },
);

module.exports = router;
