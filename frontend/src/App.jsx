import { Routes, Route,Navigate } from "react-router-dom";
import Home from "./Pages/Home";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import StartInterviewForm from "./Pages/StartInterviewForm";
import ResumeInterview from "./Pages/ResumeInterview";
import { Toaster } from "react-hot-toast";
import Evaluate from "./Pages/Evaluate";
import EvaluateInterviewSession from "./Pages/EvaluateInterviewSession";
import AISmartInterview from "./Pages/AISmartInterview";
import SkillGapResult from "./Pages/SkillGapResult";
import UserProfileForm from "./Pages/UserProfileform";
import Profile from "./Pages/Profile";
import Dashboard from "./Pages/Dashboard";
import CreateProfile from "./Pages/CreateProfile";
import {useEffect,useState} from 'react';
import axios from 'axios';
import QuizResultPage from "./Pages/QuizResultPage";
import SkillGapForm from "./Pages/SkillGapForm";
import QuizPage from "./Pages/QuizPage";
import GetQuizPage from "./Pages/GetQuizPage";

const App = () => {

  const isAuthorized = Boolean(localStorage.getItem("token"));
    const [isProfile, setProfile] = useState(false);
 
useEffect(() => {
  const fetchProfile = async () => {
    try {
      const id = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:8989/profile/profile-exist/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    
      if(res.data.exists){
        setProfile(true);
        localStorage.setItem("Profile",true);
      }
    } catch (err) {
      console.log(err);
      setProfile(false);
    }
  };

  fetchProfile();
}, [isProfile]);
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={isAuthorized ? <Home /> : <Login />} />
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/get/" element={<GetQuizPage />}></Route>
        <Route path="/dashboard/:userId" element={<Dashboard />}></Route>
        <Route path="/quiz-results/:quizId" element={<QuizResultPage />}></Route>
        {/* <Route path="/create-profile" element={<CreateProfile />}></Route> */}
        
        <Route path="/start-interview" element={<StartInterviewForm />}></Route>
        <Route path="/interview" element={<ResumeInterview />} />
        <Route path="/evaluate/:sessionId/:userId" element={<Evaluate />} />
        <Route path="/smart-interview" element={<AISmartInterview />} />
          <Route path="/quiz" element={<QuizPage/>} />
        <Route
  path="/profile/:userId"
  element={
    isProfile ? <Profile /> : <CreateProfile/> 
  }
/>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/evaluate-interview/:sessionId"
          element={<EvaluateInterviewSession />}
        />
                <Route
  path="/skill-form" 
  element={
    isProfile ? <SkillGapForm /> : <CreateProfile/> 
  }
/>
        
      {/* <Route  path='/skill-gap' element={<SkillGapResult/>}></Route>
       <Route  path='/skill-form' element={<SkillGapForm/>}></Route> */}
      <Route path='/userProfile' element={<UserProfileForm/>}></Route>
       <Route path='/userProfile' element={<UserProfileForm/>}></Route>
      </Routes>
    </>  
  );
};

export default App;
