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
import { useLearningPaths, useStartLearningPath, } from "../../assets/hooks/useLearningPathData";
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
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="flex items-center gap-3 text-slate-500">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Loading learning paths...</span>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center px-4">
                <div className="text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
                        <Route className="h-7 w-7 text-red-500" />
                    </div>

                    <h2 className="text-lg font-semibold text-slate-900">
                        Unable to load learning paths
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Please try again later.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <DashboardLayout>
            <div className="mx-auto w-full max-w-7xl space-y-8">

                {/* Header */}
                <section>
                    <div className="flex items-start gap-4">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50">
                            <Route className="h-6 w-6 text-indigo-600" />
                        </div>

                        <div>
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-indigo-500" />

                                <span className="text-sm font-medium text-indigo-600">
                                    Learning Journey
                                </span>
                            </div>

                            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                Learning Paths
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                                Follow a structured learning journey and build
                                your skills one step at a time.
                            </p>
                        </div>

                    </div>
                </section>

                {/* Empty state */}
                {learningPaths.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                            <BookOpen className="h-8 w-8 text-slate-400" />
                        </div>

                        <h2 className="mt-5 text-lg font-semibold text-slate-900">
                            No learning paths available
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                            New learning journeys will appear here when they
                            become available.
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

    const isCompleted =
        path.status === "COMPLETED";

    const isInProgress =
        path.status === "IN_PROGRESS";

    return (

        <article
            className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/40"
            onClick={onClick}
        >

            {/* Top section */}
            <div className="relative overflow-hidden bg-linear-to-br from-indigo-50 via-white to-violet-50 p-6">

                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-indigo-100/50" />

                <div className="relative flex items-start justify-between gap-4">

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-indigo-100">
                        <BookOpen className="h-6 w-6 text-indigo-600" />
                    </div>

                    {isCompleted ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Completed
                        </span>
                    ) : isInProgress ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
                            <Play className="h-3.5 w-3.5" />
                            In Progress
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                            <Clock3 className="h-3.5 w-3.5" />
                            Not Started
                        </span>
                    )}

                </div>

                <div className="relative mt-6">

                    <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                        {path.skillName}
                    </p>

                    <h2 className="mt-2 text-xl font-bold leading-snug text-slate-900">
                        {path.title}
                    </h2>

                </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-6">

                <p className="line-clamp-3 text-sm leading-6 text-slate-500">
                    {path.description ||
                        "Follow this structured learning path to improve your skills step by step."}
                </p>

                {/* Meta */}
                <div className="mt-5 flex items-center gap-4 text-xs font-medium text-slate-500">

                    <div className="flex items-center gap-1.5">
                        <BookOpen className="h-4 w-4" />
                        {path.topicCount} topics
                    </div>

                    {path.started && (
                        <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="h-4 w-4" />
                            {path.progress}% complete
                        </div>
                    )}

                </div>

                {/* Progress */}
                {path.started && (
                    <div className="mt-5">

                        <div className="mb-2 flex items-center justify-between text-xs">
                            <span className="font-medium text-slate-500">
                                Your progress
                            </span>

                            <span className="font-semibold text-slate-700">
                                {path.progress}%
                            </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                            <div
                                className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                                style={{
                                    width: `${Math.min(
                                        Math.max(path.progress, 0),
                                        100
                                    )}%`,
                                }}
                            />
                        </div>

                    </div>
                )}

                {/* Button */}
                <button
                    type="button"
                    onClick={(event) => {
                        event.stopPropagation();
                        onClick();
                    }}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600"
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