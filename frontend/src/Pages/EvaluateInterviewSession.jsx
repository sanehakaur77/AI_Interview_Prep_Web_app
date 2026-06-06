import { useEffect, useState, useRef } from "react";
import confetti from "canvas-confetti";
import {
  TrendingUp,
  Target,
  MessageSquare,
  Award,
  CornerDownRight,
  CheckCircle,
  HelpCircle,
} from "lucide-react";
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
        console.log(res);

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
    <div className="min-h-screen font-sans antialiased bg-emerald-50/20 text-emerald-950 selection:bg-emerald-100 selection:text-emerald-500">
      {/* WHITE MINIMAL TOP NAV */}
      <nav className="sticky top-0 z-50 bg-white border-b shadow-sm border-emerald-100">
        <div className="flex items-center justify-between h-16 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="logo"
              className="object-contain w-30 h-30"
            />
            <span className="text-emerald-200">/</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-xl shadow-sm">
            <CheckCircle size={14} className="text-emerald-600" />
            AI Generated Report
          </div>
        </div>
      </nav>

      {/* TWO-COLUMN SIDEBAR LAYOUT */}
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid items-start grid-cols-1 gap-8 lg:grid-cols-12">
          {/* STICKY LEFT COLUMN (METRICS PANEL) */}
          <aside className="space-y-6 lg:col-span-4 lg:sticky lg:top-24">
            {/* SCORE CARD */}
            <div className="relative p-6 overflow-hidden bg-white border shadow-md border-emerald-100 shadow-emerald-100/40 rounded-3xl">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-600" />

              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-black tracking-tight text-emerald-500">
                    Total Performance
                  </h2>
                </div>
                <Award className="text-emerald-300" size={24} />
              </div>

              {/* Progress Circle Container */}
              <div className="flex flex-col items-center justify-center py-6 border bg-emerald-50/30 rounded-2xl border-emerald-50">
                <div className="relative flex items-center justify-center">
                  <svg className="-rotate-90 w-36 h-36 filter drop-shadow-sm">
                    <circle
                      cx="72"
                      cy="72"
                      r="62"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-white"
                      stroke="currentColor"
                    />
                    <circle
                      cx="72"
                      cy="72"
                      r="62"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={389.5}
                      strokeDashoffset={
                        389.5 - (389.5 * (data?.overallScore || 0)) / 100
                      }
                      className="transition-all duration-1000 ease-out text-emerald-600"
                      strokeLinecap="round"
                      stroke="currentColor"
                    />
                  </svg>
                  <span className="absolute text-3xl font-black tracking-tight text-emerald-500">
                    {data?.overallScore}%
                  </span>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-xs font-bold tracking-wider uppercase text-emerald-700/80">
                    Overall Performance
                  </p>
                </div>
              </div>
            </div>

            {/* EXECUTIVE SUMMARY PANEL */}
            <div className="relative p-6 overflow-hidden bg-white border shadow-md border-emerald-100 shadow-emerald-100/40 rounded-3xl">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
              <div className="flex items-center gap-2 mb-3 text-emerald-500">
                <Target size={16} className="text-emerald-500 stroke-[2.5]" />
                <span className="text-xs font-extrabold tracking-wider uppercase">
                  Summary
                </span>
              </div>
              <p className="text-sm italic font-medium leading-relaxed text-gray-600">
                "{data?.summary}"
              </p>
            </div>
          </aside>

          {/* SCROLLABLE RIGHT COLUMN (SEQUENCE FEED) */}
          <section className="space-y-6 lg:col-span-8">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
              <h3 className="flex items-center gap-2 text-xs font-extrabold tracking-widest uppercase text-emerald-800">
                <MessageSquare size={16} className="stroke-[2.5]" /> Interview
                Evaluation
              </h3>
            </div>

            {data?.questions?.map((q, index) => (
              <div
                key={q._id}
                className="overflow-hidden transition-all duration-300 bg-white border shadow-md border-emerald-100 shadow-emerald-100/30 rounded-3xl hover:shadow-lg hover:shadow-emerald-100/50"
              >
                {/* Header Banner Block of Question */}
                <div className="flex items-center justify-between gap-4 px-5 py-4 border-b bg-emerald-50/40 border-emerald-50">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center text-xs font-black text-white shadow-sm h-7 w-7 rounded-xl bg-emerald-600 shadow-emerald-600/20">
                      {index + 1}
                    </div>
                    <span className="text-xs font-extrabold tracking-wider uppercase text-emerald-700"></span>
                  </div>

                  {/* Embedded Inline Grading Tag */}
                  <div className="px-3 py-1.5 rounded-xl bg-white border border-emerald-100 text-xs font-bold text-emerald-800 shadow-sm">
                    Score:{" "}
                    <span className="text-sm font-black text-emerald-600">
                      {q.score}
                    </span>
                    <span className="text-emerald-300">/10</span>
                  </div>
                </div>

                <div className="p-5 space-y-5 sm:p-6">
                  {/* Question Heading Statement */}
                  <h4 className="text-base font-bold leading-snug sm:text-lg text-emerald-950">
                    {q.question}
                  </h4>

                  {/* Response & Advice Containers */}
                  <div className="space-y-4">
                    {/* The Answer Entry */}
                    <div className="flex items-start gap-3">
                      <CornerDownRight
                        size={16}
                        className="mt-1 text-emerald-300 shrink-0"
                      />
                      <div className="w-full p-4 border shadow-inner bg-emerald-50/10 border-emerald-100/40 rounded-2xl">
                        <span className="block text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider mb-1.5">
                          Submitted Answer
                        </span>
                        <p className="text-sm font-medium leading-relaxed whitespace-pre-line text-emerald-950/80">
                          {q.answer?.trim()
                            ? q.answer
                            : "No valid response captured by runtime environment platform."}
                        </p>
                      </div>
                    </div>

                    {/* The AI Feedback Advice */}
                    {q.feedback && (
                      <div className="flex items-start gap-3">
                        <div className="h-5 w-5 rounded-lg bg-emerald-600 shrink-0 mt-1 flex items-center justify-center text-[9px] text-white font-black shadow-sm shadow-emerald-600/20">
                          AI
                        </div>
                        <div className="w-full p-4 border shadow-sm bg-emerald-50/40 border-emerald-100/60 rounded-2xl">
                          <span className="flex items-center gap-1 text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider mb-1.5">
                            <TrendingUp size={12} className="stroke-[2.5]" /> AI
                            Recommendation
                          </span>
                          <p className="text-sm font-medium leading-relaxed text-emerald-500">
                            {q.feedback}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}

/* HIGH GRAPHIC EMERALD SKELETON LOADER */
function LoadingSkeleton() {
  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-white">
      <div className="w-full max-w-sm space-y-6 text-center">
        {/* Spinner */}
        <div className="w-12 h-12 mx-auto border-4 rounded-full border-emerald-100 border-t-emerald-600 animate-spin"></div>

        {/* Title */}
        <h2 className="text-lg font-semibold text-emerald-900">
          Evaluating Interview
        </h2>

        {/* Subtitle */}
        <p className="text-sm text-slate-500">
          Please wait while we process your results...
        </p>

        {/* Skeleton bars */}
        <div className="mt-6 space-y-3">
          <div className="w-full h-3 rounded-full bg-slate-100 animate-pulse"></div>

          <div className="w-5/6 h-3 rounded-full bg-slate-100 animate-pulse"></div>

          <div className="w-4/6 h-3 rounded-full bg-slate-100 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
