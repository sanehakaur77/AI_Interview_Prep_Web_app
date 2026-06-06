const Assignment = require("../models/Assignment");
const { generateFromGemini,evaluateWithGemini} = require("../utils/assignmentService");
const QuizResult=require('../models/assignmentResult')


const generateAssignment = async (req, res) => {
  try {
     const { userId } = req.params;
    const {
      company,
      targetRole,
      experienceLevel,
      topics,
      difficulty,
    } = req.body;

   
    if (
      !company ||
      !targetRole ||
      !experienceLevel ||
      !topics ||
      !difficulty
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

  
    const aiData = await generateFromGemini({
      company,
      role: targetRole,
      experienceLevel,
      topics,
      difficulty,
    });

    if (!aiData || !aiData.questions) {
      return res.status(500).json({
        success: false,
        message: "AI did not return valid response",
      });
    }

  
    const assignment = await Assignment.create({
      userId,
      company,
      targetRole,
      experienceLevel,
      topics,
      difficulty,
      questions: aiData.questions,
    });

    return res.status(201).json({
      success: true,
      message: "Assignment generated successfully",
      data: assignment,
    });
  } catch (error) {
    console.error("Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const submitQuiz = async (req, res) => {
  try {
    const { quizId, userId } = req.params;
    const { answers } = req.body;

    if (!Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: "Answers array is required",
      });
    }

    const quiz = await Assignment.findById(quizId);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    const aiResult = await evaluateWithGemini(quiz, answers);

    const savedResult = await QuizResult.create({
      quizId,
      userId,
      score: aiResult.score,
      totalQuestions: quiz.questions.length,
      percentage: Math.round(
        (aiResult.score / quiz.questions.length) * 100
      ),
      answers: aiResult.feedback,
    });

    return res.status(200).json({
      success: true,
      message: "Quiz evaluated successfully",
      data: savedResult,
    });

  } catch (error) {
    console.error("Submit Quiz Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getQuizById = async (req, res) => {
  try {
    const { quizId } = req.params;

    const quiz = await Assignment.findById(quizId);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: quiz,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getUserQuizResult = async (req, res) => {
  try {
    const { quizId} = req.params;

    const result = await QuizResult.findOne({
      quizId
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Result not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  generateAssignment,
  submitQuiz,
  getQuizById,
  getUserQuizResult
};