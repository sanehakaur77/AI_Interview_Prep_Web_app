const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateQuestions = async ({
  jobRole,
  experience,
  interviewType,
  resumeText,
}) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
    });

    const prompt = `
You are an expert interviewer.

Create a ${interviewType || "general"} interview for a ${jobRole} with ${experience} experience.

Use the resume below:
${resumeText}

Rules:
- Ask exactly 3 questions
- 1 skill-based questions- programming concepts mentioned in resume
- 2 project-based questions (from resume) 
- Do NOT give answers
- Keep questions short
- Return ONLY JSON array

Format:
[
  { "question": "..." },
  { "question": "..." }
]
`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    const cleanText = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let questions;

    try {
      questions = JSON.parse(cleanText);
    } catch (err) {
      console.log("JSON parse failed, fallback used");

      // fallback: return raw text as array
      questions = [{ question: cleanText }];
    }

    return questions;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("AI question generation failed");
  }
};
// evaluate
const evaluateInterview = async (questions) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
  });

  const formattedQA = questions
    .map(
      (q, i) =>
        `ID:${i}
Question: ${q.question}
Answer: ${q.answer || "No answer"}`,
    )
    .join("\n\n");

  const prompt = `
You are an expert technical interviewer.

Return ONLY valid JSON.

STRICT FORMAT:
{
  "results": [
    {
      "id": 0,
      "score": 0,
      "feedback": "string feedback"
    }
  ],
  "summary": "overall summary"
}

RULES:
- score must be 0-10
- feedback must be 1-2 lines only
- MUST return same number of results as input
- NO markdown, NO extra text

Interview:
${formattedQA}
`;

  const result = await model.generateContent(prompt);

  const text = result.response.text().trim();

  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");

  if (start === -1 || end === -1) {
    return fallback(questions);
  }

  const clean = text.slice(start, end + 1);

  try {
    return JSON.parse(clean);
  } catch (err) {
    console.log("RAW GEMINI OUTPUT:", text);
    return fallback(questions);
  }
};

const fallback = (questions) => {
  return {
    results: questions.map((_, i) => ({
      id: i,
      score: 5,
      feedback: "Evaluation failed, fallback used",
    })),
    summary: "Fallback evaluation applied",
  };
};

module.exports = { generateQuestions, evaluateInterview };
