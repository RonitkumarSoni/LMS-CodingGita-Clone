import React, { useEffect, useRef, useState } from "react";
import { Menu, X, ChevronDown, Settings } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { getInitials } from "../utils/getInitials";
import { logout } from "../utils/auth";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const navigate = useNavigate();
  const settingsRef = useRef(null);

  const data = localStorage.getItem("user");
  const user = data ? JSON.parse(data) : null;

  const initials = getInitials(user?.name);
  const desktopTabClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ease-out ${
      isActive
        ? "bg-neutral-800 text-white"
        : "text-neutral-300 hover:text-white hover:bg-neutral-800"
    }`;

  const mobileTabClass = ({ isActive }) =>
    `px-3 py-2 rounded transition-colors duration-200 ease-out ${
      isActive
        ? "bg-neutral-800 text-white"
        : "text-neutral-300 hover:text-white hover:bg-neutral-800"
    }`;

  const handleLogout = () => {
    logout();
    setOpen(false);
    setSettingsOpen(false);
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setSettingsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-neutral-800 bg-neutral-900/80 backdrop-blur supports-backdrop-filter:bg-neutral-900/60">
      {/* TOP BAR */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          {/* LOGO */}
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white">
            {initials}
          </div>

          <span className="text-white font-semibold">Student</span>

          {/* DESKTOP MENU */}
          <nav className="hidden md:flex items-center gap-1 ml-2">
            <NavLink to="/student" end className={desktopTabClass}>
              Dashboard
            </NavLink>

            <NavLink to="/student/attendance" className={desktopTabClass}>
              Attendance
            </NavLink>

            <NavLink to="/student/calendar" className={desktopTabClass}>
              Calendar
            </NavLink>

            <NavLink to="/student/chat" className={desktopTabClass}>
              Chat
            </NavLink>

            {/* MORE */}
            <div className="relative group">
              <button className="px-3 py-2 text-sm text-neutral-300 hover:text-white hover:bg-neutral-800 rounded flex items-center gap-1 transition-colors duration-200 ease-out">
                More <ChevronDown size={16} />
              </button>

              <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 ease-out absolute left-0 mt-2 w-48 rounded-lg border border-neutral-800 bg-neutral-900 shadow-xl">
                <div className="p-2 space-y-1">
                  <NavLink
                    to="/student/semester-attendance"
                    className="block px-3 py-2 text-sm hover:bg-neutral-800 rounded transition-colors duration-200 ease-out"
                  >
                    Semester Attendance
                  </NavLink>

                  <NavLink
                    to="/student/feedback"
                    className="block px-3 py-2 text-sm hover:bg-neutral-800 rounded transition-colors duration-200 ease-out"
                  >
                    Feedback
                  </NavLink>

                  <NavLink
                    to="/student/weekly-subject-feedback"
                    className="block px-3 py-2 text-sm hover:bg-neutral-800 rounded transition-colors duration-200 ease-out"
                  >
                    Weekly Subject Feedback
                  </NavLink>

                  <NavLink
                    to="/student/apply-leave"
                    className="block px-3 py-2 text-sm hover:bg-neutral-800 rounded transition-colors duration-200 ease-out"
                  >
                    Apply Leave
                  </NavLink>
                </div>
              </div>
            </div>
          </nav>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          {/* SETTINGS DROPDOWN */}
          <div ref={settingsRef} className="relative hidden md:block">
            <button
              type="button"
              onClick={() => setSettingsOpen((prev) => !prev)}
              className="p-2 rounded-md text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors duration-200 ease-out"
            >
              <Settings size={18} />
            </button>

            {/* DROPDOWN */}
            <div
              className={`absolute right-0 mt-2 w-64 rounded-lg border border-neutral-800 bg-neutral-900 shadow-xl transition-all duration-200 ease-out ${
                settingsOpen
                  ? "visible opacity-100"
                  : "invisible opacity-0 pointer-events-none"
              }`}
            >
              {/* USER */}
              <div className="p-4 border-b border-neutral-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center text-xs font-bold">
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center text-xs font-bold">
                      {initials}
                    </div>
                  )}
                </div>

                <div className="text-white text-sm font-medium truncate">
                  {user?.name}
                </div>
              </div>

              {/* MENU */}
              <div className="p-2">
                <NavLink
                  to="/student/profile"
                  className="block w-full text-left text-sm px-3 py-2 rounded-md text-neutral-200 hover:bg-neutral-800 transition-colors duration-200 ease-out"
                >
                  View Profile
                </NavLink>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left text-sm px-3 py-2 rounded-md text-neutral-200 hover:bg-neutral-800 cursor-pointer transition-colors duration-200 ease-out"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* MOBILE BUTTON */}
          <button
            className="md:hidden p-2 rounded-md text-neutral-300 hover:bg-neutral-800 transition-colors duration-200 ease-out"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden border-b border-neutral-800 bg-neutral-900/95 backdrop-blur px-4 sm:px-6 lg:px-8 py-3">
          <div className="max-w-7xl mx-auto flex flex-col gap-1">
            <NavLink to="/student" end className={mobileTabClass}>
              Dashboard
            </NavLink>

            <NavLink to="/student/attendance" className={mobileTabClass}>
              Attendance
            </NavLink>

            <NavLink to="/student/calendar" className={mobileTabClass}>
              Calendar
            </NavLink>

            <NavLink to="/student/chat" className={mobileTabClass}>
              Chat
            </NavLink>

            <NavLink
              to="/student/semester-attendance"
              className="px-3 py-2 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded transition-colors duration-200 ease-out"
            >
              Semester Attendance
            </NavLink>

            <NavLink
              to="/student/feedback"
              className="px-3 py-2 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded transition-colors duration-200 ease-out"
            >
              Feedback
            </NavLink>

            <NavLink
              to="/student/weekly-subject-feedback"
              className="px-3 py-2 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded transition-colors duration-200 ease-out"
            >
              Weekly Subject Feedback
            </NavLink>

            <NavLink
              to="/student/apply-leave"
              className="px-3 py-2 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded transition-colors duration-200 ease-out"
            >
              Apply Leave
            </NavLink>

            <div className="border-t border-neutral-800 my-2" />

            <NavLink
              to="/student/profile"
              className="px-3 py-2 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded transition-colors duration-200 ease-out"
            >
              View Profile
            </NavLink>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded transition-colors duration-200 ease-out"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
