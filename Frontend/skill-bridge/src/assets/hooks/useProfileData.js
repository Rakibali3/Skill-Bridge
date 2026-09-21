import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../API/axios";

export function useProfileData() {
    return useQuery({
        queryKey: ["profile"],

        queryFn: async () => {
            const { data } = await api.get("/profile");
            return data;
        },
    });
}

export function useProfileById(userId) {
    return useQuery({
        queryKey: ["profile", userId],

        queryFn: async () => {
            const { data } = await api.get(`/profile/${userId}`);
            return data;
        },

        enabled: !!userId,
    });
}

export function useUpdateProfile() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: async (updatedData) => {

            const { data } =
                await api.put(
                    "/profile",
                    updatedData
                );

            return data;
        },

        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey: ["profile"],
            });

            queryClient.invalidateQueries({
                queryKey: ["matches"],
            });
        },
    });
}