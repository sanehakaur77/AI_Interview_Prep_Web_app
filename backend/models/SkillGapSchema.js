const mongoose = require("mongoose");

const skillGapSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    targetRole: {
      type: String,
      required: true,
      trim: true,
    },

    // 🔥 NEW: Job Description (very important for AI accuracy)
    jobDescription: {
      type: String,
      default: "",
    },

    userSkills: {
      type: [String],
      required: true,
      default: [],
    },

    requiredSkills: {
      type: [String],
      default: [],
    },

    matchedSkills: {
      type: [String],
      default: [],
    },

    missingSkills: {
      type: [String],
      default: [],
    },

    // 🔥 AI score (0 - 100)
    score: {
      type: Number,
      default: 0,
    },

    experienceLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },

    recommendation: {
      type: String,
      default: "",
    },

    // 🔥 NEW: AI roadmap (step-by-step learning path)
    roadmap: {
      type: [String],
      default: [],
    },

    // 🔥 NEW: model used (for debugging/upgrades later)
    modelUsed: {
      type: String,
      default: "gemini-2.5-flash-lite",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SkillGap", skillGapSchema);