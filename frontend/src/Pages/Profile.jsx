import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

// ================= TYPES & CONFIG =================
const API_BASE_URL = "http://localhost:8989";

// ================= CUSTOM HOOK =================
const useFetchProfile = (userId) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      
      const res = await axios.get(`${API_BASE_URL}/profile/get/${userId}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      if (res.data?.profile) {
        setProfile(res.data.profile);
      } else {
        throw new Error("Profile data structure is invalid.");
      }
    } catch (err) {
      console.error("Profile Fetch Error:", err);
      setError(err.response?.data?.message || err.message || "Failed to load profile.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, loading, error, refetch: fetchProfile };
};

// ================= SUB-COMPONENTS =================
const LoadingState = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-white">
    <div className="w-8 h-8 mb-4 border-2 border-gray-100 rounded-full border-t-emerald-500 animate-spin" />
    <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
      Retrieving Profile
    </span>
  </div>
);



const ProfileField = ({ label, value, className = "" }) => {
  if (!value) return null;
  return (
    <div className={`p-5 bg-white border border-gray-100 rounded-lg shadow-sm ${className}`}>
      <span className="block mb-2 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
        {label}
      </span>
      <span className="text-sm font-medium text-gray-900 break-words">
        {value}
      </span>
    </div>
  );
};


const EditProfileModal = ({ isOpen, onClose, profileData, onSave, userId }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    college: "",
    degree: "",
    branch: "",
    graduationYear: "",
    cgpa: "",
    tragetRole: "", 
    experienceLevel: "",
    skills: "",
    bio: "",
    github: "",
    linkedin: "",
    portfolio: ""
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    if (profileData && isOpen) {
      let formattedSkills = "";
      if (profileData.skills) {
        if (Array.isArray(profileData.skills)) {
          formattedSkills = profileData.skills.join(", ");
        } else if (typeof profileData.skills === "string") {
          try {
            const parsed = JSON.parse(profileData.skills);
            formattedSkills = Array.isArray(parsed) ? parsed.join(", ") : profileData.skills;
          } catch {
            formattedSkills = profileData.skills;
          }
        }
      }

      setFormData({
        fullName: profileData.fullName || "",
        phone: profileData.phone || "",
        college: profileData.college || profileData.education?.college || "",
        degree: profileData.degree || profileData.education?.degree || "",
        branch: profileData.branch || profileData.education?.branch || "",
        graduationYear: profileData.graduationYear || "",
        cgpa: profileData.cgpa || "",
        tragetRole: profileData.tragetRole || profileData.targetRole || "", 
        experienceLevel: profileData.experienceLevel || "",
        skills: formattedSkills,
        bio: profileData.bio || "",
        github: profileData.github || "",
        linkedin: profileData.linkedin || "",
        portfolio: profileData.portfolio || ""
      });
      setResumeFile(null);
      setSubmitError(null);
    }
  }, [profileData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const processedSkills = formData.skills
      .split(",")
      .map(s => s.trim())
      .filter(s => s !== "");

    // Pack into FormData for handling multi-part submissions safely
    const dataToSend = new FormData();
    
    // Explicitly inject the user identifier context into the form pipeline
    dataToSend.append("userId", userId);

    Object.keys(formData).forEach(key => {
      if (key === "skills") {
        dataToSend.append(key, JSON.stringify(processedSkills));
      } else {
        dataToSend.append(key, formData[key]);
      }
    });

    if (resumeFile) {
      dataToSend.append("resume", resumeFile);
    }

    try {
      const token = localStorage.getItem("token");
      const userId=localStorage.getItem("userId");
      
      // TARGETING THE REQUEST DIRECTLY TO YOUR UPDATED ENDPOINT ROUTE:
      await axios.put(`${API_BASE_URL}/profile/edit/${userId}`, dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data" 
        }
      });
      
      onSave(); 
      onClose(); 
    } catch (err) {
      console.error("Profile Edit Target Submission Error:", err);
      setSubmitError(err.response?.data?.message || err.message || "Failed to update profile configurations.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] bg-white border border-gray-200 shadow-2xl rounded-xl flex flex-col overflow-hidden">
        
        <div className="flex items-center justify-between p-6 bg-white border-b border-gray-100">
          <h2 className="text-lg font-bold tracking-tight text-gray-900">Update Profile Fields</h2>
          <button onClick={onClose} className="px-2 text-xl font-semibold text-gray-400 hover:text-gray-600 focus:outline-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 p-6 space-y-5 overflow-y-auto bg-white">
          {submitError && (
            <div className="p-4 text-xs font-semibold text-red-600 border border-red-200 rounded-lg bg-red-50">{submitError}</div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block mb-1 text-[10px] font-bold tracking-widest text-gray-400 uppercase">Full Name</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500" required />
            </div>
            <div>
              <label className="block mb-1 text-[10px] font-bold tracking-widest text-gray-400 uppercase">Phone Number</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block mb-1 text-[10px] font-bold tracking-widest text-gray-400 uppercase">Target Role</label>
              <input type="text" name="tragetRole" value={formData.tragetRole} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="block mb-1 text-[10px] font-bold tracking-widest text-gray-400 uppercase">Experience Level</label>
              <input type="text" name="experienceLevel" value={formData.experienceLevel} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500" />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-[10px] font-bold tracking-widest text-gray-400 uppercase">Bio</label>
            <textarea name="bio" rows="2" value={formData.bio} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:border-emerald-500" placeholder="Brief tagline about yourself..."></textarea>
          </div>

          <div className="p-4 space-y-4 border border-gray-100 rounded-lg bg-gray-50">
            <span className="block text-[10px] font-bold tracking-widest text-gray-400 uppercase text-gray-500">Academic Background</span>
            <div>
              <label className="block mb-1 text-xs text-gray-600">College / University</label>
              <input type="text" name="college" value={formData.college} onChange={handleChange} className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block mb-1 text-xs text-gray-600">Degree Type</label>
                <input type="text" name="degree" value={formData.degree} onChange={handleChange} className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500" placeholder="e.g. B.Tech" />
              </div>
              <div>
                <label className="block mb-1 text-xs text-gray-600">Branch / Specialization</label>
                <input type="text" name="branch" value={formData.branch} onChange={handleChange} className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500" placeholder="e.g. CSE" />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block mb-1 text-xs text-gray-600">Graduation Year</label>
                <input type="text" name="graduationYear" value={formData.graduationYear} onChange={handleChange} className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="block mb-1 text-xs text-gray-600">CGPA / Score</label>
                <input type="text" name="cgpa" value={formData.cgpa} onChange={handleChange} className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500" />
              </div>
            </div>
          </div>

          <div>
            <label className="block mb-1 text-[10px] font-bold tracking-widest text-gray-400 uppercase">Skills (Comma Separated)</label>
            <input type="text" name="skills" value={formData.skills} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500" placeholder="React, Node.js, MongoDB" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block mb-1 text-[10px] font-bold tracking-widest text-gray-400 uppercase">GitHub Link</label>
              <input type="url" name="github" value={formData.github} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="block mb-1 text-[10px] font-bold tracking-widest text-gray-400 uppercase">LinkedIn Link</label>
              <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="block mb-1 text-[10px] font-bold tracking-widest text-gray-400 uppercase">Portfolio Website</label>
              <input type="url" name="portfolio" value={formData.portfolio} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500" />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-[10px] font-bold tracking-widest text-gray-400 uppercase">Update Resume File (.pdf)</label>
            <input type="file" accept=".pdf" onChange={handleFileChange} className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} disabled={isSubmitting} className="px-5 py-2 text-xs font-bold tracking-wider text-gray-500 uppercase transition-colors bg-white border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-5 py-2 text-xs font-bold tracking-wider text-white uppercase transition-colors rounded bg-emerald-500 hover:bg-emerald-600 focus:outline-none disabled:opacity-50">
              {isSubmitting ? "Uploading Changes..." : "Save Configuration"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ================= MAIN COMPONENT =================
const Profile = () => {
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  const { profile, loading, error, refetch } = useFetchProfile(userId);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  if (!profile) return <ErrorState message="No data profile resolved." onRetry={refetch} />;

  const initials = profile.fullName
    ? profile.fullName.trim().split(/\s+/).map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "??";

  let derivedSkills = [];
  if (profile.skills) {
    if (Array.isArray(profile.skills)) {
      derivedSkills = profile.skills;
    } else if (typeof profile.skills === "string") {
      try { derivedSkills = JSON.parse(profile.skills); } catch { derivedSkills = []; }
    }
  }

  const displayRole = profile.tragetRole || profile.targetRole;

  return (
    <main className="flex items-center justify-center min-h-screen p-6 font-sans antialiased bg-gray-50">
      <article className="w-full max-w-3xl overflow-hidden bg-white border-t-4 border-b border-gray-200 shadow-lg border-x border-t-emerald-500 rounded-xl">
        
        {/* HEADER SECTION */}
        <header className="p-8 bg-white border-b border-gray-100 sm:p-10">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
            <div className="flex items-center justify-center flex-shrink-0 w-20 h-20 text-2xl font-bold tracking-wider text-white shadow-sm select-none bg-emerald-500 rounded-2xl">
              {initials}
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                {profile.fullName || "Unverified Profile"}
              </h1>
              {profile.bio && <p className="max-w-md mt-1 text-sm text-gray-500">{profile.bio}</p>}
              
              {(displayRole || profile.experienceLevel) && (
                <p className="mt-3 text-xs font-bold tracking-widest uppercase text-emerald-500">
                  {displayRole || "Role Assignment Pending"}
                  {displayRole && profile.experienceLevel && <span className="mx-3 text-gray-300">|</span>}
                  {profile.experienceLevel}
                </p>
              )}
            </div>
          </div>
        </header>

        {/* DETAILS SECTION */}
        <section className="p-8 bg-white sm:p-10">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            
            <ProfileField label="Email Address" value={profile.user?.email} />
            <ProfileField label="Phone Number" value={profile.phone} />

            {/* ACADEMIC PROFILE BLOCK */}
            {(profile.college || profile.education?.college) && (
              <div className="p-6 bg-white border border-gray-100 rounded-lg shadow-sm sm:col-span-2">
                <span className="block mb-2 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                  Educational Background
                </span>
                <p className="text-base font-semibold text-gray-900">
                  {profile.college || profile.education?.college}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {profile.degree || profile.education?.degree} {((profile.degree || profile.education?.degree) && (profile.branch || profile.education?.branch)) && "•"} {profile.branch || profile.education?.branch}
                </p>
                {(profile.graduationYear || profile.cgpa) && (
                  <p className="mt-2 text-xs font-medium tracking-wider text-gray-400 uppercase">
                    {profile.graduationYear && `Graduation: ${profile.graduationYear}`}
                    {profile.graduationYear && profile.cgpa && "  |  "}
                    {profile.cgpa && `Score/CGPA: ${profile.cgpa}`}
                  </p>
                )}
              </div>
            )}

            {/* SKILLS BLOCK */}
            {derivedSkills && derivedSkills.length > 0 && (
              <div className="p-6 bg-white border border-gray-100 rounded-lg shadow-sm sm:col-span-2">
                <span className="block mb-4 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                  Technical Expertise
                </span>
                <div className="flex flex-wrap gap-2">
                  {derivedSkills.map((skill, index) => (
                    <span key={index} className="inline-flex items-center px-3 py-1.5 text-xs font-semibold bg-white border rounded text-emerald-500 border-emerald-500">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>
        </section>

        {/* FOOTER ACTIONS & LINKS */}
        <footer className="flex flex-col-reverse items-center justify-between gap-6 p-6 border-t border-gray-100 bg-gray-50 sm:flex-row sm:px-10">
          <div className="w-full sm:w-auto">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full px-6 py-2.5 text-xs font-bold tracking-wider text-emerald-500 uppercase transition-colors bg-white border border-emerald-500 rounded hover:bg-emerald-50 focus:outline-none sm:w-auto"
            >
              Edit Profile
            </button>
          </div>

          {(profile.github || profile.linkedin || profile.portfolio) && (
            <div className="flex flex-wrap items-center justify-center w-full gap-6 sm:w-auto sm:justify-end">
              {profile.github && (
                <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-xs font-bold tracking-widest text-gray-500 uppercase hover:text-emerald-500">
                  GitHub
                </a>
              )}
              {profile.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-xs font-bold tracking-widest text-gray-500 uppercase hover:text-emerald-500">
                  LinkedIn
                </a>
              )}
              {profile.portfolio && (
                <a href={profile.portfolio} target="_blank" rel="noopener noreferrer" className="text-xs font-bold tracking-widest text-gray-500 uppercase hover:text-emerald-500">
                  Portfolio
                </a>
              )}
            </div>
          )}
        </footer>

      </article>

      {/* MODAL MOUNT */}
      <EditProfileModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        profileData={profile}
        onSave={refetch}
        userId={userId}
      />
    </main>
  );
};

export default Profile;