import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import api from "../../../API/axios";

/*
|--------------------------------------------------------------------------
| Get all skills
|--------------------------------------------------------------------------
*/

export function useAdminSkills() {
    return useQuery({
        queryKey: ["admin-skills"],
        queryFn: async () => {
            const { data } = await api.get("/admin/skills");
            return data;
        },
    });
}

/*
|--------------------------------------------------------------------------
| Create skill
|--------------------------------------------------------------------------
*/

export function useCreateAdminSkill() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (skillData) => {
            const { data } = await api.post(
                "/admin/skills",
                skillData
            );

            return data;
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin-skills"],
            });
        },
    });
}

/*
|--------------------------------------------------------------------------
| Update skill
|--------------------------------------------------------------------------
*/

export function useUpdateAdminSkill() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, skillData }) => {
            const { data } = await api.put(
                `/admin/skills/${id}`,
                skillData
            );

            return data;
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin-skills"],
            });
        },
    });
}

/*
|--------------------------------------------------------------------------
| Deactivate skill
|--------------------------------------------------------------------------
*/

export function useDeactivateAdminSkill() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id) => {
            const { data } = await api.delete(
                `/admin/skills/${id}`
            );

            return data;
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin-skills"],
            });
        },
    });
}

/*
|--------------------------------------------------------------------------
| Activate skill
|--------------------------------------------------------------------------
*/

export function useActivateAdminSkill() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id) => {
            const { data } = await api.patch(
                `/admin/skills/${id}/activate`
            );

            return data;
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin-skills"],
            });
        },
    });
}