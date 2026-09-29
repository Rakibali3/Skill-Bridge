import React from "react";
import {
    Heart,
    MessageCircle,
    MoreHorizontal,
    Pencil,
    Trash2,
    Check,
    X,
} from "lucide-react";

import CommunityComments from "./CommunityComments";

import {
    useCommunityPostLike,
    useLikeCommunityPost,
    useUnlikeCommunityPost,
    useDeleteCommunityPost,
    useUpdateCommunityPost,
} from "../../../assets/hooks/useCommunityData";

export default function CommunityPostCard({
    post,
    communityId,
    currentUserId,
}) {
    const [showComments, setShowComments] =
        React.useState(false);

    const [showMenu, setShowMenu] =
        React.useState(false);

    const [isEditing, setIsEditing] =
        React.useState(false);

    const [editedContent, setEditedContent] =
        React.useState(post.content);

    // =========================================
    // LIKE
    // =========================================

    const { data: likeData } =
        useCommunityPostLike(
            communityId,
            post.id
        );

    const likeMutation =
        useLikeCommunityPost();

    const unlikeMutation =
        useUnlikeCommunityPost();

    // =========================================
    // POST
    // =========================================

    const deleteMutation =
        useDeleteCommunityPost();

    const updateMutation =
        useUpdateCommunityPost();

    const isAuthor =
        Number(currentUserId) ===
        Number(post.authorId);

    const liked =
        likeData?.likedByCurrentUser ?? false;

    const likeCount =
        likeData?.likeCount ?? 0;

    // =========================================
    // LIKE
    // =========================================

    const handleLike = () => {
        if (
            likeMutation.isPending ||
            unlikeMutation.isPending
        ) {
            return;
        }

        const payload = {
            communityId,
            postId: post.id,
        };

        if (liked) {
            unlikeMutation.mutate(payload);
        } else {
            likeMutation.mutate(payload);
        }
    };

    // =========================================
    // UPDATE POST
    // =========================================

    const handleUpdate = () => {
        const content =
            editedContent.trim();

        if (!content) {
            return;
        }

        updateMutation.mutate(
            {
                communityId,
                postId: post.id,
                content,
            },
            {
                onSuccess: () => {
                    setIsEditing(false);
                },
            }
        );
    };

    // =========================================
    // DELETE POST
    // =========================================

    const handleDelete = () => {
        const confirmed =
            window.confirm(
                "Are you sure you want to delete this post?"
            );

        if (!confirmed) {
            return;
        }

        deleteMutation.mutate({
            communityId,
            postId: post.id,
        });
    };

    // =========================================
    // TOGGLE COMMENTS
    // =========================================

    const handleComments = () => {
        setShowComments((previous) => !previous);
    };

    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            {/* =========================================
                HEADER
            ========================================= */}

            <div className="flex items-start justify-between">

                <div className="flex items-center gap-3">

                    {post.authorAvatarUrl ? (
                        <img
                            src={post.authorAvatarUrl}
                            alt={post.authorName}
                            className="h-10 w-10 rounded-full object-cover"
                        />
                    ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-600">
                            {post.authorName
                                ?.charAt(0)
                                ?.toUpperCase()}
                        </div>
                    )}

                    <div>
                        <p className="font-semibold text-slate-900">
                            {post.authorName}
                        </p>

                        <p className="text-xs text-slate-500">
                            {new Date(
                                post.createdAt
                            ).toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* =====================================
                    POST MENU
                ===================================== */}

                {isAuthor && (
                    <div className="relative">

                        <button
                            type="button"
                            onClick={() =>
                                setShowMenu(
                                    (previous) =>
                                        !previous
                                )
                            }
                            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                        >
                            <MoreHorizontal
                                size={20}
                            />
                        </button>

                        {showMenu && (
                            <div className="absolute right-0 z-30 mt-1 w-32 rounded-xl border border-slate-200 bg-white py-1 shadow-lg">

                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditing(true);
                                        setShowMenu(false);
                                    }}
                                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                >
                                    <Pencil size={15} />
                                    Edit
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowMenu(false);
                                        handleDelete();
                                    }}
                                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                    <Trash2 size={15} />
                                    Delete
                                </button>

                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* =========================================
                POST CONTENT
            ========================================= */}

            <div className="mt-4">

                {isEditing ? (
                    <div className="space-y-3">

                        <textarea
                            value={editedContent}
                            onChange={(e) =>
                                setEditedContent(
                                    e.target.value
                                )
                            }
                            maxLength={5000}
                            rows={5}
                            className="w-full resize-none rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />

                        <div className="flex justify-end gap-2">

                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditedContent(
                                        post.content
                                    );
                                }}
                                className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
                            >
                                <X size={16} />
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleUpdate}
                                disabled={
                                    updateMutation.isPending
                                }
                                className="flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                            >
                                <Check size={16} />

                                {updateMutation.isPending
                                    ? "Saving..."
                                    : "Save"}
                            </button>

                        </div>
                    </div>
                ) : (
                    <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                        {post.content}
                    </p>
                )}

            </div>

            {/* =========================================
                ACTIONS
            ========================================= */}

            {!isEditing && (
                <>
                    <div className="mt-5 flex items-center gap-6 border-t border-slate-100 pt-4">

                        {/* LIKE */}

                        <button
                            type="button"
                            onClick={handleLike}
                            disabled={
                                likeMutation.isPending ||
                                unlikeMutation.isPending
                            }
                            className={`flex items-center gap-2 text-sm font-medium ${liked
                                    ? "text-red-500"
                                    : "text-slate-500 hover:text-red-500"
                                }`}
                        >
                            <Heart
                                size={19}
                                fill={
                                    liked
                                        ? "currentColor"
                                        : "none"
                                }
                            />

                            <span>
                                {likeCount}{" "}
                                {likeCount === 1
                                    ? "Like"
                                    : "Likes"}
                            </span>
                        </button>

                        {/* COMMENTS */}

                        <button
                            type="button"
                            onClick={handleComments}
                            className={`flex items-center gap-2 text-sm font-medium ${showComments
                                    ? "text-indigo-600"
                                    : "text-slate-500 hover:text-indigo-600"
                                }`}
                        >
                            <MessageCircle
                                size={19}
                            />
                            <span>
                                {post.commentsCount}{" "}
                                {post.commentsCount === 1
                                    ? "Comment"
                                    : "Comments"}
                            </span>
                            
                        </button>

                    </div>

                    {/* =====================================
                        COMMENTS SECTION
                    ===================================== */}

                    {showComments && (
                        <div className="mt-2">
                            <CommunityComments
                                communityId={communityId}
                                postId={post.id}
                                currentUserId={currentUserId}
                            />
                        </div>
                    )}
                </>
            )}

        </article>
    );
}