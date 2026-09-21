import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";import {
  Search,
  SlidersHorizontal,
  MapPin,
  ArrowRight,
  Sparkles,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useMatchingData } from "../../assets/hooks/useMatchingData";

export default function FindMatchesPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("match");
  const [sentRequests, setSentRequests] = useState([]);

  const { data: matchingData = [] } = useMatchingData();

  const handleProfile = async (id) => {
     navigate(`/profile/${id}`);
  };

  // Map incoming data into normalized match objects
  const matches = useMemo(() => {
    return matchingData.map((match) => {
      const name = match.userName || "Anonymous User";
      return {
        id: match.userId,
        name,
        role: match.experience || "Skill Exchange Partner",
        location: match.location || "Location not specified",
        match: Math.round(match.matchScore || 0),
        avatar:
          match.avatarUrl ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            name
          )}&background=6366f1&color=fff`,
        canTeach: match.canTeach || [],
        wantsToLearn: match.wantsToLearn || [],
      };
    });
  }, [matchingData]);

  // Filter & Sort Pipeline
  const filteredMatches = useMemo(() => {
    const query = search.trim().toLowerCase();

    return matches
      .filter((match) => {
        const matchesSearch =
          !query ||
          match.name.toLowerCase().includes(query) ||
          match.role.toLowerCase().includes(query) ||
          match.location.toLowerCase().includes(query) ||
          match.canTeach.some((s) => s.toLowerCase().includes(query)) ||
          match.wantsToLearn.some((s) => s.toLowerCase().includes(query));

        const matchesFilter =
          activeFilter === "ALL" ||
          (activeFilter === "HIGH" && match.match >= 80) ||
          (activeFilter === "TEACH_ME" && match.canTeach.length > 0) ||
          (activeFilter === "I_CAN_TEACH" && match.wantsToLearn.length > 0);

        return matchesSearch && matchesFilter;
      })
      .sort((a, b) =>
        sortBy === "name" ? a.name.localeCompare(b.name) : b.match - a.match
      );
  }, [matches, search, activeFilter, sortBy]);

  const handleSendRequest = (id) => {
    setSentRequests((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const handleResetFilters = () => {
    setSearch("");
    setActiveFilter("ALL");
    setSortBy("match");
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <header className="mb-6">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600">
              <Sparkles size={14} className="shrink-0" />
              <span>Smart Matching</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Your Skill Matches
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Discover people who match your learning and teaching goals.
            </p>
          </header>

          {/* Search, Filter & Sort */}
          <section className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, skill, or location..."
                aria-label="Search matches"
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              >
                <SlidersHorizontal size={16} className="text-slate-500" />
                <span>Filters</span>
              </button>

              <div className="relative min-w-[180px]">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  aria-label="Sort options"
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-3.5 pr-9 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="match">Sort by: Match Score</option>
                  <option value="name">Sort by: Name</option>
                </select>
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>
          </section>

          {/* Filter Navigation */}
          <nav aria-label="Filter tabs" className="mb-5 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: "ALL", label: "All" },
              { id: "HIGH", label: "High Match" },
              { id: "TEACH_ME", label: "Can Teach Me" },
              { id: "I_CAN_TEACH", label: "I Can Teach" },
            ].map((tab) => (
              <FilterButton
                key={tab.id}
                active={activeFilter === tab.id}
                onClick={() => setActiveFilter(tab.id)}
              >
                {tab.label}
              </FilterButton>
            ))}
          </nav>

          {/* Counter */}
          <div className="mb-4">
            <p className="text-sm text-slate-500">
              <span className="font-semibold text-slate-800">
                {filteredMatches.length}
              </span>{" "}
              {filteredMatches.length === 1 ? "match" : "matches"} found
            </p>
          </div>

          {/* Match Cards List */}
          {filteredMatches.length > 0 ? (
            <section className="space-y-4">
              {filteredMatches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  requestSent={sentRequests.includes(match.id)}
                  onSendRequest={handleSendRequest}
                  onViewProfile={handleProfile}

                />
              ))}
            </section>
          ) : (
            /* Empty State */
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <Search size={22} />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-800">
                No matches found
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Try searching for another skill or clearing your current filters.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-4 inline-flex items-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

// ============================================================
// SUB-COMPONENTS
// ============================================================

function MatchCard({ match, requestSent, onSendRequest,onViewProfile }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5">
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[220px_1fr_120px_160px] xl:items-center">
        {/* Profile */}
        <div className="flex items-center gap-3.5">
          <img
            src={match.avatar}
            alt={match.name}
            className="h-14 w-14 shrink-0 rounded-full object-cover bg-slate-100"
          />
          <div className="min-w-0">
            <h2 className="truncate text-base font-bold text-slate-800">
              {match.name}
            </h2>
            <p className="truncate text-xs font-medium text-slate-500">
              {match.role}
            </p>
            <div className="mt-1 flex items-center gap-1 text-xs text-slate-400">
              <MapPin size={12} className="shrink-0" />
              <span className="truncate">{match.location}</span>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SkillGroup title="Can teach you" skills={match.canTeach} type="teach" />
          <SkillGroup title="Wants to learn" skills={match.wantsToLearn} type="learn" />
        </div>

        {/* Match Score */}
        <MatchScore score={match.match} />

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-100"
            onClick = {() => onViewProfile(match.id)}
          >
            View Profile
          </button>

          <button
            type="button"
            disabled={requestSent}
            onClick={() => onSendRequest(match.id)}
            className={`inline-flex w-full items-center justify-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition focus:outline-none ${
              requestSent
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                : "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500/20"
            }`}
          >
            {requestSent ? (
              <>
                <CheckCircle2 size={14} />
                <span>Request Sent</span>
              </>
            ) : (
              <>
                <span>Send Request</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

function SkillGroup({ title, skills, type }) {
  const isTeach = type === "teach";

  return (
    <div>
      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        {title}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {skills.map((skill) => (
          <span
            key={skill}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium ${
              isTeach
                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                : "bg-indigo-50 text-indigo-700 border border-indigo-100"
            }`}
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

function MatchScore({ score }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (score / 100) * circumference;
  const isHighMatch = score >= 80;

  return (
    <div className="flex items-center xl:justify-center">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 64 64">
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            stroke="#f1f5f9"
            strokeWidth="5"
          />
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            stroke={isHighMatch ? "#10b981" : "#f59e0b"}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={progress}
            className="transition-all duration-500 ease-out"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-sm font-extrabold leading-none text-slate-800">
            {score}%
          </span>
          <span className="mt-0.5 text-[9px] font-medium tracking-tight text-slate-400">
            Match
          </span>
        </div>
      </div>
    </div>
  );
}

function FilterButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-xl px-4 py-2 text-xs font-semibold transition ${
        active
          ? "bg-indigo-600 text-white shadow-sm"
          : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      {children}
    </button>
  );
}