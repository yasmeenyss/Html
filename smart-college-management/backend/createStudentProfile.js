const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");
const Student = require("./models/Student");

async function createStudentProfile() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const user = await User.findOne({
      email: "student.test@example.com",
      role: "student",
    });

    if (!user) {
      console.log("Student user account not found. Please check the email.");
      return;
    }

    const existingStudent = await Student.findOne({ user: user._id });

    if (existingStudent) {
      console.log("Student profile already exists:");
      console.log(existingStudent);
      return;
    }

    const student = await Student.create({
      user: user._id,
      rollNumber: "SCM2026001",
      department: "Computer Science",
      semester: 8,
      phone: "9876543210",
    });

    console.log("Student profile created successfully:");
    console.log(student);
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

createStudentProfile();
