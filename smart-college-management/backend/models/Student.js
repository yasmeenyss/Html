const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    // College Information
    rollNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    department: {
      type: String,
      required: true,
      trim: true,
    },

    course: {
      type: String,
      required: true,
      trim: true,
    },

    year: {
      type: Number,
      required: true,
    },

    semester: {
      type: Number,
      required: true,
    },

    admissionYear: {
      type: Number,
      required: true,
    },

    // Personal Information
    dateOfBirth: {
      type: Date,
    },

    address: {
      type: String,
      trim: true,
    },

    // Student Status
    status: {
      type: String,
      enum: ["active", "inactive", "graduated"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;