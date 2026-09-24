import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import api from "../../API/axios";


// ===============================
// GET TASKS FOR EXCHANGE
// ===============================
export function useExchangeTasks(exchangeId) {
    return useQuery({
        queryKey: ["tasks", exchangeId],
        queryFn: async () => {
            const { data } = await api.get(
                `/tasks/exchange/${exchangeId}`
            );

            return data;
        },
        enabled: Boolean(exchangeId),
    });
}


// ===============================
// CREATE TASK
// ===============================
export function useCreateTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (taskData) => {
            const { data } = await api.post(
                "/tasks",
                taskData
            );

            return data;
        },

        onSuccess: async (data) => {
            // Immediately refetch tasks
            await queryClient.refetchQueries({
                queryKey: ["tasks", data.exchangeId],
                type: "active",
            });
        },
    });
}


// ===============================
// SUBMIT TASK
// ===============================
export function useSubmitTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ taskId, submissionData }) => {
            const { data } = await api.post(
                `/tasks/${taskId}/submit`,
                submissionData
            );

            return data;
        },

        onSuccess: async (data) => {
            // Immediately fetch fresh task data
            await queryClient.refetchQueries({
                queryKey: ["tasks", data.exchangeId],
                type: "active",
            });
        },
    });
}


// ===============================
// COMPLETE TASK
// ===============================
export function useCompleteTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (taskId) => {
            const { data } = await api.post(
                `/tasks/${taskId}/complete`
            );

            return data;
        },

        onSuccess: async (data) => {
            // Immediately fetch fresh task data
            await queryClient.refetchQueries({
                queryKey: ["tasks", data.exchangeId],
                type: "active",
            });
        },
    });
}