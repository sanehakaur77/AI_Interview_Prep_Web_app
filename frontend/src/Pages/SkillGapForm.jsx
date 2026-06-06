import React, { useState } from "react";
import axios from "axios";
import {
  Briefcase,
  Target,
  CheckCircle,
  XCircle,
  TrendingUp,
  Award,
  BookOpen,
  Sparkles,
  Loader2,
} from "lucide-react";

import Navbar from "../Components/Navbar";

/* -------------------------------------------------------------------------- */
/* SUB-COMPONENTS                              */
/* -------------------------------------------------------------------------- */

const Header = () => (
  <div className="py-6 text-center sm:py-14">
    <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 text-xs font-semibold tracking-wide uppercase border rounded-full bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm">
      <Sparkles size={14} className="animate-pulse" />
      AI Intelligence Suite
    </div>
    <h1 className="text-3xl font-black tracking-tight text-gray-900 sm:text-5xl">
      Skill Gap <span className="text-emerald-600">Analyzer</span>
    </h1>
    <p className="max-w-xl mx-auto mt-3 text-base text-gray-500 sm:text-lg">
      Instantly benchmark your background against market requirements with custom ATS parsing and smart roadmap generation.
    </p>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-gray-200 shadow-sm rounded-2xl min-h-[400px]">
    <div className="p-4 mb-4 rounded-full bg-emerald-50 text-emerald-600">
      <Target size={32} />
    </div>
    <h3 className="text-lg font-bold text-gray-900">Awaiting Analysis</h3>
    <p className="max-w-xs mt-2 text-sm text-gray-500">
      Fill out the target job profile details to generate your tailored skill gap and alignment matrix.
    </p>
  </div>
);

const StatCard = ({ icon: Icon, title, count, iconColor, bgIcon }) => (
  <div className="flex items-center justify-between p-5 transition bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md">
    <div>
      <p className="text-2xl font-black tracking-tight text-gray-900">{count}</p>
      <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase mt-0.5">{title}</p>
    </div>
    <div className={`p-2.5 rounded-lg ${bgIcon}`}>
      <Icon className={iconColor} size={20} />
    </div>
  </div>
);

const SkillGroup = ({ title, skills = [], badgeClass }) => (
  <div className="p-5 bg-white border border-gray-100 shadow-sm rounded-xl">
    <h3 className="mb-3 text-xs font-bold tracking-wider text-gray-500 uppercase">{title}</h3>
    <div className="flex flex-wrap gap-2">
      {skills && skills.length > 0 ? (
        skills.map((skill, index) => (
          <span key={index} className={`px-2.5 py-1 text-xs font-medium border rounded-md shadow-sm ${badgeClass}`}>
            {skill}
          </span>
        ))
      ) : (
        <span className="text-xs italic text-gray-400">No core skills identified</span>
      )}
    </div>
  </div>
);

