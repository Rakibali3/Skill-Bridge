import  { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    ArrowRight,
    CheckCircle2,
    Edit3,
    Loader2,
    Plus,
    Route,
    Search,
    X,
    XCircle,
} from "lucide-react";

import AdminLayout from "../../admin/AdminLayout";

import {
    useActivateAdminLearningPath,
    useAdminLearningPaths,
    useAdminMasterSkills,
    useCreateAdminLearningPath,
    useDeactivateAdminLearningPath,
    useUpdateAdminLearningPath,
} from "../../../assets/hooks/admin/useAdminLearningPathData";

export default function AdminLearningPathsPage() {
    const navigate = useNavigate();

    const [search, setSearch] = useState("");

    const [showModal, setShowModal] = useState(false);

    const [editingPath, setEditingPath] = useState(null);

    const [skillId, setSkillId] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    /*
    |--------------------------------------------------------------------------
    | Queries
    |--------------------------------------------------------------------------
    */

    const {
        data: paths = [],
        isLoading: pathsLoading,
        isError: pathsError,
        error: pathsErrorData,
    } = useAdminLearningPaths();

    const {
        data: skills = [],
        isLoading: skillsLoading,
    } = useAdminMasterSkills();

    /*
    |--------------------------------------------------------------------------
    | Mutations
    |--------------------------------------------------------------------------
    */

    const createPath = useCreateAdminLearningPath();

    const updatePath = useUpdateAdminLearningPath();

    const deactivatePath = useDeactivateAdminLearningPath();

    const activatePath = useActivateAdminLearningPath();

    /*
    |--------------------------------------------------------------------------
    | Active Skills
    |--------------------------------------------------------------------------
    */

    const activeSkills = useMemo(() => {
        return skills.filter((skill) => skill.active);
    }, [skills]);

    /*
    |--------------------------------------------------------------------------
    | Filter Paths
    |--------------------------------------------------------------------------
    */

    const filteredPaths = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return paths;
        }

        return paths.filter(
            (path) =>
                path.title
                    ?.toLowerCase()
                    .includes(query) ||
                path.skillName
                    ?.toLowerCase()
                    .includes(query)
        );
    }, [paths, search]);

    /*
    |--------------------------------------------------------------------------
    | Open Create Modal
    |--------------------------------------------------------------------------
    */

    const handleCreate = () => {
        setEditingPath(null);

        setSkillId("");
        setTitle("");
        setDescription("");

        setShowModal(true);
    };

    /*
    |--------------------------------------------------------------------------
    | Open Edit Modal
    |--------------------------------------------------------------------------
    */

    const handleEdit = (path) => {
        setEditingPath(path);

        setSkillId(String(path.skillId));
        setTitle(path.title || "");
        setDescription(path.description || "");

        setShowModal(true);
    };

    /*
    |--------------------------------------------------------------------------
    | Close Modal
    |--------------------------------------------------------------------------
    */

    const handleClose = () => {
        setShowModal(false);

        setEditingPath(null);

        setSkillId("");
        setTitle("");
        setDescription("");
    };

    /*
    |--------------------------------------------------------------------------
    | Submit Learning Path
    |--------------------------------------------------------------------------
    */

    const handleSubmit = async (event) => {
        event.preventDefault();

        const pathData = {
            skillId: Number(skillId),
            title: title.trim(),
            description: description.trim(),
        };

        if (!pathData.skillId || !pathData.title) {
            return;
        }

        try {
            if (editingPath) {
                await updatePath.mutateAsync({
                    id: editingPath.id,
                    pathData,
                });
            } else {
                await createPath.mutateAsync(pathData);
            }

            handleClose();
        } catch (error) {
            console.error(
                "Learning path operation failed:",
                error
            );
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Open Learning Path Details
    |--------------------------------------------------------------------------
    */

    const handleOpenPath = (path) => {
        navigate(
            `/admin/learning-paths/${path.id}`
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Deactivate
    |--------------------------------------------------------------------------
    */

    const handleDeactivate = async (event, path) => {
        /*
         * Prevent the card click from firing.
         */
        event.stopPropagation();

        const confirmed = window.confirm(
            `Deactivate "${path.title}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            await deactivatePath.mutateAsync(path.id);
        } catch (error) {
            console.error(
                "Failed to deactivate learning path:",
                error
            );
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Activate
    |--------------------------------------------------------------------------
    */

    const handleActivate = async (event, path) => {
        /*
         * Prevent the card click from firing.
         */
        event.stopPropagation();

        try {
            await activatePath.mutateAsync(path.id);
        } catch (error) {
            console.error(
                "Failed to activate learning path:",
                error
            );
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Edit
    |--------------------------------------------------------------------------
    */

    const handleEditClick = (event, path) => {
        /*
         * Prevent the card click from firing.
         */
        event.stopPropagation();

        handleEdit(path);
    };

    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (pathsLoading || skillsLoading) {
        return (
            <AdminLayout>
                <div className="flex min-h-[60vh] items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2
                            size={30}
                            className="animate-spin text-indigo-600"
                        />

                        <p className="text-sm text-slate-500">
                            Loading learning paths...
                        </p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Error
    |--------------------------------------------------------------------------
    */

    if (pathsError) {
        return (
            <AdminLayout>
                <div className="mx-auto max-w-7xl">
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                        <h2 className="font-semibold text-red-700">
                            Failed to load learning paths
                        </h2>

                        <p className="mt-2 text-sm text-red-600">
                            {pathsErrorData?.response?.data
                                ?.message ||
                                "Please check your backend and try again."}
                        </p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="mx-auto max-w-7xl">
                {/* ============================================================
                    HEADER
                ============================================================ */}

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                <Route size={20} />
                            </div>

                            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                                Learning Paths
                            </h1>
                        </div>

                        <p className="mt-2 text-sm text-slate-500">
                            Create and manage structured learning
                            roadmaps for master skills.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleCreate}
                        disabled={
                            activeSkills.length === 0
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Plus size={18} />

                        Create Learning Path
                    </button>
                </div>

                {/* ============================================================
                    STATS
                ============================================================ */}

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {/* Total */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Total Paths
                        </p>

                        <p className="mt-2 text-2xl font-bold text-slate-900">
                            {paths.length}
                        </p>
                    </div>

                    {/* Active */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Active Paths
                        </p>

                        <p className="mt-2 text-2xl font-bold text-emerald-600">
                            {
                                paths.filter(
                                    (path) =>
                                        path.active
                                ).length
                            }
                        </p>
                    </div>

                    {/* Without Path */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Skills Without Paths
                        </p>

                        <p className="mt-2 text-2xl font-bold text-amber-600">
                            {
                                activeSkills.filter(
                                    (skill) =>
                                        !paths.some(
                                            (path) =>
                                                path.skillId ===
                                                skill.id
                                        )
                                ).length
                            }
                        </p>
                    </div>
                </div>

                {/* ============================================================
                    SEARCH
                ============================================================ */}

                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="relative">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Search learning paths or skills..."
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                        />
                    </div>
                </div>

                {/* ============================================================
                    LEARNING PATH CARDS
                ============================================================ */}

                {filteredPaths.length > 0 ? (
                    <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {filteredPaths.map((path) => (
                            <div
                                key={path.id}
                                role="button"
                                tabIndex={0}
                                onClick={() =>
                                    handleOpenPath(path)
                                }
                                onKeyDown={(event) => {
                                    if (
                                        event.key ===
                                            "Enter" ||
                                        event.key === " "
                                    ) {
                                        event.preventDefault();

                                        handleOpenPath(
                                            path
                                        );
                                    }
                                }}
                                className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-sm outline-none transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                {/* Card Header */}

                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                                            <Route size={20} />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="truncate font-semibold text-slate-900">
                                                {path.title}
                                            </p>

                                            <p className="mt-1 truncate text-xs font-medium text-indigo-600">
                                                {path.skillName}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Status */}

                                    {path.active ? (
                                        <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                                            Active
                                        </span>
                                    ) : (
                                        <span className="shrink-0 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">
                                            Inactive
                                        </span>
                                    )}
                                </div>

                                {/* Description */}

                                <p className="mt-4 line-clamp-3 min-h-15 text-sm leading-6 text-slate-500">
                                    {path.description ||
                                        "No description provided."}
                                </p>

                                {/* Manage Roadmap */}

                                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                                    <span className="text-xs font-medium text-slate-400 transition group-hover:text-indigo-600">
                                        Click to manage roadmap
                                    </span>

                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-400 transition group-hover:bg-indigo-50 group-hover:text-indigo-600">
                                        <ArrowRight
                                            size={16}
                                        />
                                    </div>
                                </div>

                                {/* Actions */}

                                <div className="mt-3 flex flex-wrap gap-2">
                                    {/* Edit */}

                                    <button
                                        type="button"
                                        onClick={(event) =>
                                            handleEditClick(
                                                event,
                                                path
                                            )
                                        }
                                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
                                    >
                                        <Edit3 size={14} />

                                        Edit
                                    </button>

                                    {/* Activate / Deactivate */}

                                    {path.active ? (
                                        <button
                                            type="button"
                                            onClick={(event) =>
                                                handleDeactivate(
                                                    event,
                                                    path
                                                )
                                            }
                                            disabled={
                                                deactivatePath.isPending
                                            }
                                            className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {deactivatePath.isPending ? (
                                                <Loader2
                                                    size={14}
                                                    className="animate-spin"
                                                />
                                            ) : (
                                                <XCircle
                                                    size={14}
                                                />
                                            )}

                                            Deactivate
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={(event) =>
                                                handleActivate(
                                                    event,
                                                    path
                                                )
                                            }
                                            disabled={
                                                activatePath.isPending
                                            }
                                            className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 px-3 py-2 text-xs font-medium text-emerald-600 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {activatePath.isPending ? (
                                                <Loader2
                                                    size={14}
                                                    className="animate-spin"
                                                />
                                            ) : (
                                                <CheckCircle2
                                                    size={14}
                                                />
                                            )}

                                            Activate
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* ========================================================
                       EMPTY STATE
                    ======================================================== */

                    <div className="mt-6 rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
                            <Route size={28} />
                        </div>

                        <h3 className="mt-4 font-semibold text-slate-800">
                            No learning paths found
                        </h3>

                        <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
                            {search
                                ? "Try changing your search."
                                : "Create a learning path for one of your master skills."}
                        </p>

                        {!search &&
                            activeSkills.length >
                                0 && (
                                <button
                                    type="button"
                                    onClick={
                                        handleCreate
                                    }
                                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
                                >
                                    <Plus size={17} />

                                    Create Learning Path
                                </button>
                            )}
                    </div>
                )}

                {/* ============================================================
                    CREATE / EDIT MODAL
                ============================================================ */}

                {showModal && (
                    <div
                        className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/50 p-4"
                        onMouseDown={(event) => {
                            if (
                                event.target ===
                                event.currentTarget
                            ) {
                                handleClose();
                            }
                        }}
                    >
                        <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
                            {/* Modal Header */}

                            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900">
                                        {editingPath
                                            ? "Edit Learning Path"
                                            : "Create Learning Path"}
                                    </h2>

                                    <p className="mt-1 text-xs text-slate-500">
                                        Connect a roadmap to a
                                        master skill.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={
                                        handleClose
                                    }
                                    className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                                >
                                    <X size={19} />
                                </button>
                            </div>

                            {/* Form */}

                            <form
                                onSubmit={handleSubmit}
                                className="space-y-5 p-5"
                            >
                                {/* Master Skill */}

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Master Skill
                                    </label>

                                    <select
                                        value={skillId}
                                        onChange={(
                                            event
                                        ) =>
                                            setSkillId(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        required
                                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                    >
                                        <option value="">
                                            Select a skill
                                        </option>

                                        {activeSkills.map(
                                            (
                                                skill
                                            ) => {
                                                const alreadyUsed =
                                                    paths.some(
                                                        (
                                                            path
                                                        ) =>
                                                            path.skillId ===
                                                                skill.id &&
                                                            path.id !==
                                                                editingPath?.id
                                                    );

                                                return (
                                                    <option
                                                        key={
                                                            skill.id
                                                        }
                                                        value={
                                                            skill.id
                                                        }
                                                        disabled={
                                                            alreadyUsed
                                                        }
                                                    >
                                                        {
                                                            skill.name
                                                        }

                                                        {alreadyUsed
                                                            ? " — Path already exists"
                                                            : ""}
                                                    </option>
                                                );
                                            }
                                        )}
                                    </select>
                                </div>

                                {/* Title */}

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Path Title
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            title
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setTitle(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        placeholder="e.g. Spring Boot Developer"
                                        required
                                        maxLength={
                                            150
                                        }
                                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                    />
                                </div>

                                {/* Description */}

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Description
                                    </label>

                                    <textarea
                                        value={
                                            description
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setDescription(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        placeholder="Describe what users will learn..."
                                        rows={4}
                                        maxLength={
                                            1000
                                        }
                                        className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                    />
                                </div>

                                {/* Buttons */}

                                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                                    <button
                                        type="button"
                                        onClick={
                                            handleClose
                                        }
                                        className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={
                                            createPath.isPending ||
                                            updatePath.isPending
                                        }
                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {(createPath.isPending ||
                                            updatePath.isPending) && (
                                            <Loader2
                                                size={
                                                    17
                                                }
                                                className="animate-spin"
                                            />
                                        )}

                                        {editingPath
                                            ? "Update Path"
                                            : "Create Path"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}