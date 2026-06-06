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
${resumeText || "No resume provided"}

Rules:
- Ask exactly 15 questions
- 10 skill-based questions
- 5 project-based questions
- Return ONLY valid JSON array

Format:
[
  { "question": "..." }
]
`;

    const result = await model.generateContent(prompt);
    let response = result.response.text();

    // remove markdown safely
    response = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const start = response.indexOf("[");
    const end = response.lastIndexOf("]");

    if (start === -1 || end === -1) {
      throw new Error("Invalid JSON from Gemini");
    }

    const jsonString = response.slice(start, end + 1);

    try {
      return JSON.parse(jsonString);
    } catch (err) {
      console.log("JSON parse failed fallback");

      return [{ question: "Tell me about your project experience." }];
    }
  } catch (error) {
    console.error("Gemini Error:", error);

    return [{ question: "Tell me about yourself." }];
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
        `Q${i + 1}: ${q.question}\nAnswer: ${q.answer || "No answer"}`
    )
    .join("\n\n");

  const prompt = `
You are an expert interviewer.

Return ONLY valid JSON. No markdown.

STRICT FORMAT:
{
  "score": number,
  "summary": "string",
  "feedback": [
    {
      "questionId": number,
      "feedback": "string",
      "score": number
    }
  ]
}

Rules:
- score 0–10
- feedback max 2 lines
- MUST match number of questions

Interview:
${formattedQA}
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, "").trim();

    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (!jsonMatch) return fallback(questions);

    const parsed = JSON.parse(jsonMatch[0]);

    return parsed;
  } catch (err) {
    console.log("EVALUATION ERROR:", err.message);
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
