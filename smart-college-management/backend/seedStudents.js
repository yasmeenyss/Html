

require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/User");
const Student = require("./models/Student");

const students = [
  ["Ayesha Khan", "1RG26CS001", "ayesha001@example.com"],
  ["Fatima Shaikh", "1RG26CS002", "fatima002@example.com"],
  ["Sana Patel", "1RG26CS003", "sana003@example.com"],
  ["Zoya Ahmed", "1RG26CS004", "zoya004@example.com"],
  ["Mariam Ali", "1RG26CS005", "mariam005@example.com"],
  ["Ananya Rao", "1RG26CS006", "ananya006@example.com"],
  ["Priya Sharma", "1RG26CS007", "priya007@example.com"],
  ["Neha Kulkarni", "1RG26CS008", "neha008@example.com"],
  ["Riya Desai", "1RG26CS009", "riya009@example.com"],
  ["Sara Hussain", "1RG26CS010", "sara010@example.com"],
  ["Aditi Patil", "1RG26CS011", "aditi011@example.com"],
  ["Mehak Khan", "1RG26CS012", "mehak012@example.com"],
  ["Nisha Verma", "1RG26CS013", "nisha013@example.com"],
  ["Iqra Begum", "1RG26CS014", "iqra014@example.com"],
  ["Kavya Shetty", "1RG26CS015", "kavya015@example.com"],
  ["Hiba Noor", "1RG26CS016", "hiba016@example.com"],
  ["Divya Joshi", "1RG26CS017", "divya017@example.com"],
  ["Simran Kaur", "1RG26CS018", "simran018@example.com"],
  ["Alisha Syed", "1RG26CS019", "alisha019@example.com"],
  ["Pooja Naik", "1RG26CS020", "pooja020@example.com"],
];

async function seedStudents() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI backend/.env mein nahi mila.");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected.");

    let added = 0;
    let skipped = 0;

    for (const [name, usn, email] of students) {
      const existingStudent = await Student.findOne({
        rollNumber: usn,
      });

      const existingUser = await User.findOne({
        email: email.toLowerCase(),
      });

      if (existingStudent || existingUser) {
        console.log(`Skipped: ${usn} — email or USN already exists.`);
        skipped++;
        continue;
      }

      const user = await User.create({
        name,
        email,
        password: await bcrypt.hash("Student@123", 10),
        role: "student",
      });

      try {
        await Student.create({
          user: user._id,
          rollNumber: usn,
          department: "CSE",
          semester: 7,
          phone: "",
        });

        console.log(`Added: ${name} | ${usn}`);
        added++;
      } catch (error) {
        await User.findByIdAndDelete(user._id);
        throw error;
      }
    }

    console.log("\nSeed process completed.");
    console.log(`Students added: ${added}`);
    console.log(`Records skipped: ${skipped}`);
    console.log("Department: CSE | Semester: 7");
    console.log("Demo password for newly created students: Student@123");
  } catch (error) {
    console.error("Seed failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

seedStudents();
