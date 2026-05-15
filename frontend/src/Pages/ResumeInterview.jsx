import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Mic, Send, Upload, FileText, Loader2, Volume2 } from "lucide-react";

const ResumeInterview = () => {
  const [file, setFile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [qaList, setQaList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef(null);

  // ---------------- SPEECH TO TEXT ----------------
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setAnswer((prev) => (prev ? prev + " " : "") + text);
    };

    recognitionRef.current = recognition;
  }, []);

  const startSpeech = () => recognitionRef.current?.start();

  const speak = (text) => {
    if (!text) return;
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(text);
    msg.rate = 0.95;
    window.speechSynthesis.speak(msg);
  };

  const uploadResume = async () => {
    if (!file) return alert("Please select a file first");
    const formData = new FormData();
    formData.append("resume", file);
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8989/api/resume/upload",
        formData,
      );
      const qs = res.data.questions?.questions || [];
      setQuestions(qs);
      setIndex(0);
      if (qs.length > 0) speak(qs[0].question || qs[0]);
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  const nextQuestion = async () => {
    if (!answer.trim()) return alert("Please provide an answer.");
    const currentQuestionText =
      typeof questions[index] === "object"
        ? questions[index].question
        : questions[index];
    const updatedQA = [...qaList, { question: currentQuestionText, answer }];
    setQaList(updatedQA);
    setAnswer("");

    if (index + 1 < questions.length) {
      const nextIdx = index + 1;
      setIndex(nextIdx);
      speak(questions[nextIdx].question || questions[nextIdx]);
    } else {
      alert("Interview Completed");
      window.location.href = "/evaluate";
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6 font-sans bg-slate-50 md:p-12 text-slate-800">
      <div className="grid items-stretch w-full max-w-6xl grid-cols-1 gap-8 md:grid-cols-2">
        {/* LEFT COLUMN: UPLOAD - Now matches height via flex flex-col */}
        <div className="flex flex-col p-8 bg-white border shadow-sm rounded-2xl border-slate-200">
          <h2 className="flex items-center gap-2 text-xl font-bold text-slate-700">
            <FileText className="text-emerald-600" /> Upload Resume
          </h2>
          <p className="mt-1 mb-6 text-sm text-slate-500">
            Upload your PDF to generate interview questions.
          </p>

          <div className="relative flex flex-col justify-center flex-1 p-8 text-center transition-colors border-2 border-dashed border-slate-200 rounded-xl hover:border-emerald-500 bg-slate-50 group">
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <Upload className="mx-auto mb-2 transition-colors text-slate-400 group-hover:text-emerald-600" />
            <span className="text-sm font-medium text-slate-600">
              {file ? file.name : "Drag and drop or click to browse"}
            </span>
          </div>

          <button
            onClick={uploadResume}
            disabled={loading}
            className="flex items-center justify-center w-full gap-2 py-4 mt-6 font-semibold text-white transition-all shadow-md bg-emerald-600 hover:bg-emerald-700 rounded-xl disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Upload size={18} />
            )}
            {loading ? "Processing..." : "Start Interview"}
          </button>
        </div>

        {/* RIGHT COLUMN: INTERVIEW */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col min-h-[500px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-700">AI Interview</h2>
            {questions.length > 0 && (
              <span className="px-3 py-1 text-xs font-bold rounded-full text-emerald-600 bg-emerald-50">
                {index + 1} / {questions.length}
              </span>
            )}
          </div>

          <div className="bg-slate-50 border border-slate-100 p-6 rounded-xl min-h-[140px] flex flex-col justify-center relative">
            {questions.length > 0 ? (
              <>
                <p className="mb-1 text-xs font-bold tracking-widest uppercase text-emerald-600">
                  {questions[index]?.type || "Question"}
                </p>
                <p className="pr-8 text-lg font-medium leading-relaxed text-slate-800">
                  {questions[index]?.question || questions[index]}
                </p>
                <button
                  onClick={() =>
                    speak(questions[index]?.question || questions[index])
                  }
                  className="absolute top-4 right-4 text-slate-300 hover:text-emerald-600"
                >
                  <Volume2 size={18} />
                </button>
              </>
            ) : (
              <p className="italic text-center text-slate-400">
                No interview active.
              </p>
            )}
          </div>

          <div className="flex flex-col flex-1 mt-8">
            <label className="mb-2 text-xs font-bold uppercase text-slate-400">
              Your Answer
            </label>
            <textarea
              className="flex-1 w-full p-4 transition-all border outline-none resize-none border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-700"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Your answer here..."
              disabled={questions.length === 0}
            />

            <div className="flex items-center justify-between mt-6">
              <button
                onClick={startSpeech}
                disabled={questions.length === 0}
                className={`flex items-center gap-2 font-semibold ${isListening ? "text-red-500 animate-pulse" : "text-emerald-600"}`}
              >
                <Mic size={20} /> {isListening ? "Listening..." : "Speak"}
              </button>

              <button
                onClick={nextQuestion}
                disabled={questions.length === 0}
                className="flex items-center gap-2 px-8 py-3 font-semibold text-white transition-all bg-slate-900 hover:bg-slate-800 rounded-xl active:scale-95"
              >
                {index + 1 === questions.length ? "Finish" : "Next"}{" "}
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeInterview;
