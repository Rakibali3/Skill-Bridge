import { useState } from "react";
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
  UserRoundArrowLeft,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useReceivedExchangeRequests } from "../../assets/hooks/useExchangeRequestData";

import api from "../../API/axios";
import { useProfileData } from "../../assets/hooks/useProfileData";

export default function TopBar({ onMenuClick }) {
  const navigate = useNavigate();
  const { data: requests = [] } = useReceivedExchangeRequests();
  const pendingCount = requests.filter((r) => r.status === "PENDING").length;

  const queryClient = useQueryClient();

  const [profileOpen, setProfileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { data: profileData, isLoading } = useProfileData();

  const userName =
    profileData?.userName ||
    profileData?.name ||
    "";

  const firstName = userName
    ? userName.trim().split(" ")[0].toUpperCase()
    : "";

  const avatarUrl = profileData?.avatarUrl || profileData?.profileUrl;

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      await api.post("/logout");
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      queryClient.clear();

      // Close dropdown
      setProfileOpen(false);

      // Go to login page
      navigate("/login", {
        replace: true,
      });

      setIsLoggingOut(false);
    }
  };


  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">

      <div className="flex items-center gap-3">

        {/* Mobile Menu */}
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-xl p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
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

      <div className="flex items-center gap-2 sm:gap-4">

        {/* Mobile Search */}
        <button
          type="button"
          className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 sm:hidden"
        >
          <Search size={21} />
        </button>


        {/* {Pending Requests} */}
        <button
            type="button"
            onClick={() => navigate("/requests")}
            className="relative inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
        >
            <UserRoundArrowLeft size={20} />
            <span>Requests</span>
            {pendingCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {pendingCount}
                </span>
            )}
        </button>

        {/* Notifications */}
        <button
          type="button"
          onClick={() => navigate("/notifications")}
          className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100"
        >
          <Bell size={21} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>


        {/* Divider */}
        <div className="h-8 w-px bg-slate-200" />


        <div className="relative">

          {/* Profile Button */}
          <button
            type="button"
            onClick={() =>
              setProfileOpen((previous) => !previous)
            }
            className="flex cursor-pointer items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-50 sm:gap-3"
          >

            {/* Avatar */}
            <img
              src={
                avatarUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  userName || "User"
                )}&background=6366f1&color=fff`
              }
              alt={firstName || "User Avatar"}
              className="h-9 w-9 rounded-full object-cover shadow-sm ring-2 ring-white"
            />


            {/* Name */}
            <div className="hidden text-left sm:block">

              <p className="text-sm font-semibold text-slate-800">
                {isLoading
                  ? "Loading..."
                  : firstName || "Your Name"}
              </p>

              <p className="text-[11px] text-slate-400">
                Skill Explorer
              </p>

            </div>


            {/* Chevron */}
            <ChevronDown
              size={16}
              className={`hidden text-slate-400 transition-transform sm:block ${profileOpen ? "rotate-180" : ""
                }`}
            />

          </button>


          {/* =================================================
              DROPDOWN
          ================================================= */}

          {profileOpen && (
            <div className="absolute right-0 top-14 w-52 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">

              {/* My Profile */}
              <NavLink
                to="/profile"
                onClick={() => setProfileOpen(false)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600 transition hover:bg-slate-50"
              >
                <User size={17} />
                My Profile
              </NavLink>


              {/* Settings */}
              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false);
                  navigate("/settings");
                }}
                className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600 transition hover:bg-slate-50"
              >
                <Settings size={17} />
                Settings
              </button>


              {/* Divider */}
              <div className="my-1 border-t border-slate-100" />


              {/* Logout */}
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {isLoggingOut ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-200 border-t-red-600" />
                ) : (
                  <LogOut size={17} />
                )}

                {isLoggingOut ? "Logging out..." : "Logout"}

              </button>

            </div>
          )}

        </div>

      </div>

    </header>
  );
}