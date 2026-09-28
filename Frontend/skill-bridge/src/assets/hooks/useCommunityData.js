import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import api from "../../API/axios";


// ============================================================
// GET ALL COMMUNITIES
// ============================================================

export function useCommunities() {
    return useQuery({
        queryKey: ["communities"],

        queryFn: async () => {
            const { data } = await api.get("/communities");
            return data;
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
    return useQuery({
        queryKey: ["community-members", communityId],

        queryFn: async () => {
            const { data } = await api.get(
                `/communities/${communityId}/members`
            );

            return data;
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