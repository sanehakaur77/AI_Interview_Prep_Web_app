import React, { useState } from "react";
import { Eye, EyeOff, ArrowRight, User, Mail } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);

  // state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // handle change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  //  for navigation
  const navigate = useNavigate();

  //  submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:8989/api/auth/signup",
        formData,
      );
      toast.success("Sign Up Sucessful!");
      if (res.data.success) {
        navigate("/login");
      }

      setFormData({
        name: "",
        email: "",
        password: "",
      });
    } catch (error) {
      toast.error(Object.values(error.response.data.errors).join(", "));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-3 bg-gray-100">
      <div className="w-full max-w-xs p-5 bg-white shadow-lg rounded-xl">
        <div className="mb-4 text-center">
          <h1 className="text-xl font-semibold text-slate-900">
            Create an account
          </h1>
        </div>

        {/*  FORM CONNECTED */}
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="flex items-center px-2 border rounded-md border-slate-200 focus-within:ring-1 focus-within:ring-blue-400">
            <User size={14} className="text-slate-400" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full p-2 text-xs bg-transparent outline-none"
            />
          </div>

          <div className="flex items-center px-2 border rounded-md border-slate-200 focus-within:ring-1 focus-within:ring-blue-400">
            <Mail size={14} className="text-slate-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full p-2 text-xs bg-transparent outline-none"
            />
          </div>

          <div className="flex items-center px-2 border rounded-md border-slate-200 focus-within:ring-1 focus-within:ring-blue-400">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full p-2 text-xs bg-transparent outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-400"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <button
            type="submit"
            className="flex items-center justify-center w-full gap-2 py-2 text-xs font-medium text-white transition rounded-md bg-slate-900 hover:bg-slate-800"
          >
            Get Started <ArrowRight size={14} />
          </button>
        </form>

        {/* SAME UI BELOW */}
        <div className="flex items-center my-4">
          <div className="flex-1 h-px bg-slate-200"></div>
          <span className="px-2 text-[10px] text-slate-400">OR</span>
          <div className="flex-1 h-px bg-slate-200"></div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button className="flex items-center justify-center gap-1 border border-slate-200 rounded-md py-1.5 text-xs hover:bg-slate-100 transition">
            <FontAwesomeIcon icon={faGoogle} className="text-sm text-red-500" />
            Google
          </button>

          <button className="flex items-center justify-center gap-1 border border-slate-200 rounded-md py-1.5 text-xs hover:bg-slate-100 transition">
            <FontAwesomeIcon icon={faGithub} className="text-sm text-black" />
            GitHub
          </button>
        </div>

        <p className="text-[10px] text-center text-slate-500 mt-4">
          Already have an account?{" "}
          <span className="font-medium text-blue-600 cursor-pointer hover:underline">
            <Link to="/login">Login</Link>
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
