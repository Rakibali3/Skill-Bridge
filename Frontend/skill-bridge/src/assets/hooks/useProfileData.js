import {
    useQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import api from "../../API/axios";

export function useAuthentication() {
    return useQuery({
        queryKey: ["authentication"],

        queryFn: async () => {
            const { data } = await api.get("/authenticated");
            return data;
        },
        retry: false,

        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    });
}

export function useProfileData() {
    return useQuery({
        queryKey: ["profile"],

        queryFn: async () => {
            const { data } = await api.get("/profile");
            return data;
        },

        retry: false,

        refetchOnWindowFocus: false,
    });
}


export function useProfileById(userId) {
    return useQuery({
        queryKey: ["profile", userId],

        queryFn: async () => {
            const { data } = await api.get(`/profile/${userId}`);
            return data;
        },

        enabled: Boolean(userId),

        retry: false,
    });
}


export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (updatedData) => {
            const { data } = await api.put(
                "/profile",
                updatedData
            );

            return data;
        },

        onSuccess: (data) => {
            if (data) {
                queryClient.setQueryData(
                    ["profile"],
                    data
                );
            }

            queryClient.invalidateQueries({
                queryKey: ["matches"],
            });
        },
    });
}