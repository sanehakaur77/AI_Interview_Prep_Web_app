const Session = require("../models/interviewSchema");
const cloudinary = require("../configs/cloudinary");
const pdfParse = require("pdf-parse");
const Result = require("../models/Results");
const streamifier = require("streamifier");
const {
  generateQuestions,
  evaluateInterview,
} = require("../utils/interviewGeminiService");
const InterviewQuestion = require("../models/InterviewQuestionsSchema");

// 👉 Upload buffer → Cloudinary
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "raw", folder: "resumes" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

const startInterview = async (req, res) => {
  try {
    const { jobRole, experience, interviewType } = req.body;

    if (!jobRole || !experience) {
      return res.status(400).json({
        success: false,
        message: "Job role and experience are required",
      });
    }

    let resumeText = "";
    let resumeUrl = "";

    // 📄 Upload + Parse Resume
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      resumeUrl = result.secure_url;

      const data = await pdfParse(req.file.buffer);
      resumeText = data.text;
    }

    // 🤖 Generate Questions
    const questions = await generateQuestions({
      jobRole,
      experience,
      interviewType,
      resumeText,
    });

    // 💾 Save Session (✅ FIX HERE)
    const session = await Session.create({
      userId: req.user._id, // 👈 ADD THIS
      jobRole,
      experience,
      interviewType,
      resumeUrl,
      status: "started",
    });

    const formattedQuestions = questions.map((q) => ({
      question: q.question,
      answer: "",
      status: "unanswered",
    }));

    await InterviewQuestion.create({
      sessionId: session._id,
      questions: formattedQuestions,
    });

    res.status(201).json({
      success: true,
      message: "Interview started successfully",
      sessionId: session._id,
      resumeUrl,
      questions: formattedQuestions,
    });
  } catch (err) {
    console.error("ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message || "Interview start failed",
    });
  }
};
const submitAnswer = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { answers } = req.body;

    if (!sessionId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: "sessionId and answers array required",
      });
    }

    const doc = await InterviewQuestion.findOne({ sessionId });

    if (!doc) {
      return res.status(404).json({
        success: false,
        message: "Questions not found",
      });
    }

    answers.forEach((ans) => {
      const { questionIndex, answer } = ans;

      if (doc.questions[questionIndex]) {
        doc.questions[questionIndex].answer = answer;
        doc.questions[questionIndex].status = "answered";
      }
    });

    await doc.save();

    res.status(200).json({
      success: true,
      message: "All answers submitted successfully",
      data: doc.questions,
    });
  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
const evaluateInterviewController = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const doc = await InterviewQuestion.findOne({ sessionId });

    if (!doc) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    const result = await evaluateInterview(doc.questions);

    // ✅ FIXED SAFE MAPPING (NO 0/10 BUG NOW)
    doc.questions = doc.questions.map((q, i) => {
      const match = result.results?.find((r) => r.id === i);

      return {
        ...q.toObject(),
        score: match?.score ?? 0,
        feedback: match?.feedback ?? "No feedback generated",
      };
    });

    const totalScore = doc.questions.reduce(
      (sum, q) => sum + Number(q.score || 0),
      0,
    );

    const overallScore = Math.round(
      (totalScore / (doc.questions.length * 10)) * 100,
    );

    doc.overallScore = overallScore;
    doc.summary = result.summary || "";

    await doc.save();

    const savedResult = await Result.create({
      sessionId: doc.sessionId,
      overallScore,
      summary: doc.summary,
      questions: doc.questions,
    });

    return res.status(200).json({
      success: true,
      data: savedResult,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getQuestionsBySessionId = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const data = await InterviewQuestion.findOne({ sessionId });

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "No data found for this session",
      });
    }

    res.status(200).json({
      success: true,
      questions: data.questions, // 👈 IMPORTANT
      overallScore: data.overallScore,
      summary: data.summary,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
const getResultBySession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const result = await Result.findOne({ sessionId });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Result not found",
      });
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  startInterview,
  submitAnswer,
  evaluateInterviewController,
  getQuestionsBySessionId,
  getResultBySession,
};
