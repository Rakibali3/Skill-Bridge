import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Users,
    UserPlus,
    UserMinus,
    CalendarDays,
    Tag,
    Loader2,
    UserRound,
    ArrowRight,
    MessageSquare,
} from "lucide-react";
import DashboardLayout from "../dashboard/DashboardLayout";

import {
    useCommunity,
    useCommunityMembers,
    useJoinCommunity,
    useLeaveCommunity,
} from "../../assets/hooks/useCommunityData";

export default function CommunityDetailsPage() {
    const { communityId } = useParams();
    const navigate = useNavigate();

    const {
        data: community,
        isLoading: communityLoading,
        isError: communityError,
    } = useCommunity(communityId);

    const {
        data: members = [],
        isLoading: membersLoading,
    } = useCommunityMembers(communityId);
    console.log(members);
    

    const joinCommunity = useJoinCommunity();
    const leaveCommunity = useLeaveCommunity();

    const handleJoin = async () => {
        try {
            await joinCommunity.mutateAsync(Number(communityId));
        } catch (error) {
            console.error("Failed to join community:", error);
        }
    };

    const handleLeave = async () => {
        try {
            await leaveCommunity.mutateAsync(Number(communityId));
        } catch (error) {
            console.error("Failed to leave community:", error);
        }
    };

    if (communityLoading) {
        return (
            <DashboardLayout>
                <div className="mx-auto max-w-7xl animate-pulse space-y-6">
                    <div className="h-64 rounded-3xl bg-slate-200/80 sm:h-72 lg:h-80" />
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4">
                        <div className="h-8 w-64 rounded-lg bg-slate-200" />
                        <div className="h-4 w-96 rounded-md bg-slate-200" />
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (communityError || !community) {
        return (
            <DashboardLayout>
                <div className="flex min-h-[65vh] flex-col items-center justify-center text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 ring-1 ring-red-100">
                        <Users className="text-red-500" size={32} />
                    </div>

                    <h2 className="mt-5 text-xl font-bold text-slate-900">
                        Community Not Found
                    </h2>

                    <p className="mt-1.5 max-w-sm text-sm text-slate-500">
                        This community may have been removed or the link is invalid.
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate("/communities")}
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-slate-800 active:scale-95"
                    >
                        <ArrowLeft size={16} />
                        Back to Communities
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    const isOwner = community.currentUserRole === "OWNER";
    const isProcessing = joinCommunity.isPending || leaveCommunity.isPending;

    return (
        <DashboardLayout>
            <div className="mx-auto max-w-7xl">
                {/* Back Button */}
                <button
                    type="button"
                    onClick={() => navigate("/communities")}
                    className="group mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900 cursor-pointer"
                >
                    <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                    Back to Communities
                </button>

                {/* Banner / Cover */}
                <div className="relative h-56 overflow-hidden rounded-3xl bg-slate-900 shadow-inner sm:h-72 lg:h-80">
                    {community.coverImageUrl ? (
                        <img
                            src={community.coverImageUrl}
                            alt={community.name}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center bg-linear-to-br from-slate-800 via-slate-900 to-indigo-950">
                            <Users size={80} className="text-white/20" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-transparent to-transparent" />
                </div>

                {/* Main Content Card Container */}
                <div className="relative -mt-16 px-3 sm:px-6">
                    {/* Header Details Card */}
                    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm backdrop-blur-sm sm:p-8">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                                {/* Community Icon */}
                                <div className="-mt-16 h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-slate-100 shadow-md sm:-mt-20 sm:h-28 sm:w-28 ring-1 ring-slate-900/5">
                                    {community.iconUrl ? (
                                        <img
                                            src={community.iconUrl}
                                            alt={`${community.name} icon`}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-slate-50">
                                            <Users size={36} className="text-slate-400" />
                                        </div>
                                    )}
                                </div>

                                {/* Community Meta Information */}
                                <div className="space-y-2">
                                    <div className="flex flex-wrap items-center gap-2.5">
                                        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                                            {community.name}
                                        </h1>

                                        {isOwner && (
                                            <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-600/10">
                                                Owner
                                            </span>
                                        )}
                                    </div>

                                    {community.category && (
                                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50/60 px-2.5 py-1 rounded-lg">
                                            <Tag size={13} />
                                            {community.category}
                                        </div>
                                    )}

                                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 pt-1">
                                        <span className="flex items-center gap-1.5">
                                            <Users size={15} className="text-slate-400" />
                                            {community.memberCount} {community.memberCount === 1 ? "member" : "members"}
                                        </span>

                                        {community.createdAt && (
                                            <span className="flex items-center gap-1.5">
                                                <CalendarDays size={15} className="text-slate-400" />
                                                Created {new Date(community.createdAt).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Actions: Join / Leave Button */}
                            <div className="shrink-0 pt-2 lg:pt-0">
                                {community.joined ? (
                                    <button
                                        type="button"
                                        onClick={handleLeave}
                                        disabled={isOwner || isProcessing}
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-2xs transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 active:scale-95 cursor-pointer lg:w-auto"
                                    >
                                        {leaveCommunity.isPending ? (
                                            <Loader2 size={17} className="animate-spin text-slate-500" />
                                        ) : (
                                            <UserMinus size={17} className="text-slate-500" />
                                        )}
                                        {isOwner ? "Owner" : "Leave Community"}
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleJoin}
                                        disabled={isProcessing}
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 active:scale-95 cursor-pointer lg:w-auto"
                                    >
                                        {joinCommunity.isPending ? (
                                            <Loader2 size={17} className="animate-spin" />
                                        ) : (
                                            <UserPlus size={17} />
                                        )}
                                        Join Community
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Community Description Section */}
                        {community.description && (
                            <div className="mt-6 border-t border-slate-100 pt-5">
                                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                                    About this community
                                </h2>
                                <p className="mt-2 max-w-4xl whitespace-pre-line text-sm leading-relaxed text-slate-600">
                                    {community.description}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Content Section: Sidebar Members & Main Feed */}
                    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Sidebar: Members Card */}
                        <div className="flex flex-col rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm lg:col-span-1">
                            {/* Card Header */}
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="font-semibold text-slate-900">
                                            Members
                                        </h2>
                                        {!membersLoading && members.length > 0 && (
                                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                                                {members.length}
                                            </span>
                                        )}
                                    </div>
                                    <p className="mt-0.5 text-xs text-slate-500">
                                        People in this community
                                    </p>
                                </div>

                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-600 ring-1 ring-slate-900/5">
                                    <Users size={17} />
                                </div>
                            </div>

                            {/* Card Body */}
                            {membersLoading ? (
                                <div className="mt-4 space-y-3">
                                    {[1, 2, 3, 4].map((item) => (
                                        <div
                                            key={item}
                                            className="flex items-center justify-between gap-3 rounded-xl p-1"
                                        >
                                            <div className="flex animate-pulse items-center gap-3">
                                                <div className="h-9 w-9 shrink-0 rounded-full bg-slate-200" />
                                                <div className="space-y-1.5">
                                                    <div className="h-3 w-20 rounded bg-slate-200" />
                                                    <div className="h-2 w-12 rounded bg-slate-200" />
                                                </div>
                                            </div>
                                            <div className="h-7 w-16 animate-pulse rounded-lg bg-slate-200" />
                                        </div>
                                    ))}
                                </div>
                            ) : members.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-10 text-center">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-50 ring-1 ring-slate-100">
                                        <UserRound size={20} className="text-slate-400" />
                                    </div>
                                    <p className="mt-3 text-sm font-medium text-slate-700">
                                        No members visible
                                    </p>
                                    <p className="mt-1 max-w-50 text-xs text-slate-500">
                                        Join this community to view the full member list.
                                    </p>
                                </div>
                            ) : (
                                <div className="mt-4 max-h-115 space-y-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200">
                                    {members.map((member) => {
                                        const isMemberOwner = member.role === "OWNER";

                                        return (
                                            <div
                                                key={member.userId}
                                                className="group flex items-center justify-between gap-3 rounded-2xl p-2 transition-colors hover:bg-slate-50"
                                            >
                                                {/* Left Info */}
                                                <div className="flex min-w-0 items-center gap-3">
                                                    {member.avatarUrl ? (
                                                        <img
                                                            src={member.avatarUrl}
                                                            alt={member.userName}
                                                            className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-slate-200/80"
                                                        />
                                                    ) : (
                                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 font-medium text-slate-500 ring-1 ring-slate-200/80">
                                                            <UserRound size={17} className="text-slate-400" />
                                                        </div>
                                                    )}

                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-xs font-semibold text-slate-800 transition group-hover:text-indigo-600">
                                                            {member.userName}
                                                        </p>
                                                        <span
                                                            className={`text-[11px] font-medium ${
                                                                isMemberOwner
                                                                    ? "text-indigo-600 font-semibold"
                                                                    : "text-slate-500"
                                                            }`}
                                                        >
                                                            {isMemberOwner ? "Owner" : "Member"}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Action */}
                                                <button
                                                    type="button"
                                                    onClick={() => navigate(`/profile/${member.userId}`)}
                                                    className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-2xs transition-all hover:border-indigo-200 hover:bg-indigo-50/70 hover:text-indigo-600 cursor-pointer active:scale-95"
                                                >
                                                    Profile
                                                    <ArrowRight size={11} className="text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-indigo-600" />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Main Feed Container */}
                        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm lg:col-span-2">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                <div>
                                    <h2 className="text-base font-semibold text-slate-900">
                                        Community Feed
                                    </h2>
                                    <p className="mt-0.5 text-xs text-slate-500">
                                        Posts and discussions will appear here.
                                    </p>
                                </div>
                            </div>

                            {/* Feed Empty State Placeholder */}
                            <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 py-12 px-6 text-center">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-xs ring-1 ring-slate-200/60">
                                    <MessageSquare size={24} className="text-slate-400" />
                                </div>

                                <h3 className="mt-4 text-sm font-semibold text-slate-800">
                                    No posts yet
                                </h3>

                                <p className="mt-1.5 max-w-sm text-xs leading-normal text-slate-500">
                                    Community posts, discussions, comments, and likes will appear right here once created.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}