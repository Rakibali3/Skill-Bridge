import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Loader2,
  Play,
  Route,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  useLearningPaths,
  useStartLearningPath,
} from "../../assets/hooks/useLearningPathData";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

export default function LearningPathsPage() {
  const navigate = useNavigate();

  const {
    data: learningPaths = [],
    isLoading,
    isError,
  } = useLearningPaths();

  const startLearningPath = useStartLearningPath();

  const handleLearningPathClick = async (path) => {
    try {
      if (!path.started) {
        await startLearningPath.mutateAsync(path.id);
      }

      navigate(`/learning-paths/${path.id}`);
    } catch (error) {
      console.error("Failed to start learning path:", error);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading learning paths...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center px-4">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/40">
              <Route className="h-7 w-7 text-red-500 dark:text-red-400" />
            </div>

            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Unable to load learning paths
            </h2>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Please try again later.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-7xl space-y-8">
        {/* Header */}
        <section>
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/50">
              <Route className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />

                <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                  Learning Journey
                </span>
              </div>

              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                Learning Paths
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
                Follow a structured learning journey and build your skills one
                step at a time.
              </p>
            </div>
          </div>
        </section>

        {/* Empty state */}
        {learningPaths.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
              <BookOpen className="h-8 w-8 text-slate-400 dark:text-slate-300" />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-slate-900 dark:text-slate-100">
              No learning paths available
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
              New learning journeys will appear here when they become
              available.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {learningPaths.map((path) => (
              <LearningPathCard
                key={path.id}
                path={path}
                onClick={() => handleLearningPathClick(path)}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function LearningPathCard({ path, onClick }) {
  const isCompleted = path.status === "COMPLETED";
  const isInProgress = path.status === "IN_PROGRESS";

  const progress = Math.min(Math.max(Number(path.progress) || 0, 0), 100);

  return (
    <article
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white transition duration-200 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-100/40 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-500 dark:hover:shadow-indigo-950/40"
      onClick={onClick}
    >
      {/* Top section */}
      <div className="relative overflow-hidden bg-linear-to-br from-indigo-50 via-white to-violet-50 p-6 dark:from-slate-800 dark:via-slate-900 dark:to-indigo-950">
        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-indigo-100/50 dark:bg-indigo-500/10" />

        <div className="relative flex items-start justify-between gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-indigo-100 dark:bg-slate-800 dark:ring-slate-700">
            <BookOpen className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>

          {isCompleted ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Completed
            </span>
          ) : isInProgress ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
              <Play className="h-3.5 w-3.5" />
              In Progress
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <Clock3 className="h-3.5 w-3.5" />
              Not Started
            </span>
          )}
        </div>

        <div className="relative mt-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            {path.skillName}
          </p>

          <h2 className="mt-2 text-xl font-bold leading-snug text-slate-900 dark:text-white">
            {path.title}
          </h2>
        </div>
      </div>

      {/* Card content */}
      <div className="flex flex-1 flex-col p-6">
        <p className="line-clamp-3 text-sm leading-6 text-slate-500 dark:text-slate-300">
          {path.description ||
            "Follow this structured learning path to improve your skills step by step."}
        </p>

        {/* Metadata */}
        <div className="mt-5 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <BookOpen className="h-4 w-4" />
            <span>{path.topicCount} topics</span>
          </div>

          {path.started && (
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              <span>{progress}% complete</span>
            </div>
          )}
        </div>

        {/* Progress */}
        {path.started && (
          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-medium text-slate-500 dark:text-slate-400">
                Your progress
              </span>

              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {progress}%
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
              <div
                className="h-full rounded-full bg-indigo-600 transition-all duration-500 dark:bg-indigo-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Action button */}
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onClick();
          }}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:bg-indigo-600 dark:hover:bg-indigo-500 dark:focus-visible:ring-offset-slate-900"
        >
          {isCompleted
            ? "Review Journey"
            : isInProgress
              ? "Continue Learning"
              : "Start Learning"}

          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </article>
  );
}
