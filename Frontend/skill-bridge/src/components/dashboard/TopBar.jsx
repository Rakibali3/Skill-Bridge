import { useState } from "react";
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

import api from "../../API/axios";

export default function TopBar({ onMenuClick }) {
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);

  const user = {
    name: "Ali Khan",
    role: "Skill Explorer",
    avatar: "https://i.pravatar.cc/150?img=12",
  };

  const handleLogout = async () => {
    try {
      await api.post("/logout");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      {/* Left */}
      <div className="flex items-center gap-3">
        {/* Mobile Menu */}
        <button
          onClick={onMenuClick}
          className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <Menu size={23} />
        </button>

        {/* Search */}
        <div className="relative hidden sm:block">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search for people, skills, communities..."
            className="
              h-11
              w-[280px]
              rounded-xl
              border
              border-slate-200
              bg-slate-50
              pl-11
              pr-4
              text-sm
              outline-none
              transition
              placeholder:text-slate-400
              focus:border-indigo-300
              focus:bg-white
              focus:ring-4
              focus:ring-indigo-50
              md:w-[360px]
              lg:w-[430px]
            "
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Mobile Search */}
        <button className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 sm:hidden">
          <Search size={21} />
        </button>

        {/* Notifications */}
        <button
          onClick={() => navigate("/notifications")}
          className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100"
        >
          <Bell size={21} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        <div className="h-8 w-px bg-slate-200" />

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-slate-50 sm:gap-3"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="h-9 w-9 rounded-full object-cover ring-2 ring-white shadow-sm"
            />

            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold text-slate-800">
                {user.name}
              </p>

              <p className="text-[11px] text-slate-400">
                {user.role}
              </p>
            </div>

            <ChevronDown
              size={16}
              className="hidden text-slate-400 sm:block"
            />
          </button>

          {/* Dropdown */}
          {profileOpen && (
            <div className="absolute right-0 top-14 w-52 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
              <NavLink
                to="/profile"
                onClick={() => setProfileOpen(false)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
              >
                <User size={17} />
                My Profile
              </NavLink>

              <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50">
                <Settings size={17} />
                Settings
              </button>

              <div className="my-1 border-t border-slate-100" />

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut size={17} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}