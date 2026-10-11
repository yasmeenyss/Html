
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");

async function createFacultyUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = "faculty@smartcollege.local";
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log("Faculty user already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash("Faculty@12345", 10);

    await User.create({
      name: "Test Faculty",
      email,
      password: hashedPassword,
      role: "faculty",
    });

    console.log("Faculty user created successfully.");
  } catch (error) {
    console.error("Faculty setup failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

createFacultyUser();
