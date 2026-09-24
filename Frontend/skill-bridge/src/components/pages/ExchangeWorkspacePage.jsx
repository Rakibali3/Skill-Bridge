import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    ArrowLeft,
    CheckCircle2,
    ClipboardList,
    Clock,
    Upload,
    FileText,
    User,
} from "lucide-react";

import { useExchange } from "../../assets/hooks/useExchangeData";
import { useProfileData } from "../../assets/hooks/useProfileData";
import {
    useExchangeTasks,
    useCompleteTask,
} from "../../assets/hooks/useTaskData";

import CreateTaskModal from "../exchange/CreateTaskModal";
import SubmitTaskModal from "../exchange/SubmitTaskModal";

function StatusBadge({ status }) {
    const config = {
        ACTIVE:
            "bg-emerald-50 text-emerald-700 border-emerald-200",
        PAUSED:
            "bg-amber-50 text-amber-700 border-amber-200",
        COMPLETED:
            "bg-blue-50 text-blue-700 border-blue-200",
        CANCELLED:
            "bg-red-50 text-red-700 border-red-200",
    };

    return (
        <span
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${config[status] ||
                "bg-slate-50 text-slate-600 border-slate-200"
                }`}
        >
            <span className="h-2 w-2 rounded-full bg-current" />
            {status}
        </span>
    );
}

function TaskStatusBadge({ status }) {
    const config = {
        PENDING:
            "bg-amber-50 text-amber-700",
        SUBMITTED:
            "bg-blue-50 text-blue-700",
        COMPLETED:
            "bg-emerald-50 text-emerald-700",
    };

    return (
        <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${config[status] ||
                "bg-slate-100 text-slate-600"
                }`}
        >
            {status}
        </span>
    );
}