const AnalysisResult = ({ result }) => {
  const matchedCount = result.matchedSkills?.length || 0;
  const missingCount = result.missingSkills?.length || 0;
  const requiredCount = result.requiredSkills?.length || 0;
  const matchScore = result.score || result.matchPercentage || 0;

  return (
    <div className="space-y-6">
      {/* SCORE CARD */}
      <div className="flex items-center justify-between p-6 text-white shadow-lg shadow-xl bg-neutral-50 rounded-2xl">
        <div>
          <span className="text-xs font-bold tracking-widest uppercase text-emerald-400">Analysis Profile</span>
          <h2 className="mt-1 text-2xl font-black tracking-tight">{result.targetRole}</h2>
          <p className="text-sm text-slate-300 mt-0.5 font-medium">{result.experienceLevel} Track</p>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-4xl font-black tracking-tighter text-emerald-400">
            {matchScore}%
          </div>
          <span className="text-[10px] uppercase tracking-widest text-slate-400 mt-1 font-bold">Skills Match</span>
        </div>
      </div>

      {/* STATS MATRIX */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={CheckCircle} title="Matched Skills" count={matchedCount} iconColor="text-emerald-600" bgIcon="bg-emerald-50" />
        <StatCard icon={XCircle} title="Missing Gaps" count={missingCount} iconColor="text-rose-600" bgIcon="bg-rose-50" />
        <StatCard icon={Award} title="Total Required" count={requiredCount} iconColor="text-indigo-600" bgIcon="bg-indigo-50" />
      </div>

      {/* SKILL COMPARISON DECK */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SkillGroup title="Matched Capabilities" skills={result.matchedSkills} badgeClass="bg-emerald-50 border-emerald-200 text-emerald-700" />
        <SkillGroup title="Identified Gaps" skills={result.missingSkills} badgeClass="bg-rose-50 border-rose-200 text-rose-700" />
      </div>

      {/* EXECUTIVE RECOMMENDATION */}
      {result.recommendation && (
        <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="flex items-center gap-2 mb-2 text-emerald-600">
            <TrendingUp size={18} />
            <h3 className="text-sm font-bold text-gray-900">Executive Summary</h3>
          </div>
          <p className="text-sm font-medium leading-relaxed text-gray-600">{result.recommendation}</p>
        </div>
      )}

   {/* ACTIONABLE ROADMAP */}
{result.roadmap && result.roadmap.length > 0 && (
  <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-xl">
    <div className="flex items-center gap-2 mb-3 text-emerald-700">
      <BookOpen size={18} />
      <h3 className="text-sm font-bold text-gray-900">Roadmap</h3>
    </div>
    <ol className="space-y-3">
      {result.roadmap.map((step, index) => (
        <li key={index} className="flex gap-4 p-3.5 rounded-lg bg-emerald-50/50 border border-emerald-100 transition hover:bg-emerald-50">
          <span className="flex items-center justify-center w-6 h-6 text-xs font-bold border rounded-md text-emerald-800 border-emerald-200 bg-emerald-100/80 shrink-0">
            {index + 1}
          </span>
          <p className="text-sm text-emerald-950 font-medium pt-0.5 leading-relaxed">{step}</p>
        </li>
      ))}
    </ol>
  </div>
)}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* MAIN CONTAINER                               */
/* -------------------------------------------------------------------------- */

const SkillGapForm = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    targetRole: "",
    jobDescription: "",
    experienceLevel: "Beginner",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const analyzeSkills = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      const payload = {
        targetRole: formData.targetRole,
        jobDescription: formData.jobDescription,
        experienceLevel: formData.experienceLevel,
      };

      const res = await axios.post(
        `http://localhost:8989/skills/analyze-ai/${userId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setResult(res.data.data || res.data);
    } catch (err) {
      console.error(err);
      setError("Analysis execution failed. Please verify configurations and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] text-gray-800 antialiased font-sans pb-16">
      <Navbar />
      
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <Header />

        <div className="grid items-start grid-cols-1 gap-8 lg:grid-cols-12">
          
          {/* FORM CONSOLE */}
          <div className="sticky p-6 bg-white border border-gray-200 shadow-sm rounded-2xl lg:col-span-5 top-6">
            <div className="flex items-center gap-2 pb-4 mb-4 border-b border-gray-100">
              <Briefcase className="text-emerald-600" size={20} />
              <h2 className="text-lg font-bold text-gray-900">Skill Gap Analysis</h2>
            </div>

            {error && (
              <div className="p-3 mb-4 text-sm font-semibold border rounded-lg text-rose-700 bg-rose-50 border-rose-200">
                {error}
              </div>
            )}

            <form onSubmit={analyzeSkills} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Target Job Title</label>
                <input
                  name="targetRole"
                  type="text"
                  placeholder="e.g., Senior Full-Stack Engineer"
                  value={formData.targetRole}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition shadow-sm bg-gray-50/50"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Target Experience Bracket</label>
                <select
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition shadow-sm bg-gray-50/50 appearance-none"
                  disabled={loading}
                >
                  <option value="Beginner">Beginner (0 - 2 Years)</option>
                  <option value="Intermediate">Intermediate (2 - 5 Years)</option>
                  <option value="Advanced">Advanced (5+ Years)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Job Specification / Requirements</label>
                <textarea
                  name="jobDescription"
                  placeholder="Paste the raw job posting description here..."
                  value={formData.jobDescription}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition shadow-sm bg-gray-50/50 min-h-[140px] resize-none"
                  rows="5"
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center w-full gap-2 px-4 py-3 text-sm font-semibold text-white transition shadow-md cursor-pointer rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-60 shadow-emerald-600/10"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Executing Intelligence Models...
                  </>
                ) : (
                  "Execute Skill Gap Analysis"
                )}
              </button>
            </form>
          </div>

          {/* DYNAMIC METRICS OUTPUT */}
          <div className="lg:col-span-7">
            {!result ? <EmptyState /> : <AnalysisResult result={result} />}
          </div>

        </div>
      </div>
    </div>
  );
};

export default SkillGapForm;