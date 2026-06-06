const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    company: {
      type: String,
      required: true,
    },

    targetRole: {
      type: String,
      required: true,
    },

    experienceLevel: {
      type: String,
      enum: ["fresher", "junior", "mid", "senior"],
      required: true,
    },

    topics: {
      type: String,
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },

    questions: [
      {
        question: {
          type: String,
          required: true,
        },

        options: {
          type: [String],
          required: true,
        },

        correctAnswer: {
          type: String,
          required: true,
        },

        explanation: {
          type: String,
          default: "",
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Assignment", assignmentSchema);