const express = require("express");
const router = express.Router();

const {
  generateAssignment,
  submitQuiz,
  getQuizById,
  getUserQuizResult
} = require("../controllers/asssignment.controller");


router.post(
  "/generate/:userId",
  generateAssignment
);
router.post('/submit/:quizId/:userId', submitQuiz);
router.get("/get/:quizId", getQuizById);
router.get(
  "/results/:quizId/",
  getUserQuizResult
);

module.exports = router;