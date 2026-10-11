
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = "admin@smartcollege.local";
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log("Admin account already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash("Admin@12345", 10);

    await User.create({
      name: "College Admin",
      email,
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin account created successfully.");
  } catch (error) {
    console.error("Admin setup failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin();
