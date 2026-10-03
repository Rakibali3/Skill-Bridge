
import {
  Activity,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  GraduationCap,
  LoaderCircle,
  RefreshCw,
  Target,
  Users,
  UserRound,
  AlertCircle,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useProfileData } from "../../assets/hooks/useProfileData";
import { useMyExchanges } from "../../assets/hooks/useExchangeData";
import { useMatchingData } from "../../assets/hooks/useMatchingData";
import { useLearningPaths } from "../../assets/hooks/useLearningPathData";
import { useTasksByUser } from "../../assets/hooks/useTaskData";

// Reusable dashboard statistic card
function StatCard({ title, value, description, icon: Icon, loading, error }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <div className="mt-3 flex min-h-9 items-center">
            {loading ? (
              <LoaderCircle className="animate-spin text-indigo-600" size={25} />
            ) : error ? (
              <span className="text-sm font-medium text-red-500">
                Unavailable
              </span>
            ) : (
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                {value}
              </h2>
            )}
          </div>

          <p className="mt-2 text-xs text-slate-500">{description}</p>
        </div>

        <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}

// Reusable loading state
function LoadingState() {
  return (
    <div className="flex items-center justify-center py-10">
      <LoaderCircle className="animate-spin text-indigo-600" size={26} />
      <span className="ml-3 text-sm text-slate-500">Loading data...</span>
    </div>
  );
}

// Reusable empty state
function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
      <div className="mb-3 rounded-full bg-slate-100 p-3 text-slate-500">
        <Icon size={23} />
      </div>
      <h4 className="font-semibold text-slate-800">{title}</h4>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>
    </div>
  );
}

function SectionHeader({ title, description, link, onClick }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>

      {link && (
        <button
          type="button"
          onClick={onClick}
          className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
        >
          {link}
          <ArrowRight size={16} />
        </button>
      )}
    </div>
  );
}

