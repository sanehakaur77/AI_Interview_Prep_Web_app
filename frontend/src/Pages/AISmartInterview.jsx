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
          `http://localhost:8989/session/questions/${sessionId}`,
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

      await fetch(`http://localhost:8989/session/answer/${sessionId}`, {
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
      });
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
          `http://localhost:8989/session/evaluate/${sessionId}`,
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
    <div className="min-h-screen bg-[#eef4f1] flex items-center justify-center p-3 font-sans">
      <div className="bg-white w-full max-w-5xl h-[540px] rounded-[28px] overflow-hidden shadow-2xl flex">
        {/* LEFT PANEL */}
        <div className="w-[30%] bg-[#f8fafb] p-4">
          {/* VIDEO */}
          <div className="h-[170px] overflow-hidden rounded-2xl shadow-sm">
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

          {/* STATUS */}
          <div className="p-4 mt-4 bg-white shadow-sm rounded-2xl">
            <h2 className="text-sm font-semibold text-slate-700">
              Interview Progress
            </h2>

            {/* TIMER */}
            <div className="flex justify-center mt-5">
              <div className="relative">
                <svg width="82" height="82" className="-rotate-90">
                  <circle
                    cx="41"
                    cy="41"
                    r="31"
                    stroke="#e5e7eb"
                    strokeWidth="6"
                    fill="transparent"
                  />
                  <circle
                    cx="41"
                    cy="41"
                    r="31"
                    stroke="#10b981"
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray="194"
                    strokeDashoffset={194 - (194 * progress) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-slate-700">
                    {timeLeft}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="py-3 text-center bg-emerald-50 rounded-xl">
                <h1 className="text-2xl font-bold text-emerald-600">
                  {currentIndex + 1}
                </h1>
                <p className="text-[10px] text-slate-500">CURRENT</p>
              </div>
              <div className="py-3 text-center bg-emerald-50 rounded-xl">
                <h1 className="text-2xl font-bold text-emerald-600">
                  {questions.length}
                </h1>
                <p className="text-[10px] text-slate-500">TOTAL</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex flex-col flex-1 p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-emerald-700">
              AI Smart Interview
            </h1>
            <div className="px-4 py-2 rounded-full bg-emerald-50">
              <p className="text-xs font-semibold text-emerald-600">
                {currentIndex + 1} / {questions.length}
              </p>
            </div>
          </div>

          {/* QUESTION */}
          <div className="mt-4 p-5 bg-[#f8fafb] rounded-2xl">
            <p className="text-[10px] uppercase font-bold tracking-[3px] text-emerald-600">
              Question
            </p>
            <h2 className="mt-2 text-[17px] leading-7 font-semibold text-slate-700">
              {questions[currentIndex]?.question || "Loading..."}
            </h2>
          </div>

          {/* ANSWER */}
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Speak or type your answer..."
            className="w-full flex-1 mt-4 bg-[#f8fafb] rounded-2xl p-5 outline-none focus:ring-0 border-none resize-none text-sm text-slate-600"
          />

          {/* BUTTONS */}
          <div className="flex gap-3 mt-5">
            <button
              onClick={toggleListening}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition shadow-md ${
                isListening ? "bg-red-500" : "bg-slate-900"
              }`}
            >
              <Mic size={18} className="text-white" />
            </button>

            <button
              onClick={handleNext}
              className="flex items-center justify-center flex-1 h-12 gap-2 font-semibold text-white transition rounded-full shadow-md bg-emerald-600 hover:bg-emerald-700"
            >
              Submit
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
