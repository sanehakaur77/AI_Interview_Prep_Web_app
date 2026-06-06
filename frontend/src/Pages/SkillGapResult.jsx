import React from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  CheckCircle,
  XCircle,
  Target,
  Trophy,
  Brain,
  Rocket,
} from "lucide-react";

const SkillGapResult = ({ result }) => {
  if (!result) {
    return (
      <div className="p-6 text-center">
        No analysis data available.
      </div>
    );
  }

  return (
    <div className="max-w-6xl p-6 mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 text-white shadow-xl rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
        <h1 className="text-3xl font-bold">AI Skill Gap Analyzer</h1>

        <p className="mt-2 text-indigo-100">{result.targetRole}</p>

        <p className="text-sm text-indigo-200">
          {result.experienceLevel}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="p-6 bg-white shadow-lg rounded-3xl">
          <div className="w-40 h-40 mx-auto">
            <CircularProgressbar
              value={result.matchPercentage || 0}
              text={`${result.matchPercentage || 0}%`}
            />
          </div>

          <p className="mt-4 text-center text-gray-600">
            Skill Match Score
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:col-span-2">
          <div className="p-5 bg-white shadow rounded-2xl">
            <CheckCircle className="mb-2 text-green-500" />
            <h3 className="text-2xl font-bold">
              {result.matchedSkills?.length || 0}
            </h3>
            <p>Matched Skills</p>
          </div>

          <div className="p-5 bg-white shadow rounded-2xl">
            <XCircle className="mb-2 text-red-500" />
            <h3 className="text-2xl font-bold">
              {result.missingSkills?.length || 0}
            </h3>
            <p>Missing Skills</p>
          </div>

          <div className="p-5 bg-white shadow rounded-2xl">
            <Target className="mb-2 text-blue-500" />
            <h3 className="text-2xl font-bold">
              {result.requiredSkills?.length || 0}
            </h3>
            <p>Required Skills</p>
          </div>

          <div className="p-5 bg-white shadow rounded-2xl">
            <Trophy className="mb-2 text-yellow-500" />
            <h3 className="text-2xl font-bold">
              {result.matchPercentage || 0}%
            </h3>
            <p>Readiness Score</p>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-6 bg-white shadow rounded-3xl">
          <h2 className="mb-4 text-xl font-bold text-green-600">
            Matched Skills
          </h2>

          <div className="flex flex-wrap gap-2">
            {result.matchedSkills?.map((skill, index) => (
              <span
                key={index}
                className="px-4 py-2 text-green-700 bg-green-100 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="p-6 bg-white shadow rounded-3xl">
          <h2 className="mb-4 text-xl font-bold text-red-600">
            Missing Skills
          </h2>

          <div className="flex flex-wrap gap-2">
            {result.missingSkills?.map((skill, index) => (
              <span
                key={index}
                className="px-4 py-2 text-red-700 bg-red-100 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendation */}
      <div className="p-6 bg-white shadow rounded-3xl">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="text-purple-600" />
          <h2 className="text-xl font-bold">
            AI Recommendation
          </h2>
        </div>

        <p className="leading-7 text-gray-700">
          {result.recommendation}
        </p>
      </div>

      {/* Roadmap */}
      <div className="p-6 bg-white shadow rounded-3xl">
        <div className="flex items-center gap-2 mb-4">
          <Rocket className="text-indigo-600" />
          <h2 className="text-xl font-bold">
            Learning Roadmap
          </h2>
        </div>

        <div className="space-y-4">
          {result.roadmap?.map((step, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 border rounded-xl"
            >
              <div className="flex items-center justify-center w-8 h-8 font-bold text-white bg-indigo-600 rounded-full">
                {index + 1}
              </div>

              <p>{step}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillGapResult;