const mongoose = require("mongoose");

const markSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    examType: {
      type: String,
      required: true,
      enum: ["Internal", "Midterm", "Final"],
    },
    maxMarks: {
      type: Number,
      required: true,
      min: 1,
    },
    marksObtained: {
      type: Number,
      required: true,
      min: 0,
    },
    enteredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

markSchema.index({ student: 1, subject: 1, examType: 1 }, { unique: true });

module.exports = mongoose.model("Mark", markSchema);
