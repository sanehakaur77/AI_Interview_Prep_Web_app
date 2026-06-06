import { useState, useRef, useEffect } from "react";

export default function UserProfileForm({ isOpen = true, onClose }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    experience: "",
    jobDescription: "",
    description: "",
  });

  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [resume, setResume] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState("");

  const modalRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === "Escape") onClose(); };
    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) onClose();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Basic file validation
    if (!file.type.match(/text\/(plain)|application\/(pdf|msword|vnd.openxmlformats-officedocument.wordprocessingml.document)/)) {
      setError("Unsupported file format.");
      return;
    }

    setResume(file);
    if (file.type === "text/plain") {
      setIsExtracting(true);
      try {
        const text = await file.text();
        const skillBank = ["react", "node", "express", "mongodb", "javascript", "typescript", "tailwind", "python", "sql", "git"];
        const extracted = skillBank.filter((s) => text.toLowerCase().includes(s));
        setSkills((prev) => [...new Set([...prev, ...extracted])]);
      } catch (err) { console.error(err); }
      setIsExtracting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      setError("Name and Email are required.");
      return;
    }
    
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
      <div ref={modalRef} className="w-full max-w-lg overflow-hidden duration-200 bg-white shadow-2xl rounded-2xl animate-in fade-in zoom-in">
        <div className="h-2 bg-emerald-500" />
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800">AI Profile Setup</h2>
              <p className="text-sm text-slate-500">Enhance your profile with AI analysis</p>
            </div>
            <button onClick={onClose} className="transition-colors text-slate-400 hover:text-slate-600">✕</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="p-2 text-sm text-red-500 rounded bg-red-50">{error}</p>}
            
            <div className="grid grid-cols-2 gap-4">
              <input name="name" required placeholder="Full Name" onChange={handleChange} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" />
              <input name="email" required type="email" placeholder="Email" onChange={handleChange} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input name="role" placeholder="Target Role" onChange={handleChange} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" />
              <select name="experience" onChange={handleChange} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500">
                <option value="">Experience Level</option>
                <option value="fresher">Fresher</option>
                <option value="junior">Junior</option>
                <option value="mid">Mid-Level</option>
                <option value="senior">Senior</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-slate-500">Resume (Text/PDF)</label>
              <input type="file" onChange={handleResumeUpload} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
              {isExtracting && <p className="text-xs text-emerald-600 animate-pulse">Analyzing document...</p>}
            </div>

            <div className="p-2 border rounded-lg flex flex-wrap gap-2 min-h-[42px]">
              {skills.map((skill) => (
                <span key={skill} className="flex items-center gap-1 px-2 py-1 text-xs border rounded-md bg-emerald-50 text-emerald-700 border-emerald-100">
                  {skill}
                  <button type="button" onClick={() => setSkills(skills.filter(s => s !== skill))} className="hover:text-emerald-900">×</button>
                </span>
              ))}
              <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => {
                if (e.key === "Enter" && skillInput) { setSkills([...skills, skillInput]); setSkillInput(""); e.preventDefault(); }
              }} placeholder="Add skill & enter..." className="flex-1 px-1 text-sm outline-none" />
            </div>

            <textarea name="description" onChange={handleChange} placeholder="Professional Bio..." rows="3" className="w-full p-3 border rounded-lg outline-none focus:border-emerald-500" />

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 py-2 font-medium rounded-lg text-slate-600 bg-slate-100 hover:bg-slate-200">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="flex-1 py-2 font-medium text-white rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50">
                {isSubmitting ? "Analyzing..." : "Analyze Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}