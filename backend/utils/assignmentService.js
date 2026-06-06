const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

const generateFromGemini = async ({
  company,
  role,
  experienceLevel,
  topics,
  difficulty,
}) => {
  try {
   const prompt = `
You are an expert technical interviewer from ${company}.

Generate a technical quiz for:

Role: ${role}
Experience Level: ${experienceLevel}
Difficulty: ${difficulty}
Topic: ${topics}

Rules:
- Generate exactly 10 multiple-choice questions
- Questions should be interview-oriented
- Match the difficulty level
- Each question must have 4 options
- Only one correct answer
- Include a short explanation

Return ONLY valid JSON:

{
  "questions": [
    {
      "question": "What is React?",
      "options": [
        "Database",
        "JavaScript Library",
        "Operating System",
        "Programming Language"
      ],
      "correctAnswer": "JavaScript Library",
      "explanation": "React is a JavaScript library used for building user interfaces."
    }
  ]
}
`;
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent(prompt);

    const response = result.response.text();

  
    const clean = JSON.parse(
      response.replace(/```json|```/g, "").trim()
    );

    return clean;
  } catch (error) {
    console.error("Gemini Service Error:", error.message);
    throw new Error("AI generation failed");
  }
};
const evaluateWithGemini = async (quiz, answers) => {
  const prompt = `
You are an expert technical quiz evaluator.

QUESTIONS:
${JSON.stringify(quiz.questions)}

USER ANSWERS:
${JSON.stringify(answers)}

Instructions:
1. Compare each user answer with the correct answer.
2. Calculate the final score.
3. For EVERY question return:
   - question
   - correctAnswer
   - userAnswer
   - isCorrect
   - explanation
4. If the answer is WRONG:
   - Explain WHY it is wrong.
   - Explain WHY the correct answer is correct.
   - Keep explanation beginner-friendly (2-4 sentences).
5. If the answer is CORRECT:
   - Give a short explanation of why it is correct.
6. Return ONLY valid JSON.
7. Do not include markdown, backticks, or extra text.

Return format:

{
  "score": number,
  "feedback": [
    {
      "question": "question text",
      "correctAnswer": "correct answer",
      "userAnswer": "user answer",
      "isCorrect": true,
      "explanation": "detailed explanation"
    }
  ]
}
`;

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const result = await model.generateContent(prompt);
  const response = result.response.text();

  return JSON.parse(
    response.replace(/```json|```/g, "").trim()
  );
};
module.exports = {
  generateFromGemini,
  evaluateWithGemini
};