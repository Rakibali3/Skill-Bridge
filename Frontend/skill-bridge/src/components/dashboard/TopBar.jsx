import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
    ArrowLeft,
    ChevronDown,
    LogOut,
    Menu,
    Search,
    User,
    UserRoundArrowLeft,
    Users,
    X,
    Loader2,
    Moon,
    Sun,
} from "lucide-react";
import NotificationBell from "../notifications/NotificationBell";
import { useTheme } from "../../assets/theme/ThemeContext";

import { NavLink, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { useReceivedExchangeRequests } from "../../assets/hooks/useExchangeRequestData";
import { useGlobalSearch } from "../../assets/hooks/useSearchData";
import { useProfileData } from "../../assets/hooks/useProfileData";

import api from "../../API/axios";

/* ------------------------------------------------------------------ */
/* Small shared pieces                                                 */
/* ------------------------------------------------------------------ */

function avatarFallback(name) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name || "User"
    )}&background=6366f1&color=fff`;
}

function ResultRow({ image, icon: Icon, title, subtitle, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-slate-50 active:bg-slate-100"
        >
            {image ? (
                <img
                    src={image}
                    alt=""
                    className="h-10 w-10 shrink-0 rounded-full object-cover"
                />
            ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <Icon size={18} />
                </div>
            )}

            <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-800">{title}</p>
                <p className="truncate text-xs text-slate-400">{subtitle}</p>
            </div>
        </button>
    );
}

function ResultGroup({ label, children }) {
    return (
        <div className="border-t border-slate-100 p-2 first:border-t-0">
            <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {label}
            </p>
            {children}
        </div>
    );
}

function NoResults() {
    return (
        <div className="px-5 py-10 text-center">
            <Search size={28} className="mx-auto mb-3 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">No results found</p>
            <p className="mt-1 text-xs leading-5 text-slate-400">
                Try another person, skill or community.
            </p>
        </div>
    );
}

/** Shared results body — used by both the desktop dropdown and the mobile overlay. */
function SearchResultsBody({ isSearching, results, onSelect }) {
    if (isSearching) {
        return (
            <div className="flex items-center justify-center gap-2 px-4 py-8 text-sm text-slate-500">
                <Loader2 size={16} className="animate-spin" />
                Searching...
            </div>
        );
    }

    if (!results) return null;

    const { users = [], skills = [], communities = [] } = results;
    const hasResults = users.length > 0 || skills.length > 0 || communities.length > 0;

    if (!hasResults) return <NoResults />;

    return (
        <>
            {users.length > 0 && (
                <ResultGroup label="People">
                    {users.map((user) => (
                        <ResultRow
                            key={user.id}
                            image={user.avatarUrl || avatarFallback(user.name)}
                            title={user.name}
                            subtitle="Person"
                            onClick={() => onSelect("person", user.id)}
                        />
                    ))}
                </ResultGroup>
            )}

            {skills.length > 0 && (
                <ResultGroup label="Skills">
                    {skills.map((skill) => (
                        <ResultRow
                            key={skill.id}
                            icon={Search}
                            title={skill.name}
                            subtitle={skill.category || "Skill"}
                            onClick={() => onSelect("skill", skill.name)}
                        />
                    ))}
                </ResultGroup>
            )}

            {communities.length > 0 && (
                <ResultGroup label="Communities">
                    {communities.map((community) => (
                        <ResultRow
                            key={community.id}
                            image={community.iconUrl}
                            icon={Users}
                            title={community.name}
                            subtitle={`${community.memberCount} members`}
                            onClick={() => onSelect("community", community.id)}
                        />
                    ))}
                </ResultGroup>
            )}
        </>
    );
}

/* ------------------------------------------------------------------ */
/* TopBar                                                               */
/* ------------------------------------------------------------------ */

export default function TopBar({ onMenuClick }) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { theme, toggleTheme } = useTheme();

    /* ---------------- profile ---------------- */

    const { data: profileData, isLoading: profileLoading } = useProfileData();

    const userName = profileData?.userName || profileData?.name || "";
    const firstName = userName ? userName.trim().split(" ")[0].toUpperCase() : "";
    const avatarUrl = profileData?.avatarUrl || profileData?.profileUrl;

    const [profileOpen, setProfileOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const profileRef = useRef(null);

    /* ---------------- requests badge ---------------- */

    const { data: requests = [] } = useReceivedExchangeRequests();
    const pendingCount = requests.filter((r) => r.status === "PENDING").length;

    /* ---------------- search ---------------- */

    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const searchRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const { data: searchResults, isFetching: isSearching } =
        useGlobalSearch(debouncedQuery);

    const shouldShowResults = showSearchResults && searchQuery.trim().length >= 2;

    /* ---------------- outside click / escape ---------------- */

    useEffect(() => {
        const handleClick = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setProfileOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearchResults(false);
            }
        };

        const handleKeyDown = (event) => {
            if (event.key !== "Escape") return;
            setProfileOpen(false);
            setShowSearchResults(false);
            if (mobileSearchOpen) closeMobileSearch();
        };

        document.addEventListener("mousedown", handleClick);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("mousedown", handleClick);
            document.removeEventListener("keydown", handleKeyDown);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mobileSearchOpen]);

    // close mobile search overlay if viewport grows past small screens
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 640) setMobileSearchOpen(false);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    /* ---------------- handlers ---------------- */

    const clearSearch = () => {
        setSearchQuery("");
        setDebouncedQuery("");
        setShowSearchResults(false);
    };

    const closeMobileSearch = () => {
        setMobileSearchOpen(false);
        clearSearch();
    };

    const handleSelectResult = (type, value) => {
        closeMobileSearch();
        setShowSearchResults(false);

        if (type === "person") navigate(`/profile/${value}`);
        if (type === "skill") navigate(`/matches?skill=${encodeURIComponent(value)}`);
        if (type === "community") navigate(`/communities/${value}`);
    };

    const handleLogout = async () => {
        if (isLoggingOut) return;
        setIsLoggingOut(true);

        try {
            await api.post("/logout");
        } catch (error) {
            console.error("Logout request failed:", error);
        } finally {
            queryClient.clear();
            setProfileOpen(false);
            navigate("/login", { replace: true });
            setIsLoggingOut(false);
        }
    };

    /* ---------------- render ---------------- */

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-2 border-b border-slate-200 bg-white/95 px-3 backdrop-blur sm:h-20 sm:px-6 lg:px-8">
            {/* LEFT: menu + desktop search */}
            <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
                <button
                    type="button"
                    onClick={onMenuClick}
                    className="shrink-0 rounded-xl p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
                    aria-label="Open menu"
                >
                    <Menu size={22} />
                </button>

                <div ref={searchRef} className="relative hidden sm:block">
                    <Search
                        size={18}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(event) => {
                            setSearchQuery(event.target.value);
                            setShowSearchResults(true);
                        }}
                        onFocus={() => {
                            if (searchQuery.trim().length >= 2) setShowSearchResults(true);
                        }}
                        placeholder="Search people, skills, communities..."
                        className="h-11 w-64 rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-50 md:w-80 lg:w-96"
                    />

                    {shouldShowResults && (
                        <div className="absolute left-0 right-0 top-full z-[60] mt-2 max-h-[28rem] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">
                            <SearchResultsBody
                                isSearching={isSearching}
                                results={searchResults}
                                onSelect={handleSelectResult}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT: actions + profile */}
            <div className="flex shrink-0 items-center gap-1 sm:gap-3">
                <button
                    type="button"
                    onClick={() => {
                        setMobileSearchOpen(true);
                        setProfileOpen(false);
                    }}
                    className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 sm:hidden"
                    aria-label="Open search"
                >
                    <Search size={20} />
                </button>

                <button
                    type="button"
                    onClick={() => navigate("/requests")}
                    className="relative flex items-center gap-2 rounded-xl px-2 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 sm:px-3"
                >
                    <UserRoundArrowLeft size={20} />
                    <span className="hidden sm:inline">Requests</span>

                    {pendingCount > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                            {pendingCount > 9 ? "9+" : pendingCount}
                        </span>
                    )}
                </button>

               <button
                    type="button"
                    onClick={toggleTheme}
                    aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
                    title={theme === "dark" ? "Light theme" : "Dark theme"}
                    className="rounded-xl p-2 text-slate-600 transition hover:bg-slate-100"
                >
                    {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
                </button>
                <NotificationBell />

                <div className="hidden h-8 w-px bg-slate-200 sm:block" />

                {/* Profile */}
                <div ref={profileRef} className="relative">
                    <button
                        type="button"
                        onClick={() => setProfileOpen((prev) => !prev)}
                        className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-50 sm:gap-3"
                        aria-haspopup="menu"
                        aria-expanded={profileOpen}
                    >
                        <img
                            src={avatarUrl || avatarFallback(userName)}
                            alt=""
                            className="h-9 w-9 rounded-full object-cover shadow-sm ring-2 ring-white"
                        />

                        <div className="hidden text-left sm:block">
                            <p className="text-sm font-semibold text-slate-800">
                                {profileLoading ? "Loading..." : firstName || "Your Name"}
                            </p>
                            <p className="text-[11px] text-slate-400">Skill Explorer</p>
                        </div>

                        <ChevronDown
                            size={16}
                            className={`hidden text-slate-400 transition-transform sm:block ${
                                profileOpen ? "rotate-180" : ""
                            }`}
                        />
                    </button>

                    {profileOpen && (
                        <div
                            role="menu"
                            className="absolute right-0 top-14 z-50 w-52 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl"
                        >
                            <NavLink
                                to="/profile"
                                onClick={() => setProfileOpen(false)}
                                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600 transition hover:bg-slate-50"
                            >
                                <User size={17} />
                                My Profile
                            </NavLink>

                            <div className="my-1 border-t border-slate-100" />

                            <button
                                type="button"
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                            >
                                {isLoggingOut ? (
                                    <Loader2 size={17} className="animate-spin" />
                                ) : (
                                    <LogOut size={17} />
                                )}
                                {isLoggingOut ? "Logging out..." : "Logout"}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* MOBILE SEARCH OVERLAY — portaled to <body> so it always sits
                above everything, regardless of the header's own stacking
                context (sticky + z-index creates one, which otherwise traps
                position:fixed children behind normal page content). */}
            {mobileSearchOpen &&
                createPortal(
                    <div className="fixed inset-0 z-[100] flex flex-col bg-white sm:hidden">
                        <div className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-200 px-3">
                        <button
                            type="button"
                            onClick={closeMobileSearch}
                            className="shrink-0 rounded-xl p-2 text-slate-600 hover:bg-slate-100"
                            aria-label="Close search"
                        >
                            <ArrowLeft size={22} />
                        </button>

                        <div className="relative min-w-0 flex-1">
                            <Search
                                size={18}
                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                autoFocus
                                type="text"
                                value={searchQuery}
                                onChange={(event) => {
                                    setSearchQuery(event.target.value);
                                    setShowSearchResults(true);
                                }}
                                placeholder="Search people, skills..."
                                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm outline-none focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                            />

                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchQuery("");
                                        setDebouncedQuery("");
                                    }}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
                                    aria-label="Clear search"
                                >
                                    <X size={17} />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="min-h-0 flex-1 basis-0 overflow-y-auto px-3 py-2">
                        {searchQuery.trim().length < 2 ? (
                            <div className="px-5 py-16 text-center">
                                <Search size={36} className="mx-auto mb-4 text-slate-200" />
                                <p className="text-sm font-medium text-slate-600">
                                    Search SkillBridge
                                </p>
                                <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-slate-400">
                                    Find people, skills and communities.
                                </p>
                            </div>
                        ) : (
                            <SearchResultsBody
                                isSearching={isSearching}
                                results={searchResults}
                                onSelect={handleSelectResult}
                            />
                        )}
                    </div>
                    </div>,
                    document.body
                )}
        </header>
    );
}