export default function ExchangeWorkspacePage() {
    const { exchangeId } = useParams();
    const navigate = useNavigate();

    const [showCreateTask, setShowCreateTask] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    /*
     * Exchange
     */
    const {
        data: exchange,
        isLoading: exchangeLoading,
        error: exchangeError,
    } = useExchange(exchangeId);

    /*
     * Current user
     */
    const {
        data: currentUser,
        isLoading: userLoading,
    } = useProfileData();

    /*
     * Tasks
     */
    const {
        data: tasks = [],
        isLoading: tasksLoading,
    } = useExchangeTasks(exchangeId);

    /*
     * Complete task mutation
     */
    const completeTask = useCompleteTask();

    /*
     * Find partner
     */
    const partner = useMemo(() => {
        if (!exchange || !currentUser) {
            return null;
        }

        if (
            Number(exchange.user1Id) ===
            Number(currentUser.id)
        ) {
            return {
                id: exchange.user2Id,
                userName: exchange.user2Name,
            };
        }

        return {
            id: exchange.user1Id,
            userName: exchange.user1Name,
        };
    }, [exchange, currentUser]);

    /*
     * My skills
     */
    const mySkills = useMemo(() => {
        if (!exchange || !currentUser) {
            return [];
        }

        return (
            exchange.skills?.filter(
                (skill) =>
                    Number(skill.userId) ===
                    Number(currentUser.id)
            ) || []
        );
    }, [exchange, currentUser]);

    /*
     * Partner skills
     */
    const partnerSkills = useMemo(() => {
        if (!exchange || !partner) {
            return [];
        }

        return (
            exchange.skills?.filter(
                (skill) =>
                    Number(skill.userId) ===
                    Number(partner.id)
            ) || []
        );
    }, [exchange, partner]);

    const myTeachingSkills = mySkills.filter(
        (skill) => skill.direction === "TEACH"
    );

    const myLearningSkills = mySkills.filter(
        (skill) => skill.direction === "LEARN"
    );

    const partnerTeachingSkills = partnerSkills.filter(
        (skill) => skill.direction === "TEACH"
    );

    const partnerLearningSkills = partnerSkills.filter(
        (skill) => skill.direction === "LEARN"
    );

    /*
     * Loading
     */
    const loading =
        exchangeLoading ||
        userLoading ||
        tasksLoading;

    /*
     * Create task
     */
    const handleCreateTask = () => {
        setShowCreateTask(true);
    };

    /*
     * Submit task
     */
    const handleSubmitTask = (task) => {
        setSelectedTask(task);
    };

    /*
     * Complete task
     */
    const handleCompleteTask = (taskId) => {
        completeTask.mutate(taskId);
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="text-sm text-slate-500">
                    Loading exchange...
                </div>
            </div>
        );
    }

    if (
        exchangeError ||
        !exchange ||
        !currentUser
    ) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
                <div className="text-center">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Exchange not found
                    </h2>

                    <button
                        onClick={() => navigate(-1)}
                        className="mt-4 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const canCreateTask = exchange.status === "ACTIVE";

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
                {/* Back */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </button>

                {/* Exchange Header */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100">
                                <User className="h-7 w-7 text-indigo-600" />
                            </div>

                            <div>
                                <p className="text-sm text-slate-500">
                                    Skill Exchange
                                </p>
                                <h1 className="text-2xl font-bold text-slate-900">
                                    You & {partner?.userName}
                                </h1>
                                <p className="mt-1 text-xs text-slate-400">
                                    Started{" "}
                                    {new Date(
                                        exchange.createdAt
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        <StatusBadge status={exchange.status} />
                    </div>
                </div>

                {/* Skills */}
                <div className="mt-6 grid gap-6 lg:grid-cols-2">
                    {/* My skills */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Your Skills
                        </h2>

                        <div className="mt-5 space-y-5">
                            <SkillGroup
                                title="Teaching"
                                skills={myTeachingSkills}
                                type="teach"
                            />

                            <SkillGroup
                                title="Learning"
                                skills={myLearningSkills}
                                type="learn"
                            />
                        </div>
                    </div>

                    {/* Partner skills */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-slate-900">
                            {partner?.userName}'s Skills
                        </h2>

                        <div className="mt-5 space-y-5">
                            <SkillGroup
                                title="Teaching"
                                skills={partnerTeachingSkills}
                                type="teach"
                            />

                            <SkillGroup
                                title="Learning"
                                skills={partnerLearningSkills}
                                type="learn"
                            />
                        </div>
                    </div>
                </div>

                {/* Tasks */}
                <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
                    {/* Task Header */}
                    <div className="flex flex-col gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <ClipboardList className="h-5 w-5 text-indigo-600" />
                                <h2 className="text-lg font-semibold text-slate-900">
                                    Tasks
                                </h2>
                            </div>

                            <p className="mt-1 text-sm text-slate-500">
                                Create and complete simple learning tasks.
                            </p>
                        </div>

                        <button
                            type="button"
                            disabled={!canCreateTask}
                            onClick={handleCreateTask}
                            className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            + Create Task
                        </button>
                    </div>

                    {/* Task List */}
                    <div className="p-6">
                        {tasks.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center">
                                <ClipboardList className="mx-auto h-10 w-10 text-slate-300" />
                                <h3 className="mt-3 font-semibold text-slate-800">
                                    No tasks yet
                                </h3>
                                <p className="mt-1 text-sm text-slate-500">
                                    Create the first task for this exchange.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {tasks.map((task) => (
                                    <TaskCard
                                        key={task.id}
                                        task={task}
                                        currentUserId={
                                            currentUser.id
                                        }
                                        onSubmit={
                                            handleSubmitTask
                                        }
                                        onComplete={
                                            handleCompleteTask
                                        }
                                        completing={
                                            completeTask.isPending
                                        }
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Create Task Modal */}
            {partner && (
                <CreateTaskModal
                    isOpen={showCreateTask}
                    onClose={() =>
                        setShowCreateTask(false)
                    }
                    exchangeId={exchangeId}
                    partner={partner}
                />
            )}

            {/* Submit Task Modal */}
            {selectedTask && (
                <SubmitTaskModal
                    isOpen={Boolean(selectedTask)}
                    task={selectedTask}
                    onClose={() =>
                        setSelectedTask(null)
                    }
                />
            )}
        </div>
    );
}

/*
 * Skill Group
 */
function SkillGroup({
    title,
    skills,
    type,
}) {
    return (
        <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                {title}
            </p>

            {skills.length === 0 ? (
                <p className="text-sm text-slate-400">
                    No skill selected
                </p>
            ) : (
                <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                        <span
                            key={`${skill.userId}-${skill.skillId}-${skill.direction}`}
                            className={`rounded-lg px-3 py-2 text-sm font-medium ${type === "teach"
                                ? "bg-indigo-50 text-indigo-700"
                                : "bg-emerald-50 text-emerald-700"
                                }`}
                        >
                            {skill.skillName}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

/*
 * Task Card
 */
function TaskCard({
    task,
    currentUserId,
    onSubmit,
    onComplete,
    completing,
}) {
    const isAssignedToMe =
        Number(task.assignedToId) ===
        Number(currentUserId);

    const isCreatedByMe =
        Number(task.createdById) ===
        Number(currentUserId);

    return (
        <div className="rounded-2xl border border-slate-200 p-5">
            {/* Top */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h3 className="font-semibold text-slate-900">
                        {task.title}
                    </h3>

                    {task.description && (
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            {task.description}
                        </p>
                    )}
                </div>

                <TaskStatusBadge status={task.status} />
            </div>

            {/* Information */}
            <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" />
                    Assigned to:{" "}
                    {isAssignedToMe
                        ? "You"
                        : task.assignedToName}
                </span>

                <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {new Date(
                        task.createdAt
                    ).toLocaleDateString()}
                </span>
            </div>

            {/* Submission */}
            {(task.status === "SUBMITTED" ||
                task.status === "COMPLETED") && (
                    <div className="mt-4 rounded-xl bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Submission
                        </p>

                        <div className="mt-3 flex flex-wrap gap-3">
                            {task.githubUrl && (
                                <a
                                    href={task.githubUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-4 w-4"
                                        aria-hidden="true"
                                    >
                                        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                                        <path d="M9 18c-4.51 2-5-2-7-2" />
                                    </svg>
                                    GitHub
                                </a>
                            )}

                            {task.submittedFileUrl && (
                                <a
                                    href={task.submittedFileUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex max-w-full items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                                    title={task.submittedFileName || "Submitted File"}
                                >
                                    <FileText className="h-4 w-4 shrink-0 text-indigo-500" />

                                    <span className="max-w-[220px] truncate">
                                        {task.submittedFileName || "Submitted File"}
                                    </span>
                                </a>
                            )}
                        </div>
                    </div>
                )}

            {/* Submit */}
            {isAssignedToMe &&
                task.status === "PENDING" && (
                    <div className="mt-4">
                        <button
                            type="button"
                            onClick={() =>
                                onSubmit(task)
                            }
                            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                        >
                            <Upload className="h-4 w-4" />
                            Submit Task
                        </button>
                    </div>
                )}

            {/* Complete */}
            {isCreatedByMe &&
                task.status === "SUBMITTED" && (
                    <div className="mt-4">
                        <button
                            type="button"
                            onClick={() =>
                                onComplete(task.id)
                            }
                            disabled={completing}
                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <CheckCircle2 className="h-4 w-4" />
                            {completing
                                ? "Completing..."
                                : "Mark Completed"}
                        </button>
                    </div>
                )}
        </div>
    );
}