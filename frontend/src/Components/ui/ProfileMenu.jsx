import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faGear,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

const ProfileMenu = ({ username }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  const initial = username?.[0]?.toUpperCase() || "?";

  // close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* Profile Button */}
      <button
        onClick={() => setMenuOpen((prev) => !prev)}
        className="flex items-center justify-center w-10 h-10 font-semibold text-white transition rounded-full shadow-md bg-gradient-to-r from-emerald-400 to-emerald-600 hover:scale-105"
      >
        {initial}
      </button>

      {/* Dropdown */}
      <div
        className={`absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 transform transition-all duration-200 ${
          menuOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b bg-gray-50">
          <p className="text-xs text-gray-500">Signed in as</p>
          <p className="font-semibold text-gray-800 truncate">{username}</p>
        </div>

        {/* Menu Items */}
        <div className="p-2 space-y-1">
          <button className="flex items-center w-full gap-3 px-3 py-2 text-gray-700 transition rounded-lg hover:bg-gray-100">
            <FontAwesomeIcon icon={faUser} />
            Profile
          </button>

          <button className="flex items-center w-full gap-3 px-3 py-2 text-gray-700 transition rounded-lg hover:bg-gray-100">
            <FontAwesomeIcon icon={faGear} />
            Settings
          </button>

          <div className="my-2 border-t"></div>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.reload();
            }}
            className="flex items-center w-full gap-3 px-3 py-2 text-red-500 transition rounded-lg hover:bg-red-100"
          >
            <FontAwesomeIcon icon={faRightFromBracket} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileMenu;
