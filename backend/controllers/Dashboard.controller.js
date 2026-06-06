const Result = require("../models/Results");
const QuizResult = require("../models/assignmentResult");
const Profile = require("../models/Profile");

const getDashBoardData = async (req, res) => {
  const { userId } = req.params;

  try {
    const profile = await Profile.findOne({ user: userId });

    const quizzes = await QuizResult.find({ userId });

    const assignments = await Result.find({ userId });

    res.status(200).json({
      success: true,
      profile,
      quizzes,
      assignments,
      totalQuizAttempts: quizzes.length,
      totalAssignments: assignments.length,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getDashBoardData };