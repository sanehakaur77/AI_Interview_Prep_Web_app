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
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

// ===============================
// NORMALIZE (USER INPUT → INTERNAL)
// ===============================
const normalizeInterviewType = (type) => {
  if (!type) return "Behavioral";

  const map = {
    "HR Screening": "HR Screening", // 🔥 IMPORTANT (KEEP SAME FOR SCHEMA)
    HR: "HR Screening",
    Technical: "Technical",
    Behavioral: "Behavioral",
  };

  return map[type] || "Behavioral";
};

// ===============================
// START INTERVIEW
// ===============================
const startInterview = async (req, res) => {
  try {
    const { jobRole, experience, interviewType } = req.body;

    if (!jobRole || !experience) {
      return res.status(400).json({
        success: false,
        message: "Job role and experience are required",
      });
    }

    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const cleanInterviewType = normalizeInterviewType(interviewType);

    let resumeText = "";
    let resumeUrl = "";

    // ===============================
    // RESUME UPLOAD + PDF PARSE (SAFE)
    // ===============================
    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.buffer);
        resumeUrl = result.secure_url;

        try {
          const data = await pdfParse(req.file.buffer);
          resumeText = data.text || "";
        } catch (pdfErr) {
          console.log("PDF ERROR:", pdfErr.message);
          resumeText = "";
        }
      } catch (uploadErr) {
        console.log("UPLOAD ERROR:", uploadErr.message);
      }
    }

    const safeResumeText = resumeText.slice(0, 3000);

    // ===============================
    // GENERATE QUESTIONS
    // ===============================
    const questions = await generateQuestions({
      jobRole,
      experience,
      interviewType: cleanInterviewType,
      resumeText: safeResumeText,
    });

    // ===============================
    // SAVE SESSION (🔥 FIX HERE)
    // ===============================
    const session = await Session.create({
      userId: req.user._id,
      jobRole,
      experience,
      interviewType: cleanInterviewType, // ✅ NOW MATCHES SCHEMA
      resumeUrl,
      status: "started",
    });

    const formattedQuestions = questions.map((q) => ({
      question: q.question,
      answer: "",
    }));

    await InterviewQuestion.create({
      sessionId: session._id,
      questions: formattedQuestions,
    });

    return res.status(201).json({
      success: true,
      sessionId: session._id,
      resumeUrl,
      questions: formattedQuestions,
    });
  } catch (err) {
    console.error("START INTERVIEW ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
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


// const evaluateInterviewController = async (req, res) => {
//   try {
//     const { sessionId } = req.params;

//     const doc = await InterviewQuestion.findOne({ sessionId });

//     if (!doc) {
//       return res.status(404).json({
//         success: false,
//         message: "Interview not found",
//       });
//     }

    
//     // ===============================
//     const result = await evaluateInterview(doc.questions);

//     if (!result || !result.feedback) {
//       return res.status(500).json({
//         success: false,
//         message: "AI evaluation failed",
//       });
//     }

//     // ===============================
//     // 3️⃣ SAFE QUESTION UPDATE
//     // ===============================
//     const updatedQuestions = doc.questions.map((q, i) => ({
//       question: q.question,
//       answer: q.answer,
//       status: q.status,
//       feedback: result.feedback?.[i]?.feedback || "No feedback",
//       score: result.feedback?.[i]?.score || 0,
//     }));

//     // ===============================
//     // 4️⃣ FIXED OVERALL SCORE (IMPORTANT)
//     // ===============================
//     const totalScore = result.feedback.reduce((acc, item) => {
//       return acc + (item.score || 0);
//     }, 0);

//     const overallScore =
//       result.feedback.length > 0
//         ? Math.round(totalScore / result.feedback.length)
//         : 0;

//     // ===============================
//     // 5️⃣ UPDATE DOC
//     // ===============================
//     doc.questions = updatedQuestions;
//     doc.overallScore = overallScore;
//     doc.summary = result.summary || "No summary available";

//     await doc.save();

//     // ===============================
//     // 6️⃣ SAVE RESULT MODEL
//     // ===============================
//     const savedResult = await Result.create({
//       sessionId: doc.sessionId,
//       overallScore: doc.overallScore,
//       summary: doc.summary,
//       questions: updatedQuestions,
//     });

//     // ===============================
//     // 7️⃣ RESPONSE
//     // ===============================
//     return res.status(200).json({
//       success: true,
//       message: "Interview evaluated successfully",
//       data: savedResult,
//     });
//   } catch (err) {
//     console.error("EVALUATION ERROR:", err);

//     return res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

const evaluateInterviewController = async (req, res) => {
  try {
    const { sessionId, userId } = req.params;

    console.log("sessionId:", sessionId);
    console.log("userId:", userId);

    const doc = await InterviewQuestion.findOne({ sessionId });

    if (!doc) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    const result = await evaluateInterview(doc.questions);

    const updatedQuestions = doc.questions.map((q, i) => ({
      question: q.question,
      answer: q.answer,
      status: q.status,
      feedback: result.feedback?.[i]?.feedback || "No feedback",
      score: result.feedback?.[i]?.score || 0,
    }));

    const totalScore = result.feedback.reduce(
      (acc, item) => acc + (item.score || 0),
      0
    );

    const overallScore =
      result.feedback.length > 0
        ? Math.round(totalScore / result.feedback.length)
        : 0;

   const savedResult = await Result.create({
  sessionId: doc.sessionId,
  userId: userId,
  overallScore,
  summary: result.summary,
  questions: updatedQuestions,
});
    return res.status(200).json({
      success: true,
      data: savedResult,
    });
  } catch (err) {
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
