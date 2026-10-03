import { useMemo } from "react";
import {
    ArrowLeft,
    BookOpen,
    CheckCircle2,
    Circle,
    Clock3,
    ExternalLink,
    Loader2,
    Play,
    Trophy,
    Lock,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

import {
    useMyLearningPath,
    useStartLearningPath,
    useStartLearningTopic,
    useCompleteLearningTopic,
} from "../../assets/hooks/useLearningPathData";
import DashboardLayout from "../dashboard/DashboardLayout";

function getStepVisuals(topic) {
    const completed = topic.status === "COMPLETED";
    const inProgress = topic.status === "IN_PROGRESS";
    const inactive = topic.active === false;

    if (completed) {
        return {
            completed,
            inProgress,
            inactive,
            icon: CheckCircle2,
            circleClass: "bg-emerald-500 text-white",
            cardClass: "border-emerald-100 bg-white",
            badge: { label: "Completed", className: "bg-emerald-50 text-emerald-600" },
        };
    }

    if (inProgress) {
        return {
            completed,
            inProgress,
            inactive,
            icon: Play,
            circleClass: "bg-indigo-600 text-white ring-4 ring-indigo-100",
            cardClass: "border-indigo-200 bg-white shadow-md",
            badge: { label: "In Progress", className: "bg-indigo-50 text-indigo-600" },
        };
    }

    if (inactive) {
        return {
            completed,
            inProgress,
            inactive,
            icon: Lock,
            circleClass: "bg-slate-300 text-slate-500",
            cardClass: "border-slate-200 bg-slate-100",
            badge: { label: "Currently Unavailable", className: "bg-slate-200 text-slate-500" },
        };
    }

    return {
        completed,
        inProgress,
        inactive,
        icon: Circle,
        circleClass: "bg-white text-slate-400 border-2 border-slate-200",
        cardClass: "border-slate-200 bg-white",
        badge: null,
    };
}


function TopicCard({
    topic,
    index,
    visuals,
    align,
    onStart,
    onComplete,
    isBusy,
}) {
    const { completed, inactive, cardClass, badge } = visuals;

    return (
        <div
            className={`min-w-0 rounded-2xl border p-5 shadow-sm ${cardClass} ${align === "right" ? "sm:text-right" : ""
                }`}
        >
            <div
                className={`flex flex-col gap-4 ${align === "right"
                        ? "sm:items-end"
                        : "sm:items-start"
                    }`}
            >
                <div className="min-w-0 w-full">
                    <div
                        className={`flex flex-wrap items-center gap-2 ${align === "right" ? "sm:justify-end" : ""
                            }`}
                    >
                        <span className="text-xs font-semibold text-slate-400">
                            STEP {String(index + 1).padStart(2, "0")}
                        </span>

                        {badge && (
                            <span
                                className={`rounded-full px-2 py-1 text-[11px] font-semibold ${badge.className}`}
                            >
                                {badge.label}
                            </span>
                        )}
                    </div>

                    <h3 className="mt-2 font-semibold text-slate-900">{topic.title}</h3>

                    {topic.description && (
                        <p className="mt-1 text-sm leading-6 text-slate-500">
                            {topic.description}
                        </p>
                    )}

                    {topic.resourceUrl && !inactive && (
                        <a
                            href={topic.resourceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className={`mt-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline ${align === "right" ? "sm:flex-row-reverse" : ""
                                }`}
                        >
                            Open Learning Resource
                            <ExternalLink size={13} />
                        </a>
                    )}
                    {topic.resourceUrl && inactive && (
                        <div
                            className={`mt-3 inline-flex items-center gap-1 text-sm font-semibold text-red-600 ${align === "right" ? "sm:flex-row-reverse" : ""
                                }`}
                        >
                            Topic is unavailable right now
                        </div>
                    )}
                </div>

                {!inactive && (
                    <div className="shrink-0">
                        {topic.status === "NOT_STARTED" && (
                            <button
                                type="button"
                                onClick={() => onStart(topic)}
                                disabled={isBusy}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <Play size={16} />
                                Start
                            </button>
                        )}

                        {topic.status === "IN_PROGRESS" && (
                            <button
                                type="button"
                                onClick={() => onComplete(topic)}
                                disabled={isBusy}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <CheckCircle2 size={16} />
                                Complete
                            </button>
                        )}

                        {completed && (
                            <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-600">
                                <CheckCircle2 size={16} />
                                Done
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}


export default function LearningJourneyPage() {
    const { pathId } = useParams();
    const navigate = useNavigate();

    const { data: learningPath, isLoading, isError } = useMyLearningPath(pathId);

    const startPath = useStartLearningPath();
    const startTopic = useStartLearningTopic();
    const completeTopic = useCompleteLearningTopic();

    const currentTopic = useMemo(() => {
        if (!learningPath?.topics) return null;
        return learningPath.topics.find((topic) => topic.status === "IN_PROGRESS");
    }, [learningPath]);

    const handleStartPath = async () => {
        try {
            await startPath.mutateAsync(Number(pathId));
        } catch (error) {
            console.error("Failed to start learning path:", error);
        }
    };

    const handleStartTopic = async (topic) => {
        try {
            await startTopic.mutateAsync({ pathId: Number(pathId), topicId: topic.topicId });
        } catch (error) {
            console.error("Failed to start topic:", error);
        }
    };

    const handleCompleteTopic = async (topic) => {
        try {
            await completeTopic.mutateAsync({ pathId: Number(pathId), topicId: topic.topicId });
        } catch (error) {
            console.error("Failed to complete topic:", error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 size={32} className="animate-spin text-indigo-600" />
                    <p className="text-sm text-slate-500">Loading your learning journey...</p>
                </div>
            </div>
        );
    }

    if (isError || !learningPath) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
                <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-6 text-center shadow-sm">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
                        <BookOpen size={22} />
                    </div>

                    <h2 className="mt-4 text-lg font-semibold text-slate-900">
                        Learning path unavailable
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        We couldn't load this learning path.
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="mt-5 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const topics = learningPath.topics || [];
    const completedCount = topics.filter((topic) => topic.status === "COMPLETED").length;
    const totalTopics = topics.length;
    const isCompleted = learningPath.status === "COMPLETED";
    const isStarted = learningPath.status !== "NOT_STARTED";
    const isBusy = startTopic.isPending || completeTopic.isPending;

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-slate-50">

                <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 text-lg font-medium text-slate-500 hover:text-indigo-600 cursor-pointer"
                    >
                        <ArrowLeft size={17} />
                        Back
                    </button>
                </div>

                <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* ---------------- Hero ---------------- */}
                    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex gap-4">
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                                    <BookOpen size={27} />
                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-indigo-600">
                                        {learningPath.skillName}
                                    </p>

                                    <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                                        {learningPath.title}
                                    </h1>

                                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                                        {learningPath.description ||
                                            "Follow this roadmap to build your skills step by step."}
                                    </p>
                                </div>
                            </div>

                            {!isStarted && !isCompleted && (
                                <button
                                    type="button"
                                    onClick={handleStartPath}
                                    disabled={startPath.isPending}
                                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {startPath.isPending ? (
                                        <Loader2 size={18} className="animate-spin" />
                                    ) : (
                                        <Play size={18} />
                                    )}
                                    Start Learning
                                </button>
                            )}

                            {isCompleted && (
                                <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-600">
                                    <Trophy size={18} />
                                    Completed
                                </div>
                            )}
                        </div>

                        <div className="mt-8 border-t border-slate-100 pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-slate-700">
                                        Your Progress
                                    </p>
                                    <p className="mt-1 text-xs text-slate-400">
                                        {completedCount} of {totalTopics} topics completed
                                    </p>
                                </div>

                                <span className="text-xl font-bold text-indigo-600">
                                    {learningPath.progress || 0}%
                                </span>
                            </div>

                            <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">
                                <div
                                    className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                                    style={{ width: `${learningPath.progress || 0}%` }}
                                />
                            </div>
                        </div>
                    </section>

                    {/* ---------------- Current topic ---------------- */}
                    {currentTopic && (
                        <section className="mt-8 rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                                        <Clock3 size={19} />
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
                                            Continue Learning
                                        </p>
                                        <h2 className="mt-1 font-semibold text-slate-900">
                                            {currentTopic.title}
                                        </h2>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        document
                                            .getElementById(`topic-${currentTopic.topicId}`)
                                            ?.scrollIntoView({ behavior: "smooth", block: "center" })
                                    }
                                    className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                                >
                                    Continue
                                </button>
                            </div>
                        </section>
                    )}

                    {/* ---------------- Journey (zigzag roadmap) ---------------- */}
                    <section className="mt-10">
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-slate-900">Learning Journey</h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Complete each step to move forward.
                            </p>
                        </div>

                        <div className="relative">
                            <div className="flex flex-col gap-8 sm:gap-10">
                                {topics.map((topic, index) => {
                                    const visuals = getStepVisuals(topic);
                                    const Icon = visuals.icon;
                                    const isLeft = index % 2 === 0;

                                    // Per-step line segments
                                    const isFirst = index === 0;
                                    const isLast = index === topics.length - 1;
                                    const nextTopic = topics[index + 1];

                                    // Segment above this circle is coloured if this step is completed.
                                    // Segment below this circle is coloured if the next step is completed.
                                    const upperDone = topic.status === "COMPLETED";
                                    const lowerDone = nextTopic?.status === "COMPLETED";

                                    const circle = (
                                        <div
                                            className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 border-slate-50 shadow-sm ${visuals.circleClass}`}
                                        >
                                            <Icon size={19} fill={visuals.inProgress ? "currentColor" : "none"} />
                                        </div>
                                    );

                                    const card = (
                                        <TopicCard
                                            topic={topic}
                                            index={index}
                                            visuals={visuals}
                                            align={isLeft ? "right" : "left"}
                                            onStart={handleStartTopic}
                                            onComplete={handleCompleteTopic}
                                            isBusy={isBusy}
                                        />
                                    );

                                    return (
                                        <div
                                            key={topic.topicId}
                                            id={`topic-${topic.topicId}`}
                                            className="relative flex items-start gap-4 sm:items-center sm:gap-0"
                                        >
                                            {/* Line segment: previous circle down to this circle */}
                                            {!isFirst && (
                                                <div
                                                    className={`absolute left-6 top-0 h-6 w-0.5 -translate-x-1/2 sm:left-1/2 sm:h-1/2 ${upperDone ? "bg-indigo-500" : "bg-slate-200"
                                                        }`}
                                                />
                                            )}

                                            {/* Line segment: this circle down to the next circle */}
                                            {!isLast && (
                                                <div
                                                    className={`absolute left-6 top-6 -bottom-8 w-0.5 -translate-x-1/2 sm:left-1/2 sm:top-1/2 sm:-bottom-10 ${lowerDone ? "bg-indigo-500" : "bg-slate-200"
                                                        }`}
                                                />
                                            )}

                                            {/* ---- Mobile layout: icon + card in a row ---- */}
                                            <div className="shrink-0 sm:hidden">{circle}</div>
                                            <div className="min-w-0 flex-1 sm:hidden">{card}</div>

                                            {/* ---- Desktop layout: alternating zigzag ---- */}
                                            <div className="hidden sm:flex sm:w-[calc(50%-28px)] sm:justify-end">
                                                {isLeft && card}
                                            </div>

                                            <div className="relative hidden shrink-0 sm:flex sm:w-14 sm:justify-center">
                                                {circle}
                                            </div>

                                            <div className="hidden sm:flex sm:w-[calc(50%-28px)]">
                                                {!isLeft && card}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </DashboardLayout>
    );
}