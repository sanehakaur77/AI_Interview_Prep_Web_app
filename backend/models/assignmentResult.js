const mongoose=require('mongoose');

const answerSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },

  correctAnswer: {
    type: String,
    required: true,
  },

  userAnswer: {
    type: String,
  },

  isCorrect: {
    type: Boolean,
    required: true,
  },

  explanation: {
    type: String,
    required: true,
  },
});

const quizResultSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    score: {
      type: Number,
      required: true,
    },

    totalQuestions: {
      type: Number,
      required: true,
    },

    percentage: {
      type: Number,
      required: true,
    },

    answers: [answerSchema],
  },
  {
    timestamps: true,
  }
);

const QuizResult = mongoose.model(
  "QuizResult",
  quizResultSchema
);
module.exports=QuizResult;