import React from "react";
import {
    Pencil,
    Trash2,
    Check,
    X,
} from "lucide-react";

import {
    useCommunityComments,
    useCreateCommunityComment,
    useUpdateCommunityComment,
    useDeleteCommunityComment,
} from "../../../assets/hooks/useCommunityData";

export default function CommunityComments({
    communityId,
    postId,
    currentUserId,
}) {
    const [content, setContent] = React.useState("");
    const [editingId, setEditingId] =
        React.useState(null);
    const [editingContent, setEditingContent] =
        React.useState("");

    const {
        data: comments = [],
        isLoading,
        isError,
    } = useCommunityComments(
        communityId,
        postId
    );

    const createComment =
        useCreateCommunityComment();

    const updateComment =
        useUpdateCommunityComment();

    const deleteComment =
        useDeleteCommunityComment();

    const handleCreate = () => {
        const trimmed = content.trim();

        if (!trimmed) {
            return;
        }

        createComment.mutate(
            {
                communityId,
                postId,
                content: trimmed,
            },
            {
                onSuccess: () => {
                    setContent("");
                },
            }
        );
    };

    const startEditing = (comment) => {
        setEditingId(comment.id);
        setEditingContent(comment.content);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditingContent("");
    };

    const handleUpdate = (commentId) => {
        const trimmed =
            editingContent.trim();

        if (!trimmed) {
            return;
        }

        updateComment.mutate(
            {
                communityId,
                postId,
                commentId,
                content: trimmed,
            },
            {
                onSuccess: cancelEditing,
            }
        );
    };

    const handleDelete = (commentId) => {
        const confirmed =
            window.confirm(
                "Delete this comment?"
            );

        if (!confirmed) {
            return;
        }

        deleteComment.mutate({
            communityId,
            postId,
            commentId,
        });
    };

    return (
        <div className="mt-4 border-t border-slate-100 pt-4">

            {/* Add comment */}
            <div className="flex gap-3">

                <div className="h-9 w-9 shrink-0 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-semibold text-indigo-600">
                    You
                </div>

                <div className="flex-1">

                    <textarea
                        value={content}
                        onChange={(e) =>
                            setContent(
                                e.target.value
                            )
                        }
                        maxLength={2000}
                        rows={2}
                        placeholder="Write a comment..."
                        className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />

                    <div className="mt-2 flex justify-end">

                        <button
                            type="button"
                            onClick={handleCreate}
                            disabled={
                                !content.trim() ||
                                createComment.isPending
                            }
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {createComment.isPending
                                ? "Posting..."
                                : "Comment"}
                        </button>

                    </div>
                </div>
            </div>

            {/* Comments */}
            <div className="mt-5 space-y-4">

                {isLoading && (
                    <p className="text-sm text-slate-500">
                        Loading comments...
                    </p>
                )}

                {isError && (
                    <p className="text-sm text-red-500">
                        Failed to load comments.
                    </p>
                )}

                {!isLoading &&
                    !isError &&
                    comments.length === 0 && (
                        <p className="text-center text-sm text-slate-400">
                            No comments yet. Be the first to comment.
                        </p>
                    )}

                {comments.map((comment) => {

                    const isAuthor =
                        Number(currentUserId) ===
                        Number(comment.authorId);

                    const isEditing =
                        editingId === comment.id;

                    return (
                        <div
                            key={comment.id}
                            className="flex gap-3"
                        >

                            {/* Avatar */}
                            {comment.authorAvatarUrl ? (
                                <img
                                    src={
                                        comment.authorAvatarUrl
                                    }
                                    alt={
                                        comment.authorName
                                    }
                                    className="h-9 w-9 shrink-0 rounded-full object-cover"
                                />
                            ) : (
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                                    {comment.authorName
                                        ?.charAt(0)
                                        ?.toUpperCase()}
                                </div>
                            )}

                            <div className="min-w-0 flex-1">

                                <div className="rounded-xl bg-slate-50 px-4 py-3">

                                    <div className="flex items-center justify-between gap-3">

                                        <div>
                                            <p className="text-sm font-semibold text-slate-800">
                                                {
                                                    comment.authorName
                                                }
                                            </p>

                                            <p className="text-xs text-slate-400">
                                                {new Date(
                                                    comment.createdAt
                                                ).toLocaleString()}
                                            </p>
                                        </div>

                                        {isAuthor &&
                                            !isEditing && (
                                                <div className="flex gap-1">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            startEditing(
                                                                comment
                                                            )
                                                        }
                                                        className="rounded-md p-1.5 text-slate-400 hover:bg-white hover:text-indigo-600"
                                                    >
                                                        <Pencil
                                                            size={
                                                                14
                                                            }
                                                        />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                comment.id
                                                            )
                                                        }
                                                        className="rounded-md p-1.5 text-slate-400 hover:bg-white hover:text-red-500"
                                                    >
                                                        <Trash2
                                                            size={
                                                                14
                                                            }
                                                        />
                                                    </button>

                                                </div>
                                            )}
                                    </div>

                                    {isEditing ? (
                                        <div className="mt-3">

                                            <textarea
                                                value={
                                                    editingContent
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    setEditingContent(
                                                        e.target
                                                            .value
                                                    )
                                                }
                                                maxLength={
                                                    2000
                                                }
                                                rows={3}
                                                className="w-full resize-none rounded-lg border border-slate-200 bg-white p-2 text-sm outline-none focus:border-indigo-500"
                                            />

                                            <div className="mt-2 flex justify-end gap-2">

                                                <button
                                                    type="button"
                                                    onClick={
                                                        cancelEditing
                                                    }
                                                    className="flex items-center gap-1 rounded-md px-2 py-1.5 text-xs text-slate-500 hover:bg-white"
                                                >
                                                    <X
                                                        size={
                                                            13
                                                        }
                                                    />
                                                    Cancel
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleUpdate(
                                                            comment.id
                                                        )
                                                    }
                                                    disabled={
                                                        updateComment.isPending
                                                    }
                                                    className="flex items-center gap-1 rounded-md bg-indigo-600 px-2 py-1.5 text-xs text-white disabled:opacity-50"
                                                >
                                                    <Check
                                                        size={
                                                            13
                                                        }
                                                    />
                                                    Save
                                                </button>

                                            </div>
                                        </div>
                                    ) : (
                                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                                            {
                                                comment.content
                                            }
                                        </p>
                                    )}

                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}