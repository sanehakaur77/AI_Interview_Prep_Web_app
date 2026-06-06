const express = require("express");
const multer = require("multer");
const fs = require("fs");
const cloudinary = require("../configs/cloudinary");
const { extractTextFromPDF } = require("../utils/pdf");
const { generateQuestions, evaluateInterview } = require("../utils/gemini");
const ResumeInterview = require("../models/resumeInterview");
const router = express.Router();
const upload = multer({ dest: "uploads/" });
const { authMiddleware } = require("../middlewares/auth.middleware");

router.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "No file uploaded",
      });
    }

    const interviewType = req.body.interviewType;

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "raw",
      type: "upload",
    });

    const text = await extractTextFromPDF(req.file.path);

    const questions = await generateQuestions({
      resumeText: text,
      interviewType,
    });

    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      url: result.secure_url,
      interviewType,
      questions,
    });
  } catch (err) {
    console.log(err);

    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch {}
    }

    res.status(500).json({
      error: err.message,
    });
  }
});
router.post("/save-response", authMiddleware, async (req, res) => {
  try {
    let { questions, answers } = req.body;

    console.log("BODY:", req.body);
    console.log("USER:", req.user);

    if (!Array.isArray(questions) || !Array.isArray(answers)) {
      return res.status(400).json({ message: "Invalid arrays" });
    }

    const formattedQuestions = questions.map((q) => ({
      question: typeof q === "string" ? q : q.question,
    }));

    const interview = await ResumeInterview.create({
      userId: req.user.id,
      questions: formattedQuestions,
      answers,
      status: "completed",
    });

    return res.status(200).json({
      success: true,
      message: "Interview saved successfully",
      interview,
    });
  } catch (err) {
    console.log("SAVE ERROR:", err);
    return res.status(500).json({
      message: err.message,
    });
  }
});
//  resume evaluate rouet
router.post("/evaluate", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Find latest interview of user
    const interview = await ResumeInterview.findOne({ userId }).sort({
      createdAt: -1,
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "No interview found for this user",
      });
    }

    // 2. Build QA data
    const qaData = interview.questions.map((q, i) => ({
      question: q.question,
      answer: interview.answers[i] || "",
    }));

    // 3. Send to Gemini
    const result = await evaluateInterview(qaData);

    // 4. Save evaluation in DB
    interview.evaluation = result;
    await interview.save();

    // 5. Return response
    res.json({
      success: true,
      evaluation: result,
    });
  } catch (err) {
    console.log("EVALUATE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
