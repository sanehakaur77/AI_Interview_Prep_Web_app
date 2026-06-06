// const { analyzeWithAI } = require("../utils/skillGapgemini");
// const SkillGap = require("../models/SkillGapSchema");

// const analyzeSkillGapAI = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const {
//       targetRole,
//       userSkills,
//       experienceLevel,
//       jobDescription,
//     } = req.body;

//     if (
//       !targetRole ||
//       !userSkills ||
//       !jobDescription
//     ) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "targetRole, userSkills and jobDescription are required",
//       });
//     }

//     const aiResult = await analyzeWithAI({
//       targetRole,
//       userSkills,
//       experienceLevel: experienceLevel || "Beginner",
//       jobDescription,
//     });

//     const savedResult = await SkillGap.create({
//       userId: id,

//       targetRole,
//       jobDescription,
//       userSkills,

//       requiredSkills: aiResult.requiredSkills,
//       matchedSkills: aiResult.matchedSkills,
//       missingSkills: aiResult.missingSkills,

//       score: aiResult.matchPercentage,

//       experienceLevel:
//         experienceLevel || "Beginner",

//       recommendation: aiResult.recommendation,

//       roadmap: aiResult.roadmap,

//       modelUsed: "gemini-2.5-flash-lite",
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Skill Gap Analysis Saved",

//       data: savedResult,
//     });
//   } catch (err) {
//     console.error("Controller Error:", err);

//     return res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

// module.exports = {
//   analyzeSkillGapAI,
// };
const Profile = require("../models/Profile");
const axios = require("axios");
const pdfParse = require("pdf-parse");
const { analyzeWithAI } = require("../utils/skillGapgemini");

const analyzeSkillGapAI = async (req, res) => {
  try {
    const { id } = req.params;
    const { jobDescription, targetRole } = req.body;

    // 1️⃣ Get profile
    const profile = await Profile.findOne({ user: id });

    if (!profile || !profile.resumeUrl) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    // 2️⃣ Download PDF
    const response = await axios.get(profile.resumeUrl, {
      responseType: "arraybuffer",
    });

    const buffer = Buffer.from(response.data);

    // 3️⃣ Extract text from PDF
    const data = await pdfParse(buffer);
    const resumeText = data.text;

    // 4️⃣ OPTIONAL: convert resume text → skills (simple version)
    const userSkills = resumeText
      .split("\n")
      .filter((line) => line.toLowerCase().includes("skill"))
      .join(", ");

    // 5️⃣ AI ANALYSIS
    const aiResult = await analyzeWithAI({
      targetRole,
      userSkills: userSkills || resumeText.slice(0, 500),
      experienceLevel: profile.experienceLevel || "Beginner",
      jobDescription,
    });

    // 6️⃣ RESPONSE
    return res.status(200).json({
      success: true,
      data: aiResult,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  analyzeSkillGapAI,
};