import  { useMemo, useState } from "react";
import {
    CheckCircle2,
    Edit3,
    Loader2,
    Plus,
    Search,
    Sparkles,
    X,
    XCircle,
} from "lucide-react";

import AdminLayout from "../../admin/AdminLayout";

import {
    useActivateAdminSkill,
    useAdminSkills,
    useCreateAdminSkill,
    useDeactivateAdminSkill,
    useUpdateAdminSkill,
} from "../../../assets/hooks/admin/useAdminSkillData";


export default function AdminSkillsPage() {

    /*
    |--------------------------------------------------------------------------
    | State
    |--------------------------------------------------------------------------
    */

    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("ALL");

    const [showModal, setShowModal] = useState(false);
    const [editingSkill, setEditingSkill] = useState(null);

    const [name, setName] = useState("");
    const [category, setCategory] = useState("");

    /*
    |--------------------------------------------------------------------------
    | Queries
    |--------------------------------------------------------------------------
    */

    const {
        data: skills = [],
        isLoading,
        isError,
        error,
    } = useAdminSkills();

    /*
    |--------------------------------------------------------------------------
    | Mutations
    |--------------------------------------------------------------------------
    */

    const createSkill = useCreateAdminSkill();
    const updateSkill = useUpdateAdminSkill();
    const deactivateSkill = useDeactivateAdminSkill();
    const activateSkill = useActivateAdminSkill();

    /*
    |--------------------------------------------------------------------------
    | Categories
    |--------------------------------------------------------------------------
    */

    const categories = useMemo(() => {

        const uniqueCategories = [
            ...new Set(
                skills
                    .map((skill) => skill.category)
                    .filter(Boolean)
            ),
        ];

        return uniqueCategories.sort();

    }, [skills]);


    /*
    |--------------------------------------------------------------------------
    | Filter skills
    |--------------------------------------------------------------------------
    */

    const filteredSkills = useMemo(() => {

        const query = search.trim().toLowerCase();

        return skills.filter((skill) => {

            const matchesSearch =
                !query ||
                skill.name?.toLowerCase().includes(query) ||
                skill.category?.toLowerCase().includes(query);

            const matchesCategory =
                categoryFilter === "ALL" ||
                skill.category === categoryFilter;

            return matchesSearch && matchesCategory;
        });

    }, [skills, search, categoryFilter]);


    /*
    |--------------------------------------------------------------------------
    | Open create modal
    |--------------------------------------------------------------------------
    */

    const handleCreate = () => {

        setEditingSkill(null);

        setName("");
        setCategory("");

        setShowModal(true);
    };


    /*
    |--------------------------------------------------------------------------
    | Open edit modal
    |--------------------------------------------------------------------------
    */

    const handleEdit = (skill) => {

        setEditingSkill(skill);

        setName(skill.name || "");
        setCategory(skill.category || "");

        setShowModal(true);
    };


    /*
    |--------------------------------------------------------------------------
    | Close modal
    |--------------------------------------------------------------------------
    */

    const handleCloseModal = () => {

        setShowModal(false);

        setEditingSkill(null);

        setName("");
        setCategory("");
    };


    /*
    |--------------------------------------------------------------------------
    | Submit form
    |--------------------------------------------------------------------------
    */

    const handleSubmit = async (event) => {

        event.preventDefault();

        const skillData = {
            name: name.trim(),
            category: category.trim(),
        };

        if (!skillData.name || !skillData.category) {
            return;
        }

        try {

            if (editingSkill) {

                await updateSkill.mutateAsync({
                    id: editingSkill.id,
                    skillData,
                });

            } else {

                await createSkill.mutateAsync(skillData);
            }

            handleCloseModal();

        } catch (error) {

            console.error("Skill operation failed:", error);
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Deactivate
    |--------------------------------------------------------------------------
    */

    const handleDeactivate = async (skill) => {

        const confirmed = window.confirm(
            `Are you sure you want to deactivate "${skill.name}"?`
        );

        if (!confirmed) {
            return;
        }

        try {

            await deactivateSkill.mutateAsync(skill.id);

        } catch (error) {

            console.error(
                "Failed to deactivate skill:",
                error
            );
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Activate
    |--------------------------------------------------------------------------
    */

    const handleActivate = async (skill) => {

        try {

            await activateSkill.mutateAsync(skill.id);

        } catch (error) {

            console.error(
                "Failed to activate skill:",
                error
            );
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Error message
    |--------------------------------------------------------------------------
    */

    const getErrorMessage = (mutation) => {

        return (
            mutation.error?.response?.data?.message ||
            mutation.error?.response?.data?.error ||
            mutation.error?.message ||
            "Something went wrong"
        );
    };


    const mutationError =
        createSkill.error ||
        updateSkill.error ||
        deactivateSkill.error ||
        activateSkill.error;


    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (isLoading) {

        return (
            <AdminLayout>

                <div className="flex min-h-[60vh] items-center justify-center">

                    <div className="flex flex-col items-center gap-3">

                        <Loader2
                            size={30}
                            className="animate-spin text-indigo-600"
                        />

                        <p className="text-sm text-slate-500">
                            Loading skills...
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

    if (isError) {

        return (
            <AdminLayout>

                <div className="mx-auto max-w-7xl">

                    <div className="rounded-2xl border border-red-200 bg-red-50 p-6">

                        <h2 className="font-semibold text-red-700">
                            Failed to load skills
                        </h2>

                        <p className="mt-2 text-sm text-red-600">
                            {error?.response?.data?.message ||
                                "Unable to fetch skills from the server."}
                        </p>

                    </div>

                </div>

            </AdminLayout>
        );
    }


    /*
    |--------------------------------------------------------------------------
    | UI
    |--------------------------------------------------------------------------
    */

    return (
        <AdminLayout>

            <div className="mx-auto max-w-7xl">

                {/* Header */}

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                        <div className="flex items-center gap-2">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">

                                <Sparkles size={20} />

                            </div>

                            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                                Master Skills
                            </h1>

                        </div>

                        <p className="mt-2 text-sm text-slate-500">
                            Manage the skills available across SkillBridge.
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={handleCreate}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                    >

                        <Plus size={18} />

                        Add Skill

                    </button>

                </div>


                {/* Stats */}

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

                    <div className="rounded-2xl border border-slate-200 bg-white p-5">

                        <p className="text-sm text-slate-500">
                            Total Skills
                        </p>

                        <p className="mt-2 text-2xl font-bold text-slate-900">
                            {skills.length}
                        </p>

                    </div>


                    <div className="rounded-2xl border border-slate-200 bg-white p-5">

                        <p className="text-sm text-slate-500">
                            Active Skills
                        </p>

                        <p className="mt-2 text-2xl font-bold text-emerald-600">
                            {
                                skills.filter(
                                    (skill) => skill.active
                                ).length
                            }
                        </p>

                    </div>


                    <div className="rounded-2xl border border-slate-200 bg-white p-5">

                        <p className="text-sm text-slate-500">
                            Categories
                        </p>

                        <p className="mt-2 text-2xl font-bold text-indigo-600">
                            {categories.length}
                        </p>

                    </div>

                </div>


                {/* Filters */}

                <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row">

                    <div className="relative flex-1">

                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Search skills..."
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                        />

                    </div>


                    <select
                        value={categoryFilter}
                        onChange={(event) =>
                            setCategoryFilter(event.target.value)
                        }
                        className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:w-52"
                    >

                        <option value="ALL">
                            All Categories
                        </option>

                        {categories.map((category) => (

                            <option
                                key={category}
                                value={category}
                            >
                                {category}
                            </option>

                        ))}

                    </select>

                </div>


                {/* Mutation error */}

                {mutationError && (

                    <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">

                        {getErrorMessage({
                            error: mutationError,
                        })}

                    </div>

                )}


                {/* Skills table */}

                <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">

                    {/* Desktop table */}

                    <div className="hidden overflow-x-auto md:block">

                        <table className="w-full">

                            <thead className="border-b border-slate-200 bg-slate-50">

                                <tr>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Skill
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Category
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Status
                                    </th>

                                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody className="divide-y divide-slate-100">

                                {filteredSkills.map((skill) => (

                                    <tr
                                        key={skill.id}
                                        className="transition hover:bg-slate-50"
                                    >

                                        <td className="px-6 py-4">

                                            <div className="flex items-center gap-3">

                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">

                                                    <Sparkles size={18} />

                                                </div>

                                                <div>

                                                    <p className="font-semibold text-slate-800">
                                                        {skill.name}
                                                    </p>

                                                    <p className="text-xs text-slate-400">
                                                        ID: {skill.id}
                                                    </p>

                                                </div>

                                            </div>

                                        </td>


                                        <td className="px-6 py-4">

                                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                                                {skill.category}
                                            </span>

                                        </td>


                                        <td className="px-6 py-4">

                                            {skill.active ? (

                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">

                                                    <CheckCircle2 size={14} />

                                                    Active

                                                </span>

                                            ) : (

                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">

                                                    <XCircle size={14} />

                                                    Inactive

                                                </span>

                                            )}

                                        </td>


                                        <td className="px-6 py-4">

                                            <div className="flex justify-end gap-2">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleEdit(skill)
                                                    }
                                                    className="rounded-lg p-2 text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600"
                                                    title="Edit skill"
                                                >
                                                    <Edit3 size={17} />
                                                </button>


                                                {skill.active ? (

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDeactivate(
                                                                skill
                                                            )
                                                        }
                                                        disabled={
                                                            deactivateSkill.isPending
                                                        }
                                                        className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                                                        title="Deactivate skill"
                                                    >
                                                        {deactivateSkill.isPending ? (
                                                            <Loader2
                                                                size={17}
                                                                className="animate-spin"
                                                            />
                                                        ) : (
                                                            <XCircle size={17} />
                                                        )}
                                                    </button>

                                                ) : (

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleActivate(
                                                                skill
                                                            )
                                                        }
                                                        disabled={
                                                            activateSkill.isPending
                                                        }
                                                        className="rounded-lg p-2 text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-600 disabled:opacity-50"
                                                        title="Activate skill"
                                                    >
                                                        {activateSkill.isPending ? (
                                                            <Loader2
                                                                size={17}
                                                                className="animate-spin"
                                                            />
                                                        ) : (
                                                            <CheckCircle2 size={17} />
                                                        )}
                                                    </button>

                                                )}

                                            </div>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>


                    {/* Mobile cards */}

                    <div className="divide-y divide-slate-100 md:hidden">

                        {filteredSkills.map((skill) => (

                            <div
                                key={skill.id}
                                className="p-4"
                            >

                                <div className="flex items-start justify-between gap-3">

                                    <div className="flex min-w-0 items-center gap-3">

                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">

                                            <Sparkles size={18} />

                                        </div>

                                        <div className="min-w-0">

                                            <p className="truncate font-semibold text-slate-800">
                                                {skill.name}
                                            </p>

                                            <p className="mt-1 text-xs text-slate-400">
                                                {skill.category}
                                            </p>

                                        </div>

                                    </div>


                                    {skill.active ? (

                                        <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                                            Active
                                        </span>

                                    ) : (

                                        <span className="shrink-0 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">
                                            Inactive
                                        </span>

                                    )}

                                </div>


                                <div className="mt-4 flex justify-end gap-2">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleEdit(skill)
                                        }
                                        className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                                    >
                                        Edit
                                    </button>


                                    {skill.active ? (

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDeactivate(
                                                    skill
                                                )
                                            }
                                            className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                                        >
                                            Deactivate
                                        </button>

                                    ) : (

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleActivate(
                                                    skill
                                                )
                                            }
                                            className="rounded-lg border border-emerald-200 px-3 py-2 text-xs font-medium text-emerald-600 hover:bg-emerald-50"
                                        >
                                            Activate
                                        </button>

                                    )}

                                </div>

                            </div>

                        ))}

                    </div>


                    {/* Empty */}

                    {filteredSkills.length === 0 && (

                        <div className="px-6 py-16 text-center">

                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">

                                <Sparkles size={24} />

                            </div>

                            <h3 className="mt-4 font-semibold text-slate-800">
                                No skills found
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                Try changing your search or category filter.
                            </p>

                        </div>

                    )}

                </div>

            </div>


            {/* Modal */}

            {showModal && (

                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4">

                    <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">

                        {/* Modal header */}

                        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

                            <div>

                                <h2 className="text-lg font-semibold text-slate-900">

                                    {editingSkill
                                        ? "Edit Skill"
                                        : "Add New Skill"}

                                </h2>

                                <p className="mt-1 text-xs text-slate-500">

                                    {editingSkill
                                        ? "Update the master skill information."
                                        : "Add a skill to the SkillBridge master list."}

                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={handleCloseModal}
                                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                            >
                                <X size={19} />
                            </button>

                        </div>


                        {/* Form */}

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5 p-5"
                        >

                            <div>

                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Skill Name
                                </label>

                                <input
                                    type="text"
                                    value={name}
                                    onChange={(event) =>
                                        setName(event.target.value)
                                    }
                                    placeholder="e.g. Spring Boot"
                                    required
                                    maxLength={100}
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />

                            </div>


                            <div>

                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Category
                                </label>

                                <input
                                    type="text"
                                    value={category}
                                    onChange={(event) =>
                                        setCategory(event.target.value)
                                    }
                                    placeholder="e.g. Backend"
                                    required
                                    maxLength={100}
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />

                            </div>


                            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">

                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    disabled={
                                        createSkill.isPending ||
                                        updateSkill.isPending
                                    }
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >

                                    {(createSkill.isPending ||
                                        updateSkill.isPending) && (

                                        <Loader2
                                            size={17}
                                            className="animate-spin"
                                        />

                                    )}

                                    {editingSkill
                                        ? "Update Skill"
                                        : "Create Skill"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </AdminLayout>
    );
}