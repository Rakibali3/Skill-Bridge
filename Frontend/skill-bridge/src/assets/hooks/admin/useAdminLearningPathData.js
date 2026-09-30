import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import api from "../../../API/axios";

/*
|--------------------------------------------------------------------------
| Get all master skills
|--------------------------------------------------------------------------
*/

export function useAdminMasterSkills() {
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
| Get all learning paths
|--------------------------------------------------------------------------
*/

export function useAdminLearningPaths() {
    return useQuery({
        queryKey: ["admin-learning-paths"],
        queryFn: async () => {
            const { data } = await api.get("/admin/learning-paths");
            return data;
        },
    });
}

/*
|--------------------------------------------------------------------------
| Get one learning path
|--------------------------------------------------------------------------
*/

export function useAdminLearningPath(pathId) {
    return useQuery({
        queryKey: ["admin-learning-path", String(pathId)],
        queryFn: async () => {
            const { data } = await api.get(
                `/admin/learning-paths/${pathId}`
            );

            return data;
        },
        enabled: Boolean(pathId),
    });
}

/*
|--------------------------------------------------------------------------
| Get topics
|--------------------------------------------------------------------------
*/

export function useAdminLearningPathTopics(pathId) {
    return useQuery({
        queryKey: [
            "admin-learning-path-topics",
            String(pathId),
        ],
        queryFn: async () => {
            const { data } = await api.get(
                `/admin/learning-paths/${pathId}/topics`
            );

            return data;
        },
        enabled: Boolean(pathId),
    });
}

/*
|--------------------------------------------------------------------------
| Create learning path
|--------------------------------------------------------------------------
*/

export function useCreateAdminLearningPath() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (pathData) => {
            const { data } = await api.post(
                "/admin/learning-paths",
                pathData
            );

            return data;
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin-learning-paths"],
            });
        },
    });
}

/*
|--------------------------------------------------------------------------
| Update learning path
|--------------------------------------------------------------------------
*/

export function useUpdateAdminLearningPath() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, pathData }) => {
            const { data } = await api.put(
                `/admin/learning-paths/${id}`,
                pathData
            );

            return data;
        },

        onSuccess: (data) => {
            const pathId = String(data.id);

            queryClient.invalidateQueries({
                queryKey: ["admin-learning-paths"],
            });

            queryClient.invalidateQueries({
                queryKey: ["admin-learning-path", pathId],
            });
        },
    });
}

/*
|--------------------------------------------------------------------------
| Deactivate learning path
|--------------------------------------------------------------------------
*/

export function useDeactivateAdminLearningPath() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id) => {
            const { data } = await api.delete(
                `/admin/learning-paths/${id}`
            );

            return data;
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin-learning-paths"],
            });
        },
    });
}

/*
|--------------------------------------------------------------------------
| Activate learning path
|--------------------------------------------------------------------------
*/

export function useActivateAdminLearningPath() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id) => {
            const { data } = await api.patch(
                `/admin/learning-paths/${id}/activate`
            );

            return data;
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin-learning-paths"],
            });
        },
    });
}

/*
|--------------------------------------------------------------------------
| Create topic
|--------------------------------------------------------------------------
*/

export function useCreateAdminLearningPathTopic() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ pathId, topicData }) => {
            const { data } = await api.post(
                `/admin/learning-paths/${pathId}/topics`,
                topicData
            );

            return data;
        },

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: [
                    "admin-learning-path-topics",
                    String(variables.pathId),
                ],
            });
        },
    });
}

/*
|--------------------------------------------------------------------------
| Update topic
|--------------------------------------------------------------------------
*/

export function useUpdateAdminLearningPathTopic() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            pathId,
            topicId,
            topicData,
        }) => {
            const { data } = await api.put(
                `/admin/learning-paths/${pathId}/topics/${topicId}`,
                topicData
            );

            return data;
        },

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: [
                    "admin-learning-path-topics",
                    String(variables.pathId),
                ],
            });
        },
    });
}

/*
|--------------------------------------------------------------------------
| Deactivate topic
|--------------------------------------------------------------------------
*/

export function useDeactivateAdminLearningPathTopic() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ pathId, topicId }) => {
            const { data } = await api.delete(
                `/admin/learning-paths/${pathId}/topics/${topicId}`
            );

            return data;
        },

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: [
                    "admin-learning-path-topics",
                    String(variables.pathId),
                ],
            });
        },
    });
}

/*
|--------------------------------------------------------------------------
| Activate topic
|--------------------------------------------------------------------------
*/

export function useActivateAdminLearningPathTopic() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ pathId, topicId }) => {
            const { data } = await api.patch(
                `/admin/learning-paths/${pathId}/topics/${topicId}/activate`
            );

            return data;
        },

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: [
                    "admin-learning-path-topics",
                    String(variables.pathId),
                ],
            });
        },
    });
}