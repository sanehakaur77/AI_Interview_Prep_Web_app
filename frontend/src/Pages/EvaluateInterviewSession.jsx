import { useEffect, useState, useRef } from "react";
import confetti from "canvas-confetti";
import { TrendingUp, Target, MessageSquare, Award } from "lucide-react";
import { useParams } from "react-router-dom";

export default function EvaluateInterviewSession() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const { sessionId } = useParams();
  const hasCelebrated = useRef(false);

  const url = `http://localhost:8989/session/result/${sessionId}`;

  useEffect(() => {
    let interval;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.log("Interview still evaluating...");
          return;
        }

        const json = await res.json();

        if (json?.data) {
          setData(json.data);
          setLoading(false);

          // 🎉 CELEBRATION LOGIC
          if (json.data.overallScore > 70 && !hasCelebrated.current) {
            hasCelebrated.current = true;

            confetti({
              particleCount: 180,
              spread: 90,
              origin: { y: 0.6 },
            });

            setTimeout(() => {
              confetti({
                particleCount: 100,
                angle: 60,
                spread: 60,
                origin: { x: 0 },
              });

              confetti({
                particleCount: 100,
                angle: 120,
                spread: 60,
                origin: { x: 1 },
              });
            }, 300);
          }

          clearInterval(interval);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
    interval = setInterval(fetchData, 3000);

    return () => clearInterval(interval);
  }, [url]);

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 text-slate-900">
      {/* HEADER */}
      <div className="sticky top-0 z-10 mb-8 border-b backdrop-blur-md bg-white/70 border-slate-200/60">
        <div className="flex items-center justify-between max-w-6xl px-6 py-4 mx-auto">
          <h1 className="text-xl font-bold text-emerald-600">
            InsightAI | Evaluation
          </h1>

          <div className="text-xs text-slate-500">
            Session ID: ...{data?._id?.slice(-8)}
          </div>
        </div>
      </div>

      <main className="max-w-6xl px-6 mx-auto">
        {/* SCORE CARD */}
        <div className="grid gap-6 mb-8 lg:grid-cols-3">
          <div className="relative flex flex-col items-center justify-center p-8 bg-white border shadow-sm rounded-3xl border-slate-100">
            <Award
              size={70}
              className="absolute text-emerald-500 opacity-20 top-4 right-4"
            />

            <p className="mb-4 text-slate-500">Overall Performance</p>

            <div className="relative flex items-center justify-center">
              <svg className="w-32 h-32 -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-slate-100"
                  stroke="currentColor"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={364.4}
                  strokeDashoffset={364.4 - (364.4 * data?.overallScore) / 100}
                  className="text-emerald-500"
                  stroke="currentColor"
                />
              </svg>

              <span className="absolute text-3xl font-bold">
                {data?.overallScore}%
              </span>
            </div>
          </div>

          {/* SUMMARY */}
          <div className="p-8 bg-white shadow-xl lg:col-span-2 rounded-3xl">
            <div className="flex items-center gap-2 mb-4 text-emerald-500">
              <Target size={20} />
              <span className="text-sm font-semibold uppercase">
                Executive Summary
              </span>
            </div>

            <p className="text-lg italic">"{data?.summary}"</p>
          </div>
        </div>

        {/* QUESTIONS */}
        <div className="space-y-6">
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <MessageSquare className="text-emerald-500" />
            Question-wise Breakdown
          </h2>

          {data?.questions?.map((q, index) => (
            <div
              key={q._id}
              className="p-6 bg-white border shadow-sm rounded-2xl"
            >
              <div className="flex justify-between mb-4">
                <div>
                  <span className="text-xs font-bold text-emerald-500">
                    Question {index + 1}
                  </span>
                  <h3 className="text-lg font-semibold">{q.question}</h3>
                </div>

                <div className="px-4 py-2 bg-emerald-50 rounded-xl">
                  <span className="font-bold text-emerald-700">
                    {q.score}/10
                  </span>
                </div>
              </div>

              <div className="p-4 mb-4 rounded-xl bg-slate-50">
                <p className="mb-2 text-xs font-bold">Candidate Response</p>
                <p>{q.answer?.trim() ? q.answer : "No response captured"}</p>
              </div>

              {q.feedback && (
                <div className="flex gap-3 p-4 rounded-xl bg-emerald-50">
                  <TrendingUp className="text-emerald-600" />
                  <div>
                    <p className="text-xs font-bold">AI Recommendation</p>
                    <p>{q.feedback}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

/* LOADING */
function LoadingSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-50">
      <div className="relative">
        <div className="w-20 h-20 border-4 rounded-full border-emerald-100"></div>
        <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent rounded-full border-t-emerald-500 animate-spin"></div>
      </div>

      <h2 className="mt-8 text-2xl font-bold text-emerald-600">
        AI is Evaluating Your Interview
      </h2>

      <p className="mt-2 text-slate-500">
        Please wait while we analyze your responses...
      </p>
    </div>
  );
}
