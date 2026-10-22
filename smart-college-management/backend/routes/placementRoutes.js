
const express = require("express");
const router = express.Router();

const Placement = require("../models/Placement");
const authMiddleware = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// GET: View all placements (logged-in users)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const placements = await Placement.find().sort({ createdAt: -1 });

    return res.status(200).json(placements);
  } catch (error) {
    console.error("Fetch placements error:", error);

    return res.status(500).json({
      message: "Failed to fetch placements",
      error: error.message,
    });
  }
});

// GET: View one placement
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const placement = await Placement.findById(req.params.id);

    if (!placement) {
      return res.status(404).json({
        message: "Placement not found",
      });
    }

    return res.status(200).json(placement);
  } catch (error) {
    console.error("Fetch placement error:", error);

    return res.status(500).json({
      message: "Failed to fetch placement",
      error: error.message,
    });
  }
});

// POST: Add placement (Admin only)
router.post(
  "/",
  authMiddleware,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const {
        companyName,
        jobRole,
        description,
        package: salaryPackage,
        eligibility,
        deadline,
        location,
        jobType,
        status,
      } = req.body;

      if (
        !companyName?.trim() ||
        !jobRole?.trim() ||
        salaryPackage === undefined ||
        salaryPackage === null ||
        salaryPackage === "" ||
        !deadline
      ) {
        return res.status(400).json({
          message:
            "Company name, job role, package and deadline are required",
        });
      }

      const parsedPackage = Number(salaryPackage);

      if (!Number.isFinite(parsedPackage) || parsedPackage < 0) {
        return res.status(400).json({
          message: "Please enter a valid package",
        });
      }

      const parsedDeadline = new Date(deadline);

      if (Number.isNaN(parsedDeadline.getTime())) {
        return res.status(400).json({
          message: "Please enter a valid deadline",
        });
      }

      if (
        jobType &&
        !["Full-time", "Internship"].includes(jobType)
      ) {
        return res.status(400).json({
          message: "Invalid job type",
        });
      }

      if (status && !["Open", "Closed"].includes(status)) {
        return res.status(400).json({
          message: "Invalid placement status",
        });
      }

      const placement = await Placement.create({
        companyName: companyName.trim(),
        jobRole: jobRole.trim(),
        description,
        package: parsedPackage,
        eligibility,
        deadline: parsedDeadline,
        location,
        jobType,
        status,
        createdBy: req.user?._id,
      });

      return res.status(201).json({
        message: "Placement added successfully",
        placement,
      });
    } catch (error) {
      console.error("Add placement error:", error);

      return res.status(500).json({
        message: "Failed to add placement",
        error: error.message,
      });
    }
  }
);

// PUT: Update placement (Admin only)
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const placement = await Placement.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!placement) {
        return res.status(404).json({
          message: "Placement not found",
        });
      }

      return res.status(200).json({
        message: "Placement updated successfully",
        placement,
      });
    } catch (error) {
      console.error("Update placement error:", error);

      return res.status(500).json({
        message: "Failed to update placement",
        error: error.message,
      });
    }
  }
);

// DELETE: Delete placement (Admin only)
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const placement = await Placement.findByIdAndDelete(
        req.params.id
      );

      if (!placement) {
        return res.status(404).json({
          message: "Placement not found",
        });
      }

      return res.status(200).json({
        message: "Placement deleted successfully",
      });
    } catch (error) {
      console.error("Delete placement error:", error);

      return res.status(500).json({
        message: "Failed to delete placement",
        error: error.message,
      });
    }
  }
);

module.exports = router;
