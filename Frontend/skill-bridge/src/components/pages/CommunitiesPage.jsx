import { useMemo, useState } from "react";

import CreateCommunityModal from "../../assets/modals/CreateCommunityModal";

import { useNavigate } from "react-router-dom";

import {
    Check,
    Code2,
    Cpu,
    Database,
    Globe,
    GraduationCap,
    Plus,
    Search,
    Users,
    Palette,
    Briefcase,
    Loader2,
    MoreHorizontal,
    Pencil,
    Trash2,
} from "lucide-react";

import DashboardLayout from "../dashboard/DashboardLayout";

import {
    useCommunities,
    useJoinCommunity,
    useLeaveCommunity,
    useDeleteCommunity,
} from "../../assets/hooks/useCommunityData";


export default function CommunitiesPage() {

    const navigate = useNavigate();


    // ============================================================
    // STATE
    // ============================================================

    const [showCreateModal, setShowCreateModal] =
        useState(false);

    const [editingCommunity, setEditingCommunity] =
        useState(null);

    const [openMenuId, setOpenMenuId] =
        useState(null);

    const [search, setSearch] =
        useState("");

    const [selectedCategory, setSelectedCategory] =
        useState("All");


    // ============================================================
    // COMMUNITIES
    // ============================================================

    const {
        data: communitiesData,
        isLoading,
        isError,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
    } = useCommunities();


    // eslint-disable-next-line react-hooks/exhaustive-deps
    const communities =
        communitiesData?.pages?.flatMap(
            (page) => page.content
        ) ?? [];


    // ============================================================
    // MUTATIONS
    // ============================================================

    const joinCommunity =
        useJoinCommunity();

    const leaveCommunity =
        useLeaveCommunity();

    const deleteCommunity =
        useDeleteCommunity();


    // ============================================================
    // CATEGORIES
    // ============================================================

    const categories = useMemo(() => {

        const values = communities
            .map(
                (community) =>
                    community.category
            )
            .filter(Boolean);

        return [
            "All",
            ...new Set(values),
        ];

    }, [communities]);


    // ============================================================
    // FILTER COMMUNITIES
    // ============================================================

    const filteredCommunities =
        useMemo(() => {

            const searchValue =
                search
                    .trim()
                    .toLowerCase();

            return communities.filter(
                (community) => {

                    const matchesSearch =
                        !searchValue ||
                        community.name
                            ?.toLowerCase()
                            .includes(
                                searchValue
                            ) ||
                        community.description
                            ?.toLowerCase()
                            .includes(
                                searchValue
                            ) ||
                        community.category
                            ?.toLowerCase()
                            .includes(
                                searchValue
                            );

                    const matchesCategory =
                        selectedCategory ===
                            "All" ||
                        community.category ===
                            selectedCategory;

                    return (
                        matchesSearch &&
                        matchesCategory
                    );
                }
            );

        }, [
            communities,
            search,
            selectedCategory,
        ]);


    // ============================================================
    // JOIN / LEAVE
    // ============================================================

    const handleMembership = (
        event,
        community
    ) => {

        event.stopPropagation();

        if (community.joined) {

            leaveCommunity.mutate(
                community.id
            );

            return;
        }

        joinCommunity.mutate(
            community.id
        );
    };


    // ============================================================
    // DELETE COMMUNITY
    // ============================================================

    const handleDeleteCommunity = async (
        event,
        community
    ) => {

        event.stopPropagation();

        const confirmed =
            window.confirm(
                `Are you sure you want to delete "${community.name}"?`
            );

        if (!confirmed) {
            return;
        }

        try {

            await deleteCommunity.mutateAsync(
                community.id
            );

            setOpenMenuId(null);

        } catch (err) {

            alert(
                err?.response?.data?.message ||
                err?.message ||
                "Failed to delete community."
            );
        }
    };


    // ============================================================
    // CATEGORY ICON
    // ============================================================

    const getCategoryIcon = (
        category
    ) => {

        const value =
            category?.toLowerCase();

        if (
            value?.includes("program") ||
            value?.includes("software")
        ) {
            return Code2;
        }

        if (
            value?.includes("web")
        ) {
            return Globe;
        }

        if (
            value?.includes("data")
        ) {
            return Database;
        }

        if (
            value?.includes("ai") ||
            value?.includes("machine")
        ) {
            return Cpu;
        }

        if (
            value?.includes("career")
        ) {
            return Briefcase;
        }

        if (
            value?.includes("design")
        ) {
            return Palette;
        }

        return GraduationCap;
    };


    // ============================================================
    // RENDER
    // ============================================================

    return (
        <DashboardLayout>

            <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">

                <div className="mx-auto max-w-7xl">


                    {/* =================================================
                        HEADER
                    ================================================== */}

                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div>

                            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                                Communities
                            </h1>

                            <p className="mt-1 text-sm text-slate-500">
                                Join communities to discuss, learn and grow together.
                            </p>

                        </div>


                        <button
                            type="button"
                            onClick={() => {
                                setEditingCommunity(null);
                                setShowCreateModal(true);
                            }}
                            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 cursor-pointer"
                        >
                            <Plus size={18} />
                            Create Community
                        </button>

                    </div>


                    {/* =================================================
                        SEARCH
                    ================================================== */}

                    <div className="mb-4">

                        <div className="relative">

                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                                placeholder="Search communities..."
                                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />

                        </div>

                    </div>


                    {/* =================================================
                        CATEGORIES
                    ================================================== */}

                    <div className="mb-6 flex gap-2 overflow-x-auto pb-1">

                        {categories.map(
                            (category) => {

                                const active =
                                    selectedCategory ===
                                    category;

                                return (
                                    <button
                                        key={category}
                                        type="button"
                                        onClick={() =>
                                            setSelectedCategory(
                                                category
                                            )
                                        }
                                        className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                                            active
                                                ? "bg-indigo-600 text-white"
                                                : "bg-white text-slate-600 hover:bg-slate-100"
                                        }`}
                                    >
                                        {category}
                                    </button>
                                );
                            }
                        )}

                    </div>


                    {/* =================================================
                        LOADING
                    ================================================== */}

                    {isLoading && (

                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                            {[1, 2, 3, 4, 5, 6].map(
                                (item) => (

                                    <div
                                        key={item}
                                        className="h-80 animate-pulse rounded-2xl bg-slate-200"
                                    />

                                )
                            )}

                        </div>

                    )}


                    {/* =================================================
                        ERROR
                    ================================================== */}

                    {isError && (

                        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-center text-sm text-red-600">
                            Failed to load communities.
                        </div>

                    )}


                    {/* =================================================
                        EMPTY
                    ================================================== */}

                    {!isLoading &&
                        !isError &&
                        filteredCommunities.length === 0 && (

                            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">

                                <Users className="mx-auto mb-3 h-10 w-10 text-slate-300" />

                                <h2 className="font-semibold text-slate-800">
                                    No communities found
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Try a different search or category.
                                </p>

                            </div>
                        )}


                    {/* =================================================
                        COMMUNITY GRID
                    ================================================== */}

                    {!isLoading &&
                        !isError &&
                        filteredCommunities.length > 0 && (

                            <>

                                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                                    {filteredCommunities.map(
                                        (community) => {

                                            const Icon =
                                                getCategoryIcon(
                                                    community.category
                                                );

                                            const isOwner =
                                                community.currentUserRole ===
                                                "OWNER";

                                            const isMenuOpen =
                                                openMenuId ===
                                                community.id;


                                            return (

                                                <div
                                                    key={community.id}
                                                    onClick={() =>
                                                        navigate(
                                                            `/communities/${community.id}`
                                                        )
                                                    }
                                                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
                                                >

                                                    {/* =========================================
                                                        COVER
                                                    ========================================== */}

                                                    <div className="relative h-36 overflow-hidden bg-linear-to-br from-indigo-100 to-purple-100">

                                                        {community.coverImageUrl ? (

                                                            <img
                                                                src={
                                                                    community.coverImageUrl
                                                                }
                                                                alt={
                                                                    community.name
                                                                }
                                                                className="h-full w-full object-cover"
                                                            />

                                                        ) : (

                                                            <div className="flex h-full items-center justify-center">

                                                                <Icon className="h-16 w-16 text-indigo-300" />

                                                            </div>
                                                        )}


                                                        {/* =====================================
                                                            OWNER MENU
                                                        ====================================== */}

                                                        {isOwner && (

                                                            <div className="absolute right-3 top-3">

                                                                <button
                                                                    type="button"
                                                                    onClick={(
                                                                        event
                                                                    ) => {

                                                                        event.stopPropagation();

                                                                        setOpenMenuId(
                                                                            isMenuOpen
                                                                                ? null
                                                                                : community.id
                                                                        );
                                                                    }}
                                                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm backdrop-blur transition hover:bg-white"
                                                                >

                                                                    <MoreHorizontal
                                                                        size={
                                                                            18
                                                                        }
                                                                    />

                                                                </button>


                                                                {/* =================================
                                                                    DROPDOWN
                                                                ================================== */}

                                                                {isMenuOpen && (

                                                                    <div
                                                                        onClick={(
                                                                            event
                                                                        ) =>
                                                                            event.stopPropagation()
                                                                        }
                                                                        className="absolute right-0 z-30 mt-2 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl"
                                                                    >

                                                                        {/* EDIT */}

                                                                        <button
                                                                            type="button"
                                                                            onClick={(
                                                                                event
                                                                            ) => {

                                                                                event.stopPropagation();

                                                                                setEditingCommunity(
                                                                                    community
                                                                                );

                                                                                setShowCreateModal(
                                                                                    false
                                                                                );

                                                                                setOpenMenuId(
                                                                                    null
                                                                                );
                                                                            }}
                                                                            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50"
                                                                        >

                                                                            <Pencil
                                                                                size={
                                                                                    16
                                                                                }
                                                                            />

                                                                            Edit

                                                                        </button>


                                                                        {/* DELETE */}

                                                                        <button
                                                                            type="button"
                                                                            onClick={(
                                                                                event
                                                                            ) =>
                                                                                handleDeleteCommunity(
                                                                                    event,
                                                                                    community
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                deleteCommunity.isPending
                                                                            }
                                                                            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                                        >

                                                                            {deleteCommunity.isPending ? (

                                                                                <Loader2
                                                                                    size={
                                                                                        16
                                                                                    }
                                                                                    className="animate-spin"
                                                                                />

                                                                            ) : (

                                                                                <Trash2
                                                                                    size={
                                                                                        16
                                                                                    }
                                                                                />

                                                                            )}

                                                                            Delete

                                                                        </button>

                                                                    </div>

                                                                )}

                                                            </div>

                                                        )}


                                                        {/* =====================================
                                                            COMMUNITY ICON
                                                        ====================================== */}

                                                        <div className="absolute -bottom-5 left-5 flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border-4 border-white bg-indigo-100">

                                                            {community.iconUrl ? (

                                                                <img
                                                                    src={
                                                                        community.iconUrl
                                                                    }
                                                                    alt=""
                                                                    className="h-full w-full object-cover"
                                                                />

                                                            ) : (

                                                                <Icon className="h-5 w-5 text-indigo-600" />

                                                            )}

                                                        </div>

                                                    </div>


                                                    {/* =========================================
                                                        CONTENT
                                                    ========================================== */}

                                                    <div className="p-5 pt-8">

                                                        <h2 className="truncate text-lg font-bold text-slate-900">
                                                            {
                                                                community.name
                                                            }
                                                        </h2>


                                                        <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">

                                                            <Users className="h-3.5 w-3.5" />

                                                            {
                                                                community.memberCount
                                                            }{" "}
                                                            members

                                                        </div>


                                                        <p className="mt-3 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">

                                                            {community.description ||
                                                                "A place to learn, share knowledge and connect with others."}

                                                        </p>


                                                        {/* CATEGORY */}

                                                        {community.category && (

                                                            <span className="mt-3 inline-flex rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600">
                                                                {
                                                                    community.category
                                                                }
                                                            </span>

                                                        )}


                                                        {/* JOIN / LEAVE */}

                                                        <button
                                                            type="button"
                                                            onClick={(
                                                                event
                                                            ) =>
                                                                handleMembership(
                                                                    event,
                                                                    community
                                                                )
                                                            }
                                                            disabled={
                                                                joinCommunity.isPending ||
                                                                leaveCommunity.isPending
                                                            }
                                                            className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                                                                community.joined
                                                                    ? "border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                                                                    : "border-indigo-600 bg-white text-indigo-600 hover:bg-indigo-600 hover:text-white"
                                                            }`}
                                                        >

                                                            {community.joined ? (

                                                                <>
                                                                    <Check className="h-4 w-4" />

                                                                    Joined
                                                                </>

                                                            ) : (

                                                                <>
                                                                    <Plus className="h-4 w-4" />

                                                                    Join
                                                                </>
                                                            )}

                                                        </button>

                                                    </div>

                                                </div>
                                            );
                                        }
                                    )}

                                </div>


                                {/* =================================================
                                    LOAD MORE
                                ================================================== */}

                                {hasNextPage && (

                                    <div className="flex justify-center pt-6">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                fetchNextPage()
                                            }
                                            disabled={
                                                isFetchingNextPage
                                            }
                                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
                                        >

                                            {isFetchingNextPage ? (

                                                <>
                                                    <Loader2
                                                        size={
                                                            16
                                                        }
                                                        className="animate-spin"
                                                    />

                                                    Loading...
                                                </>

                                            ) : (

                                                "Load More"

                                            )}

                                        </button>

                                    </div>

                                )}

                            </>

                        )}

                </div>


                {/* =====================================================
                    CREATE / EDIT MODAL
                ====================================================== */}

                <CreateCommunityModal
                    isOpen={
                        showCreateModal ||
                        Boolean(editingCommunity)
                    }
                    community={
                        editingCommunity
                    }
                    onClose={() => {

                        setShowCreateModal(
                            false
                        );

                        setEditingCommunity(
                            null
                        );

                    }}
                />

            </div>

        </DashboardLayout>
    );
}