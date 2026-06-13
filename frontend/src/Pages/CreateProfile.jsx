import { useState } from "react";
import axios from "axios";
import { User, Upload, FileText } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

// Importing both arrays from your files
import { roles } from "../Components/files/Roles";
import { degrees } from "../Components/files/Degree"; // Adjust this path if your file name is different

// --- Extracted Presentational Components (Prevents Re-renders) ---
const Section = ({ title, children }) => (
  <div className="p-6 space-y-4 bg-white border shadow-sm border-slate-200 rounded-xl">
    <h2 className="pb-2 text-sm font-semibold tracking-wide uppercase border-b text-slate-700 border-slate-100">
      {title}
    </h2>
    {children}
  </div>
);

const Input = ({ label, disabled, ...props }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold tracking-wide text-slate-600">
      {label}
    </label>
    <input
      {...props}
      disabled={disabled}
      className="w-full px-3 py-2 text-sm transition-all duration-200 border rounded-lg outline-none bg-slate-50/50 border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 disabled:opacity-60 disabled:cursor-not-allowed"
    />
  </div>
);

// --- Main Component ---
const CreateProfile = () => {
  const [loading, setLoading] = useState(false);
  const [resume, setResume] = useState(null);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    college: "",
    degree: "",
    branch: "",
    graduationYear: "",
    cgpa: "",
    targetRole: "",
    experienceLevel: "",
    skills: "",
    bio: "",
    github: "",
    linkedin: "",
    portfolio: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();

      // Append standard fields
      Object.keys(form).forEach((key) => {
        if (key !== "skills") formData.append(key, form[key]);
      });

      // Parse and format skills array
      const skillsArray = form.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      formData.append("skills", JSON.stringify(skillsArray));

      if (resume) formData.append("resume", resume);

      const res = await axios.post("http://localhost:8989/profile/create", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.data.success) {
        setTimeout(() => {
          toast.success("Profile has been created successfully!");
        }, 2000);
      }

    } catch (err) {
      alert(err.response?.data?.message || "An error occurred while creating your profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-slate-50/50">
      <Toaster />
      <div className="w-full max-w-4xl overflow-hidden bg-white border shadow-md border-slate-200/80 rounded-2xl">
        
        {/* HEADER */}
        <div className="flex items-center gap-4 p-6 border-b bg-gradient-to-r from-slate-50 to-white border-slate-200">
          <div className="flex items-center justify-center w-12 h-12 border rounded-xl bg-emerald-50 text-emerald-600 border-emerald-100">
            <User size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Create Profile</h1>
            <p className="text-sm text-slate-500">
              Complete your professional portfolio details below.
            </p>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 md:p-8">
          
          <Section title="Personal Information">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} disabled={loading} placeholder="John Doe" />
              <Input label="Phone Number" name="phone" value={form.phone} onChange={handleChange} disabled={loading} placeholder="+1 (555) 000-0000" />
            </div>
          </Section>

          <Section title="Education">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Input label="College / University" name="college" value={form.college} onChange={handleChange} disabled={loading} placeholder="Harvard University" />
              </div>
              
              {/* Dynamic Degree Dropdown */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold tracking-wide text-slate-600">
                  Degree
                </label>
                <select
                  name="degree"
                  value={form.degree}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-3 py-2 text-sm transition-all duration-200 border rounded-lg outline-none bg-slate-50/50 border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <option value="" disabled hidden>Select degree...</option>
                  {degrees.map((degree, index) => (
                    <option key={index} value={degree}>
                      {degree}
                    </option>
                  ))}
                </select>
              </div>

              <Input label="Branch / Field of Study" name="branch" value={form.branch} onChange={handleChange} disabled={loading} placeholder="Computer Science" />
              <Input label="Graduation Year" name="graduationYear" value={form.graduationYear} onChange={handleChange} disabled={loading} placeholder="2026" />
              <Input label="CGPA / GPA" name="cgpa" value={form.cgpa} onChange={handleChange} disabled={loading} placeholder="3.8 or 9.0" />
            </div>
          </Section>

          <Section title="Career Details">
            <div className="grid gap-4 sm:grid-cols-2">
              
              {/* Dynamic Target Role Dropdown */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold tracking-wide text-slate-600">
                  Target Role
                </label>
                <select
                  name="targetRole"
                  value={form.targetRole}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-3 py-2 text-sm transition-all duration-200 border rounded-lg outline-none bg-slate-50/50 border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <option value="" disabled hidden>Select target role...</option>
                  {roles.map((role, index) => (
                    <option key={index} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold tracking-wide text-slate-600">
                  Experience Level
                </label>
                <select
                  name="experienceLevel"
                  value={form.experienceLevel}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-3 py-2 text-sm transition-all duration-200 border rounded-lg outline-none bg-slate-50/50 border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <option value="" disabled hidden>Select experience...</option>
                  <option value="Fresher">Fresher / Entry Level</option>
                  <option value="1-2 years">Mid Level (1-2 years)</option>
                  <option value="3+ years">Senior Level (3+ years)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <Input 
                  label="Skills (Comma separated)" 
                  name="skills" 
                  value={form.skills} 
                  onChange={handleChange} 
                  disabled={loading} 
                  placeholder="React, Node.js, TypeScript, Python" 
                />
              </div>
            </div>
          </Section>

          <Section title="Social & Professional Links">
            <div className="grid gap-4 sm:grid-cols-3">
              <Input label="GitHub URL" name="github" value={form.github} onChange={handleChange} disabled={loading} placeholder="https://github.com/..." />
              <Input label="LinkedIn URL" name="linkedin" value={form.linkedin} onChange={handleChange} disabled={loading} placeholder="https://linkedin.com/in/..." />
              <Input label="Portfolio URL" name="portfolio" value={form.portfolio} onChange={handleChange} disabled={loading} placeholder="https://myportfolio.com" />
            </div>
          </Section>

          <Section title="About Me & Resume">
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold tracking-wide text-slate-600">Bio</label>
                <textarea
                  name="bio"
                  rows="4"
                  value={form.bio}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Write a brief professional summary about yourself..."
                  className="w-full px-3 py-2 text-sm transition-all duration-200 border rounded-lg outline-none resize-y bg-slate-50/50 border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold tracking-wide text-slate-600">Resume Document</label>
                <div className="relative transition-colors duration-200 border-2 border-dashed group border-slate-200 hover:border-emerald-500/50 rounded-xl bg-slate-50/30">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    disabled={loading}
                    onChange={(e) => setResume(e.target.files[0])}
                    className="absolute inset-0 z-10 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  />
                  <div className="flex flex-col items-center justify-center gap-2 p-6 text-center">
                    {resume ? (
                      <>
                        <FileText className="text-emerald-600" size={28} />
                        <span className="max-w-xs text-sm font-medium truncate text-slate-700">{resume.name}</span>
                        <span className="text-xs text-slate-400">Click or drag to replace</span>
                      </>
                    ) : (
                      <>
                        <Upload className="transition-colors duration-200 text-slate-400 group-hover:text-emerald-500" size={28} />
                        <span className="text-sm font-medium text-slate-600">Upload your resume</span>
                        <span className="text-xs text-slate-400">PDF, DOC, or DOCX formats up to 5MB</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* ACTION BUTTON */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 text-sm font-semibold tracking-wide text-white rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/10 transition-all duration-200 transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? "Saving Profile Information..." : "Finalize & Create Profile"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateProfile;