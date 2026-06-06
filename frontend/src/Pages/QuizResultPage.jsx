import { useEffect, useState } from "react";
import axios from "axios";
import { Check, X, Award, PieChart, AlertTriangle } from "lucide-react";
import Navbar from "../Components/Navbar";

const QuizResultPage = () => {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: false,
  });

  const [activeFilter, setActiveFilter] = useState("all");
  const quizId = localStorage.getItem("quizId");

  useEffect(() => {
    const controller = new AbortController();

    const fetchResult = async () => {
      try {
        setState({ data: null, loading: true, error: false });

        const res = await axios.get(
          `http://localhost:8989/assignment/results/${quizId}`,
          { signal: controller.signal }
        );

        setState({
          data: res.data?.data || null,
          loading: false,
          error: false,
        });
      } catch (err) {
        if (axios.isCancel(err)) return;
        setState({ data: null, loading: false, error: true });
      }
    };

    if (quizId) fetchResult();
    return () => controller.abort();
  }, [quizId]);

  const { data, loading, error } = state;

  /* ---------------- LOADING SKELETON ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-white animate-pulse">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="w-1/3 h-8 bg-emerald-50 rounded-xl" />
          <div className="flex gap-4">
            <div className="w-40 h-20 bg-emerald-50 rounded-xl" />
            <div className="w-40 h-20 bg-emerald-50 rounded-xl" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="w-full h-32 bg-emerald-50/50 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- ERROR STATE ---------------- */
  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 bg-white">
        <div className="w-full max-w-sm p-8 text-center border shadow-sm rounded-2xl border-emerald-100">
          <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-rose-500" />
          <h2 className="text-xl font-bold">Failed to load results</h2>
          <p className="mt-1 mb-6 text-sm text-slate-500">
            Something went wrong while fetching your quiz report.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-2 font-medium text-white transition-colors bg-emerald-500 rounded-xl hover:bg-emerald-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const filteredAnswers =
    data.answers?.filter((item) => {
      if (activeFilter === "correct") return item.isCorrect;
      if (activeFilter === "incorrect") return !item.isCorrect;
      return true;
    }) || [];

  return (
    <>
      <Navbar />
      <div className="min-h-screen p-6 bg-white text-slate-800">
        
        {/* HEADER */}
        <div className="max-w-5xl mx-auto mb-8">
          <div className="flex flex-col justify-between gap-4 pb-6 border-b sm:flex-row sm:items-center border-emerald-100">
            <div>
              <h1 className="text-3xl font-bold">Quiz Result</h1>
              <p className="text-sm text-slate-500">
                Review your performance and answers
              </p>
            </div>
          </div>

          {/* METRICS */}
          <div className="flex gap-4 mt-6">
            <div className="flex items-center gap-4 p-4 bg-white border shadow-sm rounded-xl border-emerald-100">
              <Award className="w-6 h-6 text-emerald-500" />
              <div>
                <p className="text-xs font-medium text-slate-400">Total Correct</p>
                <p className="font-mono text-2xl font-bold">{data.score}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white border shadow-sm rounded-xl border-emerald-100">
              <PieChart className="w-6 h-6 text-emerald-500" />
              <div>
                <p className="text-xs font-medium text-slate-400">Overall Performance</p>
                <p className="font-mono text-2xl font-bold">{data.percentage}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* FILTER BAR */}
        <div className="max-w-5xl mx-auto mb-6">
          <div className="inline-flex p-1 border rounded-xl bg-emerald-50 border-emerald-100">
            {["all", "correct", "incorrect"].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg capitalize transition-all ${
                  activeFilter === filter
                    ? "bg-emerald-500 text-white shadow-sm"
                    : "text-emerald-700 hover:bg-white/60"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* QUESTIONS LIST */}
        <div className="max-w-5xl mx-auto space-y-4">
          {filteredAnswers.length === 0 ? (
            <div className="py-10 text-center border border-dashed rounded-xl border-emerald-200">
              <p className="text-sm text-slate-500">
                No results found for this filter
              </p>
            </div>
          ) : (
            filteredAnswers.map((item, index) => (
              <div
                key={item._id || `q-${index}`}
                className="p-5 bg-white border shadow-sm rounded-xl border-emerald-100"
              >
                {/* QUESTION STATUS HEADER */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold tracking-wider uppercase text-slate-400">
                    Question {index + 1}
                  </span>

                  <span
                    className={`flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full ${
                      item.isCorrect
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-rose-50 text-rose-700"
                    }`}
                  >
                    {item.isCorrect ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <X className="w-3.5 h-3.5" />
                    )}
                    {item.isCorrect ? "Correct" : "Incorrect"}
                  </span>
                </div>

                {/* QUESTION TEXT */}
                <h3 className="mb-4 text-base font-semibold text-slate-900">
                  {item.question}
                </h3>

                {/* ANSWERS CONTAINER */}
                <div className="space-y-3">
                  
                  {/* USER'S SELECTION */}
                  <div className="flex gap-3 p-3 text-sm border rounded-xl bg-slate-50 border-slate-100">
                    <div
                      className={`w-6 h-6 flex items-center justify-center rounded-full shrink-0 ${
                        item.isCorrect ? "bg-emerald-100" : "bg-rose-100"
                      }`}
                    >
                      {item.isCorrect ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-rose-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-400">Your Answer</p>
                      <p
                        className={`font-semibold mt-0.5 ${
                          item.isCorrect ? "text-emerald-700" : "text-rose-700"
                        }`}
                      >
                        {item.userAnswer || "No Answer Selected"}
                      </p>
                    </div>
                  </div>

                  {/* CORRECT ANSWER (Shown only if user was incorrect) */}
                  {!item.isCorrect && (
                    <div className="flex gap-3 p-3 text-sm border rounded-xl bg-emerald-50/30 border-emerald-100">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 shrink-0">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-400">Correct Answer</p>
                        <p className="font-semibold text-emerald-700 mt-0.5">
                          {item.correctAnswer}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* EXPLANATION SECTION */}
                  {item.explanation && (
                    <div className="p-3 mt-4 text-sm leading-relaxed border bg-slate-50/60 rounded-xl border-slate-100 text-slate-600">
                      <span className="font-bold text-emerald-800 mr-1.5">
                        Explanation:
                      </span>
                      {item.explanation}
                    </div>
                  )}

                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default QuizResultPage;