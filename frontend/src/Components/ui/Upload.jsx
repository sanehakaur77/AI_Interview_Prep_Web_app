import { useState } from "react";
import axios from "axios";

const Upload = ({ setQuestions, setResumeUrl, navigate }) => {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("resume", file);

    const res = await axios.post(
      "https://ai-interview-prep-web-app.onrender.com/api/resume/upload",
      formData,
    );

    setQuestions(res.data.questions);
    setResumeUrl(res.data.url);

    navigate("/interview");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-8 text-center bg-white shadow-lg rounded-2xl w-96">
        <h2 className="mb-4 text-2xl font-bold">Upload Resume 📄</h2>

        <input
          type="file"
          className="mb-4"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button
          onClick={handleUpload}
          className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
        >
          Upload & Start Interview 🚀
        </button>
      </div>
    </div>
  );
};

export default Upload;
