import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../API/axios";

export function useLearningPaths() {
    return useQuery({
        queryKey: ["learning-paths"],
        queryFn: async () => {
            const response = await api.get("/learning-paths");
            return response.data;
        },
    });
}

export function useMyLearningPath(pathId) {
    return useQuery({
        queryKey: ["my-learning-path", Number(pathId)],
        queryFn: async () => {
            const response = await api.get(
                `/learning-paths/${pathId}/me`
            );
            return response.data;
        },
        enabled: !!pathId,
        refetchOnWindowFocus: true,
    });
}

export function useStartLearningPath() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (pathId) => {
            const response = await api.post(
                `/learning-paths/${pathId}/start`
            );
            return response.data;
        },

        onSuccess: async (data, pathId) => {
            const id = Number(pathId);

            queryClient.setQueryData(
                ["my-learning-path", id],
                data
            );

            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ["my-learning-path", id],
                    exact: true,
                }),
                queryClient.invalidateQueries({
                    queryKey: ["learning-paths"],
                }),
            ]);
        },
    });


}

export function useStartLearningTopic() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ pathId, topicId }) => {
            const response = await api.post(
                `/learning-paths/${pathId}/topics/${topicId}/start`
            );
            return response.data;
        },

        onSuccess: async (data, variables) => {
            const id = Number(variables.pathId);

            queryClient.setQueryData(
                ["my-learning-path", id],
                data
            );

            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ["my-learning-path", id],
                    exact: true,
                }),
                queryClient.invalidateQueries({
                    queryKey: ["learning-paths"],
                }),
            ]);
        },
    });

}

export function useCompleteLearningTopic() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ pathId, topicId }) => {
            const response = await api.post(
                `/learning-paths/${pathId}/topics/${topicId}/complete`
            );
            return response.data;
        },

        onSuccess: async (data, variables) => {
            const id = Number(variables.pathId);

            queryClient.setQueryData(
                ["my-learning-path", id],
                data
            );

            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ["my-learning-path", id],
                    exact: true,
                }),
                queryClient.invalidateQueries({
                    queryKey: ["learning-paths"],
                }),
            ]);
        },
    });

}
