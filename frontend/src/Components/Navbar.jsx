import React, { useState } from "react";
import { CheckCircle, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="relative w-full bg-white border-b border-emerald-100">
      {/* DESKTOP & BASE LAYOUT */}
      <div className="flex items-center justify-between px-6 py-4 mx-auto max-w-7xl">
        
        {/* LEFT SIDE LOGO */}
        <div className="flex items-center gap-2">
          <h1 className="font-bold text-small">
            interviewPrep<span className="text-emerald-500">.AI</span>
          </h1>
          
        </div>

        {/* RIGHT BUTTON (Hidden on Mobile, Visible on Desktop) */}
        <div className="hidden md:block">
          <button className="flex items-center gap-2 px-5 py-2 transition border rounded-full shadow-sm bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100">
            <CheckCircle size={18} />
            AI Generated 
          </button>
        </div>

        {/* HAMBURGER MENU BUTTON (Visible on Mobile Only) */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 transition rounded-md text-emerald-600 hover:bg-emerald-50 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {isOpen && (
        <div className="absolute left-0 right-0 z-50 p-4 duration-200 border-b bg-white/95 backdrop-blur-sm border-emerald-100 md:hidden animate-in fade-in slide-in-from-top-5">
          <div className="flex flex-col gap-4">
            <button className="flex items-center justify-center w-full gap-2 px-5 py-3 transition border rounded-full shadow-sm bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100">
              <CheckCircle size={18} />
              AI Generated 
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;