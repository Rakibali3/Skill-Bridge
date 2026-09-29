import {
    useMutation,
    useQuery,
    useQueryClient,
    useInfiniteQuery,
} from "@tanstack/react-query";

import api from "../../API/axios";


// ============================================================
// GET ALL COMMUNITIES
// ============================================================

export function useCommunities() {
    return useInfiniteQuery({
        queryKey: ["communities"],

        queryFn: async ({ pageParam = 0 }) => {
            const { data } = await api.get("/communities", {
                params: {
                    page: pageParam,
                    size: 6,
                },
            });

            return data;
        },

        initialPageParam: 0,

        getNextPageParam: (lastPage) => {
            if (lastPage.last) {
                return undefined;
            }

            return lastPage.number + 1;
        },
    });
}

// ============================================================
// UPDATE COMMUNITY
// ============================================================

export function useUpdateCommunity() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            communityId,
            community,
        }) => {
            const { data } = await api.put(
                `/communities/${communityId}`,
                community
            );

            return data;
        },

        onSuccess: (data) => {
            const communityId = String(data.id);

            // Refresh communities list
            queryClient.invalidateQueries({
                queryKey: ["communities"],
            });

            // Refresh single community
            queryClient.invalidateQueries({
                queryKey: [
                    "communities",
                    communityId,
                ],
            });

            // Also support the "community" query key
            queryClient.invalidateQueries({
                queryKey: [
                    "community",
                    communityId,
                ],
            });
        },
    });
}


// ============================================================
// DELETE COMMUNITY
// ============================================================

export function useDeleteCommunity() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (communityId) => {
            await api.delete(
                `/communities/${communityId}`
            );

            return communityId;
        },

        onSuccess: (communityId) => {
            communityId = String(communityId);

            // Refresh community list
            queryClient.invalidateQueries({
                queryKey: ["communities"],
            });

            // Remove deleted community's individual cache
            queryClient.removeQueries({
                queryKey: [
                    "communities",
                    communityId,
                ],
            });

            queryClient.removeQueries({
                queryKey: [
                    "community",
                    communityId,
                ],
            });

            // Remove members cache
            queryClient.removeQueries({
                queryKey: [
                    "community-members",
                    communityId,
                ],
            });

            // Remove posts cache
            queryClient.removeQueries({
                queryKey: [
                    "community-posts",
                    communityId,
                ],
            });
        },
    });
}


// ============================================================
// GET SINGLE COMMUNITY
// ============================================================

export function useCommunity(communityId) {
    return useQuery({
        queryKey: ["communities", communityId],

        queryFn: async () => {
            const { data } = await api.get(
                `/communities/${communityId}`
            );

            return data;
        },

        enabled: Boolean(communityId),
    });
}


// ============================================================
// GET COMMUNITY MEMBERS
// ============================================================

export function useCommunityMembers(communityId) {
    return useInfiniteQuery({
        queryKey: [
            "community-members",
            String(communityId),
        ],

        queryFn: async ({ pageParam = 0 }) => {
            const { data } = await api.get(
                `/communities/${communityId}/members`,
                {
                    params: {
                        page: pageParam,
                        size: 10,
                    },
                }
            );

            return data;
        },

        initialPageParam: 0,

        getNextPageParam: (lastPage) => {
            if (lastPage.last) {
                return undefined;
            }

            return lastPage.number + 1;
        },

        enabled: Boolean(communityId),
    });
}


// ============================================================
// CREATE COMMUNITY
// ============================================================

export function useCreateCommunity() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (communityData) => {
            const { data } = await api.post(
                "/communities",
                communityData
            );

            return data;
        },

        onSuccess: () => {
            // Refresh community list
            queryClient.invalidateQueries({
                queryKey: ["communities"],
            });
        },
    });
}


// ============================================================
// JOIN COMMUNITY
// ============================================================

export function useJoinCommunity() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (communityId) => {
            const { data } = await api.post(
                `/communities/${communityId}/join`
            );

            return data;
        },

        onSuccess: (data) => {
            const communityId = String(data.id);

            queryClient.invalidateQueries({
                queryKey: ["communities"],
            });

            queryClient.setQueryData(
                ["communities", communityId],
                data
            );

            queryClient.invalidateQueries({
                queryKey: ["community-members", communityId],
            });
        },
    });
}


// ============================================================
// LEAVE COMMUNITY
// ============================================================

export function useLeaveCommunity() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (communityId) => {
            await api.delete(
                `/communities/${communityId}/leave`
            );

            return communityId;
        },

        onSuccess: (communityId) => {
            communityId = String(communityId);

            queryClient.invalidateQueries({
                queryKey: ["communities"],
            });

            queryClient.invalidateQueries({
                queryKey: ["communities", communityId],
            });

            queryClient.removeQueries({
                queryKey: ["community-members", communityId],
            });
        },
    });
}

