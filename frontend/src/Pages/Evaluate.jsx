import { useEffect, useState } from "react";
import axios from "axios";
import { RefreshCcw, MessageSquare } from "lucide-react";

const Evaluate = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchEvaluation = async () => {
      try {
        const res = await axios.post(
          "https://ai-interview-prep-web-app.onrender.com/api/resume/evaluate",
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        setData(res.data.evaluation);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEvaluation();
  }, []);

  if (!data) {
    return (
      <div
        className="h-screen flex items-center justify-center text-gray-500 
  
bg-white 
dark:bg-[#07140f]

text-slate-800 
dark:text-white
"
      >
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200">
      <div className="mx-auto max-w-7xl">
        {/* TOP NAV */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            Interview Evaluation
          </h1>

          <div className="flex items-center gap-6 text-sm">
            <span className="text-slate-500">Interview Insights</span>
            <span className="font-semibold text-emerald-600">
              Performance Report
            </span>

            <div className="flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-lg bg-emerald-100 text-emerald-700">
              Award 100
            </div>
          </div>
        </div>

        {/* OVERALL */}
        <div className="p-6 mb-8 border border-gray-200 shadow-md bg-white/70 backdrop-blur-lg rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-gray-700">Overall Performance</p>

            <button
              onClick={() => (window.location.href = "/interview")}
              className="flex items-center gap-2 text-sm bg-white border px-3 py-1.5 rounded-md shadow-sm hover:bg-gray-50"
            >
              <RefreshCcw size={14} />
              Try Again
            </button>
          </div>

          <div className="flex items-center gap-6">
            {/* CIRCLE */}
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 rounded-full border-[8px] border-gray-200"></div>
              <div
                className="absolute inset-0 rounded-full border-[8px] border-emerald-500"
                style={{
                  clipPath: `inset(${100 - data.overallScore}% 0 0 0)`,
                }}
              ></div>

              <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-slate-800">
                {data.overallScore}%
              </div>
            </div>

            {/* TEXT */}
            <div className="flex-1">
              <h2 className="mb-2 font-semibold text-slate-800">
                Overall Assessment
              </h2>

              <div className="relative p-4 text-sm text-gray-600 bg-gray-100 rounded-lg">
                <MessageSquare
                  size={16}
                  className="absolute text-gray-400 right-3 top-3"
                />
                {data.overallFeedback}
              </div>
            </div>
          </div>
        </div>

        {/* QUESTION SECTION */}
        <p className="mb-4 text-sm font-semibold text-gray-500 uppercase">
          Question Breakdown
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.results.map((item, i) => (
            <div
              key={i}
              className="p-5 transition border border-gray-200 shadow-sm bg-white/80 backdrop-blur-md rounded-2xl hover:shadow-md"
            >
              {/* HEADER */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-400">
                  STEP {i + 1}
                </span>
                <span className="text-sm font-bold text-slate-800">
                  {item.score}/10
                </span>
              </div>

              {/* QUESTION */}
              <h3 className="mb-3 text-sm font-semibold text-slate-800">
                {item.question}
              </h3>

              {/* RESPONSE */}
              <div className="p-3 mb-3 text-xs text-gray-600 bg-gray-100 rounded-lg">
                <p className="mb-1 font-semibold text-gray-700">
                  Candidate Response
                </p>
                {item.answer || "No response"}
              </div>

              {/* STRENGTH + WEAKNESS */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="p-2 text-xs rounded-md bg-emerald-100">
                  <p className="font-semibold text-emerald-700">Strength</p>
                  <p className="mt-1 text-gray-700">
                    {item.strengths || "Good understanding"}
                  </p>
                </div>

                <div className="p-2 text-xs bg-red-100 rounded-md">
                  <p className="font-semibold text-red-600">Weakness</p>
                  <p className="mt-1 text-gray-700">{item.weaknesses}</p>
                </div>
              </div>

              {/* FOOTER */}
              <p className="text-xs text-gray-500">
                <span className="font-semibold">Expert Note: </span>
                {item.feedback}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Evaluate;
