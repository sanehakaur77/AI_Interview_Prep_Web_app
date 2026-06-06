import React from "react";
import { UserPlus, ListChecks, Brain, BarChart } from "lucide-react";

const WorkingSteps = () => {
  const steps = [
    {
      icon: <UserPlus size={32} className="text-emerald-600" />,
      title: "Create Account",
      description: "Sign up and login securely to get started.",
    },
    {
      icon: <ListChecks size={32} className="text-emerald-600" />,
      title: "Select Role",
      description: "Choose your job role and experience level.",
    },
    {
      icon: <Brain size={32} className="text-emerald-600" />,
      title: "Practice Interview",
      description: "Answer AI-generated interview questions.",
    },
    {
      icon: <BarChart size={32} className="text-emerald-600" />,
      title: "Track Progress",
      description: "Analyze performance and improve skills.",
    },
  ];

  return (
    <section className="flex items-center min-h-screen py-16 bg-gray-50">
      <div className="w-full px-6 mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            How It Works
          </h2>
          <p className="max-w-md mx-auto mt-3 text-lg text-gray-600">
            Follow these simple steps to start your preparation
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative flex flex-col justify-between p-6 transition-all duration-300 bg-white border border-gray-200 shadow-sm rounded-2xl hover:shadow-xl hover:-translate-y-1"
            >
              <div>
                {/* Icon Wrapper */}
                <div className="inline-flex items-center justify-center p-3 mb-5 bg-emerald-50 rounded-xl">
                  {step.icon}
                </div>

                {/* Title */}
                <h3 className="mb-2 text-xl font-semibold text-gray-800">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm leading-relaxed text-gray-600">
                  {step.description}
                </p>
              </div>

              {/* Step Number Badge */}
              <div className="flex items-center justify-between pt-4 mt-6 border-t border-gray-100">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  Step {index + 1}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkingSteps;