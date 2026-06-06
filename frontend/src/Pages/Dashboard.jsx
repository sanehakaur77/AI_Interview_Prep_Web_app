import { useEffect, useState } from "react";
import axios from "axios";
import { 
  User, 
  GraduationCap, 
  Briefcase, 
  Award, 
  BookOpen, 
  Calendar, 
  ChevronRight, 
  Code 
} from "lucide-react";
import Navbar from "../Components/Navbar";
const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8989/dashboard/get/6a22403e54524f154f4f99b4"
        );
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className="w-10 h-10 mb-4 border-4 rounded-full border-emerald-100 border-t-emerald-600 animate-spin" />
        <p className="text-sm font-medium text-slate-500 animate-pulse">
          Loading your dashboard...
        </p>
      </div>
    );
  }

  const profile = data?.profile;
  const quizzes = data?.quizzes || [];
  const assignments = data?.assignments || [];

  return (
   <>
   <Navbar/>
    <div className="min-h-screen p-6 bg-slate-50/50 text-slate-800">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* ================= WELCOME HEADER ================= */}
        <div className="flex items-center gap-4 pb-2">
          <div className="flex items-center justify-center text-xl font-bold text-white rounded-full shadow-md w-14 h-14 bg-emerald-500 shadow-emerald-600/10">
            {profile?.fullName?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-950">
              Welcome back, {profile?.fullName?.split(" ")[0]}
            </h1>
            <p className="text-sm text-slate-500">
              Track your learning progress, quizzes, and assignments here.
            </p>
          </div>
        </div>

        {/* ================= PROFILE CARD ================= */}
        <div className="p-6 bg-white border shadow-sm border-emerald-100/60 rounded-2xl">
          <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
            <User className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900">Profile Information</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div className="p-3.5 rounded-xl bg-slate-50/60 border border-slate-100">
              <p className="text-xs font-semibold tracking-wider uppercase text-slate-400">Full Name</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">{profile?.fullName || "—"}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50/60 border border-slate-100">
              <p className="text-xs font-semibold tracking-wider uppercase text-slate-400">Branch</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">{profile?.education?.branch || "—"}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50/60 border border-slate-100">
              <p className="text-xs font-semibold tracking-wider uppercase text-slate-400">College</p>
              <p className="mt-1 text-sm font-semibold text-slate-800 line-clamp-1">{profile?.education?.college || "—"}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50/60 border border-slate-100">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                <span>Academic CGPA</span>
              </div>
              <p className="mt-1 font-mono text-base font-bold text-emerald-700">{profile?.education?.cgpa || "—"}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50/60 border border-slate-100 sm:col-span-1 md:col-span-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
                <span>Target Role</span>
              </div>
              <p className="mt-1 text-sm font-semibold text-slate-800">{profile?.targetRole || "—"}</p>
            </div>
          </div>

          {/* SKILLS CHIPS */}
          {profile?.skills && profile.skills.length > 0 && (
            <div className="pt-4 mt-5 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                <Code className="w-3.5 h-3.5 text-emerald-600" />
                <span>Core Expertise</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {profile.skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-lg border border-emerald-100/70"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ================= TWO COLUMN GRID ================= */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          
          {/* QUIZ RESULTS */}
          <div className="flex flex-col p-6 bg-white border shadow-sm border-emerald-100/60 rounded-2xl">
            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-100">
              <Award className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-slate-900">Quiz Assignments</h2>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto max-h-[400px] pr-1">
              {quizzes.length === 0 ? (
                <div className="py-12 text-center border border-dashed border-slate-200 rounded-xl">
                  <p className="text-sm font-medium text-slate-400">No quiz analytics found</p>
                </div>
              ) : (
                quizzes.map((quiz, idx) => (
                  <div
                    key={quiz._id}
                    className="flex items-center justify-between p-3.5 border border-slate-100 rounded-xl bg-slate-50/40 hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="items-center justify-center hidden text-xs font-semibold rounded-lg sm:flex w-9 h-9 bg-emerald-50 text-emerald-700">
                        #{idx + 1}
                      </div>
                      <div>
                        <p className="text-sm font-bold transition-colors text-slate-800 group-hover:text-emerald-700">
                          Quiz Assessment
                        </p>
                        <div className="flex items-center gap-1 mt-0.5 text-xs text-slate-400">
                          <Calendar className="w-3 h-3 shrink-0" />
                          <span>
                            {new Date(quiz.createdAt).toLocaleString("en-IN", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`px-3 py-1 font-mono text-xs font-bold rounded-full border shrink-0 ${
                        quiz.percentage >= 60
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-rose-50 text-rose-700 border-rose-200"
                      }`}
                    >
                      {quiz.score}/{quiz.totalQuestions} ({quiz.percentage}%)
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ASSIGNMENTS */}
          <div className="flex flex-col p-6 bg-white border shadow-sm border-emerald-100/60 rounded-2xl">
            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-100">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-slate-900">Interview Results</h2>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto max-h-[400px] pr-1">
              {assignments.length === 0 ? (
                <div className="py-12 text-center border border-dashed border-slate-200 rounded-xl">
                  <p className="text-sm font-medium text-slate-400">No Interview had been taken</p>
                </div>
              ) : (
                assignments.map((a, idx) => (
                  <div
                    key={a._id}
                    className="flex items-center justify-between p-3.5 border border-slate-100 rounded-xl bg-slate-50/40 hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="items-center justify-center hidden text-xs font-semibold rounded-lg sm:flex w-9 h-9 bg-slate-100 text-slate-600">
                        #{idx + 1}
                      </div>
                      <div>
                        <p className="text-sm font-bold transition-colors text-slate-800 group-hover:text-emerald-700">
                          Task Evaluation
                        </p>
                        <div className="flex items-center gap-1 mt-0.5 text-xs text-slate-400">
                          <Calendar className="w-3 h-3 shrink-0" />
                          <span>
                            {new Date(a.createdAt).toLocaleString("en-IN", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <div className="px-3 py-1 font-mono text-xs font-bold border rounded-full text-slate-700 bg-slate-100 border-slate-200">
                        Score: {a.score ?? "N/A"}
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
   </>
  );
};

export default Dashboard;