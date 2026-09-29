import { useState } from "react";
import {
    Send,
    UserRound,
    Loader2,
} from "lucide-react";

import {
    useCreateCommunityPost,
} from "../../../assets/hooks/useCommunityData";

export default function CreateCommunityPost({
    communityId,
    avatarUrl,
    userName,
}) {
    const [content, setContent] = useState("");

    const createPost = useCreateCommunityPost();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const trimmedContent = content.trim();

        if (!trimmedContent) return;

        try {
            await createPost.mutateAsync({
                communityId,
                content: trimmedContent,
            });

            setContent("");
        } catch (error) {
            console.error(
                "Failed to create community post:",
                error
            );
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
            <div className="flex gap-3">

                {/* Avatar */}
                {avatarUrl ? (
                    <img
                        src={avatarUrl}
                        alt={userName || "You"}
                        className="h-11 w-11 shrink-0 rounded-full object-cover"
                    />
                ) : (
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100">
                        <UserRound
                            size={20}
                            className="text-slate-400"
                        />
                    </div>
                )}

                <div className="min-w-0 flex-1">
                    <textarea
                        value={content}
                        onChange={(event) =>
                            setContent(event.target.value)
                        }
                        placeholder="Share something with the community..."
                        maxLength={5000}
                        rows={4}
                        className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                    />

                    <div className="mt-3 flex items-center justify-between">

                        <span className="text-xs text-slate-400">
                            {content.length}/5000
                        </span>

                        <button
                            type="submit"
                            disabled={
                                createPost.isPending ||
                                !content.trim()
                            }
                            className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {createPost.isPending ? (
                                <>
                                    <Loader2
                                        size={16}
                                        className="animate-spin"
                                    />
                                    Posting...
                                </>
                            ) : (
                                <>
                                    <Send size={16} />
                                    Post
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}