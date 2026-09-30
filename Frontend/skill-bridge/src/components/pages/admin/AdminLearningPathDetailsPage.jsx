import { useState } from "react";
import {
    ArrowLeft,
    CheckCircle2,
    Edit3,
    GripVertical,
    Loader2,
    Plus,
    Route,
    X,
    XCircle,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

import AdminLayout from "../../admin/AdminLayout";

import {
    useAdminLearningPath,
    useAdminLearningPathTopics,
    useCreateAdminLearningPathTopic,
    useUpdateAdminLearningPathTopic,
    useDeactivateAdminLearningPathTopic,
    useActivateAdminLearningPathTopic,
} from "../../../assets/hooks/admin/useAdminLearningPathData";

export default function AdminLearningPathDetailsPage() {
    const { pathId } = useParams();
    const navigate = useNavigate();

    // ============================================================
    // Modal State
    // ============================================================

    const [showTopicModal, setShowTopicModal] = useState(false);
    const [editingTopic, setEditingTopic] = useState(null);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [resourceUrl, setResourceUrl] = useState("");

    // ============================================================
    // Learning Path
    // ============================================================

    const {
        data: learningPath,
        isLoading: pathLoading,
        isError: pathError,
    } = useAdminLearningPath(pathId);

    // ============================================================
    // Topics
    // ============================================================

    /*
     * IMPORTANT:
     *
     * This admin query should return BOTH active and inactive topics.
     *
     * Backend repository:
     *
     * findByLearningPathIdOrderByOrderIndexAsc(pathId)
     *
     * Learner-facing API can still use:
     *
     * findByLearningPathIdAndActiveTrueOrderByOrderIndexAsc(pathId)
     */

    const {
        data: topics = [],
        isLoading: topicsLoading,
        isError: topicsError,
    } = useAdminLearningPathTopics(pathId);

    // ============================================================
    // Mutations
    // ============================================================

    const createTopic =
        useCreateAdminLearningPathTopic();

    const updateTopic =
        useUpdateAdminLearningPathTopic();

    const deactivateTopic =
        useDeactivateAdminLearningPathTopic();

    const activateTopic =
        useActivateAdminLearningPathTopic();

    // ============================================================
    // Open Add Topic
    // ============================================================

    const handleAddTopic = () => {
        setEditingTopic(null);

        setTitle("");
        setDescription("");
        setResourceUrl("");

        setShowTopicModal(true);
    };

    // ============================================================
    // Open Edit Topic
    // ============================================================

    const handleEditTopic = (topic) => {
        setEditingTopic(topic);

        setTitle(topic.title || "");
        setDescription(topic.description || "");
        setResourceUrl(topic.resourceUrl || "");

        setShowTopicModal(true);
    };

    // ============================================================
    // Close Modal
    // ============================================================

    const handleCloseModal = () => {
        setShowTopicModal(false);

        setEditingTopic(null);

        setTitle("");
        setDescription("");
        setResourceUrl("");
    };

    // ============================================================
    // Submit Topic
    // ============================================================

    const handleSubmitTopic = async (event) => {
        event.preventDefault();

        const trimmedTitle = title.trim();
        const trimmedDescription = description.trim();
        const trimmedResourceUrl = resourceUrl.trim();

        if (!trimmedTitle) {
            return;
        }

        try {
            // ----------------------------------------------------
            // UPDATE EXISTING TOPIC
            // ----------------------------------------------------

            if (editingTopic) {
                await updateTopic.mutateAsync({
                    pathId,
                    topicId: editingTopic.id,

                    topicData: {
                        title: trimmedTitle,
                        description: trimmedDescription,
                        orderIndex: editingTopic.orderIndex,
                        resourceUrl: trimmedResourceUrl,
                    },
                });
            }

            // ----------------------------------------------------
            // CREATE NEW TOPIC
            // ----------------------------------------------------

            else {
                /*
                 * IMPORTANT:
                 *
                 * We calculate the next order using ALL topics,
                 * including inactive topics.
                 *
                 * Example:
                 *
                 * Topic 1 -> 1 -> active
                 * Topic 2 -> 2 -> inactive
                 * Topic 3 -> 3 -> active
                 *
                 * New topic gets:
                 *
                 * orderIndex = 4
                 *
                 * This avoids duplicate order indexes.
                 */

                const validOrderIndexes = topics
                    .map((topic) => Number(topic.orderIndex))
                    .filter((order) => Number.isFinite(order));

                const nextOrder =
                    validOrderIndexes.length > 0
                        ? Math.max(...validOrderIndexes) + 1
                        : 1;

                await createTopic.mutateAsync({
                    pathId,

                    topicData: {
                        title: trimmedTitle,
                        description: trimmedDescription,
                        orderIndex: nextOrder,
                        resourceUrl: trimmedResourceUrl,
                    },
                });
            }

            handleCloseModal();
        } catch (error) {
            console.error(
                "Topic operation failed:",
                error
            );
        }
    };

    // ============================================================
    // Deactivate Topic
    // ============================================================

    const handleDeactivateTopic = async (topic) => {
        const confirmed = window.confirm(
            `Deactivate "${topic.title}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            await deactivateTopic.mutateAsync({
                pathId,
                topicId: topic.id,
            });
        } catch (error) {
            console.error(
                "Failed to deactivate topic:",
                error
            );
        }
    };

    // ============================================================
    // Activate Topic
    // ============================================================

    const handleActivateTopic = async (topic) => {
        const confirmed = window.confirm(
            `Activate "${topic.title}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            await activateTopic.mutateAsync({
                pathId,
                topicId: topic.id,
            });
        } catch (error) {
            console.error(
                "Failed to activate topic:",
                error
            );
        }
    };

    // ============================================================
    // Loading
    // ============================================================

    if (pathLoading || topicsLoading) {
        return (
            <AdminLayout>
                <div className="flex min-h-[60vh] items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2
                            size={30}
                            className="animate-spin text-indigo-600"
                        />

                        <p className="text-sm text-slate-500">
                            Loading learning path...
                        </p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    // ============================================================
    // Error
    // ============================================================

    if (
        pathError ||
        topicsError ||
        !learningPath
    ) {
        return (
            <AdminLayout>
                <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                    <h2 className="font-semibold text-red-700">
                        Unable to load learning path
                    </h2>

                    <p className="mt-2 text-sm text-red-600">
                        The learning path could not be found.
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/admin/learning-paths"
                            )
                        }
                        className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                    >
                        Back to Learning Paths
                    </button>
                </div>
            </AdminLayout>
        );
    }

    // ============================================================
    // Mutation Loading States
    // ============================================================

    const isActivating =
        activateTopic.isPending;

    const isDeactivating =
        deactivateTopic.isPending;

    return (
        <AdminLayout>
            <div className="mx-auto max-w-5xl">

                {/* ==================================================
                    Back
                ================================================== */}

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/admin/learning-paths"
                        )
                    }
                    className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
                >
                    <ArrowLeft size={17} />

                    Back to Learning Paths
                </button>

                {/* ==================================================
                    Learning Path Header
                ================================================== */}

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

                        <div className="flex gap-4">

                            {/* Icon */}

                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                                <Route size={26} />
                            </div>

                            {/* Path Information */}

                            <div className="min-w-0">

                                <div className="flex flex-wrap items-center gap-2">

                                    <h1 className="text-2xl font-bold text-slate-900">
                                        {learningPath.title}
                                    </h1>

                                    {learningPath.active ? (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                                            <CheckCircle2
                                                size={13}
                                            />

                                            Active
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">
                                            <XCircle
                                                size={13}
                                            />

                                            Inactive
                                        </span>
                                    )}

                                </div>

                                <p className="mt-1 text-sm font-medium text-indigo-600">
                                    {learningPath.skillName}
                                </p>

                                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                                    {learningPath.description ||
                                        "No description provided."}
                                </p>

                            </div>
                        </div>

                        {/* Topic Count */}

                        <div className="rounded-xl bg-slate-50 px-5 py-3 text-center">

                            <p className="text-2xl font-bold text-slate-900">
                                {topics.length}
                            </p>

                            <p className="text-xs text-slate-500">
                                Topics
                            </p>

                        </div>

                    </div>
                </div>

                {/* ==================================================
                    Roadmap Header
                ================================================== */}

                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                        <h2 className="text-xl font-bold text-slate-900">
                            Learning Roadmap
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Manage the topics learners will follow.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleAddTopic}
                        disabled={!learningPath.active}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Plus size={18} />

                        Add Topic
                    </button>

                </div>

                {/* ==================================================
                    Inactive Info
                ================================================== */}

                {topics.some(
                    (topic) => !topic.active
                ) && (
                    <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                        <p className="text-sm text-amber-700">
                            Inactive topics are still visible here for
                            administration, but learners will not see
                            them in the learning roadmap.
                        </p>
                    </div>
                )}

                {/* ==================================================
                    Roadmap
                ================================================== */}

                <div className="relative mt-8">

                    {/* Vertical Line */}

                    {topics.length > 1 && (
                        <div className="absolute bottom-8 left-6 top-8 hidden w-px bg-indigo-100 sm:block" />
                    )}

                    <div className="space-y-5">

                        {topics.map(
                            (topic, index) => {

                                const topicActive =
                                    topic.active;

                                return (
                                    <div
                                        key={topic.id}
                                        className="relative flex gap-4"
                                    >

                                        {/* ==================================================
                                            Number
                                        ================================================== */}

                                        <div
                                            className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 border-slate-50 text-sm font-bold text-white shadow-sm ${
                                                topicActive
                                                    ? "bg-indigo-600"
                                                    : "bg-slate-400"
                                            }`}
                                        >
                                            {String(
                                                index + 1
                                            ).padStart(
                                                2,
                                                "0"
                                            )}
                                        </div>

                                        {/* ==================================================
                                            Topic Card
                                        ================================================== */}

                                        <div
                                            className={`min-w-0 flex-1 rounded-2xl border p-5 shadow-sm transition ${
                                                topicActive
                                                    ? "border-slate-200 bg-white hover:border-indigo-200 hover:shadow-md"
                                                    : "border-slate-200 bg-slate-50 opacity-80"
                                            }`}
                                        >

                                            <div className="flex items-start gap-3">

                                                {/* Drag Icon */}

                                                <GripVertical
                                                    size={18}
                                                    className={`mt-1 shrink-0 ${
                                                        topicActive
                                                            ? "cursor-grab text-slate-300"
                                                            : "text-slate-200"
                                                    }`}
                                                />

                                                <div className="min-w-0 flex-1">

                                                    {/* ==================================================
                                                        Topic Header
                                                    ================================================== */}

                                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                                                        <div className="min-w-0">

                                                            <div className="flex flex-wrap items-center gap-2">

                                                                <h3
                                                                    className={`font-semibold ${
                                                                        topicActive
                                                                            ? "text-slate-900"
                                                                            : "text-slate-500"
                                                                    }`}
                                                                >
                                                                    {
                                                                        topic.title
                                                                    }
                                                                </h3>

                                                                {/* Status Badge */}

                                                                {topicActive ? (
                                                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-600">
                                                                        <CheckCircle2
                                                                            size={
                                                                                12
                                                                            }
                                                                        />

                                                                        Active
                                                                    </span>
                                                                ) : (
                                                                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-500">
                                                                        <XCircle
                                                                            size={
                                                                                12
                                                                            }
                                                                        />

                                                                        Inactive
                                                                    </span>
                                                                )}

                                                            </div>

                                                            {/* Description */}

                                                            {topic.description && (
                                                                <p
                                                                    className={`mt-1 text-sm leading-6 ${
                                                                        topicActive
                                                                            ? "text-slate-500"
                                                                            : "text-slate-400"
                                                                    }`}
                                                                >
                                                                    {
                                                                        topic.description
                                                                    }
                                                                </p>
                                                            )}

                                                        </div>

                                                        {/* ==================================================
                                                            Actions
                                                        ================================================== */}

                                                        <div className="flex shrink-0 items-center gap-1">

                                                            {/* Edit */}

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleEditTopic(
                                                                        topic
                                                                    )
                                                                }
                                                                disabled={
                                                                    isActivating ||
                                                                    isDeactivating
                                                                }
                                                                className="rounded-lg p-2 text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
                                                                title="Edit topic"
                                                            >
                                                                <Edit3
                                                                    size={
                                                                        16
                                                                    }
                                                                />
                                                            </button>

                                                            {/* Deactivate */}

                                                            {topicActive ? (
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleDeactivateTopic(
                                                                            topic
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        isDeactivating ||
                                                                        isActivating
                                                                    }
                                                                    className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                                                                    title="Deactivate topic"
                                                                >
                                                                    {isDeactivating ? (
                                                                        <Loader2
                                                                            size={
                                                                                16
                                                                            }
                                                                            className="animate-spin"
                                                                        />
                                                                    ) : (
                                                                        <XCircle
                                                                            size={
                                                                                16
                                                                            }
                                                                        />
                                                                    )}
                                                                </button>
                                                            ) : (

                                                                /* Activate */

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleActivateTopic(
                                                                            topic
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        isActivating ||
                                                                        isDeactivating
                                                                    }
                                                                    className="rounded-lg p-2 text-slate-400 transition hover:bg-emerald-50 hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
                                                                    title="Activate topic"
                                                                >
                                                                    {isActivating ? (
                                                                        <Loader2
                                                                            size={
                                                                                16
                                                                            }
                                                                            className="animate-spin"
                                                                        />
                                                                    ) : (
                                                                        <CheckCircle2
                                                                            size={
                                                                                16
                                                                            }
                                                                        />
                                                                    )}
                                                                </button>
                                                            )}

                                                        </div>

                                                    </div>

                                                    {/* ==================================================
                                                        Resource URL
                                                    ================================================== */}

                                                    {topic.resourceUrl && (
                                                        <a
                                                            href={
                                                                topic.resourceUrl
                                                            }
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className={`mt-3 inline-block text-xs font-medium hover:underline ${
                                                                topicActive
                                                                    ? "text-indigo-600"
                                                                    : "text-slate-400"
                                                            }`}
                                                        >
                                                            Learning Resource →
                                                        </a>
                                                    )}

                                                    {/* ==================================================
                                                        Order
                                                    ================================================== */}

                                                    <p className="mt-3 text-xs text-slate-400">
                                                        Step{" "}
                                                        {
                                                            topic.orderIndex
                                                        }
                                                    </p>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                        )}

                    </div>

                    {/* ==================================================
                        Empty State
                    ================================================== */}

                    {topics.length === 0 && (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">

                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
                                <Route size={24} />
                            </div>

                            <h3 className="mt-4 font-semibold text-slate-800">
                                No topics yet
                            </h3>

                            <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
                                Start building this learning
                                roadmap by adding your first
                                topic.
                            </p>

                            <button
                                type="button"
                                onClick={handleAddTopic}
                                disabled={!learningPath.active}
                                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Plus size={17} />

                                Add First Topic
                            </button>

                        </div>
                    )}

                </div>
            </div>

            {/* ======================================================
                Topic Modal
            ====================================================== */}

            {showTopicModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4">

                    <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl">

                        {/* ==================================================
                            Modal Header
                        ================================================== */}

                        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">
                                    {editingTopic
                                        ? "Edit Topic"
                                        : "Add Topic"}
                                </h2>

                                <p className="mt-1 text-xs text-slate-500">
                                    Add a step to the learning roadmap.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={handleCloseModal}
                                disabled={
                                    createTopic.isPending ||
                                    updateTopic.isPending
                                }
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <X size={19} />
                            </button>

                        </div>

                        {/* ==================================================
                            Form
                        ================================================== */}

                        <form
                            onSubmit={handleSubmitTopic}
                            className="space-y-5 p-5"
                        >

                            {/* Topic Title */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Topic Title
                                </label>

                                <input
                                    type="text"
                                    value={title}
                                    onChange={(event) =>
                                        setTitle(
                                            event.target.value
                                        )
                                    }
                                    placeholder="e.g. REST APIs"
                                    maxLength={200}
                                    required
                                    disabled={
                                        createTopic.isPending ||
                                        updateTopic.isPending
                                    }
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                                />

                                <p className="mt-1 text-right text-xs text-slate-400">
                                    {title.length}/200
                                </p>

                            </div>

                            {/* Description */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Description
                                </label>

                                <textarea
                                    value={description}
                                    onChange={(event) =>
                                        setDescription(
                                            event.target.value
                                        )
                                    }
                                    placeholder="What will the learner understand after this topic?"
                                    rows={4}
                                    maxLength={1000}
                                    disabled={
                                        createTopic.isPending ||
                                        updateTopic.isPending
                                    }
                                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                                />

                                <p className="mt-1 text-right text-xs text-slate-400">
                                    {description.length}/1000
                                </p>

                            </div>

                            {/* Resource URL */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-slate-700">

                                    Resource URL

                                    <span className="ml-1 text-xs font-normal text-slate-400">
                                        optional
                                    </span>

                                </label>

                                <input
                                    type="url"
                                    value={resourceUrl}
                                    onChange={(event) =>
                                        setResourceUrl(
                                            event.target.value
                                        )
                                    }
                                    placeholder="https://..."
                                    maxLength={500}
                                    disabled={
                                        createTopic.isPending ||
                                        updateTopic.isPending
                                    }
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                                />

                            </div>

                            {/* ==================================================
                                Buttons
                            ================================================== */}

                            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">

                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    disabled={
                                        createTopic.isPending ||
                                        updateTopic.isPending
                                    }
                                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={
                                        createTopic.isPending ||
                                        updateTopic.isPending ||
                                        !title.trim()
                                    }
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >

                                    {(createTopic.isPending ||
                                        updateTopic.isPending) && (
                                        <Loader2
                                            size={17}
                                            className="animate-spin"
                                        />
                                    )}

                                    {editingTopic
                                        ? "Update Topic"
                                        : "Add Topic"}

                                </button>

                            </div>

                        </form>
                    </div>
                </div>
            )}

        </AdminLayout>
    );
}