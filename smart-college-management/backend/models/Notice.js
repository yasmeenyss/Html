const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    audience: {
      type: String,
      enum: ["all", "student", "faculty"],
      default: "all",
    },
    createdBy: {
      type: String,
      default: "Admin",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Notice", noticeSchema);
