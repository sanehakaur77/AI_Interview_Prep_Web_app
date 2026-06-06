// const mongoose = require("mongoose");

// const ResultSchema = new mongoose.Schema(
//   {
//     sessionId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Session",
//       required: true,
//     },

//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },

//     overallScore: {
//       type: Number,
//       default: 0,
//     },

//     summary: {
//       type: String,
//       default: "",
//     },

//     questions: [
//       {
//         question: String,
//         answer: String,
//         status: String,
//         feedback: String,
//         score: Number,
//       },
//     ],
//   },
//   { timestamps: true },
// );

// module.exports = mongoose.model("Result", ResultSchema);

const mongoose = require("mongoose");

const ResultSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    overallScore: {
      type: Number,
      default: 0,
    },

    summary: {
      type: String,
      default: "",
    },

    questions: [
      {
        question: String,
        answer: String,
        status: String,
        feedback: String,
        score: Number,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Result", ResultSchema);