// ============================================================
// COMMUNITY POSTS
// ============================================================

export function useCommunityPosts(communityId) {
    return useInfiniteQuery({
        queryKey: ["community-posts", String(communityId)],

        queryFn: async ({ pageParam = 0 }) => {
            const { data } = await api.get(
                `/communities/${communityId}/posts`,
                {
                    params: {
                        page: pageParam,
                        size: 10,
                    },
                }
            );

            return data;
        },

        initialPageParam: 0,

        getNextPageParam: (lastPage) => {
            if (lastPage.last) {
                return undefined;
            }

            return lastPage.number + 1;
        },

        enabled: Boolean(communityId),
    });
}

// ============================================================
// CREATE POST
// ============================================================

export function useCreateCommunityPost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ communityId, content }) => {
            const { data } = await api.post(
                `/communities/${communityId}/posts`,
                {
                    content,
                }
            );

            return data;
        },

        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [
                    "community-posts",
                    String(data.communityId),
                ],
            });
        },
    });
}


// ============================================================
// UPDATE POST
// ============================================================

export function useUpdateCommunityPost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            communityId,
            postId,
            content,
        }) => {
            const { data } = await api.put(
                `/communities/${communityId}/posts/${postId}`,
                {
                    content,
                }
            );

            return data;
        },

        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [
                    "community-posts",
                    String(data.communityId),
                ],
            });
        },
    });
}


// ============================================================
// DELETE POST
// ============================================================

export function useDeleteCommunityPost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            communityId,
            postId,
        }) => {
            await api.delete(
                `/communities/${communityId}/posts/${postId}`
            );

            return communityId;
        },

        onSuccess: (communityId) => {
            queryClient.invalidateQueries({
                queryKey: [
                    "community-posts",
                    String(communityId),
                ],
            });
        },
    });
}

export function useLikeCommunityPost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ communityId, postId }) => {
            const { data } = await api.post(
                `/communities/${communityId}/posts/${postId}/like`
            );

            return data;
        },

        onSuccess: (data) => {
            queryClient.setQueryData(
                ["community-post-like", String(data.postId)],
                data
            );
        },
    });
}

export function useUnlikeCommunityPost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ communityId, postId }) => {
            const { data } = await api.delete(
                `/communities/${communityId}/posts/${postId}/like`
            );

            return data;
        },

        onSuccess: (data) => {
            queryClient.setQueryData(
                ["community-post-like", String(data.postId)],
                data
            );
        },
    });
}

export function useCommunityPostLike(
    communityId,
    postId
) {
    return useQuery({
        queryKey: [
            "community-post-like",
            String(postId),
        ],

        queryFn: async () => {
            const { data } = await api.get(
                `/communities/${communityId}/posts/${postId}/like`
            );

            return data;
        },

        enabled:
            Boolean(communityId) &&
            Boolean(postId),
    });
}


export function useCommunityComments(
    communityId,
    postId
) {
    return useQuery({
        queryKey: [
            "community-comments",
            String(postId),
        ],

        queryFn: async () => {
            const { data } = await api.get(
                `/communities/${communityId}/posts/${postId}/comments`
            );

            return data;
        },

        enabled:
            Boolean(communityId) &&
            Boolean(postId),
    });
}

export function useCreateCommunityComment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            communityId,
            postId,
            content,
        }) => {
            const { data } = await api.post(
                `/communities/${communityId}/posts/${postId}/comments`,
                { content }
            );

            return data;
        },

        onSuccess: (_, variables) => {
            const { communityId, postId } = variables;

            // Refresh comments
            queryClient.invalidateQueries({
                queryKey: [
                    "community-comments",
                    String(postId),
                ],
            });

            // Refresh posts so commentsCount updates
            queryClient.invalidateQueries({
                queryKey: [
                    "community-posts",
                    String(communityId),
                ],
            });
        },
    });
}

export function useUpdateCommunityComment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            communityId,
            postId,
            commentId,
            content,
        }) => {

            const { data } = await api.put(
                `/communities/${communityId}/posts/${postId}/comments/${commentId}`,
                { content }
            );

            return data;
        },

        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [
                    "community-comments",
                    String(data.postId),
                ],
            });
        },
    });
}

export function useDeleteCommunityComment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            communityId,
            postId,
            commentId,
        }) => {
            await api.delete(
                `/communities/${communityId}/posts/${postId}/comments/${commentId}`
            );

            return {
                postId,
                communityId,
            };
        },

        onSuccess: ({ postId, communityId }) => {
            // Refresh comments
            queryClient.invalidateQueries({
                queryKey: [
                    "community-comments",
                    String(postId),
                ],
            });

            // Refresh posts so commentsCount updates
            queryClient.invalidateQueries({
                queryKey: [
                    "community-posts",
                    String(communityId),
                ],
            });
        },
    });
}