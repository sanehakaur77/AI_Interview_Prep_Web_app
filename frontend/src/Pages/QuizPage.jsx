import { useState } from "react";
import axios from "axios";
import { 
  Building2, 
  Briefcase, 
  BookOpen, 
  BarChart, 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  Award, 
  Target, 
  RefreshCw 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from '../Components/Navbar'
const QuizPage = () => {
  const userId=localStorage.getItem("userId");
  const quizId=localStorage.getItem("quizId");
  const [formData, setFormData] = useState({
    company: "",
    targetRole: "",
    experienceLevel: "fresher",
    topics: "",
    difficulty: "easy",
  });

  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const navigate=useNavigate();

  const getUserId = () => localStorage.getItem("userId") || "6a202b5bc95633b52e52e009";

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const generateQuiz = async () => {
    try {
      setLoading(true);
      const currentUserId = getUserId();
      const res = await axios.post(
        `http://localhost:8989/assignment/generate/${userId}`,
        formData
      );

      if (res.data.success && res.data.data) {
        localStorage.setItem("quizId", res.data.data._id);
        setQuiz(res.data.data);
        setAnswers({});
        setResult(null);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to generate quiz");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
  };

  const submitQuiz = async () => {
    if (!quiz) return;

    const unanswered = quiz.questions.filter((_, index) => !answers[index]);
    if (unanswered.length > 0) {
      alert(`Please answer all questions before submitting.`);
      return;
    }

    try {
      setSubmitting(true);
      const currentUserId = getUserId();
      const payload = {
        answers: quiz.questions.map((_, index) => ({
          questionIndex: index,
          selectedAnswer: answers[index],
        })),
      };

      const res = await axios.post(
        `http://localhost:8989/assignment/submit/${quizId}/${userId}`,
        payload
      );
      if (res.data.success) {
        navigate(`/quiz-results/${quizId}`);
        setResult(res.data.data);
      }
    } catch (err) {
      console.error(err);
      alert("Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  const resetAll = () => {
    setQuiz(null);
    setAnswers({});
    setResult(null);
  };

  // =========================
  // LOADING STATE DETAILED
  // =========================
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-white">
        <div className="flex flex-col items-center max-w-sm text-center">
          <div className="p-4 mb-4 rounded-full bg-emerald-50 text-emerald-500 animate-spin">
            <Loader2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Generating Your Quiz</h2>
          <p className="mt-2 text-sm text-slate-500 animate-pulse">
            Please Quiz is generating .....
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // RESULT SCREEN DESIGNED
  // =========================
  if (result) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-slate-50/50 sm:p-6">
        <div className="w-full max-w-2xl p-6 bg-white border shadow-sm border-slate-100 rounded-2xl sm:p-8">
          <div className="flex flex-col items-center text-center">
            <div className="p-3.5 bg-emerald-50 text-emerald-500 rounded-2xl mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Quiz Evaluated!
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Review your overall assignment performance metrics summary below.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="p-4 border bg-white border-slate-100 rounded-xl shadow-sm flex items-center gap-3.5">
              <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-600">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs font-medium tracking-wider uppercase text-slate-400">Score</span>
                <span className="font-mono text-xl font-bold text-slate-900">
                  {result.score} / {result.totalQuestions}
                </span>
              </div>
            </div>

            <div className="p-4 border bg-white border-slate-100 rounded-xl shadow-sm flex items-center gap-3.5">
              <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-600">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs font-medium tracking-wider uppercase text-slate-400">Accuracy</span>
                <span className="font-mono text-xl font-bold text-slate-900">{result.percentage}%</span>
              </div>
            </div>
          </div>

          <button
            onClick={resetAll}
            className="flex items-center justify-center w-full gap-2 px-4 py-3 mt-8 font-semibold text-white transition-all duration-200 shadow-sm bg-emerald-500 hover:bg-emerald-600 rounded-xl"
          >
            <RefreshCw className="w-4 h-4" />
            Configure New Quiz
          </button>
        </div>
      </div>
    );
  }

  // =========================
  // ACTIVE QUIZ INTERFACE
  // =========================
  if (quiz) {
    return (
      <div className="min-h-screen p-4 antialiased bg-slate-50/50 sm:p-6">
        <div className="max-w-3xl mx-auto mb-6">
          <div className="p-5 bg-white border shadow-sm border-emerald-100 rounded-2xl">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900">
                  {quiz.company || "Target Assessment"}
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">{quiz.targetRole}</p>
              </div>
              <span className="self-start px-3 py-1 text-xs font-semibold tracking-wide capitalize border rounded-full sm:self-auto bg-emerald-50 text-emerald-700 border-emerald-100">
                Difficulty: {quiz.difficulty}
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {quiz.questions.map((q, index) => (
            <div key={index} className="p-5 bg-white border shadow-sm border-slate-200/80 rounded-2xl">
              <span className="block mb-2 text-xs font-bold tracking-wider uppercase text-slate-400">
                Question {index + 1}
              </span>
              <h3 className="mb-4 text-base font-semibold leading-snug text-slate-900">
                {q.question}
              </h3>

              <div className="grid gap-2.5">
                {q.options.map((opt, i) => {
                  const isSelected = answers[index] === opt;
                  return (
                    <label
                      key={i}
                      className={`flex items-center gap-3 p-3.5 border rounded-xl cursor-pointer transition-all duration-150 text-sm font-medium ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-50/40 text-emerald-900 shadow-sm"
                          : "border-slate-200 text-slate-700 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q-${index}`}
                        checked={isSelected}
                        onChange={() => handleAnswerChange(index, opt)}
                        className="w-4 h-4 text-emerald-500 border-slate-300 focus:ring-emerald-400"
                      />
                      <span>{opt}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}

          <button
            onClick={submitQuiz}
            disabled={submitting}
            className="flex items-center justify-center w-full p-3.5 mt-6 font-semibold text-white transition-all duration-200 shadow-sm bg-emerald-500 hover:bg-emerald-600 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Evaluating System Criteria...
              </>
            ) : (
              "Submit Answers"
            )}
          </button>
        </div>
      </div>
    );
  }

  // =========================
  // SETUP / GENERATE VIEW
  // =========================
  return (
    <div className="flex items-center justify-center min-h-screen p-4 antialiased bg-slate-50/50 sm:p-6">
      <div className="w-full max-w-xl p-6 bg-white border shadow-sm border-slate-200/80 rounded-2xl sm:p-8">
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Generate AI Quiz
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Define parameter sets below to extract automated evaluation questions.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold tracking-wider uppercase text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              Company
            </label>
            <input
              name="company"
              type="text"
              placeholder="e.g. Google, Stripe"
              onChange={handleChange}
              value={formData.company}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition duration-150"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-wider uppercase text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
              Target Role
            </label>
            <input
              name="targetRole"
              type="text"
              placeholder="e.g. Frontend Engineer"
              onChange={handleChange}
              value={formData.targetRole}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition duration-150"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-wider uppercase text-slate-400 mb-1.5 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              Topics
            </label>
            <input
              name="topics"
              type="text"
              placeholder="e.g. React hooks, Redux architecture"
              onChange={handleChange}
              value={formData.topics}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition duration-150"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-wider uppercase text-slate-400 mb-1.5 flex items-center gap-1.5">
              <BarChart className="w-3.5 h-3.5 text-slate-400" />
              Difficulty Level
            </label>
            <div className="relative">
              <select
                name="difficulty"
                onChange={handleChange}
                value={formData.difficulty}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition duration-150 cursor-pointer"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <button
            onClick={generateQuiz}
            className="flex items-center justify-center w-full gap-2 p-3.5 mt-2 font-semibold text-white transition-all duration-200 shadow-sm bg-emerald-500 hover:bg-emerald-600 rounded-xl"
          >
            <Sparkles className="w-4 h-4" />
            Generate Assessment
          </button>
        </div>

      </div>
    </div>
  );
};

export default QuizPage;