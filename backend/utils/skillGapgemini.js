// const { GoogleGenerativeAI } = require("@google/generative-ai");
// require("dotenv").config();

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// const model = genAI.getGenerativeModel({
//   model: "gemini-2.5-flash-lite",
// });

// const analyzeWithAI = async ({
//   targetRole,
//   userSkills,
//   experienceLevel,
//   jobDescription,
// }) => {
//   try {
//     const prompt = `
// You are a senior FAANG-level career coach.

// Analyze the candidate and return STRICT JSON ONLY.

// Target Role: ${targetRole}

// Experience Level: ${experienceLevel}

// User Skills:
// ${Array.isArray(userSkills) ? userSkills.join(", ") : userSkills}

// Job Description:
// ${jobDescription}

// Return JSON:

// {
//   "matchPercentage": 0,
//   "missingPercentage": 0,
//   "requiredSkills": [],
//   "matchedSkills": [],
//   "missingSkills": [],
//   "recommendation": "",
//   "roadmap": [
//     "step 1",
//     "step 2",
//     "step 3"
//   ]
// }

// Rules:
// - roadmap must be string array only
// - score between 0-100
// - recommendation should be personalized
// `;

//     const result = await model.generateContent(prompt);

//     const text = result.response.text();

//     const cleaned = text
//       .replace(/```json/g, "")
//       .replace(/```/g, "")
//       .trim();

//     return JSON.parse(cleaned);
//   } catch (error) {
//     console.error(error);
//     throw new Error("AI analysis failed");
//   }
// };

// module.exports = {
//   analyzeWithAI,
// };
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-lite",
});

const analyzeWithAI = async ({
  targetRole,
  userSkills,
  experienceLevel,
  jobDescription,
}) => {
  try {
    const prompt = `
You are a senior FAANG-level career coach.

Analyze the candidate and return STRICT JSON ONLY.

Target Role: ${targetRole}
Experience Level: ${experienceLevel}

User Skills:
${Array.isArray(userSkills) ? userSkills.join(", ") : userSkills}

Job Description:
${jobDescription}

Return ONLY valid JSON:

{
  "matchPercentage": 0,
  "missingPercentage": 0,
  "requiredSkills": [],
  "matchedSkills": [],
  "missingSkills": [],
  "recommendation": "",
  "roadmap": []
}

Rules:
- ONLY valid JSON, no markdown
- roadmap must be string array
- matchPercentage 0-100
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // 🔥 safer JSON cleanup
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Gemini Error:", error.message);
    throw new Error("AI analysis failed");
  }
};

module.exports = {
  analyzeWithAI,
};