export default function DashBoard() {
  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileError,
    refetch: refetchProfile,
  } = useProfileData();

  const userId = profile?.id;
  

  const {
    data: tasks = [],
    isLoading: tasksLoading,
    isError: tasksError,
    refetch: refetchTasks,
  } = useTasksByUser(userId);



  const {
    data: exchanges = [],
    isLoading: exchangesLoading,
    isError: exchangesError,
    refetch: refetchExchanges,
  } = useMyExchanges();

  const {
    data: matches = [],
    isLoading: matchesLoading,
    isError: matchesError,
    refetch: refetchMatches,
  } = useMatchingData();

  const {
    data: learningPaths = [],
    isLoading: learningPathsLoading,
    isError: learningPathsError,
    refetch: refetchLearningPaths,
  } = useLearningPaths();

  // Support APIs that return either a list directly or an object containing a list.
  const exchangeList = Array.isArray(exchanges)
    ? exchanges
    : exchanges?.content ?? [];

  const matcheData = Array.isArray(matches)
    ? matches
    : matches?.content ?? [];

  const matchList = matcheData.filter((match) => match.matchScore >= 85);

  const learningPathList = Array.isArray(learningPaths)
    ? learningPaths
    : learningPaths?.content ?? [];

  // Active exchanges
  const activeExchanges = exchangeList.filter(
    (exchange) => exchange.status === "ACTIVE"
  ).length;

  // Number of matches returned by the backend.
  // This is the total returned match count, not necessarily newly created matches.
  const newMatches = matchList.length;

  // Average progress across started learning paths only.
  const startedPaths = learningPathList.filter(
    (path) =>
      path.started === true ||
      (path.started == null &&
        path.status != null &&
        path.status !== "NOT_STARTED")
  );

  const learningProgress = startedPaths.length
    ? Math.round(
      startedPaths.reduce(
        (total, path) => total + (Number(path.progress) || 0),
        0
      ) / startedPaths.length
    )
    : 0;

  const tasksInProgress = tasks.filter(
    (task) => task.status === "PENDING" || task.status === "SUBMITTED"
  ).length;

  const stats = [
    {
      title: "Active Exchanges",
      value: activeExchanges,
      description: "Your ongoing skill exchanges",
      icon: Users,
      loading: exchangesLoading,
      error: exchangesError,
    },
    {
      title: "Tasks in Progress",
      value: tasksInProgress,
      description: "Your unfinished assigned tasks",
      icon: CheckCircle2,
      loading: tasksLoading || profileLoading,
      error: tasksError,
    },
    {
      title: "Matches",
      value: newMatches,
      description: "You Have " + newMatches + " recommended matches",
      icon: Target,
      loading: matchesLoading,
      error: matchesError,
    },
    {
      title: "Learning Progress",
      value: `${learningProgress}%`,
      description: "Average progress of started paths",
      icon: GraduationCap,
      loading: learningPathsLoading,
      error: learningPathsError,
    },
  ];

  const firstName =
    profile?.firstName ||
    profile?.user?.firstName ||
    profile?.user?.name?.split(" ")[0] ||
    profile?.name?.split(" ")[0] ||
    "Learner";

  const profileImage =
    profile?.avatarUrl ||
    profile?.profileImageUrl ||
    profile?.user?.avatarUrl ||
    null;

  const profileInitial = firstName.charAt(0).toUpperCase();

  const isRefreshing =
    exchangesLoading ||
    matchesLoading ||
    learningPathsLoading ||
    profileLoading;

  const refreshDashboard = () => {
    refetchProfile();
    refetchExchanges();
    refetchMatches();
    refetchLearningPaths();
    refetchTasks();
  };

  return (
    <DashboardLayout>
      <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-7">
          {/* Welcome section */}
          <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium text-indigo-600">
                YOUR LEARNING SPACE
              </p>

              <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Welcome back, {firstName}! 👋
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Keep learning, share your skills, and make progress toward your
                goals.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-lg font-bold text-indigo-600">
                    {profileInitial}
                  </span>
                )}
              </div> */}

              <button
                type="button"
                onClick={refreshDashboard}
                disabled={isRefreshing}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw
                  size={16}
                  className={isRefreshing ? "animate-spin" : ""}
                />
                Refresh
              </button>
            </div>
          </section>

          {/* Profile loading/error feedback */}
          {profileError && (
            <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              <AlertCircle size={18} />
              Profile information could not be loaded.
            </div>
          )}

          {/* Statistics */}
          <section>
            <div className="mb-4">
              <h2 className="text-lg font-bold text-slate-900">
                Your Overview
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                A snapshot of your SkillBridge activity.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <StatCard key={stat.title} {...stat} />
              ))}
            </div>
          </section>

          {/* Learning progress */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
                  <BookOpen size={25} />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Learning Progress
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Track your progress across started learning paths.
                  </p>
                </div>
              </div>

              <div className="sm:text-right">
                {learningPathsLoading ? (
                  <LoaderCircle
                    className="animate-spin text-indigo-600 sm:ml-auto"
                    size={24}
                  />
                ) : learningPathsError ? (
                  <p className="text-sm text-red-500">Unable to load progress</p>
                ) : (
                  <>
                    <p className="text-3xl font-bold text-slate-900">
                      {learningProgress}%
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Average completion
                    </p>
                  </>
                )}
              </div>
            </div>

            {!learningPathsLoading && !learningPathsError && (
              <div className="mt-5">
                <div
                  className="h-2.5 overflow-hidden rounded-full bg-slate-100"
                  role="progressbar"
                  aria-label="Average learning progress"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={learningProgress}
                >
                  <div
                    className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                    style={{
                      width: `${Math.min(100, Math.max(0, learningProgress))}%`,
                    }}
                  />
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  {startedPaths.length} started{" "}
                  {startedPaths.length === 1
                    ? "learning path"
                    : "learning paths"}
                </p>
              </div>
            )}
          </section>

          {/* Learning paths and matches */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Continue learning */}
            <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <SectionHeader
                title="Continue Learning"
                description="Pick up where you left off."
                link="View all"
                onClick={() =>
                  window.location.assign("/learning-paths")
                }
              />

              <div className="mt-5">
                {learningPathsLoading ? (
                  <LoadingState />
                ) : learningPathsError ? (
                  <EmptyState
                    icon={AlertCircle}
                    title="Couldn't load learning paths"
                    description="Refresh the dashboard to try again."
                  />
                ) : startedPaths.length === 0 ? (
                  <EmptyState
                    icon={BookOpen}
                    title="Ready to start learning?"
                    description="Your started learning paths will appear here."
                  />
                ) : (
                  <div className="space-y-4">
                    {startedPaths.slice(0, 3).map((path) => {
                      const progress = Math.min(
                        100,
                        Math.max(0, Number(path.progress) || 0)
                      );

                      return (
                        <div
                          key={path.id}
                          className="rounded-xl border border-slate-100 p-4 transition hover:border-indigo-100 hover:bg-slate-50/70"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h4 className="wrap-break-word font-semibold text-slate-800">
                                {path.title ||
                                  path.skillName ||
                                  "Learning Path"}
                              </h4>
                              <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                                {path.description ||
                                  path.skillName ||
                                  "Continue developing your skills."}
                              </p>
                            </div>

                            <span className="shrink-0 text-sm font-bold text-indigo-600">
                              {progress}%
                            </span>
                          </div>

                          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-indigo-500 transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>

                          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                            <Clock size={14} />
                            {Number(path.topicCount) || 0} topics
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>

            {/* Recommended matches */}
            <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <SectionHeader
                title="Recommended Matches"
                description="People you may be able to learn from."
                link="View all"
                onClick={() => window.location.assign("/matches")}
              />

              <div className="mt-5">
                {matchesLoading ? (
                  <LoadingState />
                ) : matchesError ? (
                  <EmptyState
                    icon={AlertCircle}
                    title="Couldn't load matches"
                    description="Refresh the dashboard to try again."
                  />
                ) : matchList.length === 0 ? (
                  <EmptyState
                    icon={Users}
                    title="No matches available yet"
                    description="Add your teaching and learning skills to discover potential matches."
                  />
                ) : (
                  <div className="space-y-4">
                    {matchList.slice(0, 4).map((match, index) => {
                      const matchName =
                        match.name ||
                        match.fullName ||
                        match.userName ||
                        match.username ||
                        match.matchedUser?.name ||
                        match.matchedUser?.fullName ||
                        "SkillBridge Member";

                      const matchSkill =
                        match.skillName ||
                        match.skill?.name ||
                        match.matchedSkill ||
                        match.skills?.[0]?.name ||
                        match.skills?.[0] ||
                        "Skill match";

                      const avatar =
                        match.avatarUrl ||
                        match.profileImageUrl ||
                        match.matchedUser?.avatarUrl;

                      return (
                        <div
                          key={match.id ?? match.userId ?? index}
                          className="flex items-center gap-3 rounded-xl border border-slate-100 p-4"
                        >
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-50 text-indigo-600">
                            {avatar ? (
                              <img
                                src={avatar}
                                alt={matchName}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <UserRound size={21} />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <h4 className="truncate font-semibold text-slate-800">
                              {matchName}
                            </h4>
                            <p className="mt-1 truncate text-sm text-slate-500">
                              {matchSkill}
                            </p>
                          </div>

                          {match.matchPercentage != null && (
                            <span className="shrink-0 rounded-lg bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                              {match.matchPercentage}%
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Active exchanges */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <SectionHeader
              title="Active Exchanges"
              description="Keep track of your ongoing skill-sharing sessions."
              link="View exchanges"
              onClick={() => window.location.assign("/exchanges")}
            />

            <div className="mt-5">
              {exchangesLoading ? (
                <LoadingState />
              ) : exchangesError ? (
                <EmptyState
                  icon={AlertCircle}
                  title="Couldn't load exchanges"
                  description="Refresh the dashboard to try again."
                />
              ) : (
                (() => {
                  const activeList = exchangeList.filter(
                    (exchange) => exchange.status === "ACTIVE"
                  );

                  if (activeList.length === 0) {
                    return (
                      <EmptyState
                        icon={Activity}
                        title="No active exchanges"
                        description="Connect with other learners to start sharing skills."
                      />
                    );
                  }

                  return (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {activeList.slice(0, 3).map((exchange) => {
                        const partnerName =
                          exchange.user1Name ||
                          exchange.user2Name ||
                          "Exchange partner";

                        const skills = Array.isArray(exchange.skills)
                          ? exchange.skills
                            .map((skill) =>
                              typeof skill === "string"
                                ? skill
                                : skill?.name
                            )
                            .filter(Boolean)
                            .join(", ")
                          : exchange.skills || "Skill exchange";

                        return (
                          <div
                            key={exchange.id}
                            className="rounded-xl border border-slate-200 p-4"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <h4 className="font-semibold text-slate-800">
                                  {partnerName}
                                </h4>
                                <p className="mt-1 wrap-break-word text-sm text-slate-500">
                                  {skills}
                                </p>
                              </div>

                              <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                                Active
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                window.location.assign(
                                  `/exchanges/${exchange.id}`
                                )
                              }
                              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                            >
                              Open exchange
                              <ArrowRight size={16} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()
              )}
            </div>
          </section>
        </div>
      </main>
    </DashboardLayout>
  );
}