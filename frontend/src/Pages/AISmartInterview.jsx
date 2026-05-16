import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Mic, Send } from "lucide-react";

export default function AISmartInterview() {
  const [answer, setAnswer] = useState("");
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [voices, setVoices] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [canSpeak, setCanSpeak] = useState(false);
  const [isAutoSpeak, setIsAutoSpeak] = useState(true);

  // 🎤 Speech to text
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // ⏱️ REAL TIMER
  const [timeLeft, setTimeLeft] = useState(90);

  const videoRef = useRef(null);
  const sessionId = localStorage.getItem("sessionId");

  // =============================
  // LOAD VOICES
  // =============================
  useEffect(() => {
    const loadVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // =============================
  // FETCH QUESTIONS
  // =============================
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(
          `https://ai-interview-prep-web-app.onrender.com/session/questions/${sessionId}`,
        );
        const data = await res.json();
        setQuestions(data.questions || []);
      } catch (err) {
        console.log(err);
      }
    };
    fetchQuestions();
  }, [sessionId]);

  // =============================
  // SPEECH TO TEXT
  // =============================
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setAnswer(transcript);
    };

    recognitionRef.current = recognition;
  }, []);

  // =============================
  // REAL TIMER
  // =============================
  useEffect(() => {
    if (timeLeft <= 0) {
      handleNext();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // =============================
  // TOGGLE MIC
  // =============================
  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // =============================
  // SPEAK QUESTION
  // =============================
  const speakQuestion = (text) => {
    if (!text || isSpeaking) return;

    setIsSpeaking(true);
    const speech = new SpeechSynthesisUtterance(text);

    const femaleVoice =
      voices.find(
        (v) =>
          v.name.toLowerCase().includes("zira") ||
          v.name.toLowerCase().includes("samantha"),
      ) || voices[0];

    speech.voice = femaleVoice;
    speech.pitch = 1.4;
    speech.rate = 1;

    speech.onstart = () => {
      videoRef.current?.play();
    };

    speech.onend = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(speech);
  };

  // =============================
  // AUTO SPEAK
  // =============================
  useEffect(() => {
    if (questions.length > 0 && canSpeak && isAutoSpeak) {
      speakQuestion(questions[currentIndex]?.question);
      setCanSpeak(false);
    }
  }, [canSpeak, currentIndex, isAutoSpeak, questions]);

  useEffect(() => {
    if (questions.length > 0) {
      setCanSpeak(true);
    }
  }, [questions]);

  // =============================
  // SUBMIT ANSWER
  // =============================
  const submitAnswerToServer = async () => {
    try {
      if (!answer.trim()) return;

      await fetch(
        `https://ai-interview-prep-web-app.onrender.com/session/answer/${sessionId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            answers: [
              {
                questionIndex: currentIndex,
                answer: answer,
              },
            ],
          }),
        },
      );
    } catch (err) {
      console.log(err);
    }
  };

  // =============================
  // NEXT
  // =============================
  const handleNext = async () => {
    await submitAnswerToServer();
    setAnswer("");

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setCanSpeak(true);
      setTimeLeft(90);
    } else {
      alert("Interview Completed 🎉");
      navigate(`/evaluate-interview/${sessionId}`);
      window.speechSynthesis.cancel();

      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `https://ai-interview-prep-web-app.onrender.com/session/evaluate/${sessionId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const progress = (timeLeft / 90) * 100;

  return (
    <div className="min-h-screen bg-[#eef4f1] flex items-center justify-center p-3 sm:p-4 md:p-6 font-sans">
      <div className="bg-white w-full max-w-5xl h-auto md:min-h-[540px] rounded-[20px] sm:rounded-[28px] overflow-hidden shadow-2xl flex flex-col md:flex-row">
        {/* LEFT PANEL */}
        <div className="w-full md:w-[32%] lg:w-[28%] bg-[#f8fafb] p-3 sm:p-4 flex flex-row md:flex-col gap-3 sm:gap-4 border-b md:border-b-0 md:border-r border-slate-100 items-center justify-between md:justify-start md:items-stretch">
          {/* VIDEO CONTAINER */}
          <div className="w-20 h-20 xs:w-24 xs:h-24 sm:w-28 sm:h-28 md:w-full md:h-[160px] overflow-hidden rounded-xl sm:rounded-2xl shadow-sm flex-shrink-0">
            <video
              ref={videoRef}
              className="object-cover w-full h-full"
              muted
              autoPlay
              loop
              playsInline
              src="female-ai.mp4"
            />
          </div>

          {/* STATUS INFO */}
          <div className="flex flex-row items-center justify-end flex-1 w-auto gap-3 bg-transparent md:justify-start md:w-full sm:gap-4 md:bg-white md:shadow-sm md:flex-col md:p-3 rounded-2xl">
            <h2 className="hidden text-xs font-semibold text-center md:block sm:text-sm text-slate-700">
              Interview Progress
            </h2>

            {/* TIMER */}
            <div className="flex justify-center flex-shrink-0">
              <div className="relative scale-75 xs:scale-85 sm:scale-90 md:scale-100">
                <svg
                  width="76"
                  height="76"
                  className="-rotate-90 sm:w-[82px] sm:h-[82px]"
                >
                  <circle
                    cx="38"
                    cy="38"
                    r="30"
                    stroke="#e5e7eb"
                    strokeWidth="5"
                    fill="transparent"
                  />
                  <circle
                    cx="38"
                    cy="38"
                    r="30"
                    stroke="#10b981"
                    strokeWidth="5"
                    fill="transparent"
                    strokeDasharray="188.4"
                    strokeDashoffset={188.4 - (188.4 * progress) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold sm:text-base text-slate-700">
                    {timeLeft}s
                  </span>
                </div>
              </div>
            </div>

            {/* PROGRESS COUNTER */}
            <div className="flex md:grid flex-row md:grid-cols-2 gap-1.5 sm:gap-2 min-w-[110px] xs:min-w-[130px] md:w-full md:mt-2">
              <div className="flex-1 py-1 text-center rounded-lg sm:py-2 bg-emerald-50 sm:rounded-xl">
                <h1 className="text-sm font-bold xs:text-base md:text-xl text-emerald-600">
                  {currentIndex + 1}
                </h1>
                <p className="text-[8px] sm:text-[9px] font-medium text-slate-500 tracking-wider hidden xs:block">
                  CURRENT
                </p>
              </div>
              <div className="flex-1 py-1 text-center rounded-lg sm:py-2 bg-emerald-50 sm:rounded-xl">
                <h1 className="text-sm font-bold xs:text-base md:text-xl text-emerald-600">
                  {questions.length}
                </h1>
                <p className="text-[8px] sm:text-[9px] font-medium text-slate-500 tracking-wider hidden xs:block">
                  TOTAL
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex flex-col justify-between flex-1 gap-4 p-4 sm:p-5 md:p-6">
          <div className="flex flex-col gap-3">
            {/* HEADER */}
            <div className="flex items-center justify-between gap-2">
              <h1 className="text-base font-bold truncate xs:text-lg sm:text-2xl text-emerald-600">
                AI Smart Interview
              </h1>
              <div className="flex-shrink-0 px-2.5 py-0.5 sm:py-1 rounded-full bg-emerald-50">
                <p className="text-[10px] sm:text-xs font-semibold text-emerald-600">
                  {currentIndex + 1} / {questions.length}
                </p>
              </div>
            </div>

            {/* QUESTION BOX */}
            <div className="p-3.5 sm:p-5 bg-[#f8fafb] rounded-xl sm:rounded-2xl border border-slate-100">
              <p className="text-[8px] sm:text-[9px] uppercase font-bold tracking-[2px] text-emerald-600">
                Question
              </p>
              <h2 className="mt-1 text-xs sm:text-sm md:text-[16px] leading-5 sm:leading-6 font-semibold text-slate-700">
                {questions[currentIndex]?.question || "Loading..."}
              </h2>
            </div>
          </div>

          {/* ANSWER INPUT */}
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Speak or type your answer..."
            className="w-full min-h-[140px] md:flex-1 bg-[#f8fafb] rounded-xl sm:rounded-2xl p-3.5 sm:p-5 outline-none focus:ring-2 focus:ring-emerald-500/20 border border-transparent focus:border-emerald-500/30 resize-none text-xs sm:text-sm text-slate-600 transition-all duration-200 shadow-inner"
          />

          {/* ACTION BUTTONS */}
          <div className="flex gap-2.5 sm:gap-3">
            <button
              onClick={toggleListening}
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 active:scale-95 shadow-md ${
                isListening
                  ? "bg-red-500 hover:bg-red-600 ring-4 ring-red-100"
                  : "bg-slate-900 hover:bg-slate-800"
              }`}
            >
              <Mic size={16} className="text-white sm:w-[18px] sm:h-[18px]" />
            </button>

            <button
              onClick={handleNext}
              className="flex items-center justify-center flex-1 h-11 sm:h-12 gap-1.5 sm:gap-2 text-sm sm:text-base font-semibold text-white transition-all duration-200 rounded-full shadow-md bg-emerald-500 hover:bg-emerald-700 active:scale-[0.99]"
            >
              Submit Answer
              <Send size={14} className="sm:w-[16px] sm:h-[16px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
