const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    placement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Placement",
      required: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    resumeUrl: {
      type: String,
      default: "",
      trim: true,
    },

    coverLetter: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["Applied", "Under Review", "Shortlisted", "Selected", "Rejected"],
      default: "Applied",
    },
  },
  { timestamps: true },
);

// Prevent the same student from applying to the same placement twice
applicationSchema.index({ placement: 1, student: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
