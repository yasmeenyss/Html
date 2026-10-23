const express = require("express");
const router = express.Router();

const Student = require("../models/Student");
const Placement = require("../models/Placement");
const Application = require("../models/Application");

const authMiddleware = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

router.post(
  "/",
  authMiddleware,
  authorizeRoles("admin"),
  async (req, res) => {
    console.log("AI Placement Analyst API called");

    try {
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        console.error("GEMINI_API_KEY is missing");
        return res.status(500).json({
          message: "Gemini API key backend .env mein configured nahi hai.",
        });
      }

      console.log("Reading placement statistics...");

      const [
        totalStudents,
        totalPlacements,
        totalApplications,
        selected,
        shortlisted,
        applied,
        underReview,
        rejected,
      ] = await Promise.all([
        Student.countDocuments(),
        Placement.countDocuments(),
        Application.countDocuments(),
        Application.countDocuments({ status: "Selected" }),
        Application.countDocuments({ status: "Shortlisted" }),
        Application.countDocuments({ status: "Applied" }),
        Application.countDocuments({ status: "Under Review" }),
        Application.countDocuments({ status: "Rejected" }),
      ]);

      const statistics = {
        totalStudents,
        totalPlacements,
        totalApplications,
        selected,
        shortlisted,
        applied,
        underReview,
        rejected,
      };

      const prompt = `
You are an AI Placement Analyst for a college.

Analyze these placement statistics:
${JSON.stringify(statistics, null, 2)}

Write a concise report containing:
1. Current placement overview
2. Important observations based only on these numbers
3. Three practical recommendations to improve placements

Use simple English and bullet points.
Do not invent company names, salaries, or missing data.
Mention if the data is insufficient.
`;

      // First try the configured Gemini model.
      // If it fails, the exact API error will be logged.
      const models = ["gemini-3.8-flash", "gemini-2.5-flash"];

      let insights = "";
      let lastStatus = 0;
      let lastError = "";

      for (const model of models) {
        console.log("Trying Gemini model:", model);

        let data;

        try {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                contents: [
                  {
                    parts: [{ text: prompt }],
                  },
                ],
              }),
            }
          );

          data = await response.json();
          lastStatus = response.status;

          if (!response.ok) {
            lastError =
              data?.error?.message || "Unknown Gemini API error";

            console.error("Gemini model failed:", model);
            console.error("Gemini HTTP status:", lastStatus);
            console.error("Gemini error details:", lastError);

            if (
              response.status === 429 ||
              response.status === 503
            ) {
              return res.status(503).json({
                message:
                  "Gemini AI busy hai ya quota limit reach ho gayi hai. Baad mein retry karo.",
              });
            }

            if (
              response.status === 401 ||
              response.status === 403
            ) {
              return res.status(502).json({
                message:
                  "Gemini API key invalid hai ya API permission nahi hai. Google AI Studio mein key aur access check karo.",
              });
            }

            // Try the next model for model/request errors.
            continue;
          }

          insights = data.candidates?.[0]?.content?.parts
            ?.map((part) => part.text || "")
            .join("\n")
            .trim();

          if (insights) {
            console.log("Gemini analysis generated successfully");
            break;
          }

          lastError =
            data.promptFeedback?.blockReason ||
            "Gemini returned no text.";

          console.error("Gemini returned no text:", lastError);
        } catch (error) {
          lastError = error.message;
          console.error("Gemini network/request error:", lastError);

          return res.status(502).json({
            message:
              "Gemini se connect nahi ho raha. Internet aur backend connection check karo.",
          });
        }
      }

      if (!insights) {
        console.error("AI DEBUG:", lastStatus, lastError);

        return res.status(502).json({
          message:
            `AI report generate nahi hua. HTTP status: ${lastStatus}. ` +
            "Backend terminal mein Gemini error details check karo.",
        });
      }

      return res.json({
        message: "AI placement analysis generated successfully.",
        statistics,
        insights,
      });
    } catch (error) {
      console.error("AI Placement Analyst error:", error);

      return res.status(500).json({
        message:
          "Placement analysis fail hua. Backend terminal mein error check karo.",
      });
    }
  }
);

module.exports = router;