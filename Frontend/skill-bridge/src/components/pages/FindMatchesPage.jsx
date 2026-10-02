import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Search,
    SlidersHorizontal,
    MapPin,
    ArrowRight,
    Sparkles,
    ChevronDown,
    CheckCircle2,
    Clock,
    Loader2,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useMatchingData } from "../../assets/hooks/useMatchingData";
import {
    useSendExchangeRequest,
    useSentExchangeRequests,
} from "../../assets/hooks/useExchangeRequestData";
import {
    useFilteredMatches,
    HIGH_MATCH_THRESHOLD,
    MATCH_FILTERS,
    MATCH_SORT_OPTIONS,
} from "../../assets/hooks/useFilteredMatches";

const FILTER_TABS = [
    { id: MATCH_FILTERS.ALL, label: "All" },
    { id: MATCH_FILTERS.HIGH, label: "High Match" },
    { id: MATCH_FILTERS.TEACH_ME, label: "Can Teach Me" },
    { id: MATCH_FILTERS.I_CAN_TEACH, label: "I Can Teach" },
];

export default function FindMatchesPage() {
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState(MATCH_FILTERS.ALL);
    const [sortBy, setSortBy] = useState(MATCH_SORT_OPTIONS.SCORE);
    const [requestError, setRequestError] = useState("");

    const { data: matchingData = [], isLoading: matchesLoading } = useMatchingData();
    const { data: sentRequests = [], isLoading: sentRequestsLoading } = useSentExchangeRequests();

    const sendRequestMutation = useSendExchangeRequest();

    const sentStatusByReceiverId = useMemo(() => {
        return new Map(sentRequests.map((request) => [request.receiverId, request.status]));
    }, [sentRequests]);

    const filteredMatches = useFilteredMatches(matchingData, {
        search,
        activeFilter,
        sortBy,
    });

    const handleViewProfile = (match) => {
        navigate(`/profile/${match.id}`, {
            state: {
                canTeach: match.canTeach,
                wantsToLearn: match.wantsToLearn,
            },
        });
    };

    const handleSendRequest = async (receiverId) => {
        setRequestError("");
        try {
            await sendRequestMutation.mutateAsync(receiverId);
        } catch (error) {
            setRequestError(
                getApiErrorMessage(error, "Unable to send request. Please try again.")
            );
        }
    };

    const handleResetFilters = () => {
        setSearch("");
        setActiveFilter(MATCH_FILTERS.ALL);
        setSortBy(MATCH_SORT_OPTIONS.SCORE);
    };

    const isLoading = matchesLoading || sentRequestsLoading;

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex min-h-[500px] items-center justify-center">
                    <Loader2 size={36} className="animate-spin text-indigo-600" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-6xl">
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

                    {requestError && (
                        <div className="mb-5 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            <span>{requestError}</span>
                            <button
                                type="button"
                                onClick={() => setRequestError("")}
                                className="font-semibold hover:underline"
                            >
                                Dismiss
                            </button>
                        </div>
                    )}

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
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                            >
                                <SlidersHorizontal size={16} className="text-slate-500" />
                                <span>Filters</span>
                            </button>

                            <div className="relative min-w-[180px]">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-3.5 pr-9 text-sm font-medium text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                >
                                    <option value={MATCH_SORT_OPTIONS.SCORE}>Sort by: Match Score</option>
                                    <option value={MATCH_SORT_OPTIONS.NAME}>Sort by: Name</option>
                                </select>
                                <ChevronDown
                                    size={16}
                                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                            </div>
                        </div>
                    </section>

                    <nav
                        aria-label="Filter tabs"
                        className="mb-5 flex gap-2 overflow-x-auto pb-1 scrollbar-none"
                    >
                        {FILTER_TABS.map((tab) => (
                            <FilterButton
                                key={tab.id}
                                active={activeFilter === tab.id}
                                onClick={() => setActiveFilter(tab.id)}
                            >
                                {tab.label}
                            </FilterButton>
                        ))}
                    </nav>

                    <div className="mb-4">
                        <p className="text-sm text-slate-500">
                            <span className="font-semibold text-slate-800">
                                {filteredMatches.length}
                            </span>{" "}
                            {filteredMatches.length === 1 ? "match" : "matches"} found
                        </p>
                    </div>

                    {filteredMatches.length > 0 ? (
                        <section className="space-y-4">
                            {filteredMatches.map((match) => (
                                <MatchCard
                                    key={match.id}
                                    match={match}
                                    requestStatus={sentStatusByReceiverId.get(match.id)}
                                    isSending={
                                        sendRequestMutation.isPending &&
                                        sendRequestMutation.variables === match.id
                                    }
                                    onSendRequest={handleSendRequest}
                                    onViewProfile={handleViewProfile}
                                />
                            ))}
                        </section>
                    ) : (
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
                                className="mt-4 inline-flex items-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
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

/* ============================================================
   MATCH CARD COMPONENT
============================================================ */

function MatchCard({ match, requestStatus, isSending, onSendRequest, onViewProfile }) {
    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5">
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[220px_1fr_120px_160px] xl:items-center">
                <div className="flex items-center gap-3.5">
                    <img
                        src={match.avatar}
                        alt={match.name}
                        className="h-14 w-14 shrink-0 rounded-full bg-slate-100 object-cover"
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

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <SkillGroup title="Can teach you" skills={match.canTeach} type="teach" />
                    <SkillGroup title="Wants to learn" skills={match.wantsToLearn} type="learn" />
                </div>

                <MatchScore score={match.match} />

                <div className="flex flex-col gap-2">
                    <button
                        type="button"
                        onClick={() => onViewProfile(match)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                    >
                        View Profile
                    </button>

                    <RequestActionButton
                        status={requestStatus}
                        isSending={isSending}
                        onSendRequest={() => onSendRequest(match.id)}
                    />
                </div>
            </div>
        </article>
    );
}

/* ============================================================
   REQUEST ACTION BUTTON
   Reflects the real state of the exchange request between the
   current user and this match: no request yet, pending,
   accepted, or rejected. Only the "no request yet" and
   "rejected" states are clickable — a pending or accepted
   request should never be re-sent from here.
============================================================ */

function RequestActionButton({ status, isSending, onSendRequest }) {
    if (isSending) {
        return (
            <button
                type="button"
                disabled
                className="inline-flex w-full cursor-not-allowed items-center justify-center gap-1.5 rounded-xl bg-indigo-400 px-3.5 py-2.5 text-xs font-semibold text-white"
            >
                <Loader2 size={14} className="animate-spin" />
                <span>Sending...</span>
            </button>
        );
    }

    if (status === "PENDING") {
        return (
            <button
                type="button"
                disabled
                className="inline-flex w-full cursor-not-allowed items-center justify-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-xs font-semibold text-amber-700"
            >
                <Clock size={14} />
                <span>Request Pending</span>
            </button>
        );
    }

    if (status === "ACCEPTED") {
        return (
            <button
                type="button"
                disabled
                className="inline-flex w-full cursor-not-allowed items-center justify-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-xs font-semibold text-emerald-700"
            >
                <CheckCircle2 size={14} />
                <span>Connected</span>
            </button>
        );
    }

    if (status === "REJECTED") {
        return (
            <button
                type="button"
                onClick={onSendRequest}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                title="Your previous request was declined — you can send another."
            >
                <span>Request Declined — Try Again</span>
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={onSendRequest}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2.5 text-xs font-semibold text-white transition hover:bg-indigo-700"
        >
            <span>Send Request</span>
            <ArrowRight size={14} />
        </button>
    );
}

/* ============================================================
   SKILL GROUP COMPONENT
============================================================ */

function SkillGroup({ title, skills, type }) {
    const isTeach = type === "teach";

    return (
        <div>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {title}
            </p>
            <div className="flex flex-wrap gap-1.5">
                {skills.length > 0 ? (
                    skills.map((skill) => (
                        <span
                            key={skill}
                            className={`rounded-lg border px-2.5 py-1 text-xs font-medium ${
                                isTeach
                                    ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                                    : "border-indigo-100 bg-indigo-50 text-indigo-700"
                            }`}
                        >
                            {skill}
                        </span>
                    ))
                ) : (
                    <span className="text-xs text-slate-400">None added</span>
                )}
            </div>
        </div>
    );
}

/* ============================================================
   MATCH SCORE COMPONENT
============================================================ */

const SCORE_RING_RADIUS = 28;
const SCORE_RING_CIRCUMFERENCE = 2 * Math.PI * SCORE_RING_RADIUS;

function MatchScore({ score }) {
    const progress = SCORE_RING_CIRCUMFERENCE - (score / 100) * SCORE_RING_CIRCUMFERENCE;
    const isHighMatch = score >= HIGH_MATCH_THRESHOLD;

    return (
        <div className="flex items-center xl:justify-center">
            <div className="relative flex h-16 w-16 items-center justify-center">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 64 64">
                    <circle
                        cx="32"
                        cy="32"
                        r={SCORE_RING_RADIUS}
                        fill="none"
                        stroke="#f1f5f9"
                        strokeWidth="5"
                    />
                    <circle
                        cx="32"
                        cy="32"
                        r={SCORE_RING_RADIUS}
                        fill="none"
                        stroke={isHighMatch ? "#10b981" : "#f59e0b"}
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeDasharray={SCORE_RING_CIRCUMFERENCE}
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
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
        >
            {children}
        </button>
    );
}