const express = require("express");
const { authMiddleware } = require("../middlewares/auth.middleware");
const router = express.Router();

const upload = require("../middlewares/upload");
const {
  startInterview,
  submitAnswer,
  evaluateInterviewController,
  getQuestionsBySessionId,
  getResultBySession,
} = require("../controllers/interviewSession");

router.post("/start", authMiddleware, upload.single("resume"), startInterview);
router.post("/answer/:sessionId", authMiddleware, submitAnswer);
// router.get("/evaluate/:sessionId", authMiddleware, evaluateInterviewController);
router.get(
  "/evaluate/:sessionId/:userId",
  authMiddleware,
  evaluateInterviewController
);
router.get("/questions/:sessionId", getQuestionsBySessionId);
router.get("/result/:sessionId", getResultBySession);

module.exports = router;
