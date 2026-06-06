import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";

export default function GetQuizPage() {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const quizId = localStorage.getItem("quizId");
  const userId = localStorage.getItem("userId");


  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8989/assignment/get/${quizId}`
        );

        setQuiz(res.data.data);
        localStorage.setItem(res.data.data._id);
      } catch (err) {
        console.log("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, []);

  // ======================
  // SELECT ANSWER
  // ======================
  const handleSelect = (questionId, option) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  // ======================
  // SUBMIT QUIZ
  // ======================
  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      const payload = {
        answers: Object.keys(answers).map((qid) => ({
          questionId: qid,
          selectedAnswer: answers[qid],
        })),
      };
        const userId=localStorage.getItem("userId");
        const quizId=localStorage.getItem("quizId");
      const res = await axios.post(
        `http://localhost:8989/assignment/submit/${quizId}/${userId}`,
        payload
      );

      setResult(res.data.data);
      console.log("Result:", res.data);
    } catch (err) {
      console.log("Submit error:", err);
      alert("Quiz submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  // ======================
  // LOADING
  // ======================
  if (loading) {
    return <h2 style={{ padding: 20 }}>Loading quiz...</h2>;
  }

  // ======================
  // NO QUIZ
  // ======================
  if (!quiz) {
    return <h2>No quiz found</h2>;
  }

  // ======================
  // RESULT SCREEN
  // ======================
  if (result) {
    return (
      <div style={{ padding: 20, fontFamily: "Arial" }}>
        <h1>🎯 Quiz Result</h1>

        <div style={{ marginTop: 20 }}>
          <h2>Score: {result.score}</h2>
          <h3>Total Questions: {result.totalQuestions}</h3>
          <h3>Percentage: {result.percentage}%</h3>
        </div>

        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: 20,
            padding: "10px 15px",
            background: "black",
            color: "white",
            border: "none",
          }}
        >
          Retake Quiz
        </button>
      </div>
    );
  }

  // ======================
  // MAIN QUIZ UI
  // ======================
  return (
    <>
   <Navbar/>
    <div style={{ padding: 20, fontFamily: "Arial", maxWidth: 800, margin: "auto" }}>
      
      {/* HEADER */}
      <h1>{quiz.company} - {quiz.targetRole}</h1>
      <p>Difficulty: <b>{quiz.difficulty}</b></p>

      <hr />

      
      {quiz.questions.map((q, index) => (
        <div
          key={q._id}
          style={{
            marginBottom: 20,
            padding: 15,
            border: "1px solid #ddd",
            borderRadius: 8,
          }}
        >
          <h3>
            {index + 1}. {q.question}
          </h3>

          {q.options.map((opt, i) => (
            <label
              key={i}
              style={{
                display: "block",
                margin: "6px 0",
                cursor: "pointer",
              }}
            >
              <input
                type="radio"
                name={q._id}
                checked={answers[q._id] === opt}
                onChange={() => handleSelect(q._id, opt)}
              />
              {" "}{opt}
            </label>
          ))}
        </div>
      ))}

      {/* SUBMIT BUTTON */}
      <button
        onClick={handleSubmit}
        disabled={submitting}
        style={{
          width: "100%",
          padding: "12px",
          background: submitting ? "gray" : "black",
          color: "white",
          border: "none",
          cursor: "pointer",
          fontSize: 16,
          marginTop: 10,
        }}
      >
        {submitting ? "Submitting..." : "Submit Quiz"}
      </button>
    </div>
    </>
  );
}