const mongoose = require("mongoose");

const placementSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    jobRole: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    package: {
      type: Number,
      required: true,
      min: 0,
    },

    eligibility: {
      type: String,
      default: "",
      trim: true,
    },

    deadline: {
      type: Date,
      required: true,
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    jobType: {
      type: String,
      enum: ["Full-time", "Internship"],
      default: "Full-time",
    },

    status: {
      type: String,
      enum: ["Open", "Closed"],
      default: "Open",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Placement", placementSchema);
